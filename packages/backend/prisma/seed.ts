import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default resume templates
  const templates = [
    {
      name: 'Modern Professional',
      description:
        'Clean and modern design with a focus on readability. Perfect for tech and corporate roles.',
      category: 'modern',
      previewImageUrl: '/templates/modern-professional.png',
      latexContent: `% Modern Professional Template
\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{margin=0.75in}

\\begin{document}
{{content}}
\\end{document}`,
      variables: [
        'name',
        'email',
        'phone',
        'location',
        'summary',
        'experience',
        'education',
        'skills',
      ],
      isActive: true,
    },
    {
      name: 'Classic Elegant',
      description:
        'Traditional and elegant layout suitable for all industries. Emphasizes professionalism.',
      category: 'classic',
      previewImageUrl: '/templates/classic-elegant.png',
      latexContent: `% Classic Elegant Template
\\documentclass[11pt,letterpaper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{margin=1in}

\\begin{document}
{{content}}
\\end{document}`,
      variables: [
        'name',
        'email',
        'phone',
        'location',
        'summary',
        'experience',
        'education',
        'skills',
      ],
      isActive: true,
    },
    {
      name: 'Creative Bold',
      description:
        'Eye-catching design with creative elements. Great for design, marketing, and creative roles.',
      category: 'creative',
      previewImageUrl: '/templates/creative-bold.png',
      latexContent: `% Creative Bold Template
\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\usepackage{xcolor}
\\geometry{margin=0.75in}

\\begin{document}
{{content}}
\\end{document}`,
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
    {
      name: 'Academic Research',
      description:
        'Formal academic layout with emphasis on publications and research. Ideal for academic positions.',
      category: 'academic',
      previewImageUrl: '/templates/academic-research.png',
      latexContent: `% Academic Research Template
\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{margin=1in}

\\begin{document}
{{content}}
\\end{document}`,
      variables: [
        'name',
        'email',
        'phone',
        'location',
        'summary',
        'education',
        'experience',
        'skills',
        'publications',
      ],
      isActive: true,
    },
    {
      name: 'Technical Developer',
      description:
        'Optimized for software developers with focus on technical skills and projects. Includes GitHub links.',
      category: 'technical',
      previewImageUrl: '/templates/technical-developer.png',
      latexContent: `% Technical Developer Template
\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\usepackage{hyperref}
\\geometry{margin=0.75in}

\\begin{document}
{{content}}
\\end{document}`,
      variables: [
        'name',
        'email',
        'phone',
        'location',
        'github',
        'linkedin',
        'summary',
        'skills',
        'experience',
        'projects',
        'education',
      ],
      isActive: true,
    },
  ];

  console.log('📝 Creating resume templates...');
  for (const template of templates) {
    // Check if template exists
    const existing = await prisma.template.findFirst({
      where: { name: template.name },
    });

    if (existing) {
      await prisma.template.update({
        where: { id: existing.id },
        data: template,
      });
      console.log(`  ✓ Updated template: ${template.name}`);
    } else {
      await prisma.template.create({
        data: template,
      });
      console.log(`  ✓ Created template: ${template.name}`);
    }
  }

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
