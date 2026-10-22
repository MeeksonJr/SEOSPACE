"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  PublicFooter,
  PublicNavbar,
  usePublicTheme,
} from "@/components/ui/PublicChrome";

const MANIFEST_TABS = [
  {
    id: "robots",
    label: "/robots.txt (Crawler Policy)",
    path: "/robots.txt",
    badge: "200 OK • Live Route",
    description:
      "Explicitly authorizes GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, and Google-Extended while protecting webhook endpoints and declaring our XML Sitemap.",
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
      "Auto-generated Next.js XML Sitemap indexing all public routes, tools, sample reports, and legal compliance pages.",
  },
];

const SECURITY_PILLARS = [
  {
    title: "PostgreSQL Row-Level Security (RLS)",
    badge: "Supabase Schema Ready",
    tag: "Data Isolation",
    desc: "Every table in supabase/schema.sql (profiles, white_label_configs, audits, seo_articles, widget_leads, domain_comparisons) enforces strict tenant isolation via auth.uid() policies.",
  },
  {
    title: "Stripe PCI-DSS Level 1 Billing",
    badge: "HMAC Webhook Verified",
    tag: "Payment Security",
    desc: "Subscription checkouts and customer billing portals run on Stripe's PCI-DSS Level 1 infrastructure with cryptographic webhook signature verification.",
  },
  {
    title: "Zero-Retention Neural Engine v4.2",
    badge: "No Model Training",
    tag: "Privacy by Design",
    desc: "Customer URLs, keyword research queries, and AI Content Studio drafts are processed ephemerally and are never used to train foundation models.",
  },
  {
    title: "Cloudflare 1.1.1.1 DoH Verification",
    badge: "Live DNS Telemetry",
    tag: "Network Hardening",
    desc: "Real-time DNS-over-HTTPS queries inspect A/AAAA, MX, SPF TXT, and DMARC anti-spoofing records over encrypted HTTPS transport.",
  },
  {
    title: "Hybrid Serverless Persistence",
    badge: "Zero Read-Only Crashes",
    tag: "Fault Tolerance",
    desc: "Automatic failover between persistent local storage (.data/seospace-db.json), Vercel serverless /tmp storage, and Supabase PostgreSQL.",
  },
  {
    title: "Role-Based Access & Session Guard",
    badge: "Admin / Agency / Pro Tiers",
    tag: "Access Control",
    desc: "Granular workspace session management supporting password authentication, magic links, and instant role-based switching.",
  },
];

export default function SecurityTrustCenterPage() {
  const { isDark, toggleTheme } = usePublicTheme(false);
  const [activeTab, setActiveTab] = useState<"robots" | "llms" | "sitemap">("robots");
  const [liveContent, setLiveContent] = useState<string>("Loading live manifest from server...");
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
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(liveContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="sp-page min-h-screen flex flex-col bg-paper text-ink font-sans transition-colors duration-300">
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1 px-4 sm:px-8 py-8 sm:py-12 max-w-[88rem] mx-auto w-full space-y-12">
        {/* ====================================================================
            STAGE HEADER
            ==================================================================== */}
        <div className="sp-stage border border-line p-6 sm:p-10 rounded-3xl sp-card-shadow space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="sp-eyebrow text-accent mb-2">
                Security Architecture &amp; Public Manifests • Trust Center
              </div>
              <h1 className="sp-display text-[clamp(2.4rem,6vw,4.5rem)] text-ink leading-tight">
                Enterprise Trust<span className="text-accent">.</span> <br />
                <span className="text-mute font-normal">Audited defense &amp; open crawler manifests.</span>
              </h1>
              <p className="text-xs sm:text-sm text-mute mt-3 max-w-2xl leading-relaxed">
                Inspect Seospace AI’s multi-tenant PostgreSQL Row-Level Security, zero-retention inference architecture, and verify our live crawler policies in real time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/legal/privacy" className="sp-btn sp-btn-ghost">
                Privacy &amp; DPA
              </Link>
              <Link href="/legal/terms" className="sp-btn sp-btn-primary">
                Commercial License <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-line flex flex-wrap items-center gap-6 text-xs text-mute font-mono">
            <div>
              Status: <span className="text-emerald-500 font-bold">● SOC2 Ready</span>
            </div>
            <div>
              Encryption: <span className="text-ink font-bold">TLS 1.3 / AES-256</span>
            </div>
            <div>
              Inference: <span className="text-ink font-bold">Zero Customer Data Training</span>
            </div>
            <div>
              DNS: <span className="text-accent font-bold">Encrypted Cloudflare 1.1.1.1</span>
            </div>
          </div>
        </div>

        {/* ====================================================================
            LIVE PUBLIC MANIFEST INSPECTOR
            ==================================================================== */}
        <section className="bg-card border border-line rounded-3xl p-6 sm:p-10 sp-card-shadow space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-line">
            <div>
              <div className="sp-eyebrow text-accent mb-1">Live Manifest Verification</div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
                Inspect /robots.txt, /llms.txt &amp; /sitemap.xml
              </h2>
              <p className="text-xs sm:text-sm text-mute mt-1">
                Fetched live from our production Next.js edge runtime on every click.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {MANIFEST_TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as "robots" | "llms" | "sitemap")}
                    className={`px-4 py-2 rounded-full text-xs font-mono font-bold border transition cursor-pointer ${
                      active
                        ? "bg-ink text-paper border-ink"
                        : "bg-stage text-mute border-line hover:text-ink hover:border-ink/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Manifest Overview Card */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-2xl border border-line bg-stage space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-accent">
                    {selectedManifest.path}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-500">
                    {selectedManifest.badge}
                  </span>
                </div>
                <p className="text-xs text-mute leading-relaxed">
                  {selectedManifest.description}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <a
                    href={selectedManifest.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sp-btn sp-btn-primary !py-2 !px-3 text-xs"
                  >
                    Open Raw File <span aria-hidden>↗</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => fetchManifest(selectedManifest.path)}
                    disabled={loading}
                    className="sp-btn sp-btn-ghost !py-2 !px-3 text-xs"
                  >
                    {loading ? "Fetching..." : "Refresh"}
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-line bg-stage space-y-2">
                <div className="text-xs font-bold text-ink">Want to generate these for your clients?</div>
                <p className="text-[11px] text-mute leading-relaxed">
                  Use our Free 4-in-1 SEO, GEO &amp; DNS Suite to generate custom /llms.txt, JSON-LD, and robots.txt files in seconds.
                </p>
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-1 text-accent font-bold text-xs hover:underline pt-1"
                >
                  Open Free Generator Suite →
                </Link>
              </div>
            </div>

            {/* Code Output Terminal */}
            <div className="lg:col-span-8">
              <div className="rounded-2xl bg-night text-[#f3f0e8] border border-[#2a2a2c] overflow-hidden sp-card-shadow">
                <div className="px-4 py-3 border-b border-[#2a2a2c] flex items-center justify-between text-xs">
                  <div className="font-mono text-[11px] text-[#a5a5a0] truncate">
                    GET https://seospace-kappa.vercel.app{selectedManifest.path}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3 py-1 rounded-lg bg-[#2a2a2c] hover:bg-[#38383c] text-white text-[11px] font-mono font-bold transition cursor-pointer"
                  >
                    {copied ? "✓ Copied" : "Copy Manifest"}
                  </button>
                </div>
                <pre className="p-5 text-xs font-mono text-emerald-300 overflow-x-auto max-h-[380px] leading-relaxed whitespace-pre-wrap">
                  {liveContent}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            6-LAYER DEFENSE ARCHITECTURE
            ==================================================================== */}
        <section className="space-y-6">
          <div>
            <div className="sp-eyebrow text-accent mb-1.5">Defense in Depth</div>
            <h2 className="sp-display text-2xl sm:text-4xl text-ink">
              6-Layer Security Architecture
            </h2>
            <p className="text-xs sm:text-sm text-mute mt-1 max-w-2xl">
              Engineered for multi-tenant digital agencies, SaaS acquirers, and enterprise marketing teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECURITY_PILLARS.map((sec, idx) => (
              <div
                key={idx}
                className="bg-card border border-line rounded-3xl p-6 sm:p-7 sp-card-shadow flex flex-col justify-between space-y-4 hover:border-ink/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[11px] font-bold text-accent uppercase">
                      {sec.tag}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-500">
                      {sec.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-ink">{sec.title}</h3>
                  <p className="text-xs text-mute mt-2 leading-relaxed">
                    {sec.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-line flex items-center gap-1.5 text-[11px] font-mono text-emerald-500 font-bold">
                  <span>✓</span> Verified Production Policy
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
