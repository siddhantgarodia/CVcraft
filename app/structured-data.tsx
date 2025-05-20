export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CVCRAFT - Smart Resume Builder",
    description:
      "Create professional, ATS-friendly resumes with AI-powered feedback. Our smart resume builder helps you craft job-winning resumes tailored to your target roles.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "CVCRAFT",
      url: "https://cvcraft-nu.vercel.app",
    },
    screenshot: "https://cvcraft-nu.vercel.app/images/resume-builder-screenshot.png",
    featureList: "AI-powered feedback, ATS optimization, Multiple templates, PDF export, Version history",
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
