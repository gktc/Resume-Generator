// Job Description and Analysis Types
export interface JobDescription {
  id: string;
  userId: string;
  company: string;
  position: string;
  rawText: string;
  analyzedData: JobAnalysis;
  createdAt: string;
  updatedAt: string;
}

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
  importance: number;
}

export interface MatchResult {
  overallScore: number;
  skillMatch: {
    score: number;
    matchingSkills: string[];
    missingSkills: string[];
  };
  experienceRelevance: {
    score: number;
    relevantExperiences: string[];
  };
  educationMatch: {
    score: number;
  };
  recommendations: string[];
}

// Template Types
export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'creative' | 'academic' | 'technical';
  previewImageUrl: string;
  latexContent: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Resume Types
export interface Resume {
  id: string;
  userId: string;
  jobDescriptionId: string;
  templateId: string;
  fileName: string;
  filePath: string;
  atsScore: ATSScore;
  generatedContent: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
  jobDescription?: JobDescription;
  template?: Template;
}

export interface ATSScore {
  overall: number;
  breakdown: {
    keywordMatch: number;
    experienceRelevance: number;
    formatParseability: number;
    educationMatch: number;
  };
  missingKeywords: string[];
  suggestions: string[];
}

export interface ResumeGenerationJob {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resumeId?: string;
  error?: string;
}

// Input Types
export interface JobDescriptionInput {
  company: string;
  position: string;
  rawText: string;
}

export interface ResumeGenerationRequest {
  jobDescriptionId: string;
  templateId: string;
}
