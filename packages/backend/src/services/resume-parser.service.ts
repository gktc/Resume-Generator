import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs/promises';
import { aiService } from './ai.service';
import { prisma } from '../lib/prisma';

export interface ParsedResumeData {
  workExperience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string | null;
    description: string;
    achievements: string[];
    technologies: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string | null;
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
    startDate: string | null;
    endDate: string | null;
    highlights: string[];
  }>;
}

export interface ParsedResume {
  id: string;
  userId: string;
  fileName: string;
  filePath: string;
  extractedText: string;
  parsedData: ParsedResumeData;
  status: 'pending_review' | 'confirmed' | 'rejected';
  createdAt: Date;
}

export class ResumeParserService {
  /**
   * Parse date string safely, returning null for invalid dates
   */
  private parseDate(dateStr: string | null | undefined): Date | null {
    if (!dateStr || dateStr.trim() === '' || dateStr.toLowerCase() === 'present') {
      return null;
    }

    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  /**
   * Parse a resume file and extract structured data
   */
  async parseResume(
    file: Express.Multer.File,
    userId: string
  ): Promise<{ id: string; parsedData: ParsedResumeData }> {
    try {
      // Extract text from file
      const extractedText = await this.extractText(file);

      // Use AI to structure the data
      const parsedData = await this.structureData(extractedText);

      // Store parsed data temporarily
      const parseId = await this.storeParsedData(
        userId,
        file.filename,
        file.path,
        extractedText,
        parsedData
      );

      return { id: parseId, parsedData };
    } catch (error) {
      console.error('Resume parsing error:', error);
      throw new Error('Failed to parse resume. Please check the file format and try again.');
    }
  }

  /**
   * Extract text from PDF or DOCX file
   */
  private async extractText(file: Express.Multer.File): Promise<string> {
    const fileType = file.mimetype;

    try {
      // Read file from disk since we're using diskStorage
      const buffer = await fs.readFile(file.path);

      if (fileType === 'application/pdf') {
        return await this.extractTextFromPDF(buffer);
      } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        return await this.extractTextFromDOCX(buffer);
      } else {
        throw new Error('Unsupported file type');
      }
    } catch (error) {
      console.error('Text extraction error:', error);
      throw new Error('Failed to extract text from file. The file may be corrupted or password-protected.');
    }
  }

  /**
   * Extract text from PDF using pdf-parse
   */
  async extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(buffer);
      const text = data.text.trim();

      if (!text || text.length < 50) {
        throw new Error('PDF appears to be empty or contains insufficient text');
      }

      return this.cleanAndNormalizeText(text);
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error('Failed to parse PDF. The file may be image-based or corrupted.');
    }
  }

  /**
   * Extract text from DOCX using mammoth
   */
  async extractTextFromDOCX(buffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value.trim();

      if (!text || text.length < 50) {
        throw new Error('DOCX appears to be empty or contains insufficient text');
      }

      return this.cleanAndNormalizeText(text);
    } catch (error) {
      console.error('DOCX parsing error:', error);
      throw new Error('Failed to parse DOCX. The file may be corrupted or password-protected.');
    }
  }

  /**
   * Clean and normalize extracted text
   */
  private cleanAndNormalizeText(text: string): string {
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
      .replace(/\t/g, ' ') // Replace tabs with spaces
      .replace(/ {2,}/g, ' ') // Remove multiple spaces
      .trim();
  }

  /**
   * Use AI to extract structured data from resume text
   */
  private async structureData(text: string): Promise<ParsedResumeData> {
    const systemPrompt = `You are an expert resume parser. Extract structured information from resumes accurately.
Your task is to parse the resume text and extract work experience, education, skills, and projects.
Return the data in the exact JSON format specified.`;

    const userPrompt = `Parse the following resume and extract all relevant information.

Resume Text:
${text}

Extract and return a JSON object with the following structure:
{
  "workExperiences": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "YYYY-MM-DD or YYYY-MM",
      "endDate": "YYYY-MM-DD or YYYY-MM or null for current",
      "description": "Brief job description",
      "achievements": ["Achievement 1", "Achievement 2"],
      "technologies": ["Tech 1", "Tech 2"]
    }
  ],
  "educations": [
    {
      "institution": "University Name",
      "degree": "Degree Type",
      "fieldOfStudy": "Major/Field",
      "startDate": "YYYY-MM-DD or YYYY-MM",
      "endDate": "YYYY-MM-DD or YYYY-MM or null",
      "gpa": 3.5 or null,
      "achievements": ["Achievement 1"]
    }
  ],
  "skills": [
    {
      "name": "Skill Name",
      "category": "technical|soft|language",
      "proficiency": "beginner|intermediate|advanced|expert",
      "yearsOfExperience": 3 or null
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Project description",
      "technologies": ["Tech 1", "Tech 2"],
      "url": "https://project.com or null",
      "githubUrl": "https://github.com/user/repo or null",
      "startDate": "YYYY-MM-DD or null",
      "endDate": "YYYY-MM-DD or null",
      "highlights": ["Highlight 1", "Highlight 2"]
    }
  ]
}

Important:
- Extract ALL work experiences, education entries, skills, and projects found
- Use null for missing or unknown values
- For dates, prefer YYYY-MM-DD format, but YYYY-MM is acceptable
- For current positions/education, use null for endDate
- Categorize skills appropriately (technical, soft, language)
- Estimate proficiency based on context if not explicitly stated
- Extract technologies/tools mentioned in work experience and projects`;

    try {
      const parsedData = await aiService.generateJSON<ParsedResumeData>(userPrompt, systemPrompt, {
        temperature: 0.3,
        maxTokens: 4000,
      });

      // Validate and clean the parsed data
      return this.validateAndCleanParsedData(parsedData);
    } catch (error) {
      console.error('AI structuring error:', error);
      // Return empty structure on AI failure
      return {
        workExperience: [],
        education: [],
        skills: [],
        projects: [],
      };
    }
  }

  /**
   * Validate and clean parsed data
   */
  private validateAndCleanParsedData(data: any): ParsedResumeData {
    return {
      workExperience: Array.isArray(data.workExperiences)
        ? data.workExperiences.map((exp: any) => ({
            company: String(exp.company || ''),
            position: String(exp.position || ''),
            startDate: String(exp.startDate || ''),
            endDate: exp.endDate ? String(exp.endDate) : null,
            description: String(exp.description || ''),
            achievements: Array.isArray(exp.achievements) ? exp.achievements : [],
            technologies: Array.isArray(exp.technologies) ? exp.technologies : [],
          }))
        : [],
      education: Array.isArray(data.educations)
        ? data.educations.map((edu: any) => ({
            institution: String(edu.institution || ''),
            degree: String(edu.degree || ''),
            fieldOfStudy: String(edu.fieldOfStudy || ''),
            startDate: String(edu.startDate || ''),
            endDate: edu.endDate ? String(edu.endDate) : null,
            gpa: edu.gpa ? parseFloat(edu.gpa) : null,
            achievements: Array.isArray(edu.achievements) ? edu.achievements : [],
          }))
        : [],
      skills: Array.isArray(data.skills)
        ? data.skills.map((skill: any) => ({
            name: String(skill.name || ''),
            category: String(skill.category || 'technical'),
            proficiency: String(skill.proficiency || 'intermediate'),
            yearsOfExperience: skill.yearsOfExperience ? parseInt(skill.yearsOfExperience) : null,
          }))
        : [],
      projects: Array.isArray(data.projects)
        ? data.projects.map((proj: any) => ({
            title: String(proj.title || ''),
            description: String(proj.description || ''),
            technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
            url: proj.url ? String(proj.url) : null,
            githubUrl: proj.githubUrl ? String(proj.githubUrl) : null,
            startDate: proj.startDate ? String(proj.startDate) : null,
            endDate: proj.endDate ? String(proj.endDate) : null,
            highlights: Array.isArray(proj.highlights) ? proj.highlights : [],
          }))
        : [],
    };
  }

  /**
   * Store parsed data temporarily in database
   */
  private async storeParsedData(
    userId: string,
    fileName: string,
    filePath: string,
    extractedText: string,
    parsedData: ParsedResumeData
  ): Promise<string> {
    // For now, we'll store this in a JSON field
    // In a production system, you might want a separate ParsedResume table
    const id = `parsed_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    // Store in a temporary location (could use Redis or a temp table)
    // For simplicity, we'll use a file-based approach or in-memory cache
    // This is a placeholder - in production, use proper storage
    global.parsedResumeCache = global.parsedResumeCache || new Map();
    global.parsedResumeCache.set(id, {
      id,
      userId,
      fileName,
      filePath,
      extractedText,
      parsedData,
      status: 'pending_review',
      createdAt: new Date(),
    });

    return id;
  }

  /**
   * Get parsed resume data by ID
   */
  async getParsedData(id: string, userId: string): Promise<ParsedResume | null> {
    if (!global.parsedResumeCache) {
      global.parsedResumeCache = new Map();
    }
    const data = global.parsedResumeCache.get(id);

    if (!data || data.userId !== userId) {
      return null;
    }

    return data;
  }

  /**
   * Confirm and save parsed data to user profile
   */
  async confirmParsedData(id: string, userId: string, editedData: ParsedResumeData): Promise<void> {
    const parsedResume = await this.getParsedData(id, userId);

    if (!parsedResume) {
      throw new Error('Parsed resume not found or access denied');
    }

    console.log('Confirming parsed data for user:', userId);
    console.log('Edited data:', JSON.stringify(editedData, null, 2));
    console.log('Work Experience count:', editedData.workExperience?.length || 0);
    console.log('Education count:', editedData.education?.length || 0);
    console.log('Skills count:', editedData.skills?.length || 0);
    console.log('Projects count:', editedData.projects?.length || 0);

    // Use a transaction to insert all data
    await prisma.$transaction(async (tx: any) => {
      // Insert work experiences
      if (editedData.workExperience && editedData.workExperience.length > 0) {
        console.log(`Inserting ${editedData.workExperience.length} work experiences`);
        await tx.workExperience.createMany({
          data: editedData.workExperience.map((exp, index) => {
            const startDate = this.parseDate(exp.startDate) || new Date();
            const endDate = this.parseDate(exp.endDate);

            return {
              userId,
              company: exp.company,
              position: exp.position,
              startDate,
              endDate,
              description: exp.description,
              achievements: exp.achievements,
              technologies: exp.technologies,
              order: index,
            };
          }),
        });
      }

      // Insert educations
      if (editedData.education && editedData.education.length > 0) {
        await tx.education.createMany({
          data: editedData.education.map((edu, index) => {
            const startDate = this.parseDate(edu.startDate) || new Date();
            const endDate = this.parseDate(edu.endDate);

            return {
              userId,
              institution: edu.institution,
              degree: edu.degree,
              fieldOfStudy: edu.fieldOfStudy,
              startDate,
              endDate,
              gpa: edu.gpa,
              achievements: edu.achievements,
              order: index,
            };
          }),
        });
      }

      // Insert skills
      if (editedData.skills && editedData.skills.length > 0) {
        await tx.skill.createMany({
          data: editedData.skills.map((skill, index) => ({
            userId,
            name: skill.name,
            category: skill.category,
            proficiency: skill.proficiency,
            yearsOfExperience: skill.yearsOfExperience,
            order: index,
          })),
        });
      }

      // Insert projects
      if (editedData.projects && editedData.projects.length > 0) {
        await tx.project.createMany({
          data: editedData.projects.map((proj, index) => {
            const startDate = this.parseDate(proj.startDate);
            const endDate = this.parseDate(proj.endDate);

            return {
              userId,
              title: proj.title,
              description: proj.description,
              technologies: proj.technologies,
              url: proj.url,
              githubUrl: proj.githubUrl,
              startDate,
              endDate,
              highlights: proj.highlights,
              order: index,
            };
          }),
        });
      }
    });

    // Clean up temporary data
    if (global.parsedResumeCache) {
      global.parsedResumeCache.delete(id);
    }
  }

  /**
   * Reject and clean up parsed data
   */
  async rejectParsedData(id: string, userId: string): Promise<void> {
    const parsedResume = await this.getParsedData(id, userId);

    if (!parsedResume) {
      throw new Error('Parsed resume not found or access denied');
    }

    // Clean up temporary data
    if (global.parsedResumeCache) {
      global.parsedResumeCache.delete(id);
    }
  }
}

export const resumeParserService = new ResumeParserService();
