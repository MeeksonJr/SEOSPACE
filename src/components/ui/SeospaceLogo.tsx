import React from "react";

interface SeospaceLogoProps {
  darkText?: boolean;
  /** Follow the public theme tokens (text-ink / bg-ink) instead of fixed colours */
  auto?: boolean;
  size?: "sm" | "md" | "lg";
  customName?: string;
}

/** Flat wordmark: 2x2 dot mark (one accent dot) + display-type name. No gradients. */
export function SeospaceLogo({
  darkText = true,
  auto = false,
  size = "md",
  customName,
}: SeospaceLogoProps) {
  const mark = size === "sm" ? "w-7 h-7" : size === "lg" ? "w-10 h-10" : "w-8 h-8";
  const textSize =
    size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-[1.35rem]";

  const markBg = auto ? "bg-ink" : darkText ? "bg-slate-950" : "bg-white";
  const dot = auto ? "bg-paper" : darkText ? "bg-white" : "bg-slate-950";
  const text = auto ? "text-ink" : darkText ? "text-slate-950" : "text-white";

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <div
        className={`${mark} ${markBg} rounded-[10px] grid grid-cols-2 gap-[3px] p-[7px]`}
        aria-hidden="true"
      >
        <span className="rounded-full bg-[#ff4d14]" />
        <span className={`rounded-full ${dot}`} />
        <span className={`rounded-full ${dot}`} />
        <span className={`rounded-full ${dot}`} />
      </div>
      <span
        className={`${textSize} ${text} leading-none`}
        style={{
          fontFamily: "var(--f-display), sans-serif",
          fontWeight: 700,
          letterSpacing: "-0.04em",
        }}
      >
        {customName || "seospace"}
        {!customName && <span className="text-[#ff4d14]">+</span>}
      </span>
    </div>
  );
}
