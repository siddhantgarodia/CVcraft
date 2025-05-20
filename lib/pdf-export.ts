import { jsPDF } from "jspdf"
import type { ResumeData, Template } from "./types"
import html2canvas from "html2canvas"
import { font } from "./fonts/times-new-roman-normal"
import { fontBold } from "./fonts/times-new-roman-bold"

// Function to export resume to PDF
export async function exportResumeToPdf(
  resumeData: ResumeData,
  template: Template,
  profileImage: string | null,
  resumeElement: HTMLDivElement,
): Promise<void> {
  try {
    // Create a new jsPDF instance
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    })

    // Add fonts
    pdf.addFileToVFS("times-new-roman-normal.ttf", font)
    pdf.addFont("times-new-roman-normal.ttf", "Times New Roman", "normal")

    pdf.addFileToVFS("times-new-roman-bold.ttf", fontBold)
    pdf.addFont("times-new-roman-bold.ttf", "Times New Roman", "bold")

    // Set default font
    pdf.setFont("Times New Roman")

    // Add comprehensive metadata to the PDF
    const { personalInfo } = resumeData
    const currentDate = new Date().toISOString().split("T")[0]

    pdf.setProperties({
      title: `${personalInfo.fullName} - ${personalInfo.title} - Resume`,
      subject: `Professional Resume for ${personalInfo.fullName}`,
      author: personalInfo.fullName,
      keywords: `resume, cv, ${personalInfo.title}, ${personalInfo.fullName}, professional, job application`,
      creator: "CVCRAFT Smart Resume Builder",
      creationDate: new Date(),
    })

    // A4 dimensions in points
    const pageWidth = 595.28
    const pageHeight = 841.89
    const margin = 40

    // Create a temporary clone of the resume element for rendering
    const tempDiv = document.createElement("div")
    tempDiv.style.position = "absolute"
    tempDiv.style.left = "-9999px"
    tempDiv.style.width = `${pageWidth}px`
    tempDiv.innerHTML = resumeElement.innerHTML
    document.body.appendChild(tempDiv)

    // Capture the resume as an image with high quality
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      windowWidth: pageWidth,
      windowHeight: pageHeight,
    })

    // Clean up the temporary element
    document.body.removeChild(tempDiv)

    // Calculate dimensions to fit on A4 with margins
    const imgWidth = pageWidth - margin * 2
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Add the image to the PDF
    const imgData = canvas.toDataURL("image/png")
    pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight)

    // Save the PDF
    const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.pdf`
    pdf.save(fileName)

    return
  } catch (error) {
    console.error("Error exporting PDF:", error)
    throw error
  }
}
