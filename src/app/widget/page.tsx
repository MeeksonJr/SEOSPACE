"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  addCapturedLead,
  getWhiteLabelConfig,
  saveAuditReport,
} from "@/lib/storage/workspace-store";
import {
  PublicFooter,
  PublicNavbar,
  usePublicTheme,
} from "@/components/ui/PublicChrome";

function WidgetFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDark, toggleTheme } = usePublicTheme(false);
  const defaultWl = getWhiteLabelConfig();

  const agencyName =
    searchParams.get("agency") || defaultWl.agencyName || "Apex Digital Growth";
  const primaryColor =
    searchParams.get("color") || defaultWl.primaryColor || "#FF4D14";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);

  const iframeSnippet = `<iframe\n  src="https://seospace-kappa.vercel.app/widget?agency=${encodeURIComponent(
    agencyName
  )}&color=${encodeURIComponent(primaryColor)}"\n  width="100%"\n  height="540"\n  frameborder="0"\n  style="border-radius: 20px; overflow: hidden;"\n></iframe>`;

  function handleCopyIframe() {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(iframeSnippet);
      setCopiedIframe(true);
      setTimeout(() => setCopiedIframe(false), 2000);
    }
  }

  async function handleWidgetSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!websiteUrl.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: websiteUrl }),
      });
      const data = await res.json();

      const score = data?.report?.overallScore || 78;
      addCapturedLead({
        name: name.trim() || "Website Visitor",
        email: email.trim() || "prospect@company.com",
        websiteUrl: websiteUrl.trim(),
        auditScore: score,
      });

      if (data?.report) {
        saveAuditReport(data.report);
        router.push(`/report/${data.report.id}`);
      } else {
        router.push("/report/stripe-com");
      }
    } catch {
      router.push("/report/stripe-com");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sp-page min-h-screen flex flex-col bg-paper text-ink font-sans transition-colors duration-300">
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1 px-4 sm:px-8 py-8 sm:py-12 max-w-[88rem] mx-auto w-full space-y-10">
        {/* ====================================================================
            STAGE HEADER
            ==================================================================== */}
        <div className="sp-stage border border-line p-6 sm:p-10 rounded-3xl sp-card-shadow space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="sp-eyebrow text-accent mb-2">
                White-Label Embeddable Widget • Inbound Lead Generation
              </div>
              <h1 className="sp-display text-[clamp(2.4rem,6vw,4.5rem)] text-ink leading-tight">
                Turn visitors into<span className="text-accent">.</span> <br />
                <span className="text-mute font-normal">Retainer audit clients automatically.</span>
              </h1>
              <p className="text-xs sm:text-sm text-mute mt-3 max-w-2xl leading-relaxed">
                Embed this interactive 60-second website audit widget directly on your agency homepage, blog, or landing page. Capture inbound prospect emails and deliver high-impact diagnostic reports under your brand.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/dashboard?tab=widget" className="sp-btn sp-btn-primary">
                Configure in Workspace <span aria-hidden>↗</span>
              </Link>
              <Link href="/dashboard?tab=leads" className="sp-btn sp-btn-ghost">
                View Captured Leads
              </Link>
            </div>
          </div>
        </div>

        {/* ====================================================================
            SPLIT SHOWCASE: LIVE PREVIEW & EXPLANATION
            ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: The Live Interactive Widget Card */}
          <div className="lg:col-span-6 space-y-4">
            <div className="sp-eyebrow text-mute">Live Embed Preview Container</div>
            <div className="bg-card border border-line rounded-3xl p-6 sm:p-10 sp-card-shadow relative overflow-hidden space-y-6">
              {/* Agency Brand Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-line">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <span className="font-bold text-xs uppercase tracking-wider text-ink">
                    {agencyName}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-mute px-2.5 py-0.5 rounded-full border border-line bg-stage">
                  Free 60s Audit
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                  Get Your Free Website Audit
                </h2>
                <p className="text-xs sm:text-sm text-mute mt-2 leading-relaxed">
                  Enter your domain below to receive an instant 35-point diagnostic report across SEO, CRO conversion blockers, and AI Search citations prepared by <strong>{agencyName}</strong>.
                </p>
              </div>

              <form onSubmit={handleWidgetSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-mute mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full px-4 py-3 rounded-2xl bg-stage border border-line text-xs text-ink focus:outline-none focus:border-ink transition font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-mute mb-1.5">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full px-4 py-3 rounded-2xl bg-stage border border-line text-xs text-ink focus:outline-none focus:border-ink transition font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-mute mb-1.5">
                    Website URL to Audit
                  </label>
                  <input
                    type="url"
                    required
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3.5 rounded-2xl bg-stage border border-line text-xs font-mono text-ink focus:outline-none focus:border-ink transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: primaryColor }}
                  className="w-full py-4 px-6 rounded-2xl text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition hover:opacity-95 shadow-md disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Running 35-Point Diagnostic Audit...</span>
                    </>
                  ) : (
                    <>
                      <span>Generate My Free Audit Report</span>
                      <span aria-hidden>→</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-4 border-t border-line flex items-center justify-between text-[11px] text-mute">
                <span className="flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Instant Live Results • Zero Spam
                </span>
                <span className="font-mono">Powered by Seospace</span>
              </div>
            </div>
          </div>

          {/* Right: How It Works & Embed Code Snippet */}
          <div className="lg:col-span-6 space-y-6">
            {/* Embed Code Card */}
            <div className="bg-card border border-line rounded-3xl p-6 sm:p-8 sp-card-shadow space-y-4">
              <div className="flex items-center justify-between">
                <span className="sp-eyebrow text-accent">1-Click Embed Snippet</span>
                <button
                  type="button"
                  onClick={handleCopyIframe}
                  className="sp-btn sp-btn-ghost !py-1.5 !px-3 text-xs font-mono cursor-pointer"
                >
                  {copiedIframe ? "✓ Snippet Copied" : "Copy <iframe> Code"}
                </button>
              </div>
              <p className="text-xs text-mute leading-relaxed">
                Paste this snippet into Webflow, WordPress, Framer, Squarespace, or any custom HTML site.
              </p>
              <pre className="p-4 rounded-2xl bg-night text-[#a5a5a0] border border-[#2a2a2c] font-mono text-xs overflow-x-auto leading-relaxed">
                {iframeSnippet}
              </pre>
            </div>

            {/* 3-Step Agency Inbound Pipeline */}
            <div className="bg-card border border-line rounded-3xl p-6 sm:p-8 sp-card-shadow space-y-5">
              <span className="sp-eyebrow text-mute">The Agency Flywheel</span>
              <div className="space-y-4">
                {[
                  {
                    step: "01",
                    title: "Embed on your agency site",
                    desc: "Add the widget to your header, case studies, or as a standalone /free-audit landing page with your agency colors.",
                  },
                  {
                    step: "02",
                    title: "Prospect submits domain",
                    desc: "Visitor enters their URL and email to see their site's health. The audit runs instantly in the background.",
                  },
                  {
                    step: "03",
                    title: "Lead saved to your CRM",
                    desc: "Contact details, target URL, and initial audit score are saved to your Seospace workspace and sent to your webhook.",
                  },
                  {
                    step: "04",
                    title: "Pitch the solution",
                    desc: "Follow up with a ready-made PDF proposal highlighting the exact issues found and your monthly retainer offer.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4 p-3 rounded-2xl border border-line bg-stage">
                    <span className="font-mono text-xs font-bold text-accent shrink-0 pt-0.5">
                      {item.step}
                    </span>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-ink">{item.title}</div>
                      <p className="text-[11px] text-mute leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}

export default function WidgetPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs font-mono text-mute">
          Loading Audit Widget...
        </div>
      }
    >
      <WidgetFormContent />
    </Suspense>
  );
}
