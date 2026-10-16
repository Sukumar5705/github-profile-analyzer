/**
 * repositoryNormalizer.js
 *
 * Stage 1 of the Evidence Extraction Pipeline.
 * Enriches and normalizes raw repository records from GitHub / Database
 * into standardized, factual data structures with tokenized search sets.
 * No scoring or quality judgments are performed here.
 */

/**
 * Tokenize a text string into normalized, unique word tokens.
 * @param {string} text
 * @returns {string[]}
 */
export function tokenizeText(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Normalizes a single repository object.
 * @param {object} repo - Raw or mapped repository object
 * @param {number} [now=Date.now()] - Timestamp reference for recency
 * @returns {object} Standardized enriched repository object
 */
export function normalizeRepository(repo, now = Date.now()) {
  if (!repo) return null;

  const name = repo.name || repo.repo_name || repo.repoName || '';
  const description = repo.description || null;
  const language = repo.language || null;
  const stars = Number(repo.stars || repo.stargazers_count || 0) || 0;
  const forks = Number(repo.forks || repo.forks_count || 0) || 0;
  const watchers = Number(repo.watchers || repo.watchers_count || 0) || 0;
  const sizeKb = Number(repo.size_kb || repo.size || 0) || 0;
  const hasReadme = Boolean(repo.has_readme || repo.hasReadme);
  const homepage = repo.homepage || repo.homepage_url || repo.homepageUrl || null;
  const hasHomepage = Boolean(homepage && homepage.trim().length > 0);
  const htmlUrl = repo.html_url || repo.htmlUrl || repo.repoUrl || `https://github.com/${name}`;
  const isFork = Boolean(repo.is_fork || repo.isFork || repo.fork);

  // Parse topics
  let topics = [];
  if (Array.isArray(repo.topics)) {
    topics = repo.topics.map(t => String(t || '').trim()).filter(Boolean);
  } else if (typeof repo.topics === 'string') {
    try {
      const parsed = JSON.parse(repo.topics);
      if (Array.isArray(parsed)) {
        topics = parsed.map(t => String(t || '').trim()).filter(Boolean);
      }
    } catch {
      topics = repo.topics.split(',').map(t => t.trim()).filter(Boolean);
    }
  }

  // Calculate chronological metrics
  const pushedAtStr = repo.pushed_at || repo.pushedAt || null;
  let daysSinceLastPush = null;
  if (pushedAtStr) {
    const pushTime = new Date(pushedAtStr).getTime();
    if (Number.isFinite(pushTime)) {
      daysSinceLastPush = Math.max(0, Math.round((now - pushTime) / (1000 * 60 * 60 * 24)));
    }
  }

  const createdAtStr = repo.created_at || repo.createdAt || null;
  let ageYears = null;
  if (createdAtStr) {
    const createdTime = new Date(createdAtStr).getTime();
    if (Number.isFinite(createdTime)) {
      ageYears = parseFloat((Math.max(0, now - createdTime) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1));
    }
  }

  // Build combined token set for fast, boundary-accurate keyword matching
  const allText = [
    name,
    description || '',
    homepage || '',
    ...topics
  ].join(' ');

  const tokenizedText = Array.from(new Set(tokenizeText(allText)));

  return {
    name,
    description,
    language,
    stars,
    forks,
    watchers,
    sizeKb,
    hasReadme,
    hasHomepage,
    homepage,
    htmlUrl,
    isFork,
    topics,
    topicsCount: topics.length,
    pushedAt: pushedAtStr,
    daysSinceLastPush,
    createdAt: createdAtStr,
    ageYears,
    tokenizedText
  };
}

/**
 * Normalizes an array of repositories.
 * @param {Array} repos
 * @param {number} [now=Date.now()]
 * @returns {Array} Array of normalized repository objects
 */
export function normalizeRepositories(repos, now = Date.now()) {
  if (!Array.isArray(repos)) return [];
  return repos
    .map(r => normalizeRepository(r, now))
    .filter(Boolean);
}

export default {
  tokenizeText,
  normalizeRepository,
  normalizeRepositories
};
