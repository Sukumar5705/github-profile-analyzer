import { Router } from 'express';
import { getRecruiterView, getScoreHistory } from '../controllers/recruiter.controller.js';
import { validateUsername } from '../validations/github.validation.js';
import validate from '../middleware/validate.js';

const router = Router();

// GET /api/recruiter/:username — recruiter-friendly profile view
router.get('/:username', validateUsername, validate, getRecruiterView);

// GET /api/recruiter/:username/history — career score trend
router.get('/:username/history', validateUsername, validate, getScoreHistory);

export default router;
