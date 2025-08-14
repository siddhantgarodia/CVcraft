"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// Icons
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Download,
  Upload,
  Type,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  FileText,
  Eye,
} from "lucide-react";

// Utilities and Data
import jsPDF from "jspdf";

// Local types for builder-specific data structure
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

interface BuilderResumeData {
  personalInfo: PersonalInfo;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  customSections: CustomSection[];
}

export default function BuilderPage() {
  // Core state
  const [resumeData, setResumeData] = useState<BuilderResumeData>({
    personalInfo: { name: "", phone: "", email: "", linkedin: "", github: "" },
    education: [],
    experience: [],
    projects: [],
    skills: [],
    customSections: [],
  });
  const [latexCode, setLatexCode] = useState("");
  const [useCustomLatex, setUseCustomLatex] = useState(false);
  const [sectionOrder, setSectionOrder] = useState([
    "education",
    "experience",
    "projects",
    "skills",
    "customSections",
  ]);

  // UI state
  const [activeTab, setActiveTab] = useState("personal");
  const [previewZoom, setPreviewZoom] = useState(0.8);
  const [panelRatio, setPanelRatio] = useState(50); // Editor width percentage
  const [fontFamily, setFontFamily] = useState("Inter");
  const [baseFontSize, setBaseFontSize] = useState(14);
  const [sectionSizes, setSectionSizes] = useState<Record<string, number>>({});

  // Utility state
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Refs
  const latexFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // DnD setup
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // LaTeX generation effect
  useEffect(() => {
    if (useCustomLatex) return;
    const latex = generateLatexCode(resumeData, sectionOrder);
    setLatexCode(latex);
  }, [resumeData, sectionOrder, useCustomLatex]);

  // LaTeX generation function
  const generateLatexCode = (data: BuilderResumeData, order: string[]) => {
    const escapeLatex = (text: string) => {
      return text
        .replace(/\\/g, "\\textbackslash ")
        .replace(/[{}]/g, "\\$&")
        .replace(/[#$%&_]/g, "\\$&")
        .replace(/\^/g, "\\textasciicircum ")
        .replace(/~/g, "\\textasciitilde ");
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

\\newcommand{\\resumeItem}[2]{
  \\item\\small{
    \\textbf{#1}{: #2 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\newcommand{\\resumeSubItem}[2]{\\resumeItem{#1}{#2}\\vspace{-4pt}}

\\renewcommand{\\labelitemii}{$\\circ$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=*]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

%----------HEADING-----------------
\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{\\href{}{\\Large ${escapeLatex(
    data.personalInfo.name || "Your Name"
  )}}} & Email: \\href{mailto:${escapeLatex(
      data.personalInfo.email
    )}}{${escapeLatex(data.personalInfo.email)}} \\\\
  ${
    data.personalInfo.phone
      ? `& ${escapeLatex(data.personalInfo.phone)} \\\\`
      : ""
  }
  ${
    data.personalInfo.linkedin
      ? `& \\href{${escapeLatex(data.personalInfo.linkedin)}}{${escapeLatex(
          data.personalInfo.linkedin
        )}} \\\\`
      : ""
  }
  ${
    data.personalInfo.github
      ? `& \\href{${escapeLatex(data.personalInfo.github)}}{${escapeLatex(
          data.personalInfo.github
        )}} \\\\`
      : ""
  }
\\end{tabular*}

`;

    // Generate sections in order
    order.forEach((sectionId) => {
      if (sectionId === "education" && data.education.length > 0) {
        latex += `%-----------EDUCATION-----------------
\\section{Education}
  \\resumeSubHeadingListStart
`;
        data.education.forEach((edu) => {
          latex += `    \\resumeSubheading
      {${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}
      {${escapeLatex(edu.degree)}}{${escapeLatex(edu.dates)}}
`;
        });
        latex += `  \\resumeSubHeadingListEnd

`;
      }

      if (sectionId === "experience" && data.experience.length > 0) {
        latex += `%-----------EXPERIENCE-----------------
\\section{Experience}
  \\resumeSubHeadingListStart
`;
        data.experience.forEach((exp) => {
          latex += `    \\resumeSubheading
      {${escapeLatex(exp.position)}}{${escapeLatex(exp.location)}}
      {${escapeLatex(exp.company)}}{${escapeLatex(exp.dates)}}
      \\resumeItemListStart
`;
          exp.points
            .filter((point) => point.trim())
            .forEach((point) => {
              latex += `        \\resumeItem{}{${escapeLatex(point)}}
`;
            });
          latex += `      \\resumeItemListEnd
`;
        });
        latex += `  \\resumeSubHeadingListEnd

`;
      }

      if (sectionId === "projects" && data.projects.length > 0) {
        latex += `%-----------PROJECTS-----------------
\\section{Projects}
  \\resumeSubHeadingListStart
`;
        data.projects.forEach((proj) => {
          latex += `    \\resumeSubheading
      {${escapeLatex(proj.title)}}{${escapeLatex(proj.dates)}}
      {${escapeLatex(proj.technologies)}}{}
`;
        });
        latex += `  \\resumeSubHeadingListEnd

`;
      }

      if (sectionId === "skills" && data.skills.length > 0) {
        latex += `%-----------SKILLS-----------------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=*]
`;
        data.skills.forEach((skill) => {
          latex += `    \\small{\\item{
     \\textbf{${escapeLatex(skill.name)}}{: ${escapeLatex(skill.skills)}}
    }}
`;
        });
        latex += ` \\end{itemize}

`;
      }
    });

    latex += `\\end{document}`;
    return latex;
  };

  // Auto-save effect
  useEffect(() => {
    const saveData = {
      resumeData,
      sectionOrder,
      fontFamily,
      baseFontSize,
      sectionSizes,
      previewZoom,
      panelRatio,
    };
    localStorage.setItem("cvcraft-builder-data", JSON.stringify(saveData));
    setLastSaved(new Date());
  }, [
    resumeData,
    sectionOrder,
    fontFamily,
    baseFontSize,
    sectionSizes,
    previewZoom,
    panelRatio,
  ]);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem("cvcraft-builder-data");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.resumeData) setResumeData(data.resumeData);
        if (data.sectionOrder) setSectionOrder(data.sectionOrder);
        if (data.fontFamily) setFontFamily(data.fontFamily);
        if (data.baseFontSize) setBaseFontSize(data.baseFontSize);
        if (data.sectionSizes) setSectionSizes(data.sectionSizes);
        if (data.previewZoom) setPreviewZoom(data.previewZoom);
        if (data.panelRatio) setPanelRatio(data.panelRatio);
      } catch (error) {
        console.error("Failed to load saved data:", error);
      }
    }
  }, []);

  // Handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSectionOrder((items) => {
      const oldIndex = items.indexOf(String(active.id));
      const newIndex = items.indexOf(String(over.id));
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const getSectionScale = (sectionId: string): number => {
    return sectionSizes[sectionId] || 1;
  };

  const resetAllSizes = () => {
    setSectionSizes({});
  };

  // Personal Info handlers
  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  // Education handlers
  const addEducation = () => {
    const newEducation: EducationItem = {
      id: `edu${Date.now()}`,
      institution: "",
      location: "",
      degree: "",
      dates: "",
    };
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  // Experience handlers
  const addExperience = () => {
    const newExperience: ExperienceItem = {
      id: `exp${Date.now()}`,
      position: "",
      company: "",
      location: "",
      dates: "",
      points: [""],
    };
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }));
  };

  const updateExperience = (
    id: string,
    field: string,
    value: string | string[]
  ) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const addExperiencePoint = (expId: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === expId ? { ...exp, points: [...exp.points, ""] } : exp
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
      experience: prev.experience.map((exp) =>
        exp.id === expId
          ? {
              ...exp,
              points: exp.points.map((point, index) =>
                index === pointIndex ? value : point
              ),
            }
          : exp
      ),
    }));
  };

  const removeExperiencePoint = (expId: string, pointIndex: number) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === expId
          ? {
              ...exp,
              points: exp.points.filter((_, index) => index !== pointIndex),
            }
          : exp
      ),
    }));
  };

  // Project handlers (similar pattern)
  const addProject = () => {
    const newProject: ProjectItem = {
      id: `proj${Date.now()}`,
      title: "",
      technologies: "",
      dates: "",
      points: [""],
    };
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const updateProject = (
    id: string,
    field: string,
    value: string | string[]
  ) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const removeProject = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  };

  // Skills handlers
  const addSkill = () => {
    const newSkill: SkillItem = {
      id: `skill${Date.now()}`,
      name: "",
      skills: "",
    };
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  const updateSkill = (id: string, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const removeSkill = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== id),
    }));
  };

  // Custom Section handlers
  const addCustomSection = () => {
    const newCustomSection: CustomSection = {
      id: `custom${Date.now()}`,
      title: "",
      type: "text",
      content: "",
      items: [],
    };
    setResumeData((prev) => ({
      ...prev,
      customSections: [...prev.customSections, newCustomSection],
    }));
  };

  const updateCustomSection = (
    id: string,
    field: string,
    value: string | "text" | "list" | "skills"
  ) => {
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      ),
    }));
  };

  const removeCustomSection = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter(
        (section) => section.id !== id
      ),
    }));
  };

  const addCustomSectionItem = (sectionId: string) => {
    const newItem: CustomSectionItem = {
      id: `item${Date.now()}`,
      title: "",
      subtitle: "",
      location: "",
      dates: "",
      points: [],
    };
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section) =>
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
    value: string | string[]
  ) => {
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
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
      customSections: prev.customSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.filter((item) => item.id !== itemId),
            }
          : section
      ),
    }));
  };

  // File handlers
  const handleUploadLatexClick = () => {
    latexFileInputRef.current?.click();
  };

  const handleLatexFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setLatexCode(text);
      setUseCustomLatex(true);
      toast({
        title: "LaTeX uploaded successfully",
        description:
          "You can now edit the LaTeX code or switch back to generated mode.",
      });
    } catch {
      toast({
        title: "Upload failed",
        description: "Failed to read the LaTeX file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadLatex = () => {
    const blob = new Blob([latexCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resumeData.personalInfo.name || "resume"}.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Simple PDF generation
      const pdf = new jsPDF();
      pdf.text("Resume PDF Generation", 20, 20);
      pdf.text("This is a placeholder. Implement full PDF generation.", 20, 40);
      pdf.save(`${resumeData.personalInfo.name || "resume"}.pdf`);

      toast({
        title: "PDF exported successfully",
        description: "Your resume has been downloaded.",
      });
    } catch {
      toast({
        title: "Export failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-indigo-50">
      {/* Top Navigation with Compact Button Bar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-rose-200/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-3">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-rose-700 hover:text-rose-900 hover:bg-rose-100"
              >
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent">
                  Resume Builder
                </h1>
                <p className="text-sm text-rose-500">
                  Create beautiful resumes with ease
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-xs text-rose-600">
                {lastSaved && (
                  <div className="flex items-center gap-1">
                    <Save className="h-3 w-3" />
                    Saved {lastSaved.toLocaleTimeString()}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100"
              >
                <Link href="/analysis">
                  <Eye className="h-4 w-4 mr-2" />
                  Analysis
                </Link>
              </Button>
              <Button
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                {isGeneratingPDF ? "Generating..." : "Export PDF"}
              </Button>
            </div>
          </div>

          {/* Compact Button Toolbar */}
          <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-rose-100/60 via-blue-100/60 to-indigo-100/60 rounded-xl border border-rose-200/50">
            {/* File Operations */}
            <div className="flex items-center gap-1 bg-white/70 rounded-lg px-3 py-2 shadow-sm">
              <Button
                onClick={handleUploadLatexClick}
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs text-rose-700 hover:bg-rose-100"
              >
                <Upload className="h-3 w-3 mr-1" />
                Upload
              </Button>
              <Button
                onClick={handleDownloadLatex}
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs text-indigo-700 hover:bg-indigo-100"
              >
                <FileText className="h-3 w-3 mr-1" />
                LaTeX
              </Button>
              {useCustomLatex && (
                <Button
                  onClick={() => setUseCustomLatex(false)}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-xs text-amber-700 hover:bg-amber-100"
                >
                  Use Generated
                </Button>
              )}
            </div>

            {/* Typography Controls */}
            <div className="flex items-center gap-2 bg-white/70 rounded-lg px-3 py-2 shadow-sm">
              <Type className="h-4 w-4 text-blue-600" />
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="text-xs border-0 bg-transparent focus:outline-none text-blue-700"
              >
                <option value="Inter">Inter</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times</option>
                <option value="Arial">Arial</option>
              </select>
              <input
                type="number"
                min="10"
                max="20"
                value={baseFontSize}
                onChange={(e) => setBaseFontSize(Number(e.target.value))}
                className="w-12 text-xs border-0 bg-transparent focus:outline-none text-center text-blue-700"
              />
            </div>

            {/* Preview Controls */}
            <div className="flex items-center gap-1 bg-white/70 rounded-lg px-3 py-2 shadow-sm">
              <Button
                onClick={() => setPreviewZoom(Math.max(0.5, previewZoom - 0.1))}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-emerald-700 hover:bg-emerald-100"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-xs font-medium text-emerald-700 min-w-[45px] text-center">
                {Math.round(previewZoom * 100)}%
              </span>
              <Button
                onClick={() => setPreviewZoom(Math.min(1.5, previewZoom + 0.1))}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-emerald-700 hover:bg-emerald-100"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
              <Button
                onClick={resetAllSizes}
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-emerald-700 hover:bg-emerald-100"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            </div>

            {/* Section Order */}
            <div className="flex items-center gap-2 bg-white/70 rounded-lg px-3 py-2 shadow-sm">
              <GripVertical className="h-4 w-4 text-orange-600" />
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sectionOrder}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex gap-1">
                    {sectionOrder.map((secId, index) => (
                      <SortableChip key={secId} id={secId}>
                        <span className="text-xs font-medium">
                          {index + 1}.{secId.charAt(0).toUpperCase()}
                        </span>
                      </SortableChip>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* Layout Controls */}
            <div className="flex items-center gap-1 bg-white/70 rounded-lg px-3 py-2 shadow-sm">
              <Eye className="h-4 w-4 text-violet-600" />
              <Button
                onClick={() => setPanelRatio(Math.max(30, panelRatio - 5))}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-violet-700 hover:bg-violet-100"
              >
                ←
              </Button>
              <span className="text-xs text-violet-700 min-w-[35px] text-center">
                {panelRatio}%
              </span>
              <Button
                onClick={() => setPanelRatio(Math.min(70, panelRatio + 5))}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-violet-700 hover:bg-violet-100"
              >
                →
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6 h-[calc(100vh-180px)]">
          {/* Editor Panel */}
          <div
            className="bg-white/80 backdrop-blur-lg rounded-2xl border border-rose-200/50 shadow-2xl overflow-hidden transition-all duration-300"
            style={{ width: `${panelRatio}%` }}
          >
            {/* Editor Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-rose-200/50 bg-gradient-to-r from-rose-50/80 via-blue-50/80 to-indigo-50/80">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-rose-700 to-indigo-700 bg-clip-text text-transparent">
                Content Editor
              </h2>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-xs bg-rose-100 text-rose-700"
                >
                  {useCustomLatex ? "Custom LaTeX" : "Form Mode"}
                </Badge>
              </div>
            </div>

            {/* Editor Content */}
            <div className="h-full overflow-y-auto">
              {useCustomLatex ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-purple-900">
                      Custom LaTeX Editor
                    </h3>
                    <Button
                      onClick={() => setUseCustomLatex(false)}
                      variant="outline"
                      size="sm"
                    >
                      Switch to Forms
                    </Button>
                  </div>
                  <Textarea
                    value={latexCode}
                    onChange={(e) => setLatexCode(e.target.value)}
                    className="min-h-[600px] font-mono text-sm"
                    placeholder="Edit your LaTeX code here..."
                  />
                </div>
              ) : (
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="h-full"
                >
                  <TabsList className="grid w-full grid-cols-6 bg-gradient-to-r from-rose-100/70 via-blue-100/70 to-indigo-100/70 m-6 mb-0 border border-rose-200/50">
                    <TabsTrigger
                      value="personal"
                      className="data-[state=active]:bg-rose-200/70 data-[state=active]:text-rose-800"
                    >
                      Personal
                    </TabsTrigger>
                    <TabsTrigger
                      value="education"
                      className="data-[state=active]:bg-blue-200/70 data-[state=active]:text-blue-800"
                    >
                      Education
                    </TabsTrigger>
                    <TabsTrigger
                      value="experience"
                      className="data-[state=active]:bg-indigo-200/70 data-[state=active]:text-indigo-800"
                    >
                      Experience
                    </TabsTrigger>
                    <TabsTrigger
                      value="projects"
                      className="data-[state=active]:bg-emerald-200/70 data-[state=active]:text-emerald-800"
                    >
                      Projects
                    </TabsTrigger>
                    <TabsTrigger
                      value="skills"
                      className="data-[state=active]:bg-violet-200/70 data-[state=active]:text-violet-800"
                    >
                      Skills
                    </TabsTrigger>
                    <TabsTrigger
                      value="custom"
                      className="data-[state=active]:bg-emerald-200/70 data-[state=active]:text-emerald-800"
                    >
                      Custom Sections
                    </TabsTrigger>
                  </TabsList>

                  <div className="p-6 space-y-6">
                    {/* Personal Info Tab */}
                    <TabsContent value="personal" className="space-y-4 mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={resumeData.personalInfo.name}
                            onChange={(e) =>
                              updatePersonalInfo("name", e.target.value)
                            }
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={resumeData.personalInfo.phone}
                            onChange={(e) =>
                              updatePersonalInfo("phone", e.target.value)
                            }
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={resumeData.personalInfo.email}
                            onChange={(e) =>
                              updatePersonalInfo("email", e.target.value)
                            }
                            placeholder="you@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={resumeData.personalInfo.linkedin}
                            onChange={(e) =>
                              updatePersonalInfo("linkedin", e.target.value)
                            }
                            placeholder="linkedin.com/in/yourprofile"
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
                            placeholder="github.com/yourusername"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    {/* Education Tab */}
                    <TabsContent value="education" className="space-y-4 mt-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Education</h3>
                        <Button onClick={addEducation} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Education
                        </Button>
                      </div>
                      {resumeData.education.map((edu) => (
                        <Card
                          key={edu.id}
                          className="p-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-blue-800">
                              Education Entry
                            </h4>
                            <Button
                              onClick={() => removeEducation(edu.id)}
                              variant="ghost"
                              size="sm"
                              className="text-rose-600 hover:text-rose-700 hover:bg-rose-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                placeholder="University name"
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
                                placeholder="City, State"
                              />
                            </div>
                            <div>
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
                                placeholder="Bachelor of Science in Computer Science"
                              />
                            </div>
                            <div>
                              <Label>Dates</Label>
                              <Input
                                value={edu.dates}
                                onChange={(e) =>
                                  updateEducation(
                                    edu.id,
                                    "dates",
                                    e.target.value
                                  )
                                }
                                placeholder="Aug 2018 - May 2022"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </TabsContent>

                    {/* Experience Tab */}
                    <TabsContent value="experience" className="space-y-4 mt-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Experience</h3>
                        <Button onClick={addExperience} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Experience
                        </Button>
                      </div>
                      {resumeData.experience.map((exp) => (
                        <Card
                          key={exp.id}
                          className="p-4 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-indigo-200/50 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-indigo-800">
                              Experience Entry
                            </h4>
                            <Button
                              onClick={() => removeExperience(exp.id)}
                              variant="ghost"
                              size="sm"
                              className="text-rose-600 hover:text-rose-700 hover:bg-rose-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                                placeholder="Software Engineer"
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
                                placeholder="Company Name"
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
                                placeholder="City, State"
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
                                placeholder="Jan 2022 - Present"
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Responsibilities & Achievements</Label>
                            {exp.points.map((point, index) => (
                              <div key={index} className="flex gap-2 mt-2">
                                <Textarea
                                  value={point}
                                  onChange={(e) =>
                                    updateExperiencePoint(
                                      exp.id,
                                      index,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Describe your achievement or responsibility..."
                                  rows={2}
                                  className="flex-1"
                                />
                                <Button
                                  onClick={() =>
                                    removeExperiencePoint(exp.id, index)
                                  }
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 self-start"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              onClick={() => addExperiencePoint(exp.id)}
                              variant="outline"
                              size="sm"
                              className="mt-2"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Point
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </TabsContent>

                    {/* Projects Tab */}
                    <TabsContent value="projects" className="space-y-4 mt-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Projects</h3>
                        <Button onClick={addProject} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Project
                        </Button>
                      </div>
                      {resumeData.projects.map((proj) => (
                        <Card
                          key={proj.id}
                          className="p-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-emerald-800">
                              Project Entry
                            </h4>
                            <Button
                              onClick={() => removeProject(proj.id)}
                              variant="ghost"
                              size="sm"
                              className="text-rose-600 hover:text-rose-700 hover:bg-rose-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Project Title</Label>
                              <Input
                                value={proj.title}
                                onChange={(e) =>
                                  updateProject(
                                    proj.id,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder="My Awesome Project"
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
                                placeholder="React, Node.js, MongoDB"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label>Dates</Label>
                              <Input
                                value={proj.dates}
                                onChange={(e) =>
                                  updateProject(
                                    proj.id,
                                    "dates",
                                    e.target.value
                                  )
                                }
                                placeholder="Jan 2023 - Mar 2023"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </TabsContent>

                    {/* Skills Tab */}
                    <TabsContent value="skills" className="space-y-4 mt-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Skills</h3>
                        <Button onClick={addSkill} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Skill Category
                        </Button>
                      </div>
                      {resumeData.skills.map((skill) => (
                        <Card
                          key={skill.id}
                          className="p-4 bg-gradient-to-br from-violet-50/50 to-purple-50/50 border border-violet-200/50 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-violet-800">
                              Skill Category
                            </h4>
                            <Button
                              onClick={() => removeSkill(skill.id)}
                              variant="ghost"
                              size="sm"
                              className="text-rose-600 hover:text-rose-700 hover:bg-rose-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Category Name</Label>
                              <Input
                                value={skill.name}
                                onChange={(e) =>
                                  updateSkill(skill.id, "name", e.target.value)
                                }
                                placeholder="Programming Languages"
                              />
                            </div>
                            <div>
                              <Label>Skills</Label>
                              <Input
                                value={skill.skills}
                                onChange={(e) =>
                                  updateSkill(
                                    skill.id,
                                    "skills",
                                    e.target.value
                                  )
                                }
                                placeholder="JavaScript, Python, Java, C++"
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </TabsContent>

                    {/* Custom Sections Tab */}
                    <TabsContent value="custom" className="space-y-4 mt-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Custom Sections
                        </h3>
                        <Button onClick={addCustomSection} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Custom Section
                        </Button>
                      </div>
                      {resumeData.customSections.map((section) => (
                        <Card
                          key={section.id}
                          className="p-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 border border-emerald-200/50 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-emerald-800">
                              Custom Section
                            </h4>
                            <Button
                              onClick={() => removeCustomSection(section.id)}
                              variant="ghost"
                              size="sm"
                              className="text-rose-600 hover:text-rose-700 hover:bg-rose-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                  placeholder="Certifications, Awards, etc."
                                />
                              </div>
                              <div>
                                <Label>Section Type</Label>
                                <select
                                  value={section.type}
                                  onChange={(e) =>
                                    updateCustomSection(
                                      section.id,
                                      "type",
                                      e.target.value as
                                        | "text"
                                        | "list"
                                        | "skills"
                                    )
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                >
                                  <option value="text">Text</option>
                                  <option value="list">List</option>
                                  <option value="skills">Skills</option>
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
                                  placeholder="Enter your content here..."
                                  rows={4}
                                />
                              </div>
                            )}

                            {(section.type === "list" ||
                              section.type === "skills") && (
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <Label>Items</Label>
                                  <Button
                                    onClick={() =>
                                      addCustomSectionItem(section.id)
                                    }
                                    size="sm"
                                    variant="outline"
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add Item
                                  </Button>
                                </div>
                                {section.items.map((item, index) => (
                                  <div
                                    key={item.id}
                                    className="mb-3 p-3 border border-gray-200 rounded-md"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium text-gray-700">
                                        Item {index + 1}
                                      </span>
                                      <Button
                                        onClick={() =>
                                          removeCustomSectionItem(
                                            section.id,
                                            item.id
                                          )
                                        }
                                        size="sm"
                                        variant="ghost"
                                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-100"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                                        placeholder="Title"
                                        className="text-sm"
                                      />
                                      {section.type === "list" && (
                                        <Input
                                          value={item.subtitle || ""}
                                          onChange={(e) =>
                                            updateCustomSectionItem(
                                              section.id,
                                              item.id,
                                              "subtitle",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Subtitle/Location"
                                          className="text-sm"
                                        />
                                      )}
                                    </div>
                                    {section.type === "list" && (
                                      <div className="mt-2">
                                        <Input
                                          value={item.dates || ""}
                                          onChange={(e) =>
                                            updateCustomSectionItem(
                                              section.id,
                                              item.id,
                                              "dates",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Dates"
                                          className="text-sm"
                                        />
                                      </div>
                                    )}
                                    {(section.type === "list" ||
                                      section.type === "skills") && (
                                      <div className="mt-2">
                                        <Textarea
                                          value={item.points?.join("\n") || ""}
                                          onChange={(e) =>
                                            updateCustomSectionItem(
                                              section.id,
                                              item.id,
                                              "points",
                                              e.target.value.split("\n")
                                            )
                                          }
                                          placeholder={
                                            section.type === "list"
                                              ? "Description points (one per line)"
                                              : "Skills (one per line)"
                                          }
                                          rows={2}
                                          className="text-sm"
                                        />
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </TabsContent>
                  </div>
                </Tabs>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div
            className="bg-white/80 backdrop-blur-lg rounded-2xl border border-rose-200/50 shadow-2xl overflow-hidden transition-all duration-300"
            style={{ width: `${100 - panelRatio}%` }}
          >
            {/* Preview Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-rose-200/50 bg-gradient-to-r from-indigo-50/80 via-emerald-50/80 to-violet-50/80">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-transparent">
                Live Preview
              </h2>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200"
                >
                  A4 Format
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-xs bg-indigo-100 text-indigo-700 border border-indigo-200"
                >
                  {Math.round(previewZoom * 100)}% Zoom
                </Badge>
              </div>
            </div>

            {/* Preview Content */}
            <div className="h-full overflow-y-auto p-6 bg-gradient-to-b from-blue-50/30 via-indigo-50/30 to-violet-50/30">
              <div
                className="mx-auto bg-white shadow-2xl border border-gray-200/50 rounded-lg"
                style={{
                  transform: `scale(${previewZoom})`,
                  transformOrigin: "top center",
                  width: "210mm",
                  minHeight: "297mm",
                  maxWidth: "100%",
                  padding: "20mm",
                  fontFamily: fontFamily,
                  fontSize: `${baseFontSize}px`,
                  lineHeight: 1.5,
                }}
              >
                {/* Header Section */}
                <div className="text-center border-b pb-6 mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {resumeData.personalInfo.name || "Your Name"}
                  </h1>
                  <div className="text-sm text-gray-600 space-x-2">
                    {resumeData.personalInfo.phone && (
                      <span>{resumeData.personalInfo.phone}</span>
                    )}
                    {resumeData.personalInfo.phone &&
                      resumeData.personalInfo.email && <span>|</span>}
                    {resumeData.personalInfo.email && (
                      <span>{resumeData.personalInfo.email}</span>
                    )}
                    {resumeData.personalInfo.email &&
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

                {/* Dynamic Sections */}
                {sectionOrder.map((sectionId) => {
                  const scale = getSectionScale(sectionId);
                  const sectionStyle = {
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    marginBottom:
                      scale !== 1 ? `${(scale - 1) * 50}px` : undefined,
                  };

                  return (
                    <div key={sectionId} style={sectionStyle}>
                      {sectionId === "education" &&
                        resumeData.education.length > 0 && (
                          <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">
                              EDUCATION
                            </h2>
                            {resumeData.education.map((edu) => (
                              <div key={edu.id} className="mb-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">
                                      {edu.institution}
                                    </h3>
                                    <p className="text-gray-700">
                                      {edu.degree}
                                    </p>
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

                      {sectionId === "experience" &&
                        resumeData.experience.length > 0 && (
                          <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">
                              EXPERIENCE
                            </h2>
                            {resumeData.experience.map((exp) => (
                              <div key={exp.id} className="mb-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">
                                      {exp.position}
                                    </h3>
                                    <p className="text-gray-700">
                                      {exp.company}
                                    </p>
                                  </div>
                                  <div className="text-right text-sm text-gray-600">
                                    <p>{exp.location}</p>
                                    <p>{exp.dates}</p>
                                  </div>
                                </div>
                                {exp.points.filter((point) => point.trim())
                                  .length > 0 && (
                                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                    {exp.points
                                      .filter((point) => point.trim())
                                      .map((point, index) => (
                                        <li key={index}>{point}</li>
                                      ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                      {sectionId === "projects" &&
                        resumeData.projects.length > 0 && (
                          <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">
                              PROJECTS
                            </h2>
                            {resumeData.projects.map((proj) => (
                              <div key={proj.id} className="mb-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-semibold text-gray-900">
                                    {proj.title}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {proj.dates}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-700 mb-1">
                                  <strong>Technologies:</strong>{" "}
                                  {proj.technologies}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                      {sectionId === "skills" &&
                        resumeData.skills.length > 0 && (
                          <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">
                              TECHNICAL SKILLS
                            </h2>
                            {resumeData.skills.map((skill) => (
                              <div key={skill.id} className="mb-2">
                                <p className="text-sm text-gray-700">
                                  <strong>{skill.name}:</strong> {skill.skills}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                      {sectionId === "customSections" &&
                        resumeData.customSections.length > 0 && (
                          <div className="mb-6">
                            {resumeData.customSections.map((section) => (
                              <div key={section.id} className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">
                                  {section.title.toUpperCase()}
                                </h2>

                                {section.type === "text" && (
                                  <div className="text-sm text-gray-700">
                                    {section.content}
                                  </div>
                                )}

                                {(section.type === "list" ||
                                  section.type === "skills") && (
                                  <div>
                                    {section.items.map((item) => (
                                      <div key={item.id} className="mb-3">
                                        <div className="flex justify-between items-start mb-1">
                                          <h3 className="font-semibold text-gray-900 text-sm">
                                            {item.title}
                                          </h3>
                                          {item.dates && (
                                            <p className="text-xs text-gray-600">
                                              {item.dates}
                                            </p>
                                          )}
                                        </div>
                                        {item.subtitle && (
                                          <p className="text-sm text-gray-700 mb-1">
                                            {item.subtitle}
                                          </p>
                                        )}
                                        {item.points &&
                                          item.points.length > 0 && (
                                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                              {item.points
                                                .filter((point) => point.trim())
                                                .map((point, index) => (
                                                  <li key={index}>{point}</li>
                                                ))}
                                            </ul>
                                          )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={latexFileInputRef}
        type="file"
        accept=".tex"
        onChange={handleLatexFileChange}
        className="hidden"
      />
    </div>
  );
}

// Sortable chip component for section ordering
function SortableChip({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="px-2 py-1 bg-white/90 rounded-md border border-orange-200/50 cursor-move hover:bg-orange-50 hover:shadow-sm transition-all duration-200 text-orange-700"
    >
      {children}
    </div>
  );
}
