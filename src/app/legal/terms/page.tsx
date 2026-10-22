"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PublicFooter,
  PublicNavbar,
  usePublicTheme,
} from "@/components/ui/PublicChrome";

const TERMS_SECTIONS = [
  { id: "acceptance", title: "1. Acceptance of Terms & Scope" },
  { id: "reselling", title: "2. Agency White-Label & Reselling License" },
  { id: "gatekeeper", title: "3. Review Funnels & FTC Compliance" },
  { id: "widgets", title: "4. Embed Script Usage & Cross-Origin SLA" },
  { id: "billing", title: "5. Stripe Subscriptions & Cancellation" },
  { id: "intellectual", title: "6. Intellectual Property & AI Content" },
  { id: "liability", title: "7. Disclaimers & Limitation of Liability" },
  { id: "governing", title: "8. Governing Law & Dispute Resolution" },
];

export default function TermsOfServicePage() {
  const { isDark, toggleTheme } = usePublicTheme(false);
  const [activeSection, setActiveSection] = useState("acceptance");

  return (
    <div className="sp-page min-h-screen flex flex-col bg-[var(--sp-paper)] text-[var(--sp-ink)]">
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
              Commercial Agency Licensing
            </div>
            <h1 className="sp-display text-3xl sm:text-5xl font-bold tracking-tight">
              Terms of Service
            </h1>
            <p className="text-sm text-[var(--sp-mute)] mt-2">
              Last updated: October 2026 • Governing Starter ($19/mo), Pro ($49/mo), and Agency ($129/mo) plans
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar TOC */}
            <aside className="lg:col-span-4 bg-[var(--sp-card)] p-4 rounded-2xl border border-[var(--sp-line)] sticky top-20 text-xs space-y-1">
              <div className="font-mono uppercase text-[var(--sp-mute)] text-[10px] tracking-wider mb-2 px-2">
                Table of Contents
              </div>
              {TERMS_SECTIONS.map((sec) => (
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
              <section id="acceptance" className="space-y-3">
                <h2 className="text-lg font-bold">1. Acceptance of Terms</h2>
                <p className="text-[var(--sp-mute)]">
                  By accessing or subscribing to TrustPulse AI, you agree to be bound by these Terms of Service. If you are an agency using TrustPulse AI on behalf of clients, you represent that you have full authorization to manage their reputation funnels.
                </p>
              </section>

              <section id="reselling" className="space-y-3 pt-6 border-t border-[var(--sp-line)]">
                <h2 className="text-lg font-bold">2. Agency White-Label &amp; Reselling Rights</h2>
                <p className="text-[var(--sp-mute)]">
                  Subscribers to the Agency Plan ($129/mo) are granted a perpetual, royalty-free commercial license to resell TrustPulse reputation management, widgets, and monthly PDF reports to third-party clients under their own agency branding without attribution to TrustPulse AI.
                </p>
              </section>

              <section id="gatekeeper" className="space-y-3 pt-6 border-t border-[var(--sp-line)]">
                <h2 className="text-lg font-bold">3. Review Funnels &amp; FTC Compliance</h2>
                <p className="text-[var(--sp-mute)]">
                  TrustPulse AI provides feedback routing tools designed to ensure customer satisfaction. Merchants agree to treat private feedback in good faith and adhere to all FTC guidelines regarding authentic consumer sentiment and voluntary public endorsements.
                </p>
              </section>

              <section id="widgets" className="space-y-3 pt-6 border-t border-[var(--sp-line)]">
                <h2 className="text-lg font-bold">4. Embed Script Usage &amp; Cross-Origin SLA</h2>
                <p className="text-[var(--sp-mute)]">
                  Our embed script endpoints (`/api/widget/script`) are served via edge CDN infrastructure with a targeted 99.9% uptime SLA. We maintain wildcard CORS headers so that your client websites load widgets without browser security warnings.
                </p>
              </section>

              <section id="billing" className="space-y-3 pt-6 border-t border-[var(--sp-line)]">
                <h2 className="text-lg font-bold">5. Stripe Subscriptions &amp; Cancellation</h2>
                <p className="text-[var(--sp-mute)]">
                  All billing is processed securely via Stripe. Subscriptions renew automatically on a monthly or annual cadence. You may cancel your subscription at any time via the Customer Portal without cancellation penalties.
                </p>
              </section>

              <section id="governing" className="space-y-3 pt-6 border-t border-[var(--sp-line)]">
                <h2 className="text-lg font-bold">8. Governing Law</h2>
                <p className="text-[var(--sp-mute)]">
                  These terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles.
                </p>
              </section>
            </article>
          </div>
        </div>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
