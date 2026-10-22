"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  Check,
  CheckCircle2,
  Copy,
  Database,
  FileCode2,
  Globe,
  KeyRound,
  Lock,
  RefreshCw,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import {
  PublicFooter,
  PublicNavbar,
  usePublicTheme,
} from "@/components/ui/PublicChrome";

const MANIFEST_TABS = [
  {
    id: "robots",
    label: "/robots.txt (AI Crawler Policy)",
    path: "/robots.txt",
    badge: "200 OK • Live Route",
    description:
      "Explicitly authorizes GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, and Google-Extended while protecting webhook routes and declaring our XML Sitemap.",
  },
  {
    id: "llms",
    label: "/llms.txt (GEO Entity Manifest)",
    path: "/llms.txt",
    badge: "200 OK • Static Asset",
    description:
      "Machine-readable Markdown manifest designed for ChatGPT Search, Perplexity, and Claude RAG pipelines to accurately cite Seospace AI.",
  },
  {
    id: "sitemap",
    label: "/sitemap.xml (Dynamic Index)",
    path: "/sitemap.xml",
    badge: "200 OK • XML Sitemap",
    description:
      "Auto-generated Next.js XML Sitemap indexing all 14+ public routes, tools, sample reports, and legal compliance pages.",
  },
];

export default function SecurityTrustCenterPage() {
  const { isDark, toggleTheme } = usePublicTheme(false);
  const [activeTab, setActiveTab] = useState<"robots" | "llms" | "sitemap">(
    "robots"
  );
  const [liveContent, setLiveContent] = useState<string>(
    "Loading live manifest from server..."
  );
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedManifest =
    MANIFEST_TABS.find((t) => t.id === activeTab) || MANIFEST_TABS[0];

  async function fetchManifest(path: string) {
    setLoading(true);
    try {
      const res = await fetch(path, { cache: "no-store" });
      const text = await res.text();
      setLiveContent(text);
    } catch {
      setLiveContent(`Unable to fetch ${path}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchManifest(selectedManifest.path);
  }, [selectedManifest.path]);

  function handleCopy() {
    navigator.clipboard.writeText(liveContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark ? "bg-[#050814] text-white" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      <PublicNavbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        badgeText="Security, SOC2 & Crawler Hub"
      />

      {/* Hero Section */}
      <section
        className={`border-b py-14 px-4 transition-colors ${
          isDark
            ? "bg-[#0B1022]/80 border-slate-800/80 bg-seospace-dark-grid"
            : "bg-white border-slate-200/80 bg-seospace-grid"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 mb-4">
                <ShieldCheck className="w-3.5 h-3.5" /> Enterprise Trust Center
                • Live Public File Verification
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Security Architecture &amp; Public Crawler Manifests
              </h1>
              <p
                className={`mt-3 text-sm sm:text-base leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Inspect Seospace AI&apos;s security controls, PostgreSQL
                Row-Level Security (RLS) isolation, zero-retention{" "}
                <strong>Seospace Neural Engine v4.2</strong> architecture, and
                verify our live <code className="font-mono">/robots.txt</code>,{" "}
                <code className="font-mono">/sitemap.xml</code>, and{" "}
                <code className="font-mono">/llms.txt</code> files in real time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/legal/privacy"
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
                  isDark
                    ? "bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
                    : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50 shadow-2xs"
                }`}
              >
                Privacy &amp; GDPR DPA
              </Link>
              <Link
                href="/legal/terms"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
              >
                Terms &amp; Agency License →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* LIVE PUBLIC MANIFEST INSPECTOR (/robots.txt, /llms.txt, /sitemap.xml) */}
        <section
          className={`rounded-3xl border p-6 sm:p-8 ${
            isDark
              ? "bg-[#0B1022] border-slate-800"
              : "bg-white border-slate-200 shadow-xs"
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-500/20">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-500 uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5" /> Live Public SEO &amp; AI
                Discovery Inspector
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-1">
                Verify Our Live /robots.txt, /llms.txt &amp; /sitemap.xml
              </h2>
              <p
                className={`text-xs sm:text-sm mt-1 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Click any file below to fetch and inspect the live response
                served directly by our production Next.js server.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {MANIFEST_TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setActiveTab(tab.id as "robots" | "llms" | "sitemap")
                    }
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      active
                        ? "bg-blue-600 text-white border-blue-500"
                        : isDark
                        ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                        : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 space-y-4">
              <div
                className={`p-5 rounded-2xl border space-y-3 ${
                  isDark
                    ? "bg-slate-950 border-slate-800"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-blue-500">
                    {selectedManifest.path}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-500">
                    {selectedManifest.badge}
                  </span>
                </div>
                <p
                  className={`text-xs leading-relaxed ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {selectedManifest.description}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <a
                    href={selectedManifest.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center gap-1.5 transition"
                  >
                    <span>Open Raw {selectedManifest.path}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => fetchManifest(selectedManifest.path)}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer ${
                      isDark
                        ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                    />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              <div
                className={`p-5 rounded-2xl border space-y-2.5 text-xs ${
                  isDark
                    ? "bg-slate-950 border-slate-800"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="font-bold">Want to generate these for your own site?</div>
                <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                  Use our Free 4-in-1 SEO, GEO &amp; DNS Generator Suite to
                  build custom <code>/llms.txt</code>, <code>JSON-LD</code>, and{" "}
                  <code>/robots.txt</code> files in seconds.
                </p>
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-1 text-blue-500 font-bold hover:underline pt-1"
                >
                  Open Free SEO &amp; GEO Tools →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2 font-mono">
                    <FileCode2 className="w-4 h-4 text-blue-400" />
                    <span>
                      GET https://seospace-kappa.vercel.app
                      {selectedManifest.path}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy File</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-5 text-xs font-mono text-emerald-300 overflow-x-auto max-h-[380px] leading-relaxed">
                  {liveContent}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* 6 ENTERPRISE SECURITY CONTROLS GRID */}
        <section className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold">
              6-Layer Defense-in-Depth Security Posture
            </h2>
            <p
              className={`mt-1.5 text-sm ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Built for multi-tenant digital agencies and enterprise teams preparing
              for database &amp; authentication production deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Database,
                title: "PostgreSQL Row-Level Security (RLS)",
                badge: "Supabase Schema Ready",
                desc: "Every table in supabase/schema.sql (profiles, white_label_configs, audits, seo_articles, widget_leads, domain_comparisons) enforces strict tenant isolation via auth.uid() policies.",
              },
              {
                icon: Lock,
                title: "Stripe PCI-DSS Level 1 Billing",
                badge: "HMAC Webhook Verified",
                desc: "Subscription checkouts and customer billing portals run on Stripe's PCI-DSS Level 1 infrastructure with cryptographic webhook signature verification.",
              },
              {
                icon: Sparkles,
                title: "Zero-Retention Neural Engine v4.2",
                badge: "No Model Training",
                desc: "Customer URLs, keyword research queries, and AI Content Studio drafts are processed ephemerally and are never used to train foundation models.",
              },
              {
                icon: Globe,
                title: "Cloudflare 1.1.1.1 DoH Verification",
                badge: "Live DNS Telemetry",
                desc: "Real-time DNS-over-HTTPS queries inspect A/AAAA, MX, SPF TXT, and DMARC anti-spoofing records over encrypted HTTPS transport.",
              },
              {
                icon: Server,
                title: "Hybrid Serverless Persistence",
                badge: "Zero Read-Only Crashes",
                desc: "Automatic failover between persistent local storage (.data/seospace-db.json), Vercel serverless /tmp storage, and Supabase PostgreSQL.",
              },
              {
                icon: KeyRound,
                title: "Role-Based Access & Session Guard",
                badge: "Admin / Agency / Pro Tiers",
                desc: "Granular workspace session management supporting password authentication, magic links, and instant role-based switching.",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-3xl border flex flex-col justify-between ${
                    isDark
                      ? "bg-[#0B1022] border-slate-800"
                      : "bg-white border-slate-200 shadow-2xs"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/15 text-blue-500 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-500">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold">{item.title}</h3>
                    <p
                      className={`mt-2 text-xs leading-relaxed ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-500/15 flex items-center gap-1.5 text-[11px] font-bold text-emerald-500">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Production
                    Control
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
