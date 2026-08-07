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
             has_readme  = EXCLUDED.has_readme,
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
}

export default new RepositoryRepository();
