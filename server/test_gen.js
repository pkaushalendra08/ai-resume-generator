import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

async function testGeneration() {
  const prompt = "Say 'Hello World'";
  const model = "llama-3.3-70b-versatile";
  
  console.log("Testing generation with model:", model);
  
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }]
      })
    });
    
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response data:", JSON.stringify(data, null, 2));
    
    if (data.choices && data.choices[0]) {
      console.log("SUCCESS! Content:", data.choices[0].message.content);
    } else {
      console.log("FAILED. No choices in response.");
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testGeneration();
