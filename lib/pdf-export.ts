import { jsPDF } from "jspdf";
import type { ResumeData, Template } from "./types";
import { exportResumeToLatex } from "./latex-generator";

// Function to export resume to PDF with extractable text
export async function exportResumeToPdf(
  resumeData: ResumeData,
  template: Template,
  profileImage: string | null,
  resumeElement: HTMLDivElement
): Promise<void> {
  try {
    // Generate LaTeX content
    const latexContent = exportResumeToLatex(resumeData, template);

    // Create a new jsPDF instance
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    // Add comprehensive metadata to the PDF
    const { personalInfo } = resumeData;

    pdf.setProperties({
      title: `${personalInfo.fullName} - ${personalInfo.title} - Resume`,
      subject: `Professional Resume for ${personalInfo.fullName}`,
      author: personalInfo.fullName,
      keywords: `resume, cv, ${personalInfo.title}, ${personalInfo.fullName}, professional, job application`,
      creator: "CVCRAFT Smart Resume Builder",
      // creationDate: new Date(), // Removed due to type incompatibility
    });

    // A4 dimensions in points
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - margin * 2;

    // Set font
    pdf.setFont("helvetica");
    pdf.setFontSize(12);

    let yPosition = margin + 20;

    // Header
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text(personalInfo.fullName, pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 30;

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "normal");
    pdf.text(personalInfo.title, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 40;

    // Contact information
    pdf.setFontSize(10);
    const contactInfo = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.website,
      personalInfo.linkedin,
      personalInfo.github,
    ].filter(Boolean);

    contactInfo.forEach((info, index) => {
      if (yPosition > pageHeight - margin - 20) {
        pdf.addPage();
        yPosition = margin + 20;
      }
      pdf.text(info, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 15;
    });

    yPosition += 20;

    // Horizontal line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 30;

    // Experience section
    if (resumeData.experience.length > 0) {
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Professional Experience", margin, yPosition);
      yPosition += 25;

      resumeData.experience.forEach((exp) => {
        if (yPosition > pageHeight - margin - 60) {
          pdf.addPage();
          yPosition = margin + 20;
        }

        // Company and dates
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        const companyText = `${exp.company}`;
        const dateText = `${exp.startDate} - ${exp.endDate || "Present"}`;

        pdf.text(companyText, margin, yPosition);
        pdf.text(
          dateText,
          pageWidth - margin - pdf.getTextWidth(dateText),
          yPosition
        );
        yPosition += 18;

        // Position
        pdf.setFont("helvetica", "italic");
        pdf.text(exp.position, margin, yPosition);
        yPosition += 20;

        // Responsibilities
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        exp.responsibilities.forEach((resp) => {
          if (yPosition > pageHeight - margin - 20) {
            pdf.addPage();
            yPosition = margin + 20;
          }

          // Split long text into multiple lines
          const lines = pdf.splitTextToSize(`• ${resp}`, contentWidth - 20);
          lines.forEach((line: string) => {
            if (yPosition > pageHeight - margin - 20) {
              pdf.addPage();
              yPosition = margin + 20;
            }
            pdf.text(line, margin + 10, yPosition);
            yPosition += 15;
          });
        });
        yPosition += 15;
      });
    }

    // Education section
    if (resumeData.education.length > 0) {
      if (yPosition > pageHeight - margin - 60) {
        pdf.addPage();
        yPosition = margin + 20;
      }

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Education", margin, yPosition);
      yPosition += 25;

      resumeData.education.forEach((edu) => {
        if (yPosition > pageHeight - margin - 60) {
          pdf.addPage();
          yPosition = margin + 20;
        }

        // Institution and dates
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        const institutionText = `${edu.institution}`;
        const dateText = `${edu.startDate} - ${edu.endDate || "Present"}`;

        pdf.text(institutionText, margin, yPosition);
        pdf.text(
          dateText,
          pageWidth - margin - pdf.getTextWidth(dateText),
          yPosition
        );
        yPosition += 18;

        // Degree
        pdf.setFont("helvetica", "italic");
        pdf.text(`${edu.degree} in ${edu.field}`, margin, yPosition);
        yPosition += 20;

        // GPA
        if (edu.gpa) {
          pdf.setFont("helvetica", "normal");
          pdf.text(`GPA: ${edu.gpa}`, margin, yPosition);
          yPosition += 18;
        }

        // Achievements
        if (edu.achievements.length > 0) {
          pdf.setFontSize(10);
          edu.achievements.forEach((achievement) => {
            if (yPosition > pageHeight - margin - 20) {
              pdf.addPage();
              yPosition = margin + 20;
            }

            const lines = pdf.splitTextToSize(
              `• ${achievement}`,
              contentWidth - 20
            );
            lines.forEach((line: string) => {
              if (yPosition > pageHeight - margin - 20) {
                pdf.addPage();
                yPosition = margin + 20;
              }
              pdf.text(line, margin + 10, yPosition);
              yPosition += 15;
            });
          });
        }
        yPosition += 15;
      });
    }

    // Skills section
    if (resumeData.skills.length > 0) {
      if (yPosition > pageHeight - margin - 60) {
        pdf.addPage();
        yPosition = margin + 20;
      }

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Skills", margin, yPosition);
      yPosition += 25;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      const skillsPerRow = 2;
      const skillsPerPage = Math.floor((pageHeight - margin - yPosition) / 20);

      for (let i = 0; i < resumeData.skills.length; i += skillsPerRow) {
        if (yPosition > pageHeight - margin - 30) {
          pdf.addPage();
          yPosition = margin + 20;
        }

        const skill1 = resumeData.skills[i];
        const skill2 = resumeData.skills[i + 1];

        const skill1Text = `${skill1.name}: ${skill1.level}`;
        const skill2Text = skill2 ? `${skill2.name}: ${skill2.level}` : "";

        pdf.text(skill1Text, margin, yPosition);
        if (skill2Text) {
          pdf.text(skill2Text, pageWidth / 2, yPosition);
        }
        yPosition += 20;
      }
    }

    // Save the PDF
    const fileName = `${resumeData.personalInfo.fullName.replace(
      /\s+/g,
      "_"
    )}_Resume.pdf`;
    pdf.save(fileName);

    return;
  } catch (error) {
    console.error("Error exporting PDF:", error);
    throw error;
  }
}
