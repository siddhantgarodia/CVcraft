import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CVCRAFT - Smart Resume Builder with AI-Powered Feedback",
  description:
    "Create professional, ATS-friendly resumes with AI-powered feedback. Our smart resume builder helps you craft job-winning resumes tailored to your target roles.",
  keywords:
    "resume builder, cv maker, AI resume, ATS-friendly resume, job application, career tools, professional resume",
  authors: [{ name: "CVCRAFT Team" }],
  creator: "CVCRAFT",
  publisher: "CVCRAFT",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  metadataBase: new URL("https://cvcraft.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CVCRAFT - Smart Resume Builder with AI-Powered Feedback",
    description:
      "Create professional, ATS-friendly resumes with AI-powered feedback. Our smart resume builder helps you craft job-winning resumes tailored to your target roles.",
    url: "https://cvcraft.vercel.app",
    siteName: "CVCRAFT",
    images: [
      {
        url: "/images/cvcraft-og-image.png",
        width: 1200,
        height: 630,
        alt: "CVCRAFT Smart Resume Builder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CVCRAFT - Smart Resume Builder with AI-Powered Feedback",
    description:
      "Create professional, ATS-friendly resumes with AI-powered feedback. Our smart resume builder helps you craft job-winning resumes tailored to your target roles.",
    images: ["/images/cvcraft-twitter-image.png"],
    creator: "@cvcraft",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  category: "Career Tools",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
