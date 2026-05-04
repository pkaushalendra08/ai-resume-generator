import { useState } from "react";

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("login"); // 'login' or 'signup'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md glass-card p-8 animate-in zoom-in-95 duration-300 border-slate-700/50 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
        
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {mode === "login" ? "Log in to access your resumes" : "Join ResuAI to build your career"}
          </p>
        </div>

        <div className="space-y-4">
          <button className="w-full bg-white hover:bg-slate-50 text-slate-900 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-slate-800 flex-1" />
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">or email</span>
            <div className="h-px bg-slate-800 flex-1" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="name@company.com"
                className="saas-input py-2.5"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="saas-input py-2.5"
              />
            </div>
          </div>

          <button className="saas-button w-full mt-2">
            {mode === "login" ? "Sign In" : "Sign Up"}
          </button>

          <p className="text-center text-sm text-slate-400 mt-6">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button 
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              {mode === "login" ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
