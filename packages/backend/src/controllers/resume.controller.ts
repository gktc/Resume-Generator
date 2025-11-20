import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { resumeQueue, getJobStatus } from '../lib/queue';
import { ResumeGenerationJobData } from '../workers/resume-generation.worker';
import fs from 'fs/promises';

export class ResumeController {
  /**
   * POST /api/resume/generate
   * Queue a resume generation job
   */
  async generateResume(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { jobDescriptionId, templateId } = req.body;

      // Validate input
      if (!jobDescriptionId || !templateId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'jobDescriptionId and templateId are required',
          },
        });
      }

      // Verify job description exists and belongs to user
      const jobDescription = await prisma.jobDescription.findFirst({
        where: {
          id: jobDescriptionId,
          userId,
        },
      });

      if (!jobDescription) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Job description not found',
          },
        });
      }

      // Verify template exists
      const template = await prisma.template.findUnique({
        where: { id: templateId },
      });

      if (!template || !template.isActive) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Template not found or inactive',
          },
        });
      }

      // Create resume record
      const resume = await prisma.resume.create({
        data: {
          userId,
          jobDescriptionId,
          templateId,
          fileName: '',
          filePath: '',
          atsScore: {},
          generatedContent: {},
          status: 'pending',
        },
      });

      // Queue the job
      const jobData: ResumeGenerationJobData = {
        userId,
        jobDescriptionId,
        templateId,
        resumeId: resume.id,
      };

      const job = await resumeQueue.add(jobData, {
        jobId: resume.id,
      });

      return res.status(202).json({
        success: true,
        data: {
          jobId: job.id,
          resumeId: resume.id,
          status: 'pending',
          message: 'Resume generation queued successfully',
        },
      });
    } catch (error: any) {
      console.error('Generate resume error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to queue resume generation',
        },
      });
    }
  }

  /**
   * GET /api/resume/status/:jobId
   * Check the status of a resume generation job
   */
  async getJobStatus(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const userId = (req as any).user.userId;

      // Get job status from queue
      const jobStatus = await getJobStatus(jobId);

      if (!jobStatus) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Job not found',
          },
        });
      }

      // Verify the resume belongs to the user
      const resume = await prisma.resume.findFirst({
        where: {
          id: jobId,
          userId,
        },
      });

      if (!resume) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Resume not found',
          },
        });
      }

      return res.json({
        success: true,
        data: {
          jobId,
          resumeId: resume.id,
          status: jobStatus.state,
          progress: jobStatus.progress,
          result: jobStatus.result,
          error: jobStatus.failedReason,
          attemptsMade: jobStatus.attemptsMade,
        },
      });
    } catch (error: any) {
      console.error('Get job status error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get job status',
        },
      });
    }
  }

  /**
   * GET /api/resume/:id
   * Get resume details
   */
  async getResume(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const resume = await prisma.resume.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          jobDescription: true,
          template: {
            select: {
              id: true,
              name: true,
              category: true,
              previewImageUrl: true,
            },
          },
        },
      });

      if (!resume) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Resume not found',
          },
        });
      }

      return res.json({
        success: true,
        data: resume,
      });
    } catch (error: any) {
      console.error('Get resume error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get resume',
        },
      });
    }
  }

  /**
   * GET /api/resume
   * List user's resumes
   */
  async listResumes(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { page = '1', limit = '10', sortBy = 'createdAt', order = 'desc' } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const [resumes, total] = await Promise.all([
        prisma.resume.findMany({
          where: { userId },
          include: {
            jobDescription: {
              select: {
                company: true,
                position: true,
              },
            },
            template: {
              select: {
                name: true,
                category: true,
              },
            },
          },
          orderBy: {
            [sortBy as string]: order,
          },
          skip,
          take: limitNum,
        }),
        prisma.resume.count({ where: { userId } }),
      ]);

      return res.json({
        success: true,
        data: {
          resumes,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
          },
        },
      });
    } catch (error: any) {
      console.error('List resumes error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to list resumes',
        },
      });
    }
  }

  /**
   * GET /api/resume/:id/download
   * Download resume PDF
   */
  async downloadResume(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const resume = await prisma.resume.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          jobDescription: true,
        },
      });

      if (!resume) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Resume not found',
          },
        });
      }

      if (resume.status !== 'completed') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATE',
            message: 'Resume is not ready for download',
          },
        });
      }

      // Check if file exists
      try {
        await fs.access(resume.filePath);
      } catch {
        return res.status(404).json({
          success: false,
          error: {
            code: 'FILE_NOT_FOUND',
            message: 'Resume file not found',
          },
        });
      }

      // Set headers for download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${resume.fileName}"`);

      // Stream the file
      const fileStream = await fs.readFile(resume.filePath);
      return res.send(fileStream);
    } catch (error: any) {
      console.error('Download resume error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to download resume',
        },
      });
    }
  }

  /**
   * POST /api/resume/:id/regenerate
   * Regenerate a resume with updated profile data
   */
  async regenerateResume(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const existingResume = await prisma.resume.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!existingResume) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Resume not found',
          },
        });
      }

      // Create new resume record
      const newResume = await prisma.resume.create({
        data: {
          userId,
          jobDescriptionId: existingResume.jobDescriptionId,
          templateId: existingResume.templateId,
          fileName: '',
          filePath: '',
          atsScore: {},
          generatedContent: {},
          status: 'pending',
        },
      });

      // Queue the job
      const jobData: ResumeGenerationJobData = {
        userId,
        jobDescriptionId: existingResume.jobDescriptionId,
        templateId: existingResume.templateId,
        resumeId: newResume.id,
      };

      const job = await resumeQueue.add(jobData, {
        jobId: newResume.id,
      });

      return res.status(202).json({
        success: true,
        data: {
          jobId: job.id,
          resumeId: newResume.id,
          status: 'pending',
          message: 'Resume regeneration queued successfully',
        },
      });
    } catch (error: any) {
      console.error('Regenerate resume error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to regenerate resume',
        },
      });
    }
  }

  /**
   * DELETE /api/resume/:id
   * Delete a resume
   */
  async deleteResume(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const resume = await prisma.resume.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!resume) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Resume not found',
          },
        });
      }

      // Delete file if it exists
      if (resume.filePath) {
        try {
          await fs.unlink(resume.filePath);
        } catch (error) {
          console.warn('Failed to delete resume file:', error);
        }
      }

      // Delete resume record (cascade will delete interview questions)
      await prisma.resume.delete({
        where: { id },
      });

      return res.json({
        success: true,
        data: {
          message: 'Resume deleted successfully',
        },
      });
    } catch (error: any) {
      console.error('Delete resume error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete resume',
        },
      });
    }
  }
}
