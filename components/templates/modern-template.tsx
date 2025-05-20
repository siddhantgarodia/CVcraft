import type { ResumeData } from "@/lib/types"
import Image from "next/image"

interface ModernTemplateProps {
  resumeData: ResumeData
  profileImage?: string | null
}

export default function ModernTemplate({ resumeData, profileImage }: ModernTemplateProps) {
  const { personalInfo, experience, education, skills } = resumeData

  return (
    <div className="bg-white p-8 shadow-sm min-h-[1056px] w-[816px] mx-auto font-sans">
      <div className="flex flex-col md:flex-row gap-8 relative">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-slate-100 p-6 rounded-lg">
          <div className="mb-8 text-center">
            <div className="w-32 h-32 bg-slate-300 rounded-full mx-auto mb-4 overflow-hidden relative">
              {profileImage ? (
                <Image src={profileImage || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-300"></div>
              )}
            </div>
            <h1 className="text-xl font-bold text-slate-800">{personalInfo.fullName}</h1>
            <p className="text-slate-600">{personalInfo.title}</p>
          </div>

          {(personalInfo.email ||
            personalInfo.phone ||
            personalInfo.location ||
            personalInfo.website ||
            personalInfo.linkedin ||
            personalInfo.github) && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3 text-slate-700 border-b border-slate-300 pb-1">
                Contact
              </h2>
              <ul className="space-y-2 text-sm">
                {personalInfo.email && (
                  <li className="flex items-start">
                    <span className="font-medium w-16">Email:</span>
                    <span className="text-slate-700 break-all">{personalInfo.email}</span>
                  </li>
                )}
                {personalInfo.phone && (
                  <li className="flex items-start">
                    <span className="font-medium w-16">Phone:</span>
                    <span className="text-slate-700">{personalInfo.phone}</span>
                  </li>
                )}
                {personalInfo.location && (
                  <li className="flex items-start">
                    <span className="font-medium w-16">Location:</span>
                    <span className="text-slate-700">{personalInfo.location}</span>
                  </li>
                )}
                {personalInfo.website && (
                  <li className="flex items-start">
                    <span className="font-medium w-16">Website:</span>
                    <span className="text-slate-700 break-all">{personalInfo.website}</span>
                  </li>
                )}
                {personalInfo.linkedin && (
                  <li className="flex items-start">
                    <span className="font-medium w-16">LinkedIn:</span>
                    <span className="text-slate-700 break-all">{personalInfo.linkedin}</span>
                  </li>
                )}
                {personalInfo.github && (
                  <li className="flex items-start">
                    <span className="font-medium w-16">GitHub:</span>
                    <span className="text-slate-700 break-all">{personalInfo.github}</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-3 text-slate-700 border-b border-slate-300 pb-1">
                Skills
              </h2>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-xs text-slate-600">{skill.level}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div
                        className="bg-slate-600 h-1.5 rounded-full"
                        style={{
                          width:
                            skill.level === "Beginner"
                              ? "25%"
                              : skill.level === "Intermediate"
                                ? "50%"
                                : skill.level === "Advanced"
                                  ? "75%"
                                  : "90%",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="w-full md:w-2/3">
          {personalInfo.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-800 mb-3 pb-1 border-b border-slate-200">
                Professional Summary
              </h2>
              <p className="text-slate-700 text-sm leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 pb-1 border-b border-slate-200">Work Experience</h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-slate-800">{exp.title}</h3>
                      <span className="text-xs text-slate-600">
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm text-slate-700">{exp.company}</p>
                      <p className="text-xs text-slate-600">{exp.location}</p>
                    </div>
                    <p className="text-sm text-slate-700 whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 pb-1 border-b border-slate-200">Education</h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="mb-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-slate-800">{edu.degree}</h3>
                      <span className="text-xs text-slate-600">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm text-slate-700">{edu.institution}</p>
                      <p className="text-xs text-slate-600">{edu.location}</p>
                    </div>
                    {edu.description && <p className="text-sm text-slate-700">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
