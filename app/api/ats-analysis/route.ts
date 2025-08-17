/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from "next/server";
import { analyzeResumeText } from "@/lib/ai-helpers";
import type { ATSAnalysis } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    console.log("ATS Analysis API called");
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      console.log("Missing required fields:", {
        hasResumeText: !!resumeText,
        hasJobDescription: !!jobDescription,
      });
      return NextResponse.json(
        { error: "Both resume text and job description are required" },
        { status: 400 }
      );
    }

    console.log("Calling analyzeResumeText with Gemini...");
    console.log("Resume text length:", resumeText.length);
    console.log("Job description length:", jobDescription.length);

    const analysis: ATSAnalysis = await analyzeResumeText(
      resumeText,
      jobDescription
    );

    console.log("Analysis completed, returning results");
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error in ATS analysis API:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}

// GET method for health check and API testing
export async function GET() {
  try {
    console.log("ATS Analysis API health check called");

    // Test if we can access Gemini API
    const testResult = await analyzeResumeText(
      "John Doe\nSoftware Engineer\n5 years experience in React and Node.js",
      "Software Engineer position requiring React and Node.js experience"
    );

    return NextResponse.json({
      status: "ATS Analysis API is running",
      geminiTest: "successful",
      sampleScore: testResult.overallScore,
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json({
      status: "ATS Analysis API is running but Gemini test failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
