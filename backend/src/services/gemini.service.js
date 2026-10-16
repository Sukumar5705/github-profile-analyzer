import axios from 'axios';
import { jsonrepair } from 'jsonrepair';
import logger from '../utils/logger.js';
import { GEMINI_RESPONSE_SCHEMA } from '../validation/analysisResponseSchema.js';

const DEFAULT_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

const geminiClient = axios.create({ timeout: 60000 });

/**
 * Parses raw LLM text into a JSON object by stripping fences, using jsonrepair if needed.
 * @param {string} raw
 * @returns {object}
 */
export function parseJSON(raw) {
  if (!raw || typeof raw !== 'string') {
    throw new Error('Empty response from LLM');
  }

  const clean = raw.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');

  let candidate = clean;
  if (start !== -1 && end !== -1 && end >= start) {
    candidate = clean.slice(start, end + 1);
  }

  // Attempt 1: Native JSON.parse
  try {
    return JSON.parse(candidate);
  } catch (err1) {
    // Attempt 2: Auto-repair unclosed quotes, braces, trailing commas with jsonrepair
    try {
      const repaired = jsonrepair(candidate);
      const parsed = JSON.parse(repaired);
      logger.info('[Gemini] JSON parse succeeded via jsonrepair');
      return parsed;
    } catch (err2) {
      logger.error(`[Gemini] JSON parse and repair failed (len: ${raw.length}): ${err2.message}`);
      logger.error(`[Gemini] Raw tail:\n${raw.slice(-600)}`);
      throw err2;
    }
  }
}

/**
 * Sends a prompt to the Gemini API with structured output schema support.
 * @param {string} prompt
 * @param {object} [responseSchema=GEMINI_RESPONSE_SCHEMA]
 * @param {AbortSignal} [signal]
 * @returns {Promise<object>} parsed JSON from Gemini
 */
export async function callGemini(prompt, responseSchema = GEMINI_RESPONSE_SCHEMA, signal) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  const configuredModel = process.env.GEMINI_MODEL;
  const modelsToTry = Array.from(new Set([configuredModel, ...FALLBACK_MODELS].filter(Boolean)));

  let lastError = null;

  for (const model of modelsToTry) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const generationConfig = {
      temperature: 0.2,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json'
    };

    if (responseSchema) {
      generationConfig.responseSchema = responseSchema;
    }

    try {
      logger.info(`[Gemini] Calling model ${model} with structured response schema...`);
      const { data } = await geminiClient.post(
        endpoint,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig
        },
        { signal }
      );

      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return parseJSON(raw);
    } catch (err) {
      lastError = err;

      // Cancellation (our controller-level hard timeout aborted this
      // request) — stop the model-fallback loop immediately instead of
      // burning through the remaining models one by one.
      if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError' || signal?.aborted) {
        throw err;
      }

      const status = err.response?.status;
      logger.warn(`[Gemini] Model ${model} failed with status ${status || err.message}`);

      // If schema not supported (400) on a particular model, retry once without responseSchema
      if (status === 400 && generationConfig.responseSchema) {
        try {
          logger.info(`[Gemini] Retrying model ${model} without responseSchema parameter...`);
          const { data } = await geminiClient.post(
            endpoint,
            {
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 8192,
                responseMimeType: 'application/json'
              }
            },
            { signal }
          );
          const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          return parseJSON(raw);
        } catch (innerErr) {
          lastError = innerErr;
        }
      }

      if (status === 404 || status === 400 || status === 429) {
        continue;
      }

      throw err;
    }
  }

  throw lastError || new Error('All Gemini model endpoints failed');
}

export default {
  callGemini,
  parseJSON
};