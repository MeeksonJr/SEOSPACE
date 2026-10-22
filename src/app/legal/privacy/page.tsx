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
  { id: "shield-privacy", title: "2. Negative Review Shield Confidentiality" },
  { id: "collection", title: "3. Information & Review Data Collected" },
  { id: "ai-policy", title: "4. Gemini AI Zero-Retention Policy" },
  { id: "subprocessors", title: "5. Authorized Subprocessors & Infrastructure" },
  { id: "retention", title: "6. Data Retention & Deletion Protocols" },
  { id: "gdpr-ccpa", title: "7. GDPR, UK-GDPR & CCPA Subject Rights" },
  { id: "cookies", title: "8. Cookies, LocalStorage & Embed Scripts" },
  { id: "contact", title: "9. Data Protection Officer (DPO) & Contact" },
];

const SUBPROCESSORS = [
  {
    name: "Supabase (PostgreSQL + RLS)",
    purpose: "Encrypted relational storage for customer reviews, private grievances & agency workspaces",
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
    purpose: "Edge serverless application hosting, TLS termination & global CDN widget delivery",
    location: "Global Edge Network (US Primary)",
    compliance: "SOC2 Type II & ISO 27001",
  },
  {
    name: "Google Cloud / Gemini API",
    purpose: "Zero-retention sentiment analysis and response generation for customer reviews",
    location: "United States",
    compliance: "Enterprise AI Security & TLS 1.3",
  },
];

export default function PrivacyPolicyPage() {
  const { isDark, toggleTheme } = usePublicTheme(false);
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="sp-page min-h-screen flex flex-col bg-[var(--sp-paper)] text-[var(--sp-ink)]">
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
              GDPR &amp; CCPA Compliant
            </div>
            <h1 className="sp-display text-3xl sm:text-5xl font-bold tracking-tight">
              Privacy Policy &amp; Data Protection
            </h1>
            <p className="text-sm text-[var(--sp-mute)] mt-2">
              Last updated: October 2026 • Effective for all TrustPulse AI accounts, widgets, and review funnels
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar TOC */}
            <aside className="lg:col-span-4 bg-[var(--sp-card)] p-4 rounded-2xl border border-[var(--sp-line)] sticky top-20 text-xs space-y-1">
              <div className="font-mono uppercase text-[var(--sp-mute)] text-[10px] tracking-wider mb-2 px-2">
                Table of Contents
              </div>
              {PRIVACY_SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={() => setActiveSection(sec.id)}
                  className={`block px-3 py-2 rounded-xl transition-colors ${
                    activeSection === sec.id
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-bold"
                      : "text-[var(--sp-mute)] hover:text-[var(--sp-ink)] hover:bg-[var(--sp-stage)]"
                  }`}
                >
                  {sec.title}
                </a>
              ))}
            </aside>

            {/* Main Content */}
            <article className="lg:col-span-8 bg-[var(--sp-card)] p-6 sm:p-10 rounded-3xl border border-[var(--sp-line)] space-y-8 text-xs sm:text-sm leading-relaxed text-[var(--sp-ink)]">
              <section id="overview" className="space-y-3">
                <h2 className="text-lg font-bold">1. Executive Privacy Summary</h2>
                <p className="text-[var(--sp-mute)]">
                  TrustPulse AI operates an autonomous social proof, multi-source review aggregator, and negative review shield platform. We prioritize end-user privacy, merchant confidentiality, and full transparency. We do not sell personal data, nor do we train public AI models on private customer complaints.
                </p>
              </section>

              <section id="shield-privacy" className="space-y-3 pt-6 border-t border-[var(--sp-line)]">
                <h2 className="text-lg font-bold">2. Negative Review Shield Confidentiality</h2>
                <p className="text-[var(--sp-mute)]">
                  When a consumer submits a 1 to 3 star grievance through our smart review funnel (`/r/[slug]`), this information is classified as <strong>Confidential Private Feedback</strong>. It is never broadcast publicly, never indexed in search engines, and delivered exclusively to authorized business administrators for customer resolution.
                </p>
              </section>

              <section id="collection" className="space-y-3 pt-6 border-t border-[var(--sp-line)]">
                <h2 className="text-lg font-bold">3. Information &amp; Review Data Collected</h2>
                <p className="text-[var(--sp-mute)]">
                  We collect account registration credentials (name, email), public Google Places / Trustpilot review attribution data (reviewer name, star rating, published text), and consumer resolution details (customer email, phone number provided voluntarily for de-escalation).
                </p>
              </section>

              <section id="ai-policy" className="space-y-3 pt-6 border-t border-[var(--sp-line)]">
                <h2 className="text-lg font-bold">4. Gemini AI Zero-Retention Policy</h2>
                <p className="text-[var(--sp-mute)]">
                  Our AI auto-responder utilizes Google Gemini 2.5 Flash API endpoints. Review text submitted for reply synthesis is processed ephemerally and is not retained or utilized to train general foundation models, conforming to enterprise data boundary agreements.
                </p>
              </section>

              <section id="subprocessors" className="space-y-4 pt-6 border-t border-[var(--sp-line)]">
                <h2 className="text-lg font-bold">5. Authorized Subprocessors</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--sp-line)] text-[var(--sp-mute)]">
                        <th className="py-2 pr-4">Subprocessor</th>
                        <th className="py-2 pr-4">Function</th>
                        <th className="py-2">Compliance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--sp-line)]">
                      {SUBPROCESSORS.map((sub) => (
                        <tr key={sub.name}>
                          <td className="py-2.5 pr-4 font-semibold">{sub.name}</td>
                          <td className="py-2.5 pr-4 text-[var(--sp-mute)]">{sub.purpose}</td>
                          <td className="py-2.5 text-emerald-600 font-mono text-[11px]">{sub.compliance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="contact" className="space-y-3 pt-6 border-t border-[var(--sp-line)]">
                <h2 className="text-lg font-bold">9. Data Protection Officer (DPO) &amp; Inquiries</h2>
                <p className="text-[var(--sp-mute)]">
                  For GDPR data subject requests (DSAR), deletion mandates, or agency subprocessor agreements, please contact:
                </p>
                <div className="p-4 rounded-xl bg-[var(--sp-stage)] font-mono text-xs text-[var(--sp-ink)]">
                  privacy@trustpulse-ai.vercel.app • Attention: Data Protection Officer
                </div>
              </section>
            </article>
          </div>
        </div>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
