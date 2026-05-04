import { useState, useRef } from "react";
import Form from "./components/Form";
import Output from "./components/Output";
import AuthModal from "./components/AuthModal";

export default function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    social: "",
    experience: "",
    skills: "",
    education: "",
    careerGoals: "",
    date: ""
  });
  const [result, setResult] = useState("");
  const [type, setType] = useState(""); // 'resume' or 'coverLetter'
  const [view, setView] = useState("form"); // 'form' or 'result'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const outputRef = useRef(null);

  const handleResult = (content, selectedType) => {
    if (content) {
      setResult(content);
      setType(selectedType);
      setView("result");
    } else {
      setResult("");
      setType("");
    }
  };

  const handleBack = () => {
    setView("form");
  };

  return (
    <div className="relative min-h-screen">
      <div className="mesh-bg" />
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView("form")}>
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg shadow-lg flex items-center justify-center font-bold text-white transition-transform group-hover:scale-105">R</div>
            <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ResuAI
            </span>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center">
            {view === "result" && (
              <button 
                onClick={handleBack}
                className="text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden xs:inline">Back to Editor</span>
                <span className="xs:hidden">Back</span>
              </button>
            )}
            <div className="h-6 w-px bg-slate-800 mx-1 sm:mx-2" />
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {view === "form" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="text-center space-y-4 mb-10 sm:mb-16">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Land your <span className="text-indigo-500">dream job</span> <br className="sm:hidden" /> with AI.
              </h1>
              <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
                Generate professional resumes and personalized cover letters in seconds using state-of-the-art AI models.
              </p>
            </header>
            <Form form={form} setForm={setForm} onResult={handleResult} outputRef={outputRef} />
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white capitalize">{type === 'resume' ? 'Resume' : 'Cover Letter'} Generated</h2>
                <p className="text-slate-400">Review and download your professional {type === 'resume' ? 'resume' : 'cover letter'}.</p>
              </div>
              <button 
                onClick={handleBack}
                className="saas-button !from-slate-800 !to-slate-900 border border-slate-700 text-sm py-2"
              >
                Edit Details
              </button>
            </div>
            <Output result={result} type={type} outputRef={outputRef} />
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-slate-800 text-center text-slate-500 text-sm">
        © 2026 ResuAI.
      </footer>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
