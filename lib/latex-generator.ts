import type {
  ResumeData,
  Template,
  Project,
  Certification,
  Language,
  Award,
  Publication,
  Volunteer,
  CustomSection,
} from "./types";

import {
  escapeLatex,
  formatDate,
  generateBulletList,
  generateSection,
  generateTabular,
  generateLink,
  generateTwoColumns,
  generateHeader,
  generateSkillBar,
  generateTimelineEntry,
} from "./latex-utils";

// Generate LaTeX for projects section
function generateProjectsSection(projects: Project[]): string {
  if (!projects || projects.length === 0) return "";

  return `
% Projects
\\resumeSection{Projects}

${projects
  .map(
    (project) => `
\\resumeItem{${escapeLatex(project.title)}}{\\resumeDate{${formatDate(
      project.startDate
    )} - ${project.current ? "Present" : formatDate(project.endDate)}}}
${
  project.description
    ? `\\resumeSubItem{${escapeLatex(project.description)}}`
    : ""
}
${
  project.technologies.length > 0
    ? `\\textbf{Technologies:} ${project.technologies
        .map((tech) => escapeLatex(tech))
        .join(", ")}`
    : ""
}
${
  project.url
    ? `\\textbf{URL:} \\href{${escapeLatex(project.url)}}{${escapeLatex(
        project.url
      )}}`
    : ""
}
${project.highlights.length > 0 ? generateBulletList(project.highlights) : ""}
\\vspace{0.5em}`
  )
  .join("\n")}`;
}

// Generate LaTeX for certifications section
function generateCertificationsSection(
  certifications: Certification[]
): string {
  if (!certifications || certifications.length === 0) return "";

  return `
% Certifications
\\resumeSection{Certifications}

${certifications
  .map(
    (cert) => `
\\resumeItem{${escapeLatex(cert.name)}}{\\resumeDate{${formatDate(
      cert.issueDate
    )}}}
\\resumeSubItem{${escapeLatex(cert.issuer)}}
${
  cert.credentialId
    ? `\\textbf{Credential ID:} ${escapeLatex(cert.credentialId)}`
    : ""
}
${
  cert.url
    ? `\\textbf{Verify:} \\href{${escapeLatex(cert.url)}}{${escapeLatex(
        cert.url
      )}}`
    : ""
}
${cert.expiryDate ? `\\textbf{Expires:} ${formatDate(cert.expiryDate)}` : ""}
\\vspace{0.5em}`
  )
  .join("\n")}`;
}

// Generate LaTeX for languages section
function generateLanguagesSection(languages: Language[]): string {
  if (!languages || languages.length === 0) return "";

  return `
% Languages
\\resumeSection{Languages}

\\begin{itemize}[leftmargin=*]
${languages
  .map(
    (lang) =>
      `    \\item \\textbf{${escapeLatex(lang.name)}}: ${escapeLatex(
        lang.proficiency
      )}`
  )
  .join("\n")}
\\end{itemize}`;
}

// Generate LaTeX for awards section
function generateAwardsSection(awards: Award[]): string {
  if (!awards || awards.length === 0) return "";

  return `
% Awards
\\resumeSection{Awards}

${awards
  .map(
    (award) => `
\\resumeItem{${escapeLatex(award.title)}}{\\resumeDate{${formatDate(
      award.date
    )}}}
\\resumeSubItem{${escapeLatex(award.issuer)}}
${award.description ? `${escapeLatex(award.description)}` : ""}
\\vspace{0.5em}`
  )
  .join("\n")}`;
}

// Generate LaTeX for publications section
function generatePublicationsSection(publications: Publication[]): string {
  if (!publications || publications.length === 0) return "";

  return `
% Publications
\\resumeSection{Publications}

${publications
  .map(
    (pub) => `
\\resumeItem{${escapeLatex(pub.title)}}{\\resumeDate{${formatDate(pub.date)}}}
\\resumeSubItem{${escapeLatex(pub.authors)}}
\\textbf{${escapeLatex(pub.journal)}}
${pub.doi ? `\\textbf{DOI:} ${escapeLatex(pub.doi)}` : ""}
${
  pub.url
    ? `\\textbf{URL:} \\href{${escapeLatex(pub.url)}}{${escapeLatex(pub.url)}}`
    : ""
}
\\vspace{0.5em}`
  )
  .join("\n")}`;
}

// Generate LaTeX for volunteer section
function generateVolunteerSection(volunteer: Volunteer[]): string {
  if (!volunteer || volunteer.length === 0) return "";

  return `
% Volunteer Experience
\\resumeSection{Volunteer Experience}

${volunteer
  .map(
    (vol) => `
\\resumeItem{${escapeLatex(vol.organization)}}{\\resumeDate{${formatDate(
      vol.startDate
    )} - ${vol.current ? "Present" : formatDate(vol.endDate)}}}
\\resumeSubItem{${escapeLatex(vol.role)}${
      vol.location ? `, ${escapeLatex(vol.location)}` : ""
    }}
${vol.description ? `${escapeLatex(vol.description)}` : ""}
${vol.achievements.length > 0 ? generateBulletList(vol.achievements) : ""}
\\vspace{0.5em}`
  )
  .join("\n")}`;
}

// Generate LaTeX for custom sections
function generateCustomSections(customSections: CustomSection[]): string {
  if (!customSections || customSections.length === 0) return "";

  return customSections
    .filter((section) => section.visible)
    .map((section) => {
      let content = "";
      if (section.type === "text" && typeof section.content === "string") {
        content = escapeLatex(section.content);
      } else if (section.type === "list" && Array.isArray(section.content)) {
        content = generateBulletList(section.content);
      } else if (
        section.type === "timeline" &&
        Array.isArray(section.content)
      ) {
        content = generateBulletList(section.content);
      }

      return `
% ${escapeLatex(section.title)}
\\resumeSection{${escapeLatex(section.title)}}

${content}`;
    })
    .join("\n");
}

// Generate professional summary section
function generateSummarySection(summary: string): string {
  if (!summary) return "";

  return `
% Professional Summary
\\resumeSection{Professional Summary}

${escapeLatex(summary)}

\\vspace{1em}`;
}

// Import templates
import { generateModernTemplate } from "./templates/modern";
import { generateClassicTemplate } from "./templates/classic";
import { generateMinimalTemplate } from "./templates/minimal";
import { generateAcademicTemplate } from "./templates/academic";

// LaTeX template generators
const latexTemplates = {
  "latex-modern": generateModernTemplate,
  "latex-classic": generateClassicTemplate,
  "latex-minimal": generateMinimalTemplate,
  "latex-academic": generateAcademicTemplate,
};

function generateJakeRyanTemplate(resumeData: ResumeData): string {
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
% Resume in Latex
% Author : Jake Gutierrez
% Based off of: https://github.com/sb2nov/resume
% License : MIT
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
\\input{glyphtounicode}

%----------FONT OPTIONS----------
% sans-serif
% \\usepackage[sfdefault]{FiraSans}
% \\usepackage[sfdefault]{roboto}
% \\usepackage[sfdefault]{noto-sans}
% \\usepackage[default]{sourcesanspro}

% serif
% \\usepackage{CormorantGaramond}
% \\usepackage{charter}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
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

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(
      personalInfo.fullName
    )}} \\\\ \\vspace{1pt}
    \\small ${escapeLatex(personalInfo.phone)} $|$ \\href{mailto:${escapeLatex(
    personalInfo.email
  )}}{\\underline{${escapeLatex(personalInfo.email)}}} $|$ 
    ${
      personalInfo.linkedin
        ? `\\href{${escapeLatex(
            personalInfo.linkedin
          )}}{\\underline{${escapeLatex(personalInfo.linkedin)}}} $|$`
        : ""
    }
    ${
      personalInfo.github
        ? `\\href{${escapeLatex(
            personalInfo.github
          )}}{\\underline{${escapeLatex(personalInfo.github)}}}`
        : ""
    }
\\end{center}

${visibleSections
  .map((section) => {
    switch (section.type) {
      case "education":
        return education.length > 0
          ? `
%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
${education
  .map(
    (edu) => `    \\resumeSubheading
      {${escapeLatex(edu.institution)}}{${escapeLatex(edu.location || "")}}
      {${escapeLatex(edu.degree)} in ${escapeLatex(edu.field)}}{${formatDate(
      edu.startDate
    )} -- ${edu.endDate ? formatDate(edu.endDate) : "Present"}}${
      edu.achievements.length > 0
        ? `
      \\resumeItemListStart
${edu.achievements
  .map((achievement) => `        \\resumeItem{${escapeLatex(achievement)}}`)
  .join("\n")}
      \\resumeItemListEnd`
        : ""
    }`
  )
  .join("\n")}
  \\resumeSubHeadingListEnd
`
          : "";

      case "experience":
        return experience.length > 0
          ? `
%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
${experience
  .map(
    (exp) => `    \\resumeSubheading
      {${escapeLatex(exp.position)}}{${formatDate(exp.startDate)} -- ${
      exp.current ? "Present" : formatDate(exp.endDate)
    }}
      {${escapeLatex(exp.company)}}{${escapeLatex(exp.location || "")}}
      \\resumeItemListStart
${exp.responsibilities
  .map((resp) => `        \\resumeItem{${escapeLatex(resp)}}`)
  .join("\n")}
      \\resumeItemListEnd`
  )
  .join("\n\n")}
  \\resumeSubHeadingListEnd
`
          : "";

      case "projects":
        return projects.length > 0
          ? `
%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
${projects
  .map(
    (project) => `      \\resumeProjectHeading
          {\\textbf{${escapeLatex(project.title)}}${
      project.technologies.length > 0
        ? ` $|$ \\emph{${project.technologies
            .map((tech) => escapeLatex(tech))
            .join(", ")}}`
        : ""
    }}{${formatDate(project.startDate)} -- ${
      project.current ? "Present" : formatDate(project.endDate)
    }}
          \\resumeItemListStart
${
  project.highlights.length > 0
    ? project.highlights
        .map(
          (highlight) => `            \\resumeItem{${escapeLatex(highlight)}}`
        )
        .join("\n")
    : `            \\resumeItem{${escapeLatex(project.description || "")}}`
}
          \\resumeItemListEnd`
  )
  .join("\n")}
    \\resumeSubHeadingListEnd
`
          : "";

      case "skills":
        return skills.length > 0
          ? `
%-----------PROGRAMMING SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: ${skills
       .slice(0, Math.ceil(skills.length / 4))
       .map((s) => escapeLatex(s.name))
       .join(", ")}} \\\\
     \\textbf{Frameworks}{: ${skills
       .slice(Math.ceil(skills.length / 4), Math.ceil(skills.length / 2))
       .map((s) => escapeLatex(s.name))
       .join(", ")}} \\\\
     \\textbf{Developer Tools}{: ${skills
       .slice(Math.ceil(skills.length / 2), Math.ceil((3 * skills.length) / 4))
       .map((s) => escapeLatex(s.name))
       .join(", ")}} \\\\
     \\textbf{Libraries}{: ${skills
       .slice(Math.ceil((3 * skills.length) / 4))
       .map((s) => escapeLatex(s.name))
       .join(", ")}}
    }}
 \\end{itemize}
`
          : "";

      default:
        return "";
    }
  })
  .filter(Boolean)
  .join("\n")}

%-------------------------------------------
\\end{document}`;
}

// Function to generate LaTeX content based on template
function generateLatexContent(
  resumeData: ResumeData,
  template: Template
): string {
  const templateGenerator = latexTemplates[template];
  if (!templateGenerator) {
    throw new Error(`Unknown template: ${template}`);
  }
  return templateGenerator(resumeData);
}

// Function to export resume to LaTeX
export function exportResumeToLatex(
  resumeData: ResumeData,
  template: Template
): string {
  try {
    const latexContent = generateLatexContent(resumeData, template);
    return latexContent;
  } catch (error) {
    console.error("Error generating LaTeX:", error);
    throw error;
  }
}

// Function to download LaTeX file
export function downloadLatexFile(
  resumeData: ResumeData,
  template: Template
): void {
  try {
    const latexContent = exportResumeToLatex(resumeData, template);
    const fileName = `${resumeData.personalInfo.fullName.replace(
      /\s+/g,
      "_"
    )}_Resume.tex`;

    const blob = new Blob([latexContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading LaTeX file:", error);
    throw error;
  }
}
