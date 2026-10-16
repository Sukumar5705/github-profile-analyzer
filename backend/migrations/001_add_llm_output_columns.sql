-- ============================================================
-- Migration: Add LLM Analysis Output Columns
-- Additive-only schema migration for analysis_results table.
-- ============================================================

ALTER TABLE analysis_results
    ADD COLUMN IF NOT EXISTS executive_summary   TEXT NULL,
    ADD COLUMN IF NOT EXISTS hiring_recommendation TEXT NULL,
    ADD COLUMN IF NOT EXISTS recruiter_summary   TEXT NULL,
    ADD COLUMN IF NOT EXISTS resume_evidence     JSONB NULL,
    ADD COLUMN IF NOT EXISTS portfolio_showcase   JSONB NULL,
    ADD COLUMN IF NOT EXISTS learning_roadmap    JSONB NULL;
