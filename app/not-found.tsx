import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
        <FileText className="h-8 w-8 text-white" />
      </div>

      <h1 className="text-4xl font-bold text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-lg text-slate-600 mb-8 text-center max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
      </p>

      <div className="flex space-x-4">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/builder">
            <FileText className="mr-2 h-4 w-4" />
            Resume Builder
          </Link>
        </Button>
      </div>
    </div>
  )
}
