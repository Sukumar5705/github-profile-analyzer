import { param, query } from 'express-validator';

const validateUsername = [
  param('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 1, max: 39 }).withMessage('Username must be 1–39 characters')
    .matches(/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/)
    .withMessage('Invalid GitHub username format')
];

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be 1–100')
    .toInt()
];

const validateSearchQuery = [
  query('username')
    .trim()
    .notEmpty().withMessage('Username query parameter is required')
    .isLength({ max: 39 }).withMessage('Search query too long')
];

export { validateUsername, validatePagination, validateSearchQuery };
