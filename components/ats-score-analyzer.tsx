"use client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RefreshCw, Target, AlertCircle, CheckCircle, Info } from "lucide-react"
import type { ATSScoreResult } from "@/lib/types"
import { Progress } from "@/components/ui/progress"

interface ATSScoreAnalyzerProps {
  atsScore: ATSScoreResult | null
  isAnalyzing: boolean
  onAnalyze: () => void
  jobDescription: string
  setJobDescription: (value: string) => void
}

export default function ATSScoreAnalyzer({
  atsScore,
  isAnalyzing,
  onAnalyze,
  jobDescription,
  setJobDescription,
}: ATSScoreAnalyzerProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-600"
    if (score >= 60) return "bg-amber-600"
    return "bg-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">ATS Compatibility Score</h2>
        <Button variant="outline" size="sm" onClick={onAnalyze} disabled={isAnalyzing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? "animate-spin" : ""}`} />
          {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
        </Button>
      </div>

      <div className="mb-6">
        <Label htmlFor="job-description-ats" className="mb-2 block">
          Job Description (for targeted ATS analysis)
        </Label>
        <Textarea
          id="job-description-ats"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here to get a more accurate ATS compatibility score..."
          rows={4}
          className="mb-2"
        />
        <p className="text-xs text-slate-500">
          Adding a job description helps analyze how well your resume matches the specific requirements of the job.
        </p>
      </div>

      {isAnalyzing ? (
        <div className="flex items-center justify-center p-8 border rounded-md bg-slate-50">
          <RefreshCw className="h-6 w-6 animate-spin text-slate-700 mr-2" />
          <span>Analyzing your resume for ATS compatibility...</span>
        </div>
      ) : !atsScore ? (
        <div className="flex flex-col items-center justify-center p-8 border rounded-md bg-slate-50">
          <Target className="h-8 w-8 text-blue-500 mb-2" />
          <h3 className="font-medium text-lg mb-1">No ATS Analysis Yet</h3>
          <p className="text-center text-slate-600 mb-4">
            Click "Analyze Resume" to check how well your resume will perform with Applicant Tracking Systems.
          </p>
          <Button onClick={onAnalyze}>
            <Target className="h-4 w-4 mr-2" />
            Analyze ATS Compatibility
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Overall ATS Score</h3>
              <div className={`text-3xl font-bold ${getScoreColor(atsScore.overallScore)}`}>
                {atsScore.overallScore}%
              </div>
            </div>
            <Progress
              value={atsScore.overallScore}
              className="h-2 mb-4"
              indicatorClassName={getProgressColor(atsScore.overallScore)}
            />
            <p className="text-sm text-slate-600">
              {atsScore.overallScore >= 80
                ? "Excellent! Your resume is well-optimized for ATS systems."
                : atsScore.overallScore >= 60
                  ? "Good, but there's room for improvement in your ATS optimization."
                  : "Your resume needs significant improvements to pass ATS systems effectively."}
            </p>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Keyword Match</h4>
                <div className={`text-lg font-bold ${getScoreColor(atsScore.keywordMatch)}`}>
                  {atsScore.keywordMatch}%
                </div>
              </div>
              <Progress
                value={atsScore.keywordMatch}
                className="h-1.5 mb-2"
                indicatorClassName={getProgressColor(atsScore.keywordMatch)}
              />
              <p className="text-xs text-slate-600">How well your resume matches job-specific keywords</p>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Format Score</h4>
                <div className={`text-lg font-bold ${getScoreColor(atsScore.formatScore)}`}>
                  {atsScore.formatScore}%
                </div>
              </div>
              <Progress
                value={atsScore.formatScore}
                className="h-1.5 mb-2"
                indicatorClassName={getProgressColor(atsScore.formatScore)}
              />
              <p className="text-xs text-slate-600">How well your resume structure works with ATS systems</p>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Content Score</h4>
                <div className={`text-lg font-bold ${getScoreColor(atsScore.contentScore)}`}>
                  {atsScore.contentScore}%
                </div>
              </div>
              <Progress
                value={atsScore.contentScore}
                className="h-1.5 mb-2"
                indicatorClassName={getProgressColor(atsScore.contentScore)}
              />
              <p className="text-xs text-slate-600">Quality and relevance of your resume content</p>
            </div>
          </div>

          {/* Missing Keywords */}
          {atsScore.missingKeywords.length > 0 && (
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-start mb-4">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">Missing Keywords</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    These keywords from the job description are missing from your resume:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {atsScore.missingKeywords.map((keyword, index) => (
                      <span key={index} className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Improvement Tips */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-start mb-4">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium">Improvement Tips</h3>
                <p className="text-sm text-slate-600 mb-3">Follow these suggestions to improve your ATS score:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {atsScore.improvementTips.map((tip, index) => (
                    <li key={index} className="text-sm text-slate-700">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Strengths */}
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-start mb-4">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium">Resume Strengths</h3>
                <p className="text-sm text-slate-600 mb-3">Your resume performs well in these areas:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {atsScore.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-slate-700">
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
