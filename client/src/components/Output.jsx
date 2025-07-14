import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

// Format output lines with bold labels if detected
const formatText = (text) => {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "")
    .map((line, index) => {
      const clean = line
        .replace(/\*\*/g, "")
        .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
        .replace(/^\*\s*/, "");

      const parts = clean.split(":");
      if (parts.length > 1 && parts[0].length < 40) {
        return (
          <p key={index}>
            <strong>{parts[0].trim()}:</strong> {parts.slice(1).join(":").trim()}
          </p>
        );
      }

      return <p key={index}>{clean}</p>;
    });
};

export default function Output({ result, type }) {
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    if (!result || !type) return;

    if (type === "resume") {
      setResume(result);
    } else if (type === "coverLetter") {
      setCoverLetter(result);
    }
  }, [result, type]);

  const downloadPDF = (text, filename) => {
  const doc = new jsPDF({ unit: "mm", format: "a4", lineHeight: 1.5 });

  const marginLeft = 20;
  const marginTop = 20;
  const maxWidth = 170;
  let y = marginTop;

  // Cleanup formatting
  const lines = text
    .replace(/\*\*/g, "")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/^\*\s*/gm, "")
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  lines.forEach((line, i) => {
    const isName = i === 0;
    const isHeading = /^[A-Za-z ]+:$/.test(line.trim()) || /^[A-Za-z ]+$/.test(line.trim()) && lines[i + 1]?.startsWith("+");

    if (y > 270) {
      doc.addPage();
      y = marginTop;
    }

    // Apply formatting
    if (isName) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
    } else if (isHeading) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
    }

    // Break long lines
    const wrapped = doc.splitTextToSize(line.trim(), maxWidth);
    wrapped.forEach((segment) => {
      doc.text(segment, marginLeft, y);
      y += 7;
    });
  });

  doc.save(filename);
};


  if (!resume && !coverLetter) return null;

  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto p-4">
      {/* Resume Block */}
      <div className="bg-white p-6 rounded-xl shadow border max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-purple-700">📄 Resume</h3>
          {resume && (
            <button
              onClick={() => downloadPDF(resume, "resume.pdf")}
              className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
            >
              Download PDF
            </button>
          )}
        </div>
        <div className="text-gray-800 space-y-2 leading-relaxed">
          {resume ? formatText(resume) : <p className="text-gray-400">No resume yet</p>}
        </div>
      </div>

      {/* Cover Letter Block */}
      <div className="bg-white p-6 rounded-xl shadow border max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-purple-700">✉️ Cover Letter</h3>
          {coverLetter && (
            <button
              onClick={() => downloadPDF(coverLetter, "cover-letter.pdf")}
              className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700"
            >
              Download PDF
            </button>
          )}
        </div>
        <div className="text-gray-800 space-y-2 leading-relaxed">
          {coverLetter ? formatText(coverLetter) : <p className="text-gray-400">No cover letter yet</p>}
        </div>
      </div>
    </div>
  );
}
