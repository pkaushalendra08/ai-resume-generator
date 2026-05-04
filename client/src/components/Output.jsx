import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

// Helper to clean text from AI artifacts
const cleanText = (text) => {
  if (!text) return "";
  return text
    .replace(/```[a-z]*\n?/gi, "") // Remove code fences
    .replace(/```/g, "")
    .replace(/<[^>]*>?/gm, "") // Remove HTML tags
    .replace(/\*\*/g, "") // Remove bold markdown
    .replace(/^#+\s+/gm, "") // Remove header markdown
    .trim();
};

// Improved formatting for document-like preview
const DocumentPreview = ({ text, type }) => {
  if (!text) return null;

  const cleanedFullText = cleanText(text);
  const lines = cleanedFullText.split(/\r?\n/).filter(l => l.trim() !== "");
  
  if (type === "resume") {
    const name = lines[0];
    const contact = lines.slice(1, 4);
    const body = lines.slice(4);

    return (
      <div className="bg-white text-slate-900 p-5 sm:p-8 md:p-12 shadow-inner min-h-full rounded-sm font-sans transition-all">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-slate-900 pb-4 mb-6 gap-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tight">{name}</h1>
          <div className="text-left sm:text-right text-[10px] sm:text-xs space-y-0.5 font-medium text-slate-600">
            {contact.map((line, i) => <div key={i}>{line}</div>)}
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4 sm:space-y-6 text-[10pt] sm:text-[11pt] leading-relaxed">
          {body.map((line, index) => {
            const cleanLine = line.replace(/^\*\s*/, "").trim();
            
            // Check if it's a heading (all caps or ends with :)
            const isHeading = /^[A-Z\s]{3,30}$/.test(cleanLine) || /^[A-Za-z ]+:$/.test(cleanLine);
            
            if (isHeading) {
              return (
                <h2 key={index} className="font-bold text-xs sm:text-sm uppercase tracking-widest border-b border-slate-200 mt-4 sm:mt-6 mb-2 text-indigo-900">
                  {cleanLine.replace(/:$/, "")}
                </h2>
              );
            }

            if (line.trim().startsWith("*") || line.trim().startsWith("-")) {
              return (
                <div key={index} className="flex gap-2 pl-1 sm:pl-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{cleanLine}</span>
                </div>
              );
            }

            return <p key={index} className="text-justify">{cleanLine}</p>;
          })}
        </div>
      </div>
    );
  }

  // Cover Letter Layout
  return (
    <div className="bg-white text-slate-900 p-6 sm:p-10 md:p-16 shadow-inner min-h-full rounded-sm font-serif transition-all">
      <div className="text-right mb-6 sm:mb-10 text-slate-600 font-sans text-xs sm:text-sm">
        {new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
      
      <div className="space-y-3 sm:space-y-4 text-[11pt] sm:text-[12pt] leading-relaxed text-justify">
        {lines.map((line, index) => {
          const isClosing = ["Sincerely,", "Best regards,", "Regards,", "Yours truly,"].some(c => line.includes(c));
          
          if (isClosing) {
            return (
              <div key={index} className="pt-6 sm:pt-8 text-right font-sans italic text-sm sm:text-base">
                {line}
              </div>
            );
          }

          return <p key={index}>{line}</p>;
        })}
      </div>
    </div>
  );
};

export default function Output({ result, type, outputRef }) {
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    if (!result || !type) return;
    if (type === "resume") setResume(result);
    else if (type === "coverLetter") setCoverLetter(result);
  }, [result, type]);

  const downloadPDF = (text, filename) => {
    const doc = new jsPDF({ unit: "mm", format: "a4", lineHeight: 1.5 });
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginRight = 20;
    const marginLeft = 20;
    const marginTop = 20;
    const maxWidth = pageWidth - marginLeft - marginRight;
    let y = marginTop;

    const cleanedText = cleanText(text);
    const lines = cleanedText.split(/\r?\n/).filter((line) => line.trim() !== "");

    lines.forEach((line, i) => {
      const isName = i === 0;
      const isContactInfo = i > 0 && i < 4 && filename.includes("resume");
      const isDateLine = i === 0 && filename.includes("cover-letter");
      const isHeading = /^[A-Z\s]{3,30}$/.test(line.trim()) || /^[A-Za-z ]+:$/.test(line.trim());
      const isClosing = ["Sincerely", "Best regards", "Regards"].some(c => line.includes(c));

      if (y > 270) {
        doc.addPage();
        y = marginTop;
      }

      if (isName) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(30, 41, 59);
      } else if (isHeading) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(79, 70, 229);
        y += 4;
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(71, 85, 105);
      }

      const wrapped = doc.splitTextToSize(line.trim(), maxWidth);
      wrapped.forEach((segment) => {
        if (isContactInfo || isDateLine || (isClosing && filename.includes("cover-letter"))) {
          const textWidth = doc.getTextWidth(segment);
          doc.text(segment, pageWidth - marginRight - textWidth, y);
        } else {
          doc.text(segment, marginLeft, y);
        }
        y += 7;
      });

      if (isName) y += 2;
    });

    doc.save(filename);
  };

  if (!resume && !coverLetter) return null;

  const showResume = type === "resume" || (resume && !type);
  const showCoverLetter = type === "coverLetter" || (coverLetter && !type);
  const both = showResume && showCoverLetter;

  return (
    <div ref={outputRef} className="mt-8 space-y-12 pb-12">
      <div className={`grid grid-cols-1 ${both ? 'lg:grid-cols-2' : 'max-w-4xl mx-auto'} gap-8 lg:gap-12`}>
        {/* Resume Block */}
        {showResume && (
          <div className="flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Resume Preview
                </h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">A4 Standard • Professional Layout</p>
              </div>
              <button 
                onClick={() => downloadPDF(resume, "resume.pdf")} 
                className="saas-button !py-2 !px-4 text-sm flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
            </div>
            <div className="glass-card p-1 overflow-hidden h-[600px] sm:h-[800px] border-slate-700/30">
              <div className="h-full overflow-auto bg-slate-900/40 p-2 sm:p-4 scrollbar-hide">
                <DocumentPreview text={resume} type="resume" />
              </div>
            </div>
          </div>
        )}

        {/* Cover Letter Block */}
        {showCoverLetter && (
          <div className="flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Cover Letter
                </h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">Formal Format • AI Optimized</p>
              </div>
              <button 
                onClick={() => downloadPDF(coverLetter, "cover-letter.pdf")} 
                className="saas-button !py-2 !px-4 text-sm !from-slate-700 !to-slate-800 border border-slate-600 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
            </div>
            <div className="glass-card p-1 overflow-hidden h-[600px] sm:h-[800px] border-slate-700/30">
              <div className="h-full overflow-auto bg-slate-900/40 p-2 sm:p-4 scrollbar-hide">
                <DocumentPreview text={coverLetter} type="coverLetter" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
