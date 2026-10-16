/**
 * skillSignalExtractor.js
 *
 * Stage 3 of the Evidence Extraction Pipeline.
 * Extracts, canonicalizes, and ranks skills from normalized repositories
 * and provides provenance (supporting repos and counts) for the LLM.
 */

import { extractSkills, ALIAS_MAP } from '../analyzers/skillExtractor.js';

/**
 * Extracts and canonicalizes skills from repository evidence.
 * @param {Array<object>} enrichedRepos - Normalized repositories
 * @returns {Array<{ skill: string, confidence: number, supportingRepoCount: number, supportingRepos: string[] }>}
 */
export function extractSkillSignals(enrichedRepos = []) {
  if (!Array.isArray(enrichedRepos) || !enrichedRepos.length) return [];

  const rawSkills = extractSkills(enrichedRepos);

  // Canonicalize skill names and aggregate duplicates if any alias resolved to the same canonical name
  const canonicalMap = new Map();

  for (const item of rawSkills) {
    const canonicalName = ALIAS_MAP[item.skill.toLowerCase()] || item.skill;
    if (!canonicalMap.has(canonicalName)) {
      canonicalMap.set(canonicalName, {
        skill: canonicalName,
        confidence: item.confidence,
        supportingRepos: new Set(item.supportingRepos || [])
      });
    } else {
      const existing = canonicalMap.get(canonicalName);
      existing.confidence = Math.min(1.0, Math.max(existing.confidence, item.confidence));
      for (const r of (item.supportingRepos || [])) {
        existing.supportingRepos.add(r);
      }
    }
  }

  return Array.from(canonicalMap.values())
    .map(entry => ({
      skill: entry.skill,
      confidence: entry.confidence,
      supportingRepoCount: entry.supportingRepos.size,
      supportingRepos: Array.from(entry.supportingRepos)
    }))
    .sort((a, b) => {
      if (b.confidence !== a.confidence) return b.confidence - a.confidence;
      if (b.supportingRepoCount !== a.supportingRepoCount) return b.supportingRepoCount - a.supportingRepoCount;
      return a.skill.localeCompare(b.skill);
    });
}

export default {
  extractSkillSignals
};
