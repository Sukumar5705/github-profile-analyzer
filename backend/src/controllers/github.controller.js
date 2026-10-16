import { analyzeProfile as runAnalysis } from "../services/analysis.service.js";

import profileRepo from "../repositories/profile.repository.js";
import skillRepo from "../repositories/skill.repository.js";
import analysisRepo from "../repositories/analysis.repository.js";
import repositoryRepo from "../repositories/repository.repository.js";

import { mapProfileAnalysisResponse } from "../mappers/profileAnalysis.mapper.js";

import logger from "../utils/logger.js";
import { getProgress } from "../utils/analysisProgress.js";

// Hard cap on the whole analysis pipeline. Without this, a stalled GitHub
// call or a Gemini call that exhausts all model fallbacks (up to 3 × 60s)
// can leave the request hanging indefinitely — the client has `timeout: 0`
// on purpose, so it relies entirely on the SERVER guaranteeing a response
// within a bounded time. We use a real AbortController (not just a
// Promise.race) so the in-flight GitHub/Gemini requests are actually
// cancelled — see the `signal` threaded through analysis.service.js,
// githubData.service.js, github.service.js, llmAnalysis.service.js and
// gemini.service.js.
const ANALYSIS_TIMEOUT_MS = 150_000; // 2.5 min

// ─────────────────────────────────────────────────────────────
// POST /api/github/analyze/:username
// ─────────────────────────────────────────────────────────────
const analyzeProfile = async (req, res, next) => {
  try {

    const { username } = req.params;
    const refresh = req.query.refresh === "true";

    if (!refresh) {

      const existingProfile =
        await profileRepo.findByUsername(username);

      if (existingProfile) {

        const [skills, analysis, repositories] =
          await Promise.all([
            skillRepo.findByProfileId(existingProfile.id),
            analysisRepo.findByProfileId(existingProfile.id),
            repositoryRepo.findByProfileId(existingProfile.id),
          ]);

        // IMPORTANT: a profile row can exist without an analysis row —
        // fetchAndPersist() (GitHub fetch) runs and commits BEFORE the AI
        // evaluation step. If a prior run failed or timed out in between
        // those two, `analysis` here is null. Serving that as "cached"
        // used to return career score / developer type / everything as
        // null (see mapProfileAnalysisResponse's no-analysis branch), so
        // the dashboard would load successfully with essentially nothing
        // on it — forever, since every future request kept re-serving
        // the same incomplete row. Only short-circuit when we actually
        // have a completed analysis; otherwise fall through and run the
        // pipeline for real.
        if (analysis) {

          logger.info(
            `[Cache] Returning stored analysis for ${username}`
          );

          const data = mapProfileAnalysisResponse({
            profile: existingProfile,
            skills,
            analysis,
            repositories,
          });

          return res.status(200).json({
            success: true,
            cached: true,
            message: "Returning cached analysis",
            data,
          });
        }

        logger.info(
          `[Cache] Profile row exists for ${username} but no analysis was found — re-running the pipeline instead of serving an incomplete result.`
        );
      }
    }

    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, ANALYSIS_TIMEOUT_MS);

    let result;
    try {
      result = await runAnalysis(username, controller.signal);
    } catch (err) {
      if (timedOut) {
        const timeoutErr = new Error(
          `Analysis timeout: the pipeline did not finish within ${ANALYSIS_TIMEOUT_MS / 1000}s. The GitHub or AI service may be slow — please retry.`
        );
        timeoutErr.statusCode = 504;
        throw timeoutErr;
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }

    return res.status(200).json({
      success: true,
      cached: false,
      message: "Profile analyzed successfully",
      data: result,
    });

  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/github/analyze/:username/progress
// Live backend stage, polled by the loading screen.
// ─────────────────────────────────────────────────────────────
const getAnalysisProgress = (req, res) => {
  const { username } = req.params;
  const progress = getProgress(username);

  if (!progress) {
    // Not started yet, already finished & swept, or served straight
    // from cache (no pipeline ran, so there's nothing to report).
    return res.status(200).json({
      success: true,
      data: { stage: null, message: null, done: false, error: null },
    });
  }

  return res.status(200).json({ success: true, data: progress });
};

// ─────────────────────────────────────────────────────────────
// GET /api/github/profiles
// ─────────────────────────────────────────────────────────────

const getAllProfiles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const { profiles, total } = await profileRepo.findAll(page, limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProfiles: total,
      count: profiles.length,
      data: profiles,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/github/profiles/:username
// ─────────────────────────────────────────────────────────────

const getSingleProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const profile = await profileRepo.findByUsername(username);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const [skills, analysis, repositories] = await Promise.all([
      skillRepo.findByProfileId(profile.id),
      analysisRepo.findByProfileId(profile.id),
      repositoryRepo.findByProfileId(profile.id),
    ]);

    const data = mapProfileAnalysisResponse({
      profile,
      skills,
      analysis,
      repositories,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/github/search?username=xxx
// ─────────────────────────────────────────────────────────────

const searchProfiles = async (req, res, next) => {
  try {
    const { username } = req.query;

    const profiles = await profileRepo.search(username);

    if (!profiles.length) {
      return res.status(404).json({
        success: false,
        message: "No matching profiles found",
      });
    }

    return res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/github/profiles/:username
// ─────────────────────────────────────────────────────────────

const deleteProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const deleted = await profileRepo.delete(username);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export {
  analyzeProfile,
  getAllProfiles,
  getSingleProfile,
  searchProfiles,
  deleteProfile,
  getAnalysisProgress,
};