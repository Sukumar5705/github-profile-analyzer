import db from '../config/db.js';

class SkillRepository {
  /**
   * Replace all skills for a profile inside a transaction.
   * @param {number} profileId
   * @param {Array<{skill: string, confidence: number}>} skills
   */
  async replaceForProfile(profileId, skills) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      await client.query('DELETE FROM skills WHERE profile_id = $1', [profileId]);

      for (const s of skills) {
        await client.query(
          `INSERT INTO skills (profile_id, skill, confidence)
           VALUES ($1, $2, $3)
           ON CONFLICT (profile_id, skill) DO UPDATE SET confidence = EXCLUDED.confidence`,
          [profileId, s.skill, s.confidence]
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
   * Find all skills for a profile, sorted by confidence descending.
   * @param {number} profileId
   * @returns {Promise<Array>}
   */
  async findByProfileId(profileId) {
    const { rows } = await db.query(
      'SELECT skill, confidence FROM skills WHERE profile_id = $1 ORDER BY confidence DESC',
      [profileId]
    );
    return rows;
  }
}

export default new SkillRepository();
