import { Router } from 'express';
import { generateAI } from '../controllers/ai.controller.js';
import { validateUsername } from '../validations/github.validation.js';
import validate from '../middleware/validate.js';

const router = Router();

// POST /api/analysis/:username/generate-ai
router.post('/:username/generate-ai', validateUsername, validate, generateAI);

export default router;
