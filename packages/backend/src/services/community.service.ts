import { prisma } from '../lib/prisma';

export interface InterviewExperienceInput {
  company: string;
  role: string;
  interviewDate: Date;
  outcome: 'offer' | 'rejected' | 'pending' | 'withdrew';
  overallDifficulty: 'easy' | 'medium' | 'hard';
  preparationTips: string[];
  rounds: InterviewRoundInput[];
}

export interface InterviewRoundInput {
  roundNumber: number;
  roundType: 'phone-screen' | 'technical' | 'system-design' | 'behavioral' | 'cultural-fit' | 'take-home' | 'onsite';
  duration: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  questions: string[];
  notes: string;
}

export interface CompanyInsights {
  company: string;
  role: string;
  totalSubmissions: number;
  lastUpdated: Date;
  processStructure: {
    averageRounds: number;
    commonRoundTypes: { type: string; frequency: number }[];
    averageDuration: number; // days from first to last round
  };
  commonQuestions: { question: string; frequency: number; category: string }[];
  topicFrequency: { topic: string; frequency: number }[];
  difficultyDistribution: { easy: number; medium: number; hard: number };
  successTips: string[];
}

export class CommunityService {
  /**
   * Submit an interview experience
   */
  async submitExperience(
    userId: string,
    data: InterviewExperienceInput
  ): Promise<any> {
    // Anonymize the experience data
    const anonymizedData = this.anonymizeExperience(data);

    // Create the interview experience with rounds
    const experience = await prisma.interviewExperience.create({
      data: {
        userId,
        company: anonymizedData.company,
        role: anonymizedData.role,
        interviewDate: anonymizedData.interviewDate,
        outcome: anonymizedData.outcome,
        overallDifficulty: anonymizedData.overallDifficulty,
        preparationTips: anonymizedData.preparationTips,
        isAnonymous: true,
        rounds: {
          create: anonymizedData.rounds.map((round) => ({
            roundNumber: round.roundNumber,
            roundType: round.roundType,
            duration: round.duration,
            difficulty: round.difficulty,
            topics: round.topics,
            questions: round.questions,
            notes: round.notes,
          })),
        },
      },
      include: {
        rounds: true,
      },
    });

    return experience;
  }

  /**
   * Anonymize interview experience data
   */
  anonymizeExperience(data: InterviewExperienceInput): InterviewExperienceInput {
    // Sanitize preparation tips to remove PII
    const sanitizedTips = data.preparationTips.map((tip) => this.sanitizeText(tip));

    // Sanitize round notes and questions
    const sanitizedRounds = data.rounds.map((round) => ({
      ...round,
      notes: this.sanitizeText(round.notes),
      questions: round.questions.map((q) => this.sanitizeText(q)),
    }));

    return {
      ...data,
      preparationTips: sanitizedTips,
      rounds: sanitizedRounds,
    };
  }

  /**
   * Sanitize text to remove common PII patterns
   */
  private sanitizeText(text: string): string {
    if (!text) return text;

    let sanitized = text;

    // Remove email addresses
    sanitized = sanitized.replace(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      '[email]'
    );

    // Remove phone numbers (various formats)
    sanitized = sanitized.replace(
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
      '[phone]'
    );

    // Remove URLs
    sanitized = sanitized.replace(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
      '[url]'
    );

    // Remove common name patterns (Mr., Mrs., Ms., Dr. followed by capitalized words)
    sanitized = sanitized.replace(
      /\b(Mr\.|Mrs\.|Ms\.|Dr\.)\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?\b/g,
      '[name]'
    );

    return sanitized;
  }

  /**
   * Get aggregated company insights
   */
  async getCompanyInsights(
    company: string,
    role: string
  ): Promise<CompanyInsights | null> {
    // Fetch all experiences for this company and role
    const experiences = await prisma.interviewExperience.findMany({
      where: {
        company: {
          equals: company,
          mode: 'insensitive',
        },
        role: {
          equals: role,
          mode: 'insensitive',
        },
        isAnonymous: true,
      },
      include: {
        rounds: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (experiences.length === 0) {
      return null;
    }

    // Aggregate insights
    return this.aggregateCompanyInsights(company, role, experiences);
  }

  /**
   * Aggregate insights from multiple experiences
   */
  private aggregateCompanyInsights(
    company: string,
    role: string,
    experiences: any[]
  ): CompanyInsights {
    const totalSubmissions = experiences.length;
    const lastUpdated = experiences[0].createdAt;

    // Calculate average number of rounds
    const totalRounds = experiences.reduce(
      (sum, exp) => sum + exp.rounds.length,
      0
    );
    const averageRounds = Math.round(totalRounds / totalSubmissions);

    // Calculate common round types
    const roundTypeCounts: Record<string, number> = {};
    experiences.forEach((exp) => {
      exp.rounds.forEach((round: any) => {
        roundTypeCounts[round.roundType] = (roundTypeCounts[round.roundType] || 0) + 1;
      });
    });

    const commonRoundTypes = Object.entries(roundTypeCounts)
      .map(([type, count]) => ({
        type,
        frequency: count / totalSubmissions,
      }))
      .sort((a, b) => b.frequency - a.frequency);

    // Calculate average process duration (simplified - using 0 for now as we don't track dates per round)
    const averageDuration = 0;

    // Aggregate common questions
    const questionCounts: Record<string, { count: number; category: string }> = {};
    experiences.forEach((exp) => {
      exp.rounds.forEach((round: any) => {
        round.questions.forEach((question: string) => {
          if (!questionCounts[question]) {
            questionCounts[question] = {
              count: 0,
              category: this.categorizeQuestion(round.roundType),
            };
          }
          questionCounts[question].count++;
        });
      });
    });

    const commonQuestions = Object.entries(questionCounts)
      .map(([question, data]) => ({
        question,
        frequency: data.count / totalSubmissions,
        category: data.category,
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 20); // Top 20 questions

    // Calculate topic frequency
    const topicCounts: Record<string, number> = {};
    experiences.forEach((exp) => {
      exp.rounds.forEach((round: any) => {
        round.topics.forEach((topic: string) => {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });
      });
    });

    const topicFrequency = Object.entries(topicCounts)
      .map(([topic, count]) => ({
        topic,
        frequency: count / totalSubmissions,
      }))
      .sort((a, b) => b.frequency - a.frequency);

    // Calculate difficulty distribution
    const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
    experiences.forEach((exp) => {
      difficultyCounts[exp.overallDifficulty as keyof typeof difficultyCounts]++;
    });

    const difficultyDistribution = {
      easy: difficultyCounts.easy / totalSubmissions,
      medium: difficultyCounts.medium / totalSubmissions,
      hard: difficultyCounts.hard / totalSubmissions,
    };

    // Collect and deduplicate success tips
    const allTips = new Set<string>();
    experiences.forEach((exp) => {
      exp.preparationTips.forEach((tip: string) => {
        if (tip && tip.trim()) {
          allTips.add(tip.trim());
        }
      });
    });

    const successTips = Array.from(allTips);

    return {
      company,
      role,
      totalSubmissions,
      lastUpdated,
      processStructure: {
        averageRounds,
        commonRoundTypes,
        averageDuration,
      },
      commonQuestions,
      topicFrequency,
      difficultyDistribution,
      successTips,
    };
  }

  /**
   * Categorize question based on round type
   */
  private categorizeQuestion(roundType: string): string {
    const categoryMap: Record<string, string> = {
      'phone-screen': 'screening',
      'technical': 'technical',
      'system-design': 'technical',
      'behavioral': 'behavioral',
      'cultural-fit': 'behavioral',
      'take-home': 'technical',
      'onsite': 'mixed',
    };

    return categoryMap[roundType] || 'general';
  }

  /**
   * Get list of companies with available data
   */
  async getAvailableCompanies(): Promise<{ company: string; role: string; count: number }[]> {
    // Get unique company-role combinations with counts
    const results = await prisma.interviewExperience.groupBy({
      by: ['company', 'role'],
      where: {
        isAnonymous: true,
      },
      _count: {
        id: true,
      },
      orderBy: [
        {
          company: 'asc',
        },
        {
          role: 'asc',
        },
      ],
    });

    return results.map((result) => ({
      company: result.company,
      role: result.role,
      count: result._count.id,
    }));
  }
}

export const communityService = new CommunityService();
