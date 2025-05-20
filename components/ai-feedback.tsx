"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, RefreshCw, Lightbulb, Copy, Wand2, AlertTriangle } from "lucide-react"
import type { FeedbackItem, ResumeData } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface AiFeedbackProps {
  feedback: FeedbackItem[]
  isGenerating: boolean
  jobDescription: string
  setJobDescription: (value: string) => void
  onRefresh: () => void
  resumeData: ResumeData
}

export default function AiFeedback({
  feedback,
  isGenerating,
  jobDescription,
  setJobDescription,
  onRefresh,
  resumeData,
}: AiFeedbackProps) {
  const { toast } = useToast()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [criticalIssues, setCriticalIssues] = useState<string[]>([])

  // Check for critical issues in the resume
  useEffect(() => {
    const issues: string[] = []

    // Check for missing experience
    if (resumeData.experience.length === 0) {
      issues.push("missing-experience")
    }

    // Check for missing education
    if (resumeData.education.length === 0) {
      issues.push("missing-education")
    }

    // Check for missing skills
    if (resumeData.skills.length === 0) {
      issues.push("missing-skills")
    }

    // Check for missing summary
    if (!resumeData.personalInfo.summary || resumeData.personalInfo.summary.trim() === "") {
      issues.push("missing-summary")
    }

    // Check for incomplete contact info
    if (!resumeData.personalInfo.email || !resumeData.personalInfo.phone) {
      issues.push("incomplete-contact")
    }

    setCriticalIssues(issues)
  }, [resumeData])

  const toggleItem = (id: string) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter((item) => item !== id))
    } else {
      setExpandedItems([...expandedItems, id])
    }
  }

  const applySuggestion = (suggestion: string) => {
    toast({
      title: "Suggestion Applied",
      description: "The suggestion has been applied to your resume.",
    })
    // In a real implementation, this would update the resume data
  }

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: "Text has been copied to your clipboard.",
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">AI Resume Feedback</h2>

      <div className="mb-6">
        <Label htmlFor="job-description" className="mb-2 block">
          Job Description (for targeted feedback)
        </Label>
        <Textarea
          id="job-description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here to get tailored feedback for this specific role..."
          rows={4}
          className="mb-2"
        />
        <p className="text-xs text-slate-500">
          Adding a job description helps the AI provide more relevant feedback tailored to the position you're applying
          for.
        </p>
      </div>

      {/* Critical Issues Section */}
      {criticalIssues.length > 0 && (
        <div className="mb-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Critical Issues Detected</h3>
                <p className="text-sm text-red-700 mb-3">
                  Your resume has some critical issues that may significantly reduce its effectiveness:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-red-700">
                  {criticalIssues.includes("missing-experience") && (
                    <li>
                      <strong>No work experience added.</strong> Work experience is crucial for most job applications.
                    </li>
                  )}
                  {criticalIssues.includes("missing-education") && (
                    <li>
                      <strong>No education history added.</strong> Education credentials are important for establishing
                      qualifications.
                    </li>
                  )}
                  {criticalIssues.includes("missing-skills") && (
                    <li>
                      <strong>No skills listed.</strong> Skills section helps highlight your capabilities and match job
                      requirements.
                    </li>
                  )}
                  {criticalIssues.includes("missing-summary") && (
                    <li>
                      <strong>Missing professional summary.</strong> A summary helps introduce yourself and highlight
                      key qualifications.
                    </li>
                  )}
                  {criticalIssues.includes("incomplete-contact") && (
                    <li>
                      <strong>Incomplete contact information.</strong> Ensure you provide at least email and phone
                      number.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Feedback & Suggestions</h3>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isGenerating}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
          Refresh Feedback
        </Button>
      </div>

      {isGenerating ? (
        <div className="flex items-center justify-center p-8 border rounded-md bg-slate-50">
          <RefreshCw className="h-6 w-6 animate-spin text-slate-700 mr-2" />
          <span>Generating feedback...</span>
        </div>
      ) : feedback.length === 0 && criticalIssues.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border rounded-md bg-slate-50">
          <Lightbulb className="h-8 w-8 text-amber-500 mb-2" />
          <h3 className="font-medium text-lg mb-1">No feedback yet</h3>
          <p className="text-center text-slate-600 mb-4">
            Add content to your resume or provide a job description to get AI-powered feedback.
          </p>
          <Button onClick={onRefresh}>
            <Wand2 className="h-4 w-4 mr-2" />
            Generate Feedback
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {feedback.map((item) => (
            <div
              key={item.id}
              className={`border rounded-md overflow-hidden ${
                item.type === "warning"
                  ? "border-amber-200 bg-amber-50"
                  : item.type === "error"
                    ? "border-red-200 bg-red-50"
                    : "border-green-200 bg-green-50"
              }`}
            >
              <div className="p-4 cursor-pointer flex items-start" onClick={() => toggleItem(item.id)}>
                <div className="mr-3 mt-0.5">
                  {item.type === "warning" ? (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  ) : item.type === "error" ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-slate-700">{item.description}</p>
                </div>
              </div>

              {expandedItems.includes(item.id) && item.suggestion && (
                <div className="p-4 border-t bg-white">
                  <h5 className="text-sm font-medium mb-2">Suggested Improvement:</h5>
                  <div className="bg-slate-50 p-3 rounded-md text-sm mb-3 whitespace-pre-line">{item.suggestion}</div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => copyText(item.suggestion)}>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy
                    </Button>
                    <Button size="sm" onClick={() => applySuggestion(item.suggestion)}>
                      Apply Suggestion
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
