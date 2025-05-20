import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, FileText, Zap, Award, LayoutTemplate } from "lucide-react"
import StructuredData from "./structured-data"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <StructuredData />
      {/* Navigation */}
      <header className="container mx-auto py-4 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">CVCRAFT</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-medium text-slate-900 hover:text-blue-600">
            Home
          </Link>
          <Link href="#features" className="text-sm font-medium text-slate-900 hover:text-blue-600">
            Features
          </Link>
          <Link href="#templates" className="text-sm font-medium text-slate-900 hover:text-blue-600">
            Templates
          </Link>
          <Link href="#testimonials" className="text-sm font-medium text-slate-900 hover:text-blue-600">
            Testimonials
          </Link>
        </nav>

        <div className="flex items-center">
          <Button size="sm" asChild>
            <Link href="/builder">Get Started</Link>
          </Button>
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
            <div className="mb-6 bg-black p-3 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Build a Job-Winning Resume in Minutes with AI
            </h1>

            <p className="text-lg text-slate-600 mb-8">
              Our AI helps you craft professional, ATS-friendly resumes effortlessly.
            </p>

            <Button size="lg" asChild className="rounded-md">
              <Link href="/builder">
                Get Started for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Our AI Resume Builder?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Smart Features to Elevate Your Job Application</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">AI-Powered Feedback</h3>
              <p className="text-slate-600">
                Get real-time suggestions to improve your resume content, formatting, and keyword optimization.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <LayoutTemplate className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">ATS-Friendly Templates</h3>
              <p className="text-slate-600">
                Our professionally designed templates are optimized to pass Applicant Tracking Systems.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Job-Specific Tailoring</h3>
              <p className="text-slate-600">
                Customize your resume for specific job descriptions with our intelligent keyword matching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Screenshot Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-5xl mx-auto">
            <Image
              src="/images/resume-builder-screenshot.png"
              alt="Resume Builder Interface"
              width={1000}
              height={600}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Professional Resume Templates</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose from our collection of ATS-optimized templates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-64 bg-slate-100 flex items-center justify-center">
                <Image
                  src="/images/template-modern.png"
                  alt="Modern Template"
                  width={200}
                  height={280}
                  className="w-auto h-48 object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900">Modern</h3>
                <p className="text-sm text-slate-600 mb-4">Professional and clean design</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/builder">Use Template</Link>
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-64 bg-slate-100 flex items-center justify-center">
                <Image
                  src="/images/template-classic.png"
                  alt="Classic Template"
                  width={200}
                  height={280}
                  className="w-auto h-48 object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900">Classic</h3>
                <p className="text-sm text-slate-600 mb-4">Traditional and elegant layout</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/builder">Use Template</Link>
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-64 bg-slate-100 flex items-center justify-center">
                <Image
                  src="/images/template-minimal.png"
                  alt="Minimal Template"
                  width={200}
                  height={280}
                  className="w-auto h-48 object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900">Minimal</h3>
                <p className="text-sm text-slate-600 mb-4">Simple and focused design</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/builder">Use Template</Link>
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-64 bg-slate-100 flex items-center justify-center">
                <Image
                  src="/images/template-creative.png"
                  alt="Creative Template"
                  width={200}
                  height={280}
                  className="w-auto h-48 object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900">Creative</h3>
                <p className="text-sm text-slate-600 mb-4">Bold design for creative professionals</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/builder">Use Template</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features List Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Everything You Need to Create the Perfect Resume
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Our comprehensive resume builder provides all the tools you need to create a professional, job-winning
                resume.
              </p>

              <div className="space-y-4">
                {[
                  "Real-time AI feedback and suggestions",
                  "Multiple professional templates",
                  "Easy-to-use drag-and-drop editor",
                  "ATS optimization for higher pass rates",
                  "One-click PDF export",
                  "Job description keyword matching",
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" />
                    <p className="text-slate-700">{feature}</p>
                  </div>
                ))}
              </div>

              <Button className="mt-8" asChild>
                <Link href="/builder">
                  Start Building Your Resume
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Image
                src="/images/resume-features.png"
                alt="Resume Builder Features"
                width={500}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Thousands of job seekers have found success with our resume builder
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Marketing Manager",
                image: "/images/testimonial-1.png",
                quote:
                  "The AI feedback helped me optimize my resume for ATS systems. I got more interviews in one month than I had in the previous six!",
              },
              {
                name: "Michael Chen",
                role: "Software Developer",
                image: "/images/testimonial-2.png",
                quote:
                  "I was struggling to highlight my skills effectively. CVCRAFT's suggestions helped me showcase my experience in a way that caught recruiters' attention.",
              },
              {
                name: "Emily Rodriguez",
                role: "Financial Analyst",
                image: "/images/testimonial-3.png",
                quote:
                  "The templates are not only beautiful but also ATS-friendly. I landed my dream job within weeks of using CVCRAFT.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{testimonial.name}</h3>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Land Your Dream Job?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Create a professional, ATS-friendly resume in minutes with our AI-powered resume builder.
          </p>
          <Button size="lg" variant="secondary" asChild>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CVCRAFT</span>
              </div>
              <p className="mb-4">AI-powered resume builder to help you land your dream job.</p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#templates" className="hover:text-white transition-colors">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials" className="hover:text-white transition-colors">
                    Testimonials
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Resume Tips
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Career Advice
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
            <p>&copy; {new Date().getFullYear()} CVCRAFT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
