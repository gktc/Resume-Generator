import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const professionalTemplate = {
  name: 'Professional Clean',
  description: 'Clean ATS-friendly template with clear sections, professional formatting, and excellent readability',
  category: 'modern' as const,
  previewImageUrl: '/templates/professional-clean-preview.png',
  latexContent: `\\documentclass[a4paper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{enumitem}
\\usepackage[pdftex]{hyperref}
\\usepackage{fancyhdr}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Section formatting
\\titleformat{\\section}{
  \\vspace{-8pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Custom commands
\\newcommand{\\experience}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #3 \\\\
      \\textit{#2} & \\textit{#4} \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\newcommand{\\education}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#2} & #3 \\\\
      \\textit{#1} & \\textit{#4} \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\newcommand{\\project}[3]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\textit{#2} \\\\
    \\end{tabular*}\\vspace{-5pt}
    #3
}

\\begin{document}

%----------HEADING-----------------
\\begin{center}
    \\textbf{\\Huge {{name}}} \\\\ \\vspace{5pt}
    \\small {{phone}} \\textbullet{} \\href{mailto:{{email}}}{{{email}}} \\textbullet{} {{location}}
\\end{center}

%-----------SUMMARY-----------------
\\section{Professional Summary}
{{summary}}

%-----------EXPERIENCE-----------------
\\section{Experience}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{
{{experience}}
    }
  \\end{itemize}

%-----------EDUCATION-----------------
\\section{Education}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{
{{education}}
    }
  \\end{itemize}

%-----------SKILLS-----------------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
{{skills}}
    }}
 \\end{itemize}

%-----------PROJECTS-----------------
\\section{Projects}
  \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{
{{projects}}
    }
  \\end{itemize}

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

async function main() {
  console.log('🌱 Adding Professional Clean template...');

  const existing = await prisma.template.findFirst({
    where: { name: professionalTemplate.name },
  });

  let result;
  if (existing) {
    console.log('📝 Template already exists, updating...');
    result = await prisma.template.update({
      where: { id: existing.id },
      data: professionalTemplate,
    });
  } else {
    console.log('✨ Creating new template...');
    result = await prisma.template.create({
      data: professionalTemplate,
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
