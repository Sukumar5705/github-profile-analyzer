/**
 * analysis.service.js
 *
 * Phase 1 & 4 Orchestrator:
 * GitHub API Data Fetch & Persist
 *   → Repository Intelligence & Portfolio Context (portfolioContext.service.js)
 *   → Single AI Recruiter Evaluation (llmAnalysis.service.js)
 *   → Persistence (analysis.repository.js with analysis_json JSONB)
 */

import { fetchAndPersist } from './githubData.service.js';
import { buildPortfolioContext } from './portfolioContext.service.js';
import { runAnalysis } from './llmAnalysis.service.js';
import skillRepo from '../repositories/skill.repository.js';
import analysisRepo from '../repositories/analysis.repository.js';
import logger from '../utils/logger.js';

/**
 * Run the full AI Recruiter analysis pipeline for a GitHub username.
 * @param {string} username
 * @returns {Promise<object>} Full AI Hiring Intelligence evaluation
 */
const analyzeProfile = async (username) => {
  logger.info(`[Pipeline] Starting AI Recruiter Hiring Intelligence Pipeline for: ${username}`);

  // Step 1: GitHub raw data → DB
  const { profileId, profileData, githubRepos } = await fetchAndPersist(username);

  // Step 2: Build objective Portfolio Context (No quality calculation, only facts)
  const portfolioContext = buildPortfolioContext(profileData, githubRepos);

  // Step 3: Run single unified AI Recruiter evaluation
  const aiEvaluation = await runAnalysis(portfolioContext);

  // Step 4: Persist skills
  await skillRepo.replaceForProfile(profileId, portfolioContext.skills);

  // Step 5: Persist analysis results (including JSONB analysis_json) + history
  await analysisRepo.save(profileId, {
    ...aiEvaluation,
    profileData,
    summary: {
      totalStars: portfolioContext.communityMetrics.totalStars,
      totalForks: portfolioContext.communityMetrics.totalForks,
      mostUsedLanguage: portfolioContext.languageStatistics.mostUsedLanguage
    }
  });

  await analysisRepo.appendHistory(profileId, aiEvaluation.careerScore);

  logger.info(
    `[Pipeline] Completed for ${username} — Score: ${aiEvaluation.careerScore}, Decision: ${aiEvaluation.hireDecision}, Role: ${aiEvaluation.recommendedRole}`
  );

  return {
    profile: { ...profileData, id: profileId },
    skills: portfolioContext.skills,
    ...aiEvaluation,
    summary: {
      totalStars: portfolioContext.communityMetrics.totalStars,
      totalForks: portfolioContext.communityMetrics.totalForks,
      mostUsedLanguage: portfolioContext.languageStatistics.mostUsedLanguage
    }
  };
};

export { analyzeProfile };
export default { analyzeProfile };
