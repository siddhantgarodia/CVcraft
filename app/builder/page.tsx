"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Download,
  Plus,
  Trash2,
  Save,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  FileCode,
  Zap,
  Target,
  BookOpen,
  Settings,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { jsPDF } from "jspdf";

// Type definitions for the builder
interface PersonalInfo {
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
}

interface EducationItem {
  id: string;
  institution: string;
  location: string;
  degree: string;
  dates: string;
}

interface ExperienceItem {
  id: string;
  position: string;
  company: string;
  location: string;
  dates: string;
  points: string[];
}

interface ProjectItem {
  id: string;
  title: string;
  technologies: string;
  dates: string;
  points: string[];
}

interface SkillItem {
  id: string;
  name: string;
  skills: string;
}

interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  location?: string;
  dates?: string;
  points?: string[];
}

interface CustomSection {
  id: string;
  title: string;
  type: "text" | "list" | "skills";
  content: string;
  items: CustomSectionItem[];
}

interface ResumeData {
  personalInfo: PersonalInfo;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  customSections: CustomSection[];
}

// Default data structure
const defaultData: ResumeData = {
  personalInfo: {
    name: "Jake Ryan",
    phone: "123-456-7890",
    email: "jake@su.edu",
    linkedin: "linkedin.com/in/jake-ryan",
    github: "github.com/jake-ryan",
  },
  education: [
    {
      id: "edu1",
      institution: "Southwestern University",
      location: "Georgetown, TX",
      degree: "Bachelor of Arts in Computer Science, Minor in Business",
      dates: "Aug. 2018 -- May 2021",
    },
  ],
  experience: [
    {
      id: "exp1",
      position: "Software Engineer",
      dates: "June 2021 -- Present",
      company: "Google",
      location: "Mountain View, CA",
      points: [
        "Developed and maintained web applications serving millions of users",
        "Collaborated with cross-functional teams to deliver high-quality software",
        "Optimized application performance, resulting in 30% faster load times",
      ],
    },
  ],
  projects: [
    {
      id: "proj1",
      title: "Resume Builder App",
      technologies: "React, TypeScript, Next.js, Tailwind CSS",
      dates: "Jan 2024 -- Present",
      points: [
        "Built a modern resume builder with real-time preview",
        "Implemented LaTeX export and PDF generation",
        "Added collaborative editing features",
      ],
    },
  ],
  skills: [
    {
      id: "skill1",
      name: "Languages",
      skills: "JavaScript, TypeScript, Python, Java, SQL",
    },
    {
      id: "skill2",
      name: "Frameworks",
      skills: "React, Next.js, Node.js, Express, Django",
    },
  ],
  customSections: [],
};

// LaTeX template generator
const generateLatexCode = (data: any) => {
  const escapeLatex = (text: string) => {
    return text
      .replace(/\\/g, "\\textbackslash")
      .replace(/[{}]/g, "")
      .replace(/[#$%&_]/g, (match) => `\\${match}`)
      .replace(
        /[~^]/g,
        (match) => `\\textasciitilde` + (match === "^" ? "textasciicircum" : "")
      );
  };

  let latex = `\\documentclass[letterpaper,11pt]{article}

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

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

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

\\begin{document}

\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(
      data.personalInfo.name
    )}} \\\\ \\vspace{1pt}
    \\small ${escapeLatex(data.personalInfo.phone)} $|$ \\href{mailto:${
    data.personalInfo.email
  }}{\\underline{${escapeLatex(data.personalInfo.email)}}} $|$ 
    \\href{https://${data.personalInfo.linkedin}}{\\underline{${escapeLatex(
    data.personalInfo.linkedin
  )}}} $|$
    \\href{https://${data.personalInfo.github}}{\\underline{${escapeLatex(
    data.personalInfo.github
  )}}}
\\end{center}

`;

  // Education section
  if (data.education.length > 0) {
    latex += `\\section{Education}
  \\resumeSubHeadingListStart
`;
    data.education.forEach((edu: any) => {
      latex += `    \\resumeSubheading
      {${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}
      {${escapeLatex(edu.degree)}}{${escapeLatex(edu.dates)}}
`;
    });
    latex += `  \\resumeSubHeadingListEnd

`;
  }

  // Experience section
  if (data.experience.length > 0) {
    latex += `\\section{Experience}
  \\resumeSubHeadingListStart
`;
    data.experience.forEach((exp: any) => {
      latex += `    \\resumeSubheading
      {${escapeLatex(exp.position)}}{${escapeLatex(exp.dates)}}
      {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
      \\resumeItemListStart
`;
      exp.points.forEach((point: string) => {
        latex += `        \\resumeItem{${escapeLatex(point)}}
`;
      });
      latex += `      \\resumeItemListEnd
`;
    });
    latex += `  \\resumeSubHeadingListEnd

`;
  }

  // Projects section
  if (data.projects.length > 0) {
    latex += `\\section{Projects}
    \\resumeSubHeadingListStart
`;
    data.projects.forEach((proj: any) => {
      latex += `      \\resumeProjectHeading
          {\\textbf{${escapeLatex(proj.title)}} $|$ \\emph{${escapeLatex(
        proj.technologies
      )}}}{${escapeLatex(proj.dates)}}
          \\resumeItemListStart
`;
      proj.points.forEach((point: string) => {
        latex += `            \\resumeItem{${escapeLatex(point)}}
`;
      });
      latex += `          \\resumeItemListEnd
`;
    });
    latex += `    \\resumeSubHeadingListEnd

`;
  }

  // Skills section
  if (data.skills.length > 0) {
    latex += `\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
`;
    data.skills.forEach((skill: any, index: number) => {
      latex += `     \\textbf{${escapeLatex(skill.name)}}{: ${escapeLatex(
        skill.skills
      )}} \\\\`;
      if (index < data.skills.length - 1) latex += "\n";
    });
    latex += `
    }}
 \\end{itemize}

`;
  }

  // Custom sections
  data.customSections.forEach((section: any) => {
    latex += `\\section{${escapeLatex(section.title)}}
`;
    if (section.type === "list") {
      latex += `\\resumeSubHeadingListStart
`;
      section.items.forEach((item: any) => {
        if (item.subtitle) {
          latex += `    \\resumeSubheading
      {${escapeLatex(item.title)}}{${escapeLatex(item.dates || "")}}
      {${escapeLatex(item.subtitle)}}{${escapeLatex(item.location || "")}}
`;
          if (item.points && item.points.length > 0) {
            latex += `      \\resumeItemListStart
`;
            item.points.forEach((point: string) => {
              latex += `        \\resumeItem{${escapeLatex(point)}}
`;
            });
            latex += `      \\resumeItemListEnd
`;
          }
        } else {
          latex += `    \\resumeProjectHeading
          {${escapeLatex(item.title)}}{${escapeLatex(item.dates || "")}}
`;
          if (item.points && item.points.length > 0) {
            latex += `          \\resumeItemListStart
`;
            item.points.forEach((point: string) => {
              latex += `            \\resumeItem{${escapeLatex(point)}}
`;
            });
            latex += `          \\resumeItemListEnd
`;
          }
        }
      });
      latex += `\\resumeSubHeadingListEnd

`;
    } else if (section.type === "text") {
      latex += `${escapeLatex(section.content)}

`;
    } else if (section.type === "skills") {
      latex += ` \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     ${escapeLatex(section.content)}
    }}
 \\end{itemize}

`;
    }
  });

  latex += `\\end{document}`;

  return latex;
};

export default function BuilderPage() {
  const { toast } = useToast();
  const [resumeData, setResumeData] = useState(defaultData);

  // Dynamic UI state
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [sectionStates, setSectionStates] = useState({
    personalInfo: true,
    education: true,
    experience: true,
    projects: true,
    skills: true,
    customSections: true,
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [showPageBreaks, setShowPageBreaks] = useState(true);
  const [latexCode, setLatexCode] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pageBreaks, setPageBreaks] = useState<number[]>([]);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // A4 dimensions in pixels (at 96 DPI)
  // A4 = 210mm × 297mm = 8.27" × 11.69" = 794px × 1123px at 96 DPI
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;
  const MARGIN_PX = 48; // 0.5 inch margins
  const USABLE_HEIGHT_PX = A4_HEIGHT_PX - MARGIN_PX * 2; // ~1027px usable height

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("cvcraft-resume-data");
    const savedStates = localStorage.getItem("cvcraft-section-states");

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setResumeData(parsed);
        setLastSaved(new Date());
      } catch (error) {
        console.error("Failed to load saved data:", error);
      }
    }

    if (savedStates) {
      try {
        const parsed = JSON.parse(savedStates);
        setSectionStates(parsed);
      } catch (error) {
        console.error("Failed to load saved section states:", error);
      }
    }
  }, []);

  // Auto-save functionality
  const saveToLocalStorage = useCallback(async () => {
    if (!isAutoSaveEnabled) return;

    setIsSaving(true);
    try {
      localStorage.setItem("cvcraft-resume-data", JSON.stringify(resumeData));
      localStorage.setItem(
        "cvcraft-section-states",
        JSON.stringify(sectionStates)
      );
      setLastSaved(new Date());

      // Simulate network delay for better UX feedback
      await new Promise((resolve) => setTimeout(resolve, 300));
    } catch (error) {
      console.error("Failed to save data:", error);
      toast({
        title: "Save Failed",
        description: "Failed to auto-save your changes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [resumeData, sectionStates, isAutoSaveEnabled, toast]);

  // Debounced auto-save
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveToLocalStorage();
    }, 1000); // Save after 1 second of inactivity

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [saveToLocalStorage]);

  // Generate LaTeX code when resume data changes
  useEffect(() => {
    const latex = generateLatexCode(resumeData);
    setLatexCode(latex);
  }, [resumeData]);

  // Real-time validation
  useEffect(() => {
    const errors: Record<string, string> = {};

    // Validate personal info
    if (!resumeData.personalInfo.name.trim()) {
      errors.name = "Name is required";
    }
    if (!resumeData.personalInfo.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(resumeData.personalInfo.email)) {
      errors.email = "Invalid email format";
    }
    if (!resumeData.personalInfo.phone.trim()) {
      errors.phone = "Phone number is required";
    }

    setValidationErrors(errors);
  }, [resumeData]);

  // Calculate completion percentage
  useEffect(() => {
    const totalFields = 15; // Approximate number of important fields
    let completedFields = 0;

    // Personal info (5 fields)
    if (resumeData.personalInfo.name) completedFields++;
    if (resumeData.personalInfo.email) completedFields++;
    if (resumeData.personalInfo.phone) completedFields++;
    if (resumeData.personalInfo.linkedin) completedFields++;
    if (resumeData.personalInfo.github) completedFields++;

    // Education (2 fields - at least one education entry with degree)
    if (resumeData.education.length > 0 && resumeData.education[0].degree)
      completedFields += 2;

    // Experience (3 fields - at least one experience with points)
    if (
      resumeData.experience.length > 0 &&
      resumeData.experience[0].points.length > 0
    )
      completedFields += 3;

    // Projects (2 fields - at least one project)
    if (resumeData.projects.length > 0 && resumeData.projects[0].title)
      completedFields += 2;

    // Skills (3 fields - at least two skill categories)
    if (resumeData.skills.length >= 2) completedFields += 3;

    setCompletionPercentage(Math.round((completedFields / totalFields) * 100));
  }, [resumeData]);

  // Toggle section visibility
  const toggleSection = useCallback(
    (sectionName: keyof typeof sectionStates) => {
      setSectionStates((prev) => ({
        ...prev,
        [sectionName]: !prev[sectionName],
      }));
    },
    []
  );

  // Personal Info handlers
  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  // Education handlers
  const addEducation = () => {
    const newEdu = {
      id: `edu${Date.now()}`,
      institution: "University Name",
      location: "City, State",
      degree: "Degree Title",
      dates: "Start Date -- End Date",
    };
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu: EducationItem) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu: any) => edu.id !== id),
    }));
  };

  // Experience handlers
  const addExperience = () => {
    const newExp = {
      id: `exp${Date.now()}`,
      position: "Job Title",
      dates: "Start Date -- End Date",
      company: "Company Name",
      location: "City, State",
      points: ["Add your achievements here"],
    };
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp: any) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp: any) => exp.id !== id),
    }));
  };

  const addExperiencePoint = (expId: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp: any) =>
        exp.id === expId
          ? { ...exp, points: [...exp.points, "New achievement"] }
          : exp
      ),
    }));
  };

  const updateExperiencePoint = (
    expId: string,
    pointIndex: number,
    value: string
  ) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp: any) =>
        exp.id === expId
          ? {
              ...exp,
              points: exp.points.map((point: string, idx: number) =>
                idx === pointIndex ? value : point
              ),
            }
          : exp
      ),
    }));
  };

  const removeExperiencePoint = (expId: string, pointIndex: number) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp: any) =>
        exp.id === expId
          ? {
              ...exp,
              points: exp.points.filter(
                (_: any, idx: number) => idx !== pointIndex
              ),
            }
          : exp
      ),
    }));
  };

  // Project handlers
  const addProject = () => {
    const newProject = {
      id: `proj${Date.now()}`,
      title: "Project Title",
      technologies: "Tech Stack",
      dates: "Start Date -- End Date",
      points: ["Project description here"],
    };
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const updateProject = (id: string, field: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj: any) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const removeProject = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj: any) => proj.id !== id),
    }));
  };

  const addProjectPoint = (projId: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj: any) =>
        proj.id === projId
          ? { ...proj, points: [...proj.points, "New detail"] }
          : proj
      ),
    }));
  };

  const updateProjectPoint = (
    projId: string,
    pointIndex: number,
    value: string
  ) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj: any) =>
        proj.id === projId
          ? {
              ...proj,
              points: proj.points.map((point: string, idx: number) =>
                idx === pointIndex ? value : point
              ),
            }
          : proj
      ),
    }));
  };

  const removeProjectPoint = (projId: string, pointIndex: number) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj: any) =>
        proj.id === projId
          ? {
              ...proj,
              points: proj.points.filter(
                (_: any, idx: number) => idx !== pointIndex
              ),
            }
          : proj
      ),
    }));
  };

  // Skills handlers
  const addSkill = () => {
    const newSkill = {
      id: `skill${Date.now()}`,
      name: "Category Name",
      skills: "Skill1, Skill2, Skill3",
    };
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  const updateSkill = (id: string, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill: any) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill: any) => skill.id !== id),
    }));
  };

  // Custom sections handlers
  // Calculate page breaks based on content height
  const calculatePageBreaks = useCallback(() => {
    if (!previewRef.current) return;

    const elements = previewRef.current.querySelectorAll(".resume-section");
    let currentHeight = MARGIN_PX; // Start with top margin
    const breaks: number[] = [];
    let pageNumber = 1;

    elements.forEach((element) => {
      const elementHeight = element.getBoundingClientRect().height;

      // Check if adding this element would exceed page height
      if (
        currentHeight + elementHeight > USABLE_HEIGHT_PX &&
        currentHeight > MARGIN_PX
      ) {
        // Add page break before this element
        breaks.push(pageNumber * A4_HEIGHT_PX);
        pageNumber++;
        currentHeight = MARGIN_PX + elementHeight; // Reset to new page
      } else {
        currentHeight += elementHeight;
      }
    });

    setPageBreaks(breaks);
  }, [USABLE_HEIGHT_PX, A4_HEIGHT_PX, MARGIN_PX]);

  // Recalculate page breaks when content changes
  useEffect(() => {
    const timer = setTimeout(() => {
      calculatePageBreaks();
    }, 100); // Small delay to ensure DOM is updated

    return () => clearTimeout(timer);
  }, [resumeData, calculatePageBreaks]);

  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: `custom${Date.now()}`,
      title: "Custom Section",
      type: "list" as const,
      items: [],
      content: "",
    };
    setResumeData((prev) => ({
      ...prev,
      customSections: [...prev.customSections, newSection],
    }));
  };

  const updateCustomSection = (id: string, field: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section: any) =>
        section.id === id ? { ...section, [field]: value } : section
      ),
    }));
  };

  const removeCustomSection = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter(
        (section: any) => section.id !== id
      ),
    }));
  };

  const addCustomSectionItem = (sectionId: string) => {
    const newItem: CustomSectionItem = {
      id: `item${Date.now()}`,
      title: "Item Title",
      subtitle: "",
      dates: "",
      location: "",
      points: [],
    };
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section: any) =>
        section.id === sectionId
          ? { ...section, items: [...section.items, newItem] }
          : section
      ),
    }));
  };

  const updateCustomSectionItem = (
    sectionId: string,
    itemId: string,
    field: string,
    value: any
  ) => {
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section: any) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item: any) =>
                item.id === itemId ? { ...item, [field]: value } : item
              ),
            }
          : section
      ),
    }));
  };

  const removeCustomSectionItem = (sectionId: string, itemId: string) => {
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section: any) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.filter((item: any) => item.id !== itemId),
            }
          : section
      ),
    }));
  };

  const addCustomSectionItemPoint = (sectionId: string, itemId: string) => {
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section: any) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item: any) =>
                item.id === itemId
                  ? { ...item, points: [...item.points, "New point"] }
                  : item
              ),
            }
          : section
      ),
    }));
  };

  const updateCustomSectionItemPoint = (
    sectionId: string,
    itemId: string,
    pointIndex: number,
    value: string
  ) => {
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section: any) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item: any) =>
                item.id === itemId
                  ? {
                      ...item,
                      points: item.points.map((point: string, idx: number) =>
                        idx === pointIndex ? value : point
                      ),
                    }
                  : item
              ),
            }
          : section
      ),
    }));
  };

  const removeCustomSectionItemPoint = (
    sectionId: string,
    itemId: string,
    pointIndex: number
  ) => {
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section: any) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item: any) =>
                item.id === itemId
                  ? {
                      ...item,
                      points: item.points.filter(
                        (_: any, idx: number) => idx !== pointIndex
                      ),
                    }
                  : item
              ),
            }
          : section
      ),
    }));
  };

  // LaTeX download handler
  const handleDownloadLatex = () => {
    const blob = new Blob([latexCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resumeData.personalInfo.name.replace(
      /\s+/g,
      "_"
    )}_Resume.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "LaTeX Downloaded",
      description: "Your resume LaTeX code has been downloaded.",
    });
  };

  // ATS Analysis function using API
  const analyzeResumeATS = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required",
        description: "Please enter a job description to analyze your resume.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Generate resume text from current data
      const resumeText = generateResumeText(resumeData);

      const response = await fetch("/api/ats-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      const analysis = await response.json();

      setAtsScore(analysis.overallScore);
      setSuggestions(analysis.suggestions.map((s: any) => s.text));

      toast({
        title: "ATS Analysis Complete",
        description: `Your resume scored ${analysis.overallScore}/100 for this job description.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate resume text for analysis
  const generateResumeText = (data: any) => {
    let text = `${data.personalInfo.name}\n`;
    text += `${data.personalInfo.phone} | ${data.personalInfo.email}`;
    if (data.personalInfo.linkedin) text += ` | ${data.personalInfo.linkedin}`;
    if (data.personalInfo.github) text += ` | ${data.personalInfo.github}`;
    text += "\n\n";

    if (data.education.length > 0) {
      text += "EDUCATION\n";
      data.education.forEach((edu: any) => {
        text += `${edu.institution}, ${edu.location}\n`;
        text += `${edu.degree}\n`;
        text += `${edu.dates}\n\n`;
      });
    }

    if (data.experience.length > 0) {
      text += "EXPERIENCE\n";
      data.experience.forEach((exp: any) => {
        text += `${exp.position} | ${exp.company}\n`;
        text += `${exp.location} | ${exp.dates}\n`;
        exp.points.forEach((point: string) => {
          text += `• ${point}\n`;
        });
        text += "\n";
      });
    }

    if (data.projects.length > 0) {
      text += "PROJECTS\n";
      data.projects.forEach((proj: any) => {
        text += `${proj.title} | ${proj.technologies}\n`;
        text += `${proj.dates}\n`;
        proj.points.forEach((point: string) => {
          text += `• ${point}\n`;
        });
        text += "\n";
      });
    }

    if (data.skills.length > 0) {
      text += "TECHNICAL SKILLS\n";
      data.skills.forEach((skill: any) => {
        text += `${skill.name}: ${skill.skills}\n`;
      });
      text += "\n";
    }

    if (data.customSections.length > 0) {
      data.customSections.forEach((section: any) => {
        text += `${section.title.toUpperCase()}\n`;
        if (section.type === "text") {
          text += `${section.content}\n\n`;
        } else if (section.type === "skills") {
          text += `${section.content}\n\n`;
        } else if (section.type === "list") {
          section.items.forEach((item: any) => {
            text += `${item.title}`;
            if (item.subtitle) text += ` | ${item.subtitle}`;
            text += "\n";
            if (item.location || item.dates) {
              text += `${item.location || ""} | ${item.dates || ""}\n`;
            }
            item.points.forEach((point: string) => {
              text += `• ${point}\n`;
            });
            text += "\n";
          });
        }
      });
    }

    return text;
  };

  // Download handlers
  const handleDownloadPDF = async () => {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // Set PDF metadata
      pdf.setProperties({
        title: `${resumeData.personalInfo.name} - Resume`,
        subject: `Professional Resume for ${resumeData.personalInfo.name}`,
        author: resumeData.personalInfo.name,
        keywords: `resume, cv, ${resumeData.personalInfo.name}`,
        creator: "CVCraft Resume Builder",
      });

      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 40;
      let yPosition = margin + 20;

      // Helper function to check page break
      const checkPageBreak = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin + 20;
        }
      };

      // Header - Name
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      const nameWidth = pdf.getTextWidth(resumeData.personalInfo.name);
      pdf.text(
        resumeData.personalInfo.name,
        (pageWidth - nameWidth) / 2,
        yPosition
      );
      yPosition += 30;

      // Contact Information
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      const contactInfo = [
        resumeData.personalInfo.phone,
        resumeData.personalInfo.email,
        resumeData.personalInfo.linkedin,
        resumeData.personalInfo.github,
      ].filter(Boolean);

      const contactLine = contactInfo.join(" | ");
      const contactWidth = pdf.getTextWidth(contactLine);
      pdf.text(contactLine, (pageWidth - contactWidth) / 2, yPosition);
      yPosition += 30;

      // Sections
      if (resumeData.education.length > 0) {
        checkPageBreak(40);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.text("EDUCATION", margin, yPosition);
        yPosition += 20;

        resumeData.education.forEach((edu: any) => {
          checkPageBreak(30);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(10);
          pdf.text(`${edu.institution}, ${edu.location}`, margin, yPosition);
          yPosition += 15;

          pdf.setFont("helvetica", "normal");
          pdf.text(`${edu.degree}`, margin, yPosition);
          pdf.text(
            edu.dates,
            pageWidth - margin - pdf.getTextWidth(edu.dates),
            yPosition
          );
          yPosition += 25;
        });
      }

      if (resumeData.experience.length > 0) {
        checkPageBreak(40);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.text("EXPERIENCE", margin, yPosition);
        yPosition += 20;

        resumeData.experience.forEach((exp: any) => {
          checkPageBreak(50);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(10);
          pdf.text(`${exp.position} | ${exp.company}`, margin, yPosition);
          pdf.text(
            exp.dates,
            pageWidth - margin - pdf.getTextWidth(exp.dates),
            yPosition
          );
          yPosition += 15;

          pdf.setFont("helvetica", "normal");
          pdf.text(exp.location, margin, yPosition);
          yPosition += 15;

          exp.points.forEach((point: string) => {
            checkPageBreak(15);
            pdf.text(`• ${point}`, margin + 10, yPosition);
            yPosition += 15;
          });
          yPosition += 10;
        });
      }

      if (resumeData.projects.length > 0) {
        checkPageBreak(40);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.text("PROJECTS", margin, yPosition);
        yPosition += 20;

        resumeData.projects.forEach((proj: any) => {
          checkPageBreak(50);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(10);
          pdf.text(`${proj.title} | ${proj.technologies}`, margin, yPosition);
          pdf.text(
            proj.dates,
            pageWidth - margin - pdf.getTextWidth(proj.dates),
            yPosition
          );
          yPosition += 20;

          pdf.setFont("helvetica", "normal");
          proj.points.forEach((point: string) => {
            checkPageBreak(15);
            pdf.text(`• ${point}`, margin + 10, yPosition);
            yPosition += 15;
          });
          yPosition += 10;
        });
      }

      if (resumeData.skills.length > 0) {
        checkPageBreak(40);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.text("TECHNICAL SKILLS", margin, yPosition);
        yPosition += 20;

        resumeData.skills.forEach((skill: any) => {
          checkPageBreak(20);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(10);
          pdf.text(`${skill.name}:`, margin, yPosition);

          pdf.setFont("helvetica", "normal");
          pdf.text(
            skill.skills,
            margin + pdf.getTextWidth(`${skill.name}: `),
            yPosition
          );
          yPosition += 15;
        });
      }

      pdf.save(
        `${resumeData.personalInfo.name.replace(/\s+/g, "_")}_Resume.pdf`
      );

      toast({
        title: "PDF Downloaded",
        description: "Your resume has been downloaded as a PDF.",
      });
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-4xl font-bold text-slate-900">
              Dynamic Resume Builder
            </h1>
            <p className="text-slate-600 max-w-2xl">
              Create professional resumes with real-time preview, auto-save, and
              smart validation
            </p>
          </div>

          {/* Status Bar */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              {isSaving ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : lastSaved ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Saved {lastSaved.toLocaleTimeString()}
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Not saved
                </>
              )}
            </div>

            {/* Completion Progress */}
            <div className="flex items-center gap-2 min-w-[120px]">
              <span className="text-sm text-slate-600">Complete:</span>
              <Progress value={completionPercentage} className="w-16" />
              <span className="text-sm font-medium text-slate-700">
                {completionPercentage}%
              </span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Resume Editor</h2>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsAutoSaveEnabled(!isAutoSaveEnabled)}
                    variant={isAutoSaveEnabled ? "default" : "outline"}
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Auto-Save {isAutoSaveEnabled ? "On" : "Off"}
                  </Button>
                  <Button
                    onClick={saveToLocalStorage}
                    variant="outline"
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Now
                  </Button>
                  <Button
                    onClick={handleDownloadLatex}
                    variant="outline"
                    size="sm"
                  >
                    <FileCode className="h-4 w-4 mr-2" />
                    Download LaTeX
                  </Button>
                </div>
              </div>

              {/* Personal Information Section */}
              <Collapsible
                open={sectionStates.personalInfo}
                onOpenChange={() => toggleSection("personalInfo")}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-2 h-auto"
                  >
                    <h3 className="text-lg font-semibold">
                      Personal Information
                    </h3>
                    {sectionStates.personalInfo ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={resumeData.personalInfo.name}
                        onChange={(e) =>
                          updatePersonalInfo("name", e.target.value)
                        }
                        className={
                          validationErrors.name ? "border-red-500" : ""
                        }
                      />
                      {validationErrors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {validationErrors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) =>
                          updatePersonalInfo("phone", e.target.value)
                        }
                        className={
                          validationErrors.phone ? "border-red-500" : ""
                        }
                      />
                      {validationErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {validationErrors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) =>
                          updatePersonalInfo("email", e.target.value)
                        }
                        className={
                          validationErrors.email ? "border-red-500" : ""
                        }
                      />
                      {validationErrors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {validationErrors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={resumeData.personalInfo.linkedin}
                        onChange={(e) =>
                          updatePersonalInfo("linkedin", e.target.value)
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        value={resumeData.personalInfo.github}
                        onChange={(e) =>
                          updatePersonalInfo("github", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Education Section */}
              <Collapsible
                open={sectionStates.education}
                onOpenChange={() => toggleSection("education")}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-2 h-auto"
                  >
                    <h3 className="text-lg font-semibold">Education</h3>
                    {sectionStates.education ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-600">
                      Add your educational background
                    </p>
                    <Button onClick={addEducation} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                  {resumeData.education.map((edu: EducationItem) => (
                    <div
                      key={edu.id}
                      className="p-4 border rounded-lg space-y-3 bg-slate-50 transition-all duration-200 hover:bg-slate-100"
                    >
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                          <div>
                            <Label>Institution</Label>
                            <Input
                              value={edu.institution}
                              onChange={(e) =>
                                updateEducation(
                                  edu.id,
                                  "institution",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Location</Label>
                            <Input
                              value={edu.location}
                              onChange={(e) =>
                                updateEducation(
                                  edu.id,
                                  "location",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Degree</Label>
                            <Input
                              value={edu.degree}
                              onChange={(e) =>
                                updateEducation(
                                  edu.id,
                                  "degree",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Dates</Label>
                            <Input
                              value={edu.dates}
                              onChange={(e) =>
                                updateEducation(edu.id, "dates", e.target.value)
                              }
                              placeholder="Aug. 2018 -- May 2021"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() => removeEducation(edu.id)}
                          variant="ghost"
                          size="sm"
                          className="ml-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Experience Section */}
              <Collapsible
                open={sectionStates.experience}
                onOpenChange={() => toggleSection("experience")}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-2 h-auto"
                  >
                    <h3 className="text-lg font-semibold">Experience</h3>
                    {sectionStates.experience ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-600">
                      Add your work experience
                    </p>
                    <Button onClick={addExperience} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                  {resumeData.experience.map((exp: any) => (
                    <div
                      key={exp.id}
                      className="p-4 border rounded-lg space-y-3 bg-slate-50 transition-all duration-200 hover:bg-slate-100"
                    >
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                          <div>
                            <Label>Position</Label>
                            <Input
                              value={exp.position}
                              onChange={(e) =>
                                updateExperience(
                                  exp.id,
                                  "position",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Company</Label>
                            <Input
                              value={exp.company}
                              onChange={(e) =>
                                updateExperience(
                                  exp.id,
                                  "company",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Location</Label>
                            <Input
                              value={exp.location}
                              onChange={(e) =>
                                updateExperience(
                                  exp.id,
                                  "location",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Dates</Label>
                            <Input
                              value={exp.dates}
                              onChange={(e) =>
                                updateExperience(
                                  exp.id,
                                  "dates",
                                  e.target.value
                                )
                              }
                              placeholder="June 2021 -- Present"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() => removeExperience(exp.id)}
                          variant="ghost"
                          size="sm"
                          className="ml-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Achievements</Label>
                          <Button
                            onClick={() => addExperiencePoint(exp.id)}
                            variant="outline"
                            size="sm"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Point
                          </Button>
                        </div>
                        {exp.points.map((point: string, idx: number) => (
                          <div key={idx} className="flex gap-2">
                            <Textarea
                              value={point}
                              onChange={(e) =>
                                updateExperiencePoint(
                                  exp.id,
                                  idx,
                                  e.target.value
                                )
                              }
                              className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                              rows={2}
                            />
                            <Button
                              onClick={() => removeExperiencePoint(exp.id, idx)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Projects Section */}
              <Collapsible
                open={sectionStates.projects}
                onOpenChange={() => toggleSection("projects")}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-2 h-auto"
                  >
                    <h3 className="text-lg font-semibold">Projects</h3>
                    {sectionStates.projects ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-600">
                      Showcase your projects
                    </p>
                    <Button onClick={addProject} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                  {resumeData.projects.map((proj: any) => (
                    <div
                      key={proj.id}
                      className="p-4 border rounded-lg space-y-3 bg-slate-50 transition-all duration-200 hover:bg-slate-100"
                    >
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                          <div>
                            <Label>Project Title</Label>
                            <Input
                              value={proj.title}
                              onChange={(e) =>
                                updateProject(proj.id, "title", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label>Technologies</Label>
                            <Input
                              value={proj.technologies}
                              onChange={(e) =>
                                updateProject(
                                  proj.id,
                                  "technologies",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Dates</Label>
                            <Input
                              value={proj.dates}
                              onChange={(e) =>
                                updateProject(proj.id, "dates", e.target.value)
                              }
                              placeholder="Jan 2024 -- Present"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() => removeProject(proj.id)}
                          variant="ghost"
                          size="sm"
                          className="ml-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Project Details</Label>
                          <Button
                            onClick={() => addProjectPoint(proj.id)}
                            variant="outline"
                            size="sm"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Detail
                          </Button>
                        </div>
                        {proj.points.map((point: string, idx: number) => (
                          <div key={idx} className="flex gap-2">
                            <Textarea
                              value={point}
                              onChange={(e) =>
                                updateProjectPoint(proj.id, idx, e.target.value)
                              }
                              className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                              rows={2}
                            />
                            <Button
                              onClick={() => removeProjectPoint(proj.id, idx)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Skills Section */}
              <Collapsible
                open={sectionStates.skills}
                onOpenChange={() => toggleSection("skills")}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-2 h-auto"
                  >
                    <h3 className="text-lg font-semibold">Skills</h3>
                    {sectionStates.skills ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-600">
                      Organize your skills by category
                    </p>
                    <Button onClick={addSkill} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skill Category
                    </Button>
                  </div>
                  {resumeData.skills.map((skill: any) => (
                    <div
                      key={skill.id}
                      className="p-4 border rounded-lg space-y-3 bg-slate-50 transition-all duration-200 hover:bg-slate-100"
                    >
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-1 gap-3 flex-1">
                          <div>
                            <Label>Category Name</Label>
                            <Input
                              value={skill.name}
                              onChange={(e) =>
                                updateSkill(skill.id, "name", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label>Skills (comma-separated)</Label>
                            <Textarea
                              value={skill.skills}
                              onChange={(e) =>
                                updateSkill(skill.id, "skills", e.target.value)
                              }
                              rows={2}
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() => removeSkill(skill.id)}
                          variant="ghost"
                          size="sm"
                          className="ml-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Custom Sections */}
              <Collapsible
                open={sectionStates.customSections}
                onOpenChange={() => toggleSection("customSections")}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-2 h-auto"
                  >
                    <h3 className="text-lg font-semibold">Custom Sections</h3>
                    {sectionStates.customSections ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-600">
                      Add custom sections to your resume
                    </p>
                    <Button
                      onClick={addCustomSection}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Custom Section
                    </Button>
                  </div>
                  {resumeData.customSections.map((section: any) => (
                    <div
                      key={section.id}
                      className="p-4 border rounded-lg space-y-3 bg-slate-50 transition-all duration-200 hover:bg-slate-100"
                    >
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-1 gap-3 flex-1">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Section Title</Label>
                              <Input
                                value={section.title}
                                onChange={(e) =>
                                  updateCustomSection(
                                    section.id,
                                    "title",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>Section Type</Label>
                              <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={section.type}
                                onChange={(e) =>
                                  updateCustomSection(
                                    section.id,
                                    "type",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="list">List Format</option>
                                <option value="text">Text Block</option>
                                <option value="skills">Skills Format</option>
                              </select>
                            </div>
                          </div>

                          {section.type === "text" && (
                            <div>
                              <Label>Content</Label>
                              <Textarea
                                value={section.content}
                                onChange={(e) =>
                                  updateCustomSection(
                                    section.id,
                                    "content",
                                    e.target.value
                                  )
                                }
                                rows={4}
                                placeholder="Enter your content here..."
                              />
                            </div>
                          )}

                          {section.type === "skills" && (
                            <div>
                              <Label>Skills Content</Label>
                              <Textarea
                                value={section.content}
                                onChange={(e) =>
                                  updateCustomSection(
                                    section.id,
                                    "content",
                                    e.target.value
                                  )
                                }
                                rows={3}
                                placeholder="Category: Skill1, Skill2, Skill3"
                              />
                            </div>
                          )}

                          {section.type === "list" && (
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <Label>List Items</Label>
                                <Button
                                  onClick={() =>
                                    addCustomSectionItem(section.id)
                                  }
                                  variant="outline"
                                  size="sm"
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add Item
                                </Button>
                              </div>
                              {section.items.map((item: any) => (
                                <div
                                  key={item.id}
                                  className="p-3 border rounded bg-white space-y-2"
                                >
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <Label className="text-xs">Title</Label>
                                      <Input
                                        value={item.title}
                                        onChange={(e) =>
                                          updateCustomSectionItem(
                                            section.id,
                                            item.id,
                                            "title",
                                            e.target.value
                                          )
                                        }
                                        className="text-sm"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">
                                        Subtitle (optional)
                                      </Label>
                                      <Input
                                        value={item.subtitle}
                                        onChange={(e) =>
                                          updateCustomSectionItem(
                                            section.id,
                                            item.id,
                                            "subtitle",
                                            e.target.value
                                          )
                                        }
                                        className="text-sm"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">
                                        Dates (optional)
                                      </Label>
                                      <Input
                                        value={item.dates}
                                        onChange={(e) =>
                                          updateCustomSectionItem(
                                            section.id,
                                            item.id,
                                            "dates",
                                            e.target.value
                                          )
                                        }
                                        className="text-sm"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">
                                        Location (optional)
                                      </Label>
                                      <Input
                                        value={item.location}
                                        onChange={(e) =>
                                          updateCustomSectionItem(
                                            section.id,
                                            item.id,
                                            "location",
                                            e.target.value
                                          )
                                        }
                                        className="text-sm"
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <Label className="text-xs">Details</Label>
                                      <div className="flex gap-1">
                                        <Button
                                          onClick={() =>
                                            addCustomSectionItemPoint(
                                              section.id,
                                              item.id
                                            )
                                          }
                                          variant="outline"
                                          size="sm"
                                          className="text-xs h-6 px-2"
                                        >
                                          <Plus className="h-2 w-2 mr-1" />
                                          Add
                                        </Button>
                                        <Button
                                          onClick={() =>
                                            removeCustomSectionItem(
                                              section.id,
                                              item.id
                                            )
                                          }
                                          variant="ghost"
                                          size="sm"
                                          className="text-xs h-6 px-2 text-red-600 hover:text-red-700"
                                        >
                                          <Trash2 className="h-2 w-2" />
                                        </Button>
                                      </div>
                                    </div>
                                    {item.points.map(
                                      (point: string, idx: number) => (
                                        <div key={idx} className="flex gap-1">
                                          <Textarea
                                            value={point}
                                            onChange={(e) =>
                                              updateCustomSectionItemPoint(
                                                section.id,
                                                item.id,
                                                idx,
                                                e.target.value
                                              )
                                            }
                                            className="flex-1 text-xs"
                                            rows={1}
                                          />
                                          <Button
                                            onClick={() =>
                                              removeCustomSectionItemPoint(
                                                section.id,
                                                item.id,
                                                idx
                                              )
                                            }
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => removeCustomSection(section.id)}
                          variant="ghost"
                          size="sm"
                          className="ml-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* ATS Analysis Section */}
              <Card className="p-4 border-2 border-blue-200 bg-blue-50">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  ATS Score & Analysis
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="jobDescription">Job Description</Label>
                    <Textarea
                      id="jobDescription"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here to get ATS analysis and suggestions..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={analyzeResumeATS}
                      disabled={isAnalyzing || !jobDescription.trim()}
                      className="flex items-center gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <Clock className="h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          Analyze Resume
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open("/analysis", "_blank")}
                      className="flex items-center gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      Detailed Analysis
                    </Button>
                  </div>

                  {atsScore !== null && (
                    <div className="p-3 bg-white rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">ATS Score</span>
                        <span
                          className={`text-lg font-bold ${
                            atsScore >= 80
                              ? "text-green-600"
                              : atsScore >= 60
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {atsScore}/100
                        </span>
                      </div>
                      <Progress value={atsScore} className="h-2" />
                    </div>
                  )}

                  {suggestions.length > 0 && (
                    <div className="p-3 bg-white rounded-lg border">
                      <h4 className="font-semibold mb-2">
                        Suggestions for Improvement
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Resume Preview</h2>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setShowPageBreaks(!showPageBreaks)}
                    variant="outline"
                    size="sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {showPageBreaks ? "Hide" : "Show"} Page Breaks
                  </Button>
                  <Button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>

              {/* Live Preview with Page Breaks */}
              <div className="border rounded-lg bg-gray-100 shadow-sm relative flex justify-center py-8">
                <div
                  ref={previewRef}
                  className="bg-white shadow-lg relative overflow-hidden"
                  style={{
                    width: `${A4_WIDTH_PX}px`,
                    minHeight: `${A4_HEIGHT_PX}px`,
                    padding: `${MARGIN_PX}px`,
                  }}
                >
                  {/* Page break indicators */}
                  {showPageBreaks &&
                    pageBreaks.map((breakPoint, index) => (
                      <div key={index}>
                        {/* Page break line */}
                        <div
                          className="absolute left-0 right-0 border-t-2 border-dashed border-red-500 z-10"
                          style={{ top: `${breakPoint - MARGIN_PX}px` }}
                        >
                          <div className="absolute -top-6 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                            Page Break
                          </div>
                        </div>
                        {/* Page indicator */}
                        <div
                          className="absolute right-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium z-10"
                          style={{ top: `${breakPoint - MARGIN_PX + 10}px` }}
                        >
                          Page {index + 2}
                        </div>
                      </div>
                    ))}

                  {/* Page 1 indicator */}
                  {showPageBreaks && (
                    <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium z-10">
                      Page 1
                    </div>
                  )}

                  {/* Header */}
                  <div className="resume-section text-center border-b pb-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {resumeData.personalInfo.name || "Your Name"}
                    </h1>
                    <div className="flex justify-center items-center gap-2 mt-2 text-sm text-gray-600 flex-wrap">
                      {resumeData.personalInfo.phone && (
                        <span>{resumeData.personalInfo.phone}</span>
                      )}
                      {resumeData.personalInfo.phone &&
                        resumeData.personalInfo.email && <span>|</span>}
                      {resumeData.personalInfo.email && (
                        <span>{resumeData.personalInfo.email}</span>
                      )}
                      {(resumeData.personalInfo.email ||
                        resumeData.personalInfo.phone) &&
                        resumeData.personalInfo.linkedin && <span>|</span>}
                      {resumeData.personalInfo.linkedin && (
                        <span>{resumeData.personalInfo.linkedin}</span>
                      )}
                      {resumeData.personalInfo.linkedin &&
                        resumeData.personalInfo.github && <span>|</span>}
                      {resumeData.personalInfo.github && (
                        <span>{resumeData.personalInfo.github}</span>
                      )}
                    </div>
                  </div>

                  {/* Education */}
                  {resumeData.education.length > 0 && (
                    <div className="resume-section">
                      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                        EDUCATION
                      </h2>
                      {resumeData.education.map((edu: any) => (
                        <div key={edu.id} className="mb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">
                                {edu.institution}
                              </h3>
                              <p className="text-gray-700">{edu.degree}</p>
                            </div>
                            <div className="text-right text-sm text-gray-600">
                              <p>{edu.location}</p>
                              <p>{edu.dates}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Experience */}
                  {resumeData.experience.length > 0 && (
                    <div className="resume-section">
                      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                        EXPERIENCE
                      </h2>
                      {resumeData.experience.map((exp: any) => (
                        <div key={exp.id} className="mb-4">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h3 className="font-semibold">{exp.position}</h3>
                              <p className="text-gray-700">{exp.company}</p>
                            </div>
                            <div className="text-right text-sm text-gray-600">
                              <p>{exp.location}</p>
                              <p>{exp.dates}</p>
                            </div>
                          </div>
                          <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                            {exp.points.map((point: string, idx: number) => (
                              <li key={idx}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Projects */}
                  {resumeData.projects.length > 0 && (
                    <div className="resume-section">
                      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                        PROJECTS
                      </h2>
                      {resumeData.projects.map((proj: any) => (
                        <div key={proj.id} className="mb-4">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h3 className="font-semibold">{proj.title}</h3>
                              <p className="text-gray-700 text-sm">
                                {proj.technologies}
                              </p>
                            </div>
                            <div className="text-right text-sm text-gray-600">
                              <p>{proj.dates}</p>
                            </div>
                          </div>
                          <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                            {proj.points.map((point: string, idx: number) => (
                              <li key={idx}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {resumeData.skills.length > 0 && (
                    <div className="resume-section">
                      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                        TECHNICAL SKILLS
                      </h2>
                      {resumeData.skills.map((skill: any) => (
                        <div key={skill.id} className="mb-2">
                          <p className="text-sm">
                            <span className="font-semibold">{skill.name}:</span>{" "}
                            {skill.skills}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Custom Sections */}
                  {resumeData.customSections.map((section: any) => (
                    <div key={section.id} className="resume-section">
                      <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                        {section.title.toUpperCase()}
                      </h2>

                      {section.type === "text" && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {section.content}
                          </p>
                        </div>
                      )}

                      {section.type === "skills" && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-700">
                            {section.content}
                          </p>
                        </div>
                      )}

                      {section.type === "list" && section.items.length > 0 && (
                        <div>
                          {section.items.map((item: any) => (
                            <div key={item.id} className="mb-4">
                              <div className="flex justify-between items-start mb-1">
                                <div>
                                  <h3 className="font-semibold">
                                    {item.title}
                                  </h3>
                                  {item.subtitle && (
                                    <p className="text-gray-700 text-sm">
                                      {item.subtitle}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right text-sm text-gray-600">
                                  {item.location && <p>{item.location}</p>}
                                  {item.dates && <p>{item.dates}</p>}
                                </div>
                              </div>
                              {item.points && item.points.length > 0 && (
                                <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                                  {item.points.map(
                                    (point: string, idx: number) => (
                                      <li key={idx}>{point}</li>
                                    )
                                  )}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
