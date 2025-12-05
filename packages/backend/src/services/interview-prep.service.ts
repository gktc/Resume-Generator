import { prisma } from '../lib/prisma';
import { aiService } from './ai.service';

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'experience' | 'role-specific';
  difficulty: 'easy' | 'medium' | 'hard';
  relatedContent: string;
  answerFramework: string | null;
  talkingPoints: string[];
}

export interface CategorizedQuestions {
  technical: InterviewQuestion[];
  behavioral: InterviewQuestion[];
  experience: InterviewQuestion[];
  roleSpecific: InterviewQuestion[];
}

export class InterviewPrepService {
  /**
   * Generate interview questions for a resume
   */
  async generateQuestionsForResume(
    userId: string,
    resumeId: string
  ): Promise<InterviewQuestion[]> {
    // Check if questions already exist
    const existingQuestions = await prisma.interviewQuestion.findMany({
      where: {
        userId,
        resumeId,
      },
    });

    if (existingQuestions.length > 0) {
      return existingQuestions.map((q) => ({
        id: q.id,
        question: q.question,
        category: q.category as any,
        difficulty: q.difficulty as any,
        relatedContent: q.relatedContent,
        answerFramework: q.answerFramework,
        talkingPoints: q.talkingPoints,
      }));
    }

    // Fetch resume with job description
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      include: {
        jobDescription: true,
      },
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    if (resume.userId !== userId) {
      throw new Error('Unauthorized access to resume');
    }

    // Generate questions using AI
    const questions = await this.generateQuestions(resume);

    // Generate answer frameworks for each question
    const questionsWithFrameworks = await this.generateAnswerFrameworks(
      questions,
      resume
    );

    // Store questions in database
    const storedQuestions = await Promise.all(
      questionsWithFrameworks.map((q) =>
        prisma.interviewQuestion.create({
          data: {
            userId,
            resumeId,
            question: q.question,
            category: q.category,
            difficulty: q.difficulty,
            relatedContent: q.relatedContent,
            answerFramework: q.answerFramework,
            talkingPoints: q.talkingPoints,
          },
        })
      )
    );

    return storedQuestions.map((q) => ({
      id: q.id,
      question: q.question,
      category: q.category as any,
      difficulty: q.difficulty as any,
      relatedContent: q.relatedContent,
      answerFramework: q.answerFramework,
      talkingPoints: q.talkingPoints,
    }));
  }

  /**
   * Generate interview questions using AI
   */
  private async generateQuestions(resume: any): Promise<Omit<InterviewQuestion, 'id' | 'answerFramework' | 'talkingPoints'>[]> {
    const generatedContent = resume.generatedContent;
    const jobDescription = resume.jobDescription;
    const jobAnalysis = jobDescription.analyzedData;

    const systemPrompt = 'You are an expert interview coach who generates realistic interview questions based on resumes and job descriptions.';

    const prompt = `Based on the following resume and job description, generate interview questions that an interviewer might ask.

Job Information:
- Company: ${jobDescription.company}
- Position: ${jobDescription.position}
- Required Skills: ${jobAnalysis.skills?.join(', ') || 'N/A'}
- Experience Level: ${jobAnalysis.experienceLevel || 'N/A'}

Resume Summary:
${generatedContent.summary || 'N/A'}

Work Experience:
${generatedContent.experience?.map((exp: any) => 
  `- ${exp.position} at ${exp.company}: ${exp.description}`
).join('\n') || 'N/A'}

Skills:
${generatedContent.skills?.map((skill: any) => skill.name).join(', ') || 'N/A'}

Projects:
${generatedContent.projects?.map((proj: any) => 
  `- ${proj.title}: ${proj.description}`
).join('\n') || 'N/A'}

Generate 12-15 interview questions across these categories:
1. Technical questions (3-4) - about specific skills and technologies mentioned
2. Behavioral questions (3-4) - using STAR method scenarios
3. Experience-based questions (3-4) - about specific work experiences and achievements
4. Role-specific questions (3-4) - tailored to the target position

For each question, reference specific content from the resume when possible.

Return a JSON array with this structure:
[
  {
    "question": "the interview question",
    "category": "technical" | "behavioral" | "experience" | "role-specific",
    "difficulty": "easy" | "medium" | "hard",
    "relatedContent": "specific resume content this question relates to"
  }
]`;

    try {
      const response = await aiService.generateJSON<any>(prompt, systemPrompt, {
        temperature: 0.7,
        maxTokens: 3000,
      });

      console.log('Interview questions response type:', typeof response);
      console.log('Is array:', Array.isArray(response));
      console.log('Response keys:', Object.keys(response));

      // Handle both array and object with questions property
      let questions: any[];
      if (Array.isArray(response)) {
        questions = response;
      } else if (response.questions && Array.isArray(response.questions)) {
        questions = response.questions;
      } else {
        console.error('Unexpected response format:', response);
        throw new Error('Invalid response format from AI');
      }

      return questions.map((q) => ({
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
        relatedContent: q.relatedContent || '',
      }));
    } catch (error) {
      console.error('Failed to generate interview questions:', error);
      // Return fallback questions
      return this.getFallbackQuestions(jobDescription.position);
    }
  }

  /**
   * Generate answer frameworks for questions
   */
  private async generateAnswerFrameworks(
    questions: Omit<InterviewQuestion, 'id' | 'answerFramework' | 'talkingPoints'>[],
    resume: any
  ): Promise<Omit<InterviewQuestion, 'id'>[]> {
    const generatedContent = resume.generatedContent;

    const systemPrompt = 'You are an expert interview coach who helps candidates prepare strong answers using frameworks like STAR method.';

    const results = await Promise.all(
      questions.map(async (question) => {
        const prompt = `For the following interview question, provide an answer framework and talking points based on the candidate's background.

Question: ${question.question}
Category: ${question.category}
Related Resume Content: ${question.relatedContent}

Candidate's Background:
- Summary: ${generatedContent.summary || 'N/A'}
- Experience: ${generatedContent.experience?.map((exp: any) => 
  `${exp.position} at ${exp.company}`
).join(', ') || 'N/A'}
- Skills: ${generatedContent.skills?.map((skill: any) => skill.name).join(', ') || 'N/A'}

Provide:
1. An answer framework (for behavioral questions, use STAR method: Situation, Task, Action, Result)
2. 3-5 specific talking points the candidate should mention, based on their actual experience

Return a JSON object with this structure:
{
  "answerFramework": "the framework or structure for answering (e.g., STAR method breakdown)",
  "talkingPoints": ["point 1", "point 2", "point 3"]
}`;

        try {
          const framework = await aiService.generateJSON<{
            answerFramework: string;
            talkingPoints: string[];
          }>(prompt, systemPrompt, {
            temperature: 0.6,
            maxTokens: 1000,
          });

          return {
            ...question,
            answerFramework: framework.answerFramework,
            talkingPoints: framework.talkingPoints || [],
          };
        } catch (error) {
          console.error(`Failed to generate framework for question: ${question.question}`, error);
          // Return question without framework
          return {
            ...question,
            answerFramework: this.getDefaultFramework(question.category),
            talkingPoints: ['Review your relevant experience', 'Prepare specific examples', 'Practice your response'],
          };
        }
      })
    );

    return results;
  }

  /**
   * Get default answer framework based on category
   */
  private getDefaultFramework(category: string): string {
    switch (category) {
      case 'behavioral':
        return 'Use the STAR method:\n- Situation: Describe the context\n- Task: Explain the challenge\n- Action: Detail what you did\n- Result: Share the outcome';
      case 'technical':
        return 'Structure your answer:\n1. Define the concept\n2. Explain your experience with it\n3. Provide a specific example\n4. Discuss best practices';
      case 'experience':
        return 'Answer framework:\n1. Provide context about the situation\n2. Explain your role and responsibilities\n3. Describe your approach and actions\n4. Share the results and learnings';
      case 'role-specific':
        return 'Structure your response:\n1. Show understanding of the role\n2. Connect to your relevant experience\n3. Provide specific examples\n4. Explain how you\'d apply this in the new role';
      default:
        return 'Prepare a structured response with specific examples from your experience.';
    }
  }

  /**
   * Get fallback questions when AI fails
   */
  private getFallbackQuestions(position: string): Omit<InterviewQuestion, 'id' | 'answerFramework' | 'talkingPoints'>[] {
    return [
      {
        question: 'Tell me about yourself and your background.',
        category: 'behavioral',
        difficulty: 'easy',
        relatedContent: 'General background and experience',
      },
      {
        question: `What interests you about this ${position} role?`,
        category: 'role-specific',
        difficulty: 'easy',
        relatedContent: 'Career goals and motivation',
      },
      {
        question: 'Describe a challenging project you worked on and how you overcame obstacles.',
        category: 'behavioral',
        difficulty: 'medium',
        relatedContent: 'Problem-solving and resilience',
      },
      {
        question: 'What are your greatest strengths and how do they apply to this role?',
        category: 'behavioral',
        difficulty: 'easy',
        relatedContent: 'Skills and self-awareness',
      },
      {
        question: 'Tell me about a time you worked in a team to achieve a goal.',
        category: 'behavioral',
        difficulty: 'medium',
        relatedContent: 'Teamwork and collaboration',
      },
      {
        question: 'How do you stay current with industry trends and technologies?',
        category: 'technical',
        difficulty: 'easy',
        relatedContent: 'Learning and professional development',
      },
    ];
  }

  /**
   * Get categorized questions for a resume
   */
  async getCategorizedQuestions(
    userId: string,
    resumeId: string,
    category?: string,
    difficulty?: string
  ): Promise<CategorizedQuestions> {
    const whereClause: any = {
      userId,
      resumeId,
    };

    if (category) {
      whereClause.category = category;
    }

    if (difficulty) {
      whereClause.difficulty = difficulty;
    }

    const questions = await prisma.interviewQuestion.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'asc',
      },
    });

    const categorized: CategorizedQuestions = {
      technical: [],
      behavioral: [],
      experience: [],
      roleSpecific: [],
    };

    for (const q of questions) {
      const question: InterviewQuestion = {
        id: q.id,
        question: q.question,
        category: q.category as any,
        difficulty: q.difficulty as any,
        relatedContent: q.relatedContent,
        answerFramework: q.answerFramework,
        talkingPoints: q.talkingPoints,
      };

      switch (q.category) {
        case 'technical':
          categorized.technical.push(question);
          break;
        case 'behavioral':
          categorized.behavioral.push(question);
          break;
        case 'experience':
          categorized.experience.push(question);
          break;
        case 'role-specific':
          categorized.roleSpecific.push(question);
          break;
      }
    }

    return categorized;
  }
}

export const interviewPrepService = new InterviewPrepService();
