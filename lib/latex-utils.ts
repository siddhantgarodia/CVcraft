// Function to escape LaTeX special characters
export function escapeLatex(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/[&%$#_{}~^]/g, "\\$&")
    .replace(/</g, "\\textless{}")
    .replace(/>/g, "\\textgreater{}")
    .replace(/\n/g, " ")
    .trim();
}

// Function to format date strings
export function formatDate(date: string): string {
  if (!date) return "";
  return escapeLatex(date);
}

// Function to generate a bulleted list
export function generateBulletList(items: string[]): string {
  if (!items || items.length === 0) return "";
  return `\\begin{itemize}[leftmargin=*]
${items
  .filter((item) => item.trim())
  .map((item) => `    \\item ${escapeLatex(item)}`)
  .join("\n")}
\\end{itemize}`;
}

// Function to generate a section heading
export function generateSection(title: string, content: string): string {
  if (!content) return "";
  return `
% ${title}
\\section{${escapeLatex(title)}}

${content}`;
}

// Function to generate a tabular environment
export function generateTabular(
  headers: string[],
  rows: string[][],
  alignment: string = "l"
): string {
  const alignmentString = alignment.repeat(headers.length);
  return `\\begin{tabular}{${alignmentString}}
  ${headers.map((h) => escapeLatex(h)).join(" & ")} \\\\
  \\hline
  ${rows
    .map((row) => row.map((cell) => escapeLatex(cell)).join(" & "))
    .join(" \\\\\n  ")}
\\end{tabular}`;
}

// Function to generate a hyperlink
export function generateLink(text: string, url: string): string {
  return `\\href{${escapeLatex(url)}}{${escapeLatex(text)}}`;
}

// Function to generate a two-column layout
export function generateTwoColumns(
  leftContent: string,
  rightContent: string
): string {
  return `\\begin{minipage}[t]{0.48\\textwidth}
${leftContent}
\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.48\\textwidth}
${rightContent}
\\end{minipage}`;
}

// Function to generate a page header
export function generateHeader(
  name: string,
  contact: { [key: string]: string }
): string {
  const contactItems = Object.entries(contact)
    .filter(([_, value]) => value)
    .map(
      ([key, value]) =>
        `\\faIcon{${key}} ${
          key === "email" || key.includes("url")
            ? generateLink(value, value)
            : escapeLatex(value)
        }`
    )
    .join(" $|$ ");

  return `\\begin{center}
  {\\Huge\\textbf{${escapeLatex(name)}}}\\\\[4pt]
  \\small{${contactItems}}
\\end{center}`;
}

// Function to generate a skill bar
export function generateSkillBar(
  skill: string,
  level: number,
  maxLevel: number = 5
): string {
  const filled = "\\faCircle".repeat(level);
  const empty = "\\faCircleO".repeat(maxLevel - level);
  return `\\textbf{${escapeLatex(skill)}} & ${filled}${empty}`;
}

// Function to generate a timeline entry
export function generateTimelineEntry(
  title: string,
  subtitle: string,
  date: string,
  description: string[]
): string {
  return `\\resumeSubheading
  {${escapeLatex(title)}}
  {${escapeLatex(date)}}
  {${escapeLatex(subtitle)}}
  {}
  ${generateBulletList(description)}`;
}
