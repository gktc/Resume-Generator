import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth.middleware';
import { uploadResume, handleUploadError, validateUploadedFile } from '../middleware/upload.middleware';
import { uploadRateLimiter } from '../middleware/rate-limit.middleware';

const router = Router();

// All upload routes require authentication
router.use(authenticate);

/**
 * POST /api/upload/resume
 * Upload and parse a resume file
 */
router.post(
  '/resume',
  uploadRateLimiter,
  uploadResume.single('resume'),
  handleUploadError,
  validateUploadedFile,
  uploadController.uploadResume.bind(uploadController)
);

/**
 * GET /api/upload/parsed/:id
 * Get parsed resume data for review
 */
router.get('/parsed/:id', uploadController.getParsedData.bind(uploadController));

/**
 * POST /api/upload/confirm/:id
 * Confirm and save parsed data to profile
 */
router.post('/confirm/:id', uploadController.confirmParsedData.bind(uploadController));

/**
 * DELETE /api/upload/parsed/:id
 * Reject and discard parsed data
 */
router.delete('/parsed/:id', uploadController.rejectParsedData.bind(uploadController));

export default router;
