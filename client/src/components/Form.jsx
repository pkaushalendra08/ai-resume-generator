import { useState } from "react";

export default function Form({ form, setForm, onResult, outputRef }) {
  const [loadingType, setLoadingType] = useState(""); // 'resume' or 'coverLetter'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (type) => {
    setLoadingType(type);
    onResult("");

    try {
      const res = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mode: type }) // send mode to backend
      });

      const data = await res.json();
      
      if (!res.ok) {
        onResult(data.error || "❌ Error: Could not generate result.", type);
      } else {
        onResult(data.content, type); // pass content and type to Output
      }

      // ✅ Auto scroll to output section
      if (outputRef?.current) {
        outputRef.current.scrollIntoView({ behavior: "smooth" });
      }

    } catch (err) {
      onResult("❌ Error: Could not generate result.", type);
    } finally {
      setLoadingType("");
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="glass-card p-5 sm:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8"
    >
      <div className="border-b border-slate-700/50 pb-4 sm:pb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Your Professional Profile</h2>
        <p className="text-slate-400 mt-1 text-sm sm:text-base">Fill in your details to generate your career documents.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <div className="space-y-4">
          <h3 className="text-[10px] sm:text-xs font-semibold text-indigo-400 uppercase tracking-widest">Personal Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={`block text-xs sm:text-sm font-medium mb-1.5 transition-colors ${form.name ? 'text-indigo-400' : 'text-slate-300'}`}>Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Manoj Kumar"
                className="saas-input text-sm sm:text-base"
              />
            </div>
            <div>
              <label className={`block text-xs sm:text-sm font-medium mb-1.5 transition-colors ${form.email ? 'text-indigo-400' : 'text-slate-300'}`}>Email Address</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="saas-input text-sm sm:text-base"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-1.5 transition-colors ${form.mobile ? 'text-indigo-400' : 'text-slate-300'}`}>Mobile Number</label>
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="+91 98XXXXXXXX"
                  className="saas-input text-sm sm:text-base"
                />
              </div>
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-1.5 transition-colors ${form.date ? 'text-indigo-400' : 'text-slate-300'}`}>Target Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="saas-input text-sm sm:text-base [color-scheme:dark]"
                />
              </div>
            </div>
            <div>
              <label className={`block text-xs sm:text-sm font-medium mb-1.5 transition-colors ${form.social ? 'text-indigo-400' : 'text-slate-300'}`}>Social Links</label>
              <input
                name="social"
                value={form.social}
                onChange={handleChange}
                placeholder="LinkedIn, GitHub"
                className="saas-input text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        {/* Professional Details Section */}
        <div className="space-y-4">
          <h3 className="text-[10px] sm:text-xs font-semibold text-indigo-400 uppercase tracking-widest">Professional Experience</h3>
          <div>
            <label className={`block text-xs sm:text-sm font-medium mb-1.5 transition-colors ${form.skills ? 'text-indigo-400' : 'text-slate-300'}`}>Key Skills</label>
            <textarea
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="React, Node.js, SQL..."
              className="saas-input text-sm sm:text-base min-h-[100px]"
            />
          </div>
          <div>
            <label className={`block text-xs sm:text-sm font-medium mb-1.5 transition-colors ${form.experience ? 'text-indigo-400' : 'text-slate-300'}`}>Experience Summary</label>
            <textarea
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="Summarize your career highlights..."
              className="saas-input text-sm sm:text-base min-h-[100px]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-2">
        <div>
          <label className={`block text-xs sm:text-sm font-medium mb-1.5 transition-colors ${form.education ? 'text-indigo-400' : 'text-slate-300'}`}>Education</label>
          <textarea
            name="education"
            value={form.education}
            onChange={handleChange}
            placeholder="Degrees, certifications..."
            className="saas-input text-sm sm:text-base h-24"
          />
        </div>
        <div>
          <label className={`block text-xs sm:text-sm font-medium mb-1.5 transition-colors ${form.careerGoals ? 'text-indigo-400' : 'text-slate-300'}`}>Career Goals</label>
          <textarea
            name="careerGoals"
            value={form.careerGoals}
            onChange={handleChange}
            placeholder="What are you looking for?"
            className="saas-input text-sm sm:text-base h-24"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 sm:pt-8 border-t border-slate-700/50">
        <button
          type="button"
          onClick={() => handleSubmit("resume")}
          className="saas-button flex-1 group py-3 sm:py-4"
          disabled={!!loadingType}
        >
          <div className="flex items-center justify-center gap-2">
            {loadingType === "resume" ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-sm sm:text-base">AI is thinking...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm sm:text-base">Generate Smart Resume</span>
              </>
            )}
          </div>
        </button>
        <button
          type="button"
          onClick={() => handleSubmit("coverLetter")}
          className="saas-button flex-1 !bg-none bg-slate-800 hover:bg-slate-700 border border-slate-700 group shadow-none py-3 sm:py-4"
          disabled={!!loadingType}
        >
          <div className="flex items-center justify-center gap-2">
            {loadingType === "coverLetter" ? (
              <>
                <svg className="animate-spin h-5 w-5 text-indigo-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-sm sm:text-base">Writing your story...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm sm:text-base">Generate Cover Letter</span>
              </>
            )}
          </div>
        </button>
      </div>
    </form>
  );
}
