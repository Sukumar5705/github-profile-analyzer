/**
 * projectFactSheet.js
 *
 * Stage 4 of the Evidence Extraction Pipeline.
 * Compiles a structured, factual inventory of repositories and computes
 * deterministic project rankings, showcase candidates, and resume evidence.
 */

import { calculateProjectScore, sortByImportance } from './repoSelection.js';

// Re-exported for backward compatibility — the implementation now lives in
// repoSelection.js so it's written exactly once and shared with
// portfolioContext.service.js's candidate-pool/final-selection logic.
export { calculateProjectScore };

/**
 * Builds the project fact sheet for analyzed repositories.
 * @param {Array<object>} enrichedRepos - Normalized repository records
 * @param {object} technologySignals - Output from technologySignalExtractor
 * @param {number} [maxProjects=8] - Maximum projects to include in the fact sheet
 * @returns {Array<object>} Factual project summaries with deterministic scores
 */
export function buildProjectFactSheet(enrichedRepos = [], technologySignals = null, maxProjects = 8) {
  if (!Array.isArray(enrichedRepos) || !enrichedRepos.length) return [];

  const perRepoSignalsMap = new Map();
  if (technologySignals && Array.isArray(technologySignals.perRepo)) {
    for (const item of technologySignals.perRepo) {
      const activeSignals = Object.entries(item.signals || {})
        .filter(([_, active]) => active)
        .map(([key]) => key);
      perRepoSignalsMap.set(item.repoName, {
        signals: activeSignals,
        matchedKeywords: item.matchedKeywords || []
      });
    }
  }

  // Sort by importance (non-forks first, then stars/forks/recency) — same
  // canonical order used everywhere else in the pipeline.
  const sorted = sortByImportance(enrichedRepos);

  const selected = sorted.slice(0, maxProjects);

  return selected.map(repo => {
    const signalData = perRepoSignalsMap.get(repo.name) || { signals: [], matchedKeywords: [] };
    const { score, breakdown } = calculateProjectScore(repo);

    return {
      repoName: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stars,
      forks: repo.forks,
      watchers: repo.watchers,
      sizeKb: repo.sizeKb,
      hasReadme: repo.hasReadme,
      hasHomepage: repo.hasHomepage,
      homepage: repo.homepage,
      htmlUrl: repo.htmlUrl,
      isFork: repo.isFork,
      topics: repo.topics,
      daysSinceLastPush: repo.daysSinceLastPush,
      ageYears: repo.ageYears,
      detectedSignals: signalData.signals,
      matchedKeywords: signalData.matchedKeywords,
      score,
      breakdown
    };
  });
}

/**
 * Generates deterministic Top Projects from the fact sheet.
 * @param {Array<object>} factSheet
 * @param {number} [limit=3]
 * @returns {Array<object>}
 */
export function getDeterministicTopProjects(factSheet = [], limit = 3) {
  if (!Array.isArray(factSheet) || !factSheet.length) return [];

  return factSheet.slice(0, limit).map(p => ({
    repoName: p.repoName,
    score: p.score,
    breakdown: p.breakdown,
    language: p.language || 'Unknown',
    stars: p.stars || 0,
    repoUrl: p.htmlUrl || `https://github.com/${p.repoName}`
  }));
}

/**
 * Generates deterministic Portfolio Showcase from the fact sheet.
 * @param {Array<object>} factSheet
 * @returns {object}
 */
export function getDeterministicShowcase(factSheet = []) {
  if (!Array.isArray(factSheet) || !factSheet.length) {
    return {
      resumeProject: null,
      technicalProject: null,
      recruiterProject: null,
      architectureProject: null
    };
  }

  const primary = factSheet[0];
  const technical = factSheet.find(p => p.detectedSignals?.includes('systemDesign') || p.detectedSignals?.includes('docker') || (p.sizeKb || 0) > 1000) || primary;
  const recruiter = factSheet.find(p => p.hasHomepage || (p.stars || 0) >= 10) || primary;
  const architecture = factSheet.find(p => p.detectedSignals?.includes('microservice') || p.detectedSignals?.includes('docker') || p.detectedSignals?.includes('ciCd')) || factSheet[1] || primary;

  const formatShowcase = (p, defaultReason) => ({
    repoName: p.repoName,
    repoUrl: p.htmlUrl || `https://github.com/${p.repoName}`,
    language: p.language || 'Unknown',
    stars: p.stars || 0,
    reason: defaultReason,
    score: p.score
  });

  return {
    resumeProject: formatShowcase(primary, `Flagship project demonstrating core competencies in ${primary.language || 'software engineering'}.`),
    technicalProject: formatShowcase(technical, `Technically robust project with ${technical.stars} stars and comprehensive code footprint.`),
    recruiterProject: formatShowcase(recruiter, `High-visibility project showcasing practical implementation and live presentation.`),
    architectureProject: formatShowcase(architecture, `Demonstrates modular structure, containerization, or systems-level architecture.`)
  };
}

/**
 * Generates deterministic Resume Evidence from extracted skills and signals.
 * @param {Array<object>} skills
 * @param {object} technologySignals
 * @param {Array<object>} factSheet
 * @returns {object}
 */
export function getDeterministicResumeEvidence(skills = [], technologySignals = null, factSheet = []) {
  const categories = {};

  // Group top skills
  if (Array.isArray(skills) && skills.length) {
    const topSkills = skills.slice(0, 4);
    categories.coreEngineering = {
      claim: 'Core Languages & Technologies',
      evidence: topSkills.map(s => `Proficiency in ${s.skill} supported across ${s.supportingRepoCount} repository${s.supportingRepoCount > 1 ? 'ies' : ''}`)
    };
  }

  // Technology signals
  if (technologySignals?.aggregate) {
    const agg = technologySignals.aggregate;
    if (agg.dockerRepoCount > 0 || agg.ciCdRepoCount > 0) {
      categories.devops = {
        claim: 'Containerization & CI/CD',
        evidence: [
          agg.dockerRepoCount > 0 ? `Containerized applications with Docker across ${agg.dockerRepoCount} repositories` : null,
          agg.ciCdRepoCount > 0 ? `Automated workflows and CI/CD pipelines across ${agg.ciCdRepoCount} repositories` : null
        ].filter(Boolean)
      };
    }

    if (agg.testingRepoCount > 0) {
      categories.quality = {
        claim: 'Automated Testing & Code Quality',
        evidence: [`Test suite implementation identified across ${agg.testingRepoCount} repositories`]
      };
    }
  }

  // Top project evidence
  if (Array.isArray(factSheet) && factSheet.length) {
    const top = factSheet[0];
    categories.projects = {
      claim: 'Featured Software Delivery',
      evidence: [`Built ${top.repoName} in ${top.language || 'code'} with ${top.stars} stars and comprehensive documentation`]
    };
  }

  return categories;
}

export default {
  calculateProjectScore,
  buildProjectFactSheet,
  getDeterministicTopProjects,
  getDeterministicShowcase,
  getDeterministicResumeEvidence
};
