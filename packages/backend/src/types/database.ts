/**
 * Database types and interfaces
 * These extend Prisma types with additional application-specific types
 */

// Job Analysis Types
export interface JobAnalysis {
  requirements: Requirement[];
  skills: string[];
  experienceLevel: string;
  keywords: string[];
  companyInfo: string;
}

export interface Requirement {
  text: string;
  category: 'required' | 'preferred';
  type: 'skill' | 'experience' | 'education' | 'certification';
  importance: number; // 0-1 score
}

// ATS Score Types
export interface ATSScore {
  overall: number; // 0-100
  breakdown: {
    keywordMatch: number;
    experienceRelevance: number;
    formatParseability: number;
    educationMatch: number;
  };
  missingKeywords: string[];
  suggestions: string[];
}

// Optimized Content Types
export interface OptimizedContent {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperienceData[];
  education: EducationData[];
  skills: SkillData[];
  projects: ProjectData[];
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string | null;
  github: string | null;
  website: string | null;
}

export interface WorkExperienceData {
  company: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface EducationData {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date | null;
  gpa: number | null;
  achievements: string[];
}

export interface SkillData {
  name: string;
  category: string;
  proficiency: string;
  yearsOfExperience: number | null;
}

export interface ProjectData {
  title: string;
  description: string;
  technologies: string[];
  url: string | null;
  githubUrl: string | null;
  startDate: Date | null;
  endDate: Date | null;
  highlights: string[];
}

// Parsed Resume Data
export interface ParsedResumeData {
  personalInfo: Partial<PersonalInfo>;
  summary?: string;
  experience: Partial<WorkExperienceData>[];
  education: Partial<EducationData>[];
  skills: Partial<SkillData>[];
  projects: Partial<ProjectData>[];
}

// Company Insights Types
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

// Enums
export enum ResumeStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum SkillCategory {
  TECHNICAL = 'technical',
  SOFT = 'soft',
  LANGUAGE = 'language',
  TOOL = 'tool',
  FRAMEWORK = 'framework',
}

export enum SkillProficiency {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export enum InterviewOutcome {
  OFFER = 'offer',
  REJECTED = 'rejected',
  PENDING = 'pending',
  WITHDREW = 'withdrew',
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum QuestionCategory {
  TECHNICAL = 'technical',
  BEHAVIORAL = 'behavioral',
  EXPERIENCE = 'experience',
  ROLE_SPECIFIC = 'role-specific',
}

export enum RoundType {
  PHONE_SCREEN = 'phone-screen',
  TECHNICAL = 'technical',
  SYSTEM_DESIGN = 'system-design',
  BEHAVIORAL = 'behavioral',
  CULTURAL_FIT = 'cultural-fit',
  TAKE_HOME = 'take-home',
  ONSITE = 'onsite',
}

export enum TemplateCategory {
  MODERN = 'modern',
  CLASSIC = 'classic',
  CREATIVE = 'creative',
  ACADEMIC = 'academic',
  TECHNICAL = 'technical',
}
