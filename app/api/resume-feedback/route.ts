import { NextRequest, NextResponse } from "next/server";
import { generateResumeFeedback } from "@/lib/ai-helpers";
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

    const feedback = await generateResumeFeedback(resumeData, jobDescription || "");

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Error in resume feedback API:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}
