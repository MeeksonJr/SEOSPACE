import React from "react";
import { ShieldCheck, Star } from "lucide-react";

interface TrustPulseLogoProps {
  darkText?: boolean;
  auto?: boolean;
  size?: "sm" | "md" | "lg";
  customName?: string;
}

export function TrustPulseLogo({
  darkText = true,
  auto = false,
  size = "md",
  customName,
}: TrustPulseLogoProps) {
  const mark =
    size === "sm" ? "w-7 h-7" : size === "lg" ? "w-10 h-10" : "w-8 h-8";
  const textSize =
    size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";

  const markBg = auto ? "bg-emerald-600" : "bg-emerald-600";
  const text = auto
    ? "text-[var(--sp-ink)]"
    : darkText
    ? "text-slate-900"
    : "text-white";

  return (
    <div className="inline-flex items-center gap-2 select-none">
      <div
        className={`${mark} ${markBg} rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0 relative overflow-hidden`}
        aria-hidden="true"
      >
        <ShieldCheck className="w-4 h-4 text-white" />
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
        </span>
      </div>
      <span
        className={`${textSize} ${text} leading-none font-bold tracking-tight`}
        style={{
          fontFamily: "var(--f-display), sans-serif",
        }}
      >
        {customName || "TrustPulse"}
        <span className="text-emerald-500 font-extrabold ml-0.5">.ai</span>
      </span>
    </div>
  );
}
