"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Upload } from "lucide-react";
import { ATSScoreVisualization } from "@/components/ats-score-visualization";
import { useToast } from "@/components/ui/use-toast";
import type { ATSScoreResult } from "@/lib/types";
import { analyzeATSScore } from "@/lib/ai-helpers";
import { extractTextFromPDF } from "@/lib/pdf-parser";

interface ATSCheckerProps {
  resumeData: Record<string, unknown>;
  onScoreUpdate?: (score: ATSScoreResult) => void;
}

export function ATSChecker({ resumeData, onScoreUpdate }: ATSCheckerProps) {
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsScore, setAtsScore] = useState<ATSScoreResult | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setPdfFile(file);

    try {
      const text = await extractTextFromPDF(file);
      setJobDescription(text);
      toast({
        title: "File uploaded",
        description: "PDF job description extracted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extract text from PDF",
        variant: "destructive",
      });
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription && !pdfFile) {
      toast({
        title: "Missing job description",
        description: "Please enter a job description or upload a PDF",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const score = await analyzeATSScore(resumeData as any, jobDescription);
      setAtsScore(score);
      onScoreUpdate?.(score);

      toast({
        title: "Analysis complete",
        description: "Your resume has been analyzed for ATS compatibility",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">ATS Resume Checker</h2>
          <p className="text-sm text-gray-600">
            Upload a job description to analyze your resume&apos;s ATS
            compatibility
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="job-desc">Job Description</Label>
            <Textarea
              id="job-desc"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="h-32"
            />
          </div>

          <div className="text-center relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdf-upload">Upload PDF</Label>
            <div className="flex gap-2">
              <Input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById("pdf-upload")?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose PDF
              </Button>
              {pdfFile && (
                <Button variant="ghost" className="flex-shrink-0">
                  <FileText className="h-4 w-4 mr-2" />
                  {pdfFile.name}
                </Button>
              )}
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Analyze Resume
              </>
            )}
          </Button>
        </div>

        {atsScore && <ATSScoreVisualization score={atsScore} />}
      </div>
    </Card>
  );
}
