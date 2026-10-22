"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PublicFooter,
  PublicNavbar,
  usePublicTheme,
} from "@/components/ui/PublicChrome";
import { Code2, Play, Check, Copy } from "lucide-react";

interface EndpointDef {
  id: string;
  method: string;
  path: string;
  title: string;
  description: string;
  defaultBody: string;
}

const ENDPOINTS: EndpointDef[] = [
  {
    id: "widget-feed",
    method: "GET",
    path: "/api/widget/widget-apex-wall",
    title: "Public Widget Review Feed & Configuration (CORS Enabled)",
    description:
      "Returns approved customer reviews filtered by minRating and maximum review count, along with the workspace branding. Accessible from any third-party domain via wildcard CORS.",
    defaultBody: "",
  },
  {
    id: "shield-submit",
    method: "POST",
    path: "/api/shield/submit",
    title: "Negative Review Shield — Private Grievance Capture",
    description:
      "Intercepts 1-3 star feedback from the customer funnel (/r/[slug]). Stores the grievance privately in TrustPulse, alerts the business manager, and prevents negative reviews from reaching Google Maps.",
    defaultBody: JSON.stringify(
      {
        workspaceId: "ws-apex-dental",
        rating: 2,
        customerName: "Alex Morgan",
        customerEmail: "alex.m@example.com",
        customerPhone: "(512) 555-8812",
        grievanceText:
          "Appointment started 20 minutes late due to unexpected delay in hygiene room.",
      },
      null,
      2
    ),
  },
  {
    id: "ai-reply",
    method: "POST",
    path: "/api/reviews/ai-reply",
    title: "PulseMind™ AI Review Responder & Sentiment Intelligence",
    description:
      "Analyzes customer sentiment and synthesizes 3 strategic reply angles (SEO-Boosted Gratitude, De-escalation & Empathy, Loyalty Reward) powered by the proprietary PulseMind™ Neural Engine.",
    defaultBody: JSON.stringify(
      {
        reviewId: "rev-1",
        workspaceId: "ws-apex-dental",
      },
      null,
      2
    ),
  },
  {
    id: "importer",
    method: "POST",
    path: "/api/importer",
    title: "Multi-Platform Review Importer",
    description:
      "Imports customer feedback from Google Places, Trustpilot, or CSV records into your workspace database.",
    defaultBody: JSON.stringify(
      {
        workspaceId: "ws-apex-dental",
        source: "google",
      },
      null,
      2
    ),
  },
];

export default function DocsPage() {
  const { isDark, toggleTheme } = usePublicTheme(false);
  const [activeEndpoint, setActiveEndpoint] = useState<EndpointDef>(ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState<string>(ENDPOINTS[0].defaultBody);
  const [responseOutput, setResponseOutput] = useState<string>("// Click 'Execute Request' to test this endpoint live in your browser");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("https://seospace-kappa.vercel.app");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const handleSelectEndpoint = (ep: EndpointDef) => {
    setActiveEndpoint(ep);
    setRequestBody(ep.defaultBody);
    setResponseOutput("// Ready to test " + ep.path);
  };

  const handleExecute = async () => {
    setLoading(true);
    setResponseOutput("// Sending request to " + activeEndpoint.path + "...");
    try {
      let res: Response;
      if (activeEndpoint.method === "GET") {
        res = await fetch(activeEndpoint.path);
      } else {
        res = await fetch(activeEndpoint.path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody || "{}",
        });
      }
      const data = await res.json();
      setResponseOutput(JSON.stringify(data, null, 2));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setResponseOutput("// Error executing request:\n" + msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(
      `<script src="${origin}/api/widget/script?id=widget-apex-toasts" defer></script>`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sp-page min-h-screen flex flex-col bg-[var(--sp-paper)] text-[var(--sp-ink)]">
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <Code2 className="w-3.5 h-3.5" />
              REST API &amp; Embed Specification
            </div>
            <h1 className="sp-display text-3xl sm:text-5xl font-bold tracking-tight">
              Developer &amp; Integration Hub
            </h1>
            <p className="text-base sm:text-lg text-[var(--sp-mute)] max-w-2xl leading-relaxed">
              Integrate TrustPulse into any client website, WordPress site, or Webflow project with a single &lt;script&gt; tag, or query our CORS-enabled JSON endpoints directly.
            </p>
          </div>

          {/* Embed Script Quick Start */}
          <div className="p-6 rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base text-[var(--sp-ink)]">
                1-Line Universal Script Embed
              </h2>
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--sp-line)] bg-[var(--sp-stage)] hover:bg-[var(--sp-line)] text-xs font-semibold text-[var(--sp-ink)] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Tag"}</span>
              </button>
            </div>
            <p className="text-xs text-[var(--sp-mute)]">
              Drop this script into the &lt;head&gt; or &lt;body&gt; of Shopify, WordPress, Webflow, or Squarespace. Automatically initializes and renders floating toasts without any npm build step.
            </p>
            <div className="p-3.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto border border-slate-800">
              &lt;script src=&quot;{origin}/api/widget/script?id=widget-apex-toasts&quot; defer&gt;&lt;/script&gt;
            </div>
          </div>

          {/* Interactive API Console */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--sp-ink)]">
              Interactive Live API Console
            </h2>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Endpoint list on Left (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                {ENDPOINTS.map((ep) => {
                  const isSelected = activeEndpoint.id === ep.id;
                  return (
                    <div
                      key={ep.id}
                      onClick={() => handleSelectEndpoint(ep)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[var(--sp-card)] border-emerald-500 shadow-md ring-1 ring-emerald-500"
                          : "bg-[var(--sp-stage)]/40 border-[var(--sp-line)] hover:bg-[var(--sp-stage)]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            ep.method === "GET"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200"
                          }`}
                        >
                          {ep.method}
                        </span>
                        <code className="text-xs font-mono font-bold text-[var(--sp-ink)]">
                          {ep.path}
                        </code>
                      </div>
                      <h3 className="font-semibold text-xs text-[var(--sp-ink)]">
                        {ep.title}
                      </h3>
                      <p className="text-[11px] text-[var(--sp-mute)] mt-1 line-clamp-2 leading-relaxed">
                        {ep.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Request & Response on Right (7 cols) */}
              <div className="lg:col-span-7 bg-[var(--sp-card)] rounded-3xl border border-[var(--sp-line)] p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--sp-line)]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-600 uppercase">
                      {activeEndpoint.method}
                    </span>
                    <span className="text-xs font-mono text-[var(--sp-ink)]">
                      {activeEndpoint.path}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleExecute}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{loading ? "Executing..." : "Execute Request"}</span>
                  </button>
                </div>

                {activeEndpoint.method === "POST" && (
                  <div>
                    <label className="block text-xs font-semibold text-[var(--sp-mute)] uppercase tracking-wider mb-1.5">
                      Request Payload (JSON)
                    </label>
                    <textarea
                      rows={5}
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      className="w-full font-mono text-xs p-3 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[var(--sp-mute)] uppercase tracking-wider mb-1.5">
                    Live Response Output
                  </label>
                  <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-[360px] border border-slate-800 leading-relaxed">
                    {responseOutput}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
