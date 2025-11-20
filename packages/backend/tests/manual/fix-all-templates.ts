import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Modern LaTeX Template
const modernTemplate = `%-------------------------
% Resume in LaTeX
% Modern Template
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\newcommand{\\resumeSubItem}[2]{\\resumeItem{\\textbf{#1:} #2}\\vspace{-4pt}}

\\renewcommand{\\labelitemii}{$\\circ$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=*]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  CV STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING-----------------
\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{\\href{http://www.example.com/}{\\Large {{name}}}} & Email: \\href{mailto:{{email}}}{{{email}}}\\\\
  \\href{http://www.example.com/}{{{website}}} & Mobile: {{phone}} \\\\
  GitHub: \\href{https://github.com/{{github}}}{{{github}}} & Location: {{location}} \\\\
\\end{tabular*}

%-----------SUMMARY-----------------
\\section{Professional Summary}
  {{summary}}

%-----------EXPERIENCE-----------------
\\section{Experience}
  \\resumeSubHeadingListStart
    {{experience}}
  \\resumeSubHeadingListEnd

%-----------EDUCATION-----------------
\\section{Education}
  \\resumeSubHeadingListStart
    {{education}}
  \\resumeSubHeadingListEnd

%-----------SKILLS-----------------
\\section{Skills}
  \\resumeSubHeadingListStart
    {{skills}}
  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------------
\\section{Projects}
  \\resumeSubHeadingListStart
    {{projects}}
  \\resumeSubHeadingListEnd

%-------------------------------------------
\\end{document}`;

async function fixAllTemplates() {
  console.log('🔧 Fixing all templates with {{content}} placeholder...\n');

  try {
    // Find all templates with {{content}} placeholder
    const brokenTemplates = await prisma.template.findMany({
      where: {
        latexContent: {
          contains: '{{content}}'
        }
      }
    });

    console.log(`Found ${brokenTemplates.length} templates to fix:\n`);

    for (const template of brokenTemplates) {
      console.log(`Fixing: ${template.name} (${template.category})`);
      
      await prisma.template.update({
        where: { id: template.id },
        data: {
          latexContent: modernTemplate,
          variables: [
            'name',
            'email',
            'phone',
            'location',
            'linkedin',
            'github',
            'website',
            'summary',
            'experience',
            'education',
            'skills',
            'projects',
          ],
        },
      });
      
      console.log(`✅ Fixed: ${template.name}`);
    }

    console.log(`\n✨ Successfully fixed ${brokenTemplates.length} templates!`);
  } catch (error) {
    console.error('❌ Error fixing templates:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixAllTemplates();
