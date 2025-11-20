export interface WorkExperience {
  id: string;
  userId: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string;
  achievements: string[];
  technologies: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  userId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string | null;
  gpa: number | null;
  achievements: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  userId: string;
  name: string;
  category: 'technical' | 'soft' | 'language';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  technologies: string[];
  url: string | null;
  githubUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  highlights: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  workExperiences: WorkExperience[];
  educations: Education[];
  skills: Skill[];
  projects: Project[];
}

export interface WorkExperienceInput {
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface EducationInput {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string | null;
  gpa: number | null;
  achievements: string[];
}

export interface SkillInput {
  name: string;
  category: 'technical' | 'soft' | 'language';
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number | null;
}

export interface ProjectInput {
  title: string;
  description: string;
  technologies: string[];
  url: string | null;
  githubUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  highlights: string[];
}

export interface ParsedResumeData {
  workExperience: Omit<WorkExperience, 'id' | 'userId' | 'order' | 'createdAt' | 'updatedAt'>[];
  education: Omit<Education, 'id' | 'userId' | 'order' | 'createdAt' | 'updatedAt'>[];
  skills: Omit<Skill, 'id' | 'userId' | 'order' | 'createdAt' | 'updatedAt'>[];
  projects: Omit<Project, 'id' | 'userId' | 'order' | 'createdAt' | 'updatedAt'>[];
}
