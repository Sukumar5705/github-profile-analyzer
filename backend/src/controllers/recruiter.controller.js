/**
 * recruiter.controller.js
 *
 * Exposes AI Recruiter & Hiring Intelligence endpoints:
 * - GET /api/recruiter/:username (Complete recruiter evaluation snapshot)
 * - GET /api/recruiter/:username/history (Career score evolution history)
 */

import profileRepo from '../repositories/profile.repository.js';
import skillRepo from '../repositories/skill.repository.js';
import analysisRepo from '../repositories/analysis.repository.js';
import repositoryRepo from '../repositories/repository.repository.js';
import { analyzeProfile } from '../services/analysis.service.js';
import { mapProfileAnalysisResponse } from '../mappers/profileAnalysis.mapper.js';
import logger from '../utils/logger.js';

/**
 * GET /api/recruiter/:username
 * Returns a comprehensive AI Recruiter snapshot of a candidate.
 * Auto-analyzes if not yet evaluated in the database.
 */
const getRecruiterView = async (req, res, next) => {
  try {
    const { username } = req.params;
    logger.info(`[RecruiterController] Fetching recruiter view for: ${username}`);

    let profile = await profileRepo.findByUsername(username);

    // Auto-analyze if not yet in DB
    if (!profile) {
      const result = await analyzeProfile(username);
      return res.status(200).json({
        success: true,
        message: 'Profile analyzed and recruiter evaluation generated',
        data: result
      });
    }

    const [skills, analysis, repositories] = await Promise.all([
      skillRepo.findByProfileId(profile.id),
      analysisRepo.findByProfileId(profile.id),
      repositoryRepo.findByProfileId(profile.id)
    ]);

    if (!analysis) {
      const result = await analyzeProfile(username);
      return res.status(200).json({
        success: true,
        data: result
      });
    }

    const data = mapProfileAnalysisResponse({
      profile,
      skills,
      analysis,
      repositories
    });

    res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/recruiter/:username/history
 * Returns career score history for trend visualization.
 */
const getScoreHistory = async (req, res, next) => {
  try {
    const { username } = req.params;
    const profile = await profileRepo.findByUsername(username);
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });

    const history = await analysisRepo.getHistory(profile.id, 30);
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};

export { getRecruiterView, getScoreHistory };
export default { getRecruiterView, getScoreHistory };
