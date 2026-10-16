import express   from 'express';
import cors      from 'cors';
import 'dotenv/config';

import githubRoutes   from './routes/github.routes.js';
import recruiterRoutes from './routes/recruiter.routes.js';
import aiRoutes       from './routes/ai.routes.js';
import errorHandler   from './middleware/errorHandler.js';
import logger         from './utils/logger.js';

const app = express();

// ── Global middleware ─────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Request logger ────────────────────────────────────────────
app.use((req, _res, next) => {
  logger.debug(`${req.method} ${req.originalUrl}`);
  next();
});

// ── Health check ──────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Developer Intelligence Platform API — v3',
    version: '3.0.0',
    endpoints: {
      analyze:         'POST   /api/github/analyze/:username',
      profiles:        'GET    /api/github/profiles?page=1&limit=10',
      profile:         'GET    /api/github/profiles/:username',
      search:          'GET    /api/github/search?username=xxx',
      deleteProfile:   'DELETE /api/github/profiles/:username',
      recruiterView:   'GET    /api/recruiter/:username',
      scoreHistory:    'GET    /api/recruiter/:username/history',
      generateAI:      'POST   /api/analysis/:username/generate-ai'
    }
  });
});

// ── Routes ────────────────────────────────────────────────────
app.use('/api/github',    githubRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/analysis',  aiRoutes);

// ── 404 fallback ──────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Centralized error handler ─────────────────────────────────
app.use(errorHandler);

export default app;
