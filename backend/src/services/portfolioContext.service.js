/**
 * portfolioContext.service.js
 *
 * Phase 4 — Portfolio Context Generator
 * Merges profile facts, repository intelligence, language statistics,
 * activity statistics, and community metrics into ONE unified, objective portfolio context.
 * This is the sole factual payload supplied to the AI Recruiter LLM.
 */

import { buildAllRepoIntelligence } from './repoIntelligence.service.js';
import { extractSkillSignals } from '../evidence/skillSignalExtractor.js';
import { normalizeRepositories } from '../evidence/repositoryNormalizer.js';
import { sortByImportance, buildCandidatePool } from '../evidence/repoSelection.js';

/**
 * Compiles the complete Portfolio Context object from raw profile and repository data.
 * @param {object} rawProfile - Raw profile record from DB / GitHub
 * @param {Array<object>} rawRepos - Array of repositories
 * @returns {object} Canonical Portfolio Context
 */
export function buildPortfolioContext(rawProfile = {}, rawRepos = []) {
  const now = Date.now();

  const normalizedRepos = normalizeRepositories(rawRepos, now);
  const repoIntelligenceList = buildAllRepoIntelligence(rawRepos, now);
  const skills = extractSkillSignals(normalizedRepos);

  // Profile facts
  const username = rawProfile.username || rawProfile.login || '';
  const name = rawProfile.name || null;
  const bio = rawProfile.bio || null;
  const company = rawProfile.company || null;
  const blog = rawProfile.blog || null;
  const location = rawProfile.location || null;
  const followers = Number(rawProfile.followers || 0) || 0;
  const following = Number(rawProfile.following || 0) || 0;
  const publicRepos = Number(rawProfile.public_repos ?? rawProfile.publicRepos ?? rawRepos.length) || 0;

  // Account age
  const createdAtStr = rawProfile.created_at || rawProfile.createdAt || null;
  let accountAgeYears = 0;
  let accountAgeDays = 0;
  if (createdAtStr) {
    const createdTime = new Date(createdAtStr).getTime();
    if (Number.isFinite(createdTime)) {
      accountAgeDays = Math.max(0, Math.round((now - createdTime) / (1000 * 60 * 60 * 24)));
      accountAgeYears = parseFloat((accountAgeDays / 365.25).toFixed(1));
    }
  }

  // Aggregate metrics
  let totalStars = 0;
  let totalForks = 0;
  let totalWatchers = 0;
  let ownRepoCount = 0;
  let forkCount = 0;
  let activeInLastYear = 0;

  const languageCounts = {};

  for (const repo of normalizedRepos) {
    totalStars += (repo.stars || 0);
    totalForks += (repo.forks || 0);
    totalWatchers += (repo.watchers || 0);

    if (repo.isFork) {
      forkCount++;
    } else {
      ownRepoCount++;
    }

    if (repo.daysSinceLastPush != null && repo.daysSinceLastPush <= 365) {
      activeInLastYear++;
    }

    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  }

  // Language statistics
  const totalReposWithLang = Object.values(languageCounts).reduce((a, b) => a + b, 0);
  const languageDistribution = {};
  let mostUsedLanguage = null;
  let maxLangCount = 0;

  for (const [lang, count] of Object.entries(languageCounts)) {
    const percentage = totalReposWithLang > 0 ? Math.round((count / totalReposWithLang) * 100) : 0;
    languageDistribution[lang] = percentage;
    if (count > maxLangCount) {
      maxLangCount = count;
      mostUsedLanguage = lang;
    }
  }

  // Sort repositories by importance (non-forks first, then stars, forks, recency)
  const sortedRepos = sortByImportance(repoIntelligenceList);

  // Fair, diversity-aware shortlist of repos worth the cost of a README
  // fetch — built from cheap metadata across ALL fetched repos, not just a
  // blind top-10-by-stars cut. See repoSelection.js for the algorithm.
  const candidatePool = buildCandidatePool(repoIntelligenceList);

  const profile = {
    username,
    name,
    bio,
    company,
    blog,
    location,
    followers,
    following,
    publicRepos,
    accountAgeYears,
    accountAgeDays,
    totalStars,
    totalForks,
    avatarUrl: rawProfile.avatar_url || rawProfile.avatarUrl || null,
    profileUrl: rawProfile.profile_url || rawProfile.profileUrl || `https://github.com/${username}`
  };

  const languageStatistics = {
    mostUsedLanguage: mostUsedLanguage || 'None',
    distribution: languageDistribution,
    totalDistinctLanguages: Object.keys(languageCounts).length
  };

  const activityStatistics = {
    totalRepositories: normalizedRepos.length,
    originalRepositories: ownRepoCount,
    forkedRepositories: forkCount,
    activeInLastYear,
    accountAgeYears
  };

  const communityMetrics = {
    totalStars,
    totalForks,
    totalWatchers,
    followers
  };

  return {
    profile,
    repositories: sortedRepos,
    // Populated by the orchestrator (analysis.service.js) after the
    // enrichment + final-selection stages run. Present here as empty
    // defaults so this function's return shape is self-documenting.
    candidatePool,
    selectedRepositories: [],
    otherRepositories: [],
    languageStatistics,
    activityStatistics,
    communityMetrics,
    skills
  };
}

export default {
  buildPortfolioContext
};
