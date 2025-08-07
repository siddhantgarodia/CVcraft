import type { ResumeData } from "../types";
import { escapeLatex, formatDate, generateBulletList } from "../latex-utils";

export function generateModernTemplate(resumeData: ResumeData): string {
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
% Modern Resume Template
% Author : CVCraft
% License : MIT
%------------------------

\\documentclass[a4paper,11pt]{article}

\\usepackage{geometry}
\\usepackage{fontspec}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fontawesome5}
\\usepackage{xcolor}
\\usepackage{multicol}
\\usepackage{ragged2e}

% Define custom colors
\\definecolor{primary}{HTML}{2563EB}
\\definecolor{secondary}{HTML}{4B5563}
\\definecolor{accent}{HTML}{1E40AF}

% Set page margins
\\geometry{
  top=1.25cm,
  bottom=1.25cm,
  left=1.5cm,
  right=1.5cm,
  includehead,
  includefoot
}

% Set fonts
\\setmainfont{Inter}[
  Path = ./fonts/,
  Extension = .ttf,
  UprightFont = *-Regular,
  BoldFont = *-Bold,
  ItalicFont = *-Italic,
  BoldItalicFont = *-BoldItalic
]

% Custom section formatting
\\titleformat{\\section}{
  \\color{primary}\\scshape\\Large\\raggedright
}{}{0em}{}[\\color{primary}\\titlerule]

\\titlespacing*{\\section}{0pt}{12pt}{8pt}

% Custom commands
\\newcommand{\\contactItem}[2]{
  \\small{\\faIcon{#1} #2}\\hspace{1em}
}

\\newcommand{\\resumeItem}[1]{
  \\item\\small{#1}
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{2pt}\\item
    \\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{\\large#1} & {\\small#2} \\\\
      {\\small\\textcolor{secondary}{#3}} & {\\small\\textcolor{secondary}{#4}} \\\\
    \\end{tabular*}\\vspace{4pt}
}

\\newcommand{\\skill}[2]{
  \\textbf{#1}: #2 \\\\
}

\\begin{document}

%----------HEADER----------
\\begin{center}
  {\\Huge\\textbf{${escapeLatex(personalInfo.fullName)}}}\\\\[4pt]
  \\begin{minipage}{\\textwidth}
    \\centering
    \\contactItem{envelope}{\\href{mailto:${escapeLatex(
      personalInfo.email
    )}}{${escapeLatex(personalInfo.email)}}}
    \\contactItem{phone}{${escapeLatex(personalInfo.phone)}}
    ${
      personalInfo.linkedin
        ? `\\contactItem{linkedin}{\\href{${escapeLatex(
            personalInfo.linkedin
          )}}{LinkedIn}}`
        : ""
    }
    ${
      personalInfo.github
        ? `\\contactItem{github}{\\href{${escapeLatex(
            personalInfo.github
          )}}{GitHub}}`
        : ""
    }
  \\end{minipage}
\\end{center}

${
  personalInfo.summary
    ? `
%----------SUMMARY----------
\\section{Professional Summary}
${escapeLatex(personalInfo.summary)}
`
    : ""
}

${visibleSections
  .map((section) => {
    switch (section.type) {
      case "experience":
        return experience.length > 0
          ? `
%----------EXPERIENCE----------
\\section{Professional Experience}
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
    ${
      exp.responsibilities.length > 0
        ? `
    \\begin{itemize}[leftmargin=*]
      ${exp.responsibilities
        .map((resp) => `\\resumeItem{${escapeLatex(resp)}}`)
        .join("\n      ")}
    \\end{itemize}`
        : ""
    }
`
  )
  .join("\n")}
\\end{itemize}
`
          : "";

      case "education":
        return education.length > 0
          ? `
%----------EDUCATION----------
\\section{Education}
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
    {${escapeLatex(edu.location || "")}}
    ${
      edu.achievements.length > 0
        ? `
    \\begin{itemize}[leftmargin=*]
      ${edu.achievements
        .map((achievement) => `\\resumeItem{${escapeLatex(achievement)}}`)
        .join("\n      ")}
    \\end{itemize}`
        : ""
    }
`
  )
  .join("\n")}
\\end{itemize}
`
          : "";

      case "skills":
        return skills.length > 0
          ? `
%----------SKILLS----------
\\section{Technical Skills}
\\begin{itemize}[leftmargin=0pt, itemindent=0pt]
  \\item\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}l}
    ${skills
      .map((skill, index, array) => {
        if (index % 2 === 0) {
          const nextSkill = array[index + 1];
          return `\\skill{${escapeLatex(skill.name)}}{${escapeLatex(
            skill.level
          )}} ${
            nextSkill
              ? `& \\skill{${escapeLatex(nextSkill.name)}}{${escapeLatex(
                  nextSkill.level
                )}} \\\\`
              : ""
          }`;
        }
        return "";
      })
      .filter(Boolean)
      .join("\n    ")}
  \\end{tabular*}
\\end{itemize}
`
          : "";

      case "projects":
        return projects.length > 0
          ? `
%----------PROJECTS----------
\\section{Projects}
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
    {${project.url ? `\\href{${escapeLatex(project.url)}}{Project Link}` : ""}}
    ${
      project.highlights.length > 0
        ? `
    \\begin{itemize}[leftmargin=*]
      ${project.highlights
        .map((highlight) => `\\resumeItem{${escapeLatex(highlight)}}`)
        .join("\n      ")}
    \\end{itemize}`
        : ""
    }
`
  )
  .join("\n")}
\\end{itemize}
`
          : "";

      default:
        return "";
    }
  })
  .filter(Boolean)
  .join("\n")}

\\end{document}`;
}
