/**
 * repoEnrichment.service.js
 *
 * Phase 3.5 — Selective README Enrichment
 * Fetches README content for the candidate pool ONLY (not every fetched
 * repo), with a DB-backed cache keyed on `pushed_at` so re-analyzing the
 * same profile doesn't re-fetch README content for repos that haven't
 * changed since the last run, and with bounded concurrency so a ~25-repo
 * candidate pool doesn't fire a burst of simultaneous requests.
 */

import { getReadmesForRepos } from './github.service.js';
import repositoryRepo from '../repositories/repository.repository.js';
import logger from '../utils/logger.js';

const README_CONCURRENCY = 5;

/**
 * @param {string} username - GitHub login, used as the API "owner" segment
 * @param {number} profileId - DB profile id, used for the README cache
 * @param {Array<object>} candidatePool - output of buildCandidatePool()
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array<object>>} candidatePool repos annotated with real
 *   hasReadme / readmeExcerpt
 */
export async function enrichCandidatePool(username, profileId, candidatePool, signal) {
  if (!Array.isArray(candidatePool) || !candidatePool.length) return [];

  const names = candidatePool.map(r => r.name);
  const cached = await repositoryRepo.getReadmeCache(profileId, names);

  const needsFetch = candidatePool.filter(r => {
    const c = cached.get(r.name);
    if (!c || !c.readme_checked_at) return true;
    // No pushed_at to compare against — trust the existing cache entry
    // rather than re-fetching on every run.
    if (!r.pushedAt) return false;
    return new Date(r.pushedAt).getTime() > new Date(c.readme_checked_at).getTime();
  });

  let fetched = new Map();
  if (needsFetch.length) {
    logger.debug(`[repoEnrichment] Fetching README for ${needsFetch.length}/${candidatePool.length} candidates (${username})`);
    fetched = await getReadmesForRepos(username, needsFetch.map(r => r.name), { concurrency: README_CONCURRENCY, signal });
    await repositoryRepo.saveReadmeCache(profileId, fetched);
  }

  return candidatePool.map(r => {
    const fresh = fetched.get(r.name);
    if (fresh) {
      return { ...r, hasReadme: fresh.hasReadme, readmeExcerpt: fresh.excerpt };
    }
    const stale = cached.get(r.name);
    if (stale) {
      return { ...r, hasReadme: stale.has_readme, readmeExcerpt: stale.readme_excerpt };
    }
    return { ...r, hasReadme: false, readmeExcerpt: null };
  });
}

export default { enrichCandidatePool };