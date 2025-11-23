import { Request, Response } from 'express';
import { profileService } from '../services/profile.service';
import { validateRequiredFields } from '../utils/validation';

export class ProfileController {
  /**
   * Get complete user profile
   * GET /api/profile
   */
  async getProfile(req: Request, res: Response) {
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

      const profile = await profileService.getUserProfile(req.user.userId);

      return res.status(200).json({
        success: true,
        data: { profile },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';

      if (errorMessage.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: errorMessage,
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'PROFILE_FETCH_FAILED',
          message: 'An error occurred while fetching profile',
        },
      });
    }
  }

  /**
   * Get basic user information
   * GET /api/profile/basic-info
   */
  async getBasicInfo(req: Request, res: Response) {
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

      const basicInfo = await profileService.getBasicInfo(req.user.userId);

      return res.status(200).json({
        success: true,
        data: basicInfo,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'An error occurred while fetching basic information',
        },
      });
    }
  }

  /**
   * Update basic user information
   * PUT /api/profile/basic-info
   */
  async updateBasicInfo(req: Request, res: Response) {
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

      const { firstName, lastName, phone, location, linkedinUrl, githubUrl, websiteUrl } = req.body;

      // Validate required fields
      const validation = validateRequiredFields({ firstName, lastName }, ['firstName', 'lastName']);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: `Missing required fields: ${validation.missingFields.join(', ')}`,
          },
        });
      }

      const updatedInfo = await profileService.updateBasicInfo(req.user.userId, {
        firstName,
        lastName,
        phone,
        location,
        linkedinUrl,
        githubUrl,
        websiteUrl,
      });

      return res.status(200).json({
        success: true,
        data: updatedInfo,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: 'An error occurred while updating basic information',
        },
      });
    }
  }

  // ============================================
  // Work Experience Handlers
  // ============================================

  /**
   * Get all work experiences
   * GET /api/profile/experience
   */
  async getWorkExperiences(req: Request, res: Response) {
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

      const experiences = await profileService.getWorkExperiences(req.user.userId);

      return res.status(200).json({
        success: true,
        data: { experiences },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'An error occurred while fetching work experiences',
        },
      });
    }
  }

  /**
   * Create work experience
   * POST /api/profile/experience
   */
  async createWorkExperience(req: Request, res: Response) {
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
        'startDate',
        'description',
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

      const { company, position, startDate, endDate, description, achievements, technologies, order } = req.body;

      // Validate date range
      if (endDate && new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Start date must be before end date',
          },
        });
      }

      const experience = await profileService.createWorkExperience(req.user.userId, {
        company,
        position,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description,
        achievements: achievements || [],
        technologies: technologies || [],
        order,
      });

      return res.status(201).json({
        success: true,
        data: { experience },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_FAILED',
          message: 'An error occurred while creating work experience',
        },
      });
    }
  }

  /**
   * Update work experience
   * PUT /api/profile/experience/:id
   */
  async updateWorkExperience(req: Request, res: Response) {
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
      const { company, position, startDate, endDate, description, achievements, technologies, order } = req.body;

      // Validate date range if both dates are provided
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Start date must be before end date',
          },
        });
      }

      const updateData: any = {};
      if (company !== undefined) updateData.company = company;
      if (position !== undefined) updateData.position = position;
      if (startDate !== undefined) updateData.startDate = new Date(startDate);
      if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
      if (description !== undefined) updateData.description = description;
      if (achievements !== undefined) updateData.achievements = achievements;
      if (technologies !== undefined) updateData.technologies = technologies;
      if (order !== undefined) updateData.order = order;

      const experience = await profileService.updateWorkExperience(id, req.user.userId, updateData);

      return res.status(200).json({
        success: true,
        data: { experience },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed';

      if (errorMessage.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Work experience not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: 'An error occurred while updating work experience',
        },
      });
    }
  }

  /**
   * Delete work experience
   * DELETE /api/profile/experience/:id
   */
  async deleteWorkExperience(req: Request, res: Response) {
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

      await profileService.deleteWorkExperience(id, req.user.userId);

      return res.status(200).json({
        success: true,
        data: { message: 'Work experience deleted successfully' },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';

      if (errorMessage.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Work experience not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: 'An error occurred while deleting work experience',
        },
      });
    }
  }

  // ============================================
  // Education Handlers
  // ============================================

  /**
   * Get all education entries
   * GET /api/profile/education
   */
  async getEducations(req: Request, res: Response) {
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

      const educations = await profileService.getEducations(req.user.userId);

      return res.status(200).json({
        success: true,
        data: { educations },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'An error occurred while fetching education entries',
        },
      });
    }
  }

  /**
   * Create education entry
   * POST /api/profile/education
   */
  async createEducation(req: Request, res: Response) {
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
        'institution',
        'degree',
        'fieldOfStudy',
        'startDate',
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

      const { institution, degree, fieldOfStudy, startDate, endDate, gpa, achievements, order } = req.body;

      const education = await profileService.createEducation(req.user.userId, {
        institution,
        degree,
        fieldOfStudy,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        gpa: gpa || null,
        achievements: achievements || [],
        order,
      });

      return res.status(201).json({
        success: true,
        data: { education },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_FAILED',
          message: 'An error occurred while creating education entry',
        },
      });
    }
  }

  /**
   * Update education entry
   * PUT /api/profile/education/:id
   */
  async updateEducation(req: Request, res: Response) {
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
      const { institution, degree, fieldOfStudy, startDate, endDate, gpa, achievements, order } = req.body;

      const updateData: any = {};
      if (institution !== undefined) updateData.institution = institution;
      if (degree !== undefined) updateData.degree = degree;
      if (fieldOfStudy !== undefined) updateData.fieldOfStudy = fieldOfStudy;
      if (startDate !== undefined) updateData.startDate = new Date(startDate);
      if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
      if (gpa !== undefined) updateData.gpa = gpa;
      if (achievements !== undefined) updateData.achievements = achievements;
      if (order !== undefined) updateData.order = order;

      const education = await profileService.updateEducation(id, req.user.userId, updateData);

      return res.status(200).json({
        success: true,
        data: { education },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed';

      if (errorMessage.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Education entry not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: 'An error occurred while updating education entry',
        },
      });
    }
  }

  /**
   * Delete education entry
   * DELETE /api/profile/education/:id
   */
  async deleteEducation(req: Request, res: Response) {
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

      await profileService.deleteEducation(id, req.user.userId);

      return res.status(200).json({
        success: true,
        data: { message: 'Education entry deleted successfully' },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';

      if (errorMessage.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Education entry not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: 'An error occurred while deleting education entry',
        },
      });
    }
  }

  // ============================================
  // Skill Handlers
  // ============================================

  /**
   * Get all skills
   * GET /api/profile/skills
   */
  async getSkills(req: Request, res: Response) {
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

      const skills = await profileService.getSkills(req.user.userId);

      return res.status(200).json({
        success: true,
        data: { skills },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'An error occurred while fetching skills',
        },
      });
    }
  }

  /**
   * Create skill
   * POST /api/profile/skills
   */
  async createSkill(req: Request, res: Response) {
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
        'name',
        'category',
        'proficiency',
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

      const { name, category, proficiency, yearsOfExperience, order } = req.body;

      // Validate category
      const validCategories = ['technical', 'soft', 'language'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: `Category must be one of: ${validCategories.join(', ')}`,
          },
        });
      }

      // Validate proficiency
      const validProficiencies = ['beginner', 'intermediate', 'advanced', 'expert'];
      if (!validProficiencies.includes(proficiency)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: `Proficiency must be one of: ${validProficiencies.join(', ')}`,
          },
        });
      }

      const skill = await profileService.createSkill(req.user.userId, {
        name,
        category,
        proficiency,
        yearsOfExperience: yearsOfExperience || null,
        order,
      });

      return res.status(201).json({
        success: true,
        data: { skill },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_FAILED',
          message: 'An error occurred while creating skill',
        },
      });
    }
  }

  /**
   * Update skill
   * PUT /api/profile/skills/:id
   */
  async updateSkill(req: Request, res: Response) {
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
      const { name, category, proficiency, yearsOfExperience, order } = req.body;

      // Validate category if provided
      if (category) {
        const validCategories = ['technical', 'soft', 'language'];
        if (!validCategories.includes(category)) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_FAILED',
              message: `Category must be one of: ${validCategories.join(', ')}`,
            },
          });
        }
      }

      // Validate proficiency if provided
      if (proficiency) {
        const validProficiencies = ['beginner', 'intermediate', 'advanced', 'expert'];
        if (!validProficiencies.includes(proficiency)) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'VALIDATION_FAILED',
              message: `Proficiency must be one of: ${validProficiencies.join(', ')}`,
            },
          });
        }
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (category !== undefined) updateData.category = category;
      if (proficiency !== undefined) updateData.proficiency = proficiency;
      if (yearsOfExperience !== undefined) updateData.yearsOfExperience = yearsOfExperience;
      if (order !== undefined) updateData.order = order;

      const skill = await profileService.updateSkill(id, req.user.userId, updateData);

      return res.status(200).json({
        success: true,
        data: { skill },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed';

      if (errorMessage.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Skill not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: 'An error occurred while updating skill',
        },
      });
    }
  }

  /**
   * Delete skill
   * DELETE /api/profile/skills/:id
   */
  async deleteSkill(req: Request, res: Response) {
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

      await profileService.deleteSkill(id, req.user.userId);

      return res.status(200).json({
        success: true,
        data: { message: 'Skill deleted successfully' },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';

      if (errorMessage.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Skill not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: 'An error occurred while deleting skill',
        },
      });
    }
  }

  // ============================================
  // Project Handlers
  // ============================================

  /**
   * Get all projects
   * GET /api/profile/projects
   */
  async getProjects(req: Request, res: Response) {
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

      const projects = await profileService.getProjects(req.user.userId);

      return res.status(200).json({
        success: true,
        data: { projects },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: 'An error occurred while fetching projects',
        },
      });
    }
  }

  /**
   * Create project
   * POST /api/profile/projects
   */
  async createProject(req: Request, res: Response) {
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
        'title',
        'description',
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

      const { title, description, technologies, url, githubUrl, startDate, endDate, highlights, order } = req.body;

      const project = await profileService.createProject(req.user.userId, {
        title,
        description,
        technologies: technologies || [],
        url: url || null,
        githubUrl: githubUrl || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        highlights: highlights || [],
        order,
      });

      return res.status(201).json({
        success: true,
        data: { project },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_FAILED',
          message: 'An error occurred while creating project',
        },
      });
    }
  }

  /**
   * Update project
   * PUT /api/profile/projects/:id
   */
  async updateProject(req: Request, res: Response) {
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
      const { title, description, technologies, url, githubUrl, startDate, endDate, highlights, order } = req.body;

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (technologies !== undefined) updateData.technologies = technologies;
      if (url !== undefined) updateData.url = url;
      if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
      if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
      if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
      if (highlights !== undefined) updateData.highlights = highlights;
      if (order !== undefined) updateData.order = order;

      const project = await profileService.updateProject(id, req.user.userId, updateData);

      return res.status(200).json({
        success: true,
        data: { project },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed';

      if (errorMessage.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Project not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: 'An error occurred while updating project',
        },
      });
    }
  }

  /**
   * Delete project
   * DELETE /api/profile/projects/:id
   */
  async deleteProject(req: Request, res: Response) {
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

      await profileService.deleteProject(id, req.user.userId);

      return res.status(200).json({
        success: true,
        data: { message: 'Project deleted successfully' },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Delete failed';

      if (errorMessage.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Project not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: 'An error occurred while deleting project',
        },
      });
    }
  }
}

export const profileController = new ProfileController();
