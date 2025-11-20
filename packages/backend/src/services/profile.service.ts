import { prisma } from '../lib/prisma';

export interface WorkExperienceInput {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date | null;
  description: string;
  achievements: string[];
  technologies: string[];
  order?: number;
}

export interface EducationInput {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date | null;
  gpa?: number | null;
  achievements: string[];
  order?: number;
}

export interface SkillInput {
  name: string;
  category: string;
  proficiency: string;
  yearsOfExperience?: number | null;
  order?: number;
}

export interface ProjectInput {
  title: string;
  description: string;
  technologies: string[];
  url?: string | null;
  githubUrl?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  highlights: string[];
  order?: number;
}

export class ProfileService {
  /**
   * Get complete user profile with all related data
   */
  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        location: true,
        linkedinUrl: true,
        githubUrl: true,
        websiteUrl: true,
        createdAt: true,
        updatedAt: true,
        workExperiences: {
          orderBy: { order: 'asc' },
        },
        educations: {
          orderBy: { order: 'asc' },
        },
        skills: {
          orderBy: { order: 'asc' },
        },
        projects: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Get basic user information
   */
  async getBasicInfo(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        location: true,
        linkedinUrl: true,
        githubUrl: true,
        websiteUrl: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Update basic user information
   */
  async updateBasicInfo(
    userId: string,
    data: {
      firstName: string;
      lastName: string;
      phone?: string;
      location?: string;
      linkedinUrl?: string;
      githubUrl?: string;
      websiteUrl?: string;
    }
  ) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        location: data.location || null,
        linkedinUrl: data.linkedinUrl || null,
        githubUrl: data.githubUrl || null,
        websiteUrl: data.websiteUrl || null,
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        location: true,
        linkedinUrl: true,
        githubUrl: true,
        websiteUrl: true,
      },
    });

    return updatedUser;
  }

  // ============================================
  // Work Experience Methods
  // ============================================

  /**
   * Get all work experiences for a user
   */
  async getWorkExperiences(userId: string) {
    return prisma.workExperience.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Get a single work experience by ID
   */
  async getWorkExperienceById(id: string, userId: string) {
    const experience = await prisma.workExperience.findFirst({
      where: { id, userId },
    });

    if (!experience) {
      throw new Error('Work experience not found');
    }

    return experience;
  }

  /**
   * Create a new work experience
   */
  async createWorkExperience(userId: string, data: WorkExperienceInput) {
    return prisma.workExperience.create({
      data: {
        userId,
        ...data,
        order: data.order ?? 0,
      },
    });
  }

  /**
   * Update a work experience
   */
  async updateWorkExperience(id: string, userId: string, data: Partial<WorkExperienceInput>) {
    // Verify ownership
    await this.getWorkExperienceById(id, userId);

    return prisma.workExperience.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a work experience
   */
  async deleteWorkExperience(id: string, userId: string) {
    // Verify ownership
    await this.getWorkExperienceById(id, userId);

    await prisma.workExperience.delete({
      where: { id },
    });
  }

  // ============================================
  // Education Methods
  // ============================================

  /**
   * Get all education entries for a user
   */
  async getEducations(userId: string) {
    return prisma.education.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Get a single education entry by ID
   */
  async getEducationById(id: string, userId: string) {
    const education = await prisma.education.findFirst({
      where: { id, userId },
    });

    if (!education) {
      throw new Error('Education not found');
    }

    return education;
  }

  /**
   * Create a new education entry
   */
  async createEducation(userId: string, data: EducationInput) {
    return prisma.education.create({
      data: {
        userId,
        ...data,
        order: data.order ?? 0,
      },
    });
  }

  /**
   * Update an education entry
   */
  async updateEducation(id: string, userId: string, data: Partial<EducationInput>) {
    // Verify ownership
    await this.getEducationById(id, userId);

    return prisma.education.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete an education entry
   */
  async deleteEducation(id: string, userId: string) {
    // Verify ownership
    await this.getEducationById(id, userId);

    await prisma.education.delete({
      where: { id },
    });
  }

  // ============================================
  // Skill Methods
  // ============================================

  /**
   * Get all skills for a user
   */
  async getSkills(userId: string) {
    return prisma.skill.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Get a single skill by ID
   */
  async getSkillById(id: string, userId: string) {
    const skill = await prisma.skill.findFirst({
      where: { id, userId },
    });

    if (!skill) {
      throw new Error('Skill not found');
    }

    return skill;
  }

  /**
   * Create a new skill
   */
  async createSkill(userId: string, data: SkillInput) {
    return prisma.skill.create({
      data: {
        userId,
        ...data,
        order: data.order ?? 0,
      },
    });
  }

  /**
   * Update a skill
   */
  async updateSkill(id: string, userId: string, data: Partial<SkillInput>) {
    // Verify ownership
    await this.getSkillById(id, userId);

    return prisma.skill.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a skill
   */
  async deleteSkill(id: string, userId: string) {
    // Verify ownership
    await this.getSkillById(id, userId);

    await prisma.skill.delete({
      where: { id },
    });
  }

  // ============================================
  // Project Methods
  // ============================================

  /**
   * Get all projects for a user
   */
  async getProjects(userId: string) {
    return prisma.project.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Get a single project by ID
   */
  async getProjectById(id: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  }

  /**
   * Create a new project
   */
  async createProject(userId: string, data: ProjectInput) {
    return prisma.project.create({
      data: {
        userId,
        ...data,
        order: data.order ?? 0,
      },
    });
  }

  /**
   * Update a project
   */
  async updateProject(id: string, userId: string, data: Partial<ProjectInput>) {
    // Verify ownership
    await this.getProjectById(id, userId);

    return prisma.project.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a project
   */
  async deleteProject(id: string, userId: string) {
    // Verify ownership
    await this.getProjectById(id, userId);

    await prisma.project.delete({
      where: { id },
    });
  }
}

export const profileService = new ProfileService();
