import type { ResumeData } from "../types";
import {
  escapeLatex,
  formatDate,
  generateBulletList,
  generateSection,
  generateHeader,
} from "../latex-utils";

export function generateClassicTemplate(resumeData: ResumeData): string {
  const { personalInfo, experience, education, skills, projects, sections } =
    resumeData;

  // Filter visible sections and sort by order
  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return `%-------------------------
% Classic Resume Template
% Author : CVCraft
% License : MIT
%------------------------

\\documentclass[11pt,letterpaper]{article}

\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fontawesome5}
\\usepackage{xcolor}

% Define custom colors
\\definecolor{primary}{HTML}{000000}
\\definecolor{secondary}{HTML}{333333}

% Set page margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-0.5in}
\\addtolength{\\textheight}{1.0in}

% Custom section formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\titlerule]

\\titlespacing*{\\section}{0pt}{12pt}{8pt}

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{#1}
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{2pt}\\item
    \\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & {\\small#2} \\\\
      {\\small#3} & {\\small#4} \\\\
    \\end{tabular*}\\vspace{4pt}
}

\\begin{document}

%----------HEADER----------
${generateHeader(personalInfo.fullName, {
  email: personalInfo.email,
  phone: personalInfo.phone,
  linkedin: personalInfo.linkedin,
  github: personalInfo.github,
})}

${
  personalInfo.summary
    ? generateSection("Summary", escapeLatex(personalInfo.summary))
    : ""
}

${visibleSections
  .map((section) => {
    switch (section.type) {
      case "experience":
        return experience.length > 0
          ? generateSection(
              "Professional Experience",
              `\\begin{itemize}[leftmargin=0pt, itemindent=0pt]
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
            )
          : "";

      case "education":
        return education.length > 0
          ? generateSection(
              "Education",
              `\\begin{itemize}[leftmargin=0pt, itemindent=0pt]
${education
  .map(
    (edu) => `
  \\resumeSubheading
    {${escapeLatex(edu.institution)}}
    {${formatDate(edu.startDate)} -- ${
      edu.endDate ? formatDate(edu.endDate) : "Present"
    }}
    {${escapeLatex(edu.degree)} in ${escapeLatex(edu.field)}}
    {${escapeLatex(edu.location || "")}}
    ${generateBulletList(edu.achievements)}`
  )
  .join("\n")}
\\end{itemize}`
            )
          : "";

      case "skills":
        return skills.length > 0
          ? generateSection(
              "Technical Skills",
              `\\begin{itemize}[leftmargin=0pt, itemindent=0pt]
  \\item\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}l}
    ${skills
      .map(
        (skill) =>
          `\\textbf{${escapeLatex(skill.name)}}: ${escapeLatex(skill.level)}`
      )
      .join(" \\\\\n    ")}
  \\end{tabular*}
\\end{itemize}`
            )
          : "";

      case "projects":
        return projects.length > 0
          ? generateSection(
              "Projects",
              `\\begin{itemize}[leftmargin=0pt, itemindent=0pt]
${projects
  .map(
    (project) => `
  \\resumeSubheading
    {${escapeLatex(project.title)}}
    {${formatDate(project.startDate)} -- ${
      project.current ? "Present" : formatDate(project.endDate)
    }}
    {${project.technologies.map((tech) => escapeLatex(tech)).join(", ")}}
    {${project.url ? `\\href{${escapeLatex(project.url)}}{Project Link}` : ""}}
    ${generateBulletList(project.highlights)}`
  )
  .join("\n")}
\\end{itemize}`
            )
          : "";

      default:
        return "";
    }
  })
  .filter(Boolean)
  .join("\n")}

\\end{document}`;
}
