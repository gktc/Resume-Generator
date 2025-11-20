import { Router } from 'express';
import { interviewController } from '../controllers/interview.controller';
import { authenticate } from '../middleware/auth.middleware';
import { expensiveOperationRateLimiter } from '../middleware/rate-limit.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/interview/questions/:resumeId - Get interview questions for a resume
// Rate limited because it generates questions using AI
router.get('/questions/:resumeId', expensiveOperationRateLimiter, (req, res) => 
  interviewController.getInterviewQuestions(req, res)
);

// POST /api/interview/experience - Submit interview experience
router.post('/experience', (req, res) =>
  interviewController.submitInterviewExperience(req, res)
);

// GET /api/interview/insights - Get list of available companies
router.get('/insights', (req, res) =>
  interviewController.getAvailableCompanies(req, res)
);

// GET /api/interview/insights/:company/:role - Get company insights
router.get('/insights/:company/:role', (req, res) =>
  interviewController.getCompanyInsights(req, res)
);

export default router;
