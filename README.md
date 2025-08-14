# 🚀 CVCraft - Professional Resume Builder

> **Create beautiful, ATS-optimized resumes with LaTeX support and real-time preview**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-blue)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## ✨ Features

### 🎨 **Beautiful Resume Builder**

- **Real-time Preview**: See changes instantly as you type
- **Drag & Drop Sections**: Reorder resume sections with intuitive drag-and-drop
- **Multiple Templates**: Choose from Modern, Classic, Minimal, and Academic styles
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 🔧 **Advanced Editor**

- **Smart Forms**: Intuitive input fields for all resume sections
- **Auto-save**: Your work is automatically saved locally
- **Section Management**: Add, remove, and customize resume sections
- **Font Controls**: Adjust font family and size in real-time
- **Zoom Controls**: Preview at different zoom levels

### 📄 **Export Options**

- **PDF Export**: Generate professional PDF resumes
- **LaTeX Support**: Download LaTeX source code for advanced customization
- **Overleaf Integration**: Ready for professional LaTeX compilation
- **Multiple Formats**: Support for various resume standards

### 🎯 **ATS Optimization**

- **Keyword Analysis**: Get suggestions for job-specific keywords
- **Format Validation**: Ensure your resume passes ATS screening
- **Score Tracking**: Monitor your resume's ATS compatibility
- **Smart Suggestions**: AI-powered recommendations for improvement

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.2.4, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Drag & Drop**: @dnd-kit for intuitive section reordering
- **PDF Generation**: jsPDF for client-side PDF creation
- **LaTeX**: Custom LaTeX generation with multiple templates
- **State Management**: React hooks with local storage persistence

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### AI Features Setup (Optional)

CVCraft includes AI-powered resume analysis using Google's Gemini AI. To enable these features:

1. **Get a Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

2. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```bash
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Available AI Features**
   - **Resume Feedback**: Get detailed suggestions for improving your resume
   - **ATS Analysis**: Analyze how well your resume will perform with Applicant Tracking Systems
   - **Keyword Matching**: Identify missing keywords from job descriptions

> **Note**: If no API key is provided, the app will use mock data for AI features.

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/cvcraft.git
   cd cvcraft
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### 1. **Create Your Resume**

- Navigate to `/builder` to start building
- Fill in your personal information
- Add education, experience, projects, and skills
- Use the drag-and-drop interface to reorder sections

### 2. **Customize Your Design**

- Choose from multiple LaTeX templates
- Adjust font family and size
- Control panel widths and zoom levels
- Preview changes in real-time

### 3. **Export Your Resume**

- **PDF**: Click "Export PDF" for immediate download
- **LaTeX**: Download `.tex` file for advanced customization
- **Overleaf**: Upload LaTeX code to Overleaf for professional compilation

### 4. **ATS Analysis**

- Visit `/analysis` for detailed resume analysis
- Upload job descriptions for keyword matching
- Get actionable improvement suggestions
- Track your resume's ATS score

## 🎨 Templates

### **Modern Template**

- Clean, professional design
- Blue accent colors
- Segoe UI fonts
- Perfect for tech and business roles

### **Classic Template**

- Traditional black and white
- Times Roman fonts
- Formal academic style
- Ideal for conservative industries

### **Minimal Template**

- Simple, elegant design
- Gray color scheme
- Helvetica fonts
- Great for creative fields

### **Academic Template**

- Research-focused layout
- Dark blue accents
- Times Roman fonts
- Perfect for academic positions

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript compiler

# Utilities
npm run clean        # Clean build cache
npm run export       # Export static site
```

## 📁 Project Structure

```
cvcraft/
├── app/                    # Next.js app directory
│   ├── builder/           # Resume builder page
│   ├── analysis/          # ATS analysis page
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   └── templates/         # Resume template components
├── lib/                    # Utility functions
│   ├── templates/         # LaTeX template generators
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # Helper functions
├── styles/                 # Global styles
└── public/                 # Static assets
```

## 🎯 Key Components

### **Builder Page** (`/builder`)

- Main resume creation interface
- Real-time preview with live editing
- Drag-and-drop section management
- Multiple export options

### **Analysis Page** (`/analysis`)

- ATS compatibility scoring
- Keyword analysis and suggestions
- Detailed improvement recommendations
- Job description matching

### **LaTeX Generation**

- Multiple template engines
- Customizable output formats
- Overleaf-ready code generation
- Professional typography

## 🚀 Deployment

### **Vercel (Recommended)**

```bash
npm install -g vercel
vercel
```

### **Netlify**

```bash
npm run build
npm run export
# Deploy the 'out' folder
```

### **Docker**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Setup**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Code Style**

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful component library
- **@dnd-kit** for excellent drag-and-drop functionality
- **Next.js team** for the amazing framework
- **Tailwind CSS** for utility-first styling

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/cvcraft/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/cvcraft/discussions)
- **Email**: support@cvcraft.com

## 🔮 Roadmap

- [ ] **AI Resume Writer**: AI-powered content suggestions
- [ ] **More Templates**: Additional design options
- [ ] **Collaboration**: Team resume building features
- [ ] **Analytics**: Resume performance tracking
- [ ] **Mobile App**: Native mobile applications
- [ ] **API Access**: Public API for integrations

---

**Made with ❤️ by the CVCraft Team**

_Transform your career with professional resumes that get you noticed!_
