// Interview Question Types
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

export interface InterviewQuestionsResponse {
  questions: CategorizedQuestions;
  total: number;
}

// Interview Experience Types
export interface InterviewRound {
  roundNumber: number;
  roundType:
    | 'phone-screen'
    | 'technical'
    | 'system-design'
    | 'behavioral'
    | 'cultural-fit'
    | 'take-home'
    | 'onsite';
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  questions: string[];
  notes: string;
}

export interface InterviewExperienceInput {
  company: string;
  role: string;
  interviewDate: Date;
  outcome: 'offer' | 'rejected' | 'pending' | 'withdrew';
  overallDifficulty: 'easy' | 'medium' | 'hard';
  preparationTips: string[];
  rounds: InterviewRound[];
}

export interface CompanyInsights {
  company: string;
  role: string;
  totalSubmissions: number;
  lastUpdated: string;
  processStructure: {
    averageRounds: number;
    commonRoundTypes: { type: string; frequency: number }[];
    averageDuration: number;
  };
  commonQuestions: { question: string; frequency: number; category: string }[];
  topicFrequency: { topic: string; frequency: number }[];
  difficultyDistribution: { easy: number; medium: number; hard: number };
  successTips: string[];
}
