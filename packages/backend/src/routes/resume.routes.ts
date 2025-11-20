import { Router } from 'express';
import { ResumeController } from '../controllers/resume.controller';
import { authenticate } from '../middleware/auth.middleware';
import { expensiveOperationRateLimiter } from '../middleware/rate-limit.middleware';

const router = Router();
const resumeController = new ResumeController();

// All routes require authentication
router.use(authenticate);

// Resume generation - rate limited for expensive operations
router.post('/generate', expensiveOperationRateLimiter, (req, res) => resumeController.generateResume(req, res));
router.get('/status/:jobId', (req, res) => resumeController.getJobStatus(req, res));

// Resume management
router.get('/', (req, res) => resumeController.listResumes(req, res));
router.get('/:id', (req, res) => resumeController.getResume(req, res));
router.get('/:id/download', (req, res) => resumeController.downloadResume(req, res));
router.post('/:id/regenerate', expensiveOperationRateLimiter, (req, res) => resumeController.regenerateResume(req, res));
router.delete('/:id', (req, res) => resumeController.deleteResume(req, res));

export default router;
