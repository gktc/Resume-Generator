import { Router } from 'express';
import { jobController } from '../controllers/job.controller';
import { authenticate } from '../middleware/auth.middleware';
import { analysisRateLimiter } from '../middleware/rate-limit.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// POST /api/jobs/analyze - Analyze job description
router.post('/analyze', analysisRateLimiter, (req, res) => jobController.analyzeJobDescription(req, res));

// GET /api/jobs - List user's job descriptions
router.get('/', (req, res) => jobController.listJobDescriptions(req, res));

// GET /api/jobs/:id - Get specific job description with match results
router.get('/:id', (req, res) => jobController.getJobDescription(req, res));

// DELETE /api/jobs/:id - Delete job description
router.delete('/:id', (req, res) => jobController.deleteJobDescription(req, res));

export default router;
