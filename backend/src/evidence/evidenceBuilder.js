/**
 * evidenceBuilder.js
 *
 * Master Orchestrator of the Evidence Extraction Pipeline.
 * Coordinates repository normalization, signal extraction, skill analysis,
 * project fact compilation, and profile synthesis into the canonical Developer Evidence JSON.
 */

import { normalizeRepositories } from './repositoryNormalizer.js';
import { extractTechnologySignals } from './technologySignalExtractor.js';
import { extractSkillSignals } from './skillSignalExtractor.js';
import { buildProjectFactSheet } from './projectFactSheet.js';
import { buildProfileEvidence } from './profileEvidence.js';

/**
 * Builds the canonical Developer Evidence JSON from raw profile and repository data.
 * @param {object} profileData - Raw profile record from DB / GitHub
 * @param {Array<object>} rawRepos - Array of repositories
 * @returns {object} Canonical Developer Evidence payload
 */
export function buildEvidence(profileData = {}, rawRepos = []) {
  const now = Date.now();

  // 1. Normalize repositories
  const enrichedRepos = normalizeRepositories(rawRepos, now);

  // 2. Extract technical keyword signals
  const technologySignals = extractTechnologySignals(enrichedRepos);

  // 3. Extract and canonicalize skills with provenance
  const skills = extractSkillSignals(enrichedRepos);

  // 4. Build objective project fact sheets
  const projects = buildProjectFactSheet(enrichedRepos, technologySignals, 25);

  // 5. Aggregate profile-level metrics
  const profile = buildProfileEvidence(profileData, enrichedRepos, now);

  return {
    profile,
    skills,
    technologySignals,
    projects
  };
}

export default {
  buildEvidence
};
