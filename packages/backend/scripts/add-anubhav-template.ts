/**
 * Script to add the Anubhav Professional LaTeX template to the database
 * 
 * Usage: npx ts-node scripts/add-anubhav-template.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const anubhavTemplate = {
  name: 'Anubhav Professional',
  description:
    'Clean ATS-friendly template with clear sections and professional formatting. Perfect for software engineers and tech professionals.',
  category: 'modern' as const,
  previewImageUrl: '/templates/anubhav-preview.png',
  latexContent: `\\documentclass[a4paper,20pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[pdftex]{hyperref}
\\usepackage{fancyhdr}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.530in}
\\addtolength{\\evensidemargin}{-0.375in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.45in}
\\addtolength{\\textheight}{1in}

\\urlstyle{rm}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-10pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-6pt}]

% Custom commands
\\newcommand{\\resumeItem}[2]{
  \\item\\small{
    \\textbf{#1}{: #2 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{#3} & \\textit{#4} \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\newcommand{\\resumeSubItem}[2]{\\resumeItem{#1}{#2}\\vspace{-3pt}}

\\renewcommand{\\labelitemii}{$\\circ$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=*]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

%----------HEADING-----------------
\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{{\\LARGE {{name}}}} & Email: \\href{mailto:{{email}}}{{{email}}}\\\\
  \\href{{{website}}}{Portfolio: {{website}}} & Mobile: {{phone}} \\\\
  \\href{{{github}}}{Github: {{github}}} & \\href{{{linkedin}}}{LinkedIn: {{linkedin}}} \\\\
\\end{tabular*}

%-----------SUMMARY-----------------
\\section{~~Summary}
{{summary}}

%-----------EDUCATION-----------------
\\section{~~Education}
  \\resumeSubHeadingListStart
{{education}}
  \\resumeSubHeadingListEnd

\\vspace{-5pt}
\\section{Skills Summary}
	\\resumeSubHeadingListStart
{{skills}}
\\resumeSubHeadingListEnd

\\vspace{-5pt}
\\section{Experience}
  \\resumeSubHeadingListStart
{{experience}}
\\resumeSubHeadingListEnd

%-----------PROJECTS-----------------
\\vspace{-5pt}
\\section{Projects}
\\resumeSubHeadingListStart
{{projects}}
\\resumeSubHeadingListEnd

\\end{document}`,
  variables: [
    'name',
    'email',
    'phone',
    'website',
    'github',
    'linkedin',
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
  ],
  isActive: true,
};

/**
 * Main function to add or update the Anubhav Professional template
 * Creates a new template if it doesn't exist, updates if it does
 */
async function main() {
  console.log('🌱 Adding Anubhav Professional template...');

  // Check if template already exists
  const existing = await prisma.template.findFirst({
    where: { name: anubhavTemplate.name },
  });

  let result;
  if (existing) {
    console.log('📝 Template already exists, updating...');
    result = await prisma.template.update({
      where: { id: existing.id },
      data: anubhavTemplate,
    });
  } else {
    console.log('✨ Creating new template...');
    result = await prisma.template.create({
      data: anubhavTemplate,
    });
  }

  console.log(`✅ Created/Updated template: ${result.name}`);
  console.log(`   ID: ${result.id}`);
  console.log(`   Category: ${result.category}`);
  console.log('✨ Template added successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Error adding template:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
