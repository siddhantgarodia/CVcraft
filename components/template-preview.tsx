"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Template } from "@/lib/types";

interface TemplatePreviewProps {
  templates: {
    id: Template;
    name: string;
    description: string;
    preview: string;
  }[];
  currentTemplate: Template;
  onSelect: (template: Template) => void;
}

export function TemplatePreview({
  templates,
  currentTemplate,
  onSelect,
}: TemplatePreviewProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (template: Template) => {
    onSelect(template);
    toast({
      title: "Template Changed",
      description: "Resume template has been updated",
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50"
      >
        <Layout className="h-4 w-4 mr-2" />
        Change Template
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 w-[800px] p-6 z-50 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Resume Templates</h3>
          <p className="text-sm text-gray-600">
            Choose a template that best fits your needs
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Close
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`p-4 cursor-pointer transition-all hover:border-blue-500 ${
              template.id === currentTemplate ? "border-blue-500" : ""
            }`}
            onClick={() => handleSelect(template.id)}
          >
            <div className="aspect-[210/297] mb-4 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={template.preview}
                alt={template.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{template.name}</h4>
                {template.id === currentTemplate && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Selected
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
