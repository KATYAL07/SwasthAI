import React, { useState } from "react";
import { X, Lock, Mail, User, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { InteractiveHoverButton } from "./ui/interactive-hover-button";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: { email: string; name: string }) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (isSignUp && !name) {
      setError("Please enter your full name.");
      return;
    }
    setLoading(true);

    // Simulate login / signup authentication process
    setTimeout(() => {
      setLoading(false);
      if (onSuccess) {
        onSuccess({ email, name: name || email.split("@")[0] });
      }
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      {/* Curved Edge Rectangle Modal */}
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 mb-1">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {isSignUp ? "Create SwasthAI Account" : "Welcome to SwasthAI"}
          </h2>
          <p className="text-xs text-slate-500">
            {isSignUp 
              ? "Join the metropolitan smart healthcare network" 
              : "Sign in to access your personalized medical portal"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs text-rose-600 bg-rose-50 rounded-xl border border-rose-100 font-medium">
              {error}
            </div>
          )}

          {isSignUp && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Full Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Dr. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-600 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-600 focus:bg-white transition-all text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-600 focus:bg-white transition-all text-slate-800"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-sm font-semibold shadow-md transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <Sparkles className="h-4 w-4 animate-spin text-teal-300" />
              ) : (
                <>
                  <span>{isSignUp ? "Sign Up" : "Sign In"}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Toggle between Sign In and Sign Up */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="font-bold text-teal-700 hover:underline ml-1"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="font-bold text-teal-700 hover:underline ml-1"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
