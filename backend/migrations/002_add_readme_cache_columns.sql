-- ============================================================
-- Migration: README enrichment cache
-- Additive-only schema migration for the repositories table.
--
-- readme_excerpt / readme_checked_at are populated only for repos chosen
-- by the candidate-pool selection in repoSelection.js / portfolioContext
-- .service.js — not for every repository fetched from GitHub. They let
-- repoEnrichment.service.js skip re-fetching a repo's README on a later
-- re-analysis when the repo hasn't been pushed to since the last check.
-- ============================================================

ALTER TABLE repositories
    ADD COLUMN IF NOT EXISTS readme_excerpt    TEXT NULL,
    ADD COLUMN IF NOT EXISTS readme_checked_at TIMESTAMPTZ NULL;
