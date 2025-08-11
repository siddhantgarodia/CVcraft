import type { ResumeData } from "../types";
import { escapeLatex, generateBulletList } from "../latex-utils";

export function generateAcademicTemplate(resumeData: ResumeData): string {
  const { personalInfo, experience, education, skills, sections } = resumeData;

  // Filter visible sections and sort by order
  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return `%-------------------------
% Academic CV Template
% Author : CVCraft
% License : MIT
%------------------------

\\documentclass[11pt,a4paper]{article}

\\usepackage[margin=1in]{geometry}
\\usepackage{fontspec}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fontawesome5}
\\usepackage{xcolor}
\\usepackage{academicons}
\\usepackage{multirow}
\\usepackage{tabularx}

% Define custom colors
\\definecolor{primary}{HTML}{00356B}
\\definecolor{secondary}{HTML}{666666}

% Set fonts
\\setmainfont{EB Garamond}[
  Path = ./fonts/,
  Extension = .ttf,
  UprightFont = *-Regular,
  BoldFont = *-Bold,
  ItalicFont = *-Italic,
  BoldItalicFont = *-BoldItalic
]

% Custom section formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\Large\\bfseries\\color{primary}
}{}{0em}{}[\\color{primary}\\titlerule]

\\titlespacing*{\\section}{0pt}{12pt}{8pt}

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{#1}
}

\\newcommand{\\resumeSubheading}[4]{
  \\item
    \\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & {\\small#2} \\\\
      {\\small\\textcolor{secondary}{#3}} & {\\small\\textcolor{secondary}{#4}} \\\\
    \\end{tabular*}\\vspace{4pt}
}

\\newcommand{\\publicationItem}[6]{
  \\item
    \\textbf{#1}. (#2) \\textit{#3}. #4. \\textbf{#5}. #6.
}

\\begin{document}

%----------HEADER----------
\\begin{center}
  {\\huge\\textbf{${escapeLatex(personalInfo.fullName)}}}\\\\[8pt]
  {\\large\\textcolor{secondary}{${escapeLatex(
    personalInfo.title || "Academic Researcher"
  )}}}\\\\[4pt]
  \\begin{tabular}{c}
    \\href{mailto:${escapeLatex(personalInfo.email)}}{${escapeLatex(
    personalInfo.email
  )}} $|$
    ${escapeLatex(personalInfo.phone)}\\\\
    ${
      personalInfo.linkedin
        ? `\\href{${escapeLatex(personalInfo.linkedin)}}{LinkedIn}`
        : ""
    }
    ${
      personalInfo.github
        ? `$|$ \\href{${escapeLatex(personalInfo.github)}}{GitHub}`
        : ""
    }

  \\end{tabular}
\\end{center}

${
  personalInfo.summary
    ? `
\\section{Research Interests}
${escapeLatex(personalInfo.summary)}`
    : ""
}

${visibleSections
  .map((section) => {
    switch (section.type) {
      case "education":
        return education.length > 0
          ? `\\section{Education}
\\begin{itemize}[leftmargin=0pt, itemindent=0pt]
${education
  .map(
    (edu: {
      degree?: string;
      field?: string;
      dates?: string;
      startDate?: string;
      endDate?: string;
      institution: string;
      location?: string;
    }) => `
  \\resumeSubheading
    {${escapeLatex(edu.degree || edu.field || "")}}
    {${escapeLatex(
      edu.dates || `${edu.startDate || ""} - ${edu.endDate || "Present"}`
    )}}
    {${escapeLatex(edu.institution)}}
    {${escapeLatex(edu.location || "")}}`
  )
  .join("\n")}
\\end{itemize}`
          : "";

      case "experience":
        return experience.length > 0
          ? `\\section{Academic Experience}
\\begin{itemize}[leftmargin=0pt, itemindent=0pt]
${experience
  .map(
    (exp: {
      position: string;
      dates?: string;
      startDate?: string;
      endDate?: string;
      company: string;
      location?: string;
      points?: string[];
      responsibilities?: string[];
    }) => `
  \\resumeSubheading
    {${escapeLatex(exp.position)}}
    {${escapeLatex(
      exp.dates || `${exp.startDate || ""} - ${exp.endDate || "Present"}`
    )}}
    {${escapeLatex(exp.company)}}
    {${escapeLatex(exp.location || "")}}
    ${generateBulletList(
      (exp.points || exp.responsibilities || []).filter((point: string) =>
        point.trim()
      )
    )}`
  )
  .join("\n")}
\\end{itemize}`
          : "";

      case "publications":
        // Publications section - currently not implemented
        return "";

      case "awards":
        // Awards section - currently not implemented
        return "";

      case "skills":
        return skills.length > 0
          ? `\\section{Research Skills}
\\begin{itemize}[leftmargin=0pt, itemindent=0pt]
  \\item\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}l}
    ${skills
      .map(
        (skill) =>
          `\\textbf{${escapeLatex(skill.name)}}: ${escapeLatex(skill.level)}`
      )
      .join(" \\\\\n    ")}
  \\end{tabular*}
\\end{itemize}`
          : "";

      default:
        return "";
    }
  })
  .filter(Boolean)
  .join("\n\n")}

\\end{document}`;
}
