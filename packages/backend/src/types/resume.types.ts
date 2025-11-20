// Resume generation types

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface SelectedWorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  achievements: string[];
  technologies: string[];
  relevanceScore: number;
}

export interface SelectedEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date | null;
  gpa: number | null;
  achievements: string[];
}

export interface SelectedSkill {
  id: string;
  name: string;
  category: string;
  proficiency: string;
  yearsOfExperience: number | null;
  relevanceScore: number;
}

export interface SelectedProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  url: string | null;
  githubUrl: string | null;
  startDate: Date | null;
  endDate: Date | null;
  highlights: string[];
  relevanceScore: number;
}

export interface SelectedContent {
  personalInfo: PersonalInfo;
  summary?: string;
  experience: SelectedWorkExperience[];
  education: SelectedEducation[];
  skills: SelectedSkill[];
  projects: SelectedProject[];
}

export interface OptimizedContent {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    startDate: Date;
    endDate: Date | null;
    description: string;
    achievements: string[];
    technologies: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate: Date | null;
    gpa: number | null;
    achievements: string[];
  }>;
  skills: Array<{
    name: string;
    category: string;
    proficiency: string;
    yearsOfExperience: number | null;
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    url: string | null;
    githubUrl: string | null;
    startDate: Date | null;
    endDate: Date | null;
    highlights: string[];
  }>;
}

export interface ATSScoreBreakdown {
  keywordMatch: number;
  experienceRelevance: number;
  formatParseability: number;
  educationMatch: number;
}

export interface ATSScore {
  overall: number;
  breakdown: ATSScoreBreakdown;
  missingKeywords: string[];
  suggestions: string[];
}

export interface ResumeGenerationResult {
  resumeId: string;
  fileName: string;
  filePath: string;
  atsScore: ATSScore;
  status: string;
}
