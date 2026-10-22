"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Database,
  Download,
  FileCheck2,
  Globe,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  PublicFooter,
  PublicNavbar,
  usePublicTheme,
} from "@/components/ui/PublicChrome";

const PRIVACY_SECTIONS = [
  { id: "overview", title: "1. Executive Privacy Summary" },
  { id: "collection", title: "2. Information & Telemetry We Collect" },
  { id: "scanner", title: "3. URL Scanner, RapidAPI & Cloudflare DNS Data" },
  { id: "ai-policy", title: "4. Seospace Neural Engine v4.2 Zero-Training Policy" },
  { id: "subprocessors", title: "5. Authorized Subprocessors & Infrastructure" },
  { id: "retention", title: "6. Saved-First Database Retention & Deletion" },
  { id: "gdpr-ccpa", title: "7. GDPR, UK-GDPR & CCPA Data Subject Rights" },
  { id: "cookies", title: "8. Cookies, LocalStorage & Session Tokens" },
  { id: "contact", title: "9. Data Protection Officer (DPO) & Contact" },
];

const SUBPROCESSORS = [
  {
    name: "Supabase (PostgreSQL + RLS)",
    purpose: "Encrypted relational storage for saved URL audits, AI articles & multi-tenant workspaces",
    location: "United States (AWS us-east-1)",
    compliance: "SOC2 Type II, HIPAA & GDPR DPA",
  },
  {
    name: "Stripe, Inc.",
    purpose: "Subscription billing, checkout sessions, customer portal & invoice processing",
    location: "United States / Global Edge",
    compliance: "PCI-DSS Level 1 Certified",
  },
  {
    name: "Vercel Inc.",
    purpose: "Edge serverless application hosting, TLS termination & global CDN delivery",
    location: "Global Edge Network (US Primary)",
    compliance: "SOC2 Type II & ISO 27001",
  },
  {
    name: "RapidAPI (url-to-metadata)",
    purpose: "On-demand extraction of public webpage OpenGraph, title & meta tags during URL scans",
    location: "United States",
    compliance: "TLS 1.3 Encrypted Transit",
  },
  {
    name: "Cloudflare 1.1.1.1 DoH",
    purpose: "Public DNS-over-HTTPS resolution for A, AAAA, MX, SPF & DMARC verification",
    location: "Global Anycast Network",
    compliance: "SOC2 Type II & ISO 27001",
  },
  {
    name: "Seospace Neural Engine v4.2",
    purpose: "Zero-retention inference for SEO copywriting diffs, keyword clustering & article generation",
    location: "United States",
    compliance: "Zero Model Training on Customer Data",
  },
];

export default function PrivacyPolicyPage() {
  const { isDark, toggleTheme } = usePublicTheme(false);
  const [activeSection, setActiveSection] = useState("overview");

  function handleDownloadDpa() {
    window.print();
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
        badgeText="Privacy & GDPR / CCPA DPA"
      />

      {/* Hero Header */}
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
                <ShieldCheck className="w-3.5 h-3.5" /> GDPR, UK-GDPR, CCPA &amp;
                SOC2-Aligned Data Governance
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Privacy Policy &amp; Data Processing Agreement
              </h1>
              <p
                className={`mt-3 text-sm sm:text-base leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Effective Date: October 21, 2026 • Version 4.2 • Applies to all
                Seospace AI workspaces, public SEO &amp; DNS tools, API
                endpoints, and embeddable agency widgets.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 no-print">
              <button
                type="button"
                onClick={handleDownloadDpa}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 border transition cursor-pointer ${
                  isDark
                    ? "bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
                    : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50 shadow-2xs"
                }`}
              >
                <Download className="w-3.5 h-3.5 text-blue-500" />
                <span>Print / Save Signed PDF Copy</span>
              </button>
              <Link
                href="/legal/terms"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
              >
                View Terms of Service →
              </Link>
            </div>
          </div>

          {/* 4-Pillar Privacy Highlights */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Lock,
                title: "Zero Model Training",
                desc: "Seospace Neural Engine v4.2 never trains foundation models on your private drafts, client URLs, or captured CRM leads.",
              },
              {
                icon: Database,
                title: "Tenant RLS Isolation",
                desc: "Every agency workspace, White-Label config, and lead list is isolated via PostgreSQL Row-Level Security policies.",
              },
              {
                icon: Globe,
                title: "Public DOM Telemetry Only",
                desc: "Our URL scanner only inspects publicly reachable HTTP headers, HTML metadata, and public DNS records.",
              },
              {
                icon: FileCheck2,
                title: "1-Click Data Export & Erasure",
                desc: "Export your saved audits, articles, and leads as JSON/CSV or request complete workspace deletion anytime.",
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className={`p-5 rounded-2xl border ${
                    isDark
                      ? "bg-[#050814]/90 border-slate-800"
                      : "bg-slate-50/90 border-slate-200/80"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600/15 text-blue-500 flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-bold">{card.title}</h2>
                  <p
                    className={`text-xs mt-1 leading-relaxed ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content with Sticky Sidebar TOC */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sticky Table of Contents */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4 no-print">
          <div
            className={`p-5 rounded-3xl border ${
              isDark
                ? "bg-[#0B1022] border-slate-800"
                : "bg-white border-slate-200 shadow-2xs"
            }`}
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-500 mb-3">
              Document Navigation
            </div>
            <nav className="space-y-1">
              {PRIVACY_SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={() => setActiveSection(sec.id)}
                  className={`block px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    activeSection === sec.id
                      ? "bg-blue-600 text-white"
                      : isDark
                      ? "text-slate-300 hover:bg-slate-900 hover:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  {sec.title}
                </a>
              ))}
            </nav>

            <div
              className={`mt-5 pt-4 border-t text-xs space-y-2 ${
                isDark ? "border-slate-800" : "border-slate-100"
              }`}
            >
              <div className="font-bold">Related Compliance Hubs:</div>
              <div className="flex flex-col gap-1.5 text-blue-500 font-semibold">
                <Link href="/legal/terms" className="hover:underline">
                  → Terms of Service &amp; Agency License
                </Link>
                <Link href="/security" className="hover:underline">
                  → Security, SOC2 &amp; Crawler Center
                </Link>
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  → Public AI Citation Manifest (/llms.txt)
                </a>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Detailed Clauses */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1 */}
          <section
            id="overview"
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark
                ? "bg-[#0B1022] border-slate-800"
                : "bg-white border-slate-200 shadow-2xs"
            }`}
          >
            <h2 className="text-xl font-bold">1. Executive Privacy Summary</h2>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Seospace AI Inc. (&ldquo;Seospace AI&rdquo;, &ldquo;we&rdquo;,
              &ldquo;our&rdquo;, or &ldquo;us&rdquo;) provides an autonomous
              Technical SEO, Conversion Rate Optimization (CRO), Generative
              Engine Optimization (GEO), WCAG 2.2 accessibility, and live DNS
              security auditing platform for digital agencies, SaaS founders,
              and marketing teams. This Privacy Policy &amp; Data Processing
              Agreement (DPA) explains how we collect, process, store, and
              protect information across{" "}
              <code className="font-mono text-blue-500">
                https://seospace-kappa.vercel.app
              </code>{" "}
              and all associated APIs.
            </p>
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                isDark
                  ? "bg-slate-950 border-slate-800 text-slate-300"
                  : "bg-blue-50/60 border-blue-200/70 text-slate-700"
              }`}
            >
              <strong className="text-blue-500">Core Commitment:</strong> We
              never sell, rent, or broker your personal data, audited client
              domain lists, White-Label PDF reports, or leads captured through
              your embeddable agency widget to any third-party data broker or
              advertiser.
            </div>
          </section>

          {/* Section 2 */}
          <section
            id="collection"
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark
                ? "bg-[#0B1022] border-slate-800"
                : "bg-white border-slate-200 shadow-2xs"
            }`}
          >
            <h2 className="text-xl font-bold">
              2. Information &amp; Telemetry We Collect
            </h2>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              We collect only the minimum data necessary to operate your
              workspace, persist your saved URL audits and AI articles, and
              process subscriptions:
            </p>
            <ul
              className={`space-y-3 text-xs sm:text-sm ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span>
                  <strong>Workspace Account Credentials:</strong> Full name,
                  work email address, agency/company name, role tier, and
                  salted/hashed authentication credentials when you sign up or
                  sign in.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span>
                  <strong>Agency White-Label Configuration:</strong> Custom
                  agency display name, logo URL, primary brand hex color, and
                  booking/Calendly CTA URL configured for branded PDF exports.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span>
                  <strong>Widget Lead-Capture Submissions:</strong> When a
                  visitor submits your embeddable{" "}
                  <code className="font-mono text-blue-500">/widget</code> form,
                  we store their submitted name, work email, target URL, and
                  calculated audit score directly inside your private Lead CRM
                  table.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span>
                  <strong>Stripe Billing Metadata:</strong> Subscription tier
                  (Starter, Professional Growth, Agency White-Label), Stripe
                  Customer ID, and billing status. Full payment card numbers are
                  processed exclusively by Stripe and never touch Seospace
                  servers.
                </span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section
            id="scanner"
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark
                ? "bg-[#0B1022] border-slate-800"
                : "bg-white border-slate-200 shadow-2xs"
            }`}
          >
            <h2 className="text-xl font-bold">
              3. URL Scanner, RapidAPI &amp; Cloudflare DNS Data
            </h2>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              When you initiate a website audit on{" "}
              <code className="font-mono text-blue-500">/</code>,{" "}
              <code className="font-mono text-blue-500">/dashboard</code>,{" "}
              <code className="font-mono text-blue-500">/compare</code>, or via{" "}
              <code className="font-mono text-blue-500">POST /api/audit</code>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div
                className={`p-4 rounded-2xl border ${
                  isDark
                    ? "bg-slate-950 border-slate-800"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="font-bold text-blue-500 mb-1">
                  RapidAPI &amp; Direct HTML Inspection
                </div>
                <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                  Our scanner fetches publicly accessible HTML headers,{" "}
                  <code>&lt;title&gt;</code>, <code>&lt;meta&gt;</code>,{" "}
                  OpenGraph tags, heading tags (H1–H3), and public crawler
                  files (<code>/robots.txt</code>, <code>/sitemap.xml</code>,{" "}
                  <code>/llms.txt</code>). We do not bypass authentication walls
                  or scrape private user areas.
                </p>
              </div>
              <div
                className={`p-4 rounded-2xl border ${
                  isDark
                    ? "bg-slate-950 border-slate-800"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="font-bold text-emerald-500 mb-1">
                  Cloudflare 1.1.1.1 DNS-over-HTTPS
                </div>
                <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                  We query{" "}
                  <code>https://cloudflare-dns.com/dns-query</code> to inspect
                  publicly published A, AAAA, MX, SPF TXT, DMARC TXT, and NS
                  records to grade email deliverability and domain security.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section
            id="ai-policy"
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark
                ? "bg-[#0B1022] border-slate-800"
                : "bg-white border-slate-200 shadow-2xs"
            }`}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-500">
              <Sparkles className="w-3.5 h-3.5" /> Enterprise AI Privacy
              Guarantee
            </div>
            <h2 className="text-xl font-bold">
              4. Seospace Neural Engine v4.2 Zero-Training Policy
            </h2>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              All automated SEO copywriting recommendations, before/after tag
              rewrites, keyword intent discovery, and long-form articles are
              generated by the <strong>Seospace Neural Engine v4.2</strong>.
              Prompts and workspace content are processed via stateless API
              calls with zero data retention by model providers and are{" "}
              <strong>never used to train or fine-tune foundation models</strong>
              . You retain 100% commercial ownership and copyright over all
              articles and reports generated in your workspace.
            </p>
          </section>

          {/* Section 5: Subprocessors Table */}
          <section
            id="subprocessors"
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark
                ? "bg-[#0B1022] border-slate-800"
                : "bg-white border-slate-200 shadow-2xs"
            }`}
          >
            <h2 className="text-xl font-bold">
              5. Authorized Subprocessors &amp; Infrastructure
            </h2>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              To deliver sub-15ms cached audit lookups and global edge
              availability, Seospace AI engages the following vetted
              infrastructure subprocessors:
            </p>
            <div className="overflow-x-auto rounded-2xl border border-slate-500/20">
              <table className="w-full text-left text-xs">
                <thead
                  className={
                    isDark
                      ? "bg-slate-950 text-slate-300 border-b border-slate-800"
                      : "bg-slate-100 text-slate-700 border-b border-slate-200"
                  }
                >
                  <tr>
                    <th className="py-3 px-4 font-bold">Subprocessor</th>
                    <th className="py-3 px-4 font-bold">Processing Purpose</th>
                    <th className="py-3 px-4 font-bold">Region</th>
                    <th className="py-3 px-4 font-bold">Security Standard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-500/15">
                  {SUBPROCESSORS.map((sub, i) => (
                    <tr key={i}>
                      <td className="py-3 px-4 font-bold whitespace-nowrap">
                        {sub.name}
                      </td>
                      <td
                        className={`py-3 px-4 ${
                          isDark ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {sub.purpose}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                        {sub.location}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500 font-bold text-[11px]">
                          {sub.compliance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6, 7, 8, 9 */}
          <section
            id="retention"
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark
                ? "bg-[#0B1022] border-slate-800"
                : "bg-white border-slate-200 shadow-2xs"
            }`}
          >
            <h2 className="text-xl font-bold">
              6. Saved-First Database Retention &amp; Deletion
            </h2>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Audited URLs and generated SEO articles are persisted in our
              saved-first database so your team can revisit historical reports,
              track domain score improvements over time, and share public report
              links (<code>/report/[id]</code> and <code>/article/[id]</code>)
              without re-running live crawls. You may overwrite any cached
              snapshot by clicking <strong>Fetch Latest Live Scan</strong> or
              request permanent deletion of any audit report or workspace record
              at any time.
            </p>
          </section>

          <section
            id="gdpr-ccpa"
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark
                ? "bg-[#0B1022] border-slate-800"
                : "bg-white border-slate-200 shadow-2xs"
            }`}
          >
            <h2 className="text-xl font-bold">
              7. GDPR, UK-GDPR &amp; CCPA Data Subject Rights
            </h2>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Regardless of your geographic location, we extend full European
              Union General Data Protection Regulation (GDPR) and California
              Consumer Privacy Act (CCPA/CPRA) rights to all users:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                {
                  right: "Right of Access & Portability (Art. 15 & 20)",
                  desc: "Export all saved audits, AI articles, and CRM leads in machine-readable JSON or CSV format directly from your Dashboard.",
                },
                {
                  right: "Right to Erasure / 'Right to be Forgotten' (Art. 17)",
                  desc: "Request permanent deletion of your user profile, agency branding, and associated audit snapshots within 72 hours.",
                },
                {
                  right: "Right to Rectification (Art. 16)",
                  desc: "Update workspace details, refresh stale domain metadata snapshots, or edit published AI articles at any time.",
                },
                {
                  right: "Right to Opt-Out of Sale (CCPA)",
                  desc: "Seospace AI does not sell personal information or share cross-context behavioral advertising data.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border ${
                    isDark
                      ? "bg-slate-950 border-slate-800"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="font-bold text-blue-500 mb-1">
                    {item.right}
                  </div>
                  <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            id="cookies"
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark
                ? "bg-[#0B1022] border-slate-800"
                : "bg-white border-slate-200 shadow-2xs"
            }`}
          >
            <h2 className="text-xl font-bold">
              8. Cookies, LocalStorage &amp; Session Tokens
            </h2>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Seospace AI uses strictly necessary browser storage keys (such as{" "}
              <code className="font-mono text-blue-500">
                seospace_theme_mode
              </code>{" "}
              for Light/Dark theme persistence,{" "}
              <code className="font-mono text-blue-500">
                seospace_auth_session_v1
              </code>{" "}
              for workspace authentication, and{" "}
              <code className="font-mono text-blue-500">
                seospace_saved_audits_v2
              </code>{" "}
              for instant client-side cache hydration). We do not load
              intrusive third-party ad-tech tracking pixels.
            </p>
          </section>

          <section
            id="contact"
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark
                ? "bg-[#0B1022] border-slate-800"
                : "bg-white border-slate-200 shadow-2xs"
            }`}
          >
            <h2 className="text-xl font-bold">
              9. Data Protection Officer (DPO) &amp; Contact
            </h2>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              For privacy inquiries, custom Enterprise Data Processing
              Agreements (DPAs), SOC2 security questionnaires, or GDPR/CCPA
              erasure requests, contact our Data Protection &amp; Trust team:
            </p>
            <div
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs ${
                isDark
                  ? "bg-slate-950 border-slate-800"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="space-y-1">
                <div className="font-bold text-sm">
                  Seospace AI — Privacy &amp; Trust Office
                </div>
                <div className="text-slate-400">
                  Email:{" "}
                  <a
                    href="mailto:privacy@seospace.ai"
                    className="text-blue-500 font-semibold hover:underline"
                  >
                    privacy@seospace.ai
                  </a>{" "}
                  • SLA Response Time: &lt; 24 Business Hours
                </div>
              </div>
              <a
                href="mailto:privacy@seospace.ai"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold inline-flex items-center gap-1.5 shrink-0 transition"
              >
                <Mail className="w-3.5 h-3.5" /> Contact Privacy Team
              </a>
            </div>
          </section>
        </div>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
