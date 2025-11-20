import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Modern LaTeX Template
 * Clean, modern layout with professional styling
 */
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

/**
 * Classic LaTeX Template
 * Timeless, traditional format with centered header
 */
const classicTemplate = `%-------------------------
% Resume in LaTeX
% Classic Template
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
  \\vspace{-4pt}\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\hrule \\vspace{-5pt}]

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

\\renewcommand{\\labelitemii}{$\\bullet$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=*]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  CV STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING-----------------
\\begin{center}
  \\textbf{\\Huge {{name}}} \\\\
  \\vspace{5pt}
  {{email}} $|$ {{phone}} $|$ {{location}} \\\\
  \\vspace{2pt}
  {{linkedin}} $|$ {{github}} $|$ {{website}}
\\end{center}

%-----------SUMMARY-----------------
\\section{Summary}
  {{summary}}

%-----------EXPERIENCE-----------------
\\section{Professional Experience}
  \\resumeSubHeadingListStart
    {{experience}}
  \\resumeSubHeadingListEnd

%-----------EDUCATION-----------------
\\section{Education}
  \\resumeSubHeadingListStart
    {{education}}
  \\resumeSubHeadingListEnd

%-----------SKILLS-----------------
\\section{Technical Skills}
  \\resumeSubHeadingListStart
    {{skills}}
  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------------
\\section{Notable Projects}
  \\resumeSubHeadingListStart
    {{projects}}
  \\resumeSubHeadingListEnd

%-------------------------------------------
\\end{document}`;

/**
 * Technical LaTeX Template
 * Optimized for software engineers with skills-first layout
 */
const technicalTemplate = `%-------------------------
% Resume in LaTeX
% Technical Template
%------------------------

\\documentclass[letterpaper,10pt]{article}

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
\\usepackage{fontawesome}

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
  \\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{blue}\\titlerule \\vspace{-5pt}]

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\textbf{\\small #2} \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\newcommand{\\resumeSubItem}[2]{\\resumeItem{\\textbf{#1:} #2}\\vspace{-4pt}}

\\renewcommand{\\labelitemii}{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=*]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  CV STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING-----------------
\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{\\href{http://www.example.com/}{\\LARGE {{name}}}} & \\href{mailto:{{email}}}{{{email}}}\\\\
  \\textit{Software Engineer} & {{phone}} \\\\
  \\href{https://github.com/{{github}}}{GitHub: {{github}}} & {{location}} \\\\
\\end{tabular*}

%-----------SKILLS-----------------
\\section{Technical Skills}
  \\resumeSubHeadingListStart
    {{skills}}
  \\resumeSubHeadingListEnd

%-----------EXPERIENCE-----------------
\\section{Work Experience}
  \\resumeSubHeadingListStart
    {{experience}}
  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------------
\\section{Technical Projects}
  \\resumeSubHeadingListStart
    {{projects}}
  \\resumeSubHeadingListEnd

%-----------EDUCATION-----------------
\\section{Education}
  \\resumeSubHeadingListStart
    {{education}}
  \\resumeSubHeadingListEnd

%-----------SUMMARY-----------------
\\section{About}
  {{summary}}

%-------------------------------------------
\\end{document}`;

/**
 * Update all LaTeX templates in the database with correct content
 * This script updates the three main templates: Modern, Classic, and Technical
 */
async function updateTemplates(): Promise<void> {
  console.log('🔄 Updating templates with correct LaTeX content...');

  try {
    // Update Modern Professional template
    const modernUpdated = await prisma.template.updateMany({
      where: { name: 'Modern Professional' },
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
    console.log(`✅ Updated Modern Professional template (${modernUpdated.count} records)`);

    // Update Classic Traditional template
    const classicUpdated = await prisma.template.updateMany({
      where: { name: 'Classic Traditional' },
      data: {
        latexContent: classicTemplate,
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
    console.log(`✅ Updated Classic Traditional template (${classicUpdated.count} records)`);

    // Update Technical Engineer template
    const technicalUpdated = await prisma.template.updateMany({
      where: { name: 'Technical Engineer' },
      data: {
        latexContent: technicalTemplate,
        variables: [
          'name',
          'email',
          'phone',
          'location',
          'github',
          'summary',
          'experience',
          'education',
          'skills',
          'projects',
        ],
      },
    });
    console.log(`✅ Updated Technical Engineer template (${technicalUpdated.count} records)`);

    console.log('\n✨ Template update completed successfully!');
  } catch (error) {
    console.error('❌ Error updating templates:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the update function
updateTemplates().catch((error) => {
  console.error(error);
  process.exit(1);
});
