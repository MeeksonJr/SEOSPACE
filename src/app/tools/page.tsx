"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PublicNavbar,
  PublicFooter,
  usePublicTheme,
} from "@/components/ui/PublicChrome";
import {
  QrCode,
  Sparkles,
  Code2,
  Copy,
  Check,
  Star,
  Printer,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export default function FreeReputationToolsPage() {
  const { isDark, toggleTheme } = usePublicTheme(false);
  const [activeTab, setActiveTab] = useState<"qr" | "sentiment" | "widget">("qr");

  // Tool 1: Free QR Stand Generator State
  const [bizName, setBizName] = useState("Apex Dental Studio");
  const [googleUrl, setGoogleUrl] = useState("https://maps.google.com");
  const [brandColor, setBrandColor] = useState("#059669");
  const [copiedQrUrl, setCopiedQrUrl] = useState(false);

  // Tool 2: Review Sentiment Tester State
  const [sampleReviewText, setSampleReviewText] = useState(
    "Dr. Thorne was gentle and the clinic was spotless, but my appointment was delayed by 20 minutes."
  );
  const [analyzedSentiment, setAnalyzedSentiment] = useState<{
    ratingEstimate: number;
    tone: string;
    action: string;
  }>({
    ratingEstimate: 3,
    tone: "Mixed / Grievance Detected",
    action: "Activate Negative Review Shield (Intercept privately)",
  });

  // Tool 3: Embed Script Tester State
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    googleUrl
  )}&color=${brandColor.replace("#", "")}`;

  const analyzeReview = () => {
    const text = sampleReviewText.toLowerCase();
    if (text.includes("delay") || text.includes("wait") || text.includes("bad") || text.includes("rude")) {
      setAnalyzedSentiment({
        ratingEstimate: 2,
        tone: "Risk: Negative Customer Experience",
        action: "Shield Trigger: Intercept with Private Feedback Form to prevent Google rating damage",
      });
    } else {
      setAnalyzedSentiment({
        ratingEstimate: 5,
        tone: "Positive Brand Advocate",
        action: "One-Tap Google Maps Redirect: Prompt customer to post publicly!",
      });
    }
  };

  return (
    <div className="sp-page min-h-screen flex flex-col bg-[var(--sp-paper)] text-[var(--sp-ink)]">
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
              100% Free Public Utilities
            </div>
            <h1 className="sp-display text-3xl sm:text-5xl font-bold tracking-tight">
              Free Reputation &amp; Social Proof Tools
            </h1>
            <p className="text-base sm:text-lg text-[var(--sp-mute)] mt-2 max-w-2xl leading-relaxed">
              Generate custom review QR codes, analyze customer sentiment, and preview 1-line embeddable widgets with zero signup required.
            </p>
          </div>

          {/* Tool Switcher Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[var(--sp-stage)] border border-[var(--sp-line)] text-xs font-bold w-fit">
            <button
              type="button"
              onClick={() => setActiveTab("qr")}
              className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "qr"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-[var(--sp-mute)] hover:text-[var(--sp-ink)]"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Free QR Stand Maker</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sentiment")}
              className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "sentiment"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-[var(--sp-mute)] hover:text-[var(--sp-ink)]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Review Sentiment Analyzer</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("widget")}
              className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === "widget"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-[var(--sp-mute)] hover:text-[var(--sp-ink)]"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>1-Line Script Playground</span>
            </button>
          </div>

          {/* TAB 1: QR CODE STAND MAKER */}
          {activeTab === "qr" && (
            <div className="grid lg:grid-cols-12 gap-8 items-start bg-[var(--sp-card)] p-6 sm:p-10 rounded-3xl border border-[var(--sp-line)] shadow-xl animate-fade-in">
              <div className="lg:col-span-6 space-y-5">
                <h2 className="text-xl font-bold">Free Counter Stand &amp; Table Tent QR</h2>
                <p className="text-xs text-[var(--sp-mute)] leading-relaxed">
                  Enter your business details below to generate a printable QR card to place on your front desk or customer tables.
                </p>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--sp-mute)] mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={bizName}
                    onChange={(e) => setBizName(e.target.value)}
                    className="w-full text-xs border border-[var(--sp-line)] bg-[var(--sp-stage)]/40 rounded-xl px-3 py-2.5 text-[var(--sp-ink)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--sp-mute)] mb-1">
                    Google Review URL (or maps link)
                  </label>
                  <input
                    type="url"
                    value={googleUrl}
                    onChange={(e) => setGoogleUrl(e.target.value)}
                    className="w-full text-xs border border-[var(--sp-line)] bg-[var(--sp-stage)]/40 rounded-xl px-3 py-2.5 text-[var(--sp-ink)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--sp-mute)] mb-1">
                    Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                    />
                    <span className="font-mono text-xs text-[var(--sp-mute)]">{brandColor}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Card</span>
                  </button>
                  <Link
                    href="/dashboard/qr-studio"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--sp-line)] bg-[var(--sp-stage)] hover:bg-[var(--sp-line)] text-xs font-bold text-[var(--sp-ink)]"
                  >
                    <span>Full QR Studio in Dashboard →</span>
                  </Link>
                </div>
              </div>

              {/* Printable Card Preview */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-xs p-6 rounded-3xl border-2 border-slate-300 bg-white text-slate-900 shadow-xl text-center space-y-4">
                  <div className="h-2 w-full rounded-full" style={{ backgroundColor: brandColor }} />
                  <div className="font-black text-base tracking-tight">{bizName}</div>
                  <div className="flex justify-center text-amber-400 gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <img src={qrImageUrl} alt="QR Code" className="w-36 h-36 mx-auto object-contain" />
                    <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Point Camera &amp; Tap
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    How was your experience today?
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Scan to share feedback &amp; help our team maintain 5-star service.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SENTIMENT ANALYZER */}
          {activeTab === "sentiment" && (
            <div className="bg-[var(--sp-card)] p-6 sm:p-10 rounded-3xl border border-[var(--sp-line)] shadow-xl space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold">Review Sentiment &amp; Shield Router</h2>
              <p className="text-xs text-[var(--sp-mute)]">
                Type or paste any customer feedback to see how TrustPulse automatically scores the sentiment and chooses whether to route to Google Maps or the Negative Review Shield.
              </p>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--sp-mute)] mb-1">
                  Customer Review Text
                </label>
                <textarea
                  rows={4}
                  value={sampleReviewText}
                  onChange={(e) => setSampleReviewText(e.target.value)}
                  className="w-full text-xs font-sans border border-[var(--sp-line)] bg-[var(--sp-stage)]/40 rounded-xl p-3 text-[var(--sp-ink)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={analyzeReview}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze Sentiment</span>
              </button>

              <div className="p-5 rounded-2xl bg-[var(--sp-stage)]/60 border border-[var(--sp-line)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[var(--sp-ink)]">
                    Calculated Result:
                  </span>
                  <span className="text-amber-500 font-mono font-bold text-xs">
                    Estimated Rating: {"★".repeat(analyzedSentiment.ratingEstimate)} ({analyzedSentiment.ratingEstimate} Stars)
                  </span>
                </div>
                <div className="text-xs text-[var(--sp-ink)]">
                  <strong>Detected Sentiment:</strong> {analyzedSentiment.tone}
                </div>
                <div className="p-3 rounded-xl bg-[var(--sp-card)] border border-[var(--sp-line)] text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                  {analyzedSentiment.action}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WIDGET SCRIPT PLAYGROUND */}
          {activeTab === "widget" && (
            <div className="bg-[var(--sp-card)] p-6 sm:p-10 rounded-3xl border border-[var(--sp-line)] shadow-xl space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold">1-Line Embed Script Generator</h2>
              <p className="text-xs text-[var(--sp-mute)]">
                Copy this single line of code to embed live social proof toasts onto any client website. Works with WordPress, Shopify, Webflow, and custom HTML.
              </p>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-100 font-mono text-xs overflow-x-auto flex items-center justify-between gap-4">
                <code>
                  &lt;script src=&quot;https://trustpulse-ai.vercel.app/api/widget/script?id=widget-apex-toasts&quot; defer&gt;&lt;/script&gt;
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      '<script src="https://trustpulse-ai.vercel.app/api/widget/script?id=widget-apex-toasts" defer></script>'
                    );
                    setCopiedEmbed(true);
                    setTimeout(() => setCopiedEmbed(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 cursor-pointer"
                >
                  {copiedEmbed ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-xs text-[var(--sp-mute)]">
                <div className="p-4 rounded-xl border border-[var(--sp-line)] bg-[var(--sp-stage)]/30 space-y-1">
                  <span className="font-bold text-[var(--sp-ink)] block">Lightweight</span>
                  <span>Under 15KB uncompressed, zero jQuery or runtime frameworks</span>
                </div>
                <div className="p-4 rounded-xl border border-[var(--sp-line)] bg-[var(--sp-stage)]/30 space-y-1">
                  <span className="font-bold text-[var(--sp-ink)] block">CORS Wildcard</span>
                  <span>Access-Control-Allow-Origin: * for seamless embedding</span>
                </div>
                <div className="p-4 rounded-xl border border-[var(--sp-line)] bg-[var(--sp-stage)]/30 space-y-1">
                  <span className="font-bold text-[var(--sp-ink)] block">Edge CDN</span>
                  <span>Hosted globally on Vercel Edge with sub-100ms response time</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
