import type { ResumeData } from "./types"

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: "Alex Johnson",
    title: "Senior Software Engineer",
    email: "alex.johnson@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    website: "alexjohnson.dev",
    linkedin: "linkedin.com/in/alexjohnson",
    github: "github.com/alexjohnson",
    summary:
      "Experienced software engineer with 8+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about creating scalable, user-friendly applications and mentoring junior developers.",
  },
  experience: [
    {
      id: "exp-1",
      title: "Senior Software Engineer",
      company: "Tech Innovations Inc.",
      location: "San Francisco, CA",
      startDate: "Jan 2020",
      endDate: "Present",
      current: true,
      description:
        "• Led a team of 5 developers in building a high-performance e-commerce platform using React, Node.js, and MongoDB\n• Implemented CI/CD pipelines that reduced deployment time by 40%\n• Optimized database queries resulting in a 30% improvement in application response time\n• Mentored junior developers and conducted code reviews to ensure code quality",
    },
    {
      id: "exp-2",
      title: "Software Engineer",
      company: "WebSolutions Co.",
      location: "Oakland, CA",
      startDate: "Mar 2017",
      endDate: "Dec 2019",
      current: false,
      description:
        "• Developed and maintained RESTful APIs for client applications using Express.js\n• Created responsive web interfaces with React and Redux\n• Collaborated with UX designers to implement user-friendly interfaces\n• Participated in agile development processes, including daily stand-ups and sprint planning",
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "Master of Science in Computer Science",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      startDate: "Aug 2015",
      endDate: "May 2017",
      description: "Specialized in Software Engineering and Artificial Intelligence. GPA: 3.8/4.0",
    },
    {
      id: "edu-2",
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Washington",
      location: "Seattle, WA",
      startDate: "Sep 2011",
      endDate: "Jun 2015",
      description: "Dean's List, Computer Science Club President",
    },
  ],
  skills: [
    {
      id: "skill-1",
      name: "JavaScript",
      level: "Expert",
    },
    {
      id: "skill-2",
      name: "React",
      level: "Expert",
    },
    {
      id: "skill-3",
      name: "Node.js",
      level: "Advanced",
    },
    {
      id: "skill-4",
      name: "TypeScript",
      level: "Advanced",
    },
    {
      id: "skill-5",
      name: "MongoDB",
      level: "Intermediate",
    },
    {
      id: "skill-6",
      name: "AWS",
      level: "Intermediate",
    },
    {
      id: "skill-7",
      name: "Docker",
      level: "Intermediate",
    },
    {
      id: "skill-8",
      name: "GraphQL",
      level: "Intermediate",
    },
  ],
}
