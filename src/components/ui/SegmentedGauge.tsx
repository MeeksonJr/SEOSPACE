"use client";

import React from "react";

interface SegmentedGaugeProps {
  score: number; // 0 to 100
  label?: string;
  sublabel?: string;
  variant?: "segmented" | "ticks";
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export function SegmentedGauge({
  score,
  label,
  sublabel,
  variant = "segmented",
  theme = "light",
  size = "md",
}: SegmentedGaugeProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const statusText =
    sublabel ||
    (clamped >= 88
      ? "Your Score is Excellent"
      : clamped >= 75
      ? "Optimal Performance"
      : clamped >= 60
      ? "Needs Optimization"
      : "Critical Attention");

  if (variant === "ticks") {
    // Pastis.com style 40-tick precision semi-circle gauge (Image 4)
    const totalTicks = 40;
    const activeTicks = Math.round((clamped / 100) * totalTicks);
    return (
      <div className="relative flex flex-col items-center justify-center w-full">
        <svg viewBox="0 0 220 128" className="w-full max-w-[230px] overflow-visible">
          {Array.from({ length: totalTicks }).map((_, idx) => {
            const angleDeg = -180 + (idx / (totalTicks - 1)) * 180;
            const angleRad = (angleDeg * Math.PI) / 180;
            const cx = 110;
            const cy = 108;
            const rInner = 70;
            const rOuter = 92;
            const x1 = cx + rInner * Math.cos(angleRad);
            const y1 = cy + rInner * Math.sin(angleRad);
            const x2 = cx + rOuter * Math.cos(angleRad);
            const y2 = cy + rOuter * Math.sin(angleRad);
            const isActive = idx < activeTicks;

            let strokeColor = theme === "dark" ? "#1E293B" : "#F1F5F9";
            if (isActive) {
              if (clamped >= 80) {
                strokeColor = idx < totalTicks * 0.5 ? "#2563EB" : "#3B82F6";
              } else if (clamped >= 65) {
                strokeColor = "#EC4899"; // Pastis magenta-rose accent
              } else {
                strokeColor = "#EF4444";
              }
            }

            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={strokeColor}
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div className="-mt-12 text-center">
          <div
            className={`text-3xl font-bold tracking-tight ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            {clamped}%
          </div>
          <div
            className={`text-xs font-medium mt-0.5 ${
              theme === "dark" ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {label || "Optimal"}
          </div>
        </div>
      </div>
    );
  }

  // Seospace 9-segment rounded arc gauge (Images 1, 2 & 3)
  const segments = 9;
  const activeSegments = Math.round((clamped / 100) * segments);
  const maxWidth =
    size === "sm"
      ? "max-w-[170px]"
      : size === "lg"
      ? "max-w-[260px]"
      : "max-w-[220px]";

  const blueShades = [
    "#1D4ED8",
    "#1E40AF",
    "#2563EB",
    "#2563EB",
    "#3B82F6",
    "#3B82F6",
    "#60A5FA",
    "#93C5FD",
    "#BFDBFE",
  ];

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      <svg
        viewBox="0 0 220 125"
        className={`w-full ${maxWidth} overflow-visible`}
      >
        {Array.from({ length: segments }).map((_, i) => {
          const gapDeg = 5;
          const totalSpan = 180;
          const segSpan = (totalSpan - gapDeg * (segments - 1)) / segments;
          const startDeg = -180 + i * (segSpan + gapDeg);
          const endDeg = startDeg + segSpan;

          const startRad = (startDeg * Math.PI) / 180;
          const endRad = (endDeg * Math.PI) / 180;
          const cx = 110;
          const cy = 105;
          const r = 84;

          const x1 = cx + r * Math.cos(startRad);
          const y1 = cy + r * Math.sin(startRad);
          const x2 = cx + r * Math.cos(endRad);
          const y2 = cy + r * Math.sin(endRad);

          const isFilled = i < activeSegments;
          const stroke = isFilled
            ? blueShades[i] || "#3B82F6"
            : theme === "dark"
            ? "#1E293B"
            : "#E2E8F0";

          return (
            <path
              key={i}
              d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
              fill="none"
              stroke={stroke}
              strokeWidth="12"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      <div className="-mt-11 text-center">
        <div
          className={`${
            size === "sm" ? "text-xl" : "text-2xl"
          } font-bold tracking-tight ${
            theme === "dark" ? "text-white" : "text-slate-900"
          }`}
        >
          {clamped}/100
        </div>
        <div
          className={`text-xs font-medium mt-0.5 ${
            theme === "dark" ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {statusText}
        </div>
      </div>
    </div>
  );
}
