"use client";

import React, { useState } from "react";
import Link from "next/link";
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
    if (typeof window !== "undefined") {
      window.print();
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
                Data Protection Agreement &amp; Privacy Policy • Version 4.2
              </div>
              <h1 className="sp-display text-[clamp(2.4rem,6vw,4.5rem)] text-ink leading-tight">
                Privacy by design<span className="text-accent">.</span> <br />
                <span className="text-mute font-normal">GDPR, UK-GDPR &amp; CCPA compliant.</span>
              </h1>
              <p className="text-xs sm:text-sm text-mute mt-3 max-w-2xl leading-relaxed">
                Effective Date: October 21, 2026 • Applies to all Seospace AI workspaces, public SEO &amp; DNS tools, API endpoints, and embeddable agency widgets.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 no-print">
              <button
                type="button"
                onClick={handleDownloadDpa}
                className="sp-btn sp-btn-ghost text-xs"
              >
                Print / Save PDF Copy
              </button>
              <Link href="/legal/terms" className="sp-btn sp-btn-primary text-xs">
                Terms of Service <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          {/* 4 Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-line">
            {[
              {
                title: "Zero Model Training",
                desc: "Seospace Neural Engine v4.2 never trains foundation models on private drafts, client URLs, or captured leads.",
              },
              {
                title: "Tenant RLS Isolation",
                desc: "Every workspace, white-label config, and lead list is isolated via PostgreSQL Row-Level Security policies.",
              },
              {
                title: "Public DOM Telemetry Only",
                desc: "Our scanner only inspects publicly reachable HTTP headers, HTML metadata, and public DNS records.",
              },
              {
                title: "1-Click Data Erasure",
                desc: "Export your saved audits and leads as JSON/CSV or request complete workspace deletion anytime.",
              },
            ].map((card, i) => (
              <div key={i} className="p-4 rounded-2xl border border-line bg-card space-y-1">
                <div className="font-bold text-xs text-ink">{card.title}</div>
                <p className="text-[11px] text-mute leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ====================================================================
            MAIN CLAUSES WITH STICKY TOC
            ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4 no-print">
            <div className="p-6 rounded-3xl border border-line bg-card sp-card-shadow space-y-4">
              <div className="sp-eyebrow text-accent">Document Sections</div>
              <nav className="space-y-1">
                {PRIVACY_SECTIONS.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSection(sec.id)}
                    className={`block px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                      activeSection === sec.id
                        ? "bg-ink text-paper font-bold"
                        : "text-mute hover:text-ink hover:bg-stage"
                    }`}
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>

              <div className="pt-4 border-t border-line text-xs space-y-2">
                <div className="font-bold text-ink">Related Documents:</div>
                <div className="flex flex-col gap-1.5 text-accent font-medium">
                  <Link href="/legal/terms" className="hover:underline">
                    → Terms of Service &amp; Agency License
                  </Link>
                  <Link href="/security" className="hover:underline">
                    → Security, SOC2 &amp; Crawler Center
                  </Link>
                  <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="hover:underline">
                    → Public AI Manifest (/llms.txt)
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Clauses */}
          <div className="lg:col-span-8 space-y-8">
            {/* Section 1 */}
            <section id="overview" className="p-6 sm:p-8 rounded-3xl border border-line bg-card sp-card-shadow space-y-4">
              <h2 className="text-xl font-extrabold text-ink tracking-tight">1. Executive Privacy Summary</h2>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                Seospace AI Inc. (&ldquo;Seospace AI&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) provides an autonomous Technical SEO, Conversion Rate Optimization (CRO), Generative Engine Optimization (GEO), WCAG 2.2 accessibility, and live DNS security auditing platform for digital agencies, SaaS founders, and marketing teams. This Privacy Policy &amp; Data Processing Agreement (DPA) explains how we collect, process, store, and protect information across <code className="font-mono text-accent">https://seospace-kappa.vercel.app</code> and all associated APIs.
              </p>
              <div className="p-4 rounded-2xl border border-accent/20 bg-accent/5 text-xs text-ink leading-relaxed">
                <strong className="text-accent">Core Commitment:</strong> We never sell, rent, or broker personal data, audited client domain lists, white-label PDF reports, or leads captured through embeddable agency widgets to any third-party data broker or advertiser.
              </div>
            </section>

            {/* Section 2 */}
            <section id="collection" className="p-6 sm:p-8 rounded-3xl border border-line bg-card sp-card-shadow space-y-4">
              <h2 className="text-xl font-extrabold text-ink tracking-tight">2. Information &amp; Telemetry We Collect</h2>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                We collect only the minimum data necessary to operate your workspace, persist saved URL audits and AI articles, and process subscriptions:
              </p>
              <ul className="space-y-3 text-xs text-mute">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>
                    <strong className="text-ink">Workspace Account Credentials:</strong> Full name, work email address, agency name, role tier, and salted/hashed authentication credentials when you sign up or sign in.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>
                    <strong className="text-ink">Agency White-Label Configuration:</strong> Custom agency display name, logo URL, primary brand hex color, and booking CTA URL configured for branded PDF exports.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>
                    <strong className="text-ink">Widget Lead-Capture Submissions:</strong> When a visitor submits your embeddable <code className="font-mono text-accent">/widget</code> form, we store their submitted name, work email, target URL, and calculated audit score inside your private Lead CRM table.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>
                    <strong className="text-ink">Stripe Billing Metadata:</strong> Subscription tier (Starter, Professional Growth, Agency White-Label), Stripe Customer ID, and billing status. Full payment card numbers are processed exclusively by Stripe and never touch Seospace servers.
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="scanner" className="p-6 sm:p-8 rounded-3xl border border-line bg-card sp-card-shadow space-y-4">
              <h2 className="text-xl font-extrabold text-ink tracking-tight">3. URL Scanner, RapidAPI &amp; Cloudflare DNS Data</h2>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                When you initiate a website audit on the homepage, dashboard, or via <code className="font-mono text-accent">POST /api/audit</code>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl border border-line bg-stage space-y-1.5">
                  <div className="font-bold text-ink">RapidAPI &amp; Direct HTML Inspection</div>
                  <p className="text-mute leading-relaxed">
                    Our scanner fetches publicly accessible HTML headers, title, meta, OpenGraph tags, heading tags (H1–H3), and public crawler files (/robots.txt, /sitemap.xml, /llms.txt). We do not scrape behind authentication walls.
                  </p>
                </div>
                <div className="p-4 rounded-2xl border border-line bg-stage space-y-1.5">
                  <div className="font-bold text-ink">Cloudflare 1.1.1.1 DNS-over-HTTPS</div>
                  <p className="text-mute leading-relaxed">
                    We query Cloudflare DNS-over-HTTPS to inspect publicly published A, AAAA, MX, SPF TXT, DMARC TXT, and NS records to evaluate deliverability and domain spoofing protections.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="ai-policy" className="p-6 sm:p-8 rounded-3xl border border-line bg-card sp-card-shadow space-y-4">
              <div className="sp-eyebrow text-accent">Enterprise AI Privacy Guarantee</div>
              <h2 className="text-xl font-extrabold text-ink tracking-tight">4. Seospace Neural Engine v4.2 Zero-Training Policy</h2>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                All automated SEO copywriting recommendations, before/after tag rewrites, keyword intent discovery, and long-form articles are generated by the <strong>Seospace Neural Engine v4.2</strong>. Prompts and workspace content are processed via stateless API calls with zero data retention by model providers and are <strong>never used to train or fine-tune foundation models</strong>. You retain 100% commercial ownership and copyright over all articles and reports generated in your workspace.
              </p>
            </section>

            {/* Section 5 */}
            <section id="subprocessors" className="p-6 sm:p-8 rounded-3xl border border-line bg-card sp-card-shadow space-y-4">
              <h2 className="text-xl font-extrabold text-ink tracking-tight">5. Authorized Subprocessors &amp; Infrastructure</h2>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                To deliver sub-15ms cached audit lookups and global edge availability, Seospace AI engages the following vetted infrastructure subprocessors:
              </p>
              <div className="overflow-x-auto rounded-2xl border border-line">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stage text-ink border-b border-line font-mono uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-4 font-bold">Subprocessor</th>
                      <th className="py-3 px-4 font-bold">Purpose</th>
                      <th className="py-3 px-4 font-bold">Region</th>
                      <th className="py-3 px-4 font-bold">Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {SUBPROCESSORS.map((sub, i) => (
                      <tr key={i} className="hover:bg-stage/50 transition">
                        <td className="py-3 px-4 font-bold text-ink whitespace-nowrap">{sub.name}</td>
                        <td className="py-3 px-4 text-mute">{sub.purpose}</td>
                        <td className="py-3 px-4 text-mute whitespace-nowrap font-mono text-[11px]">{sub.location}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-mono font-bold text-[10px]">
                            {sub.compliance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 6 */}
            <section id="retention" className="p-6 sm:p-8 rounded-3xl border border-line bg-card sp-card-shadow space-y-4">
              <h2 className="text-xl font-extrabold text-ink tracking-tight">6. Saved-First Database Retention &amp; Deletion</h2>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                Audited URLs and generated SEO articles are persisted in our saved-first database so your team can revisit historical reports, track domain score improvements over time, and share public report links without re-running crawls. You may overwrite any cached snapshot with fresh live scans or request permanent deletion of any record at any time.
              </p>
            </section>

            {/* Section 7 */}
            <section id="gdpr-ccpa" className="p-6 sm:p-8 rounded-3xl border border-line bg-card sp-card-shadow space-y-4">
              <h2 className="text-xl font-extrabold text-ink tracking-tight">7. GDPR, UK-GDPR &amp; CCPA Data Subject Rights</h2>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                Regardless of your geographic location, we extend full GDPR and CCPA/CPRA rights to all users:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  {
                    right: "Right of Access & Portability (Art. 15 & 20)",
                    desc: "Export all saved audits, AI articles, and CRM leads in machine-readable JSON or CSV format directly from your Dashboard.",
                  },
                  {
                    right: "Right to Erasure / Forgotten (Art. 17)",
                    desc: "Request permanent deletion of your profile, agency branding, and associated audit snapshots within 72 hours.",
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
                  <div key={idx} className="p-4 rounded-2xl border border-line bg-stage space-y-1">
                    <div className="font-bold text-ink">{item.right}</div>
                    <p className="text-mute leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 8 */}
            <section id="cookies" className="p-6 sm:p-8 rounded-3xl border border-line bg-card sp-card-shadow space-y-4">
              <h2 className="text-xl font-extrabold text-ink tracking-tight">8. Cookies, LocalStorage &amp; Session Tokens</h2>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                Seospace AI uses strictly necessary browser storage keys (<code className="font-mono text-accent">seospace_theme_mode</code> for Light/Dark theme persistence, <code className="font-mono text-accent">seospace_auth_session_v1</code> for workspace authentication, and <code className="font-mono text-accent">seospace_saved_audits_v2</code> for instant client-side cache hydration). We do not load third-party ad tracking pixels.
              </p>
            </section>

            {/* Section 9 */}
            <section id="contact" className="p-6 sm:p-8 rounded-3xl border border-line bg-card sp-card-shadow space-y-4">
              <h2 className="text-xl font-extrabold text-ink tracking-tight">9. Data Protection Officer (DPO) &amp; Contact</h2>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                For privacy inquiries, custom Enterprise Data Processing Agreements (DPAs), SOC2 questionnaires, or GDPR/CCPA erasure requests, contact our Data Protection &amp; Trust office:
              </p>
              <div className="p-4 rounded-2xl border border-line bg-stage flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-bold text-ink">Seospace AI — Privacy &amp; Trust Office</div>
                  <div className="text-mute mt-0.5">
                    Email: <a href="mailto:privacy@seospace.ai" className="text-accent font-semibold hover:underline">privacy@seospace.ai</a> • SLA: &lt; 24 Business Hours
                  </div>
                </div>
                <a
                  href="mailto:privacy@seospace.ai"
                  className="sp-btn sp-btn-primary !py-2.5 !px-4 text-xs shrink-0"
                >
                  Contact Privacy Team
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
