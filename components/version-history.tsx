"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Clock, ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { ResumeVersion } from "@/lib/types";

interface VersionHistoryProps {
  versions: ResumeVersion[];
  currentVersion: number;
  onRestore: (version: ResumeVersion) => void;
  onSave: () => void;
}

export function VersionHistory({
  versions,
  currentVersion,
  onRestore,
  onSave,
}: VersionHistoryProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleRestore = (version: ResumeVersion) => {
    onRestore(version);
    toast({
      title: "Version Restored",
      description: `Restored resume to version from ${new Date(
        version.date
      ).toLocaleString()}`,
    });
    setIsOpen(false);
  };

  const handleSave = () => {
    onSave();
    toast({
      title: "Version Saved",
      description: "Current resume version has been saved",
    });
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        <History className="h-4 w-4 mr-2" />
        Version History
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 p-4 z-50 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Version History</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Current Version
        </Button>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {versions.map((version, index) => (
            <Card
              key={version.id}
              className={`p-3 ${
                index === currentVersion ? "border-blue-500" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {new Date(version.date).toLocaleString()}
                    </span>
                  </div>
                  {version.name && (
                    <p className="text-sm text-gray-600 mt-1">{version.name}</p>
                  )}
                </div>
                {index === currentVersion ? (
                  <Badge variant="secondary">Current</Badge>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRestore(version)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Restore
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}
