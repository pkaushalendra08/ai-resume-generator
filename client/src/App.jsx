import { useState, useRef } from "react";
import Form from "./components/Form";
import Output from "./components/Output";

export default function App() {
  const [result, setResult] = useState("");
  const [type, setType] = useState(""); // 'resume' or 'coverLetter'
  const outputRef = useRef(null);

  const handleResult = (content, selectedType) => {
    setResult(content);
    setType(selectedType);
  };

  return (
    <div className="relative min-h-screen">
      <div className="mesh-bg" />
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg shadow-lg flex items-center justify-center font-bold text-white">R</div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ResuAI
            </span>
          </div>
          <div className="flex gap-4 text-sm text-slate-400">
            <span className="hover:text-white cursor-pointer transition-colors">Pricing</span>
            <span className="hover:text-white cursor-pointer transition-colors">Templates</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        <header className="text-center space-y-4 mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            Land your <span className="text-indigo-500">dream job</span> with AI.
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Generate professional resumes and personalized cover letters in seconds using state-of-the-art AI models.
          </p>
        </header>

        <Form onResult={handleResult} outputRef={outputRef} />
        <Output result={result} type={type} outputRef={outputRef} />
      </main>

      <footer className="py-12 border-t border-slate-800 text-center text-slate-500 text-sm">
        © 2026 ResuAI. Built for high-performers.
      </footer>
    </div>
  );
}
