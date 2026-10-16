import logger from '../utils/logger.js';

/**
 * Centralized Express error handler.
 * Catches errors passed via next(err).
 */
const errorHandler = (err, req, res, _next) => {
  logger.error(`${req.method} ${req.originalUrl} — ${err.message}`, { stack: err.stack });

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

export default errorHandler;
