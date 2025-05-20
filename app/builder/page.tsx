import { Suspense } from "react"
import ResumeBuilder from "@/components/resume-builder"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function BuilderPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-4xl font-bold text-slate-900">Smart Resume Builder</h1>
            <p className="text-slate-600 max-w-2xl">
              Create professional resumes with real-time AI feedback tailored to your target job roles
            </p>
          </div>
        </header>

        <Suspense
          fallback={
            <div className="flex items-center justify-center h-[80vh]">
              <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
              <span className="ml-2 text-slate-700">Loading resume builder...</span>
            </div>
          }
        >
          <ResumeBuilder />
        </Suspense>
      </div>
    </main>
  )
}
