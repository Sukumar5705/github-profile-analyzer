/**
 * ai.controller.js
 *
 * Phase 6/13/14 — AI Hiring Intelligence & Insights Endpoint
 * POST /api/analysis/:username/generate-ai
 */

import profileRepo from '../repositories/profile.repository.js';
import skillRepo from '../repositories/skill.repository.js';
import analysisRepo from '../repositories/analysis.repository.js';
import repositoryRepo from '../repositories/repository.repository.js';
import { mapProfileAnalysisResponse } from '../mappers/profileAnalysis.mapper.js';
import logger from '../utils/logger.js';

/**
 * POST /api/analysis/:username/generate-ai
 * Returns unified AI evaluation report for a stored profile.
 */
const generateAI = async (req, res, next) => {
  try {
    const { username } = req.params;
    logger.info(`[AI Controller] Retrieving AI report for ${username}`);

    const profile = await profileRepo.findByUsername(username);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Run POST /api/github/analyze/:username first.'
      });
    }

    const [skills, analysis, repositories] = await Promise.all([
      skillRepo.findByProfileId(profile.id),
      analysisRepo.findByProfileId(profile.id),
      repositoryRepo.findByProfileId(profile.id)
    ]);

    if (!analysis) {
      return res.status(400).json({
        success: false,
        message: 'No analysis found for this profile. Run POST /api/github/analyze/:username first.'
      });
    }

    const mapped = mapProfileAnalysisResponse({
      profile,
      skills,
      analysis,
      repositories
    });

    const aiSummary = {
      summary: mapped.executiveSummary || `Analysis completed for ${profile.username}.`,
      technicalSummary: mapped.technicalSummary,
      hiringRecommendation: mapped.hiringRecommendation,
      strengths: mapped.strengths,
      improvements: mapped.portfolioGaps.map(g => (typeof g === 'object' ? (g.advice || g.area) : String(g)))
    };

    const roadmap = mapped.candidateRoadmap || {
      nextCareerStep: 'Staff Software Architect',
      skillsToExpand: ['Distributed Systems', 'Performance Profiling', 'CI/CD Automation'],
      timeline: {
        month1: { focus: 'Architecture & Modularity', tasks: ['Refactor core components', 'Enhance unit testing'] },
        month2: { focus: 'Scalability & Performance', tasks: ['Profile bottlenecks', 'Add caching layer'] },
        month3: { focus: 'Production Readiness', tasks: ['Setup deployment pipelines', 'Publish documentation'] },
        goal: 'Achieve advanced engineering leadership.'
      }
    };

    const portfolioReview = {
      verdict: mapped.hireDecision || 'Hire',
      seniority: mapped.seniority,
      recommendedRole: mapped.recommendedRole,
      recommendedTeam: mapped.recommendedTeam,
      strengths: mapped.strengths,
      weaknesses: mapped.concerns,
      recruiterImpression: mapped.recruiterSummary || mapped.executiveSummary,
      scoreBreakdown: mapped.scoreBreakdown,
      roleFit: mapped.roleFit,
      teamFit: mapped.teamFit,
      interviewPlan: mapped.interviewPlan
    };

    res.status(200).json({
      success: true,
      message: 'AI report generated successfully',
      data: {
        username: profile.username,
        careerScore: mapped.careerScore,
        confidence: mapped.confidence,
        confidenceReason: mapped.confidenceReason,
        hireDecision: mapped.hireDecision,
        seniority: mapped.seniority,
        recommendedRole: mapped.recommendedRole,
        recommendedTeam: mapped.recommendedTeam,
        aiSummary,
        roadmap,
        candidateRoadmap: roadmap,
        portfolioReview,
        resumeHighlights: mapped.resumeHighlights,
        resumeEvidence: mapped.resumeEvidence,
        portfolioShowcase: mapped.portfolioShowcase,
        interviewPlan: mapped.interviewPlan,
        roleFit: mapped.roleFit,
        teamFit: mapped.teamFit
      }
    });
  } catch (err) {
    next(err);
  }
};

export { generateAI };
export default { generateAI };
