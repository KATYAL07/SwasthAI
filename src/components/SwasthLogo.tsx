import React from "react";
import swasthLogo from "../assets/images/swasth_logo.png";

interface SwasthLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  showText?: boolean;
  isDark?: boolean;
}

export const SWASTH_LOGO_URL = swasthLogo;

export function SwasthLogo({
  className = "",
  size = "md",
  showText = false,
  isDark = false,
}: SwasthLogoProps) {
  const sizeClasses = {
    sm: "h-7 w-auto",
    md: "h-9 w-auto",
    lg: "h-12 w-auto",
    xl: "h-16 w-auto",
    hero: "w-48 h-auto",
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={swasthLogo}
        alt="SwasthAI Logo"
        className={`${sizeClasses[size]} object-contain drop-shadow-sm select-none`}
        loading="eager"
      />
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-heading font-extrabold tracking-tight leading-none ${
              isDark ? "text-white" : "text-slate-950"
            }`}
            style={{ fontFamily: "Sora, sans-serif" }}
          >
            SWASTH <span className={isDark ? "text-emerald-400" : "text-emerald-600"}>AI</span>
          </span>
          <span
            className={`text-[8px] font-bold tracking-widest leading-tight uppercase mt-0.5 ${
              isDark ? "text-emerald-400" : "text-emerald-600"
            }`}
          >
            Metropolitan Care OS
          </span>
        </div>
      )}
    </div>
  );
}

export default SwasthLogo;
