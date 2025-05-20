import type { ResumeData } from "@/lib/types"
import Image from "next/image"

interface ClassicTemplateProps {
  resumeData: ResumeData
  profileImage?: string | null
}

export default function ClassicTemplate({ resumeData, profileImage }: ClassicTemplateProps) {
  const { personalInfo, experience, education, skills } = resumeData

  return (
    <div
      className="bg-white p-8 shadow-sm min-h-[1056px] w-[816px] mx-auto"
      style={{ fontFamily: "'Times New Roman', serif" }}
    >
      <header className="text-center mb-8 pb-4 border-b-2 border-slate-300">
        {profileImage && (
          <div className="mb-4 flex justify-center">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <Image
                src={profileImage || "/placeholder.svg"}
                alt="Profile"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        <h1 className="text-3xl font-bold text-slate-900 mb-1">{personalInfo.fullName}</h1>
        {personalInfo.title && <p className="text-xl text-slate-700 mb-3">{personalInfo.title}</p>}

        <div className="flex flex-wrap justify-center gap-x-4 text-sm text-slate-700">
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
          <h2 className="text-xl font-bold text-slate-900 mb-3 uppercase">Summary</h2>
          <p className="text-slate-700">{personalInfo.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase">Experience</h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-bold text-slate-800">{exp.title}</h3>
                  <span className="text-slate-600">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <p className="font-semibold text-slate-700">{exp.company}</p>
                  <p className="text-slate-600">{exp.location}</p>
                </div>
                <p className="text-slate-700 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase">Education</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-bold text-slate-800">{edu.degree}</h3>
                  <span className="text-slate-600">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <p className="font-semibold text-slate-700">{edu.institution}</p>
                  <p className="text-slate-600">{edu.location}</p>
                </div>
                {edu.description && <p className="text-slate-700">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.id} className="bg-slate-100 text-slate-800 px-3 py-1 rounded-md text-sm">
                {skill.name} {skill.level !== "Beginner" && `(${skill.level})`}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
