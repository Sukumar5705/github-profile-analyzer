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
import { enrichCandidatePool } from './repoEnrichment.service.js';
import { selectBalancedTop } from '../evidence/repoSelection.js';
import { runAnalysis } from './llmAnalysis.service.js';
import skillRepo from '../repositories/skill.repository.js';
import analysisRepo from '../repositories/analysis.repository.js';
import logger from '../utils/logger.js';
import { startProgress, setStage, completeProgress, failProgress } from '../utils/analysisProgress.js';

/**
 * Run the full AI Recruiter analysis pipeline for a GitHub username.
 * @param {string} username
 * @param {AbortSignal} [signal]
 * @returns {Promise<object>} Full AI Hiring Intelligence evaluation
 */
const analyzeProfile = async (username, signal) => {
  logger.info(`[Pipeline] Starting AI Recruiter Hiring Intelligence Pipeline for: ${username}`);
  startProgress(username);

  try {
    // Step 1: GitHub raw data (ALL repos, paginated) → DB
    setStage(username, 'connect', 'Reaching GitHub API…');
    const { profileId, profileData, githubRepos } = await fetchAndPersist(username, signal);
    setStage(username, 'fetch', 'Persisting raw profile data to database…');

    // Step 2: Build objective Portfolio Context — surveys and scores every
    // fetched repo on cheap metadata alone and derives a fair, diversity-aware
    // candidate pool (portfolioContext.candidatePool) worth enriching further.
    const portfolioContext = buildPortfolioContext(profileData, githubRepos);
    setStage(username, 'analyze', 'Profiling language distribution across projects…');

    // Step 2.5: Selective enrichment — fetch (and cache) README content for
    // the candidate pool ONLY, then re-score with that real signal and pick
    // the final balanced, language-diverse set for the AI prompt + dashboard.
    const enrichedCandidates = await enrichCandidatePool(username, profileId, portfolioContext.candidatePool, signal);
    const selectedRepositories = selectBalancedTop(enrichedCandidates, { limit: 10 });
    const selectedNames = new Set(selectedRepositories.map(r => r.name));

    portfolioContext.selectedRepositories = selectedRepositories;
    portfolioContext.otherRepositories = portfolioContext.repositories.filter(r => !selectedNames.has(r.name));

    // Step 3: Run single unified AI Recruiter evaluation
    setStage(username, 'intelligence', 'Running AI recruiter evaluation…');
    const aiEvaluation = await runAnalysis(portfolioContext, signal);

    // Step 4: Persist skills
    setStage(username, 'report', 'Persisting intelligence results…');
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

    completeProgress(username);

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
  } catch (err) {
    failProgress(username, err.message);
    throw err;
  }
};

export { analyzeProfile };
export default { analyzeProfile };