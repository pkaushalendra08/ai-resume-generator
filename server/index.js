import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  const {
    name,
    email,
    mobile,
    social,
    experience,
    skills,
    education,
    careerGoals,
    date,
    mode // 'resume' or 'coverLetter'
  } = req.body;

  // Filter only filled fields
  const fields = [
    { label: "Name", value: name },
    { label: "Email", value: email },
    { label: "Mobile", value: mobile },
    { label: "Social Media", value: social },
    { label: "Experience", value: experience },
    { label: "Skills", value: skills },
    { label: "Education", value: education },
    { label: "Career Goal", value: careerGoals }
  ].filter((f) => f.value && f.value.trim());

  const userInfoText = fields
    .map((f) => `${f.label}: ${f.value.trim()}`)
    .join("\n");

  // ✅ Return early if nothing is filled
  if (!userInfoText || userInfoText.trim() === "") {
    return res.status(400).json({
      error: "⚠️ Please fill at least one field to generate a resume or cover letter."
    });
  }

  let prompt = "";

  if (mode === "resume") {
    prompt = `
Act as a professional career assistant. Based only on the information provided below, generate a clean, professionally formatted resume. Begin directly with the resume content — do not include any introductory phrases like “Here is your resume.” The user’s name must be bold and centered at the top. Extra Bold the heading Contact Information, Summary, Skills, Experience, and Education. After each section of input details, there must be exactly two line bottom margin to provide clear spacing and improve readability. Strictly do not include any section or detail that the user did not provide — do not assume, invent, or add placeholders. Do not include any comments or notes. Format everything cleanly and professionally, with bullet points where appropriate and aligned text. The final result must look exactly like a real, ready-to-use professional resume — bold headings, spaced sections, and no fluff.
 Create the summary of the resume based on the goal of the user as provided in data. Use ONLY this info:
${userInfoText}
`;
  }

  else if (mode === "coverLetter") {
    prompt = `
Act as you are a professional career assistant. 
Based only on the information below, generate a personalized cover letter in standard format without any fluff lines 
and start directly with the content of coverletter. strictly do not start with "Here is a personalized cover letter" or similar lines, 
only start with actual content , Strictly exclude any sections or content that the user did not provide. 
Do not mention, infer, or create information for missing or unfilled fields. Only include details explicitly given.:
 Use ONLY this info:
${userInfoText}
${date?.trim() ? `Date: ${date.trim()}` : ""}

`;
  } else {
    return res.status(400).json({ error: "Invalid mode selected." });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "❌ No content returned.";
    res.status(200).json({ content });

  } catch (err) {
    console.error("❌ Error from Groq:", err.message);
    res.status(500).json({ error: "AI generation failed." });
  }
});

app.listen(5000, () => {
  console.log("✅ Server running at http://localhost:5000");
});
