/**
 * profileEvidence.js
 *
 * Stage 5 of the Evidence Extraction Pipeline.
 * Aggregates user-level metrics, profile facts, language distributions,
 * and portfolio structural metadata.
 */

const NOISE_PATTERNS = [
  /hello[\s_-]?world/i,
  /^\d+days?of/i,
  /leetcode/i,
  /hackerrank/i,
  /codewars/i,
  /tutorial/i,
  /^test[\s_-]?repo/i,
  /learning[\s_-]/i,
  /practice[\s_-]/i,
];

/**
 * Builds user-level profile evidence.
 * @param {object} profileData - Raw profile record from DB / GitHub
 * @param {Array<object>} enrichedRepos - Normalized repositories
 * @param {number} [now=Date.now()]
 * @returns {object} Profile evidence metrics
 */
export function buildProfileEvidence(profileData = {}, enrichedRepos = [], now = Date.now()) {
  const username = profileData.username || profileData.login || '';
  const name = profileData.name || null;
  const bio = profileData.bio || null;
  const company = profileData.company || null;
  const blog = profileData.blog || null;
  const location = profileData.location || null;
  const avatarUrl = profileData.avatar_url || profileData.avatarUrl || null;
  const htmlUrl = profileData.html_url || profileData.htmlUrl || `https://github.com/${username}`;
  const followers = Number(profileData.followers || 0) || 0;
  const following = Number(profileData.following || 0) || 0;
  const publicRepos = Number(profileData.public_repos ?? profileData.publicRepos ?? enrichedRepos.length) || 0;

  // Account age
  const createdAtStr = profileData.created_at || profileData.createdAt || null;
  let accountAgeYears = null;
  let accountAgeDays = null;
  if (createdAtStr) {
    const createdTime = new Date(createdAtStr).getTime();
    if (Number.isFinite(createdTime)) {
      accountAgeDays = Math.max(0, Math.round((now - createdTime) / (1000 * 60 * 60 * 24)));
      accountAgeYears = parseFloat((accountAgeDays / 365.25).toFixed(1));
    }
  }

  // Repository-level aggregations
  let totalStars = 0;
  let totalForks = 0;
  let totalWatchers = 0;
  let ownRepoCount = 0;
  let forkCount = 0;
  let tutorialOrPracticeRepoCount = 0;
  let reposWithReadmeCount = 0;
  let reposWithHomepageCount = 0;

  const languageCounts = {};

  for (const repo of enrichedRepos) {
    totalStars += (repo.stars || 0);
    totalForks += (repo.forks || 0);
    totalWatchers += (repo.watchers || 0);

    if (repo.isFork) {
      forkCount++;
    } else {
      ownRepoCount++;
    }

    if (repo.hasReadme) reposWithReadmeCount++;
    if (repo.hasHomepage) reposWithHomepageCount++;

    if (NOISE_PATTERNS.some(p => p.test(repo.name || ''))) {
      tutorialOrPracticeRepoCount++;
    }

    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  }

  // Language distribution calculations
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

  return {
    username,
    name,
    bio,
    company,
    blog,
    location,
    avatarUrl,
    htmlUrl,
    followers,
    following,
    publicRepos,
    accountAgeYears,
    accountAgeDays,
    totalStars,
    totalForks,
    totalWatchers,
    ownRepoCount,
    forkCount,
    tutorialOrPracticeRepoCount,
    reposWithReadmeCount,
    reposWithHomepageCount,
    mostUsedLanguage,
    languageDistribution
  };
}

export default {
  buildProfileEvidence
};
