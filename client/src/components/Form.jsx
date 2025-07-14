import { useState } from "react";

export default function Form({ onResult }) {
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
      const res = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mode: type }) // send mode to backend
      });

      const data = await res.json();
      onResult(data.content, type); // pass content and type to Output
    } catch (err) {
      onResult("❌ Error: Could not generate result.", type);
    } finally {
      setLoadingType("");
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4 bg-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto mt-8"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">
        AI-based Resume & Cover Letter Generator
      </h2>

      {/* Name */}
      <div>
        <label className="block font-medium mb-1">Full Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Manoj Kumar"
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block font-medium mb-1">Email Address</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="e.g. example@email.com"
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      {/* Mobile */}
      <div>
        <label className="block font-medium mb-1">Mobile Number</label>
        <input
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          placeholder="e.g. +9198XXXXXXXX"
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      {/* Social */}
      <div>
        <label className="block font-medium mb-1">Social Media Links</label>
        <input
          name="social"
          value={form.social}
          onChange={handleChange}
          placeholder="LinkedIn, GitHub (comma separated)"
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      {/* Date (for cover letter only) */}
      <div>
        <label className="block font-medium mb-1">Date (used in Cover Letter)</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      {/* Experience */}
      <div>
        <label className="block font-medium mb-1">Experience</label>
        <textarea
          name="experience"
          value={form.experience}
          onChange={handleChange}
          placeholder={`e.g.\n- Web Developer at XYZ Company (2022–2024)\n- Built 10+ apps using React and Node.js`}
          className="w-full border border-gray-300 p-2 rounded"
          rows={3}
        />
      </div>

      {/* Skills */}
      <div>
        <label className="block font-medium mb-1">Skills</label>
        <textarea
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="e.g. JavaScript, React, Node.js, Teamwork, Communication"
          className="w-full border border-gray-300 p-2 rounded"
          rows={2}
        />
      </div>

      {/* Education */}
      <div>
        <label className="block font-medium mb-1">Education</label>
        <textarea
          name="education"
          value={form.education}
          onChange={handleChange}
          placeholder="e.g. B.Tech CSE, ABC University, 2025"
          className="w-full border border-gray-300 p-2 rounded"
          rows={2}
        />
      </div>

      {/* Career Goal */}
      <div>
        <label className="block font-medium mb-1">Career Goal</label>
        <textarea
          name="careerGoals"
          value={form.careerGoals}
          onChange={handleChange}
          placeholder="e.g. Seeking a frontend developer role in a product-based company"
          className="w-full border border-gray-300 p-2 rounded"
          rows={2}
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => handleSubmit("resume")}
          className="flex-1 bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded"
          disabled={loadingType === "resume"}
        >
          {loadingType === "resume" ? "Generating Resume..." : "📄 Generate Resume"}
        </button>
        <button
          type="button"
          onClick={() => handleSubmit("coverLetter")}
          className="flex-1 bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded"
          disabled={loadingType === "coverLetter"}
        >
          {loadingType === "coverLetter" ? "Generating Cover Letter..." : "✉️ Generate Cover Letter"}
        </button>
      </div>
    </form>
  );
}
