import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
      <h2 className="text-xl font-medium text-slate-800">Loading CVCRAFT...</h2>
      <p className="text-slate-600 mt-2">Preparing your resume building experience</p>
    </div>
  )
}
