/**
 * analysisResponseSchema.js
 *
 * OpenAPI schema contract for Gemini structured output generation.
 * Defines types and constraints for the AI Recruiter / Hiring Intelligence Platform.
 */

export const REQUIRED_TOP_LEVEL_KEYS = [
  'careerScore',
  'confidence',
  'confidenceReason',
  'developerType',
  'seniority',
  'recommendedRole',
  'recommendedTeam',
  'hireDecision',
  'scoreBreakdown',
  'roleFit',
  'teamFit',
  'executiveSummary',
  'technicalSummary',
  'hiringRecommendation',
  'interviewFocus',
  'riskAreas',
  'strengths',
  'concerns',
  'portfolioGaps',
  'recommendations',
  'interviewPlan',
  'resumeHighlights',
  'portfolioShowcase',
  'candidateRoadmap'
];

export const VALID_SEVERITIES = new Set(['high', 'medium', 'low']);
export const VALID_PRIORITIES = new Set(['high', 'medium', 'low']);
export const VALID_HIRE_DECISIONS = new Set(['Strong Hire', 'Hire', 'Leaning Hire', 'Leaning No Hire', 'No Hire']);
export const VALID_SENIORITIES = new Set(['Principal Engineer', 'Staff Engineer', 'Senior Engineer', 'Mid-Level Engineer', 'Junior Engineer', 'Lead Engineer']);

export const SHOWCASE_KEYS = [
  'resumeProject',
  'technicalProject',
  'recruiterProject',
  'architectureProject'
];

export const ROADMAP_MONTHS = ['month1', 'month2', 'month3'];

export const GEMINI_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    careerScore: { type: 'INTEGER' },
    confidence: { type: 'INTEGER' },
    confidenceReason: { type: 'STRING' },
    developerType: { type: 'STRING' },
    seniority: { type: 'STRING' },
    recommendedRole: { type: 'STRING' },
    recommendedTeam: { type: 'STRING' },
    hireDecision: { type: 'STRING' },
    scoreBreakdown: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          category: { type: 'STRING' },
          score: { type: 'INTEGER' },
          reason: { type: 'STRING' }
        },
        required: ['category', 'score', 'reason']
      }
    },
    roleFit: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          role: { type: 'STRING' },
          fit: { type: 'INTEGER' },
          reason: { type: 'STRING' }
        },
        required: ['role', 'fit']
      }
    },
    teamFit: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    executiveSummary: { type: 'STRING' },
    technicalSummary: { type: 'STRING' },
    hiringRecommendation: { type: 'STRING' },
    interviewFocus: { type: 'STRING' },
    riskAreas: { type: 'STRING' },
    strengths: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    concerns: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    portfolioGaps: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          area: { type: 'STRING' },
          severity: { type: 'STRING' },
          advice: { type: 'STRING' }
        },
        required: ['area', 'severity', 'advice']
      }
    },
    recommendations: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          priority: { type: 'STRING' },
          recommendation: { type: 'STRING' }
        },
        required: ['priority', 'recommendation']
      }
    },
    interviewPlan: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          topic: { type: 'STRING' },
          reason: { type: 'STRING' },
          sampleQuestion: { type: 'STRING' }
        },
        required: ['topic', 'reason']
      }
    },
    interviewQuestions: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          question: { type: 'STRING' },
          category: { type: 'STRING' },
          difficulty: { type: 'STRING' },
          rationale: { type: 'STRING' }
        },
        required: ['question', 'category']
      }
    },
    resumeHighlights: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    portfolioShowcase: {
      type: 'OBJECT',
      properties: {
        resumeProject: {
          type: 'OBJECT',
          properties: {
            repoName: { type: 'STRING' },
            repoUrl: { type: 'STRING' },
            language: { type: 'STRING' },
            stars: { type: 'INTEGER' },
            reason: { type: 'STRING' },
            score: { type: 'INTEGER' }
          },
          required: ['repoName', 'reason']
        },
        technicalProject: {
          type: 'OBJECT',
          properties: {
            repoName: { type: 'STRING' },
            repoUrl: { type: 'STRING' },
            language: { type: 'STRING' },
            stars: { type: 'INTEGER' },
            reason: { type: 'STRING' },
            score: { type: 'INTEGER' }
          },
          required: ['repoName', 'reason']
        },
        recruiterProject: {
          type: 'OBJECT',
          properties: {
            repoName: { type: 'STRING' },
            repoUrl: { type: 'STRING' },
            language: { type: 'STRING' },
            stars: { type: 'INTEGER' },
            reason: { type: 'STRING' },
            score: { type: 'INTEGER' }
          },
          required: ['repoName', 'reason']
        },
        architectureProject: {
          type: 'OBJECT',
          properties: {
            repoName: { type: 'STRING' },
            repoUrl: { type: 'STRING' },
            language: { type: 'STRING' },
            stars: { type: 'INTEGER' },
            reason: { type: 'STRING' },
            score: { type: 'INTEGER' }
          },
          required: ['repoName', 'reason']
        }
      }
    },
    candidateRoadmap: {
      type: 'OBJECT',
      properties: {
        nextCareerStep: { type: 'STRING' },
        skillsToExpand: { type: 'ARRAY', items: { type: 'STRING' } },
        timeline: {
          type: 'OBJECT',
          properties: {
            month1: {
              type: 'OBJECT',
              properties: { focus: { type: 'STRING' }, tasks: { type: 'ARRAY', items: { type: 'STRING' } } },
              required: ['focus', 'tasks']
            },
            month2: {
              type: 'OBJECT',
              properties: { focus: { type: 'STRING' }, tasks: { type: 'ARRAY', items: { type: 'STRING' } } },
              required: ['focus', 'tasks']
            },
            month3: {
              type: 'OBJECT',
              properties: { focus: { type: 'STRING' }, tasks: { type: 'ARRAY', items: { type: 'STRING' } } },
              required: ['focus', 'tasks']
            },
            goal: { type: 'STRING' }
          },
          required: ['month1', 'month2', 'month3', 'goal']
        }
      },
      required: ['nextCareerStep', 'skillsToExpand', 'timeline']
    }
  },
  required: REQUIRED_TOP_LEVEL_KEYS
};

export default {
  REQUIRED_TOP_LEVEL_KEYS,
  VALID_SEVERITIES,
  VALID_PRIORITIES,
  VALID_HIRE_DECISIONS,
  VALID_SENIORITIES,
  SHOWCASE_KEYS,
  ROADMAP_MONTHS,
  GEMINI_RESPONSE_SCHEMA
};
