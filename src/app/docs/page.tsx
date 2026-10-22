"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Code2,
  Copy,
  Loader2,
  Play,
  Sparkles,
  Terminal,
  Webhook,
} from "lucide-react";
import { SeospaceLogo } from "@/components/ui/SeospaceLogo";
import { OpenSiteNavigatorButton } from "@/components/ui/SiteNavigatorDrawer";

const ENDPOINTS = [
  {
    id: "audit",
    method: "POST",
    path: "/api/audit",
    title: "Saved-First URL Audit & Metadata / DNS Extraction",
    description:
      "Returns the saved database snapshot for any previously audited URL in <15ms, or runs a full live RapidAPI + Cloudflare DoH DNS + DOM scan when forceRefresh: true is passed.",
    defaultBody: JSON.stringify(
      { url: "https://voice-one.com/services/", forceRefresh: false },
      null,
      2
    ),
  },
  {
    id: "dns",
    method: "POST",
    path: "/api/dns-check",
    title: "Live Cloudflare 1.1.1.1 DNS, SPF, DMARC & MX Inspector",
    description:
      "Queries Cloudflare DNS-over-HTTPS in real time for A, AAAA (IPv6), MX, SPF TXT, _dmarc TXT, and Nameservers.",
    defaultBody: JSON.stringify({ domain: "voice-one.com" }, null, 2),
  },
  {
    id: "keywords",
    method: "POST",
    path: "/api/keywords",
    title: "Live Keyword Volume, CPC & Topic Title Discovery",
    description:
      "Generates high-intent commercial and transactional keyword opportunities with 55-character article headlines via Seospace Neural Engine v4.2.",
    defaultBody: JSON.stringify(
      { query: "24/7 virtual receptionist service" },
      null,
      2
    ),
  },
  {
    id: "ai-content",
    method: "POST",
    path: "/api/ai-content",
    title: "Autonomous SEO Article Generator & Content Optimizer",
    description:
      "Generates or optimizes publication-ready SEO articles calibrated to score 95+/100 on our 7-point mathematical grading engine.",
    defaultBody: JSON.stringify(
      {
        action: "generate_article",
        focusKeyword: "Virtual Receptionist Answering Service",
        linkedDomain: "voice-one.com",
      },
      null,
      2
    ),
  },
];

export default function ApiDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState(ENDPOINTS[0].defaultBody);
  const [responseJson, setResponseJson] = useState<string>(
    `{\n  "status": "Ready to execute live request",\n  "engine": "Seospace Neural Engine v4.2",\n  "tip": "Click 'Run Live API Request' above to test against the production backend"\n}`
  );
  const [running, setRunning] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleExecuteRequest() {
    setRunning(true);
    const start = Date.now();
    try {
      const res = await fetch(selectedEndpoint.path, {
        method: selectedEndpoint.method,
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });
      const data = await res.json();
      setLatencyMs(Date.now() - start);
      setResponseJson(JSON.stringify(data, null, 2));
    } catch (err: unknown) {
      setResponseJson(
        JSON.stringify(
          { error: err instanceof Error ? err.message : "Request failed" },
          null,
          2
        )
      );
    } finally {
      setRunning(false);
    }
  }

  const curlSnippet = `curl -X ${selectedEndpoint.method} https://seospace-kappa.vercel.app${selectedEndpoint.path} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_live_seospace_9f8a7d6c5b4e" \\
  -d '${requestBody.replace(/\n\s*/g, " ")}'`;

  function handleCopyCurl() {
    navigator.clipboard.writeText(curlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-900 pb-20">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="shrink-0">
              <SeospaceLogo />
            </Link>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <Terminal className="w-3.5 h-3.5" /> Developer REST API &amp;
              Webhook Reference (v4.2)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
            <OpenSiteNavigatorButton label="All Pages" />
            <Link
              href="/compare"
              className="hidden lg:inline-flex px-3 py-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition"
            >
              Competitor Battlecard
            </Link>
            <Link
              href="/tools"
              className="hidden lg:inline-flex px-3 py-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition"
            >
              Free SEO &amp; DNS Tools
            </Link>
            <Link
              href="/dashboard"
              className="px-3 sm:px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white inline-flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />{" "}
              <span className="hidden sm:inline">Workspace</span> Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="w-full max-w-[1440px] mx-auto px-6 pt-8 space-y-8">
        {/* Hero Banner */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Headless SEO, CRO &amp; DNS
            Intelligence API • Interactive Sandbox
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Seospace Neural Engine v4.2 — REST API &amp; Webhooks
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Integrate automated URL auditing, saved-first metadata caching,
            Cloudflare DoH DNS/SPF/DMARC checks, and AI article generation into
            your agency CRM, Zapier, Make, or CI/CD pipeline.
          </p>
        </div>

        {/* Interactive Endpoint Selector + Live Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Endpoint List & Request Editor */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                SELECT PRODUCTION ENDPOINT
              </div>
              {ENDPOINTS.map((ep) => {
                const active = selectedEndpoint.id === ep.id;
                return (
                  <button
                    key={ep.id}
                    type="button"
                    onClick={() => {
                      setSelectedEndpoint(ep);
                      setRequestBody(ep.defaultBody);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer ${
                      active
                        ? "bg-blue-50/80 border-blue-500"
                        : "bg-slate-50/70 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-mono font-bold">
                        {ep.method}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {ep.path}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 mt-1.5">
                      {ep.title}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {ep.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Webhook Event Reference */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                <Webhook className="w-4 h-4" /> Outbound Webhook Events
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-mono font-bold text-slate-900">
                    audit.completed
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Fires whenever a URL scan completes with full 5-pillar scores
                    and DNS intelligence.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-mono font-bold text-slate-900">
                    lead.captured
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Fires when a prospect submits their email via the
                    White-Label Embeddable Audit Widget.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-mono font-bold text-slate-900">
                    article.generated
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Fires when Seospace Neural Engine v4.2 finishes generating a
                    95+/100 SEO article.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live Request & Response Playground */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-xs font-mono font-bold">
                    {selectedEndpoint.method}
                  </span>
                  <span className="font-mono text-sm font-bold text-blue-300">
                    {selectedEndpoint.path}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleExecuteRequest}
                  disabled={running}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs inline-flex items-center gap-1.5 cursor-pointer transition"
                >
                  {running ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing Live Request...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Run Live API Request</span>
                    </>
                  )}
                </button>
              </div>

              {/* JSON Body Input */}
              <div>
                <div className="text-[11px] font-mono uppercase text-slate-400 mb-1.5">
                  Request JSON Payload (Editable)
                </div>
                <textarea
                  rows={5}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-blue-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* cURL Snippet */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono uppercase text-slate-400 mb-1.5">
                  <span>cURL Command</span>
                  <button
                    type="button"
                    onClick={handleCopyCurl}
                    className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copied ? "Copied!" : "Copy cURL"}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap">
                  {curlSnippet}
                </pre>
              </div>

              {/* Live Response Output */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono uppercase text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" /> Live JSON
                    Response
                  </span>
                  {latencyMs !== null && (
                    <span className="text-emerald-400 font-bold">
                      200 OK • {latencyMs}ms
                    </span>
                  )}
                </div>
                <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 max-h-96 overflow-y-auto whitespace-pre-wrap">
                  {responseJson}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
