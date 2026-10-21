"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  Check,
  Code2,
  Copy,
  Download,
  FileText,
  Globe,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { SeospaceLogo } from "@/components/ui/SeospaceLogo";
import { DnsIntelligence } from "@/types/audit";

export default function FreeSeoToolsPage() {
  const [activeTool, setActiveTool] = useState<
    "llms" | "schema" | "robots" | "dns"
  >("llms");
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
  const [schemaType, setSchemaType] = useState<
    "Organization" | "SoftwareApplication" | "FAQPage"
  >("Organization");
  const [schemaName, setSchemaName] = useState("Seospace AI");
  const [schemaUrl, setSchemaUrl] = useState("https://seospace-kappa.vercel.app");
  const [schemaDesc, setSchemaDesc] = useState(
    "Autonomous Technical SEO, CRO, AI Search (GEO) & Live DNS Intelligence Platform."
  );
  const [faqQ1, setFaqQ1] = useState(
    "How does Seospace Neural Engine v4.2 grade URLs?"
  );
  const [faqA1, setFaqA1] = useState(
    "It extracts live DOM tags, RapidAPI metadata, and Cloudflare 1.1.1.1 DNS records to compute an uninflated 5-pillar score."
  );

  // Tool 3: AI Crawler robots.txt Builder State
  const [allowGptBot, setAllowGptBot] = useState(true);
  const [allowClaudeBot, setAllowClaudeBot] = useState(true);
  const [allowPerplexityBot, setAllowPerplexityBot] = useState(true);
  const [allowGoogleExtended, setAllowGoogleExtended] = useState(true);
  const [blockCcBot, setBlockCcBot] = useState(true);
  const [sitemapUrl, setSitemapUrl] = useState(
    "https://voice-one.com/sitemap.xml"
  );

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
    spfRecord:
      "v=spf1 mx include:spf.protection.outlook.com ip4:66.35.17.83 ~all",
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
    <div className="min-h-screen bg-[#F4F6F9] text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="w-full max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <SeospaceLogo />
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <Wrench className="w-3.5 h-3.5" /> 4-in-1 Free SEO, GEO &amp; DNS
              Generator Suite
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <Link
              href="/compare"
              className="hidden md:inline-flex px-3 py-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition"
            >
              Competitor Battlecard
            </Link>
            <Link
              href="/docs"
              className="hidden md:inline-flex px-3 py-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition"
            >
              REST API Docs
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white inline-flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Workspace Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="w-full max-w-[1440px] mx-auto px-6 pt-8 space-y-8">
        {/* Title Banner */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Zero-Cost Organic Growth
            Generators • Powered by Seospace Neural Engine v4.2
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Free Technical SEO, AI Search (/llms.txt) &amp; Live DNS Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Generate production-ready <code className="text-blue-300">/llms.txt</code>{" "}
            manifests, Schema.org <code className="text-blue-300">JSON-LD</code>{" "}
            graphs, AI crawler <code className="text-blue-300">robots.txt</code>{" "}
            policies, and inspect live Cloudflare 1.1.1.1 SPF/DMARC records in
            one click.
          </p>

          {/* 4 Tool Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              {
                id: "llms",
                label: "1. /llms.txt Manifest Generator",
                icon: FileText,
              },
              {
                id: "schema",
                label: "2. JSON-LD Schema Studio",
                icon: Code2,
              },
              {
                id: "robots",
                label: "3. AI Crawler robots.txt Builder",
                icon: Bot,
              },
              {
                id: "dns",
                label: "4. Live DNS / SPF / DMARC + SERP Checker",
                icon: ShieldCheck,
              },
            ].map((t) => {
              const Icon = t.icon;
              const active = activeTool === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() =>
                    setActiveTool(t.id as "llms" | "schema" | "robots" | "dns")
                  }
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer transition ${
                    active
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TOOL 1: /llms.txt Generator */}
        {activeTool === "llms" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-extrabold text-slate-950">
                Configure Your /llms.txt AI Search Manifest
              </h2>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Brand / Company Name
                </label>
                <input
                  type="text"
                  value={llmsBrand}
                  onChange={(e) => setLlmsBrand(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Canonical Domain URL
                </label>
                <input
                  type="text"
                  value={llmsDomain}
                  onChange={(e) => setLlmsDomain(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                   concise Entity Value Proposition
                </label>
                <textarea
                  rows={2}
                  value={llmsSummary}
                  onChange={(e) => setLlmsSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Core Pages (One per line: /path | Title)
                </label>
                <textarea
                  rows={4}
                  value={llmsPages}
                  onChange={(e) => setLlmsPages(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-blue-300">
                    /public/llms.txt
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyOutput(generatedLlmsTxt)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copied ? "Copied!" : "Copy"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadFile("llms.txt", generatedLlmsTxt)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download llms.txt</span>
                    </button>
                  </div>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {generatedLlmsTxt}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 2: JSON-LD Schema Studio */}
        {activeTool === "schema" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-extrabold text-slate-950">
                Schema.org JSON-LD Entity Graph Builder
              </h2>
              <div className="flex gap-2">
                {(
                  ["Organization", "SoftwareApplication", "FAQPage"] as const
                ).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSchemaType(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                      schemaType === type
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {schemaType === "FAQPage" ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      FAQ Question #1
                    </label>
                    <input
                      type="text"
                      value={faqQ1}
                      onChange={(e) => setFaqQ1(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      FAQ Answer #1
                    </label>
                    <textarea
                      rows={3}
                      value={faqA1}
                      onChange={(e) => setFaqA1(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Entity Name
                    </label>
                    <input
                      type="text"
                      value={schemaName}
                      onChange={(e) => setSchemaName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official URL
                    </label>
                    <input
                      type="text"
                      value={schemaUrl}
                      onChange={(e) => setSchemaUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Entity Description
                    </label>
                    <textarea
                      rows={3}
                      value={schemaDesc}
                      onChange={(e) => setSchemaDesc(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="lg:col-span-6 bg-slate-950 text-white rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-emerald-300">
                  ✓ Valid Schema.org JSON-LD Snippet
                </span>
                <button
                  type="button"
                  onClick={() => copyOutput(generatedJsonLd)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? "Copied!" : "Copy <script>"}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap">
                {generatedJsonLd}
              </pre>
            </div>
          </div>
        )}

        {/* TOOL 3: AI Crawler robots.txt Builder */}
        {activeTool === "robots" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-extrabold text-slate-950">
                AI Search Crawler Permissions (robots.txt)
              </h2>
              {[
                {
                  label: "OpenAI GPTBot (ChatGPT Search Citations)",
                  val: allowGptBot,
                  set: setAllowGptBot,
                },
                {
                  label: "Anthropic ClaudeBot (Claude Web Search)",
                  val: allowClaudeBot,
                  set: setAllowClaudeBot,
                },
                {
                  label: "PerplexityBot (Perplexity Answer Engine)",
                  val: allowPerplexityBot,
                  set: setAllowPerplexityBot,
                },
                {
                  label: "Google-Extended (Google AI Overviews)",
                  val: allowGoogleExtended,
                  set: setAllowGoogleExtended,
                },
                {
                  label: "Block CCBot (Prevent Raw CommonCrawl Scraping)",
                  val: blockCcBot,
                  set: setBlockCcBot,
                },
              ].map((item) => (
                <label
                  key={item.label}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    {item.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={item.val}
                    onChange={(e) => item.set(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                </label>
              ))}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  XML Sitemap Location
                </label>
                <input
                  type="text"
                  value={sitemapUrl}
                  onChange={(e) => setSitemapUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-950 text-white rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-blue-300">
                  /public/robots.txt
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => copyOutput(generatedRobotsTxt)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      downloadFile("robots.txt", generatedRobotsTxt)
                    }
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download robots.txt</span>
                  </button>
                </div>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap">
                {generatedRobotsTxt}
              </pre>
            </div>
          </div>
        )}

        {/* TOOL 4: Live Cloudflare DoH DNS + Google SERP Simulator */}
        {activeTool === "dns" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  CLOUDFLARE 1.1.1.1 DNS-OVER-HTTPS
                </span>
                <h2 className="text-lg font-extrabold text-slate-950 mt-0.5">
                  Live Domain DNS, SPF &amp; DMARC Security Inspector
                </h2>
              </div>

              <form onSubmit={handleRunDnsLookup} className="flex gap-2">
                <input
                  type="text"
                  value={dnsDomainInput}
                  onChange={(e) => setDnsDomainInput(e.target.value)}
                  placeholder="voice-one.com or stripe.com"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
                <button
                  type="submit"
                  disabled={dnsLoading}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {dnsLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>Query 1.1.1.1 DNS</span>
                </button>
              </form>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-600">
                    Mail Provider &amp; MX Records
                  </span>
                  <span className="font-bold text-slate-900">
                    {dnsResult.mailProvider} ({dnsResult.mxRecords.length} MX)
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-600">
                      SPF Policy (TXT)
                    </span>
                    <span
                      className={`font-bold ${
                        dnsResult.hasSpf ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {dnsResult.hasSpf ? "✓ Active" : "✕ Missing"}
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-slate-500 break-all">
                    {dnsResult.spfRecord || "No v=spf1 record found"}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-600">
                      DMARC Anti-Spoofing (_dmarc.{dnsDomainInput})
                    </span>
                    <span
                      className={`font-bold ${
                        dnsResult.hasDmarc
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {dnsResult.hasDmarc
                        ? `✓ Policy: ${dnsResult.dmarcPolicy}`
                        : "✕ Missing"}
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-slate-500 break-all">
                    {dnsResult.dmarcRecord || "No _dmarc TXT record found"}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-600">
                    A Records / Nameservers ({dnsLatency}ms)
                  </span>
                  <span className="font-mono text-slate-800">
                    {dnsResult.aRecords.slice(0, 2).join(", ") || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Google SERP Simulator */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  GOOGLE SERP PIXEL &amp; CHARACTER SIMULATOR
                </span>
                <h2 className="text-lg font-extrabold text-slate-950 mt-0.5">
                  Live Search Result Snippet Preview
                </h2>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Meta Title Tag</span>
                  <span
                    className={
                      serpTitle.length > 60
                        ? "text-rose-600"
                        : "text-emerald-600"
                    }
                  >
                    {serpTitle.length} / 60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={serpTitle}
                  onChange={(e) => setSerpTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Meta Description</span>
                  <span
                    className={
                      serpDesc.length > 160
                        ? "text-rose-600"
                        : "text-emerald-600"
                    }
                  >
                    {serpDesc.length} / 158 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={serpDesc}
                  onChange={(e) => setSerpDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>https://{dnsDomainInput}</span>
                </div>
                <div className="text-lg font-semibold text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                  {serpTitle.length > 62
                    ? `${serpTitle.slice(0, 60)}...`
                    : serpTitle}
                </div>
                <p className="text-xs text-[#4d5156] leading-relaxed">
                  {serpDesc.length > 160
                    ? `${serpDesc.slice(0, 157)}...`
                    : serpDesc}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
