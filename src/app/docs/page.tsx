"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PublicFooter,
  PublicNavbar,
  usePublicTheme,
} from "@/components/ui/PublicChrome";

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
    id: "audit",
    method: "POST",
    path: "/api/audit",
    title: "Saved-First URL Audit & Metadata / DNS Extraction",
    description:
      "Returns the saved database snapshot for any previously audited URL in <15ms, or runs a full live Edge Crawler + Cloudflare DoH DNS + DOM scan when forceRefresh: true is passed.",
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

const WEBHOOKS = [
  {
    event: "audit.completed",
    desc: "Fires whenever a URL scan completes with full 5-pillar scores, Core Web Vitals, and DNS security intelligence.",
    sample: '{"event": "audit.completed", "url": "https://voice-one.com/services/", "overallScore": 88}',
  },
  {
    event: "lead.captured",
    desc: "Fires when a prospective client submits their email and domain through the White-Label Embeddable Widget.",
    sample: '{"event": "lead.captured", "name": "Alex Morgan", "email": "alex@agency.com", "auditScore": 84}',
  },
  {
    event: "article.generated",
    desc: "Fires when Seospace Neural Engine v4.2 finishes drafting and mathematically scoring a 95+ SEO article.",
    sample: '{"event": "article.generated", "articleId": "art-9482", "wordCount": 1840, "grade": 98}',
  },
];

export default function ApiDocsPage() {
  const { isDark, toggleTheme } = usePublicTheme(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDef>(ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState<string>(ENDPOINTS[0].defaultBody);
  const [responseJson, setResponseJson] = useState<string>(
    `{\n  "status": "Ready to execute live request",\n  "engine": "Seospace Neural Engine v4.2",\n  "tip": "Click 'Execute Live Request' below to test against the production backend"\n}`
  );
  const [running, setRunning] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);

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
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '${requestBody.replace(/\n\s*/g, " ")}'`;

  function handleCopyCurl() {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(curlSnippet);
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
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
                Developer REST API &amp; Webhooks • v4.2 Public Reference
              </div>
              <h1 className="sp-display text-[clamp(2.4rem,6vw,4.5rem)] text-ink leading-tight">
                Automate audits<span className="text-accent">.</span> <br />
                <span className="text-mute font-normal">Directly in your code &amp; pipeline.</span>
              </h1>
              <p className="text-xs sm:text-sm text-mute mt-3 max-w-2xl leading-relaxed">
                Connect Seospace’s 35-point diagnostic scanner, saved-first PostgreSQL caching, Cloudflare 1.1.1.1 DoH DNS validation, and autonomous AI article generator to your agency CRM, Zapier, Make, or CI/CD workflow.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/dashboard" className="sp-btn sp-btn-primary">
                Open Workspace Demo <span aria-hidden>↗</span>
              </Link>
              <Link href="/tools" className="sp-btn sp-btn-ghost">
                Free Generators
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-line flex flex-wrap items-center gap-6 text-xs text-mute font-mono">
            <div>
              Base URL: <span className="text-ink font-bold">https://seospace-kappa.vercel.app</span>
            </div>
            <div>
              Auth: <span className="text-ink font-bold">Bearer &lt;API_KEY&gt;</span>
            </div>
            <div>
              Format: <span className="text-ink font-bold">application/json</span>
            </div>
            <div>
              Status: <span className="text-accent font-bold">99.98% Uptime SLA</span>
            </div>
          </div>
        </div>

        {/* ====================================================================
            INTERACTIVE CONSOLE (SPLIT LAYOUT)
            ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Endpoint Selector & Webhooks */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card border border-line rounded-3xl p-6 sp-card-shadow space-y-4">
              <div className="sp-eyebrow text-mute">Available Production Endpoints</div>
              <div className="space-y-3">
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
                      className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                        active
                          ? "border-accent bg-accent/10 sp-card-shadow"
                          : "border-line bg-stage hover:border-ink/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              active ? "bg-accent text-white" : "bg-ink text-paper"
                            }`}
                          >
                            {ep.method}
                          </span>
                          <span className="font-mono text-xs font-bold text-ink">
                            {ep.path}
                          </span>
                        </div>
                        {active && (
                          <span className="text-[10px] font-mono font-bold text-accent uppercase">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-ink mt-2">
                        {ep.title}
                      </div>
                      <p className="text-[11px] text-mute mt-1 leading-relaxed">
                        {ep.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Outbound Webhook Subscriptions */}
            <div className="bg-card border border-line rounded-3xl p-6 sp-card-shadow space-y-4">
              <div className="flex items-center justify-between">
                <span className="sp-eyebrow text-accent">Outbound Webhook Events</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cobalt text-white">
                  HMAC Signed
                </span>
              </div>
              <p className="text-xs text-mute leading-relaxed">
                Configure HTTP POST endpoints to receive real-time JSON payloads as audits complete or leads arrive.
              </p>

              <div className="space-y-3 pt-2">
                {WEBHOOKS.map((wh) => (
                  <div key={wh.event} className="p-3.5 rounded-2xl border border-line bg-stage space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-ink">
                        {wh.event}
                      </span>
                      <span className="text-[10px] font-mono text-mute">
                        POST payload
                      </span>
                    </div>
                    <p className="text-[11px] text-mute leading-relaxed">
                      {wh.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Interactive Sandbox (Dark Night Theme) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-night text-[#f3f0e8] rounded-3xl p-6 sm:p-8 border border-[#2a2a2c] sp-card-shadow space-y-6">
              {/* Sandbox Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#2a2a2c]">
                <div className="flex items-center gap-2 font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-accent text-white text-xs font-bold">
                    {selectedEndpoint.method}
                  </span>
                  <span className="text-sm font-bold text-[#f3f0e8]">
                    {selectedEndpoint.path}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleExecuteRequest}
                  disabled={running}
                  className="sp-btn sp-btn-accent !py-2.5 !px-5 text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition disabled:opacity-50"
                >
                  {running ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Executing...</span>
                    </>
                  ) : (
                    <>
                      <span>Execute Live Request</span>
                      <span aria-hidden>→</span>
                    </>
                  )}
                </button>
              </div>

              {/* Request Payload Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase text-[#a5a5a0]">
                  <span>Request JSON Body (Editable)</span>
                  <span>JSON format</span>
                </div>
                <textarea
                  rows={5}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-[#18181b] border border-[#2a2a2c] font-mono text-xs text-[#f5d547] focus:outline-none focus:border-accent transition leading-relaxed resize-y"
                />
              </div>

              {/* cURL Command Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase text-[#a5a5a0]">
                  <span>Equivalent cURL Snippet</span>
                  <button
                    type="button"
                    onClick={handleCopyCurl}
                    className="hover:text-white inline-flex items-center gap-1 cursor-pointer transition text-accent font-bold"
                  >
                    <span>{copiedCurl ? "✓ Copied" : "Copy cURL"}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-[#18181b] border border-[#2a2a2c] font-mono text-[11px] text-[#a5a5a0] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {curlSnippet}
                </pre>
              </div>

              {/* Response Panel */}
              <div className="space-y-2 pt-2 border-t border-[#2a2a2c]">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase text-[#a5a5a0]">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Response Output</span>
                  </span>
                  {latencyMs !== null && (
                    <span className="text-emerald-400 font-bold">
                      200 OK • {latencyMs}ms latency
                    </span>
                  )}
                </div>
                <pre className="p-4 rounded-2xl bg-[#18181b] border border-[#2a2a2c] font-mono text-xs text-emerald-300 max-h-[380px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {responseJson}
                </pre>
              </div>
            </div>

            {/* Quick Integration Guides */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-card border border-line rounded-2xl p-5 sp-card-shadow space-y-2">
                <div className="sp-eyebrow text-cobalt">JavaScript / TypeScript</div>
                <p className="text-xs text-mute leading-relaxed">
                  Install via npm or use native fetch in Next.js, Node 20+, or Edge runtimes with zero external dependencies.
                </p>
              </div>
              <div className="bg-card border border-line rounded-2xl p-5 sp-card-shadow space-y-2">
                <div className="sp-eyebrow text-accent">Python / FastAPI</div>
                <p className="text-xs text-mute leading-relaxed">
                  Call our endpoints asynchronously via httpx or requests with built-in Pydantic model validation.
                </p>
              </div>
            </div>

            {/* Public Data Sources & Infrastructure Architecture Section */}
            <div className="bg-card border border-line rounded-3xl p-6 sm:p-8 sp-card-shadow space-y-5">
              <div>
                <span className="sp-eyebrow text-accent">Public Disclosure &amp; Telemetry</span>
                <h3 className="text-xl font-bold font-display text-ink mt-1">
                  Data Ingestion Architecture &amp; Upstream Providers
                </h3>
                <p className="text-xs text-mute mt-1 leading-relaxed">
                  Seospace aggregates and cross-validates data across multiple independent edge networks, authoritative registries, and AI search engines to generate zero-fluff, mathematical audits.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-stage border border-line space-y-1.5">
                  <div className="font-bold font-mono text-ink text-[11px] uppercase text-accent">
                    01 • Edge Crawler &amp; DOM
                  </div>
                  <div className="font-bold text-ink">Distributed Edge &amp; RapidAPI</div>
                  <p className="text-mute leading-relaxed text-[11px]">
                    Global headless edge workers and RapidAPI metadata microservices extracting raw DOM, OpenGraph, Twitter Cards, and canonical tags.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stage border border-line space-y-1.5">
                  <div className="font-bold font-mono text-ink text-[11px] uppercase text-cobalt">
                    02 • DNS Security &amp; SPF
                  </div>
                  <div className="font-bold text-ink">Cloudflare 1.1.1.1 DoH</div>
                  <p className="text-mute leading-relaxed text-[11px]">
                    Authoritative real-time DNS-over-HTTPS queries for A, AAAA (IPv6), MX, SPF TXT, and _dmarc records with zero local cache latency.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stage border border-line space-y-1.5">
                  <div className="font-bold font-mono text-ink text-[11px] uppercase text-[#141413] bg-butter px-2 py-0.5 rounded-md inline-block font-bold">
                    03 • History &amp; Trust
                  </div>
                  <div className="font-bold text-ink">Internet Archive CDX</div>
                  <p className="text-mute leading-relaxed text-[11px]">
                    Wayback Machine snapshot history to verify historical domain creation year, crawl depth, and backlink authority continuity.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stage border border-line space-y-1.5">
                  <div className="font-bold font-mono text-ink text-[11px] uppercase text-emerald-600">
                    04 • AI Search Intelligence
                  </div>
                  <div className="font-bold text-ink">Seospace Neural Engine v4.2</div>
                  <p className="text-mute leading-relaxed text-[11px]">
                    Multi-dimensional semantic scoring evaluating generative search visibility (GEO), WCAG 2.2 accessibility, and conversion copy lift.
                  </p>
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
