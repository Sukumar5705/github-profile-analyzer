import { Router } from 'express';
import {
  analyzeProfile,
  getAllProfiles,
  getSingleProfile,
  searchProfiles,
  deleteProfile
} from '../controllers/github.controller.js';
import {
  validateUsername,
  validatePagination,
  validateSearchQuery
} from '../validations/github.validation.js';
import validate from '../middleware/validate.js';

const router = Router();

// Health check
router.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'GitHub Routes Working' });
});

// Analyze a profile (POST /api/github/analyze/:username)
router.post('/analyze/:username', validateUsername, validate, analyzeProfile);

// Get all profiles with pagination (GET /api/github/profiles?page=1&limit=10)
router.get('/profiles', validatePagination, validate, getAllProfiles);

// Search profiles (GET /api/github/search?username=xxx)
router.get('/search', validateSearchQuery, validate, searchProfiles);

// Get single profile with skills + analysis (GET /api/github/profiles/:username)
router.get('/profiles/:username', validateUsername, validate, getSingleProfile);

// Delete profile (DELETE /api/github/profiles/:username)
router.delete('/profiles/:username', validateUsername, validate, deleteProfile);

export default router;
