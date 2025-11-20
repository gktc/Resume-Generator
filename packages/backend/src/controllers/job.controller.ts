import { Request, Response } from 'express';
import { jobAnalysisService } from '../services/job-analysis.service';
import { validateRequiredFields } from '../utils/validation';

export class JobController {
  /**
   * Analyze job description
   * POST /api/jobs/analyze
   */
  async analyzeJobDescription(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'AUTH_UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
      }

      const validation = validateRequiredFields(req.body, [
        'company',
        'position',
        'jobDescription',
      ]);

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Missing required fields',
            details: { missingFields: validation.missingFields },
          },
        });
      }

      const { company, position, jobDescription } = req.body;

      // Validate job description is not empty
      if (!jobDescription.trim()) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Job description cannot be empty',
          },
        });
      }

      const result = await jobAnalysisService.analyzeJobDescription(
        req.user.userId,
        company,
        position,
        jobDescription
      );

      return res.status(201).json({
        success: true,
        data: {
          jobId: result.id,
          analysis: result.analysis,
        },
      });
    } catch (error) {
      console.error('Job analysis error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'ANALYSIS_FAILED',
          message: 'An error occurred while analyzing job description',
        },
      });
    }
  }

  /**
   * Get job description with match results
   * GET /api/jobs/:id
   */
  async getJobDescription(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'AUTH_UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
      }

      const { id } = req.params;

      const jobDescription = await jobAnalysisService.getJobDescription(
        id,
        req.user.userId
      );

      // Calculate match results
      const matchResult = await jobAnalysisService.matchProfileToJob(
        req.user.userId,
        id
      );

      return res.status(200).json({
        success: true,
        data: {
          job: jobDescription,
          matchResult,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Fetch failed';

      if (errorMessage.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Job description not found',
          },
        });
      }

      if (errorMessage.includes('Unauthorized')) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'AUTH_FORBIDDEN',
            message: 'You do not have access to this job description',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'An error occurred while fetching job description',
        },
      });
    }
  }

  /**
   * List user's job descriptions
   * GET /api/jobs
   */
  async listJobDescriptions(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'AUTH_UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = (req.query.sortOrder as string) || 'desc';

      // Validate sortBy
      const validSortFields = ['createdAt', 'company', 'position'];
      if (!validSortFields.includes(sortBy)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: `sortBy must be one of: ${validSortFields.join(', ')}`,
          },
        });
      }

      // Validate sortOrder
      if (sortOrder !== 'asc' && sortOrder !== 'desc') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'sortOrder must be either "asc" or "desc"',
          },
        });
      }

      const result = await jobAnalysisService.getUserJobDescriptions(
        req.user.userId,
        {
          page,
          limit,
          sortBy: sortBy as any,
          sortOrder: sortOrder as any,
        }
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('List jobs error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'An error occurred while fetching job descriptions',
        },
      });
    }
  }

  /**
   * Delete job description
   * DELETE /api/jobs/:id
   */
  async deleteJobDescription(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'AUTH_UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
      }

      const { id } = req.params;

      await jobAnalysisService.deleteJobDescription(id, req.user.userId);

      return res.status(200).json({
        success: true,
        data: { message: 'Job description deleted successfully' },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';

      if (errorMessage.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Job description not found',
          },
        });
      }

      if (errorMessage.includes('Unauthorized')) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'AUTH_FORBIDDEN',
            message: 'You do not have access to this job description',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: 'An error occurred while deleting job description',
        },
      });
    }
  }
}

export const jobController = new JobController();
