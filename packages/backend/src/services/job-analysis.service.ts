import { prisma } from '../lib/prisma';
import { aiService } from './ai.service';
import { profileService } from './profile.service';
import { JobAnalysis, Requirement } from '../types/database';

export interface MatchResult {
  skillMatch: {
    percentage: number;
    matchingSkills: string[];
    missingSkills: string[];
  };
  experienceRelevance: {
    score: number; // 0-100
    relevantExperiences: string[];
  };
  educationMatch: {
    score: number; // 0-100
    meetsRequirements: boolean;
  };
  overallScore: number; // 0-100
  recommendations: string[];
}

export class JobAnalysisService {
  /**
   * Analyze a job description and extract structured data
   */
  async analyzeJobDescription(
    userId: string,
    company: string,
    position: string,
    rawText: string
  ): Promise<{ id: string; analysis: JobAnalysis }> {
    // Use AI to extract structured data from job description
    const analysis = await this.extractJobData(rawText);

    // Store in database
    const jobDescription = await prisma.jobDescription.create({
      data: {
        userId,
        company,
        position,
        rawText,
        analyzedData: analysis as any,
      },
    });

    return {
      id: jobDescription.id,
      analysis,
    };
  }

  /**
   * Extract structured data from job description text using AI
   */
  private async extractJobData(jobText: string): Promise<JobAnalysis> {
    const systemPrompt = 'You are an expert at analyzing job descriptions. Extract structured information from job postings.';

    const prompt = `Analyze the following job description and extract:
1. Requirements (both required and preferred) - categorize each as skill, experience, education, or certification
2. Skills mentioned (technical and soft skills)
3. Experience level (entry, mid, senior, or lead)
4. Important keywords for ATS optimization
5. Company information if mentioned

Job Description:
${jobText}

Return a JSON object with this structure:
{
  "requirements": [
    {
      "text": "requirement text",
      "category": "required" or "preferred",
      "type": "skill" or "experience" or "education" or "certification",
      "importance": 0.0 to 1.0
    }
  ],
  "skills": ["skill1", "skill2"],
  "experienceLevel": "entry" or "mid" or "senior" or "lead",
  "keywords": ["keyword1", "keyword2"],
  "companyInfo": "brief company description"
}`;

    try {
      const analysis = await aiService.generateJSON<JobAnalysis>(prompt, systemPrompt, {
        temperature: 0.3,
        maxTokens: 2000,
      });

      // Validate and set defaults
      return {
        requirements: analysis.requirements || [],
        skills: analysis.skills || [],
        experienceLevel: analysis.experienceLevel || 'mid',
        keywords: analysis.keywords || [],
        companyInfo: analysis.companyInfo || '',
      };
    } catch (error) {
      console.error('Failed to analyze job description with AI:', error);
      // Return basic analysis as fallback
      return this.basicAnalysis(jobText);
    }
  }

  /**
   * Basic fallback analysis without AI
   */
  private basicAnalysis(jobText: string): JobAnalysis {
    const lowerText = jobText.toLowerCase();

    // Determine experience level
    let experienceLevel = 'mid';
    if (lowerText.includes('entry') || lowerText.includes('junior') || lowerText.includes('0-2 years')) {
      experienceLevel = 'entry';
    } else if (lowerText.includes('senior') || lowerText.includes('5+ years') || lowerText.includes('lead')) {
      experienceLevel = 'senior';
    }

    // Extract common technical skills
    const commonSkills = [
      'javascript', 'typescript', 'python', 'java', 'react', 'node', 'sql',
      'aws', 'docker', 'kubernetes', 'git', 'agile', 'rest', 'api'
    ];
    const skills = commonSkills.filter(skill => lowerText.includes(skill));

    return {
      requirements: [],
      skills,
      experienceLevel,
      keywords: skills,
      companyInfo: '',
    };
  }

  /**
   * Match user profile to job description
   */
  async matchProfileToJob(userId: string, jobId: string): Promise<MatchResult> {
    // Fetch job description
    const jobDescription = await prisma.jobDescription.findUnique({
      where: { id: jobId },
    });

    if (!jobDescription) {
      throw new Error('Job description not found');
    }

    // Verify ownership
    if (jobDescription.userId !== userId) {
      throw new Error('Unauthorized access to job description');
    }

    const analysis = jobDescription.analyzedData as unknown as JobAnalysis;

    // Fetch user profile
    const profile = await profileService.getUserProfile(userId);

    // Calculate skill match
    const skillMatch = this.calculateSkillMatch(profile.skills, analysis.skills);

    // Calculate experience relevance
    const experienceRelevance = this.calculateExperienceRelevance(
      profile.workExperiences,
      analysis.requirements,
      analysis.keywords
    );

    // Calculate education match
    const educationMatch = this.calculateEducationMatch(
      profile.educations,
      analysis.requirements
    );

    // Calculate overall score (weighted average)
    const overallScore = Math.round(
      skillMatch.percentage * 0.4 +
      experienceRelevance.score * 0.4 +
      educationMatch.score * 0.2
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      skillMatch,
      experienceRelevance,
      educationMatch
    );

    return {
      skillMatch,
      experienceRelevance,
      educationMatch,
      overallScore,
      recommendations,
    };
  }

  /**
   * Calculate skill match percentage
   */
  private calculateSkillMatch(
    userSkills: any[],
    requiredSkills: string[]
  ): { percentage: number; matchingSkills: string[]; missingSkills: string[] } {
    if (requiredSkills.length === 0) {
      return {
        percentage: 100,
        matchingSkills: [],
        missingSkills: [],
      };
    }

    const userSkillNames = userSkills.map(s => s.name.toLowerCase());

    const matchingSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const reqSkill of requiredSkills) {
      const reqSkillLower = reqSkill.toLowerCase();
      const isMatch = userSkillNames.some(userSkill =>
        userSkill.includes(reqSkillLower) || reqSkillLower.includes(userSkill)
      );

      if (isMatch) {
        matchingSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    }

    const percentage = Math.round((matchingSkills.length / requiredSkills.length) * 100);

    return {
      percentage,
      matchingSkills,
      missingSkills,
    };
  }

  /**
   * Calculate experience relevance score
   */
  private calculateExperienceRelevance(
    experiences: any[],
    _requirements: Requirement[],
    keywords: string[]
  ): { score: number; relevantExperiences: string[] } {
    if (experiences.length === 0) {
      return { score: 0, relevantExperiences: [] };
    }

    const relevantExperiences: string[] = [];
    let totalRelevanceScore = 0;

    for (const exp of experiences) {
      const expText = `${exp.position} ${exp.description} ${exp.achievements.join(' ')} ${exp.technologies.join(' ')}`.toLowerCase();

      // Check keyword matches
      let keywordMatches = 0;
      for (const keyword of keywords) {
        if (expText.includes(keyword.toLowerCase())) {
          keywordMatches++;
        }
      }

      if (keywordMatches > 0) {
        relevantExperiences.push(`${exp.position} at ${exp.company}`);
        totalRelevanceScore += Math.min(keywordMatches / keywords.length, 1) * 100;
      }
    }

    const score = experiences.length > 0
      ? Math.round(totalRelevanceScore / experiences.length)
      : 0;

    return {
      score: Math.min(score, 100),
      relevantExperiences,
    };
  }

  /**
   * Calculate education match score
   */
  private calculateEducationMatch(
    educations: any[],
    requirements: Requirement[]
  ): { score: number; meetsRequirements: boolean } {
    if (educations.length === 0) {
      return { score: 0, meetsRequirements: false };
    }

    // Check if there are education requirements
    const educationReqs = requirements.filter(r => r.type === 'education');

    if (educationReqs.length === 0) {
      // No specific education requirements
      return { score: 100, meetsRequirements: true };
    }

    // Simple check: if user has any degree, give them credit
    const hasDegree = educations.some(e => e.degree);

    // Check for specific degree requirements
    let meetsRequirements = false;
    for (const req of educationReqs) {
      const reqText = req.text.toLowerCase();
      for (const edu of educations) {
        const eduText = `${edu.degree} ${edu.fieldOfStudy}`.toLowerCase();
        if (reqText.includes('bachelor') && eduText.includes('bachelor')) {
          meetsRequirements = true;
        } else if (reqText.includes('master') && eduText.includes('master')) {
          meetsRequirements = true;
        } else if (reqText.includes('phd') && eduText.includes('phd')) {
          meetsRequirements = true;
        }
      }
    }

    const score = meetsRequirements ? 100 : (hasDegree ? 70 : 0);

    return {
      score,
      meetsRequirements: meetsRequirements || hasDegree,
    };
  }

  /**
   * Generate recommendations based on match results
   */
  private generateRecommendations(
    skillMatch: any,
    experienceRelevance: any,
    educationMatch: any
  ): string[] {
    const recommendations: string[] = [];

    if (skillMatch.percentage < 70) {
      recommendations.push(
        `Consider adding these skills to your profile: ${skillMatch.missingSkills.slice(0, 3).join(', ')}`
      );
    }

    if (experienceRelevance.score < 60) {
      recommendations.push(
        'Highlight more relevant experience that matches the job requirements'
      );
    }

    if (!educationMatch.meetsRequirements) {
      recommendations.push(
        'Consider adding relevant certifications or education to strengthen your profile'
      );
    }

    if (skillMatch.percentage >= 80 && experienceRelevance.score >= 70) {
      recommendations.push(
        'Your profile is a strong match! Focus on tailoring your resume to highlight matching skills and experience.'
      );
    }

    return recommendations;
  }

  /**
   * Get job description by ID
   */
  async getJobDescription(jobId: string, userId: string) {
    const jobDescription = await prisma.jobDescription.findUnique({
      where: { id: jobId },
    });

    if (!jobDescription) {
      throw new Error('Job description not found');
    }

    if (jobDescription.userId !== userId) {
      throw new Error('Unauthorized access to job description');
    }

    return jobDescription;
  }

  /**
   * Get all job descriptions for a user
   */
  async getUserJobDescriptions(
    userId: string,
    options?: {
      page?: number;
      limit?: number;
      sortBy?: 'createdAt' | 'company' | 'position';
      sortOrder?: 'asc' | 'desc';
    }
  ) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    const sortBy = options?.sortBy || 'createdAt';
    const sortOrder = options?.sortOrder || 'desc';

    const [jobs, total] = await Promise.all([
      prisma.jobDescription.findMany({
        where: { userId },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.jobDescription.count({ where: { userId } }),
    ]);

    return {
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Delete job description
   */
  async deleteJobDescription(jobId: string, userId: string) {
    const jobDescription = await prisma.jobDescription.findUnique({
      where: { id: jobId },
    });

    if (!jobDescription) {
      throw new Error('Job description not found');
    }

    if (jobDescription.userId !== userId) {
      throw new Error('Unauthorized access to job description');
    }

    await prisma.jobDescription.delete({
      where: { id: jobId },
    });
  }
}

export const jobAnalysisService = new JobAnalysisService();
