import { Request, Response } from 'express';
import { resumeParserService, ParsedResumeData } from '../services/resume-parser.service';
import fs from 'fs/promises';

export class UploadController {
  /**
   * Upload and parse resume
   * POST /api/upload/resume
   */
  async uploadResume(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'AUTH_UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'No file uploaded',
          },
        });
        return;
      }

      // Parse the resume
      const result = await resumeParserService.parseResume(req.file, userId);

      res.status(200).json({
        success: true,
        data: {
          uploadId: result.id,
          parsedData: result.parsedData,
          message: 'Resume parsed successfully. Please review and confirm the extracted data.',
        },
      });
    } catch (error: any) {
      console.error('Upload resume error:', error);

      // Clean up uploaded file if it exists
      if (req.file?.path) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Failed to delete uploaded file:', unlinkError);
        }
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'RESUME_PARSE_FAILED',
          message: error.message || 'Failed to parse resume',
        },
      });
    }
  }

  /**
   * Get parsed resume data for review
   * GET /api/upload/parsed/:id
   */
  async getParsedData(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'AUTH_UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
        return;
      }

      const parsedResume = await resumeParserService.getParsedData(id, userId);

      if (!parsedResume) {
        res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Parsed resume not found',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: parsedResume.id,
          fileName: parsedResume.fileName,
          parsedData: parsedResume.parsedData,
          createdAt: parsedResume.createdAt,
        },
      });
    } catch (error: any) {
      console.error('Get parsed data error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve parsed data',
        },
      });
    }
  }

  /**
   * Confirm and save parsed data to profile
   * POST /api/upload/confirm/:id
   */
  async confirmParsedData(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;
      const editedData: ParsedResumeData = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'AUTH_UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
        return;
      }

      // Validate edited data structure
      if (!editedData || typeof editedData !== 'object') {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Invalid data format',
          },
        });
        return;
      }

      await resumeParserService.confirmParsedData(id, userId, editedData);

      res.status(200).json({
        success: true,
        data: {
          message: 'Resume data saved to your profile successfully',
        },
      });
    } catch (error: any) {
      console.error('Confirm parsed data error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Failed to save parsed data',
        },
      });
    }
  }

  /**
   * Reject and discard parsed data
   * DELETE /api/upload/parsed/:id
   */
  async rejectParsedData(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'AUTH_UNAUTHORIZED',
            message: 'User not authenticated',
          },
        });
        return;
      }

      await resumeParserService.rejectParsedData(id, userId);

      res.status(200).json({
        success: true,
        data: {
          message: 'Parsed data discarded successfully',
        },
      });
    } catch (error: any) {
      console.error('Reject parsed data error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'Failed to discard parsed data',
        },
      });
    }
  }
}

export const uploadController = new UploadController();
