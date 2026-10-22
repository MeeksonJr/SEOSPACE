"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Copy,
  Check,
  Eye,
  Sliders,
  Sparkles,
  ArrowLeft,
  Star,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { WidgetConfig, WidgetType, WidgetTheme } from "@/types/trustpulse";

export default function WidgetStudioPage() {
  const workspaces = TrustPulseStore.getWorkspaces();
  const [selectedWsId, setSelectedWsId] = useState<string>("ws-apex-dental");
  const ws = workspaces.find((w) => w.id === selectedWsId) || workspaces[0];

  // Config states
  const [widgetType, setWidgetType] = useState<WidgetType>("toast_notification");
  const [theme, setTheme] = useState<WidgetTheme>("glassmorphism");
  const [position, setPosition] = useState<"bottom_left" | "bottom_right">("bottom_left");
  const [minRating, setMinRating] = useState<number>(4);
  const [loopInterval, setLoopInterval] = useState<number>(6);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);

  const sampleReviews = TrustPulseStore.getReviews(ws?.id).filter((r) => r.rating >= minRating);

  const scriptSnippet = `<script src="https://trustpulse-ai.vercel.app/api/widget/script?id=widget-apex-toasts" defer></script>`;
  const iframeSnippet = `<iframe src="https://trustpulse-ai.vercel.app/embed/widget-apex-wall" width="100%" height="600" frameborder="0" loading="lazy"></iframe>`;

  const copyScript = () => {
    navigator.clipboard.writeText(scriptSnippet);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const copyIframe = () => {
    navigator.clipboard.writeText(iframeSnippet);
    setCopiedIframe(true);
    setTimeout(() => setCopiedIframe(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <span>Widget Studio</span>
              <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                1-Line Embed
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Configure and preview embeddable social proof widgets for any website
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedWsId}
            onChange={(e) => setSelectedWsId(e.target.value)}
            className="text-xs font-semibold bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-slate-800"
          >
            {workspaces.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="font-bold text-sm uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            <span>Widget Configuration</span>
          </h2>

          {/* 1. Widget Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Widget Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "toast_notification", label: "Floating Toast" },
                { id: "wall_of_love", label: "Wall of Love" },
                { id: "floating_pill", label: "Rating Badge" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setWidgetType(t.id as WidgetType)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    widgetType === t.id
                      ? "bg-slate-900 text-white border-slate-900 shadow"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Theme */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Visual Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "glassmorphism", label: "Glassmorphic" },
                { id: "light", label: "Clean Light" },
                { id: "dark", label: "Deep Dark" },
              ].map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setTheme(th.id as WidgetTheme)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    theme === th.id
                      ? "bg-slate-900 text-white border-slate-900 shadow"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Position (for Toast or Pill) */}
          {widgetType !== "wall_of_love" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Screen Position
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPosition("bottom_left")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    position === "bottom_left"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  Bottom Left (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => setPosition("bottom_right")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    position === "bottom_right"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  Bottom Right
                </button>
              </div>
            </div>
          )}

          {/* 4. Minimum Rating Filter */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
              <span>Minimum Star Rating to Display:</span>
              <span className="text-amber-500 font-bold font-mono">
                {"★".repeat(minRating)} ({minRating}+ Stars)
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={5}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* 5. Loop Interval */}
          {widgetType === "toast_notification" && (
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>Display Timing per Review:</span>
                <span className="font-mono text-emerald-600 font-bold">
                  {loopInterval} seconds
                </span>
              </div>
              <input
                type="range"
                min={4}
                max={15}
                value={loopInterval}
                onChange={(e) => setLoopInterval(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          )}

          {/* Embed Snippets Code Box */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800">
                  A. 1-Line Async Script (Recommended)
                </span>
                <button
                  type="button"
                  onClick={copyScript}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] break-all border border-slate-800">
                {scriptSnippet}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800">
                  B. Responsive iFrame Snippet
                </span>
                <button
                  type="button"
                  onClick={copyIframe}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  {copiedIframe ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIframe ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] break-all border border-slate-800">
                {iframeSnippet}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>Real-Time Browser Simulation</span>
            </span>
            <span>{sampleReviews.length} Qualifying Reviews</span>
          </div>

          {/* Browser Mockup */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden min-h-[500px] flex flex-col justify-between p-6 relative">
            {/* Mock website header */}
            <div className="pb-4 border-b border-slate-800 flex items-center justify-between text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="ml-2 font-mono text-[11px] text-slate-500">
                  https://{ws.slug}.com
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">
                ● Live Inject
              </span>
            </div>

            {/* Mock website body content */}
            <div className="py-8 text-center space-y-3 opacity-30 select-none">
              <div className="h-6 w-48 bg-slate-700 rounded-full mx-auto" />
              <div className="h-3 w-80 bg-slate-800 rounded-full mx-auto" />
              <div className="h-3 w-64 bg-slate-800 rounded-full mx-auto" />
            </div>

            {/* LIVE WIDGET RENDERED ON CANVAS */}
            <div className="relative z-10 py-6">
              {widgetType === "toast_notification" && (
                <div
                  className={`w-full max-w-sm rounded-2xl p-4 shadow-2xl flex gap-3.5 items-start animate-fade-in ${
                    position === "bottom_right" ? "ml-auto" : "mr-auto"
                  } ${
                    theme === "dark"
                      ? "bg-slate-950 border border-slate-800 text-white"
                      : theme === "light"
                      ? "bg-white border border-slate-200 text-slate-900"
                      : "bg-slate-900/90 backdrop-blur-md border border-white/10 text-white"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow"
                    style={{ backgroundColor: ws.brandColor }}
                  >
                    {sampleReviews[0]?.authorName.charAt(0) || "C"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs truncate">
                        {sampleReviews[0]?.authorName || "Valued Client"}
                      </span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: sampleReviews[0]?.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      &ldquo;{sampleReviews[0]?.reviewText || "Excellent service!"}&rdquo;
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Appointment
                      </span>
                      <span>Just now</span>
                    </div>
                  </div>
                </div>
              )}

              {widgetType === "wall_of_love" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full animate-fade-in">
                  {sampleReviews.slice(0, 4).map((r) => (
                    <div
                      key={r.id}
                      className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 text-white text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{r.authorName}</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-3">
                        &ldquo;{r.reviewText}&rdquo;
                      </p>
                      <div className="text-[10px] text-emerald-400 font-semibold">
                        ✓ {r.platform.toUpperCase()} Review
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {widgetType === "floating_pill" && (
                <div
                  className={`animate-fade-in inline-block ${
                    position === "bottom_right" ? "float-right" : "float-left"
                  }`}
                >
                  <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-950 text-white shadow-2xl border border-slate-800">
                    <span className="text-amber-400 font-bold">★</span>
                    <span className="font-bold text-xs">
                      {ws.stats.averageRating} / 5.0
                    </span>
                    <span className="text-[11px] text-slate-400 border-l border-slate-800 pl-2.5">
                      {ws.stats.totalReviews}+ Verified Reviews
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom notice */}
            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
              <span>Pure Vanilla Script: &lt; 15KB uncompressed</span>
              <span>CORS: Wildcard `*` Allowed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
