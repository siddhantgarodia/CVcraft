"use client"

import type { ResumeData, Template } from "@/lib/types"
import ModernTemplate from "@/components/templates/modern-template"
import ClassicTemplate from "@/components/templates/classic-template"
import MinimalTemplate from "@/components/templates/minimal-template"
import CreativeTemplate from "@/components/templates/creative-template"

interface ResumePreviewProps {
  resumeData: ResumeData
  template: Template
  profileImage?: string | null
  forPrint?: boolean
}

export default function ResumePreview({ resumeData, template, profileImage, forPrint = false }: ResumePreviewProps) {
  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate resumeData={resumeData} profileImage={profileImage} />
      case "classic":
        return <ClassicTemplate resumeData={resumeData} profileImage={profileImage} />
      case "minimal":
        return <MinimalTemplate resumeData={resumeData} profileImage={profileImage} />
      case "creative":
        return <CreativeTemplate resumeData={resumeData} profileImage={profileImage} />
      default:
        return <ModernTemplate resumeData={resumeData} profileImage={profileImage} />
    }
  }

  return (
    <div className={`resume-preview ${forPrint ? "" : "overflow-auto max-h-[800px] scale-90 origin-top"}`}>
      {renderTemplate()}
    </div>
  )
}
