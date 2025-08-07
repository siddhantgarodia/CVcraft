/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from "next/server";

// Mock Gemini API integration
// Replace this with actual Gemini API calls
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resumeText, jobDescription } = body;

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Resume text and job description are required" },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock analysis results
    const analysis = {
      overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
      keywordMatch: Math.floor(Math.random() * 50) + 50, // 50-100
      formatting: Math.floor(Math.random() * 20) + 80, // 80-100
      readability: Math.floor(Math.random() * 30) + 70, // 70-100
      sections: [
        {
          name: "Contact Information",
          score: Math.floor(Math.random() * 20) + 80,
          issues: resumeText.includes("@") ? [] : ["Missing email address"],
          suggestions: resumeText.includes("linkedin")
            ? []
            : ["Add LinkedIn profile"],
        },
        {
          name: "Experience",
          score: Math.floor(Math.random() * 30) + 70,
          issues: ["Missing quantified achievements"],
          suggestions: ["Add specific metrics and percentages"],
        },
        {
          name: "Skills",
          score: Math.floor(Math.random() * 40) + 60,
          issues: ["Missing key technologies from job description"],
          suggestions: ["Add relevant technical skills"],
        },
        {
          name: "Education",
          score: Math.floor(Math.random() * 20) + 80,
          issues: [],
          suggestions: ["Consider adding relevant coursework"],
        },
      ],
      missingKeywords: extractMissingKeywords(resumeText, jobDescription),
      foundKeywords: extractFoundKeywords(resumeText, jobDescription),
      suggestions: generateSuggestions(resumeText, jobDescription),
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("ATS Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}

function extractMissingKeywords(
  resumeText: string,
  jobDescription: string
): string[] {
  const resumeLower = resumeText.toLowerCase();
  const jobKeywords = [
    "python",
    "javascript",
    "react",
    "node.js",
    "typescript",
    "sql",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "git",
    "agile",
    "scrum",
    "ci/cd",
    "jenkins",
    "mongodb",
    "postgresql",
    "redis",
    "microservices",
    "rest api",
    "graphql",
    "machine learning",
    "data analysis",
    "pandas",
    "numpy",
    "tensorflow",
    "pytorch",
    "leadership",
    "team management",
    "project management",
    "communication",
    "problem solving",
  ];

  const jobDescLower = jobDescription.toLowerCase();
  const relevantKeywords = jobKeywords.filter(
    (keyword) =>
      jobDescLower.includes(keyword) && !resumeLower.includes(keyword)
  );

  return relevantKeywords.slice(0, 8); // Return max 8 missing keywords
}

function extractFoundKeywords(
  resumeText: string,
  jobDescription: string
): string[] {
  const resumeLower = resumeText.toLowerCase();
  const jobKeywords = [
    "python",
    "javascript",
    "react",
    "node.js",
    "typescript",
    "sql",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "git",
    "agile",
    "scrum",
    "ci/cd",
    "jenkins",
    "mongodb",
    "postgresql",
    "redis",
    "microservices",
    "rest api",
    "graphql",
    "machine learning",
    "data analysis",
    "pandas",
    "numpy",
    "tensorflow",
    "pytorch",
    "leadership",
    "team management",
    "project management",
    "communication",
    "problem solving",
  ];

  const jobDescLower = jobDescription.toLowerCase();
  const foundKeywords = jobKeywords.filter(
    (keyword) => jobDescLower.includes(keyword) && resumeLower.includes(keyword)
  );

  return foundKeywords.slice(0, 10); // Return max 10 found keywords
}

function generateSuggestions(resumeText: string, jobDescription: string) {
  const suggestions = [
    {
      priority: "high" as const,
      category: "Keywords",
      text: "Add missing keywords from the job description",
      impact: "Could increase ATS score by 15-20 points",
    },
    {
      priority: "high" as const,
      category: "Quantification",
      text: "Add specific metrics to your achievements",
      impact: "Makes your impact more measurable and impressive",
    },
    {
      priority: "medium" as const,
      category: "Formatting",
      text: "Use consistent bullet point formatting",
      impact: "Improves readability for both ATS and human reviewers",
    },
    {
      priority: "medium" as const,
      category: "Content",
      text: "Include soft skills mentioned in job description",
      impact: "Shows alignment with company culture and requirements",
    },
    {
      priority: "low" as const,
      category: "Structure",
      text: "Consider adding a summary section",
      impact: "Provides quick overview for recruiters",
    },
  ];

  // Add specific suggestions based on content analysis
  if (
    !resumeText.toLowerCase().includes("led") &&
    !resumeText.toLowerCase().includes("managed")
  ) {
    suggestions.unshift({
      priority: "high" as const,
      category: "Leadership",
      text: "Add leadership experience if applicable",
      impact: "Leadership skills are highly valued by employers",
    });
  }

  if (!/\d+%/.test(resumeText)) {
    suggestions.unshift({
      priority: "high" as const,
      category: "Metrics",
      text: "Include percentage improvements and quantified results",
      impact: "Quantified achievements are more compelling to recruiters",
    });
  }

  return suggestions.slice(0, 6); // Return max 6 suggestions
}

// GET method for health check
export async function GET() {
  return NextResponse.json({ status: "ATS Analysis API is running" });
}
