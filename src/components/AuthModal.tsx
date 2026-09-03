import React, { useState, useEffect } from "react";
import { X, Lock, Mail, User, ArrowRight, HeartPulse, Sparkles, Shield, Eye, EyeOff } from "lucide-react";
import { 
  auth, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider 
} from "../firebase";
import { AuthErrorMessage } from "./AuthErrorMessage";
import swasthLogo from "../assets/images/swasth_logo.png";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: { email: string; name: string; role?: string; uid?: string }) => void;
  isAppDarkMode?: boolean;
  initialRole?: "PATIENT" | "DOCTOR" | "HOSPITAL" | "ADMIN";
  initialError?: { code: string; message: string } | null;
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  isAppDarkMode = false,
  initialRole = "PATIENT",
  initialError = null
}: AuthModalProps) {
  const [authRole, setAuthRole] = useState<"PATIENT" | "DOCTOR" | "HOSPITAL" | "ADMIN">(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"google_quick" | "password">("google_quick");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<{ code: string; message: string } | null>(initialError);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialError) {
      setError(initialError);
    }
  }, [initialError]);

  useEffect(() => {
    if (initialRole) {
      setAuthRole(initialRole);
    }
  }, [initialRole]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider, {
        email: email.trim(),
        name: name.trim(),
        role: authRole
      });

      const authenticatedUser = {
        email: result.user.email || email || "google-user@cityhealer.com",
        name: result.user.displayName || name || "City Healer User",
        role: authRole,
        uid: result.user.uid
      };

      if (onSuccess) {
        onSuccess(authenticatedUser);
      }
      onClose();
    } catch (err: any) {
      console.error("Google Auth failed:", err);
      setError({
        code: err.code || "auth/google-sign-in-failed",
        message: err.message || "Google secure sign-in was cancelled or failed."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOfflineBypass = () => {
    const defaultEmail = email.trim() || `${(name.trim() || "user").toLowerCase().replace(/[^a-z0-9]/g, "") || "sandbox"}@cityhealer.com`;
    const defaultName = name.trim() || (authRole === "DOCTOR" ? "Dr. Rajesh Sharma" : authRole === "HOSPITAL" ? "Apollo Admin" : authRole === "ADMIN" ? "Registry Officer" : "Ananya Verma");
    
    const mockUser = {
      uid: "user-demo-" + Date.now(),
      name: defaultName,
      email: defaultEmail,
      phone: "+91 98101 22334",
      role: authRole,
      age: 32,
      gender: "Female"
    };

    localStorage.setItem("city_healer_jwt", "mock-jwt-token-simulated");
    localStorage.setItem("city_healer_user", JSON.stringify(mockUser));
    
    auth.currentUser = {
      uid: mockUser.uid,
      email: mockUser.email,
      displayName: mockUser.name,
      phoneNumber: mockUser.phone,
      emailVerified: true,
      isAnonymous: false,
      tenantId: null,
      providerData: [],
      getIdToken: async () => "mock-jwt-token-simulated"
    };
    auth.notify();

    if (onSuccess) {
      onSuccess(mockUser);
    }
    onClose();
  };

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailToUse = email.trim();
    if (!emailToUse || !password) {
      setError({ code: "auth/missing-fields", message: "Please fill in all email and password fields." });
      return;
    }

    if (isSignUp && !name.trim()) {
      setError({ code: "auth/missing-name", message: "Please enter your full name for registration." });
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, emailToUse, password);
        const signedUser = {
          email: result.user.email || emailToUse,
          name: name.trim() || result.user.displayName || "City Healer User",
          role: authRole,
          uid: result.user.uid
        };
        if (onSuccess) {
          onSuccess(signedUser);
        }
        onClose();
      } else {
        const result = await signInWithEmailAndPassword(auth, emailToUse, password);
        const signedUser = {
          email: result.user.email || emailToUse,
          name: result.user.displayName || name.trim() || emailToUse.split("@")[0],
          role: authRole,
          uid: result.user.uid
        };
        if (onSuccess) {
          onSuccess(signedUser);
        }
        onClose();
      }
    } catch (err: any) {
      console.error("Password Auth error:", err);
      setError({
        code: err.code || "auth/invalid-credential",
        message: err.message || "Failed to authenticate with provided credentials."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-fadeIn"
      onClick={onClose}
    >
      {/* Centered Curved Modal Card */}
      <div 
        className={`relative w-full max-w-md rounded-[32px] p-6 sm:p-8 shadow-2xl border max-h-[92vh] overflow-y-auto transform transition-all duration-200 animate-scaleUp ${
          isAppDarkMode 
            ? "bg-slate-900 border-slate-800 text-slate-100 shadow-slate-950/60" 
            : "bg-white border-blue-100/90 text-slate-900 shadow-blue-950/15"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-full transition-colors ${
            isAppDarkMode 
              ? "text-slate-400 hover:text-white hover:bg-slate-800" 
              : "text-slate-400 hover:text-slate-800 hover:bg-slate-100"
          }`}
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-5">
          <img
            src={swasthLogo}
            alt="SwasthAI Logo"
            className="h-14 w-auto mx-auto object-contain drop-shadow-sm select-none"
          />
          <p className={`text-xs font-medium ${isAppDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Healing Cities Through Connected Care • Delhi NCR
          </p>
        </div>

        {/* Tab switch for Auth Type */}
        <div className={`grid grid-cols-2 p-1 rounded-xl mb-4 text-xs font-bold ${
          isAppDarkMode ? "bg-slate-950 border border-slate-800" : "bg-slate-100 border border-slate-200"
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab("google_quick")}
            className={`py-2 rounded-lg transition-all ${
              activeTab === "google_quick"
                ? isAppDarkMode 
                  ? "bg-slate-800 text-white shadow" 
                  : "bg-white text-slate-900 shadow"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            ⚡ Quick & Google Auth
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("password")}
            className={`py-2 rounded-lg transition-all ${
              activeTab === "password"
                ? isAppDarkMode 
                  ? "bg-slate-800 text-white shadow" 
                  : "bg-white text-slate-900 shadow"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            🔑 Email & Password
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4">
          {/* Role selector */}
          <div>
            <label className={`text-[11px] uppercase font-bold tracking-wider block ${
              isAppDarkMode ? "text-slate-400" : "text-slate-500"
            }`}>
              Simulate Role Authorization
            </label>
            <p className={`text-[12px] mb-1.5 ${isAppDarkMode ? "text-slate-500" : "text-slate-400"}`}>
              Select your role to access different areas of the platform after authentication.
            </p>
            <select
              value={authRole}
              onChange={(e: any) => setAuthRole(e.target.value)}
              className={`w-full border rounded-xl px-3.5 py-3 text-xs focus:outline-none focus:border-blue-500 font-semibold transition-all ${
                isAppDarkMode 
                  ? "bg-slate-950 border-slate-800 text-slate-100 focus:bg-slate-900 cursor-pointer" 
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white cursor-pointer"
              }`}
            >
              <option value="PATIENT" className={isAppDarkMode ? "bg-slate-900 text-white" : ""}>PATIENT (Primary User / Family Profiles)</option>
              <option value="DOCTOR" className={isAppDarkMode ? "bg-slate-900 text-white" : ""}>DOCTOR (Physician Care Portal)</option>
              <option value="HOSPITAL" className={isAppDarkMode ? "bg-slate-900 text-white" : ""}>HOSPITAL ADMIN (Bed Allocation Coordinator)</option>
              <option value="ADMIN" className={isAppDarkMode ? "bg-slate-900 text-white" : ""}>SYSTEM ADMIN (Delhi NCR Health Registry)</option>
            </select>
          </div>

          {/* User Full Name */}
          <div>
            <label className={`text-[11px] uppercase font-bold tracking-wider block mb-1 ${
              isAppDarkMode ? "text-slate-400" : "text-slate-500"
            }`}>
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ananya Verma"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold transition-all ${
                  isAppDarkMode
                    ? "bg-slate-950 border-slate-800 text-slate-100 focus:bg-slate-900"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                }`}
              />
            </div>
          </div>

          {/* Email ID */}
          <div>
            <label className={`text-[11px] uppercase font-bold tracking-wider block mb-1 ${
              isAppDarkMode ? "text-slate-400" : "text-slate-500"
            }`}>
              Email ID
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold transition-all ${
                  isAppDarkMode
                    ? "bg-slate-950 border-slate-800 text-slate-100 focus:bg-slate-900"
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                }`}
              />
            </div>
          </div>

          {/* Password field if in Password Tab */}
          {activeTab === "password" && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className={`text-[11px] uppercase font-bold tracking-wider block ${
                  isAppDarkMode ? "text-slate-400" : "text-slate-500"
                }`}>
                  Passcode / Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[11px] font-bold text-teal-600 hover:underline"
                >
                  {isSignUp ? "Already have account? Sign In" : "Need account? Sign Up"}
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-xs focus:outline-none focus:border-blue-500 font-semibold transition-all ${
                    isAppDarkMode
                      ? "bg-slate-950 border-slate-800 text-slate-100 focus:bg-slate-900"
                      : "bg-slate-50 border-slate-200 text-slate-900 focus:bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          <AuthErrorMessage
            error={error}
            onClear={() => setError(null)}
            onBypass={handleOfflineBypass}
            isDarkMode={isAppDarkMode}
          />

          {/* Actions depending on Tab */}
          {activeTab === "google_quick" ? (
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm py-3.5 rounded-xl flex items-center justify-center gap-3 cursor-pointer transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 bg-white p-0.5 rounded-full" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.65 0 3.13.57 4.3 1.69l3.22-3.22C17.56 1.63 14.99 1 12 1 7.35 1 3.39 3.63 1.5 7.5l3.86 3.03C6.27 7.54 8.92 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.65 2.83c2.13-1.97 3.36-4.87 3.36-8.49z" />
                  <path fill="#FBBC05" d="M5.36 14.47c-.24-.72-.37-1.49-.37-2.47s.13-1.75.37-2.47L1.5 6.5C.54 8.43 0 10.15 0 12s.54 3.57 1.5 5.5l3.86-3.03z" />
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.65-2.83c-1.01.68-2.3 1.09-4.31 1.09-3.08 0-5.73-2.5-6.66-5.49L1.48 15.88C3.37 19.75 7.33 23 12 23z" />
                </svg>
                {loading ? "Authenticating Session..." : "Continue with Google Secure Auth"}
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="flex-shrink mx-4 text-[11px] text-slate-400 dark:text-slate-500 font-bold tracking-wider uppercase">Or</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              <button
                type="button"
                onClick={handleOfflineBypass}
                className={`w-full font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] ${
                  isAppDarkMode 
                    ? "bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white" 
                    : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                🚀 Explore in Demo / Sandbox Mode
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handlePasswordAuth}
                disabled={loading}
                className="w-full bg-teal-800 hover:bg-teal-700 text-white font-extrabold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <Sparkles className="h-4 w-4 animate-spin text-teal-300" />
                ) : (
                  <>
                    <span>{isSignUp ? "Create Certified Account" : "Sign In to Medical Portal"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleOfflineBypass}
                className={`w-full font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isAppDarkMode 
                    ? "bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800" 
                    : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
                }`}
              >
                🚀 Quick Demo Sandbox Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
