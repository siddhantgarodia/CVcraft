"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Download,
  FileText,
  Wand2,
  LayoutTemplate,
  Eye,
  FileUp,
  Trash2,
  X,
  BarChart3,
  History,
  Target,
} from "lucide-react"
import ResumeEditor from "@/components/resume-editor"
import ResumePreview from "@/components/resume-preview"
import TemplateSelector from "@/components/template-selector"
import AiFeedback from "@/components/ai-feedback"
import { useToast } from "@/hooks/use-toast"
import { defaultResumeData } from "@/lib/default-data"
import type { ResumeData, Template, FeedbackItem, ResumeVersion, ATSScoreResult } from "@/lib/types"
import { generateResumeFeedback, analyzeATSScore } from "@/lib/ai-helpers"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import ATSScoreAnalyzer from "@/components/ats-score-analyzer"
import ResumeVersionHistory from "@/components/resume-version-history"
import ResumeAnalyticsComponent from "@/components/resume-analytics"
import { exportResumeToPdf } from "@/lib/pdf-export"

export default function ResumeBuilder() {
  const { toast } = useToast()
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData)
  const [selectedTemplate, setSelectedTemplate] = useState<Template>("modern")
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [jobDescription, setJobDescription] = useState<string>("")
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false)
  const [activeTab, setActiveTab] = useState("editor")
  const [showFullPreview, setShowFullPreview] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [versions, setVersions] = useState<ResumeVersion[]>([])
  const [atsScore, setAtsScore] = useState<ATSScoreResult | null>(null)
  const [isAnalyzingATS, setIsAnalyzingATS] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const resumePreviewRef = useRef<HTMLDivElement>(null)

  // Generate feedback when resume data changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (resumeData && Object.keys(resumeData).length > 0) {
        generateFeedback()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [resumeData, jobDescription])

  // Load saved data on initial render
  useEffect(() => {
    const savedData = localStorage.getItem("resumeData")
    if (savedData) {
      try {
        setResumeData(JSON.parse(savedData))
        toast({
          title: "Resume Loaded",
          description: "Your previously saved resume has been loaded.",
        })
      } catch (error) {
        console.error("Error loading saved resume data:", error)
      }
    }

    // Load saved versions
    const savedVersions = localStorage.getItem("resumeVersions")
    if (savedVersions) {
      try {
        setVersions(JSON.parse(savedVersions))
      } catch (error) {
        console.error("Error loading saved versions:", error)
      }
    }
  }, [])

  const generateFeedback = async () => {
    if (isGeneratingFeedback) return

    setIsGeneratingFeedback(true)
    try {
      const newFeedback = await generateResumeFeedback(resumeData, jobDescription)
      setFeedback(newFeedback)
    } catch (error) {
      console.error("Error generating feedback:", error)
      toast({
        title: "Feedback Error",
        description: "Failed to generate resume feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingFeedback(false)
    }
  }

  const analyzeATS = async () => {
    if (isAnalyzingATS) return

    setIsAnalyzingATS(true)
    try {
      const result = await analyzeATSScore(resumeData, jobDescription)
      setAtsScore(result)
      setActiveTab("ats")
    } catch (error) {
      console.error("Error analyzing ATS score:", error)
      toast({
        title: "ATS Analysis Error",
        description: "Failed to analyze ATS compatibility. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzingATS(false)
    }
  }

  const handleExport = async () => {
    if (!resumePreviewRef.current) return

    setIsExporting(true)
    toast({
      title: "Preparing PDF",
      description: "Your resume is being prepared for download...",
    })

    try {
      await exportResumeToPdf(resumeData, selectedTemplate, profileImage, resumePreviewRef.current)

      toast({
        title: "Resume Exported",
        description: "Your resume has been exported as PDF.",
      })

      // Update analytics
      updateAnalytics("downloads")
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting your resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleSave = () => {
    try {
      localStorage.setItem("resumeData", JSON.stringify(resumeData))

      // Create a new version
      const newVersion: ResumeVersion = {
        id: `version-${Date.now()}`,
        name: `Version ${versions.length + 1}`,
        date: new Date().toISOString(),
        data: JSON.parse(JSON.stringify(resumeData)),
      }

      const updatedVersions = [...versions, newVersion]
      setVersions(updatedVersions)
      localStorage.setItem("resumeVersions", JSON.stringify(updatedVersions))

      toast({
        title: "Resume Saved",
        description: "Your resume has been saved to local storage and added to version history.",
      })
    } catch (error) {
      console.error("Error saving resume data:", error)
      toast({
        title: "Save Failed",
        description: "Failed to save your resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLoad = () => {
    const savedData = localStorage.getItem("resumeData")
    if (savedData) {
      try {
        setResumeData(JSON.parse(savedData))
        toast({
          title: "Resume Loaded",
          description: "Your saved resume has been loaded.",
        })
      } catch (error) {
        console.error("Error loading saved resume data:", error)
        toast({
          title: "Load Failed",
          description: "Failed to load your saved resume. The data may be corrupted.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "No Saved Resume",
        description: "No previously saved resume was found.",
        variant: "destructive",
      })
    }
  }

  const handleReset = () => {
    setResumeData(defaultResumeData)
    toast({
      title: "Resume Reset",
      description: "Your resume has been reset to default values.",
    })
  }

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string)
          toast({
            title: "Profile Image Uploaded",
            description: "Your profile image has been uploaded.",
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const restoreVersion = (version: ResumeVersion) => {
    setResumeData(version.data)
    toast({
      title: "Version Restored",
      description: `Restored to ${version.name} from ${new Date(version.date).toLocaleDateString()}`,
    })
  }

  const deleteVersion = (versionId: string) => {
    const updatedVersions = versions.filter((v) => v.id !== versionId)
    setVersions(updatedVersions)
    localStorage.setItem("resumeVersions", JSON.stringify(updatedVersions))
    toast({
      title: "Version Deleted",
      description: "The selected version has been deleted from history.",
    })
  }

  const updateAnalytics = (type: "views" | "downloads" | "applicationsSent" | "interviewsReceived") => {
    try {
      const analyticsData = localStorage.getItem("resumeAnalytics")
      const analytics = analyticsData
        ? JSON.parse(analyticsData)
        : {
            views: 0,
            downloads: 0,
            applicationsSent: 0,
            interviewsReceived: 0,
            lastUpdated: new Date().toISOString(),
          }

      analytics[type] += 1
      analytics.lastUpdated = new Date().toISOString()

      localStorage.setItem("resumeAnalytics", JSON.stringify(analytics))
    } catch (error) {
      console.error("Error updating analytics:", error)
    }
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex space-x-2">
          <Button onClick={handleSave} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button onClick={handleLoad} variant="outline" size="sm">
            <FileUp className="h-4 w-4 mr-2" />
            Load
          </Button>
          <Button onClick={handleReset} variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleExport} variant="default" size="sm" disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>
          <Button onClick={analyzeATS} variant="outline" size="sm" disabled={isAnalyzingATS}>
            <Target className="h-4 w-4 mr-2" />
            {isAnalyzingATS ? "Analyzing..." : "ATS Score"}
          </Button>
          <Button onClick={() => setActiveTab("feedback")} variant="outline" size="sm" className="relative">
            <Wand2 className="h-4 w-4 mr-2" />
            AI Feedback
            {feedback.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {feedback.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="editor">
            <FileText className="h-4 w-4 mr-2" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="templates">
            <LayoutTemplate className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <Wand2 className="h-4 w-4 mr-2" />
            AI Feedback
          </TabsTrigger>
          <TabsTrigger value="ats">
            <Target className="h-4 w-4 mr-2" />
            ATS Score
          </TabsTrigger>
          <TabsTrigger value="versions">
            <History className="h-4 w-4 mr-2" />
            Versions
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TabsContent value="editor" className="mt-0">
            <Card className="p-4">
              <ResumeEditor
                resumeData={resumeData}
                setResumeData={setResumeData}
                profileImage={profileImage}
                onProfileImageUpload={handleProfileImageUpload}
              />
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="mt-0">
            <Card className="p-4">
              <TemplateSelector selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="mt-0">
            <Card className="p-4">
              <AiFeedback
                feedback={feedback}
                isGenerating={isGeneratingFeedback}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                onRefresh={generateFeedback}
                resumeData={resumeData}
              />
            </Card>
          </TabsContent>

          <TabsContent value="ats" className="mt-0">
            <Card className="p-4">
              <ATSScoreAnalyzer
                atsScore={atsScore}
                isAnalyzing={isAnalyzingATS}
                onAnalyze={analyzeATS}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
              />
            </Card>
          </TabsContent>

          <TabsContent value="versions" className="mt-0">
            <Card className="p-4">
              <ResumeVersionHistory versions={versions} onRestore={restoreVersion} onDelete={deleteVersion} />
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <Card className="p-4">
              <ResumeAnalyticsComponent />
            </Card>
          </TabsContent>

          <div className="lg:row-span-6">
            <Card className="p-4 h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Preview</h3>
                <Button variant="outline" size="sm" onClick={() => setShowFullPreview(true)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Full Preview
                </Button>
              </div>
              <div className="bg-white border rounded-md overflow-hidden">
                <div ref={resumePreviewRef}>
                  <ResumePreview
                    resumeData={resumeData}
                    template={selectedTemplate}
                    profileImage={profileImage}
                    forPrint={false}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Tabs>

      {/* Full Preview Dialog */}
      <Dialog open={showFullPreview} onOpenChange={setShowFullPreview}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
          <div className="flex justify-end p-2 absolute top-0 right-0 z-10">
            <Button variant="ghost" size="icon" onClick={() => setShowFullPreview(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="overflow-auto h-full p-6">
            <ResumePreview
              resumeData={resumeData}
              template={selectedTemplate}
              profileImage={profileImage}
              forPrint={false}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
