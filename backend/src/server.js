import 'dotenv/config';
import app from './app.js';
import logger from './utils/logger.js';
import { checkDatabaseConnection } from './config/db.js';


const PORT = process.env.PORT || 5000;

await checkDatabaseConnection(); // throws / exits before listen() if DB is unreachable

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
// ── Graceful shutdown ────────────────────────────────────────
process.on('SIGTERM', () => {
  logger.info('SIGTERM received — shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
  process.exit(1);
});


