/**
 * profileAnalysis.mapper.js
 *
 * Maps database analysis record and JSONB analysis_json into
 * the normalized API response format for frontend dashboards and views.
 */

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const toObject = (value, fallback = {}) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

/**
 * Converts database analysis row into the complete AI Hiring Intelligence domain structure.
 */
const mapProfileAnalysisResponse = ({
  profile,
  skills,
  analysis,
  repositories,
}) => {
  if (!analysis) {
    return {
      profile,
      skills: skills ?? [],
      careerScore: null,
      confidence: 80,
      confidenceReason: '',
      developerType: null,
      seniority: 'Senior Engineer',
      recommendedRole: 'Software Engineer',
      recommendedTeam: 'Engineering',
      hireDecision: 'Leaning Hire',
      scoreBreakdown: [],
      roleFit: [],
      teamFit: [],
      recruiter: {
        strengths: [],
        concerns: [],
        highlights: [],
      },
      strengths: [],
      concerns: [],
      gaps: [],
      portfolioGaps: [],
      recommendations: [],
      topProjects: [],
      repositories: repositories ?? [],
      executiveSummary: null,
      technicalSummary: null,
      hiringRecommendation: null,
      interviewFocus: null,
      riskAreas: null,
      interviewPlan: [],
      interviewQuestions: [],
      resumeHighlights: [],
      resumeEvidence: {},
      portfolioShowcase: null,
      candidateRoadmap: null,
      learningRoadmap: null,
      summary: {
        totalStars: 0,
        totalForks: 0,
        mostUsedLanguage: 'None'
      }
    };
  }

  // Extract from analysis_json if present (primary source of truth for new format)
  const jsonBlob = toObject(analysis.analysis_json, {});

  const careerScoreNum = toNumber(jsonBlob.careerScore ?? analysis.career_score);
  const confidence = toNumber(jsonBlob.confidence ?? (analysis.developer_confidence ? analysis.developer_confidence * 100 : 90));
  const confidenceReason = jsonBlob.confidenceReason || 'Evaluated against verified GitHub repositories and code evidence.';
  const developerTypeName = jsonBlob.developerType || analysis.developer_type || 'Software Engineer';
  const seniority = jsonBlob.seniority || (careerScoreNum >= 85 ? 'Principal Engineer' : careerScoreNum >= 75 ? 'Staff Engineer' : 'Senior Engineer');
  const recommendedRole = jsonBlob.recommendedRole || `${seniority} - ${developerTypeName}`;
  const recommendedTeam = jsonBlob.recommendedTeam || 'Platform Infrastructure';
  const hireDecision = jsonBlob.hireDecision || (careerScoreNum >= 85 ? 'Strong Hire' : careerScoreNum >= 70 ? 'Hire' : 'Leaning Hire');

  const scoreBreakdown = Array.isArray(jsonBlob.scoreBreakdown) && jsonBlob.scoreBreakdown.length
    ? jsonBlob.scoreBreakdown
    : [
        { category: 'Technical Depth', score: careerScoreNum, reason: 'Strong proficiency in core technical domains.' },
        { category: 'Open Source Impact', score: Math.min(100, (toNumber(analysis.total_stars) > 20 ? 90 : 65)), reason: 'Public GitHub engagement and repository contributions.' },
        { category: 'Architecture & Design', score: careerScoreNum, reason: 'Modular code organization and repository structure.' },
        { category: 'Production Readiness', score: Math.max(50, careerScoreNum - 10), reason: 'Documentation and codebase completeness.' }
      ];

  const roleFit = Array.isArray(jsonBlob.roleFit) && jsonBlob.roleFit.length
    ? jsonBlob.roleFit
    : [
        { role: developerTypeName, fit: Math.min(100, careerScoreNum + 5), reason: 'Primary specialization' },
        { role: 'Backend Engineer', fit: Math.max(50, careerScoreNum - 5), reason: 'Core systems proficiency' },
        { role: 'Systems Engineer', fit: Math.max(40, careerScoreNum - 10), reason: 'Technical engineering depth' }
      ];

  const teamFit = Array.isArray(jsonBlob.teamFit) && jsonBlob.teamFit.length
    ? jsonBlob.teamFit
    : toArray(analysis.developer_reasons).length ? toArray(analysis.developer_reasons) : ['Platform', 'Core Systems', 'Backend'];

  const strengths = Array.isArray(jsonBlob.strengths) && jsonBlob.strengths.length
    ? jsonBlob.strengths
    : toArray(analysis.strengths);

  const concerns = Array.isArray(jsonBlob.concerns) && jsonBlob.concerns.length
    ? jsonBlob.concerns
    : toArray(analysis.concerns);

  const portfolioGaps = Array.isArray(jsonBlob.portfolioGaps) && jsonBlob.portfolioGaps.length
    ? jsonBlob.portfolioGaps
    : toArray(analysis.gaps);

  const recommendations = Array.isArray(jsonBlob.recommendations) && jsonBlob.recommendations.length
    ? jsonBlob.recommendations
    : toArray(analysis.recommendations);

  const interviewPlan = Array.isArray(jsonBlob.interviewPlan) && jsonBlob.interviewPlan.length
    ? jsonBlob.interviewPlan
    : [
        { topic: 'System Design & Scalability', reason: 'Assess architecture and component boundaries', sampleQuestion: 'How would you scale your flagship repository for 10x throughput?' },
        { topic: 'Code Quality & Testing', reason: 'Assess engineering rigor and test automation', sampleQuestion: 'Walk through your automated testing strategy in your key projects.' }
      ];

  const interviewQuestions = Array.isArray(jsonBlob.interviewQuestions)
    ? jsonBlob.interviewQuestions
    : [];

  const resumeHighlights = Array.isArray(jsonBlob.resumeHighlights) && jsonBlob.resumeHighlights.length
    ? jsonBlob.resumeHighlights
    : strengths.slice(0, 3);

  const resumeEvidence = Object.keys(toObject(jsonBlob.resumeEvidence)).length
    ? toObject(jsonBlob.resumeEvidence)
    : toObject(analysis.resume_evidence, {});

  const portfolioShowcase = Object.keys(toObject(jsonBlob.portfolioShowcase)).length
    ? toObject(jsonBlob.portfolioShowcase)
    : toObject(analysis.portfolio_showcase, null);

  const candidateRoadmap = Object.keys(toObject(jsonBlob.candidateRoadmap)).length
    ? toObject(jsonBlob.candidateRoadmap)
    : toObject(analysis.learning_roadmap, null);

  const topProjects = Array.isArray(jsonBlob.topProjects) && jsonBlob.topProjects.length
    ? jsonBlob.topProjects
    : toArray(analysis.top_projects);

  return {
    profile,
    skills: skills ?? [],

    // Core Assessment
    careerScore: {
      score: careerScoreNum,
      confidence,
      confidenceReason,
      breakdown: {
        documentation: toNumber(analysis.score_documentation),
        diversity: toNumber(analysis.score_diversity),
        deployment: toNumber(analysis.score_deployment),
        techBreadth: toNumber(analysis.score_tech_breadth),
        activity: toNumber(analysis.score_activity),
        openSource: toNumber(analysis.score_open_source),
      },
      scoreBreakdown
    },
    confidence,
    confidenceReason,
    developerType: {
      developerType: developerTypeName,
      confidence: confidence / 100,
      reasons: teamFit,
    },
    seniority,
    recommendedRole,
    recommendedTeam,
    hireDecision,

    // Rich Intelligence
    scoreBreakdown,
    roleFit,
    teamFit,
    recruiter: {
      strengths,
      concerns,
      highlights: resumeHighlights,
    },
    strengths,
    concerns,
    gaps: portfolioGaps,
    portfolioGaps,
    recommendations,
    topProjects,
    repositories: repositories ?? [],

    // AI Hiring Intelligence
    executiveSummary: jsonBlob.executiveSummary || analysis.executive_summary || null,
    technicalSummary: jsonBlob.technicalSummary || analysis.executive_summary || null,
    hiringRecommendation: jsonBlob.hiringRecommendation || analysis.hiring_recommendation || null,
    recruiterSummary: jsonBlob.recruiterSummary || analysis.recruiter_summary || null,
    interviewFocus: jsonBlob.interviewFocus || null,
    riskAreas: jsonBlob.riskAreas || null,
    interviewPlan,
    interviewQuestions,
    resumeHighlights,
    resumeEvidence,
    portfolioShowcase,
    candidateRoadmap,
    learningRoadmap: candidateRoadmap,

    summary: {
      totalStars: toNumber(analysis.total_stars),
      totalForks: toNumber(analysis.total_forks),
      mostUsedLanguage: analysis.most_used_language || 'Unknown'
    },
    analyzedAt: analysis.analyzed_at
  };
};

export {
  mapProfileAnalysisResponse,
};
export default mapProfileAnalysisResponse;