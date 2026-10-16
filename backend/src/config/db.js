import pg from 'pg';
import logger from '../utils/logger.js';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  logger.error('DATABASE_URL is not defined in environment variables');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

// Handle unexpected errors from idle pooled connections.
pool.on('error', (err) => {
  logger.error(`Unexpected PostgreSQL pool error: ${err.message}`);
});

// Verify the database connection when the application starts.
export async function checkDatabaseConnection() {
  try {
    await pool.query('SELECT 1');
    logger.info('PostgreSQL (Supabase) connected successfully');
  } catch (err) {
    logger.error(`PostgreSQL connection failed: ${err.message}`);
    throw err;
  }
}

export default pool;