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

// Classic LaTeX Template
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

// Technical LaTeX Template
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

async function seedTemplates() {
  console.log('🌱 Seeding templates...');

  try {
    // Check if templates already exist
    const existingCount = await prisma.template.count();
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing templates. Skipping seed.`);
      console.log('   To re-seed, delete existing templates first.');
      return;
    }

    // Create Modern Template
    const modern = await prisma.template.create({
      data: {
        name: 'Modern Professional',
        description: 'A clean, modern template with a professional layout. Features a clear hierarchy and easy-to-read sections. Perfect for tech and corporate roles.',
        category: 'modern',
        previewImageUrl: '/templates/modern-preview.png',
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
        isActive: true,
      },
    });
    console.log(`✅ Created template: ${modern.name}`);

    // Create Classic Template
    const classic = await prisma.template.create({
      data: {
        name: 'Classic Traditional',
        description: 'A timeless, traditional resume format with centered header and clear sections. Ideal for conservative industries like finance, law, and academia.',
        category: 'classic',
        previewImageUrl: '/templates/classic-preview.png',
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
        isActive: true,
      },
    });
    console.log(`✅ Created template: ${classic.name}`);

    // Create Technical Template
    const technical = await prisma.template.create({
      data: {
        name: 'Technical Engineer',
        description: 'Optimized for software engineers and technical roles. Emphasizes technical skills upfront with a compact, information-dense layout.',
        category: 'technical',
        previewImageUrl: '/templates/technical-preview.png',
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
        isActive: true,
      },
    });
    console.log(`✅ Created template: ${technical.name}`);

    console.log('\\n✨ Template seeding completed successfully!');
    console.log(`   Total templates created: 3`);
  } catch (error) {
    console.error('❌ Error seeding templates:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedTemplates()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
