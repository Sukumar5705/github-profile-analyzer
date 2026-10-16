/**
 * analysisValidator.js
 *
 * Phase 5/6 — AI Analysis Validator & Sanitizer
 * Validates, bounds-checks, and cleanses the structured LLM output.
 * Preserves AI intelligence without overriding with artificial hardcoded backend formulas.
 */

import {
  REQUIRED_TOP_LEVEL_KEYS,
  VALID_SEVERITIES,
  VALID_PRIORITIES,
  VALID_HIRE_DECISIONS,
  VALID_SENIORITIES,
  SHOWCASE_KEYS,
  ROADMAP_MONTHS
} from './analysisResponseSchema.js';
import { buildProjectFactSheet, getDeterministicTopProjects } from '../evidence/projectFactSheet.js';
import logger from '../utils/logger.js';

export class AnalysisValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = 'AnalysisValidationError';
    this.details = details;
  }
}

/**
 * Clamps a number between min and max.
 */
function clamp(val, min, max, defaultVal = min) {
  const num = Number(val);
  if (!Number.isFinite(num)) return defaultVal;
  return Math.min(max, Math.max(min, num));
}

/**
 * Validates and sanitizes the parsed analysis JSON from the LLM.
 * @param {object} raw - Parsed JSON object
 * @param {object} [portfolioContext] - Factual portfolio context for fallback defaults
 * @returns {object} Validated, sanitized AI analysis object
 */
export function validateAndSanitizeAnalysis(raw, portfolioContext = null) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new AnalysisValidationError('LLM output is not a valid JSON object');
  }

  const missingKeys = [];
  for (const key of REQUIRED_TOP_LEVEL_KEYS) {
    if (raw[key] === undefined || raw[key] === null) {
      missingKeys.push(key);
    }
  }

  if (missingKeys.length > 8) {
    throw new AnalysisValidationError('LLM output deviates significantly from schema', missingKeys);
  }

  // 1. Scores & Confidence
  const careerScore = clamp(raw.careerScore, 0, 100, 75);
  const confidence = clamp(raw.confidence, 0, 100, 85);
  const confidenceReason = typeof raw.confidenceReason === 'string' && raw.confidenceReason.trim()
    ? raw.confidenceReason.trim()
    : 'Evaluated based on verified public repositories, commit recency, and technical artifacts.';

  // 2. Classification & Role Placement
  const developerType = typeof raw.developerType === 'string' && raw.developerType.trim()
    ? raw.developerType.trim()
    : (portfolioContext?.languageStatistics?.mostUsedLanguage ? `${portfolioContext.languageStatistics.mostUsedLanguage} Engineer` : 'Software Engineer');

  let seniority = typeof raw.seniority === 'string' && raw.seniority.trim() ? raw.seniority.trim() : 'Senior Engineer';
  if (!VALID_SENIORITIES.has(seniority)) {
    seniority = careerScore >= 90 ? 'Principal Engineer' : careerScore >= 80 ? 'Staff Engineer' : careerScore >= 65 ? 'Senior Engineer' : 'Mid-Level Engineer';
  }

  const recommendedRole = typeof raw.recommendedRole === 'string' && raw.recommendedRole.trim()
    ? raw.recommendedRole.trim()
    : `${seniority} - ${developerType}`;

  const recommendedTeam = typeof raw.recommendedTeam === 'string' && raw.recommendedTeam.trim()
    ? raw.recommendedTeam.trim()
    : 'Core Engineering';

  let hireDecision = typeof raw.hireDecision === 'string' && raw.hireDecision.trim() ? raw.hireDecision.trim() : null;
  if (!hireDecision || !VALID_HIRE_DECISIONS.has(hireDecision)) {
    hireDecision = careerScore >= 85 ? 'Strong Hire' : careerScore >= 70 ? 'Hire' : careerScore >= 55 ? 'Leaning Hire' : 'Leaning No Hire';
  }

  // 3. AI Score Breakdown
  let scoreBreakdown = [];
  if (Array.isArray(raw.scoreBreakdown) && raw.scoreBreakdown.length) {
    scoreBreakdown = raw.scoreBreakdown.map(item => ({
      category: String(item.category || 'Technical Assessment').trim(),
      score: clamp(item.score, 0, 100, 75),
      reason: String(item.reason || 'Demonstrated technical competency in codebase.').trim()
    }));
  } else {
    scoreBreakdown = [
      { category: 'Technical Depth', score: careerScore, reason: `Proficiency demonstrated across portfolio repositories.` },
      { category: 'Open Source Impact', score: Math.min(100, (portfolioContext?.communityMetrics?.totalStars || 0) > 50 ? 90 : 65), reason: `Public GitHub activity and community engagement.` },
      { category: 'Architecture & Design', score: careerScore, reason: `Modular code organization and project structure.` },
      { category: 'Production Readiness', score: Math.max(50, careerScore - 10), reason: `Code completeness and project documentation.` }
    ];
  }

  // 4. Role Fit Analysis
  let roleFit = [];
  if (Array.isArray(raw.roleFit) && raw.roleFit.length) {
    roleFit = raw.roleFit.map(rf => ({
      role: String(rf.role || 'Software Engineer').trim(),
      fit: clamp(rf.fit, 0, 100, 70),
      reason: rf.reason ? String(rf.reason).trim() : 'Matches technical skill signals.'
    }));
  } else {
    roleFit = [
      { role: developerType, fit: Math.min(100, careerScore + 5), reason: 'Primary specialization' },
      { role: 'Backend Engineer', fit: Math.max(50, careerScore - 5), reason: 'Core systems proficiency' },
      { role: 'Systems Engineer', fit: Math.max(40, careerScore - 10), reason: 'Technical engineering depth' }
    ];
  }

  // 5. Team Fit
  let teamFit = [];
  if (Array.isArray(raw.teamFit) && raw.teamFit.length) {
    teamFit = raw.teamFit.map(t => String(t).trim()).filter(Boolean);
  } else {
    teamFit = ['Platform', 'Core Infrastructure', 'Product Engineering'];
  }

  // 6. Recruiter & Leadership Summaries
  const executiveSummary = typeof raw.executiveSummary === 'string' && raw.executiveSummary.trim()
    ? raw.executiveSummary.trim()
    : 'Candidate demonstrates notable software engineering competency across verified GitHub repositories.';

  const technicalSummary = typeof raw.technicalSummary === 'string' && raw.technicalSummary.trim()
    ? raw.technicalSummary.trim()
    : executiveSummary;

  const hiringRecommendation = typeof raw.hiringRecommendation === 'string' && raw.hiringRecommendation.trim()
    ? raw.hiringRecommendation.trim()
    : `Recommended for ${recommendedRole} on ${recommendedTeam} team.`;

  const interviewFocus = typeof raw.interviewFocus === 'string' && raw.interviewFocus.trim()
    ? raw.interviewFocus.trim()
    : 'Probe system design, architectural scalability, and asynchronous patterns.';

  const riskAreas = typeof raw.riskAreas === 'string' && raw.riskAreas.trim()
    ? raw.riskAreas.trim()
    : 'Verify production testing practices and real-world deployment experience.';

  // 7. Strengths & Concerns
  const strengths = Array.isArray(raw.strengths)
    ? raw.strengths.map(s => String(s).trim()).filter(Boolean).slice(0, 5)
    : ['Demonstrated consistency in open source contributions'];

  const concerns = Array.isArray(raw.concerns)
    ? raw.concerns.map(c => String(c).trim()).filter(Boolean).slice(0, 4)
    : ['Continue expanding automated testing suites'];

  // 8. Portfolio Gaps & Recommendations
  const rawGaps = Array.isArray(raw.portfolioGaps) ? raw.portfolioGaps : (Array.isArray(raw.gaps) ? raw.gaps : []);
  const portfolioGaps = rawGaps.map(g => {
    const severityStr = String(g.severity || 'medium').toLowerCase();
    const severity = VALID_SEVERITIES.has(severityStr) ? severityStr : 'medium';
    return {
      area: String(g.area || 'Engineering Practices').trim(),
      severity,
      advice: String(g.advice || 'Continue strengthening project architecture and automated testing.').trim()
    };
  });

  const rawRecs = Array.isArray(raw.recommendations) ? raw.recommendations : [];
  const recommendations = rawRecs.map(r => {
    const prioStr = String(r.priority || 'medium').toLowerCase();
    const priority = VALID_PRIORITIES.has(prioStr) ? prioStr : 'medium';
    return {
      priority,
      recommendation: String(r.recommendation || r.advice || 'Enhance portfolio test coverage and deployment pipelines.').trim()
    };
  });

  // 9. Interview Plan & Questions
  let interviewPlan = [];
  if (Array.isArray(raw.interviewPlan) && raw.interviewPlan.length) {
    interviewPlan = raw.interviewPlan.map(item => ({
      topic: String(item.topic || 'System Design').trim(),
      reason: String(item.reason || 'Core competency evaluation').trim(),
      sampleQuestion: item.sampleQuestion ? String(item.sampleQuestion).trim() : `Discuss your design choices in your flagship projects.`
    }));
  } else {
    interviewPlan = [
      { topic: 'System Architecture', reason: 'Assess modularity and separation of concerns', sampleQuestion: 'How would you scale your primary repository architecture?' },
      { topic: 'Concurrency & Performance', reason: 'Assess efficiency and thread safety', sampleQuestion: 'Explain performance trade-offs in your codebase.' }
    ];
  }

  const interviewQuestions = Array.isArray(raw.interviewQuestions)
    ? raw.interviewQuestions.map(q => ({
        question: String(q.question || '').trim(),
        category: String(q.category || 'Architecture').trim(),
        difficulty: ['hard', 'medium', 'easy'].includes(String(q.difficulty).toLowerCase()) ? String(q.difficulty).toLowerCase() : 'medium',
        rationale: String(q.rationale || 'Verify candidate depth').trim()
      })).filter(q => q.question.length > 0)
    : [];

  // 10. Resume Highlights & Evidence
  const resumeHighlights = Array.isArray(raw.resumeHighlights)
    ? raw.resumeHighlights.map(h => String(h).trim()).filter(Boolean)
    : strengths.slice(0, 3);

  const resumeEvidence = (raw.resumeEvidence && typeof raw.resumeEvidence === 'object' && !Array.isArray(raw.resumeEvidence))
    ? raw.resumeEvidence
    : {};

  // 11. Portfolio Showcase
  const rawShowcase = (raw.portfolioShowcase && typeof raw.portfolioShowcase === 'object' && !Array.isArray(raw.portfolioShowcase))
    ? raw.portfolioShowcase
    : {};

  const topRepos = portfolioContext?.repositories || [];
  const primaryRepo = topRepos[0] || {};
  const secondaryRepo = topRepos[1] || primaryRepo;

  const portfolioShowcase = {};
  for (const key of SHOWCASE_KEYS) {
    const item = rawShowcase[key] || {};
    const fallbackRepo = key === 'resumeProject' ? primaryRepo : secondaryRepo;

    portfolioShowcase[key] = {
      repoName: item.repoName ? String(item.repoName).trim() : (fallbackRepo.name || 'portfolio-project'),
      repoUrl: item.repoUrl ? String(item.repoUrl).trim() : (fallbackRepo.htmlUrl || `https://github.com/${portfolioContext?.profile?.username || 'developer'}`),
      language: item.language ? String(item.language).trim() : (fallbackRepo.languages?.[0] || 'Code'),
      stars: clamp(item.stars != null ? item.stars : fallbackRepo.stars, 0, 10000000, 0),
      reason: item.reason ? String(item.reason).trim() : `Key showcase project demonstrating engineering capability.`,
      score: clamp(item.score, 0, 100, 85)
    };
  }

  // 12. Candidate Roadmap
  const rawRoadmap = raw.candidateRoadmap || raw.learningRoadmap || {};
  const timeline = rawRoadmap.timeline || rawRoadmap;

  const candidateRoadmap = {
    nextCareerStep: typeof rawRoadmap.nextCareerStep === 'string' && rawRoadmap.nextCareerStep.trim()
      ? rawRoadmap.nextCareerStep.trim()
      : `Staff ${developerType}`,
    skillsToExpand: Array.isArray(rawRoadmap.skillsToExpand)
      ? rawRoadmap.skillsToExpand.map(s => String(s).trim()).filter(Boolean)
      : ['Distributed Systems', 'Cloud Architecture', 'Automated CI/CD'],
    timeline: {
      month1: {
        focus: timeline?.month1?.focus || 'System Architecture & Modularity',
        tasks: Array.isArray(timeline?.month1?.tasks) ? timeline.month1.tasks.map(t => String(t).trim()).filter(Boolean) : ['Refactor core components for modularity', 'Add comprehensive test coverage']
      },
      month2: {
        focus: timeline?.month2?.focus || 'Scalability & Performance Benchmarking',
        tasks: Array.isArray(timeline?.month2?.tasks) ? timeline.month2.tasks.map(t => String(t).trim()).filter(Boolean) : ['Profile memory and CPU utilization', 'Implement caching and indexing']
      },
      month3: {
        focus: timeline?.month3?.focus || 'Production Readiness & Open Source Scale',
        tasks: Array.isArray(timeline?.month3?.tasks) ? timeline.month3.tasks.map(t => String(t).trim()).filter(Boolean) : ['Publish automated release pipeline', 'Expand documentation and developer guides']
      },
      goal: typeof timeline?.goal === 'string' && timeline.goal.trim()
        ? timeline.goal.trim()
        : 'Reach staff-level engineering leadership and production excellence.'
    }
  };

  // 13. Top Projects — ONE deterministic scorer (projectFactSheet.js), not
  // the old star-count threshold (95/85/75) that lived here before. Prefer
  // the README-enriched, balanced selection when available so the score
  // reflects real documentation/activity/size signal, not just stars.
  const factSheetSource = (portfolioContext?.selectedRepositories?.length
    ? portfolioContext.selectedRepositories
    : topRepos);
  const factSheet = buildProjectFactSheet(factSheetSource, null, factSheetSource.length || 5);
  const topProjects = getDeterministicTopProjects(factSheet, 5);

  return {
    careerScore,
    confidence,
    confidenceReason,
    developerType,
    seniority,
    recommendedRole,
    recommendedTeam,
    hireDecision,
    scoreBreakdown,
    roleFit,
    teamFit,
    executiveSummary,
    technicalSummary,
    hiringRecommendation,
    interviewFocus,
    riskAreas,
    strengths,
    concerns,
    portfolioGaps,
    recommendations,
    interviewPlan,
    interviewQuestions,
    resumeHighlights,
    resumeEvidence,
    portfolioShowcase,
    candidateRoadmap,
    topProjects
  };
}

export default {
  AnalysisValidationError,
  validateAndSanitizeAnalysis
};
