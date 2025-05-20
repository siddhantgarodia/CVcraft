export type Template = "modern" | "classic" | "minimal" | "creative"

export interface PersonalInfo {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
  github: string
  summary: string
}

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  description: string
}

export interface Skill {
  id: string
  name: string
  level: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: Skill[]
}

export interface FeedbackItem {
  id: string
  type: "warning" | "error" | "success"
  title: string
  description: string
  section: string
  suggestion: string
}

export interface ResumeVersion {
  id: string
  name: string
  date: string
  data: ResumeData
}

export interface ATSScoreResult {
  overallScore: number
  keywordMatch: number
  formatScore: number
  contentScore: number
  missingKeywords: string[]
  improvementTips: string[]
  strengths: string[]
}

export interface ResumeAnalytics {
  views: number
  downloads: number
  applicationsSent: number
  interviewsReceived: number
  lastUpdated: string
}
