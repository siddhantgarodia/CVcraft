"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { History, Trash2, RotateCcw, Eye } from "lucide-react"
import type { ResumeVersion } from "@/lib/types"
import ResumePreview from "@/components/resume-preview"

interface ResumeVersionHistoryProps {
  versions: ResumeVersion[]
  onRestore: (version: ResumeVersion) => void
  onDelete: (versionId: string) => void
}

export default function ResumeVersionHistory({ versions, onRestore, onDelete }: ResumeVersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<ResumeVersion | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const handlePreview = (version: ResumeVersion) => {
    setSelectedVersion(version)
    setShowPreview(true)
  }

  const handleRestore = (version: ResumeVersion) => {
    onRestore(version)
    setSelectedVersion(null)
  }

  const handleDeleteConfirm = (versionId: string) => {
    setConfirmDelete(versionId)
  }

  const handleDeleteCancel = () => {
    setConfirmDelete(null)
  }

  const handleDeleteConfirmed = (versionId: string) => {
    onDelete(versionId)
    setConfirmDelete(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Resume Version History</h2>
      </div>

      {versions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border rounded-md bg-slate-50">
          <History className="h-8 w-8 text-slate-400 mb-2" />
          <h3 className="font-medium text-lg mb-1">No Saved Versions</h3>
          <p className="text-center text-slate-600 mb-4">
            Save your resume to create version history. This allows you to track changes and restore previous versions.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {versions
            .slice()
            .reverse()
            .map((version) => (
              <Card key={version.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{version.name}</h3>
                    <p className="text-sm text-slate-600">
                      {new Date(version.date).toLocaleDateString()} at{" "}
                      {new Date(version.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handlePreview(version)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleRestore(version)}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restore
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteConfirm(version.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>
              {selectedVersion?.name} - {selectedVersion && new Date(selectedVersion.date).toLocaleString()}
            </DialogTitle>
            <DialogDescription>Preview of this resume version</DialogDescription>
          </DialogHeader>
          <div className="overflow-auto h-full p-6">
            {selectedVersion && <ResumePreview resumeData={selectedVersion.data} template="modern" />}
          </div>
          <div className="p-4 border-t flex justify-between">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            {selectedVersion && (
              <Button onClick={() => handleRestore(selectedVersion)}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Restore This Version
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete !== null} onOpenChange={handleDeleteCancel}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this version? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => confirmDelete && handleDeleteConfirmed(confirmDelete)}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
