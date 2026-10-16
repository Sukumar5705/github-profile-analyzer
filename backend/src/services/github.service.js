import axios from 'axios';
import logger from '../utils/logger.js';
import { mapGitHubProfile, mapGitHubRepo } from '../mappers/github.mapper.js';

const githubAPI = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json'
  },
  timeout: 10000
});

/**
 * Fetch a GitHub user profile.
 * @param {string} username
 * @param {AbortSignal} [signal]
 * @returns {Promise<object>} Normalized profile DTO
 */
const getProfile = async (username, signal) => {
  try {
    const { data } = await githubAPI.get(`/users/${username}`, { signal });
    logger.debug(`Fetched GitHub profile for: ${username}`);
    return mapGitHubProfile(data);
  } catch (err) {
    handleGitHubError(err, username);
  }
};

// Safety ceiling on pagination so one unusual account (or an org mistakenly
// pointed at this endpoint) can't trigger an unbounded number of requests.
const MAX_REPOS_TO_FETCH = 500;
const README_EXCERPT_MAX_CHARS = 3000;

/**
 * Fetch ALL public repositories for a user, paginating past GitHub's
 * 100-per-page limit rather than stopping at the first page.
 * @param {string} username
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array>} Normalized repository DTOs
 */
const getRepositories = async (username, signal) => {
  try {
    let page = 1;
    let all = [];

    while (true) {
      const { data } = await githubAPI.get(`/users/${username}/repos`, {
        params: { per_page: 100, page, sort: 'updated' },
        signal
      });

      all = all.concat(data);

      const isLastPage = data.length < 100;
      const hitCeiling = all.length >= MAX_REPOS_TO_FETCH;
      if (isLastPage || hitCeiling) {
        if (hitCeiling && !isLastPage) {
          logger.warn(`[GitHub] ${username} has more than ${MAX_REPOS_TO_FETCH} repos; truncating fetch at the ceiling`);
        }
        break;
      }
      page++;
    }

    all = all.slice(0, MAX_REPOS_TO_FETCH);
    logger.debug(`Fetched ${all.length} repos for: ${username} (${page} page${page > 1 ? 's' : ''})`);
    return all.map(mapGitHubRepo);
  } catch (err) {
    handleGitHubError(err, username);
  }
};

/**
 * Fetch language breakdown for a single repository.
 * @param {string} owner
 * @param {string} repo
 * @returns {Promise<object>}
 */
const getRepositoryLanguages = async (owner, repo) => {
  try {
    const { data } = await githubAPI.get(`/repos/${owner}/${repo}/languages`);
    return data;
  } catch {
    return {};
  }
};

/**
 * Fetch README content for a single repository, truncated to a safe excerpt
 * length. Intended to be called only for a short candidate shortlist, not
 * for every fetched repo — see repoEnrichment.service.js.
 * @param {string} owner
 * @param {string} repo
 * @param {AbortSignal} [signal]
 * @returns {Promise<{hasReadme: boolean, excerpt: string|null}>}
 */
const getRepositoryReadme = async (owner, repo, signal) => {
  try {
    const { data } = await githubAPI.get(`/repos/${owner}/${repo}/readme`, {
      headers: { Accept: 'application/vnd.github.raw' },
      signal
    });
    const text = typeof data === 'string' ? data : '';
    return { hasReadme: true, excerpt: text.slice(0, README_EXCERPT_MAX_CHARS) };
  } catch {
    return { hasReadme: false, excerpt: null };
  }
};

/**
 * Fetches README content for several repositories with bounded concurrency,
 * so a candidate pool of ~20-25 repos doesn't fire that many requests at
 * once and doesn't need to be awaited one at a time either.
 * @param {string} owner
 * @param {Array<string>} repoNames
 * @param {object} [opts]
 * @param {number} [opts.concurrency=5]
 * @param {AbortSignal} [opts.signal]
 * @returns {Promise<Map<string, {hasReadme: boolean, excerpt: string|null}>>}
 */
const getReadmesForRepos = async (owner, repoNames, opts = {}) => {
  const { concurrency = 5, signal } = opts;
  const results = new Map();
  if (!repoNames.length) return results;

  let cursor = 0;
  const worker = async () => {
    while (cursor < repoNames.length) {
      const name = repoNames[cursor++];
      results.set(name, await getRepositoryReadme(owner, name, signal));
    }
  };

  const workerCount = Math.min(concurrency, repoNames.length);
  await Promise.all(Array.from({ length: workerCount }, worker));
  return results;
};

function handleGitHubError(err, username) {
  if (err.response?.status === 404) {
    const error = new Error(`GitHub user "${username}" not found`);
    error.statusCode = 404;
    throw error;
  }
  if (err.response?.status === 403) {
    const error = new Error('GitHub API rate limit exceeded');
    error.statusCode = 429;
    throw error;
  }
  logger.error(`GitHub API error: ${err.message}`);
  throw err;
}

export { getProfile, getRepositories, getRepositoryLanguages, getRepositoryReadme, getReadmesForRepos };