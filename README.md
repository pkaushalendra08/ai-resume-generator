# 🚀 ResuAI: AI-Powered Resume and CV Builder

ResuAI is a modern, high-end SaaS platform designed to transform your professional profile into polished, industry-standard Resumes and Cover Letters using state-of-the-art AI. Built with a focus on premium aesthetics and seamless user experience, ResuAI helps high-performers land their dream jobs with ease.

---

## 🎨 Design Philosophy
ResuAI features a **Glassmorphic Dark Theme** with vibrant mesh backgrounds, smooth CSS animations, and a mobile-first responsive architecture. The interface is designed to be alive, interactive, and extremely premium.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **PDF Generation**: [jsPDF](https://parall.ax/products/jspdf)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **AI Integration**: [Groq Cloud API](https://groq.com/)

---

## ✨ Features

- **AI Resume Architect**: Powered by Llama 3.3 for high-precision career document generation.
- **Smart Cover Letters**: Craft personalized stories using advanced LLM reasoning.
- **Responsive Previews**: A4-standard document previews that look perfect on any device.
- **PDF Export**: High-fidelity PDF generation directly in the browser.
- **Cross-Platform**: Fully optimized for mobile, tablet, and desktop viewing.

---

## 📂 Folder Structure

```bash
resume-ai-app/
├── client/                 # Frontend React 19 Application
│   ├── src/                # Source code (Components, App, CSS)
│   ├── .env                # Client environment variables
│   └── package.json        # Frontend dependencies (React 19, Vite 7, Tailwind 4)
├── server/                 # Backend Node.js API
│   ├── index.js            # Express server & Groq API integration
│   ├── .env                # Server environment variables (GROQ_API_KEY)
│   └── package.json        # Backend dependencies (Express 5, Node-fetch)
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/pkaushalendra08/ai-resume-generator.git
cd resume-ai-app
```

### 2. Setup Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api/generate
```

### 3. Install Dependencies

**For Server:**
```bash
cd server
npm install
```

**For Client:**
```bash
cd ../client
npm install
```

### 4. Run the Application

**Start Server:**
```bash
cd server
node index.js
```

**Start Client:**
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`.

---
Built by [Kaushalendra](https://github.com/pkaushalendra08).
