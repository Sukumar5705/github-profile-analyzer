/**
 * repoSelection.js
 *
 * Single source of truth for:
 *   1. sortByImportance   — the canonical repo ordering (non-forks first,
 *      then stars, forks, recency).
 *   2. calculateProjectScore — deterministic, evidence-based project score.
 *   3. buildCandidatePool — a FAIR, diversity-aware shortlist drawn from
 *      ALL fetched repos (not just a blind "top N by stars" cut), used to
 *      decide which repos are worth the cost of a README fetch.
 *   4. selectBalancedTop — the final re-scored, language-balanced set that
 *      actually goes into the AI prompt and the dashboard.
 *
 * This file exists because the sort/score logic used to be written twice
 * (portfolioContext.service.js and projectFactSheet.js), including the same
 * bug in both copies: `daysSinceLastPush || 9999` treated a push from today
 * (0 days ago) as if it were 9999 days old, since `0 || 9999` evaluates to
 * 9999. Fixed below with `??`. Keeping one copy means it can't drift again.
 */

/**
 * Canonical importance ordering: original repos before forks, then stars,
 * forks, and recency as a final tie-breaker.
 * @param {Array<object>} repos
 * @returns {Array<object>} new sorted array (input is not mutated)
 */
export function sortByImportance(repos) {
  if (!Array.isArray(repos)) return [];
  return [...repos].sort((a, b) => {
    if (a.isFork !== b.isFork) return a.isFork ? 1 : -1;
    if ((b.stars || 0) !== (a.stars || 0)) return (b.stars || 0) - (a.stars || 0);
    if ((b.forks || 0) !== (a.forks || 0)) return (b.forks || 0) - (a.forks || 0);
    // `??`, not `||` — a push from today (0 days ago) must win the
    // tie-break, not fall through to the "unknown" 9999 default.
    return (a.daysSinceLastPush ?? 9999) - (b.daysSinceLastPush ?? 9999);
  });
}

/**
 * Computes deterministic project scoring based purely on verifiable metrics.
 * @param {object} repo
 * @returns {{ score: number, breakdown: object }}
 */
export function calculateProjectScore(repo) {
  const stars = Number(repo.stars) || 0;
  const starsScore = Math.min(25, Math.round(Math.log10(stars + 1) * 8));
  const readmeScore = repo.hasReadme ? 20 : 0;
  const descScore = (repo.description && repo.description.trim().length > 5) ? 15 : 0;

  let activityScore = 5;
  if (repo.daysSinceLastPush != null) {
    if (repo.daysSinceLastPush <= 90) activityScore = 20;
    else if (repo.daysSinceLastPush <= 180) activityScore = 15;
    else if (repo.daysSinceLastPush <= 365) activityScore = 10;
  }

  const sizeKb = Number(repo.sizeKb) || 0;
  const sizeScore = sizeKb >= 500 ? 20 : sizeKb >= 50 ? 15 : 10;

  const totalScore = Math.min(100, Math.max(15, starsScore + readmeScore + descScore + activityScore + sizeScore));

  return {
    score: totalScore,
    breakdown: { stars: starsScore, readme: readmeScore, description: descScore, activity: activityScore, size: sizeScore }
  };
}

/**
 * Builds a fair, diversity-aware candidate pool from ALL fetched repos,
 * before README enrichment (hasReadme may still be false/unknown here).
 *
 * Strategy:
 *  1. Score every repo on cheap metadata alone (no extra API calls).
 *  2. Seed the pool with the top `topN` by score.
 *  3. Add the best-scoring repo from each distinct architecture-signal
 *     bucket (already tagged by repoIntelligence.service.js from repo
 *     name/description/topics) that isn't already in the pool — so five
 *     similar popular tutorial repos can't crowd out a smaller but
 *     well-built systems/CLI/ML project.
 *  4. Force-include the most recently active original (non-fork) repo if
 *     it didn't make the cut, so "what are they building right now" is
 *     never lost purely to older, higher-starred repos.
 *
 * @param {Array<object>} intelligenceRepos - output of buildAllRepoIntelligence
 * @param {object} [opts]
 * @param {number} [opts.topN=20] - top-scored repos that seed the pool
 * @param {number} [opts.maxPoolSize=25] - hard cap on candidate pool size
 * @returns {Array<object>} candidate repos, each annotated with `surveyScore`
 */
export function buildCandidatePool(intelligenceRepos, opts = {}) {
  const { topN = 20, maxPoolSize = 25 } = opts;
  if (!Array.isArray(intelligenceRepos) || !intelligenceRepos.length) return [];

  const scored = intelligenceRepos.map(r => ({ ...r, surveyScore: calculateProjectScore(r).score }));
  const byScoreDesc = [...scored].sort((a, b) => b.surveyScore - a.surveyScore);

  const pool = byScoreDesc.slice(0, Math.min(topN, maxPoolSize));
  const poolNames = new Set(pool.map(r => r.name));

  // Diversity pass: best repo per architecture bucket not already present.
  const bestPerBucket = new Map();
  for (const r of byScoreDesc) {
    for (const signal of (r.architecture || [])) {
      if (signal === 'General Software Engineering') continue;
      const current = bestPerBucket.get(signal);
      if (!current || r.surveyScore > current.surveyScore) bestPerBucket.set(signal, r);
    }
  }
  for (const r of bestPerBucket.values()) {
    if (pool.length >= maxPoolSize) break;
    if (!poolNames.has(r.name)) {
      pool.push(r);
      poolNames.add(r.name);
    }
  }

  // Recency floor: the most recently pushed original repo always gets in.
  const mostRecentOriginal = [...scored]
    .filter(r => !r.isFork && r.daysSinceLastPush != null)
    .sort((a, b) => a.daysSinceLastPush - b.daysSinceLastPush)[0];
  if (mostRecentOriginal && !poolNames.has(mostRecentOriginal.name)) {
    pool.push(mostRecentOriginal);
    poolNames.add(mostRecentOriginal.name);
  }

  return pool;
}

/**
 * From an enriched candidate pool (README now fetched where possible),
 * selects the final set that goes into the AI prompt / dashboard: re-scored
 * now that hasReadme is accurate, with a per-language quota so one popular
 * language can't fill every slot.
 *
 * @param {Array<object>} enrichedCandidates
 * @param {object} [opts]
 * @param {number} [opts.limit=10]
 * @param {number} [opts.maxPerLanguage=4]
 * @returns {Array<object>} final repos, each annotated with `finalScore`
 */
export function selectBalancedTop(enrichedCandidates, opts = {}) {
  const { limit = 10, maxPerLanguage = 4 } = opts;
  if (!Array.isArray(enrichedCandidates) || !enrichedCandidates.length) return [];

  const rescored = enrichedCandidates
    .map(r => ({ ...r, finalScore: calculateProjectScore(r).score }))
    .sort((a, b) => b.finalScore - a.finalScore);

  const selected = [];
  const overflow = [];
  const langCounts = new Map();

  for (const r of rescored) {
    const lang = r.language || (r.languages && r.languages[0]) || 'Unknown';
    const count = langCounts.get(lang) || 0;
    if (count < maxPerLanguage) {
      selected.push(r);
      langCounts.set(lang, count + 1);
    } else {
      overflow.push(r);
    }
  }

  // Backfill with next-best overflow repos if quotas left slots unfilled.
  for (const r of overflow) {
    if (selected.length >= limit) break;
    selected.push(r);
  }

  return selected
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, limit);
}

export default {
  sortByImportance,
  calculateProjectScore,
  buildCandidatePool,
  selectBalancedTop
};
