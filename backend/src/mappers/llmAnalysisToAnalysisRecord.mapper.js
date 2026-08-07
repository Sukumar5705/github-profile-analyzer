/**
 * llmAnalysisToAnalysisRecord.mapper.js
 *
 * Maps validated LLM analysis output and developer evidence into the
 * shape required by analysis.repository.js and database persistence.
 */

/**
 * Transforms validated analysis and developer evidence into a database-ready analysis record.
 * @param {object} validated - Validated analysis object from analysisValidator.js
 * @param {object} evidence - DeveloperEvidence object from evidenceBuilder.js
 * @returns {object} Analysis record payload for analysis.repository.js
 */
export function toAnalysisRecord(validated, evidence = null) {
  const profile = evidence?.profile || {};

  const highlights = [];
  if (validated.hiringRecommendation) {
    highlights.push(validated.hiringRecommendation);
  }
  if (Array.isArray(validated.strengths)) {
    highlights.push(...validated.strengths.slice(0, 2));
  }

  const worstSeverity = (validated.portfolioGaps || []).some(g => g.severity === 'high')
    ? 'high'
    : ((validated.portfolioGaps || []).some(g => g.severity === 'medium') ? 'medium' : 'low');

  return {
    careerScore: validated.careerScore,
    totalStars: profile.totalStars ?? (validated.topProjects || []).reduce((s, p) => s + (p.stars || 0), 0),
    totalForks: profile.totalForks ?? 0,
    mostUsedLanguage: profile.mostUsedLanguage || (validated.topProjects?.[0]?.language || 'Unknown'),
    topProjects: validated.topProjects || [],
    developerType: validated.developerType,
    recruiter: {
      strengths: validated.strengths || [],
      concerns: validated.weaknesses || [],
      highlights: highlights
    },
    gaps: {
      gaps: validated.portfolioGaps || [],
      overallSeverity: worstSeverity
    },
    recommendations: validated.recommendations || [],
    executiveSummary: validated.executiveSummary,
    hiringRecommendation: validated.hiringRecommendation,
    recruiterSummary: validated.recruiterSummary,
    resumeEvidence: validated.resumeEvidence || {},
    portfolioShowcase: validated.portfolioShowcase || {},
    learningRoadmap: validated.learningRoadmap || {}
  };
}

export default {
  toAnalysisRecord
};
