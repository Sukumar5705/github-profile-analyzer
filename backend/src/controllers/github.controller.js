import { analyzeProfile as runAnalysis } from "../services/analysis.service.js";

import profileRepo from "../repositories/profile.repository.js";
import skillRepo from "../repositories/skill.repository.js";
import analysisRepo from "../repositories/analysis.repository.js";
import repositoryRepo from "../repositories/repository.repository.js";

import { mapProfileAnalysisResponse } from "../mappers/profileAnalysis.mapper.js";

import logger from "../utils/logger.js";

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

        logger.info(
          `[Cache] Returning stored analysis for ${username}`
        );

        const [skills, analysis, repositories] =
          await Promise.all([
            skillRepo.findByProfileId(existingProfile.id),
            analysisRepo.findByProfileId(existingProfile.id),
            repositoryRepo.findByProfileId(existingProfile.id),
          ]);

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
    }

    const result = await runAnalysis(username);

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
};