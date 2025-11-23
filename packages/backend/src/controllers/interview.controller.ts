import { Request, Response } from 'express';
import { interviewPrepService } from '../services/interview-prep.service';
import { communityService, InterviewExperienceInput } from '../services/community.service';

export class InterviewController {
  /**
   * Get interview questions for a resume
   * GET /api/interview/questions/:resumeId
   */
  async getInterviewQuestions(req: Request, res: Response) {
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

      const { resumeId } = req.params;
      const { category, difficulty } = req.query;

      // Validate resumeId
      if (!resumeId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Resume ID is required',
          },
        });
      }

      // Validate category if provided
      if (category) {
        const validCategories = ['technical', 'behavioral', 'experience', 'role-specific'];
        if (!validCategories.includes(category as string)) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_FAILED',
              message: `Category must be one of: ${validCategories.join(', ')}`,
            },
          });
        }
      }

      // Validate difficulty if provided
      if (difficulty) {
        const validDifficulties = ['easy', 'medium', 'hard'];
        if (!validDifficulties.includes(difficulty as string)) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_FAILED',
              message: `Difficulty must be one of: ${validDifficulties.join(', ')}`,
            },
          });
        }
      }

      // Generate or fetch questions
      const questions = await interviewPrepService.generateQuestionsForResume(
        req.user.userId,
        resumeId
      );

      // Get categorized questions with optional filters
      const categorizedQuestions = await interviewPrepService.getCategorizedQuestions(
        req.user.userId,
        resumeId,
        category as string | undefined,
        difficulty as string | undefined
      );

      return res.status(200).json({
        success: true,
        data: {
          questions: categorizedQuestions,
          total: questions.length,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get questions';

      if (errorMessage.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Resume not found',
          },
        });
      }

      if (errorMessage.includes('Unauthorized')) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'AUTH_FORBIDDEN',
            message: 'You do not have access to this resume',
          },
        });
      }

      console.error('Get interview questions error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'GENERATION_FAILED',
          message: 'An error occurred while generating interview questions',
        },
      });
    }
  }

  /**
   * Submit interview experience
   * POST /api/interview/experience
   */
  async submitInterviewExperience(req: Request, res: Response) {
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

      const {
        company,
        role,
        interviewDate,
        outcome,
        overallDifficulty,
        preparationTips,
        rounds,
      } = req.body;

      // Validate required fields
      if (!company || !role || !interviewDate || !outcome || !overallDifficulty) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Missing required fields: company, role, interviewDate, outcome, overallDifficulty',
          },
        });
      }

      // Validate outcome enum
      const validOutcomes = ['offer', 'rejected', 'pending', 'withdrew'];
      if (!validOutcomes.includes(outcome)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: `Outcome must be one of: ${validOutcomes.join(', ')}`,
          },
        });
      }

      // Validate difficulty enum
      const validDifficulties = ['easy', 'medium', 'hard'];
      if (!validDifficulties.includes(overallDifficulty)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: `Overall difficulty must be one of: ${validDifficulties.join(', ')}`,
          },
        });
      }

      // Validate rounds array
      if (!rounds || !Array.isArray(rounds) || rounds.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'At least one interview round is required',
          },
        });
      }

      // Validate each round
      const validRoundTypes = [
        'phone-screen',
        'technical',
        'system-design',
        'behavioral',
        'cultural-fit',
        'take-home',
        'onsite',
      ];

      for (const round of rounds) {
        if (!round.roundNumber || !round.roundType || !round.duration || !round.difficulty) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_FAILED',
              message: 'Each round must have roundNumber, roundType, duration, and difficulty',
            },
          });
        }

        if (!validRoundTypes.includes(round.roundType)) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_FAILED',
              message: `Round type must be one of: ${validRoundTypes.join(', ')}`,
            },
          });
        }

        if (!validDifficulties.includes(round.difficulty)) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_FAILED',
              message: `Round difficulty must be one of: ${validDifficulties.join(', ')}`,
            },
          });
        }

        if (typeof round.duration !== 'number' || round.duration <= 0) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_FAILED',
              message: 'Round duration must be a positive number',
            },
          });
        }
      }

      // Create experience input
      const experienceInput: InterviewExperienceInput = {
        company,
        role,
        interviewDate: new Date(interviewDate),
        outcome,
        overallDifficulty,
        preparationTips: preparationTips || [],
        rounds: rounds.map((round: any) => ({
          roundNumber: round.roundNumber,
          roundType: round.roundType,
          duration: round.duration,
          difficulty: round.difficulty,
          topics: round.topics || [],
          questions: round.questions || [],
          notes: round.notes || '',
        })),
      };

      // Submit experience
      const experience = await communityService.submitExperience(
        req.user.userId,
        experienceInput
      );

      return res.status(201).json({
        success: true,
        data: {
          id: experience.id,
          company: experience.company,
          role: experience.role,
          message: 'Interview experience submitted successfully',
        },
      });
    } catch (error) {
      console.error('Submit interview experience error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'SUBMISSION_FAILED',
          message: 'An error occurred while submitting interview experience',
        },
      });
    }
  }

  /**
   * Get company insights
   * GET /api/interview/insights/:company/:role
   */
  async getCompanyInsights(req: Request, res: Response) {
    try {
      const { company, role } = req.params;

      if (!company || !role) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Company and role are required',
          },
        });
      }

      const insights = await communityService.getCompanyInsights(company, role);

      if (!insights) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NO_DATA_FOUND',
            message: 'No interview data available for this company and role',
          },
        });
      }

      return res.status(200).json({
        success: true,
        data: insights,
      });
    } catch (error) {
      console.error('Get company insights error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INSIGHTS_FETCH_FAILED',
          message: 'An error occurred while fetching company insights',
        },
      });
    }
  }

  /**
   * Get list of available companies
   * GET /api/interview/insights
   */
  async getAvailableCompanies(_req: Request, res: Response) {
    try {
      const companies = await communityService.getAvailableCompanies();

      return res.status(200).json({
        success: true,
        data: {
          companies,
          total: companies.length,
        },
      });
    } catch (error) {
      console.error('Get available companies error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'COMPANIES_FETCH_FAILED',
          message: 'An error occurred while fetching available companies',
        },
      });
    }
  }
}

export const interviewController = new InterviewController();
