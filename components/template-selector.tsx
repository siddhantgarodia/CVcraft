"use client"

import type { Template } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Image from "next/image"

interface TemplateSelectorProps {
  selectedTemplate: Template
  setSelectedTemplate: (template: Template) => void
}

export default function TemplateSelector({ selectedTemplate, setSelectedTemplate }: TemplateSelectorProps) {
  const templates: { id: Template; name: string; description: string; image: string }[] = [
    {
      id: "modern",
      name: "Modern",
      description: "Clean and contemporary design with a sidebar for skills and contact info",
      image: "/images/template-modern.png",
    },
    {
      id: "classic",
      name: "Classic",
      description: "Traditional resume layout with a professional appearance",
      image: "/images/template-classic.png",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple and elegant design focusing on content",
      image: "/images/template-minimal.png",
    },
    {
      id: "creative",
      name: "Creative",
      description: "Bold design with unique layout for creative professionals",
      image: "/images/template-creative.png",
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md relative ${
              selectedTemplate === template.id ? "ring-2 ring-blue-600" : ""
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            )}

            <div className="h-40 bg-slate-100 mb-3 rounded flex items-center justify-center">
              <Image
                src={template.image || "/placeholder.svg"}
                alt={`${template.name} template`}
                width={120}
                height={160}
                className="h-32 w-auto object-contain"
              />
            </div>

            <h3 className="font-medium text-lg">{template.name}</h3>
            <p className="text-sm text-slate-600">{template.description}</p>

            <Button
              variant={selectedTemplate === template.id ? "default" : "outline"}
              size="sm"
              className="mt-3 w-full"
              onClick={() => setSelectedTemplate(template.id)}
            >
              {selectedTemplate === template.id ? "Selected" : "Select Template"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
