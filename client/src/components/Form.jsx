import { useState } from "react";

export default function Form({ onResult, outputRef }) {
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
      className="glass-card p-8 max-w-4xl mx-auto space-y-8"
    >
      <div className="border-b border-slate-700/50 pb-6">
        <h2 className="text-3xl font-bold text-white">Your Professional Profile</h2>
        <p className="text-slate-400 mt-1">Fill in your details to generate your career documents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Personal Information</h3>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Manoj Kumar"
              className="saas-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="saas-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Mobile Number</label>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="+91 98XXXXXXXX"
              className="saas-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Social Links</label>
            <input
              name="social"
              value={form.social}
              onChange={handleChange}
              placeholder="LinkedIn, GitHub"
              className="saas-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Target Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="saas-input [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Professional Details Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Professional details</h3>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Skills</label>
            <textarea
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="React, Node.js, SQL..."
              className="saas-input min-h-[100px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Experience Summary</label>
            <textarea
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="Summarize your career highlights..."
              className="saas-input min-h-[100px]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Education</label>
          <textarea
            name="education"
            value={form.education}
            onChange={handleChange}
            placeholder="Degrees, certifications..."
            className="saas-input h-24"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Career Goals</label>
          <textarea
            name="careerGoals"
            value={form.careerGoals}
            onChange={handleChange}
            placeholder="What are you looking for?"
            className="saas-input h-24"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-700/50">
        <button
          type="button"
          onClick={() => handleSubmit("resume")}
          className="saas-button flex-1"
          disabled={!!loadingType}
        >
          {loadingType === "resume" ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Crafting Resume...
            </span>
          ) : "📄 Generate Resume"}
        </button>
        <button
          type="button"
          onClick={() => handleSubmit("coverLetter")}
          className="saas-button flex-1 !from-slate-700 !to-slate-800 hover:!from-slate-600 hover:!to-slate-700"
          disabled={!!loadingType}
        >
          {loadingType === "coverLetter" ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Writing Cover Letter...
            </span>
          ) : "✉️ Generate Cover Letter"}
        </button>
      </div>
    </form>
  );
}
