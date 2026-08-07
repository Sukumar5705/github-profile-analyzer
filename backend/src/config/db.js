import pg from 'pg';
import logger from '../utils/logger.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
console.log("DATABASE_URL =", process.env.DATABASE_URL);
pool.connect()
  .then(client => {
    logger.info('PostgreSQL (Supabase) connected successfully');
    client.release();
  })
  .catch(err => {
    logger.error(`PostgreSQL connection failed: ${err.message}`);
    process.exit(1);
  });

/**
 * Thin query helper — keeps the same call signature as mysql2/promise:
 *   const { rows } = await db.query(sql, params)
 *
 * pg uses $1 $2 ... placeholders, not ?
 * The repositories already use the converted syntax.
 */
export default pool;
