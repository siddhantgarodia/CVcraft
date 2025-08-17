import type {
  FeedbackItem,
  ResumeData,
  ATSScoreResult,
  ATSAnalysis,
} from "./types";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI (server-side only)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "demo-key");

// Centralized model selection: default to Gemini Pro for all clients, override via env var
const MODEL_ID = process.env.GEMINI_MODEL || "gemini-1.5-pro";

// Helper function to check if we have a valid API key
function hasValidApiKey(): boolean {
  const apiKey = process.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey !== "" && apiKey !== "demo-key");
}

// This function generates AI-powered feedback for the resume
export async function generateResumeFeedback(
  resumeData: ResumeData,
  jobDescription: string
): Promise<FeedbackItem[]> {
  try {
    // Check if API key is available
    if (!hasValidApiKey()) {
      console.warn("Gemini API key not found, using mock implementation");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return mockGenerateFeedback(resumeData, jobDescription);
    }

    const model = genAI.getGenerativeModel({ model: MODEL_ID });

    const prompt = `
    You are the best resume reviewer in the world. Analyze this resume data and provide specific, actionable feedback. Be critical of even the small mistakes, including typos, formatting errors, and other small details. Be very thorough and detailed in your feedback. Pin point the exact issues and be critical while giving the scores.
    
    Resume Data:
    ${JSON.stringify(resumeData, null, 2)}
    
    ${
      jobDescription
        ? `Job Description: ${jobDescription}`
        : "No job description provided."
    }
    
    Provide feedback in the following JSON format:
    [
      {
        "id": "unique-id",
        "type": "warning" | "error" | "success",
        "title": "Brief title of the feedback",
        "description": "Detailed explanation of the issue or strength",
        "section": "The section this applies to (summary, experience, education, skills, contact, general)",
        "suggestion": "Specific suggestion for improvement"
      }
    ]
    
    Focus on:
    1. Content quality and relevance
    2. ATS optimization
    3. Professional presentation
    4. Quantifiable achievements
    5. Keyword matching with job description (if provided)
    
    Provide at least 3 feedback items, with at least one being positive (type: "success").
    
    Respond only with valid JSON, no additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      return JSON.parse(text) as FeedbackItem[];
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      console.log("Raw response:", text);
      return mockGenerateFeedback(resumeData, jobDescription);
    }
  } catch (error) {
    console.error("Error generating feedback with Gemini:", error);
    return mockGenerateFeedback(resumeData, jobDescription);
  }
}

// This function analyzes the resume for ATS compatibility
export async function analyzeATSScore(
  resumeData: ResumeData,
  jobDescription: string
): Promise<ATSScoreResult> {
  try {
    // Check if API key is available
    if (!hasValidApiKey()) {
      console.warn("Gemini API key not found, using mock implementation");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return mockATSAnalysis(resumeData, jobDescription);
    }

    const model = genAI.getGenerativeModel({ model: MODEL_ID });

    const prompt = `
    You are an expert in Applicant Tracking Systems (ATS). Analyze this resume data for ATS compatibility.
    
    Resume Data:
    ${JSON.stringify(resumeData, null, 2)}
    
    ${
      jobDescription
        ? `Job Description: ${jobDescription}`
        : "No job description provided."
    }
    
    Provide an ATS analysis in the following JSON format:
    {
      "overallScore": 85, // A number between 0-100
      "keywordMatch": 75, // A number between 0-100
      "formatScore": 90, // A number between 0-100
      "contentScore": 80, // A number between 0-100
      "missingKeywords": ["keyword1", "keyword2"], // Important keywords from job description missing in resume
      "improvementTips": ["tip1", "tip2", "tip3"], // Specific tips to improve ATS compatibility
      "strengths": ["strength1", "strength2"] // Areas where the resume performs well for ATS
    }
    
    Base your analysis on:
    1. Keyword matching with job description (if provided)
    2. Resume format and structure
    3. Content quality and relevance
    4. Use of industry-standard section headings
    5. Proper formatting of dates, contact info, etc.
    
    Respond only with valid JSON, no additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      return JSON.parse(text) as ATSScoreResult;
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      console.log("Raw response:", text);
      return mockATSAnalysis(resumeData, jobDescription);
    }
  } catch (error) {
    console.error("Error analyzing ATS score with Gemini:", error);
    return mockATSAnalysis(resumeData, jobDescription);
  }
}

// Mock implementation of AI feedback generation
function mockGenerateFeedback(
  resumeData: ResumeData,
  jobDescription: string
): FeedbackItem[] {
  const feedback: FeedbackItem[] = [];

  // Check for summary length and quality
  if (resumeData.personalInfo.summary) {
    if (resumeData.personalInfo.summary.length < 50) {
      feedback.push({
        id: `feedback-${Date.now()}-1`,
        type: "warning",
        title: "Professional Summary Too Brief",
        description:
          "Your professional summary is quite short. Consider expanding it to highlight your key strengths and career achievements.",
        section: "summary",
        suggestion:
          "Experienced software engineer with 8+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable applications that improve business efficiency and user experience. Passionate about clean code, performance optimization, and mentoring junior developers.",
      });
    } else if (
      resumeData.personalInfo.summary.toLowerCase().includes("i am") ||
      resumeData.personalInfo.summary.toLowerCase().includes("my name is")
    ) {
      feedback.push({
        id: `feedback-${Date.now()}-summary-style`,
        type: "warning",
        title: "Avoid First-Person in Summary",
        description:
          "Your summary uses first-person pronouns. Professional summaries typically use third-person perspective.",
        section: "summary",
        suggestion:
          "Experienced professional with expertise in [your field]. Skilled in [key skills] with a proven track record of [achievements]. Dedicated to [your professional values or goals].",
      });
    }
  }

  // Check for experience descriptions
  if (resumeData.experience.length > 0) {
    const experienceWithShortDescriptions = resumeData.experience.filter(
      (exp) => exp.responsibilities.some((resp) => resp.length < 100)
    );

    if (experienceWithShortDescriptions.length > 0) {
      feedback.push({
        id: `feedback-${Date.now()}-2`,
        type: "error",
        title: "Work Experience Needs More Detail",
        description: `${experienceWithShortDescriptions.length} of your job descriptions could use more detail. Add specific achievements and responsibilities.`,
        section: "experience",
        suggestion:
          "• Led development of a high-performance e-commerce platform using React, Node.js, and MongoDB\n• Implemented CI/CD pipelines that reduced deployment time by 40%\n• Optimized database queries resulting in a 30% improvement in application response time\n• Mentored junior developers and conducted code reviews to ensure code quality\n• Collaborated with product managers to define and prioritize features based on user feedback",
      });
    }

    // Check for bullet points in experience
    const experienceWithoutBullets = resumeData.experience.filter(
      (exp) =>
        exp.responsibilities.length > 0 &&
        exp.responsibilities.every(
          (resp) => !resp.includes("•") && !resp.includes("-")
        )
    );

    if (experienceWithoutBullets.length > 0) {
      feedback.push({
        id: `feedback-${Date.now()}-bullets`,
        type: "warning",
        title: "Use Bullet Points for Experience",
        description:
          "Your work experience descriptions would be more readable with bullet points instead of paragraphs.",
        section: "experience",
        suggestion:
          "• Developed and maintained web applications using React and Node.js\n• Reduced page load time by 40% through code optimization\n• Collaborated with cross-functional teams to deliver features on schedule\n• Implemented automated testing that improved code quality and reduced bugs",
      });
    }

    // Check for action verbs
    const actionVerbs = [
      "led",
      "developed",
      "created",
      "implemented",
      "managed",
      "designed",
      "built",
      "improved",
      "increased",
      "reduced",
    ];
    const experienceWithoutActionVerbs = resumeData.experience.filter(
      (exp) =>
        !actionVerbs.some((verb) =>
          exp.responsibilities.some((resp) => resp.toLowerCase().includes(verb))
        )
    );

    if (experienceWithoutActionVerbs.length > 0) {
      feedback.push({
        id: `feedback-${Date.now()}-action-verbs`,
        type: "warning",
        title: "Use Strong Action Verbs",
        description:
          "Start your experience bullet points with strong action verbs to make your achievements more impactful.",
        section: "experience",
        suggestion:
          "• Developed a new customer portal that increased user engagement by 35%\n• Led a team of 5 developers to deliver project ahead of schedule\n• Implemented automated testing framework that reduced bugs by 25%\n• Redesigned database architecture to improve query performance",
      });
    }
  }

  // Check for skills relevance if job description is provided
  if (jobDescription && jobDescription.length > 0) {
    // Extract potential keywords from job description
    const jobKeywords = extractKeywords(jobDescription.toLowerCase());

    // Check if skills match job keywords
    const matchedKeywords = resumeData.skills.filter((skill) =>
      jobKeywords.some((keyword) => skill.name.toLowerCase().includes(keyword))
    );

    if (matchedKeywords.length < 3 && resumeData.skills.length > 0) {
      feedback.push({
        id: `feedback-${Date.now()}-3`,
        type: "warning",
        title: "Skills Don't Match Job Requirements",
        description:
          "Your skills section doesn't strongly match the job description. Consider adding more relevant skills to improve ATS matching.",
        section: "skills",
        suggestion: `Consider adding these skills that match the job description:\n${jobKeywords
          .slice(0, 5)
          .map(
            (keyword) =>
              `- ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`
          )
          .join("\n")}`,
      });
    }

    // Check if summary includes job-specific keywords
    if (resumeData.personalInfo.summary) {
      const summaryKeywordMatches = jobKeywords.filter((keyword) =>
        resumeData.personalInfo.summary.toLowerCase().includes(keyword)
      );

      if (summaryKeywordMatches.length < 2 && jobKeywords.length >= 5) {
        feedback.push({
          id: `feedback-${Date.now()}-summary-keywords`,
          type: "warning",
          title: "Tailor Summary to Job Description",
          description:
            "Your professional summary doesn't include key terms from the job description. Customize it for better ATS matching.",
          section: "summary",
          suggestion: `Consider incorporating these keywords from the job description in your summary: ${jobKeywords
            .slice(0, 3)
            .join(", ")}.`,
        });
      }
    }
  }

  // Check education formatting
  if (resumeData.education.length > 0) {
    const educationWithoutDates = resumeData.education.filter(
      (edu) => !edu.startDate || !edu.endDate
    );

    if (educationWithoutDates.length > 0) {
      feedback.push({
        id: `feedback-${Date.now()}-education-dates`,
        type: "warning",
        title: "Add Dates to Education",
        description:
          "Some of your education entries are missing start or end dates. Complete date information adds credibility.",
        section: "education",
        suggestion:
          "Make sure all education entries include both start and end dates in a consistent format (e.g., 'Sep 2016 - May 2020').",
      });
    }
  }

  // Check for contact information completeness
  const missingContactFields = [];
  if (!resumeData.personalInfo.email) missingContactFields.push("email");
  if (!resumeData.personalInfo.phone) missingContactFields.push("phone");
  if (!resumeData.personalInfo.location) missingContactFields.push("location");

  if (missingContactFields.length > 0) {
    feedback.push({
      id: `feedback-${Date.now()}-contact`,
      type: "error",
      title: "Complete Your Contact Information",
      description: `Your resume is missing important contact details: ${missingContactFields.join(
        ", "
      )}. Recruiters need this information to reach you.`,
      section: "contact",
      suggestion:
        "Add all essential contact information: professional email address, phone number, and location (city, state).",
    });
  }

  // Add a positive feedback if there are achievements
  const hasAchievements = resumeData.experience.some((exp) =>
    exp.responsibilities.some(
      (resp) =>
        resp.includes("increased") ||
        resp.includes("improved") ||
        resp.includes("reduced") ||
        resp.includes("%")
    )
  );

  if (hasAchievements) {
    feedback.push({
      id: `feedback-${Date.now()}-4`,
      type: "success",
      title: "Strong Achievement Focus",
      description:
        "Your resume effectively highlights quantifiable achievements, which is excellent for demonstrating your impact.",
      section: "experience",
      suggestion:
        "Continue to quantify your achievements whenever possible. Consider adding metrics to other accomplishments to further strengthen your resume.",
    });
  } else if (resumeData.experience.length > 0) {
    feedback.push({
      id: `feedback-${Date.now()}-quantify`,
      type: "warning",
      title: "Quantify Your Achievements",
      description:
        "Your experience would be more impactful if you included measurable results and achievements with numbers.",
      section: "experience",
      suggestion:
        "• Increased website conversion rate by 25% through UI/UX improvements\n• Reduced server response time by 40% by optimizing database queries\n• Led a team of 5 developers to deliver project 2 weeks ahead of schedule\n• Decreased customer complaints by 30% by implementing new support system",
    });
  }

  // Check resume length based on experience
  const totalContentLength =
    resumeData.personalInfo.summary.length +
    resumeData.experience.reduce(
      (sum, exp) =>
        sum +
        exp.responsibilities.reduce(
          (respSum, resp) => respSum + resp.length,
          0
        ),
      0
    ) +
    resumeData.education.reduce(
      (sum, edu) =>
        sum + edu.achievements.reduce((achSum, ach) => achSum + ach.length, 0),
      0
    );

  const seniorExperience = resumeData.experience.some(
    (exp) =>
      exp.position.toLowerCase().includes("senior") ||
      exp.position.toLowerCase().includes("lead") ||
      exp.position.toLowerCase().includes("manager")
  );

  if (seniorExperience && totalContentLength < 2000) {
    feedback.push({
      id: `feedback-${Date.now()}-senior-content`,
      type: "warning",
      title: "Add More Detail for Senior Role",
      description:
        "Your resume appears to be for a senior position but lacks sufficient detail. Senior resumes typically need more comprehensive content.",
      section: "general",
      suggestion:
        "Expand your work experience with more detailed achievements, leadership examples, and technical expertise. Senior roles typically require a more comprehensive resume that demonstrates depth of experience.",
    });
  }

  // Always add at least one positive feedback
  if (!feedback.some((item) => item.type === "success")) {
    feedback.push({
      id: `feedback-${Date.now()}-positive`,
      type: "success",
      title: "Well-Structured Resume",
      description:
        "Your resume has a clear, professional structure that is easy to scan.",
      section: "general",
      suggestion:
        "Continue to maintain this clean structure as you update your resume. Consider adding more quantifiable achievements to further strengthen your impact.",
    });
  }

  return feedback;
}

// Mock implementation of ATS score analysis
function mockATSAnalysis(
  resumeData: ResumeData,
  jobDescription: string
): ATSScoreResult {
  // Calculate base scores
  let keywordMatchScore = 70;
  let formatScore = 85;
  let contentScore = 75;

  // Adjust scores based on resume content
  const missingKeywords: string[] = [];
  const improvementTips: string[] = [];
  const strengths: string[] = [];

  // Check for keywords if job description is provided
  if (jobDescription && jobDescription.length > 0) {
    const jobKeywords = extractKeywords(jobDescription.toLowerCase());
    const resumeText = JSON.stringify(resumeData).toLowerCase();

    // Count matched keywords
    const matchedKeywords = jobKeywords.filter((keyword) =>
      resumeText.includes(keyword)
    );
    keywordMatchScore = Math.min(
      100,
      Math.round((matchedKeywords.length / jobKeywords.length) * 100)
    );

    // Identify missing keywords
    jobKeywords.slice(0, 10).forEach((keyword) => {
      if (!resumeText.includes(keyword)) {
        missingKeywords.push(keyword);
      }
    });

    if (missingKeywords.length > 0) {
      improvementTips.push(
        `Add these missing keywords: ${missingKeywords.slice(0, 5).join(", ")}`
      );
    }
  }

  // Check format and structure
  if (resumeData.experience.length === 0) {
    formatScore -= 20;
    improvementTips.push("Add work experience section - critical for ATS");
  }

  if (resumeData.education.length === 0) {
    formatScore -= 15;
    improvementTips.push("Add education section - important for ATS parsing");
  }

  if (resumeData.skills.length < 5) {
    formatScore -= 10;
    improvementTips.push(
      "Add more skills - aim for at least 8-10 relevant skills"
    );
  }

  // Check content quality
  if (
    !resumeData.personalInfo.summary ||
    resumeData.personalInfo.summary.length < 50
  ) {
    contentScore -= 15;
    improvementTips.push(
      "Add a comprehensive professional summary (100-200 words)"
    );
  } else {
    strengths.push("Strong professional summary");
  }

  // Check for quantifiable achievements
  const hasQuantifiableAchievements = resumeData.experience.some((exp) =>
    exp.responsibilities.some((resp) => resp.includes("%") || /\d+/.test(resp))
  );

  if (hasQuantifiableAchievements) {
    contentScore += 10;
    strengths.push("Contains quantifiable achievements");
  } else if (resumeData.experience.length > 0) {
    improvementTips.push(
      "Add numbers and percentages to quantify achievements"
    );
  }

  // Check for contact information
  if (!resumeData.personalInfo.email || !resumeData.personalInfo.phone) {
    formatScore -= 10;
    improvementTips.push(
      "Complete contact information (email and phone are essential)"
    );
  } else {
    strengths.push("Complete contact information");
  }

  // Check for consistent date formatting
  const dateFormats = new Set();
  resumeData.experience.forEach((exp) => {
    if (exp.startDate) dateFormats.add(exp.startDate.split(" ").length);
    if (exp.endDate) dateFormats.add(exp.endDate.split(" ").length);
  });

  if (dateFormats.size > 1) {
    formatScore -= 5;
    improvementTips.push(
      "Use consistent date formatting throughout the resume"
    );
  } else if (dateFormats.size === 1) {
    strengths.push("Consistent date formatting");
  }

  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    keywordMatchScore * 0.4 + formatScore * 0.3 + contentScore * 0.3
  );

  // Ensure we have at least some tips and strengths
  if (improvementTips.length === 0) {
    improvementTips.push("Consider adding more industry-specific terminology");
    improvementTips.push("Ensure all sections have clear, standard headings");
  }

  if (strengths.length === 0) {
    strengths.push("Basic resume structure is in place");
    strengths.push("Contains essential resume sections");
  }

  return {
    overallScore,
    keywordMatch: keywordMatchScore,
    formatScore,
    contentScore,
    missingKeywords: missingKeywords.slice(0, 5),
    improvementTips: improvementTips.slice(0, 5),
    strengths: strengths.slice(0, 3),
  };
}

// This function analyzes text-based resumes for ATS compatibility using Gemini
export async function analyzeResumeText(
  resumeText: string,
  jobDescription: string
): Promise<ATSAnalysis> {
  try {
    // Check if we have a valid API key, if not use mock
    if (!hasValidApiKey()) {
      console.warn("Gemini API key not found, using mock implementation");
      return mockTextBasedAnalysis(resumeText, jobDescription);
    }

    // Try to use Gemini with proper error handling
    const model = genAI.getGenerativeModel({ model: MODEL_ID });

    // Hardcoded prompt for consistent analysis
    const prompt = `You are the world's best ATS (Applicant Tracking System) expert and resume optimization specialist. Your task is to analyze this resume against the job description and provide a detailed, critical assessment.

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

ANALYSIS REQUIREMENTS:
- Be thorough and critical in your evaluation
- Look for exact keyword matches, not just similar terms
- Evaluate formatting, structure, and ATS readability
- Identify specific issues and provide actionable suggestions
- Score each section fairly but critically

Provide your analysis in this EXACT JSON format. Return ONLY the JSON object, no markdown code blocks, no additional text, no triple backticks:
{
  "overallScore": 85,
  "keywordMatch": 75,
  "formatting": 90,
  "readability": 80,
  "sections": [
    {
      "name": "Contact Information",
      "score": 95,
      "issues": ["No LinkedIn profile"],
      "suggestions": ["Add LinkedIn profile for better networking"]
    },
    {
      "name": "Professional Summary",
      "score": 80,
      "issues": ["Too generic"],
      "suggestions": ["Tailor summary to job requirements"]
    },
    {
      "name": "Experience",
      "score": 85,
      "issues": ["Missing quantifiable achievements"],
      "suggestions": ["Add specific metrics and numbers to demonstrate impact"]
    },
    {
      "name": "Education",
      "score": 90,
      "issues": [],
      "suggestions": ["Education section looks good"]
    },
    {
      "name": "Skills",
      "score": 75,
      "issues": ["Some skills don't match job requirements"],
      "suggestions": ["Add more skills mentioned in the job description"]
    },
    {
      "name": "Projects",
      "score": 80,
      "issues": ["Could use more technical detail"],
      "suggestions": ["Include technologies used and outcomes achieved"]
    }
  ],
  "missingKeywords": ["machine learning", "python", "agile"],
  "foundKeywords": ["javascript", "react", "node.js"],
  "suggestions": [
    {
      "priority": "high",
      "category": "Keywords",
      "text": "Add missing technical skills from job description",
      "impact": "Will significantly improve ATS matching score"
    },
    {
      "priority": "medium",
      "category": "Content",
      "text": "Quantify achievements with specific numbers and percentages",
      "impact": "Will make resume more impactful and ATS-friendly"
    },
    {
      "priority": "low",
      "category": "Formatting",
      "text": "Ensure consistent formatting throughout all sections",
      "impact": "Will improve readability and professional appearance"
    }
  ]
}

Base your analysis on:
1. Keyword matching between resume and job description
2. Resume formatting and structure
3. Content quality and relevance
4. Use of industry-standard terminology
5. Quantifiable achievements
6. Professional presentation

For sections, analyze: Contact Info, Summary, Experience, Education, Skills, Projects
For suggestions, prioritize based on impact on ATS score
For keywords, focus on technical skills, tools, and methodologies mentioned in the job description

Respond only with valid JSON, no additional text.`;

    console.log("Attempting to use Gemini API for resume analysis...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log(
      "Gemini API response received:",
      text.substring(0, 200) + "..."
    );

    try {
      // Clean the response by removing markdown code blocks
      let cleanedText = text.trim();

      // Remove ```json and ``` markers if present
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.replace(/^```json\s*/, "");
      }
      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```\s*/, "");
      }
      if (cleanedText.endsWith("```")) {
        cleanedText = cleanedText.replace(/\s*```$/, "");
      }

      console.log(
        "Cleaned response for parsing:",
        cleanedText.substring(0, 200) + "..."
      );

      const parsedResponse = JSON.parse(cleanedText) as ATSAnalysis;
      console.log("Successfully parsed Gemini response");
      return parsedResponse;
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      console.log("Raw response:", text);
      console.log("Falling back to mock analysis due to parsing error");
      return mockTextBasedAnalysis(resumeText, jobDescription);
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    console.log("Falling back to mock analysis due to API error");
    return mockTextBasedAnalysis(resumeText, jobDescription);
  }
}

// Mock implementation for text-based analysis
function mockTextBasedAnalysis(
  resumeText: string,
  jobDescription: string
): ATSAnalysis {
  // Extract potential keywords from job description
  const jobKeywords = extractKeywords(jobDescription.toLowerCase());
  const resumeTextLower = resumeText.toLowerCase();

  // Calculate keyword match
  const matchedKeywords = jobKeywords.filter((keyword) =>
    resumeTextLower.includes(keyword)
  );
  const keywordMatch = Math.min(
    100,
    Math.round((matchedKeywords.length / Math.max(jobKeywords.length, 1)) * 100)
  );

  // More sophisticated scoring
  let formattingScore = 85;
  let readabilityScore = 80;

  // Check for proper formatting
  if (resumeText.includes("EDUCATION") || resumeText.includes("Education"))
    formattingScore += 5;
  if (resumeText.includes("EXPERIENCE") || resumeText.includes("Experience"))
    formattingScore += 5;
  if (resumeText.includes("SKILLS") || resumeText.includes("Skills"))
    formattingScore += 5;
  if (resumeText.includes("•") || resumeText.includes("-"))
    readabilityScore += 5;
  if (resumeText.includes("@") && resumeText.includes("phone"))
    formattingScore += 5;

  // Calculate overall score
  const overallScore = Math.round(
    keywordMatch * 0.4 +
      Math.min(95, formattingScore) * 0.3 +
      Math.min(95, readabilityScore) * 0.3
  );

  // Generate sections analysis
  const sections = [
    {
      name: "Contact Information",
      score: resumeText.includes("@") && resumeText.includes("phone") ? 95 : 70,
      issues: resumeText.includes("@") ? [] : ["Missing email address"],
      suggestions: resumeText.includes("@")
        ? ["Contact info looks good"]
        : ["Add professional email address"],
    },
    {
      name: "Professional Summary",
      score:
        resumeText.includes("summary") || resumeText.includes("objective")
          ? 85
          : 60,
      issues: resumeText.includes("summary")
        ? []
        : ["No clear summary section"],
      suggestions: resumeText.includes("summary")
        ? ["Summary is present"]
        : ["Add a professional summary section"],
    },
    {
      name: "Experience",
      score:
        resumeText.includes("experience") || resumeText.includes("work")
          ? 80
          : 50,
      issues: resumeText.includes("experience")
        ? []
        : ["No work experience section"],
      suggestions: resumeText.includes("experience")
        ? ["Experience section present"]
        : ["Add work experience section"],
    },
    {
      name: "Skills",
      score:
        resumeText.includes("skills") || resumeText.includes("technical")
          ? 85
          : 60,
      issues: resumeText.includes("skills") ? [] : ["No skills section"],
      suggestions: resumeText.includes("skills")
        ? ["Skills section present"]
        : ["Add technical skills section"],
    },
  ];

  // Generate suggestions
  const suggestions = [
    {
      priority: (keywordMatch < 60 ? "high" : "medium") as
        | "high"
        | "medium"
        | "low",
      category: "Keywords",
      text:
        keywordMatch < 60
          ? "Add more keywords from job description"
          : "Consider adding a few more relevant keywords",
      impact:
        keywordMatch < 60
          ? "Will significantly improve ATS matching"
          : "Will slightly improve ATS matching",
    },
    {
      priority: (resumeText.length < 800 ? "medium" : "low") as
        | "high"
        | "medium"
        | "low",
      category: "Content",
      text:
        resumeText.length < 800
          ? "Resume seems brief - consider adding more detail"
          : "Resume length looks appropriate",
      impact:
        resumeText.length < 800
          ? "More detail will improve recruiter impression"
          : "Current length is good for ATS",
    },
  ];

  return {
    overallScore,
    keywordMatch,
    formatting: Math.min(95, formattingScore),
    readability: Math.min(95, readabilityScore),
    sections,
    missingKeywords: jobKeywords
      .slice(0, 5)
      .filter((keyword) => !resumeTextLower.includes(keyword)),
    foundKeywords: matchedKeywords.slice(0, 5),
    suggestions,
  };
}

// Helper function to extract potential keywords from job description
function extractKeywords(text: string): string[] {
  // Common technical skills and keywords
  const commonKeywords = [
    "javascript",
    "react",
    "node",
    "python",
    "java",
    "c#",
    "ruby",
    "php",
    "html",
    "css",
    "aws",
    "azure",
    "gcp",
    "cloud",
    "docker",
    "kubernetes",
    "devops",
    "ci/cd",
    "agile",
    "sql",
    "nosql",
    "mongodb",
    "postgresql",
    "mysql",
    "database",
    "frontend",
    "backend",
    "fullstack",
    "mobile",
    "android",
    "ios",
    "react native",
    "flutter",
    "swift",
    "kotlin",
    "machine learning",
    "ai",
    "data science",
    "analytics",
    "blockchain",
    "security",
    "testing",
    "qa",
    "product management",
    "scrum",
    "leadership",
    "communication",
  ];

  return commonKeywords.filter((keyword) => text.includes(keyword));
}
