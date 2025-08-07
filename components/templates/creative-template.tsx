import type { ResumeData } from "@/lib/types";
import Image from "next/image";

interface CreativeTemplateProps {
  resumeData: ResumeData;
  profileImage?: string | null;
}

export default function CreativeTemplate({
  resumeData,
  profileImage,
}: CreativeTemplateProps) {
  const { personalInfo, experience, education, skills } = resumeData;
  const accentColor = "emerald";

  return (
    <div className="bg-white shadow-sm min-h-[1056px] w-[816px] mx-auto font-sans">
      {/* Header with accent color */}
      <div
        className={`bg-${accentColor}-600 text-white p-8`}
        style={{ backgroundColor: "#059669" }}
      >
        <div className="flex items-center gap-4">
          {profileImage && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
              <Image
                src={profileImage || "/placeholder.svg"}
                alt="Profile"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold mb-1">{personalInfo.fullName}</h1>
            {personalInfo.title && (
              <p className="text-xl opacity-90">{personalInfo.title}</p>
            )}
          </div>
        </div>

        {personalInfo.summary && (
          <p className="text-sm leading-relaxed opacity-90 mt-4 max-w-2xl">
            {personalInfo.summary}
          </p>
        )}
      </div>

      {/* Contact info bar */}
      <div
        className={`bg-${accentColor}-700 text-white px-8 py-3 flex flex-wrap gap-x-6 gap-y-1 text-sm`}
        style={{ backgroundColor: "#047857" }}
      >
        {personalInfo.email && (
          <span className="break-all">{personalInfo.email}</span>
        )}
        {personalInfo.phone && <span>{personalInfo.phone}</span>}
        {personalInfo.location && <span>{personalInfo.location}</span>}
        {personalInfo.website && (
          <span className="break-all">{personalInfo.website}</span>
        )}
        {personalInfo.linkedin && (
          <span className="break-all">{personalInfo.linkedin}</span>
        )}
        {personalInfo.github && (
          <span className="break-all">{personalInfo.github}</span>
        )}
      </div>

      <div className="p-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left column */}
          <div className="col-span-2 space-y-8">
            {experience.length > 0 && (
              <section>
                <h2
                  className={`text-xl font-bold text-${accentColor}-700 mb-4 flex items-center`}
                  style={{ color: "#047857" }}
                >
                  <span
                    className={`bg-${accentColor}-700 w-4 h-4 inline-block mr-2`}
                    style={{ backgroundColor: "#047857" }}
                  ></span>
                  Experience
                </h2>
                <div className="space-y-6">
                  {experience.map((exp) => (
                    <div
                      key={exp.id}
                      className={`relative pl-6 border-l-2 border-${accentColor}-200`}
                      style={{ borderColor: "#A7F3D0" }}
                    >
                      <div
                        className={`absolute w-3 h-3 bg-${accentColor}-500 rounded-full -left-[7px] top-1`}
                        style={{ backgroundColor: "#10B981" }}
                      ></div>
                      <div className="mb-1">
                        <h3 className="text-lg font-bold text-slate-800">
                          {exp.position}
                        </h3>
                        <p
                          className={`font-medium text-${accentColor}-600`}
                          style={{ color: "#059669" }}
                        >
                          {exp.company}
                        </p>
                      </div>
                      <div className="flex justify-between items-baseline mb-2 text-sm">
                        <p className="text-slate-600">{exp.location}</p>
                        <p className="text-slate-600">
                          {exp.startDate} -{" "}
                          {exp.current ? "Present" : exp.endDate}
                        </p>
                      </div>
                      <ul className="text-slate-700 text-sm list-disc list-inside space-y-1">
                        {exp.responsibilities.map((resp, index) => (
                          <li key={index}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {education.length > 0 && (
              <section>
                <h2
                  className={`text-xl font-bold text-${accentColor}-700 mb-4 flex items-center`}
                  style={{ color: "#047857" }}
                >
                  <span
                    className={`bg-${accentColor}-700 w-4 h-4 inline-block mr-2`}
                    style={{ backgroundColor: "#047857" }}
                  ></span>
                  Education
                </h2>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      className={`relative pl-6 border-l-2 border-${accentColor}-200`}
                      style={{ borderColor: "#A7F3D0" }}
                    >
                      <div
                        className={`absolute w-3 h-3 bg-${accentColor}-500 rounded-full -left-[7px] top-1`}
                        style={{ backgroundColor: "#10B981" }}
                      ></div>
                      <div className="mb-1">
                        <h3 className="text-lg font-bold text-slate-800">
                          {edu.degree}
                        </h3>
                        <p
                          className={`font-medium text-${accentColor}-600`}
                          style={{ color: "#059669" }}
                        >
                          {edu.institution}
                        </p>
                      </div>
                      <div className="flex justify-between items-baseline mb-2 text-sm">
                        <p className="text-slate-600">{edu.location}</p>
                        <p className="text-slate-600">
                          {edu.startDate} - {edu.endDate}
                        </p>
                      </div>
                      {edu.achievements.length > 0 && (
                        <ul className="text-slate-700 text-sm list-disc list-inside space-y-1">
                          {edu.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-8">
            {skills.length > 0 && (
              <section>
                <h2
                  className={`text-xl font-bold text-${accentColor}-700 mb-4 flex items-center`}
                  style={{ color: "#047857" }}
                >
                  <span
                    className={`bg-${accentColor}-700 w-4 h-4 inline-block mr-2`}
                    style={{ backgroundColor: "#047857" }}
                  ></span>
                  Skills
                </h2>
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-slate-800">
                          {skill.name}
                        </span>
                        <span
                          className={`text-xs text-${accentColor}-600`}
                          style={{ color: "#059669" }}
                        >
                          {skill.level}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div
                          className={`bg-${accentColor}-500 h-1.5 rounded-full`}
                          style={{
                            backgroundColor: "#10B981",
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
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
