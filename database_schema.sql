-- ============================================================
-- Developer Intelligence Platform — PostgreSQL Schema (Supabase)
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================


-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
    id               INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username         VARCHAR(255) UNIQUE NOT NULL,
    name             VARCHAR(255),
    bio              TEXT,
    location         VARCHAR(255),
    email            VARCHAR(255),
    blog             VARCHAR(500),
    company          VARCHAR(255),
    public_repos     INT         DEFAULT 0,
    followers        INT         DEFAULT 0,
    following        INT         DEFAULT 0,
    account_age_days INT         DEFAULT 0,
    profile_url      VARCHAR(500),
    avatar_url       VARCHAR(500),
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_username   ON profiles (username);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON profiles (updated_at);

-- Trigger function: sets NEW.updated_at — used by the profiles trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- REPOSITORIES
-- UNIQUE(profile_id, repo_name) enables INSERT ... ON CONFLICT upsert
-- ============================================================
CREATE TABLE IF NOT EXISTS repositories (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    profile_id  INT          NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    repo_name   VARCHAR(255) NOT NULL,
    description TEXT,
    language    VARCHAR(100),
    stars       INT         DEFAULT 0,
    forks       INT         DEFAULT 0,
    watchers    INT         DEFAULT 0,
    size_kb     INT         DEFAULT 0,
    has_readme  BOOLEAN     DEFAULT FALSE,
    topics      JSONB       DEFAULT '[]'::jsonb,
    repo_url    VARCHAR(500),
    homepage    VARCHAR(500),
    is_fork     BOOLEAN     DEFAULT FALSE,
    pushed_at   TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT unique_profile_repo UNIQUE (profile_id, repo_name)
);

CREATE INDEX IF NOT EXISTS idx_repos_profile_id ON repositories (profile_id);
CREATE INDEX IF NOT EXISTS idx_repos_language   ON repositories (language);
CREATE INDEX IF NOT EXISTS idx_repos_stars      ON repositories (stars);


-- ============================================================
-- SKILLS
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    profile_id  INT          NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill       VARCHAR(100) NOT NULL,
    confidence  NUMERIC(4,2) NOT NULL,
    created_at  TIMESTAMPTZ  DEFAULT NOW(),

    CONSTRAINT unique_profile_skill UNIQUE (profile_id, skill)
);

CREATE INDEX IF NOT EXISTS idx_skills_profile_id ON skills (profile_id);
CREATE INDEX IF NOT EXISTS idx_skills_skill      ON skills (skill);


-- ============================================================
-- ANALYSIS RESULTS  (latest snapshot per profile)
-- ============================================================
CREATE TABLE IF NOT EXISTS analysis_results (
    id                    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    profile_id            INT UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    -- Career Score
    career_score          INT  DEFAULT 0,
    score_documentation   INT  DEFAULT 0,
    score_diversity       INT  DEFAULT 0,
    score_deployment      INT  DEFAULT 0,
    score_tech_breadth    INT  DEFAULT 0,
    score_activity        INT  DEFAULT 0,
    score_open_source     INT  DEFAULT 0,

    -- Summary stats
    total_stars           INT  DEFAULT 0,
    total_forks           INT  DEFAULT 0,
    most_used_language    VARCHAR(100),
    top_projects          JSONB DEFAULT '[]'::jsonb,

    -- Sprint 3: Developer Type
    developer_type        VARCHAR(100),
    developer_confidence  NUMERIC(4,2),
    developer_reasons     JSONB DEFAULT '[]'::jsonb,

    -- Sprint 3: Recruiter Layer
    strengths             JSONB DEFAULT '[]'::jsonb,
    concerns              JSONB DEFAULT '[]'::jsonb,
    gaps                  JSONB DEFAULT '[]'::jsonb,
    recommendations       JSONB DEFAULT '[]'::jsonb,

    -- AI Native Hiring Intelligence
    analysis_json         JSONB DEFAULT '{}'::jsonb,

    analyzed_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analysis_profile_id   ON analysis_results (profile_id);
CREATE INDEX IF NOT EXISTS idx_analysis_career_score ON analysis_results (career_score);

-- Fix: separate trigger function that updates analyzed_at (not updated_at)
-- analysis_results has no updated_at column — using set_updated_at() here
-- would throw: ERROR: record "new" has no field "updated_at"
CREATE OR REPLACE FUNCTION set_analyzed_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.analyzed_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_analysis_updated_at ON analysis_results;
CREATE TRIGGER trg_analysis_updated_at
    BEFORE UPDATE ON analysis_results
    FOR EACH ROW EXECUTE FUNCTION set_analyzed_at();


-- ============================================================
-- ANALYSIS HISTORY  (append-only — score evolution over time)
-- ============================================================
CREATE TABLE IF NOT EXISTS analysis_history (
    id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    profile_id   INT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    career_score INT NOT NULL,
    analyzed_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_history_profile_id  ON analysis_history (profile_id);
CREATE INDEX IF NOT EXISTS idx_history_analyzed_at ON analysis_history (analyzed_at);
