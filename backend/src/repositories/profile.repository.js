import db from '../config/db.js';

class ProfileRepository {
  /**
   * Find a profile by username.
   */
  async findByUsername(username) {
    const { rows } = await db.query(
      'SELECT * FROM profiles WHERE username = $1 LIMIT 1',
      [username]
    );
    return rows[0] || null;
  }

  /**
   * Find a profile by primary key.
   */
  async findById(id) {
    const { rows } = await db.query(
      'SELECT * FROM profiles WHERE id = $1 LIMIT 1',
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Insert a new profile row.
   * @returns {Promise<number>} the new row id
   */
  async create(data) {
    const { rows } = await db.query(
      `INSERT INTO profiles
       (username, name, bio, location, email, blog, company,
        public_repos, followers, following, account_age_days,
        profile_url, avatar_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING id`,
      [
        data.username, data.name, data.bio, data.location, data.email,
        data.blog, data.company, data.public_repos, data.followers,
        data.following, data.account_age_days, data.profile_url, data.avatar_url
      ]
    );
    return rows[0].id;
  }

  /**
   * Update an existing profile row.
   * updated_at is handled automatically by the DB trigger.
   */
  async update(username, data) {
    await db.query(
      `UPDATE profiles
       SET name = $1, bio = $2, location = $3, email = $4, blog = $5,
           company = $6, public_repos = $7, followers = $8, following = $9,
           account_age_days = $10, profile_url = $11, avatar_url = $12
       WHERE username = $13`,
      [
        data.name, data.bio, data.location, data.email, data.blog,
        data.company, data.public_repos, data.followers, data.following,
        data.account_age_days, data.profile_url, data.avatar_url, username
      ]
    );
  }

  /**
   * Delete a profile by username.
   * @returns {Promise<boolean>}
   */
  async delete(username) {
    const { rowCount } = await db.query(
      'DELETE FROM profiles WHERE username = $1',
      [username]
    );
    return rowCount > 0;
  }

  /**
   * Return a paginated list of profiles.
   */
  async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { rows: countRows } = await db.query('SELECT COUNT(*)::int AS total FROM profiles');
    const total = countRows[0].total;

    const { rows: profiles } = await db.query(
      'SELECT * FROM profiles ORDER BY updated_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return { profiles, total };
  }

  /**
   * Search profiles by partial username match.
   */
  async search(query) {
    const { rows } = await db.query(
      'SELECT * FROM profiles WHERE username ILIKE $1 ORDER BY updated_at DESC',
      [`%${query}%`]
    );
    return rows;
  }
}

export default new ProfileRepository();
