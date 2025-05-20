"use client"

import type React from "react"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Trash2,
  GripVertical,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Phone,
  Mail,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Upload,
  ImageIcon,
} from "lucide-react"
import type { ResumeData } from "@/lib/types"
import Image from "next/image"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"

interface ResumeEditorProps {
  resumeData: ResumeData
  setResumeData: (data: ResumeData) => void
  profileImage: string | null
  onProfileImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

// Sortable item component for experience
function SortableExperienceItem({
  experience,
  index,
  updateExperience,
  removeExperience,
}: {
  experience: any
  index: number
  updateExperience: (index: number, field: string, value: string | boolean) => void
  removeExperience: (index: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: experience.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="mb-6 border rounded-md p-4 relative">
      <div className="absolute top-2 right-2 flex space-x-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeExperience(index)}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 cursor-move" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4 text-slate-400" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor={`job-title-${index}`}>Job Title</Label>
          <Input
            id={`job-title-${index}`}
            value={experience.title}
            onChange={(e) => updateExperience(index, "title", e.target.value)}
            placeholder="Senior Software Engineer"
          />
        </div>
        <div>
          <Label htmlFor={`company-${index}`}>Company</Label>
          <Input
            id={`company-${index}`}
            value={experience.company}
            onChange={(e) => updateExperience(index, "company", e.target.value)}
            placeholder="Tech Company Inc."
          />
        </div>
        <div>
          <Label htmlFor={`location-${index}`}>Location</Label>
          <Input
            id={`location-${index}`}
            value={experience.location}
            onChange={(e) => updateExperience(index, "location", e.target.value)}
            placeholder="San Francisco, CA"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor={`start-date-${index}`}>Start Date</Label>
            <Input
              id={`start-date-${index}`}
              value={experience.startDate}
              onChange={(e) => updateExperience(index, "startDate", e.target.value)}
              placeholder="Jan 2020"
            />
          </div>
          <div>
            <Label htmlFor={`end-date-${index}`}>End Date</Label>
            <Input
              id={`end-date-${index}`}
              value={experience.endDate}
              onChange={(e) => updateExperience(index, "endDate", e.target.value)}
              placeholder="Present"
              disabled={experience.current}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`current-job-${index}`}
            checked={experience.current}
            onChange={(e) => updateExperience(index, "current", e.target.checked)}
            className="mr-2"
          />
          <Label htmlFor={`current-job-${index}`}>I currently work here</Label>
        </div>
      </div>

      <div>
        <Label htmlFor={`description-${index}`}>Description</Label>
        <Textarea
          id={`description-${index}`}
          value={experience.description}
          onChange={(e) => updateExperience(index, "description", e.target.value)}
          placeholder="Describe your responsibilities and achievements..."
          rows={4}
        />
      </div>
    </div>
  )
}

// Sortable item component for education
function SortableEducationItem({
  education,
  index,
  updateEducation,
  removeEducation,
}: {
  education: any
  index: number
  updateEducation: (index: number, field: string, value: string) => void
  removeEducation: (index: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: education.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="mb-6 border rounded-md p-4 relative">
      <div className="absolute top-2 right-2 flex space-x-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeEducation(index)}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 cursor-move" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4 text-slate-400" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor={`degree-${index}`}>Degree</Label>
          <Input
            id={`degree-${index}`}
            value={education.degree}
            onChange={(e) => updateEducation(index, "degree", e.target.value)}
            placeholder="Bachelor of Science in Computer Science"
          />
        </div>
        <div>
          <Label htmlFor={`institution-${index}`}>Institution</Label>
          <Input
            id={`institution-${index}`}
            value={education.institution}
            onChange={(e) => updateEducation(index, "institution", e.target.value)}
            placeholder="University of Technology"
          />
        </div>
        <div>
          <Label htmlFor={`edu-location-${index}`}>Location</Label>
          <Input
            id={`edu-location-${index}`}
            value={education.location}
            onChange={(e) => updateEducation(index, "location", e.target.value)}
            placeholder="Boston, MA"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor={`edu-start-date-${index}`}>Start Date</Label>
            <Input
              id={`edu-start-date-${index}`}
              value={education.startDate}
              onChange={(e) => updateEducation(index, "startDate", e.target.value)}
              placeholder="Sep 2016"
            />
          </div>
          <div>
            <Label htmlFor={`edu-end-date-${index}`}>End Date</Label>
            <Input
              id={`edu-end-date-${index}`}
              value={education.endDate}
              onChange={(e) => updateEducation(index, "endDate", e.target.value)}
              placeholder="May 2020"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor={`edu-description-${index}`}>Description</Label>
        <Textarea
          id={`edu-description-${index}`}
          value={education.description}
          onChange={(e) => updateEducation(index, "description", e.target.value)}
          placeholder="Relevant coursework, achievements, activities..."
          rows={3}
        />
      </div>
    </div>
  )
}

// Sortable item component for skills
function SortableSkillItem({
  skill,
  index,
  updateSkill,
  removeSkill,
}: {
  skill: any
  index: number
  updateSkill: (index: number, field: string, value: string) => void
  removeSkill: (index: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: skill.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" className="h-9 w-9 cursor-move flex-shrink-0" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4 text-slate-400" />
      </Button>
      <Input
        value={skill.name}
        onChange={(e) => updateSkill(index, "name", e.target.value)}
        placeholder="Skill name (e.g., JavaScript)"
        className="flex-grow"
      />
      <select
        value={skill.level}
        onChange={(e) => updateSkill(index, "level", e.target.value)}
        className="border rounded-md px-3 py-2 bg-white"
      >
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
        <option value="Expert">Expert</option>
      </select>
      <Button variant="ghost" size="icon" onClick={() => removeSkill(index)} className="h-9 w-9 flex-shrink-0">
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  )
}

export default function ResumeEditor({
  resumeData,
  setResumeData,
  profileImage,
  onProfileImageUpload,
}: ResumeEditorProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(["personal"])

  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value,
      },
    })
  }

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          id: `exp-${Date.now()}`,
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    })
    setExpandedSections([...expandedSections, `experience-${resumeData.experience.length}`])
  }

  const updateExperience = (index: number, field: string, value: string | boolean) => {
    const updatedExperience = [...resumeData.experience]
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    }
    setResumeData({
      ...resumeData,
      experience: updatedExperience,
    })
  }

  const removeExperience = (index: number) => {
    const updatedExperience = [...resumeData.experience]
    updatedExperience.splice(index, 1)
    setResumeData({
      ...resumeData,
      experience: updatedExperience,
    })
  }

  const handleExperienceDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = resumeData.experience.findIndex((item) => item.id === active.id)
      const newIndex = resumeData.experience.findIndex((item) => item.id === over.id)

      const newExperience = [...resumeData.experience]
      const [movedItem] = newExperience.splice(oldIndex, 1)
      newExperience.splice(newIndex, 0, movedItem)

      setResumeData({
        ...resumeData,
        experience: newExperience,
      })
    }
  }

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          id: `edu-${Date.now()}`,
          degree: "",
          institution: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    })
    setExpandedSections([...expandedSections, `education-${resumeData.education.length}`])
  }

  const updateEducation = (index: number, field: string, value: string) => {
    const updatedEducation = [...resumeData.education]
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    }
    setResumeData({
      ...resumeData,
      education: updatedEducation,
    })
  }

  const removeEducation = (index: number) => {
    const updatedEducation = [...resumeData.education]
    updatedEducation.splice(index, 1)
    setResumeData({
      ...resumeData,
      education: updatedEducation,
    })
  }

  const handleEducationDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = resumeData.education.findIndex((item) => item.id === active.id)
      const newIndex = resumeData.education.findIndex((item) => item.id === over.id)

      const newEducation = [...resumeData.education]
      const [movedItem] = newEducation.splice(oldIndex, 1)
      newEducation.splice(newIndex, 0, movedItem)

      setResumeData({
        ...resumeData,
        education: newEducation,
      })
    }
  }

  const addSkill = () => {
    setResumeData({
      ...resumeData,
      skills: [
        ...resumeData.skills,
        {
          id: `skill-${Date.now()}`,
          name: "",
          level: "Intermediate",
        },
      ],
    })
  }

  const updateSkill = (index: number, field: string, value: string) => {
    const updatedSkills = [...resumeData.skills]
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value,
    }
    setResumeData({
      ...resumeData,
      skills: updatedSkills,
    })
  }

  const removeSkill = (index: number) => {
    const updatedSkills = [...resumeData.skills]
    updatedSkills.splice(index, 1)
    setResumeData({
      ...resumeData,
      skills: updatedSkills,
    })
  }

  const handleSkillsDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = resumeData.skills.findIndex((item) => item.id === active.id)
      const newIndex = resumeData.skills.findIndex((item) => item.id === over.id)

      const newSkills = [...resumeData.skills]
      const [movedItem] = newSkills.splice(oldIndex, 1)
      newSkills.splice(newIndex, 0, movedItem)

      setResumeData({
        ...resumeData,
        skills: newSkills,
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Resume Editor</h2>

      <Accordion type="multiple" value={expandedSections} onValueChange={setExpandedSections} className="space-y-4">
        <AccordionItem value="personal" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2 text-slate-600" />
              <span>Personal Information</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="mb-6">
              <Label className="block mb-2">Profile Photo</Label>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  {profileImage ? (
                    <Image src={profileImage || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="h-8 w-8 text-slate-400" />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="profile-image" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>{profileImage ? "Change Photo" : "Upload Photo"}</span>
                    </div>
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onProfileImageUpload}
                    />
                  </Label>
                  <p className="text-xs text-slate-500 mt-1">Recommended: Square image, 400x400px or larger</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={resumeData.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  value={resumeData.personalInfo.title}
                  onChange={(e) => updatePersonalInfo("title", e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="flex">
                  <div className="bg-slate-100 p-2 rounded-l-md border border-r-0 border-input">
                    <Mail className="h-4 w-4 text-slate-500" />
                  </div>
                  <Input
                    id="email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => updatePersonalInfo("email", e.target.value)}
                    placeholder="john.doe@example.com"
                    className="rounded-l-none"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <div className="flex">
                  <div className="bg-slate-100 p-2 rounded-l-md border border-r-0 border-input">
                    <Phone className="h-4 w-4 text-slate-500" />
                  </div>
                  <Input
                    id="phone"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                    placeholder="(123) 456-7890"
                    className="rounded-l-none"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <div className="flex">
                  <div className="bg-slate-100 p-2 rounded-l-md border border-r-0 border-input">
                    <MapPin className="h-4 w-4 text-slate-500" />
                  </div>
                  <Input
                    id="location"
                    value={resumeData.personalInfo.location}
                    onChange={(e) => updatePersonalInfo("location", e.target.value)}
                    placeholder="New York, NY"
                    className="rounded-l-none"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <div className="flex">
                  <div className="bg-slate-100 p-2 rounded-l-md border border-r-0 border-input">
                    <Globe className="h-4 w-4 text-slate-500" />
                  </div>
                  <Input
                    id="website"
                    value={resumeData.personalInfo.website}
                    onChange={(e) => updatePersonalInfo("website", e.target.value)}
                    placeholder="www.johndoe.com"
                    className="rounded-l-none"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <div className="flex">
                  <div className="bg-slate-100 p-2 rounded-l-md border border-r-0 border-input">
                    <Linkedin className="h-4 w-4 text-slate-500" />
                  </div>
                  <Input
                    id="linkedin"
                    value={resumeData.personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                    placeholder="linkedin.com/in/johndoe"
                    className="rounded-l-none"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="github">GitHub</Label>
                <div className="flex">
                  <div className="bg-slate-100 p-2 rounded-l-md border border-r-0 border-input">
                    <Github className="h-4 w-4 text-slate-500" />
                  </div>
                  <Input
                    id="github"
                    value={resumeData.personalInfo.github}
                    onChange={(e) => updatePersonalInfo("github", e.target.value)}
                    placeholder="github.com/johndoe"
                    className="rounded-l-none"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                value={resumeData.personalInfo.summary}
                onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                placeholder="Experienced software engineer with a passion for developing innovative solutions..."
                rows={4}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="experience" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-slate-600" />
              <span>Work Experience</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            {resumeData.experience.length === 0 ? (
              <div className="text-center py-6 text-slate-500">
                <Briefcase className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                <p className="mb-4">No work experience added yet</p>
                <Button variant="outline" size="sm" onClick={addExperience}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Work Experience
                </Button>
              </div>
            ) : (
              <>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleExperienceDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext
                    items={resumeData.experience.map((exp) => exp.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {resumeData.experience.map((exp, index) => (
                      <SortableExperienceItem
                        key={exp.id}
                        experience={exp}
                        index={index}
                        updateExperience={updateExperience}
                        removeExperience={removeExperience}
                      />
                    ))}
                  </SortableContext>
                </DndContext>

                <Button variant="outline" size="sm" onClick={addExperience} className="w-full mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Work Experience
                </Button>
              </>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="education" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-slate-600" />
              <span>Education</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            {resumeData.education.length === 0 ? (
              <div className="text-center py-6 text-slate-500">
                <GraduationCap className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                <p className="mb-4">No education added yet</p>
                <Button variant="outline" size="sm" onClick={addEducation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </div>
            ) : (
              <>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleEducationDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext
                    items={resumeData.education.map((edu) => edu.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {resumeData.education.map((edu, index) => (
                      <SortableEducationItem
                        key={edu.id}
                        education={edu}
                        index={index}
                        updateEducation={updateEducation}
                        removeEducation={removeEducation}
                      />
                    ))}
                  </SortableContext>
                </DndContext>

                <Button variant="outline" size="sm" onClick={addEducation} className="w-full mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="skills" className="border rounded-lg">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center">
              <Wrench className="h-5 w-5 mr-2 text-slate-600" />
              <span>Skills</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            {resumeData.skills.length === 0 ? (
              <div className="text-center py-6 text-slate-500">
                <Wrench className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                <p className="mb-4">No skills added yet</p>
                <Button variant="outline" size="sm" onClick={addSkill}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleSkillsDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                  >
                    <SortableContext
                      items={resumeData.skills.map((skill) => skill.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {resumeData.skills.map((skill, index) => (
                        <SortableSkillItem
                          key={skill.id}
                          skill={skill}
                          index={index}
                          updateSkill={updateSkill}
                          removeSkill={removeSkill}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>

                <Button variant="outline" size="sm" onClick={addSkill} className="w-full mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
