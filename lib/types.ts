export type Template =
  | "latex-modern"
  | "latex-classic"
  | "latex-minimal"
  | "latex-academic";

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string[];
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  achievements: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: string;
}

// New interfaces for custom sections
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  date: string;
  url?: string;
  doi?: string;
}

export interface Volunteer {
  id: string;
  organization: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  type: "text" | "list" | "timeline";
  content: string | string[];
  visible: boolean;
}

// Section types for dynamic management
export type SectionType =
  | "personal"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "awards"
  | "publications"
  | "volunteer"
  | "custom";

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  order: number;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  awards: Award[];
  publications: Publication[];
  volunteer: Volunteer[];
  customSections: CustomSection[];
  sections: ResumeSection[];
}

export interface FeedbackItem {
  id: string;
  type: "warning" | "error" | "success";
  title: string;
  description: string;
  section: string;
  suggestion: string;
}

export interface ResumeVersion {
  id: string;
  name: string;
  date: string;
  data: ResumeData;
}

export interface ATSScoreResult {
  overallScore: number;
  keywordMatch: number;
  formatScore: number;
  contentScore: number;
  missingKeywords: string[];
  improvementTips: string[];
  strengths: string[];
}

// New comprehensive ATS analysis interface for the frontend
export interface ATSAnalysis {
  overallScore: number;
  keywordMatch: number;
  formatting: number;
  readability: number;
  sections: {
    name: string;
    score: number;
    issues: string[];
    suggestions: string[];
  }[];
  missingKeywords: string[];
  foundKeywords: string[];
  suggestions: {
    priority: "high" | "medium" | "low";
    category: string;
    text: string;
    impact: string;
  }[];
}

export interface ResumeAnalytics {
  views: number;
  downloads: number;
  applicationsSent: number;
  interviewsReceived: number;
  lastUpdated: string;
}
