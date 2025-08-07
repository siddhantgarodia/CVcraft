# CVCraft - Dynamic Resume Builder

A modern, feature-rich resume builder with real-time preview, ATS analysis, and LaTeX export capabilities.

## 🚀 New Features Added

### 1. Custom Sections Functionality ✨

- **Dynamic Section Creation**: Add custom sections with flexible content types
- **Multiple Format Types**:
  - List format (with title, subtitle, dates, location, bullet points)
  - Text block format (free-form content)
  - Skills format (categorized skills listing)
- **Full CRUD Operations**: Add, edit, and remove custom sections and their items
- **Real-time Preview**: See changes instantly in the resume preview

### 2. LaTeX Code Generation & Download 📄

- **Automatic LaTeX Generation**: Real-time conversion of resume data to professional LaTeX code
- **Professional Template**: Uses a clean, ATS-friendly LaTeX template
- **Download Functionality**: Export your resume as a `.tex` file
- **Escape Handling**: Proper LaTeX character escaping for special characters
- **Custom Sections Support**: All custom sections are included in LaTeX output

### 3. Page Break Visualization 📏

- **Visual Page Breaks**: See exactly where your resume will break across pages
- **Toggle Option**: Show/hide page break indicators
- **Page Numbers**: Clear indication of Page 1, Page 2, etc.
- **Responsive Design**: Page breaks adjust based on content length

### 4. ATS Analysis & Scoring 🎯

- **Real-time ATS Analysis**: Analyze resume compatibility with job descriptions
- **Comprehensive Scoring**: Overall score, keyword matching, formatting, readability
- **Job Description Integration**: Paste job postings for targeted analysis
- **Missing Keywords Detection**: Identifies important keywords you should add
- **Smart Suggestions**: AI-powered recommendations for improvement
- **API Integration**: Built with scalable API architecture for future Gemini AI integration

### 5. Comprehensive Analysis Dashboard 📊

- **Dedicated Analysis Page**: Separate page for detailed resume analysis (`/analysis`)
- **Multi-tab Interface**: Upload, Analysis, and Results tabs
- **Section-by-Section Analysis**: Detailed breakdown of each resume section
- **Priority-based Suggestions**: High, medium, and low priority recommendations
- **Visual Analytics**: Progress bars, color-coded scores, and badges
- **Export Reports**: Print-friendly analysis reports

## 🛠️ Technical Implementation

### Architecture

- **Next.js 15.2.4**: Latest Next.js with App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first styling with shadcn/ui components
- **API Routes**: RESTful API for ATS analysis
- **Local Storage**: Persistent data storage with auto-save functionality

### Key Components

```
📁 app/
├── 📁 builder/
│   └── page.tsx (Main resume builder with all dynamic features)
├── 📁 analysis/
│   └── page.tsx (Comprehensive ATS analysis dashboard)
└── 📁 api/
    └── 📁 ats-analysis/
        └── route.ts (ATS analysis API endpoint)
```

### Data Structure

```typescript
// Enhanced Resume Data Structure
{
  personalInfo: { name, phone, email, linkedin, github },
  education: [{ institution, location, degree, dates }],
  experience: [{ position, company, location, dates, points[] }],
  projects: [{ title, technologies, dates, points[] }],
  skills: [{ name, skills }],
  customSections: [{
    id, title, type: 'list'|'text'|'skills',
    items: [{ title, subtitle, dates, location, points[] }],
    content: string
  }]
}
```

## 🎨 UI/UX Enhancements

### Dynamic Features

- **Auto-save**: Automatic saving with visual indicators
- **Progress Tracking**: Real-time completion percentage
- **Collapsible Sections**: Clean, organized interface
- **Real-time Validation**: Instant feedback on required fields
- **Smooth Animations**: Enhanced user experience with transitions

### Visual Feedback

- **Status Indicators**: Save status, completion progress, validation errors
- **Color-coded Scoring**: Visual score representation
- **Interactive Elements**: Hover effects, focus states
- **Responsive Design**: Works seamlessly on all devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/cvcraft.git

# Navigate to project directory
cd cvcraft

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

### Usage

1. **Build Your Resume**

   - Navigate to `/builder`
   - Fill in your information using the dynamic form
   - Add custom sections as needed
   - Watch real-time preview updates

2. **Download Options**

   - **PDF**: Professional PDF generation
   - **LaTeX**: Download LaTeX source code

3. **ATS Analysis**

   - Paste a job description in the ATS section
   - Click "Analyze Resume" for instant scoring
   - Visit `/analysis` for detailed breakdown

4. **Custom Sections**
   - Add unlimited custom sections
   - Choose from list, text, or skills formats
   - Full editing capabilities

## 🔧 API Integration

### ATS Analysis Endpoint

```typescript
POST /api/ats-analysis
{
  "resumeText": "string",
  "jobDescription": "string"
}

Response: {
  "overallScore": number,
  "keywordMatch": number,
  "formatting": number,
  "readability": number,
  "sections": Array,
  "missingKeywords": string[],
  "foundKeywords": string[],
  "suggestions": Array
}
```

### Future Gemini AI Integration

The API is designed to easily integrate with Google's Gemini AI for more sophisticated analysis:

```typescript
// Future implementation
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const prompt = `Analyze this resume for the given job description...`;
const result = await model.generateContent(prompt);
```

## 📱 Features Overview

| Feature                  | Status      | Description                                         |
| ------------------------ | ----------- | --------------------------------------------------- |
| ✅ Custom Sections       | Complete    | Add unlimited custom sections with flexible formats |
| ✅ LaTeX Export          | Complete    | Download professional LaTeX code                    |
| ✅ Page Break Preview    | Complete    | Visual page break indicators                        |
| ✅ ATS Analysis          | Complete    | AI-powered resume analysis                          |
| ✅ Detailed Analytics    | Complete    | Comprehensive analysis dashboard                    |
| ✅ Auto-save             | Complete    | Automatic data persistence                          |
| ✅ Progress Tracking     | Complete    | Real-time completion percentage                     |
| ✅ Responsive Design     | Complete    | Mobile-friendly interface                           |
| 🔄 Gemini AI Integration | In Progress | Advanced AI analysis                                |
| 🔄 Drag & Drop           | Planned     | Reorder sections easily                             |

## 🎯 Use Cases

1. **Job Seekers**: Create tailored resumes for specific job applications
2. **Students**: Build academic CVs with custom sections for research, publications
3. **Professionals**: Generate LaTeX code for academic or professional submissions
4. **Recruiters**: Analyze candidate resumes for ATS compatibility
5. **Career Counselors**: Provide data-driven resume improvement advice

## 🔐 Data Privacy

- **Local Storage**: All resume data is stored locally in your browser
- **No Data Collection**: We don't store or collect your personal information
- **API Calls**: Only anonymous analysis data is sent to our API
- **Secure**: All communications are encrypted

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🚀 Future Roadmap

- **AI-Powered Suggestions**: Integration with Gemini AI for advanced recommendations
- **Template Variety**: Multiple resume templates and styles
- **Collaboration Features**: Share and collaborate on resumes
- **Export Options**: Additional export formats (Word, HTML)
- **Analytics Dashboard**: Track application success rates
- **Integration**: Connect with job boards and application tracking systems

---

**CVCraft** - Crafting careers, one resume at a time. ✨
