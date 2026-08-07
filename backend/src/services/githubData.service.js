/**
 * GitHub Data Service
 * Responsible only for fetching data from GitHub and persisting it to DB.
 * No analysis logic here.
 */

import { getProfile, getRepositories } from './github.service.js';
import profileRepo    from '../repositories/profile.repository.js';
import repositoryRepo from '../repositories/repository.repository.js';
import logger         from '../utils/logger.js';

/**
 * Fetch GitHub profile + repos and upsert them into the database.
 * @param {string} username
 * @returns {Promise<{ profileId, profileData, githubRepos }>}
 */
const fetchAndPersist = async (username) => {
  const [githubProfile, githubRepos] = await Promise.all([
    getProfile(username),
    getRepositories(username)
  ]);

  const accountAgeDays = Math.floor(
    (Date.now() - new Date(githubProfile.created_at).getTime()) / 86400000
  );

  const profileData = {
    username:        githubProfile.login,
    name:            githubProfile.name,
    bio:             githubProfile.bio,
    location:        githubProfile.location,
    email:           githubProfile.email,
    blog:            githubProfile.blog,
    company:         githubProfile.company,
    public_repos:    githubProfile.public_repos,
    followers:       githubProfile.followers,
    following:       githubProfile.following,
    account_age_days: accountAgeDays,
    profile_url:     githubProfile.html_url,
    avatar_url:      githubProfile.avatar_url
  };

  const existing = await profileRepo.findByUsername(username);
  let profileId;

  if (existing) {
    await profileRepo.update(username, profileData);
    profileId = existing.id;
    logger.debug(`Updated profile: ${username} (id ${profileId})`);
  } else {
    profileId = await profileRepo.create(profileData);
    logger.debug(`Created profile: ${username} (id ${profileId})`);
  }

  await repositoryRepo.upsertForProfile(profileId, githubRepos);
  logger.debug(`Upserted ${githubRepos.length} repos for profile ${profileId}`);

  return { profileId, profileData, githubRepos };
};

export { fetchAndPersist };
