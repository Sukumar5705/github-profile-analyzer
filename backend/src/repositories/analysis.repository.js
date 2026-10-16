/**
 * analysis.repository.js
 *
 * Phase 15 — Database Layer with JSONB analysis_json Support
 * Stores profile analysis records with auto-migration resilience.
 */

import db from '../config/db.js';
import logger from '../utils/logger.js';

class AnalysisRepository {
  constructor() {
    this._initialized = false;
  }

  /**
   * Ensures necessary columns like analysis_json exist in the database table.
   */
  async ensureSchema() {
    if (this._initialized) return;
    try {
      await db.query(`
        ALTER TABLE analysis_results
        ADD COLUMN IF NOT EXISTS analysis_json JSONB DEFAULT '{}'::jsonb;
      `);
      this._initialized = true;
    } catch (err) {
      logger.warn(`[AnalysisRepo] Schema check warning: ${err.message}`);
    }
  }

  /**
   * Upsert the latest analysis result for a profile.
   * PostgreSQL ON CONFLICT replaces MySQL ON DUPLICATE KEY UPDATE.
   * @param {number} profileId
   * @param {object} data
   */
  async save(profileId, data) {
    await this.ensureSchema();

    const analysisJson = {
      careerScore: data.careerScore,
      confidence: data.confidence,
      confidenceReason: data.confidenceReason,
      developerType: data.developerType,
      seniority: data.seniority,
      recommendedRole: data.recommendedRole,
      recommendedTeam: data.recommendedTeam,
      hireDecision: data.hireDecision,
      scoreBreakdown: data.scoreBreakdown || [],
      roleFit: data.roleFit || [],
      teamFit: data.teamFit || [],
      executiveSummary: data.executiveSummary,
      technicalSummary: data.technicalSummary,
      hiringRecommendation: data.hiringRecommendation,
      interviewFocus: data.interviewFocus,
      riskAreas: data.riskAreas,
      strengths: data.strengths || [],
      concerns: data.concerns || [],
      portfolioGaps: data.portfolioGaps || [],
      recommendations: data.recommendations || [],
      interviewPlan: data.interviewPlan || [],
      interviewQuestions: data.interviewQuestions || [],
      resumeHighlights: data.resumeHighlights || [],
      resumeEvidence: data.resumeEvidence || {},
      portfolioShowcase: data.portfolioShowcase || {},
      candidateRoadmap: data.candidateRoadmap || {},
      topProjects: data.topProjects || []
    };

    await db.query(
      `INSERT INTO analysis_results
       (profile_id, career_score, score_documentation, score_diversity,
        score_deployment, score_tech_breadth, score_activity,
        score_open_source, total_stars, total_forks,
        most_used_language, top_projects,
        developer_type, developer_confidence, developer_reasons,
        strengths, concerns, gaps, recommendations,
        executive_summary, hiring_recommendation, recruiter_summary,
        resume_evidence, portfolio_showcase, learning_roadmap,
        analysis_json)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26)
       ON CONFLICT (profile_id) DO UPDATE SET
         career_score          = EXCLUDED.career_score,
         score_documentation   = EXCLUDED.score_documentation,
         score_diversity       = EXCLUDED.score_diversity,
         score_deployment      = EXCLUDED.score_deployment,
         score_tech_breadth    = EXCLUDED.score_tech_breadth,
         score_activity        = EXCLUDED.score_activity,
         score_open_source     = EXCLUDED.score_open_source,
         total_stars           = EXCLUDED.total_stars,
         total_forks           = EXCLUDED.total_forks,
         most_used_language    = EXCLUDED.most_used_language,
         top_projects          = EXCLUDED.top_projects,
         developer_type        = EXCLUDED.developer_type,
         developer_confidence  = EXCLUDED.developer_confidence,
         developer_reasons     = EXCLUDED.developer_reasons,
         strengths             = EXCLUDED.strengths,
         concerns              = EXCLUDED.concerns,
         gaps                  = EXCLUDED.gaps,
         recommendations       = EXCLUDED.recommendations,
         executive_summary     = EXCLUDED.executive_summary,
         hiring_recommendation = EXCLUDED.hiring_recommendation,
         recruiter_summary     = EXCLUDED.recruiter_summary,
         resume_evidence       = EXCLUDED.resume_evidence,
         portfolio_showcase    = EXCLUDED.portfolio_showcase,
         learning_roadmap      = EXCLUDED.learning_roadmap,
         analysis_json         = EXCLUDED.analysis_json,
         analyzed_at           = NOW()`,
      [
        profileId,
        data.careerScore ?? 0,
        0, // legacy score columns maintained as 0 or safe defaults
        0,
        0,
        0,
        0,
        0,
        data.summary?.totalStars ?? 0,
        data.summary?.totalForks ?? 0,
        data.summary?.mostUsedLanguage ?? 'Unknown',
        JSON.stringify(data.topProjects || []),
        data.developerType || null,
        (data.confidence != null ? data.confidence / 100 : 0.9),
        JSON.stringify(data.teamFit || []),
        JSON.stringify(data.strengths || []),
        JSON.stringify(data.concerns || []),
        JSON.stringify(data.portfolioGaps || []),
        JSON.stringify(data.recommendations || []),
        data.executiveSummary || null,
        data.hiringRecommendation || null,
        data.recruiterSummary || data.executiveSummary || null,
        JSON.stringify(data.resumeEvidence || {}),
        JSON.stringify(data.portfolioShowcase || {}),
        JSON.stringify(data.candidateRoadmap || {}),
        JSON.stringify(analysisJson)
      ]
    );
  }

  /**
   * Append a career score snapshot to the history table.
   * @param {number} profileId
   * @param {number} careerScore
   */
  async appendHistory(profileId, careerScore) {
    await db.query(
      'INSERT INTO analysis_history (profile_id, career_score) VALUES ($1, $2)',
      [profileId, careerScore]
    );
  }

  /**
   * Find the latest analysis result for a profile.
   * @param {number} profileId
   * @returns {Promise<object|null>}
   */
  async findByProfileId(profileId) {
    await this.ensureSchema();
    const { rows } = await db.query(
      'SELECT * FROM analysis_results WHERE profile_id = $1 LIMIT 1',
      [profileId]
    );
    return rows[0] || null;
  }

  /**
   * Return score history for a profile, oldest first.
   * @param {number} profileId
   * @param {number} limit
   * @returns {Promise<Array>}
   */
  async getHistory(profileId, limit = 20) {
    const { rows } = await db.query(
      `SELECT career_score, analyzed_at
       FROM analysis_history
       WHERE profile_id = $1
       ORDER BY analyzed_at ASC
       LIMIT $2`,
      [profileId, limit]
    );
    return rows;
  }
}

export default new AnalysisRepository();
