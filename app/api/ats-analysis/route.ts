/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from "next/server";
import { analyzeATSScore } from "@/lib/ai-helpers";
import type { ResumeData } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { resumeData, jobDescription } = await request.json();

    if (!resumeData) {
      return NextResponse.json(
        { error: "Resume data is required" },
        { status: 400 }
      );
    }

    const atsScore = await analyzeATSScore(resumeData, jobDescription || "");

    return NextResponse.json(atsScore);
  } catch (error) {
    console.error("Error in ATS analysis API:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}

// GET method for health check
export async function GET() {
  return NextResponse.json({ status: "ATS Analysis API is running" });
}
