import { prisma } from '../lib/prisma';

export interface TemplateInput {
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'creative' | 'academic' | 'technical';
  previewImageUrl: string;
  latexContent: string;
  variables: string[];
  isActive?: boolean;
}

export interface RenderData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  summary?: string;
  experience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string | null;
    description: string;
    achievements: string[];
    technologies: string[];
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string | null;
    gpa?: number | null;
    achievements: string[];
  }>;
  skills?: Array<{
    name: string;
    category: string;
    proficiency: string;
    yearsOfExperience?: number | null;
  }>;
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
    url?: string | null;
    githubUrl?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    highlights: string[];
  }>;
}

export class TemplateService {
  /**
   * Get all active templates
   */
  async getAllTemplates(category?: string) {
    const where: any = { isActive: true };
    
    if (category) {
      where.category = category;
    }

    return await prisma.template.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        previewImageUrl: true,
        variables: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Get template by ID
   */
  async getTemplateById(id: string) {
    const template = await prisma.template.findUnique({
      where: { id },
    });

    if (!template) {
      throw new Error('Template not found');
    }

    return template;
  }

  /**
   * Create a new template
   */
  async createTemplate(data: TemplateInput) {
    return await prisma.template.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        previewImageUrl: data.previewImageUrl,
        latexContent: data.latexContent,
        variables: data.variables,
        isActive: data.isActive ?? true,
      },
    });
  }

  /**
   * Escape special LaTeX characters in user input
   */
  private escapeLatex(text: string): string {
    if (!text) return '';
    
    return text
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/[&%$#_{}]/g, '\\$&')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/\^/g, '\\textasciicircum{}');
  }

  /**
   * Format date for display
   */
  private formatDate(date: string | null): string {
    if (!date) return 'Present';
    
    const d = new Date(date);
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    return `${month} ${year}`;
  }

  /**
   * Render template with data
   */
  async renderTemplate(templateId: string, data: RenderData): Promise<string> {
    const template = await this.getTemplateById(templateId);
    
    let rendered = template.latexContent;

    // Replace personal info variables
    rendered = rendered.replace(/\{\{name\}\}/g, this.escapeLatex(data.personalInfo.name));
    rendered = rendered.replace(/\{\{email\}\}/g, this.escapeLatex(data.personalInfo.email));
    rendered = rendered.replace(/\{\{phone\}\}/g, this.escapeLatex(data.personalInfo.phone));
    rendered = rendered.replace(/\{\{location\}\}/g, this.escapeLatex(data.personalInfo.location || ''));
    rendered = rendered.replace(/\{\{linkedin\}\}/g, this.escapeLatex(data.personalInfo.linkedin || ''));
    rendered = rendered.replace(/\{\{github\}\}/g, this.escapeLatex(data.personalInfo.github || ''));
    rendered = rendered.replace(/\{\{website\}\}/g, this.escapeLatex(data.personalInfo.website || ''));

    // Replace summary
    if (data.summary) {
      rendered = rendered.replace(/\{\{summary\}\}/g, this.escapeLatex(data.summary));
    }

    // Handle work experience array
    if (data.experience && data.experience.length > 0) {
      const experienceItems = data.experience.map(exp => {
        const startDate = this.formatDate(exp.startDate);
        const endDate = this.formatDate(exp.endDate);
        const dateRange = `${startDate} -- ${endDate}`;
        
        const achievements = exp.achievements
          .map(a => `\\item ${this.escapeLatex(a)}`)
          .join('\n    ');
        
        const technologies = exp.technologies.length > 0
          ? `\\textit{Technologies: ${this.escapeLatex(exp.technologies.join(', '))}}`
          : '';

        return `\\resumeSubheading
  {${this.escapeLatex(exp.position)}}{${dateRange}}
  {${this.escapeLatex(exp.company)}}{}
  \\resumeItemListStart
    ${achievements}
  \\resumeItemListEnd
  ${technologies}`;
      }).join('\n\n');

      rendered = rendered.replace(/\{\{experience\}\}/g, experienceItems);
    } else {
      // Remove experience section if no data
      rendered = rendered.replace(/\\section\{Experience\}[\s\S]*?\{\{experience\}\}/g, '');
    }

    // Handle education array
    if (data.education && data.education.length > 0) {
      const educationItems = data.education.map(edu => {
        const startDate = this.formatDate(edu.startDate);
        const endDate = this.formatDate(edu.endDate);
        const dateRange = `${startDate} -- ${endDate}`;
        
        const gpaText = edu.gpa ? ` -- GPA: ${edu.gpa.toFixed(2)}` : '';
        
        const achievements = edu.achievements.length > 0
          ? `\\resumeItemListStart
    ${edu.achievements.map(a => `\\item ${this.escapeLatex(a)}`).join('\n    ')}
  \\resumeItemListEnd`
          : '';

        return `\\resumeSubheading
  {${this.escapeLatex(edu.institution)}}{${dateRange}}
  {${this.escapeLatex(edu.degree)} in ${this.escapeLatex(edu.fieldOfStudy)}${gpaText}}{}
  ${achievements}`;
      }).join('\n\n');

      rendered = rendered.replace(/\{\{education\}\}/g, educationItems);
    } else {
      rendered = rendered.replace(/\\section\{Education\}[\s\S]*?\{\{education\}\}/g, '');
    }

    // Handle skills array
    if (data.skills && data.skills.length > 0) {
      // Group skills by category
      const skillsByCategory: { [key: string]: string[] } = {};
      data.skills.forEach(skill => {
        if (!skillsByCategory[skill.category]) {
          skillsByCategory[skill.category] = [];
        }
        skillsByCategory[skill.category].push(skill.name);
      });

      const skillItems = Object.entries(skillsByCategory)
        .map(([category, skills]) => {
          const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
          return `\\resumeSubItem{${this.escapeLatex(categoryName)}}{${this.escapeLatex(skills.join(', '))}}`;
        })
        .join('\n  ');

      rendered = rendered.replace(/\{\{skills\}\}/g, skillItems);
    } else {
      rendered = rendered.replace(/\\section\{Skills\}[\s\S]*?\{\{skills\}\}/g, '');
    }

    // Handle projects array
    if (data.projects && data.projects.length > 0) {
      const projectItems = data.projects.map(proj => {
        const dateRange = proj.startDate && proj.endDate
          ? `${this.formatDate(proj.startDate)} -- ${this.formatDate(proj.endDate)}`
          : '';
        
        const links = [];
        if (proj.url) links.push(`\\href{${proj.url}}{Live}`);
        if (proj.githubUrl) links.push(`\\href{${proj.githubUrl}}{GitHub}`);
        const linkText = links.length > 0 ? ` [${links.join(' | ')}]` : '';

        const highlights = proj.highlights
          .map(h => `\\item ${this.escapeLatex(h)}`)
          .join('\n    ');

        const technologies = proj.technologies.length > 0
          ? `\\textit{Technologies: ${this.escapeLatex(proj.technologies.join(', '))}}`
          : '';

        return `\\resumeSubheading
  {${this.escapeLatex(proj.title)}${linkText}}{${dateRange}}
  {${this.escapeLatex(proj.description)}}{}
  \\resumeItemListStart
    ${highlights}
  \\resumeItemListEnd
  ${technologies}`;
      }).join('\n\n');

      rendered = rendered.replace(/\{\{projects\}\}/g, projectItems);
    } else {
      rendered = rendered.replace(/\\section\{Projects\}[\s\S]*?\{\{projects\}\}/g, '');
    }

    return rendered;
  }
}
