import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  FileText,
  Zap,
  Award,
  LayoutTemplate,
  Eye,
} from "lucide-react";
import StructuredData from "./structured-data";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-indigo-50">
      <StructuredData />
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-rose-200/50 shadow-xl">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-indigo-500 rounded-md flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent">
                CVCRAFT
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-slate-900 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              href="/builder"
              className="text-sm font-medium text-slate-900 hover:text-blue-600"
            >
              Builder
            </Link>
            <Link
              href="/analysis"
              className="text-sm font-medium text-slate-900 hover:text-blue-600"
            >
              Analysis
            </Link>
          </nav>

          <div className="flex items-center">
            <Button size="sm" asChild>
              <Link href="/builder">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-32 h-20 bg-blue-100 rounded-lg opacity-50"></div>
          <div className="absolute top-40 left-40 w-20 h-20 bg-blue-100 rounded-lg opacity-50"></div>
          <div className="absolute bottom-40 left-20 w-40 h-40 bg-blue-100 rounded-lg opacity-50"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-blue-100 rounded-lg opacity-50"></div>
          <div className="absolute top-60 right-40 w-40 h-20 bg-blue-100 rounded-lg opacity-50"></div>
          <div className="absolute bottom-20 right-20 w-60 h-40 bg-blue-100 rounded-lg opacity-50"></div>
          <div className="absolute bottom-40 right-80 w-20 h-20 bg-blue-100 rounded-lg opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-100 rounded-lg opacity-50"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="mb-6 bg-white/80 backdrop-blur-lg p-4 rounded-xl border border-rose-200/50 shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <FileText className="h-7 w-7 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Build a Job-Winning Resume in Minutes with AI
            </h1>

            <p className="text-lg text-slate-600 mb-8">
              Our AI helps you craft professional, ATS-friendly resumes
              effortlessly.
            </p>

            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-rose-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
            >
              <Link href="/builder">
                Get Started for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="features" className="py-20 bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why Choose Our AI Resume Builder?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Smart Features to Elevate Your Job Application
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-xl border border-rose-200/50 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                AI-Powered Feedback
              </h3>
              <p className="text-slate-600">
                Get real-time suggestions to improve your resume content,
                formatting, and keyword optimization.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-xl border border-rose-200/50 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <LayoutTemplate className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                ATS-Friendly Templates
              </h3>
              <p className="text-slate-600">
                Our professionally designed templates are optimized to pass
                Applicant Tracking Systems.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-xl border border-rose-200/50 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Job-Specific Tailoring
              </h3>
              <p className="text-slate-600">
                Customize your resume for specific job descriptions with our
                intelligent keyword matching.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-rose-500 to-indigo-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Create a professional, ATS-friendly resume in minutes with our
            AI-powered resume builder.
          </p>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="bg-white text-rose-600 hover:bg-white/90"
          >
            <Link href="/builder">
              Build Your Resume Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CVCRAFT</span>
              </div>
              <p className="mb-4">
                AI-powered resume builder to help you land your dream job.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/builder"
                    className="hover:text-white transition-colors"
                  >
                    Resume Builder
                  </Link>
                </li>
                <li>
                  <Link
                    href="/analysis"
                    className="hover:text-white transition-colors"
                  >
                    Resume Analysis
                  </Link>
                </li>
                <li>
                  <Link
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p>
              &copy; {new Date().getFullYear()} CVCRAFT. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
