"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  Zap,
  ArrowLeft,
  BarChart3,
  Users,
  Award,
  Clock,
  Brain,
  Lightbulb,
  Download,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface ATSAnalysis {
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

export default function AnalysisPage() {
  const { toast } = useToast();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("cvcraft-resume-data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Convert resume data to text format for analysis
        const resumeTextFromData = generateResumeText(parsed);
        setResumeText(resumeTextFromData);
        setActiveTab("analysis");
      } catch (error) {
        console.error("Failed to load saved data:", error);
      }
    }
  }, []);

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

    return text;
  };

  const analyzeResume = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both resume content and job description.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
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

      const analysisData = await response.json();
      setAnalysis(analysisData);
      setActiveTab("results");

      toast({
        title: "Analysis Complete",
        description: `Your resume scored ${analysisData.overallScore}/100 for this position.`,
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/builder">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Builder
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-slate-900">Resume Analysis</h1>
          <p className="text-slate-600 max-w-2xl">
            Get detailed ATS analysis, keyword optimization, and personalized
            suggestions
          </p>
        </header>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Input Data
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Resume Content</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="resumeText">
                      Paste your resume text or load from builder
                    </Label>
                    <Textarea
                      id="resumeText"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste your resume content here..."
                      rows={12}
                      className="resize-none"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      const savedData = localStorage.getItem(
                        "cvcraft-resume-data"
                      );
                      if (savedData) {
                        const parsed = JSON.parse(savedData);
                        setResumeText(generateResumeText(parsed));
                        toast({
                          title: "Resume Loaded",
                          description: "Resume data loaded from builder.",
                        });
                      } else {
                        toast({
                          title: "No Data Found",
                          description:
                            "No saved resume data found. Please use the builder first.",
                          variant: "destructive",
                        });
                      }
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Load from Builder
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Job Description</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="jobDesc">Paste the job description</Label>
                    <Textarea
                      id="jobDesc"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the complete job description here..."
                      rows={12}
                      className="resize-none"
                    />
                  </div>
                  <Button
                    onClick={analyzeResume}
                    disabled={
                      isAnalyzing ||
                      !resumeText.trim() ||
                      !jobDescription.trim()
                    }
                    className="w-full"
                  >
                    {isAnalyzing ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        Analyze Resume
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <Card className="p-6">
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Brain className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
                <p className="text-gray-600 mb-6">
                  Upload your resume and job description to get detailed ATS
                  analysis
                </p>
                <Button onClick={() => setActiveTab("upload")}>
                  Go to Input Data
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            {analysis ? (
              <div className="space-y-6">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Overall Score</p>
                        <p
                          className={`text-2xl font-bold ${getScoreColor(
                            analysis.overallScore
                          )}`}
                        >
                          {analysis.overallScore}/100
                        </p>
                      </div>
                      <Award className="h-8 w-8 text-blue-600" />
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Keyword Match</p>
                        <p
                          className={`text-2xl font-bold ${getScoreColor(
                            analysis.keywordMatch
                          )}`}
                        >
                          {analysis.keywordMatch}%
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-green-600" />
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Formatting</p>
                        <p
                          className={`text-2xl font-bold ${getScoreColor(
                            analysis.formatting
                          )}`}
                        >
                          {analysis.formatting}%
                        </p>
                      </div>
                      <FileText className="h-8 w-8 text-purple-600" />
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Readability</p>
                        <p
                          className={`text-2xl font-bold ${getScoreColor(
                            analysis.readability
                          )}`}
                        >
                          {analysis.readability}%
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-orange-600" />
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Section Analysis */}
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Section Analysis
                    </h3>
                    <div className="space-y-4">
                      {analysis.sections.map((section, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{section.name}</span>
                            <span
                              className={`font-bold ${getScoreColor(
                                section.score
                              )}`}
                            >
                              {section.score}%
                            </span>
                          </div>
                          <Progress value={section.score} className="h-2" />
                          {section.issues.length > 0 && (
                            <div className="text-sm text-red-600">
                              Issues: {section.issues.join(", ")}
                            </div>
                          )}
                          {section.suggestions.length > 0 && (
                            <div className="text-sm text-blue-600">
                              Suggestions: {section.suggestions.join(", ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Keywords Analysis */}
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Keywords Analysis
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">
                          Found Keywords
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.foundKeywords.map((keyword, index) => (
                            <Badge
                              key={index}
                              variant="default"
                              className="bg-green-100 text-green-800"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-600 mb-2">
                          Missing Keywords
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.missingKeywords.map((keyword, index) => (
                            <Badge
                              key={index}
                              variant="destructive"
                              className="bg-red-100 text-red-800"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Suggestions */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Improvement Suggestions
                  </h3>
                  <div className="space-y-4">
                    {analysis.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-l-4 ${getPriorityColor(
                          suggestion.priority
                        )}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant="outline"
                                className={getPriorityColor(
                                  suggestion.priority
                                )}
                              >
                                {suggestion.priority.toUpperCase()}
                              </Badge>
                              <span className="font-medium">
                                {suggestion.category}
                              </span>
                            </div>
                            <p className="text-gray-800 mb-1">
                              {suggestion.text}
                            </p>
                            <p className="text-sm text-gray-600">
                              {suggestion.impact}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => setActiveTab("upload")}
                    variant="outline"
                  >
                    Analyze Another Resume
                  </Button>
                  <Button onClick={() => window.print()} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Button asChild>
                    <Link href="/builder">Back to Builder</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="p-6">
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No Analysis Available
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Run an analysis first to see detailed results
                  </p>
                  <Button onClick={() => setActiveTab("upload")}>
                    Start Analysis
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
