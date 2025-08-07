import type { ResumeData } from "../types";
import {
  escapeLatex,
  formatDate,
  generateBulletList,
  generateSection,
  generateHeader,
} from "../latex-utils";

export function generateMinimalTemplate(resumeData: ResumeData): string {
  const {
    personalInfo,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    awards,
    publications,
    volunteer,
    customSections,
    sections,
  } = resumeData;

  // Filter visible sections and sort by order
  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return `%-------------------------
% Minimal Resume Template
% Author : CVCraft
% License : MIT
%------------------------

\\documentclass[11pt,a4paper]{article}

\\usepackage[margin=1in]{geometry}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fontawesome5}
\\usepackage{xcolor}

% Define custom colors
\\definecolor{primary}{HTML}{000000}
\\definecolor{secondary}{HTML}{666666}

% Custom section formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\large\\bfseries
}{}{0em}{}

\\titlespacing*{\\section}{0pt}{12pt}{4pt}

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{#1}
}

\\newcommand{\\resumeSubheading}[4]{
  \\item
    \\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & {\\small#2} \\\\
      {\\small\\textcolor{secondary}{#3}} & {\\small\\textcolor{secondary}{#4}} \\\\
    \\end{tabular*}\\vspace{2pt}
}

\\begin{document}

%----------HEADER----------
\\begin{center}
  {\\Large\\textbf{${escapeLatex(personalInfo.fullName)}}}\\\\[2pt]
  {\\small
    \\href{mailto:${escapeLatex(personalInfo.email)}}{${escapeLatex(
    personalInfo.email
  )}} $|$
    ${escapeLatex(personalInfo.phone)}
    ${
      personalInfo.linkedin
        ? `$|$ \\href{${escapeLatex(personalInfo.linkedin)}}{LinkedIn}`
        : ""
    }
    ${
      personalInfo.github
        ? `$|$ \\href{${escapeLatex(personalInfo.github)}}{GitHub}`
        : ""
    }
  }
\\end{center}

${
  personalInfo.summary
    ? `
\\vspace{0.5em}
${escapeLatex(personalInfo.summary)}
\\vspace{0.5em}`
    : ""
}

${visibleSections
  .map((section) => {
    switch (section.type) {
      case "experience":
        return experience.length > 0
          ? `\\section{Experience}
\\begin{itemize}[leftmargin=0pt, itemindent=0pt]
${experience
  .map(
    (exp) => `
  \\resumeSubheading
    {${escapeLatex(exp.position)}}
    {${formatDate(exp.startDate)} -- ${
      exp.current ? "Present" : formatDate(exp.endDate)
    }}
    {${escapeLatex(exp.company)}}
    {${escapeLatex(exp.location || "")}}
    ${generateBulletList(exp.responsibilities)}`
  )
  .join("\n")}
\\end{itemize}`
          : "";

      case "education":
        return education.length > 0
          ? `\\section{Education}
\\begin{itemize}[leftmargin=0pt, itemindent=0pt]
${education
  .map(
    (edu) => `
  \\resumeSubheading
    {${escapeLatex(edu.institution)}}
    {${formatDate(edu.startDate)} -- ${
      edu.endDate ? formatDate(edu.endDate) : "Present"
    }}
    {${escapeLatex(edu.degree)} in ${escapeLatex(edu.field)}}
    {${escapeLatex(edu.location || "")}}`
  )
  .join("\n")}
\\end{itemize}`
          : "";

      case "skills":
        return skills.length > 0
          ? `\\section{Skills}
\\begin{itemize}[leftmargin=0pt, itemindent=0pt]
  \\item{${skills
    .map(
      (skill) =>
        `\\textbf{${escapeLatex(skill.name)}}: ${escapeLatex(skill.level)}`
    )
    .join(" $|$ ")}}
\\end{itemize}`
          : "";

      case "projects":
        return projects.length > 0
          ? `\\section{Projects}
\\begin{itemize}[leftmargin=0pt, itemindent=0pt]
${projects
  .map(
    (project) => `
  \\resumeSubheading
    {${escapeLatex(project.title)}}
    {${formatDate(project.startDate)} -- ${
      project.current ? "Present" : formatDate(project.endDate)
    }}
    {${project.technologies.map((tech) => escapeLatex(tech)).join(", ")}}
    {}
    ${generateBulletList(project.highlights)}`
  )
  .join("\n")}
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
