"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PublicNavbar,
  PublicFooter,
  usePublicTheme,
} from "@/components/ui/PublicChrome";
import {
  Code2,
  Copy,
  Check,
  Star,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { GoogleBadge, TrustpilotBadge } from "@/components/ui/PlatformBadges";

export default function PublicWidgetPage() {
  const { isDark, toggleTheme } = usePublicTheme(false);
  const workspaces = TrustPulseStore.getWorkspaces();
  const [selectedWsId, setSelectedWsId] = useState<string>("ws-apex-dental");
  const ws = workspaces.find((w) => w.id === selectedWsId) || workspaces[0];

  const reviews = TrustPulseStore.getReviews(ws.id);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);

  const scriptTag = `<script src="https://trustpulse-ai.vercel.app/api/widget/script?id=widget-apex-toasts" defer></script>`;
  const iframeTag = `<iframe src="https://trustpulse-ai.vercel.app/embed/widget-apex-wall" width="100%" height="600" frameborder="0" loading="lazy"></iframe>`;

  const copyScript = () => {
    navigator.clipboard.writeText(scriptTag);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const copyIframe = () => {
    navigator.clipboard.writeText(iframeTag);
    setCopiedIframe(true);
    setTimeout(() => setCopiedIframe(false), 2000);
  };

  return (
    <div className="sp-page min-h-screen flex flex-col bg-[var(--sp-paper)] text-[var(--sp-ink)]">
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
              <Code2 className="w-3.5 h-3.5" />
              Embeddable Widget Suite
            </div>
            <h1 className="sp-display text-3xl sm:text-5xl font-bold tracking-tight">
              Embed Authentic Social Proof on Any Site
            </h1>
            <p className="text-base sm:text-lg text-[var(--sp-mute)] mt-2 max-w-2xl leading-relaxed">
              Showcase verified Google &amp; Trustpilot testimonials with floating toast notifications or a responsive Wall of Love grid with a single &lt;script&gt; tag.
            </p>
          </div>

          {/* Quick Embed Snippets */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">A. 1-Line Async Script</h3>
                <button
                  type="button"
                  onClick={copyScript}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? "Copied!" : "Copy Script"}</span>
                </button>
              </div>
              <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto border border-slate-800 break-all">
                {scriptTag}
              </div>
              <p className="text-[11px] text-[var(--sp-mute)]">
                Recommended for Webflow, Shopify, Squarespace, and custom HTML. Self-contained under 15KB.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">B. Responsive iFrame Wall</h3>
                <button
                  type="button"
                  onClick={copyIframe}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  {copiedIframe ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIframe ? "Copied!" : "Copy iFrame"}</span>
                </button>
              </div>
              <div className="p-3 bg-slate-900 text-slate-200 font-mono text-xs rounded-xl overflow-x-auto border border-slate-800 break-all">
                {iframeTag}
              </div>
              <p className="text-[11px] text-[var(--sp-mute)]">
                Best for WordPress Elementor, Divi, or Wix blocks that require an isolated iframe embed.
              </p>
            </div>
          </div>

          {/* Live Preview Wall */}
          <div className="bg-[var(--sp-card)] rounded-3xl border border-[var(--sp-line)] p-6 sm:p-10 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--sp-line)]">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span>Live Wall of Love: {ws.name}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </h2>
                <p className="text-xs text-[var(--sp-mute)] mt-0.5">
                  Real-time client reviews formatted for high conversion
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedWsId}
                  onChange={(e) => setSelectedWsId(e.target.value)}
                  className="text-xs font-semibold bg-[var(--sp-stage)] border border-[var(--sp-line)] rounded-xl px-3 py-2 text-[var(--sp-ink)] focus:outline-none"
                >
                  {workspaces.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
                <Link
                  href={`/embed/${ws.id === "ws-apex-dental" ? "widget-apex-wall" : "widget-bayview-badge"}`}
                  target="_blank"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <span>Standalone View</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Reviews Masonry */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl border border-[var(--sp-line)] bg-[var(--sp-stage)]/40 hover:bg-[var(--sp-stage)]/80 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-amber-400 gap-0.5">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      {r.platform === "google" && <GoogleBadge />}
                      {r.platform === "trustpilot" && <TrustpilotBadge />}
                      {r.platform !== "google" && r.platform !== "trustpilot" && (
                        <span className="text-[10px] uppercase font-bold text-[var(--sp-mute)]">
                          {r.platform}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--sp-ink)] leading-relaxed italic">
                      &ldquo;{r.reviewText}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-[var(--sp-line)]">
                    <img
                      src={
                        r.authorAvatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      }
                      alt={r.authorName}
                      className="w-8 h-8 rounded-full object-cover border border-[var(--sp-line)]"
                    />
                    <div>
                      <div className="text-xs font-bold text-[var(--sp-ink)]">
                        {r.authorName}
                      </div>
                      <div className="text-[10px] text-[var(--sp-mute)]">
                        {r.authorRole || "Verified Client"} {r.authorLocation ? `• ${r.authorLocation}` : ""}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
