import type { ResumeData } from "@/lib/types"
import Image from "next/image"

interface MinimalTemplateProps {
  resumeData: ResumeData
  profileImage?: string | null
}

export default function MinimalTemplate({ resumeData, profileImage }: MinimalTemplateProps) {
  const { personalInfo, experience, education, skills } = resumeData

  return (
    <div
      className="bg-white p-8 shadow-sm min-h-[1056px] w-[816px] mx-auto"
      style={{ fontFamily: "'Times New Roman', serif" }}
    >
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {profileImage && (
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={profileImage || "/placeholder.svg"}
                alt="Profile"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">{personalInfo.fullName}</h1>
            {personalInfo.title && <p className="text-lg text-slate-600">{personalInfo.title}</p>}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600">
          {personalInfo.email && <span className="break-all">{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span className="break-all">{personalInfo.website}</span>}
          {personalInfo.linkedin && <span className="break-all">{personalInfo.linkedin}</span>}
          {personalInfo.github && <span className="break-all">{personalInfo.github}</span>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-6">
          <p className="text-slate-700 leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-1">Experience</h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-slate-800">{exp.title}</h3>
                  <span className="text-sm text-slate-500">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <p className="text-slate-700">{exp.company}</p>
                  <p className="text-sm text-slate-500">{exp.location}</p>
                </div>
                <p className="text-slate-600 text-sm whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-1">Education</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-slate-800">{edu.degree}</h3>
                  <span className="text-sm text-slate-500">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <p className="text-slate-700">{edu.institution}</p>
                  <p className="text-sm text-slate-500">{edu.location}</p>
                </div>
                {edu.description && <p className="text-slate-600 text-sm">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-1">Skills</h2>
          <div className="flex flex-wrap gap-1">
            {skills.map((skill) => (
              <span key={skill.id} className="border border-slate-200 text-slate-700 px-3 py-1 rounded-sm text-sm">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
