import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

// Improved formatting for document-like preview
const DocumentPreview = ({ text, type }) => {
  if (!text) return null;

  const lines = text.split(/\r?\n/).filter(l => l.trim() !== "");
  
  if (type === "resume") {
    const name = lines[0]?.replace(/\*\*/g, "");
    const contact = lines.slice(1, 4).map(l => l.replace(/\*\*/g, ""));
    const body = lines.slice(4);

    return (
      <div className="bg-white text-slate-900 p-8 shadow-inner min-h-full rounded-sm font-sans">
        {/* Header Section */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
          <h1 className="text-3xl font-bold uppercase tracking-tight">{name}</h1>
          <div className="text-right text-xs space-y-0.5 font-medium text-slate-600">
            {contact.map((line, i) => <div key={i}>{line}</div>)}
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6 text-[11pt] leading-relaxed">
          {body.map((line, index) => {
            const clean = line.replace(/\*\*/g, "").replace(/^\*\s*/, "");
            
            // Check if it's a heading (all caps or ends with :)
            const isHeading = /^[A-Z\s]+$/.test(clean.trim()) || clean.trim().endsWith(":");
            
            if (isHeading) {
              return (
                <h2 key={index} className="font-bold text-sm uppercase tracking-widest border-b border-slate-200 mt-6 mb-2">
                  {clean.replace(/:$/, "")}
                </h2>
              );
            }

            if (line.trim().startsWith("*") || line.trim().startsWith("-")) {
              return (
                <div key={index} className="flex gap-2 pl-2">
                  <span>•</span>
                  <span>{clean}</span>
                </div>
              );
            }

            return <p key={index} className="text-justify">{clean}</p>;
          })}
        </div>
      </div>
    );
  }

  // Cover Letter Layout
  return (
    <div className="bg-white text-slate-900 p-10 shadow-inner min-h-full rounded-sm font-serif">
      <div className="text-right mb-10 text-slate-600 font-sans text-sm">
        {new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
      
      <div className="space-y-4 text-[12pt] leading-relaxed text-justify">
        {lines.map((line, index) => {
          const clean = line.replace(/\*\*/g, "");
          const isClosing = ["Sincerely,", "Best regards,", "Regards,", "Yours truly,"].some(c => clean.includes(c));
          
          if (isClosing) {
            return (
              <div key={index} className="pt-8 text-right font-sans italic">
                {clean}
              </div>
            );
          }

          return <p key={index}>{clean}</p>;
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

    const lines = text
      .replace(/\*\*/g, "")
      .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
      .replace(/^\*\s*/gm, "")
      .split(/\r?\n/)
      .filter((line) => line.trim() !== "");

    lines.forEach((line, i) => {
      const isName = i === 0;
      const isContactInfo = i > 0 && i < 4 && filename.includes("resume");
      const isDateLine = i === 0 && filename.includes("cover-letter");
      const isHeading = /^[A-Z\s]{3,20}$/.test(line.trim()) || /^[A-Za-z ]+:$/.test(line.trim());
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

  return (
    <div ref={outputRef} className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
      {/* Resume Block */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-end px-4">
          <div>
            <h3 className="text-xl font-bold text-white">Resume Preview</h3>
            <p className="text-xs text-slate-400 uppercase tracking-widest">A4 Format • Professional</p>
          </div>
          {resume && (
            <button onClick={() => downloadPDF(resume, "resume.pdf")} className="saas-button !py-2 !px-5 text-sm">
              Export PDF
            </button>
          )}
        </div>
        <div className="glass-card p-1 overflow-hidden h-[850px]">
          <div className="h-full overflow-auto bg-slate-950/50 p-6">
            <DocumentPreview text={resume} type="resume" />
          </div>
        </div>
      </div>

      {/* Cover Letter Block */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-end px-4">
          <div>
            <h3 className="text-xl font-bold text-white">Cover Letter Preview</h3>
            <p className="text-xs text-slate-400 uppercase tracking-widest">Letter Format • Formal</p>
          </div>
          {coverLetter && (
            <button onClick={() => downloadPDF(coverLetter, "cover-letter.pdf")} className="saas-button !py-2 !px-5 text-sm !from-slate-700 !to-slate-800">
              Export PDF
            </button>
          )}
        </div>
        <div className="glass-card p-1 overflow-hidden h-[850px]">
          <div className="h-full overflow-auto bg-slate-950/50 p-6">
            <DocumentPreview text={coverLetter} type="coverLetter" />
          </div>
        </div>
      </div>
    </div>
  );
}
