/**
 * Seed script for LaTeX resume templates
 * 
 * This script populates the Template table with professional resume templates.
 * Templates include LaTeX content with variable placeholders for dynamic content.
 * 
 * Usage: npx ts-node scripts/seed-templates.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const templates = [
  {
    name: 'Modern Professional',
    description: 'Clean and modern design perfect for tech and corporate roles',
    category: 'modern' as const,
    previewImageUrl: '/templates/modern-preview.png',
    latexContent: `
% Add your Overleaf LaTeX template here
% Use these placeholders for dynamic content:
% {{name}}, {{email}}, {{phone}}, {{location}}
% {{summary}}
% {{experience}}, {{education}}, {{skills}}, {{projects}}

\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{margin=1in}

\\begin{document}

\\section*{{{name}}}
\\textbf{Email:} {{email}} | \\textbf{Phone:} {{phone}}

\\section*{Summary}
{{summary}}

\\section*{Experience}
{{experience}}

\\section*{Education}
{{education}}

\\section*{Skills}
{{skills}}

\\section*{Projects}
{{projects}}

\\end{document}
`,
    variables: [
      'name',
      'email',
      'phone',
      'location',
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
    ],
    isActive: true,
  },
  // Add more templates here
];

/**
 * Main seeding function
 * Upserts templates into the database (creates or updates existing)
 */
async function main() {
  console.log('🌱 Seeding templates...');

  for (const template of templates) {
    const result = await prisma.template.upsert({
      where: { name: template.name },
      update: template,
      create: template,
    });
    console.log(`✅ Created/Updated template: ${result.name}`);
  }

  console.log('✨ Template seeding complete!');
}

// Execute main function with error handling
main()
  .catch((error) => {
    console.error('❌ Error seeding templates:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
