import db from '../config/db.js';

class RepositoryRepository {
  /**
   * Upsert repositories for a profile.
   * PostgreSQL equivalent of MySQL's ON DUPLICATE KEY UPDATE.
   * Requires UNIQUE(profile_id, repo_name) — already in the schema.
   * @param {number} profileId
   * @param {Array}  repos
   */
  async upsertForProfile(profileId, repos) {
    if (!repos.length) return;

    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // NOTE: has_readme is deliberately absent from the DO UPDATE SET list
      // below. A fresh GitHub fetch never knows the real README state (the
      // mapper always sends false for it), so overwriting it on every
      // conflict would erase whatever repoEnrichment.service.js previously
      // learned. It's only ever updated by saveReadmeCache().
      for (const r of repos) {
        await client.query(
          `INSERT INTO repositories
           (profile_id, repo_name, description, language, stars, forks,
            watchers, size_kb, has_readme, topics, repo_url, homepage,
            is_fork, pushed_at)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
           ON CONFLICT (profile_id, repo_name) DO UPDATE SET
             description = EXCLUDED.description,
             language    = EXCLUDED.language,
             stars       = EXCLUDED.stars,
             forks       = EXCLUDED.forks,
             watchers    = EXCLUDED.watchers,
             size_kb     = EXCLUDED.size_kb,
             topics      = EXCLUDED.topics,
             repo_url    = EXCLUDED.repo_url,
             homepage    = EXCLUDED.homepage,
             is_fork     = EXCLUDED.is_fork,
             pushed_at   = EXCLUDED.pushed_at`,
          [
            profileId,
            r.name,
            r.description,
            r.language,
            r.stars,
            r.forks,
            r.watchers,
            r.size_kb,
            r.has_readme,
            JSON.stringify(r.topics),
            r.html_url,
            r.homepage,
            r.is_fork,
            r.pushed_at ? new Date(r.pushed_at) : null
          ]
        );
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Find all repositories for a profile, ordered by stars descending.
   * @param {number} profileId
   * @returns {Promise<Array>}
   */
  async findByProfileId(profileId) {
    const { rows } = await db.query(
      'SELECT * FROM repositories WHERE profile_id = $1 ORDER BY stars DESC',
      [profileId]
    );
    return rows;
  }

  /**
   * Reads cached README state for a set of repos belonging to a profile.
   * Used by repoEnrichment.service.js to decide which candidate-pool repos
   * still need a live GitHub fetch.
   * @param {number} profileId
   * @param {Array<string>} repoNames
   * @returns {Promise<Map<string, {has_readme: boolean, readme_excerpt: string|null, readme_checked_at: Date|null}>>}
   */
  async getReadmeCache(profileId, repoNames) {
    if (!repoNames.length) return new Map();
    const { rows } = await db.query(
      `SELECT repo_name, has_readme, readme_excerpt, readme_checked_at
       FROM repositories
       WHERE profile_id = $1 AND repo_name = ANY($2::text[])`,
      [profileId, repoNames]
    );
    return new Map(rows.map(r => [r.repo_name, r]));
  }

  /**
   * Persists freshly-fetched README state for a set of repos. Only ever
   * called for the candidate pool (~20-25 repos), never for every fetched
   * repo, and never overwrites any other repo column.
   * @param {number} profileId
   * @param {Map<string, {hasReadme: boolean, excerpt: string|null}>} readmeMap
   */
  async saveReadmeCache(profileId, readmeMap) {
    if (!readmeMap.size) return;
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      for (const [repoName, readme] of readmeMap.entries()) {
        await client.query(
          `UPDATE repositories
           SET has_readme = $3, readme_excerpt = $4, readme_checked_at = NOW()
           WHERE profile_id = $1 AND repo_name = $2`,
          [profileId, repoName, readme.hasReadme, readme.excerpt]
        );
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

export default new RepositoryRepository();
