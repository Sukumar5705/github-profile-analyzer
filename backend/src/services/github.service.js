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
 * @returns {Promise<object>} Normalized profile DTO
 */
const getProfile = async (username) => {
  try {
    const { data } = await githubAPI.get(`/users/${username}`);
    logger.debug(`Fetched GitHub profile for: ${username}`);
    return mapGitHubProfile(data);
  } catch (err) {
    handleGitHubError(err, username);
  }
};

/**
 * Fetch all public repositories for a user (up to 100).
 * @param {string} username
 * @returns {Promise<Array>} Normalized repository DTOs
 */
const getRepositories = async (username) => {
  try {
    const { data } = await githubAPI.get(`/users/${username}/repos`, {
      params: { per_page: 100, sort: 'updated' }
    });
    logger.debug(`Fetched ${data.length} repos for: ${username}`);
    return data.map(mapGitHubRepo);
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
 * Check whether a README exists for a repository.
 * @param {string} owner
 * @param {string} repo
 * @returns {Promise<boolean>}
 */
const getRepositoryReadme = async (owner, repo) => {
  try {
    await githubAPI.get(`/repos/${owner}/${repo}/readme`);
    return true;
  } catch {
    return false;
  }
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

export { getProfile, getRepositories, getRepositoryLanguages, getRepositoryReadme };
