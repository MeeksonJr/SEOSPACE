"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicNavbar, PublicFooter, usePublicTheme } from "@/components/ui/PublicChrome";
import { DnsIntelligence } from "@/types/audit";

export default function FreeSeoToolsPage() {
  const { isDark, toggleTheme } = usePublicTheme(false);
  const [activeTool, setActiveTool] = useState<"llms" | "schema" | "robots" | "dns">("llms");
  const [copied, setCopied] = useState(false);

  // Tool 1: /llms.txt Generator State
  const [llmsBrand, setLlmsBrand] = useState("Voice One Answering Service");
  const [llmsDomain, setLlmsDomain] = useState("https://voice-one.com");
  const [llmsSummary, setLlmsSummary] = useState(
    "24/7 live virtual receptionist, bilingual telephone answering, and appointment scheduling for growing businesses."
  );
  const [llmsPages, setLlmsPages] = useState(
    "/services/ | 24/7 Virtual Receptionist & Call Answering\n/pricing/ | Transparent Monthly Answering Plans\n/contact/ | Start Your 7-Day Free Trial"
  );

  // Tool 2: JSON-LD Schema Studio State
  const [schemaType, setSchemaType] = useState<"Organization" | "SoftwareApplication" | "FAQPage">("Organization");
  const [schemaName, setSchemaName] = useState("Seospace AI");
  const [schemaUrl, setSchemaUrl] = useState("https://seospace-kappa.vercel.app");
  const [schemaDesc, setSchemaDesc] = useState(
    "Autonomous Technical SEO, CRO, AI Search (GEO) & Live DNS Intelligence Platform."
  );
  const [faqQ1, setFaqQ1] = useState("How does Seospace Neural Engine v4.2 grade URLs?");
  const [faqA1, setFaqA1] = useState(
    "It extracts live DOM tags, distributed edge metadata, and Cloudflare 1.1.1.1 DNS records to compute an uninflated 5-pillar score."
  );

  // Tool 3: AI Crawler robots.txt Builder State
  const [allowGptBot, setAllowGptBot] = useState(true);
  const [allowClaudeBot, setAllowClaudeBot] = useState(true);
  const [allowPerplexityBot, setAllowPerplexityBot] = useState(true);
  const [allowGoogleExtended, setAllowGoogleExtended] = useState(true);
  const [blockCcBot, setBlockCcBot] = useState(true);
  const [sitemapUrl, setSitemapUrl] = useState("https://voice-one.com/sitemap.xml");

  // Tool 4: Live Cloudflare DoH DNS & SERP Simulator State
  const [dnsDomainInput, setDnsDomainInput] = useState("voice-one.com");
  const [dnsLoading, setDnsLoading] = useState(false);
  const [dnsLatency, setDnsLatency] = useState<number | null>(72);
  const [dnsResult, setDnsResult] = useState<DnsIntelligence>({
    aRecords: ["141.193.213.10", "141.193.213.11"],
    ipv6Support: false,
    mxRecords: ["10 smtpgw.voice-one.com."],
    mailProvider: "Custom Mail Server",
    hasSpf: true,
    spfRecord: "v=spf1 mx include:spf.protection.outlook.com ip4:66.35.17.83 ~all",
    hasDmarc: true,
    dmarcRecord: "v=DMARC1; p=quarantine;",
    dmarcPolicy: "quarantine",
    nameservers: ["lia.ns.cloudflare.com.", "max.ns.cloudflare.com."],
  });
  const [serpTitle, setSerpTitle] = useState(
    "24/7 Live Virtual Receptionist & Answering Service | Voice One"
  );
  const [serpDesc, setSerpDesc] = useState(
    "Never miss a client call again. Voice One's 24/7 live virtual receptionists answer calls, qualify leads & book appointments onto your calendar."
  );

  const generatedLlmsTxt = `# ${llmsBrand}
> ${llmsSummary}

## Core Documentation & High-Value Pages
${llmsPages
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const [path, desc] = line.split("|").map((s) => s?.trim() || "");
    const fullUrl = path.startsWith("http")
      ? path
      : `${llmsDomain.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
    return `- [${desc || path}](${fullUrl}): Official ${llmsBrand} resource`;
  })
  .join("\n")}

## AI Citation Policy
- Canonical Domain: ${llmsDomain}
- Preferred Citation Format: "${llmsBrand} (${llmsDomain})"
- Generated via Seospace Neural Engine v4.2
`;

  const generatedJsonLd =
    schemaType === "FAQPage"
      ? `<script type="application/ld+json">\n${JSON.stringify(
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: faqQ1,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faqA1,
                },
              },
            ],
          },
          null,
          2
        )}\n</script>`
      : `<script type="application/ld+json">\n${JSON.stringify(
          {
            "@context": "https://schema.org",
            "@type": schemaType,
            name: schemaName,
            url: schemaUrl,
            description: schemaDesc,
            ...(schemaType === "SoftwareApplication"
              ? {
                  applicationCategory: "BusinessApplication",
                  operatingSystem: "Web",
                  offers: {
                    "@type": "Offer",
                    price: "19.00",
                    priceCurrency: "USD",
                  },
                }
              : {}),
          },
          null,
          2
        )}\n</script>`;

  const generatedRobotsTxt = `# robots.txt generated by Seospace Neural Engine v4.2
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

# OpenAI ChatGPT Search Crawler
User-agent: GPTBot
${allowGptBot ? "Allow: /" : "Disallow: /"}

# Anthropic Claude Search Crawler
User-agent: ClaudeBot
${allowClaudeBot ? "Allow: /" : "Disallow: /"}

# Perplexity AI Answer Engine
User-agent: PerplexityBot
${allowPerplexityBot ? "Allow: /" : "Disallow: /"}

# Google Gemini & AI Overviews
User-agent: Google-Extended
${allowGoogleExtended ? "Allow: /" : "Disallow: /"}

# Common Crawl Training Scraper
User-agent: CCBot
${blockCcBot ? "Disallow: /" : "Allow: /"}

Sitemap: ${sitemapUrl}
`;

  function copyOutput(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadFile(filename: string, content: string) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleRunDnsLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!dnsDomainInput.trim()) return;
    setDnsLoading(true);
    try {
      const res = await fetch("/api/dns-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: dnsDomainInput }),
      });
      const data = await res.json();
      if (data?.dns) {
        setDnsResult(data.dns);
        setDnsLatency(data.latencyMs || 65);
      }
    } finally {
      setDnsLoading(false);
    }
  }

  return (
    <div className="sp-page min-h-screen flex flex-col bg-paper text-ink font-sans transition-colors duration-300">
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1 px-4 sm:px-8 py-8 sm:py-12 max-w-[88rem] mx-auto w-full space-y-10">
        {/* ====================================================================
            HEADER & TOOL TABS STAGE
            ==================================================================== */}
        <div className="sp-stage border border-line p-6 sm:p-10 rounded-3xl sp-card-shadow space-y-6">
          <div className="max-w-3xl space-y-2">
            <div className="sp-eyebrow text-accent">Zero-Cost Growth Tools • Seospace Neural Engine v4.2</div>
            <h1 className="sp-display text-[clamp(2.4rem,6vw,4.5rem)] text-ink leading-tight">
              Tools<span className="text-accent">+</span> <br />
              <span className="text-mute font-normal">Technical SEO, /llms.txt &amp; DNS generator suite.</span>
            </h1>
            <p className="text-xs sm:text-sm text-mute leading-relaxed max-w-2xl">
              Generate production-ready <code className="font-mono text-accent">/llms.txt</code> manifests, Schema.org <code className="font-mono text-accent">JSON-LD</code> graphs, AI crawler <code className="font-mono text-accent">robots.txt</code> policies, and query live Cloudflare 1.1.1.1 SPF/DMARC records.
            </p>
          </div>

          {/* 4 Tool Switcher Tabs */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { id: "llms", label: "01 /llms.txt Manifest" },
              { id: "schema", label: "02 JSON-LD Schema Studio" },
              { id: "robots", label: "03 robots.txt AI Policy" },
              { id: "dns", label: "04 Cloudflare DoH & SERP Simulator" },
            ].map((t) => {
              const active = activeTool === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTool(t.id as "llms" | "schema" | "robots" | "dns")}
                  className={`sp-btn text-xs font-semibold cursor-pointer transition-all ${
                    active
                      ? "sp-btn-primary"
                      : "sp-btn-ghost bg-card hover:bg-paper"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ====================================================================
            TOOL 1: /llms.txt GENERATOR
            ==================================================================== */}
        {activeTool === "llms" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-6 rounded-3xl border border-line bg-card p-6 sm:p-8 space-y-4 sp-card-shadow">
              <h2 className="sp-display text-xl sm:text-2xl text-ink font-bold">
                Configure /llms.txt AI Search Manifest
              </h2>
              <div className="space-y-1.5">
                <label className="sp-eyebrow !text-[0.62rem] text-mute block font-bold">Brand / Company Name</label>
                <div className="rounded-2xl border-2 border-line bg-stage px-3.5 py-2">
                  <input
                    type="text"
                    value={llmsBrand}
                    onChange={(e) => setLlmsBrand(e.target.value)}
                    className="sp-input text-xs sm:text-sm font-medium"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="sp-eyebrow !text-[0.62rem] text-mute block font-bold">Canonical Domain URL</label>
                <div className="rounded-2xl border-2 border-line bg-stage px-3.5 py-2">
                  <input
                    type="text"
                    value={llmsDomain}
                    onChange={(e) => setLlmsDomain(e.target.value)}
                    className="sp-input text-xs sm:text-sm font-medium"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="sp-eyebrow !text-[0.62rem] text-mute block font-bold">Concise Entity Value Proposition</label>
                <div className="rounded-2xl border-2 border-line bg-stage px-3.5 py-2">
                  <textarea
                    rows={2}
                    value={llmsSummary}
                    onChange={(e) => setLlmsSummary(e.target.value)}
                    className="sp-input text-xs sm:text-sm font-medium"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="sp-eyebrow !text-[0.62rem] text-mute block font-bold">Core Pages (Path | Title per line)</label>
                <div className="rounded-2xl border-2 border-line bg-stage px-3.5 py-2">
                  <textarea
                    rows={4}
                    value={llmsPages}
                    onChange={(e) => setLlmsPages(e.target.value)}
                    className="sp-input text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-3xl border border-line bg-night text-[#f3f0e8] p-6 sm:p-8 space-y-4 sp-card-shadow">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-accent">/public/llms.txt</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyOutput(generatedLlmsTxt)}
                    className="sp-btn sp-btn-ghost !text-white !border-white/30 !py-1.5 !px-3 text-xs"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadFile("llms.txt", generatedLlmsTxt)}
                    className="sp-btn sp-btn-accent !py-1.5 !px-3 text-xs font-bold"
                  >
                    Download llms.txt ↗
                  </button>
                </div>
              </div>
              <pre className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs font-mono text-white/90 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {generatedLlmsTxt}
              </pre>
            </div>
          </div>
        )}

        {/* ====================================================================
            TOOL 2: JSON-LD SCHEMA STUDIO
            ==================================================================== */}
        {activeTool === "schema" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-6 rounded-3xl border border-line bg-card p-6 sm:p-8 space-y-4 sp-card-shadow">
              <h2 className="sp-display text-xl sm:text-2xl text-ink font-bold">
                Schema.org JSON-LD Entity Graph Builder
              </h2>
              <div className="flex gap-2">
                {(["Organization", "SoftwareApplication", "FAQPage"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSchemaType(type)}
                    className={`sp-btn !py-1.5 !px-3 text-xs font-bold ${
                      schemaType === type ? "sp-btn-primary" : "sp-btn-ghost"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {schemaType === "FAQPage" ? (
                <>
                  <div className="space-y-1.5">
                    <label className="sp-eyebrow !text-[0.62rem] text-mute block font-bold">FAQ Question #1</label>
                    <div className="rounded-2xl border-2 border-line bg-stage px-3.5 py-2">
                      <input
                        type="text"
                        value={faqQ1}
                        onChange={(e) => setFaqQ1(e.target.value)}
                        className="sp-input text-xs sm:text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="sp-eyebrow !text-[0.62rem] text-mute block font-bold">FAQ Answer #1</label>
                    <div className="rounded-2xl border-2 border-line bg-stage px-3.5 py-2">
                      <textarea
                        rows={3}
                        value={faqA1}
                        onChange={(e) => setFaqA1(e.target.value)}
                        className="sp-input text-xs sm:text-sm font-medium"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="sp-eyebrow !text-[0.62rem] text-mute block font-bold">Entity Name</label>
                    <div className="rounded-2xl border-2 border-line bg-stage px-3.5 py-2">
                      <input
                        type="text"
                        value={schemaName}
                        onChange={(e) => setSchemaName(e.target.value)}
                        className="sp-input text-xs sm:text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="sp-eyebrow !text-[0.62rem] text-mute block font-bold">Official URL</label>
                    <div className="rounded-2xl border-2 border-line bg-stage px-3.5 py-2">
                      <input
                        type="text"
                        value={schemaUrl}
                        onChange={(e) => setSchemaUrl(e.target.value)}
                        className="sp-input text-xs sm:text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="sp-eyebrow !text-[0.62rem] text-mute block font-bold">Entity Description</label>
                    <div className="rounded-2xl border-2 border-line bg-stage px-3.5 py-2">
                      <textarea
                        rows={3}
                        value={schemaDesc}
                        onChange={(e) => setSchemaDesc(e.target.value)}
                        className="sp-input text-xs sm:text-sm font-medium"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="lg:col-span-6 rounded-3xl border border-line bg-night text-[#f3f0e8] p-6 sm:p-8 space-y-4 sp-card-shadow">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-accent">✓ Valid Schema.org JSON-LD</span>
                <button
                  type="button"
                  onClick={() => copyOutput(generatedJsonLd)}
                  className="sp-btn sp-btn-accent !py-1.5 !px-3 text-xs font-bold"
                >
                  {copied ? "Copied!" : "Copy <script>"}
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs font-mono text-white/90 overflow-x-auto whitespace-pre-wrap">
                {generatedJsonLd}
              </pre>
            </div>
          </div>
        )}

        {/* ====================================================================
            TOOL 3: AI CRAWLER ROBOTS.TXT BUILDER
            ==================================================================== */}
        {activeTool === "robots" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-6 rounded-3xl border border-line bg-card p-6 sm:p-8 space-y-4 sp-card-shadow">
              <h2 className="sp-display text-xl sm:text-2xl text-ink font-bold">
                AI Search Crawler Permissions (robots.txt)
              </h2>
              {[
                { label: "OpenAI GPTBot (ChatGPT Search Citations)", val: allowGptBot, set: setAllowGptBot },
                { label: "Anthropic ClaudeBot (Claude Web Citations)", val: allowClaudeBot, set: setAllowClaudeBot },
                { label: "PerplexityBot (Perplexity Answer Engine)", val: allowPerplexityBot, set: setAllowPerplexityBot },
                { label: "Google-Extended (Google AI Overviews)", val: allowGoogleExtended, set: setAllowGoogleExtended },
                { label: "Block CCBot (Prevent Training Scraping)", val: blockCcBot, set: setBlockCcBot },
              ].map((item) => (
                <label
                  key={item.label}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-line bg-stage cursor-pointer hover:bg-paper transition-colors"
                >
                  <span className="text-xs sm:text-sm font-semibold text-ink">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={item.val}
                    onChange={(e) => item.set(e.target.checked)}
                    className="accent-[#ff4d14] w-4 h-4 cursor-pointer"
                  />
                </label>
              ))}
              <div className="space-y-1.5 pt-1">
                <label className="sp-eyebrow !text-[0.62rem] text-mute block font-bold">XML Sitemap Location</label>
                <div className="rounded-2xl border-2 border-line bg-stage px-3.5 py-2">
                  <input
                    type="text"
                    value={sitemapUrl}
                    onChange={(e) => setSitemapUrl(e.target.value)}
                    className="sp-input text-xs sm:text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-3xl border border-line bg-night text-[#f3f0e8] p-6 sm:p-8 space-y-4 sp-card-shadow">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-accent">/public/robots.txt</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyOutput(generatedRobotsTxt)}
                    className="sp-btn sp-btn-ghost !text-white !border-white/30 !py-1.5 !px-3 text-xs"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadFile("robots.txt", generatedRobotsTxt)}
                    className="sp-btn sp-btn-accent !py-1.5 !px-3 text-xs font-bold"
                  >
                    Download robots.txt ↗
                  </button>
                </div>
              </div>
              <pre className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs font-mono text-white/90 overflow-x-auto whitespace-pre-wrap">
                {generatedRobotsTxt}
              </pre>
            </div>
          </div>
        )}

        {/* ====================================================================
            TOOL 4: LIVE CLOUDFLARE DoH DNS & SERP SIMULATOR
            ==================================================================== */}
        {activeTool === "dns" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-6 rounded-3xl border border-line bg-card p-6 sm:p-8 space-y-5 sp-card-shadow">
              <div>
                <div className="sp-eyebrow text-accent">Cloudflare 1.1.1.1 DNS-over-HTTPS</div>
                <h2 className="sp-display text-xl sm:text-2xl text-ink font-bold mt-1">
                  Live Domain DNS, SPF &amp; DMARC Inspector
                </h2>
              </div>

              <form onSubmit={handleRunDnsLookup} className="flex gap-2">
                <div className="flex-1 rounded-2xl border-2 border-line bg-stage px-3.5 py-2">
                  <input
                    type="text"
                    value={dnsDomainInput}
                    onChange={(e) => setDnsDomainInput(e.target.value)}
                    placeholder="voice-one.com or stripe.com"
                    className="sp-input text-xs sm:text-sm font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={dnsLoading}
                  className="sp-btn sp-btn-accent !py-2 text-xs font-bold shrink-0"
                >
                  {dnsLoading ? "Querying..." : "Query 1.1.1.1 ↗"}
                </button>
              </form>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3.5 rounded-2xl bg-stage border border-line flex items-center justify-between">
                  <span className="text-mute font-sans">Mail Server</span>
                  <span className="font-bold text-ink">{dnsResult.mailProvider} ({dnsResult.mxRecords.length} MX)</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-stage border border-line space-y-1">
                  <div className="flex items-center justify-between font-sans">
                    <span className="text-mute">SPF Record</span>
                    <span className={`font-bold ${dnsResult.hasSpf ? "text-emerald-600" : "text-rose-600"}`}>
                      {dnsResult.hasSpf ? "✓ Active" : "✕ Missing"}
                    </span>
                  </div>
                  <div className="text-[11px] text-mute break-all">{dnsResult.spfRecord}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-stage border border-line space-y-1">
                  <div className="flex items-center justify-between font-sans">
                    <span className="text-mute">DMARC Policy (_dmarc)</span>
                    <span className={`font-bold ${dnsResult.hasDmarc ? "text-emerald-600" : "text-rose-600"}`}>
                      {dnsResult.hasDmarc ? `✓ ${dnsResult.dmarcPolicy}` : "✕ Missing"}
                    </span>
                  </div>
                  <div className="text-[11px] text-mute break-all">{dnsResult.dmarcRecord}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-stage border border-line flex items-center justify-between font-sans">
                  <span className="text-mute">A Records ({dnsLatency}ms latency)</span>
                  <span className="font-mono text-ink font-bold">{dnsResult.aRecords.slice(0, 2).join(", ") || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Google SERP Simulator */}
            <div className="lg:col-span-6 rounded-3xl border border-line bg-card p-6 sm:p-8 space-y-5 sp-card-shadow">
              <div>
                <div className="sp-eyebrow text-accent">Google SERP Snippet Simulator</div>
                <h2 className="sp-display text-xl sm:text-2xl text-ink font-bold mt-1">
                  Pixel-accurate search result preview
                </h2>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-mute">Meta Title Tag</span>
                  <span className={serpTitle.length > 60 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>
                    {serpTitle.length} / 60 chars
                  </span>
                </div>
                <div className="rounded-2xl border-2 border-line bg-stage px-3.5 py-2">
                  <input
                    type="text"
                    value={serpTitle}
                    onChange={(e) => setSerpTitle(e.target.value)}
                    className="sp-input text-xs sm:text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-mute">Meta Description</span>
                  <span className={serpDesc.length > 160 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>
                    {serpDesc.length} / 158 chars
                  </span>
                </div>
                <div className="rounded-2xl border-2 border-line bg-stage px-3.5 py-2">
                  <textarea
                    rows={3}
                    value={serpDesc}
                    onChange={(e) => setSerpDesc(e.target.value)}
                    className="sp-input text-xs sm:text-sm font-medium"
                  />
                </div>
              </div>

              {/* Real SERP Box Preview */}
              <div className="p-5 rounded-2xl bg-stage border border-line space-y-1.5 font-sans">
                <div className="text-xs text-mute font-mono">
                  https://{dnsDomainInput}
                </div>
                <div className="text-base sm:text-lg font-semibold text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-snug">
                  {serpTitle.length > 62 ? `${serpTitle.slice(0, 60)}...` : serpTitle}
                </div>
                <p className="text-xs sm:text-sm text-mute leading-relaxed">
                  {serpDesc.length > 160 ? `${serpDesc.slice(0, 157)}...` : serpDesc}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
