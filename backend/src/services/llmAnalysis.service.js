/**
 * llmAnalysis.service.js
 *
 * Phase 5 — AI Recruiter LLM Service
 * Invokes Gemini with the AI Recruiter prompt and structured output schema.
 * Validates output and performs self-correcting retry if schema errors arise.
 */

import { buildMasterAnalysisPrompt } from '../prompts/masterAnalysis.prompt.js';
import { callGemini } from './gemini.service.js';
import { validateAndSanitizeAnalysis, AnalysisValidationError } from '../validation/analysisValidator.js';
import logger from '../utils/logger.js';

/**
 * Runs a single unified AI Recruiter analysis on the portfolio context.
 * @param {object} portfolioContext - Portfolio context JSON from portfolioContext.service.js
 * @returns {Promise<object>} Validated AI evaluation result
 */
export async function runAnalysis(portfolioContext) {
  const username = portfolioContext?.profile?.username || 'developer';
  logger.info(`[llmAnalysis.service] Starting AI Recruiter evaluation for ${username}`);

  const prompt = buildMasterAnalysisPrompt(portfolioContext);

  try {
    const rawResult = await callGemini(prompt);
    const validated = validateAndSanitizeAnalysis(rawResult, portfolioContext);
    logger.info(`[llmAnalysis.service] Successfully evaluated ${username} — Score: ${validated.careerScore}, Decision: ${validated.hireDecision}, Role: ${validated.recommendedRole}`);

    return validated;
  } catch (err) {
    if (err instanceof AnalysisValidationError) {
      logger.warn(`[llmAnalysis.service] Validation failed for ${username}: ${err.message}. Retrying with corrective prompt...`);

      const retryPrompt = `${prompt}\n\nIMPORTANT CORRECTION: Your previous output had schema validation errors:\n${(err.details || [err.message]).join('\n')}\nPlease ensure the response strictly conforms to the JSON structure provided.`;

      const retryRaw = await callGemini(retryPrompt);
      const validatedRetry = validateAndSanitizeAnalysis(retryRaw, portfolioContext);
      logger.info(`[llmAnalysis.service] Successfully validated analysis on retry for ${username}`);
      return validatedRetry;
    }

    logger.error(`[llmAnalysis.service] AI Recruiter evaluation failed for ${username}: ${err.message}`);
    throw err;
  }
}

export default {
  runAnalysis
};
