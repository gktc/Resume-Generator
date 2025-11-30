import { OptimizedContent } from '../types/resume.types';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const execAsync = promisify(exec);

export class LaTeXCompilerService {
  private readonly latexTempDir: string;
  private readonly outputDir: string;
  private readonly timeout: number;

  constructor() {
    this.latexTempDir = path.join(process.cwd(), 'latex-temp');
    this.outputDir = path.join(process.cwd(), 'uploads', 'resumes');
    this.timeout = parseInt(process.env.LATEX_TIMEOUT || '30000');
  }

  /**
   * Compile LaTeX template with resume data
   */
  async compileResume(
    latexTemplate: string,
    content: OptimizedContent,
    _userId: string,
    company: string,
    position: string
  ): Promise<{ fileName: string; filePath: string }> {
    // Ensure directories exist
    await this.ensureDirectories();

    // Generate unique filename
    const timestamp = Date.now();
    const hash = crypto.randomBytes(4).toString('hex');
    const sanitizedCompany = this.sanitizeFilename(company);
    const sanitizedPosition = this.sanitizeFilename(position);
    const fileName = `${sanitizedCompany}_${sanitizedPosition}_${timestamp}_${hash}.pdf`;
    const baseFileName = `resume_${timestamp}_${hash}`;

    // Create temporary directory for this compilation
    const tempDir = path.join(this.latexTempDir, baseFileName);
    await fs.mkdir(tempDir, { recursive: true });

    try {
      // Render template with content
      const renderedLatex = this.renderTemplate(latexTemplate, content);

      // Sanitize LaTeX content
      const sanitizedLatex = this.sanitizeLatexContent(renderedLatex);

      // Write LaTeX file
      const texFilePath = path.join(tempDir, `${baseFileName}.tex`);
      await fs.writeFile(texFilePath, sanitizedLatex, 'utf-8');

      // Compile LaTeX to PDF
      await this.compileLatex(tempDir, baseFileName);

      // Move PDF to output directory
      const sourcePdfPath = path.join(tempDir, `${baseFileName}.pdf`);
      const outputPath = path.join(this.outputDir, fileName);
      await fs.copyFile(sourcePdfPath, outputPath);

      // Clean up temporary directory
      await this.cleanupTempDir(tempDir);

      return {
        fileName,
        filePath: outputPath,
      };
    } catch (error: any) {
      // Log the error and keep temp files for debugging
      console.error('LaTeX compilation error:', error);
      console.error('Temp directory (kept for debugging):', tempDir);
      
      // Don't clean up on error so we can inspect the files
      // await this.cleanupTempDir(tempDir);
      
      throw new Error(`LaTeX compilation failed: ${error.message}`);
    }
  }

  /**
   * Escape special LaTeX characters
   * Prevents LaTeX injection by escaping special characters
   */
  private escapeLatex(text: string): string {
    if (!text) return '';

    return text
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/&/g, '\\&')
      .replace(/%/g, '\\%')
      .replace(/\$/g, '\\$')
      .replace(/#/g, '\\#')
      .replace(/_/g, '\\_')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/\^/g, '\\textasciicircum{}');
  }

  /**
   * Sanitize LaTeX content to prevent injection
   * Removes potentially dangerous LaTeX commands
   * Note: Templates from database are trusted, only sanitize user-provided content
   */
  private sanitizeLatexContent(latex: string): string {
    // Only remove the most dangerous commands that could access files or execute code
    // Allow \newcommand, \renewcommand since templates need them
    const dangerousCommands = [
      '\\input',
      '\\include',
      '\\write',
      '\\immediate',
      '\\openout',
      '\\closeout',
      '\\read',
      '\\openin',
      '\\closein',
    ];

    let sanitized = latex;
    dangerousCommands.forEach((cmd) => {
      const regex = new RegExp(cmd.replace(/\\/g, '\\\\'), 'gi');
      sanitized = sanitized.replace(regex, '');
    });

    return sanitized;
  }

  /**
   * Render LaTeX template with content
   */
  private renderTemplate(template: string, content: OptimizedContent): string {
    let rendered = template;

    // Replace personal info
    rendered = rendered.replace(/\{\{name\}\}/g, this.escapeLatex(content.personalInfo.name));
    rendered = rendered.replace(/\{\{email\}\}/g, this.escapeLatex(content.personalInfo.email));
    rendered = rendered.replace(/\{\{phone\}\}/g, this.escapeLatex(content.personalInfo.phone || ''));
    rendered = rendered.replace(/\{\{location\}\}/g, this.escapeLatex(content.personalInfo.location || ''));
    rendered = rendered.replace(/\{\{linkedin\}\}/g, this.escapeLatex(content.personalInfo.linkedin || ''));
    rendered = rendered.replace(/\{\{github\}\}/g, this.escapeLatex(content.personalInfo.github || ''));
    rendered = rendered.replace(/\{\{website\}\}/g, this.escapeLatex(content.personalInfo.website || ''));

    // Replace summary
    rendered = rendered.replace(/\{\{summary\}\}/g, this.escapeLatex(content.summary));

    // Replace experience section
    const experienceLatex = content.experience
      .map((exp) => {
        const startDate = this.formatDate(exp.startDate);
        const endDate = exp.endDate ? this.formatDate(exp.endDate) : 'Present';
        const achievements = exp.achievements
          .map((a) => `    \\resumeItem{${this.escapeLatex(a)}}`)
          .join('\n');

        // Only include item list if there are achievements
        if (achievements.trim().length > 0) {
          return `    \\resumeSubheading{${this.escapeLatex(exp.company)}}{${startDate} -- ${endDate}}{${this.escapeLatex(exp.position)}}{}
      \\resumeItemListStart
${achievements}
      \\resumeItemListEnd`;
        } else {
          return `    \\resumeSubheading{${this.escapeLatex(exp.company)}}{${startDate} -- ${endDate}}{${this.escapeLatex(exp.position)}}{}`;
        }
      })
      .join('\n\n');
    rendered = rendered.replace(/\{\{experience\}\}/g, experienceLatex);

    // Replace education section
    const educationLatex = content.education
      .map((edu) => {
        const startDate = this.formatDate(edu.startDate);
        const endDate = edu.endDate ? this.formatDate(edu.endDate) : 'Present';
        const gpaText = edu.gpa ? ` (GPA: ${edu.gpa})` : '';
        const fieldAndGpa = `${this.escapeLatex(edu.fieldOfStudy)}${gpaText}`;

        return `    \\resumeSubheading{${this.escapeLatex(edu.institution)}}{${startDate} -- ${endDate}}{${this.escapeLatex(edu.degree)}}{${fieldAndGpa}}`;
      })
      .join('\n\n');
    rendered = rendered.replace(/\{\{education\}\}/g, educationLatex);

    // Replace skills section
    const skillsByCategory = this.groupSkillsByCategory(content.skills);
    const skillsLatex = Object.entries(skillsByCategory)
      .map(([category, skills]) => {
        const skillNames = skills.map((s) => this.escapeLatex(s.name)).join(', ');
        return `    \\resumeSubItem{${this.escapeLatex(category)}}{${skillNames}}`;
      })
      .join('\n');
    rendered = rendered.replace(/\{\{skills\}\}/g, skillsLatex);

    // Replace projects section
    const projectsLatex = content.projects
      .map((project) => {
        const highlights = project.highlights
          .map((h) => `    \\resumeItem{${this.escapeLatex(h)}}`)
          .join('\n');
        const technologies = project.technologies.join(', ');
        const startDate = project.startDate ? this.formatDate(project.startDate) : '';
        const endDate = project.endDate ? this.formatDate(project.endDate) : 'Present';
        const dateRange = startDate ? `${startDate} -- ${endDate}` : '';

        // Only include item list if there are highlights
        if (highlights.trim().length > 0) {
          return `    \\resumeSubheading{${this.escapeLatex(project.title)}}{${dateRange}}{${this.escapeLatex(technologies)}}{}
      \\resumeItemListStart
${highlights}
      \\resumeItemListEnd`;
        } else {
          return `    \\resumeSubheading{${this.escapeLatex(project.title)}}{${dateRange}}{${this.escapeLatex(technologies)}}{}`;
        }
      })
      .join('\n\n');
    rendered = rendered.replace(/\{\{projects\}\}/g, projectsLatex);

    return rendered;
  }

  /**
   * Compile LaTeX file to PDF using Docker container
   */
  private async compileLatex(workDir: string, baseFileName: string): Promise<void> {
    const texFile = `${baseFileName}.tex`;
    const containerName = process.env.LATEX_CONTAINER_NAME || 'ats-latex';

    try {
      // The workDir is already in latex-temp which is mounted to /latex-temp in the container
      // Get the relative path from latex-temp
      const relativePath = path.relative(this.latexTempDir, workDir);
      const containerPath = `/latex-temp/${relativePath}`;

      // Run pdflatex twice for proper references (needed for TOC, references, etc.)
      for (let i = 0; i < 2; i++) {
        // Docker command to execute pdflatex in the container
        // Use the mounted volume path instead of copying files
        const command = `docker exec ${containerName} pdflatex -interaction=nonstopmode -output-directory=${containerPath} ${containerPath}/${texFile}`;

        try {
          // Execute pdflatex in container
          const { stdout, stderr } = await execAsync(command, {
            timeout: this.timeout,
            maxBuffer: 10 * 1024 * 1024, // 10MB buffer
          });

          // Log LaTeX output for debugging
          if (stderr) {
            console.log('LaTeX stderr (warnings):', stderr);
          }
          if (stdout && stdout.includes('!')) {
            console.log('LaTeX errors detected:', stdout);
          }
        } catch (execError: any) {
          // LaTeX warnings go to stderr which causes execAsync to throw
          // Check if PDF was actually created before treating as error
          const pdfPath = path.join(workDir, `${baseFileName}.pdf`);
          try {
            await fs.access(pdfPath);
            // PDF exists, so compilation succeeded despite warnings
            console.log('LaTeX compilation succeeded with warnings');
          } catch {
            // PDF doesn't exist, this is a real error
            throw execError;
          }
        }
      }

      // Final check if PDF was created
      const pdfPath = path.join(workDir, `${baseFileName}.pdf`);
      await fs.access(pdfPath);
    } catch (error: any) {
      if (error.killed) {
        throw new Error('LaTeX compilation timed out after 30 seconds. Please simplify your resume or try a different template.');
      }

      // Parse LaTeX error for user-friendly message
      const userMessage = this.parseLatexError(error.message);
      throw new Error(userMessage);
    }
  }

  /**
   * Parse LaTeX error messages into user-friendly format
   */
  private parseLatexError(errorMessage: string): string {
    // Common LaTeX errors and their user-friendly messages
    if (errorMessage.includes('Undefined control sequence')) {
      return 'LaTeX compilation failed: Invalid LaTeX command detected. Please check your template or contact support.';
    }
    if (errorMessage.includes('Missing $ inserted')) {
      return 'LaTeX compilation failed: Mathematical expression formatting error. Please check special characters in your content.';
    }
    if (errorMessage.includes('File not found')) {
      return 'LaTeX compilation failed: Required template file is missing. Please try a different template.';
    }
    if (errorMessage.includes('Emergency stop')) {
      return 'LaTeX compilation failed: Critical error in template. Please try a different template or contact support.';
    }
    if (errorMessage.includes('No such container')) {
      return 'LaTeX compilation service is not available. Please ensure Docker is running and the LaTeX container is started.';
    }

    // Generic error message
    return `LaTeX compilation failed: ${errorMessage.substring(0, 200)}. Please try again or contact support if the issue persists.`;
  }

  /**
   * Format date for LaTeX
   */
  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    return `${month} ${year}`;
  }

  /**
   * Group skills by category
   */
  private groupSkillsByCategory(skills: any[]): Record<string, any[]> {
    const grouped: Record<string, any[]> = {};

    skills.forEach((skill) => {
      const category = skill.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(skill);
    });

    return grouped;
  }

  /**
   * Sanitize filename
   */
  private sanitizeFilename(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 50);
  }

  /**
   * Ensure required directories exist
   */
  private async ensureDirectories(): Promise<void> {
    await fs.mkdir(this.latexTempDir, { recursive: true });
    await fs.mkdir(this.outputDir, { recursive: true });
  }

  /**
   * Clean up temporary directory
   */
  private async cleanupTempDir(tempDir: string): Promise<void> {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      console.warn('Failed to clean up temp directory:', error);
    }
  }
}
