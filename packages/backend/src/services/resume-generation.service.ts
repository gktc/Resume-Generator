import { Job } from 'bull';
import { prisma } from '../lib/prisma';
import { aiService } from './ai.service';
import { LaTeXCompilerService } from './latex-compiler.service';
import {
  SelectedContent,
  OptimizedContent,
  ATSScore,
  ResumeGenerationResult,
  SelectedWorkExperience,
  SelectedSkill,
  SelectedProject,
} from '../types/resume.types';

export class ResumeGenerationService {
  private latexCompiler: LaTeXCompilerService;

  constructor() {
    this.latexCompiler = new LaTeXCompilerService();
  }

  /**
   * Main method to generate a resume
   */
  async generateResume(
    userId: string,
    jobDescriptionId: string,
    templateId: string,
    resumeId: string,
    job?: Job
  ): Promise<ResumeGenerationResult> {
    try {
      // Step 1: Fetch user profile and job analysis
      if (job) await job.progress(25);
      const { profile, jobAnalysis } = await this.fetchData(userId, jobDescriptionId);

      // Step 2: Select relevant content
      if (job) await job.progress(35);
      const selectedContent = await this.selectRelevantContent(profile, jobAnalysis);

      // Step 3: Optimize content with AI
      if (job) await job.progress(50);
      const optimizedContent = await this.optimizeContent(selectedContent, jobAnalysis);

      // Step 4: Calculate ATS score
      if (job) await job.progress(65);
      const atsScore = await this.calculateATSScore(optimizedContent, jobAnalysis);

      // Step 5: Fetch template
      if (job) await job.progress(70);
      const template = await prisma.template.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        throw new Error('Template not found');
      }

      // Step 6: Compile LaTeX
      if (job) await job.progress(75);
      const { fileName, filePath } = await this.latexCompiler.compileResume(
        template.latexContent,
        optimizedContent,
        userId,
        jobAnalysis.company,
        jobAnalysis.position
      );

      // Step 7: Update resume record
      if (job) await job.progress(90);
      await prisma.resume.update({
        where: { id: resumeId },
        data: {
          fileName,
          filePath,
          atsScore: atsScore as any,
          generatedContent: optimizedContent as any,
          status: 'completed',
        },
      });

      return {
        resumeId,
        fileName,
        filePath,
        atsScore,
        status: 'completed',
      };
    } catch (error: any) {
      console.error('Resume generation error:', error);
      throw error;
    }
  }

  /**
   * Fetch user profile and job analysis data
   */
  private async fetchData(userId: string, jobDescriptionId: string) {
    const [user, workExperiences, educations, skills, projects, jobDescription] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.workExperience.findMany({
        where: { userId },
        orderBy: { order: 'asc' },
      }),
      prisma.education.findMany({
        where: { userId },
        orderBy: { order: 'asc' },
      }),
      prisma.skill.findMany({
        where: { userId },
        orderBy: { order: 'asc' },
      }),
      prisma.project.findMany({
        where: { userId },
        orderBy: { order: 'asc' },
      }),
      prisma.jobDescription.findUnique({
        where: { id: jobDescriptionId },
      }),
    ]);

    if (!user || !jobDescription) {
      throw new Error('User or job description not found');
    }

    const jobAnalysis = jobDescription.analyzedData as any;

    return {
      profile: {
        user,
        workExperiences,
        educations,
        skills,
        projects,
      },
      jobAnalysis: {
        ...jobAnalysis,
        company: jobDescription.company,
        position: jobDescription.position,
        rawText: jobDescription.rawText,
      },
    };
  }

  /**
   * Select relevant content based on job requirements
   */
  async selectRelevantContent(profile: any, jobAnalysis: any): Promise<SelectedContent> {
    const { user, workExperiences, educations, skills, projects } = profile;
    const { requirements = [], skills: jobSkills = [], keywords = [] } = jobAnalysis;

    // Extract all relevant keywords from job analysis
    const allJobKeywords = new Set<string>();
    
    // Add job skills
    jobSkills.forEach((skill: string) => {
      allJobKeywords.add(skill.toLowerCase());
    });
    
    // Add keywords
    keywords.forEach((keyword: string) => {
      allJobKeywords.add(keyword.toLowerCase());
    });
    
    // Add requirement keywords
    requirements.forEach((req: any) => {
      const words = req.text?.toLowerCase().split(/\s+/) || [];
      words.forEach((word: string) => {
        if (word.length > 3) {
          allJobKeywords.add(word);
        }
      });
    });

    // Score work experiences
    const scoredExperiences: SelectedWorkExperience[] = workExperiences.map((exp: any) => {
      const relevanceScore = this.calculateExperienceRelevance(exp, allJobKeywords, jobAnalysis);
      return {
        ...exp,
        relevanceScore,
      };
    });

    // Consolidate experiences from the same company
    const consolidatedExperiences = this.consolidateCompanyExperiences(scoredExperiences);

    // Sort by relevance and select top experiences
    const sortedExperiences = consolidatedExperiences.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const selectedExperiences = sortedExperiences.slice(0, 5); // Top 5 most relevant

    // Score skills
    const scoredSkills: SelectedSkill[] = skills.map((skill: any) => {
      const relevanceScore = this.calculateSkillRelevance(skill, allJobKeywords);
      return {
        ...skill,
        relevanceScore,
      };
    });

    // Sort by relevance and prioritize matching skills
    const sortedSkills = scoredSkills.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const selectedSkills = sortedSkills.slice(0, 20); // Top 20 skills

    // Score projects
    const scoredProjects: SelectedProject[] = projects.map((project: any) => {
      const relevanceScore = this.calculateProjectRelevance(project, allJobKeywords);
      return {
        ...project,
        relevanceScore,
      };
    });

    // Sort by relevance and select top projects
    const sortedProjects = scoredProjects.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const selectedProjects = sortedProjects.slice(0, 3); // Top 3 projects

    // Include all education entries
    const selectedEducations = educations.map((edu: any) => ({
      id: edu.id,
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate,
      gpa: edu.gpa,
      achievements: edu.achievements,
    }));

    // Build personal info
    const personalInfo = {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone || '',
      location: user.location || '',
      linkedin: user.linkedinUrl || '',
      github: user.githubUrl || '',
      website: user.websiteUrl || '',
    };

    return {
      personalInfo,
      experience: selectedExperiences,
      education: selectedEducations,
      skills: selectedSkills,
      projects: selectedProjects,
    };
  }

  /**
   * Consolidate multiple experiences from the same company
   * Merges overlapping or consecutive roles at the same company
   */
  private consolidateCompanyExperiences(
    experiences: SelectedWorkExperience[]
  ): SelectedWorkExperience[] {
    // Group experiences by company (normalize company names)
    const companyGroups = new Map<string, SelectedWorkExperience[]>();

    experiences.forEach((exp) => {
      const companyKey = this.normalizeCompanyName(exp.company);
      if (!companyGroups.has(companyKey)) {
        companyGroups.set(companyKey, []);
      }
      companyGroups.get(companyKey)!.push(exp);
    });

    const consolidated: SelectedWorkExperience[] = [];

    companyGroups.forEach((companyExps, _companyKey) => {
      if (companyExps.length === 1) {
        // Single experience at this company, keep as is
        consolidated.push(companyExps[0]);
      } else {
        // Multiple experiences at same company - consolidate intelligently
        // Sort by start date (most recent first)
        const sorted = companyExps.sort((a, b) => {
          const dateA = new Date(a.startDate).getTime();
          const dateB = new Date(b.startDate).getTime();
          return dateB - dateA;
        });

        // Detect if these are truly different roles or duplicates
        const uniquePositions = new Set(sorted.map((exp) => exp.position.toLowerCase().trim()));

        if (uniquePositions.size === 1 && this.hasOverlappingDates(sorted)) {
          // Same position with overlapping dates - likely duplicates, merge completely
          const merged = this.mergeIdenticalRoles(sorted);
          consolidated.push(merged);
        } else {
          // Different positions or non-overlapping - show career progression
          const progression = this.createCareerProgression(sorted);
          consolidated.push(progression);
        }
      }
    });

    // Sort all consolidated experiences by start date (most recent first)
    return consolidated.sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return dateB - dateA;
    });
  }

  /**
   * Normalize company name for better matching
   */
  private normalizeCompanyName(company: string): string {
    return company
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\b(inc|corp|corporation|ltd|limited|llc)\b\.?/gi, '')
      .trim();
  }

  /**
   * Check if experiences have overlapping dates
   */
  private hasOverlappingDates(experiences: SelectedWorkExperience[]): boolean {
    for (let i = 0; i < experiences.length - 1; i++) {
      const current = experiences[i];
      const next = experiences[i + 1];

      const currentStart = new Date(current.startDate).getTime();
      const currentEnd = current.endDate ? new Date(current.endDate).getTime() : Date.now();
      const nextStart = new Date(next.startDate).getTime();
      const nextEnd = next.endDate ? new Date(next.endDate).getTime() : Date.now();

      // Check if dates overlap
      if (currentStart <= nextEnd && nextStart <= currentEnd) {
        return true;
      }
    }
    return false;
  }

  /**
   * Merge identical roles (likely duplicates)
   */
  private mergeIdenticalRoles(experiences: SelectedWorkExperience[]): SelectedWorkExperience {
    const primary = experiences[0];

    // Collect all unique achievements and rank them
    const achievementScores = new Map<string, number>();
    const allTechnologies = new Set<string>();

    experiences.forEach((exp) => {
      exp.achievements.forEach((achievement: string) => {
        const normalized = achievement.trim();
        // Score achievements based on length, numbers, and action verbs
        const score = this.scoreAchievement(normalized);
        achievementScores.set(normalized, Math.max(achievementScores.get(normalized) || 0, score));
      });

      exp.technologies.forEach((tech: string) => {
        allTechnologies.add(tech);
      });
    });

    // Select top achievements
    const topAchievements = Array.from(achievementScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([achievement]) => achievement);

    // Use the widest date range
    const startDate = experiences[experiences.length - 1].startDate; // Earliest
    const endDate = experiences[0].endDate; // Latest

    return {
      ...primary,
      startDate,
      endDate,
      achievements: topAchievements,
      technologies: Array.from(allTechnologies),
      relevanceScore: Math.max(...experiences.map((e) => e.relevanceScore)),
    };
  }

  /**
   * Create career progression entry showing role changes
   */
  private createCareerProgression(experiences: SelectedWorkExperience[]): SelectedWorkExperience {
    const primary = experiences[0]; // Most recent role

    // Collect all achievements and rank them
    const achievementScores = new Map<string, number>();
    const allTechnologies = new Set<string>();
    const positions: string[] = [];

    experiences.forEach((exp) => {
      if (!positions.includes(exp.position)) {
        positions.push(exp.position);
      }

      exp.achievements.forEach((achievement: string) => {
        const normalized = achievement.trim();
        const score = this.scoreAchievement(normalized);
        achievementScores.set(normalized, Math.max(achievementScores.get(normalized) || 0, score));
      });

      exp.technologies.forEach((tech: string) => {
        allTechnologies.add(tech);
      });
    });

    // Select top achievements
    const topAchievements = Array.from(achievementScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([achievement]) => achievement);

    // Create position title showing progression
    let positionTitle = primary.position;
    if (positions.length > 1) {
      const otherPositions = positions.slice(1).join(', ');
      positionTitle = `${primary.position} (promoted from ${otherPositions})`;
    }

    // Use the widest date range
    const startDate = experiences[experiences.length - 1].startDate;
    const endDate = experiences[0].endDate;

    return {
      ...primary,
      position: positionTitle,
      startDate,
      endDate,
      achievements: topAchievements,
      technologies: Array.from(allTechnologies),
      relevanceScore: Math.max(...experiences.map((e) => e.relevanceScore)),
    };
  }

  /**
   * Score achievement quality
   * Higher score = better achievement
   */
  private scoreAchievement(achievement: string): number {
    let score = 0;

    // Bonus for having numbers (quantifiable results)
    const hasNumbers = /\d+/.test(achievement);
    if (hasNumbers) {
      score += 10;
      // Extra bonus for percentages
      if (/%/.test(achievement)) {
        score += 5;
      }
    }

    // Bonus for strong action verbs
    const strongVerbs = [
      'developed',
      'implemented',
      'designed',
      'led',
      'managed',
      'created',
      'improved',
      'increased',
      'reduced',
      'optimized',
      'automated',
      'built',
      'architected',
      'launched',
      'delivered',
      'achieved',
      'spearheaded',
    ];
    const startsWithStrongVerb = strongVerbs.some((verb) =>
      achievement.toLowerCase().startsWith(verb)
    );
    if (startsWithStrongVerb) {
      score += 8;
    }

    // Bonus for reasonable length (not too short, not too long)
    const wordCount = achievement.split(/\s+/).length;
    if (wordCount >= 8 && wordCount <= 25) {
      score += 5;
    }

    // Bonus for impact words
    const impactWords = [
      'revenue',
      'efficiency',
      'performance',
      'scalability',
      'quality',
      'time',
      'cost',
    ];
    const hasImpactWord = impactWords.some((word) => achievement.toLowerCase().includes(word));
    if (hasImpactWord) {
      score += 5;
    }

    return score;
  }

  /**
   * Calculate relevance score for work experience
   */
  private calculateExperienceRelevance(
    experience: any,
    jobKeywords: Set<string>,
    _jobAnalysis: any
  ): number {
    let score = 0;
    const text = `${experience.position} ${experience.company} ${experience.description} ${experience.achievements.join(' ')} ${experience.technologies.join(' ')}`.toLowerCase();

    // Check keyword matches
    jobKeywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        score += 2;
      }
    });

    // Bonus for recent experience
    const endDate = experience.endDate || new Date();
    const monthsAgo = (Date.now() - new Date(endDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsAgo < 12) {
      score += 5;
    } else if (monthsAgo < 36) {
      score += 3;
    }

    // Bonus for longer duration
    const startDate = new Date(experience.startDate);
    const duration = (new Date(endDate).getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (duration > 24) {
      score += 3;
    } else if (duration > 12) {
      score += 2;
    }

    return score;
  }

  /**
   * Calculate relevance score for skill
   */
  private calculateSkillRelevance(skill: any, jobKeywords: Set<string>): number {
    let score = 0;
    const skillName = skill.name.toLowerCase();

    // Direct match with job keywords
    if (jobKeywords.has(skillName)) {
      score += 10;
    }

    // Partial match
    jobKeywords.forEach((keyword) => {
      if (skillName.includes(keyword) || keyword.includes(skillName)) {
        score += 5;
      }
    });

    // Bonus for proficiency level
    const proficiencyBonus: Record<string, number> = {
      expert: 4,
      advanced: 3,
      intermediate: 2,
      beginner: 1,
    };
    score += proficiencyBonus[skill.proficiency] || 0;

    // Bonus for years of experience
    if (skill.yearsOfExperience) {
      score += Math.min(skill.yearsOfExperience, 5);
    }

    return score;
  }

  /**
   * Calculate relevance score for project
   */
  private calculateProjectRelevance(project: any, jobKeywords: Set<string>): number {
    let score = 0;
    const text = `${project.title} ${project.description} ${project.technologies.join(' ')} ${project.highlights.join(' ')}`.toLowerCase();

    // Check keyword matches
    jobKeywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        score += 2;
      }
    });

    // Bonus for recent projects
    const endDate = project.endDate || new Date();
    const monthsAgo = (Date.now() - new Date(endDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsAgo < 12) {
      score += 3;
    } else if (monthsAgo < 24) {
      score += 2;
    }

    // Bonus for having URL or GitHub
    if (project.url || project.githubUrl) {
      score += 2;
    }

    return score;
  }



  /**
   * Optimize content with AI
   */
  async optimizeContent(
    selectedContent: SelectedContent,
    jobAnalysis: any
  ): Promise<OptimizedContent> {
    const { company, position, skills: jobSkills = [], keywords = [] } = jobAnalysis;

    // Generate professional summary
    const summary = await this.generateProfessionalSummary(
      selectedContent,
      company,
      position,
      jobSkills,
      keywords
    );

    // Optimize work experience bullet points
    const optimizedExperience = await Promise.all(
      selectedContent.experience.map(async (exp) => {
        const optimizedAchievements = await this.optimizeBulletPoints(
          exp.achievements,
          exp.position,
          jobSkills,
          keywords
        );

        return {
          company: exp.company,
          position: exp.position,
          startDate: exp.startDate,
          endDate: exp.endDate,
          description: exp.description,
          achievements: optimizedAchievements,
          technologies: exp.technologies,
        };
      })
    );

    // Optimize project highlights
    const optimizedProjects = await Promise.all(
      selectedContent.projects.map(async (project) => {
        const optimizedHighlights = await this.optimizeBulletPoints(
          project.highlights,
          project.title,
          jobSkills,
          keywords
        );

        return {
          title: project.title,
          description: project.description,
          technologies: project.technologies,
          url: project.url,
          githubUrl: project.githubUrl,
          startDate: project.startDate,
          endDate: project.endDate,
          highlights: optimizedHighlights,
        };
      })
    );

    return {
      personalInfo: selectedContent.personalInfo,
      summary,
      experience: optimizedExperience,
      education: selectedContent.education.map((edu) => ({
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        startDate: edu.startDate,
        endDate: edu.endDate,
        gpa: edu.gpa,
        achievements: edu.achievements,
      })),
      skills: selectedContent.skills.map((skill) => ({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        yearsOfExperience: skill.yearsOfExperience,
      })),
      projects: optimizedProjects,
    };
  }

  /**
   * Generate professional summary using AI
   */
  private async generateProfessionalSummary(
    content: SelectedContent,
    company: string,
    position: string,
    jobSkills: string[],
    keywords: string[]
  ): Promise<string> {
    const experienceSummary = content.experience
      .slice(0, 3)
      .map((exp) => `${exp.position} at ${exp.company}`)
      .join(', ');

    const topSkills = content.skills
      .slice(0, 10)
      .map((s) => s.name)
      .join(', ');

    const prompt = `Generate a professional resume summary (2-3 sentences) for a ${position} position at ${company}.

Candidate background:
- Recent experience: ${experienceSummary}
- Key skills: ${topSkills}

Job requirements:
- Required skills: ${jobSkills.join(', ')}
- Keywords to incorporate: ${keywords.slice(0, 10).join(', ')}

Write a compelling summary that:
1. Highlights relevant experience and skills
2. Naturally incorporates job keywords
3. Demonstrates value for the ${position} role
4. Maintains authenticity and professionalism
5. Is concise (2-3 sentences maximum)

Return ONLY the summary text, no additional formatting or explanation.`;

    try {
      const response = await aiService.generateCompletion(prompt, undefined, {
        temperature: 0.7,
        maxTokens: 500,
      });
      return response.trim();
    } catch (error) {
      console.error('Failed to generate summary:', error);
      // Fallback summary
      return `Experienced professional with expertise in ${topSkills.split(',').slice(0, 3).join(', ')}. Proven track record in ${experienceSummary.split(',')[0]}. Seeking to leverage skills and experience in the ${position} role.`;
    }
  }

  /**
   * Optimize bullet points using AI
   */
  private async optimizeBulletPoints(
    bulletPoints: string[],
    context: string,
    jobSkills: string[],
    keywords: string[]
  ): Promise<string[]> {
    if (bulletPoints.length === 0) {
      return [];
    }

    const prompt = `Optimize these resume bullet points for ATS and readability.

Context: ${context}
Target job skills: ${jobSkills.join(', ')}
Keywords to incorporate: ${keywords.slice(0, 15).join(', ')}

Original bullet points:
${bulletPoints.map((bp, i) => `${i + 1}. ${bp}`).join('\n')}

Requirements:
1. Start each bullet with a strong action verb
2. Include quantifiable metrics where possible
3. Naturally incorporate relevant keywords from the job
4. Keep each bullet concise (1-2 lines)
5. Maintain authenticity - don't fabricate information
6. Focus on achievements and impact, not just responsibilities

Return ONLY the optimized bullet points, one per line, without numbering or additional formatting.`;

    try {
      const response = await aiService.generateCompletion(prompt, undefined, {
        temperature: 0.7,
        maxTokens: 1000,
      });
      const optimized = response
        .trim()
        .split('\n')
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => line.replace(/^[-•*]\s*/, '').trim());

      // If AI returns fewer bullets, pad with originals
      if (optimized.length < bulletPoints.length) {
        return [...optimized, ...bulletPoints.slice(optimized.length)];
      }

      return optimized.slice(0, bulletPoints.length);
    } catch (error) {
      console.error('Failed to optimize bullet points:', error);
      return bulletPoints; // Return original on error
    }
  }

  /**
   * Calculate ATS score
   */
  async calculateATSScore(content: OptimizedContent, jobAnalysis: any): Promise<ATSScore> {
    const { requirements = [], skills: jobSkills = [], keywords = [], experienceLevel = '' } = jobAnalysis;

    // 1. Calculate keyword match score (40% weight)
    const keywordScore = this.calculateKeywordMatchScore(content, jobSkills, keywords);

    // 2. Calculate experience relevance score (30% weight)
    const experienceScore = this.calculateExperienceRelevanceScore(content, experienceLevel, requirements);

    // 3. Calculate format parseability score (20% weight)
    const formatScore = this.calculateFormatParseabilityScore(content);

    // 4. Calculate education match score (10% weight)
    const educationScore = this.calculateEducationMatchScore(content, requirements);

    // Calculate weighted overall score
    const overall = Math.round(
      keywordScore.score * 0.4 +
      experienceScore.score * 0.3 +
      formatScore.score * 0.2 +
      educationScore.score * 0.1
    );

    // Generate suggestions
    const suggestions = this.generateSuggestions(
      keywordScore,
      experienceScore,
      formatScore,
      educationScore
    );

    return {
      overall,
      breakdown: {
        keywordMatch: keywordScore.score,
        experienceRelevance: experienceScore.score,
        formatParseability: formatScore.score,
        educationMatch: educationScore.score,
      },
      missingKeywords: keywordScore.missing,
      suggestions,
    };
  }

  /**
   * Calculate keyword matching score
   */
  private calculateKeywordMatchScore(
    content: OptimizedContent,
    jobSkills: string[],
    keywords: string[]
  ): { score: number; missing: string[] } {
    // Combine all resume text
    const resumeText = [
      content.summary,
      ...content.experience.flatMap((exp) => [exp.position, exp.description, ...exp.achievements]),
      ...content.skills.map((s) => s.name),
      ...content.projects.flatMap((p) => [p.title, p.description, ...p.highlights]),
    ]
      .join(' ')
      .toLowerCase();

    // Combine all job keywords
    const allKeywords = [...new Set([...jobSkills, ...keywords])].map((k) => k.toLowerCase());

    // Count matches
    let matchCount = 0;
    const missing: string[] = [];

    allKeywords.forEach((keyword) => {
      if (resumeText.includes(keyword)) {
        matchCount++;
      } else {
        missing.push(keyword);
      }
    });

    const matchPercentage = allKeywords.length > 0 ? (matchCount / allKeywords.length) * 100 : 100;

    return {
      score: Math.round(matchPercentage),
      missing: missing.slice(0, 10), // Top 10 missing keywords
    };
  }

  /**
   * Calculate experience relevance score
   */
  private calculateExperienceRelevanceScore(
    content: OptimizedContent,
    experienceLevel: string,
    _requirements: any[]
  ): { score: number } {
    let score = 0;

    // Calculate total years of experience
    let totalMonths = 0;
    content.experience.forEach((exp) => {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
      totalMonths += months;
    });
    const totalYears = totalMonths / 12;

    // Score based on experience level match
    const levelScores: Record<string, { min: number; max: number; score: number }> = {
      entry: { min: 0, max: 2, score: 80 },
      junior: { min: 1, max: 3, score: 80 },
      mid: { min: 2, max: 5, score: 85 },
      senior: { min: 5, max: 10, score: 90 },
      lead: { min: 7, max: 15, score: 90 },
      principal: { min: 10, max: 20, score: 95 },
    };

    const level = experienceLevel.toLowerCase();
    if (levelScores[level]) {
      const { min, max, score: baseScore } = levelScores[level];
      if (totalYears >= min && totalYears <= max) {
        score = baseScore;
      } else if (totalYears > max) {
        score = Math.max(baseScore - 5, 70); // Slightly penalize overqualification
      } else {
        score = Math.max(baseScore - 20, 50); // Penalize underqualification
      }
    } else {
      // Default scoring based on having experience
      score = totalYears > 0 ? 75 : 50;
    }

    // Bonus for having multiple relevant positions
    if (content.experience.length >= 3) {
      score = Math.min(score + 10, 100);
    }

    // Bonus for recent experience
    const mostRecentEnd = content.experience[0]?.endDate || new Date();
    const monthsSinceRecent = (Date.now() - new Date(mostRecentEnd).getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsSinceRecent < 6) {
      score = Math.min(score + 5, 100);
    }

    return { score: Math.round(score) };
  }

  /**
   * Calculate format parseability score
   */
  private calculateFormatParseabilityScore(content: OptimizedContent): { score: number } {
    let score = 100;

    // Check for required sections
    if (!content.summary || content.summary.length < 50) {
      score -= 10;
    }

    if (content.experience.length === 0) {
      score -= 20;
    }

    if (content.skills.length === 0) {
      score -= 15;
    }

    if (content.education.length === 0) {
      score -= 10;
    }

    // Check for good structure in experience
    content.experience.forEach((exp) => {
      if (exp.achievements.length === 0) {
        score -= 5;
      }
      if (!exp.position || !exp.company) {
        score -= 5;
      }
    });

    // Bonus for having projects
    if (content.projects.length > 0) {
      score = Math.min(score + 5, 100);
    }

    // Bonus for having contact info
    if (content.personalInfo.email && content.personalInfo.phone) {
      score = Math.min(score + 5, 100);
    }

    return { score: Math.max(score, 0) };
  }

  /**
   * Calculate education match score
   */
  private calculateEducationMatchScore(content: OptimizedContent, requirements: any[]): { score: number } {
    let score = 70; // Base score for having education

    if (content.education.length === 0) {
      return { score: 50 };
    }

    // Check for degree requirements in job
    const requirementText = requirements.map((r) => r.text?.toLowerCase() || '').join(' ');
    const hasBachelorReq = requirementText.includes('bachelor') || requirementText.includes("bachelor's");
    const hasMasterReq = requirementText.includes('master') || requirementText.includes("master's");
    const hasPhDReq = requirementText.includes('phd') || requirementText.includes('doctorate');

    // Check candidate's education
    const degrees = content.education.map((edu) => edu.degree.toLowerCase());
    const hasBachelor = degrees.some((d) => d.includes('bachelor'));
    const hasMaster = degrees.some((d) => d.includes('master'));
    const hasPhD = degrees.some((d) => d.includes('phd') || d.includes('doctorate'));

    // Score based on match
    if (hasPhDReq && hasPhD) {
      score = 100;
    } else if (hasMasterReq && hasMaster) {
      score = 95;
    } else if (hasBachelorReq && hasBachelor) {
      score = 90;
    } else if (hasBachelor) {
      score = 85;
    }

    // Bonus for GPA if present
    const hasGoodGPA = content.education.some((edu) => edu.gpa && edu.gpa >= 3.5);
    if (hasGoodGPA) {
      score = Math.min(score + 5, 100);
    }

    // Bonus for achievements
    const hasAchievements = content.education.some((edu) => edu.achievements.length > 0);
    if (hasAchievements) {
      score = Math.min(score + 5, 100);
    }

    return { score: Math.round(score) };
  }

  /**
   * Generate improvement suggestions
   */
  private generateSuggestions(
    keywordScore: any,
    experienceScore: any,
    formatScore: any,
    educationScore: any
  ): string[] {
    const suggestions: string[] = [];

    if (keywordScore.score < 70) {
      suggestions.push(
        `Incorporate more job-specific keywords. Missing: ${keywordScore.missing.slice(0, 5).join(', ')}`
      );
    }

    if (experienceScore.score < 70) {
      suggestions.push('Highlight more relevant work experience that aligns with the job requirements');
    }

    if (formatScore.score < 80) {
      suggestions.push('Improve resume structure by adding more detailed achievements and bullet points');
    }

    if (educationScore.score < 70) {
      suggestions.push('Ensure your education section clearly lists relevant degrees and achievements');
    }

    if (keywordScore.missing.length > 0) {
      suggestions.push(
        'Consider adding these skills if you have them: ' + keywordScore.missing.slice(0, 3).join(', ')
      );
    }

    return suggestions;
  }
}
