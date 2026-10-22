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
  { id: "whitelabel", title: "2. Commercial White-Label Agency License" },
  { id: "ai-ownership", title: "3. Ownership of AI SEO Articles & Reports" },
  { id: "acceptable-use", title: "4. Ethical URL Scanning & Acceptable Use" },
  { id: "billing", title: "5. Subscriptions, Stripe Billing & 30-Day Guarantee" },
  { id: "api-sla", title: "6. REST API Quotas & 99.98% Uptime SLA" },
  { id: "liability", title: "7. Disclaimers & Limitation of Liability" },
  { id: "governing-law", title: "8. Governing Law & Dispute Resolution" },
];

export default function TermsOfServicePage() {
  const { isDark, toggleTheme } = usePublicTheme(false);
  const [activeSection, setActiveSection] = useState("acceptance");

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
                Master SaaS Agreement &amp; Commercial White-Label Rights
              </div>
              <h1 className="sp-display text-[clamp(2.4rem,6vw,4.5rem)] text-ink leading-tight">
                Terms of Service<span className="text-accent">.</span> <br />
                <span className="text-mute font-normal">Agency licensing &amp; 99.98% SLA.</span>
              </h1>
              <p className="text-xs sm:text-sm text-mute mt-3 max-w-2xl leading-relaxed">
                Last Updated: October 21, 2026 • Governing Starter, Professional Growth ($19/mo), and Agency White-Label ($49/mo) plans on Seospace AI.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 no-print">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") window.print();
                }}
                className="sp-btn sp-btn-ghost text-xs"
              >
                Print / Save PDF Copy
              </button>
              <Link href="/legal/privacy" className="sp-btn sp-btn-primary text-xs">
                Privacy Policy &amp; DPA <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          {/* 4 Commercial Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-line">
            {[
              {
                title: "Client Resale Rights",
                desc: "Agency & Pro subscribers may rebrand PDF audits and sell diagnostics to unlimited commercial clients.",
              },
              {
                title: "100% Article Copyright",
                desc: "You own full intellectual property and publishing rights to all AI SEO articles generated in your workspace.",
              },
              {
                title: "30-Day Guarantee",
                desc: "Cancel anytime in 1 click. First-time subscribers receive an unconditional 30-day money-back guarantee.",
              },
              {
                title: "99.98% Uptime SLA",
                desc: "Backed by globally distributed edge runtimes, saved-first caching, and live DNS failover.",
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
              <div className="sp-eyebrow text-accent">Clauses &amp; Schedules</div>
              <nav className="space-y-1">
                {TERMS_SECTIONS.map((sec) => (
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
                <div className="font-bold text-ink">Related Hubs:</div>
                <div className="flex flex-col gap-1.5 text-accent font-medium">
                  <Link href="/legal/privacy" className="hover:underline">
                    → Privacy Policy &amp; GDPR DPA
                  </Link>
                  <Link href="/security" className="hover:underline">
                    → Security, SOC2 &amp; Trust Center
                  </Link>
                  <Link href="/dashboard?tab=billing" className="hover:underline">
                    → Manage Subscription &amp; Billing
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Detailed Clauses */}
          <div className="lg:col-span-8 space-y-8">
            {/* Section 1 */}
            <section id="acceptance" className="p-6 sm:p-8 rounded-3xl border border-line bg-card sp-card-shadow space-y-4">
              <h2 className="text-xl font-extrabold text-ink tracking-tight">1. Acceptance of Terms &amp; Scope</h2>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                By creating a workspace, running a live or cached URL diagnostic, generating AI SEO content, or embedding the Seospace Lead-Capture Widget, you (&ldquo;Customer&rdquo;, &ldquo;Agency&rdquo;, or &ldquo;User&rdquo;) agree to be bound by these Terms of Service (&ldquo;Agreement&rdquo;) with Seospace AI Inc. If you are entering into this Agreement on behalf of a digital agency or corporate entity, you represent that you have authority to bind that entity.
              </p>
            </section>

            {/* Section 2 */}
            <section id="whitelabel" className="p-6 sm:p-8 rounded-3xl border border-line bg-card sp-card-shadow space-y-4">
              <h2 className="text-xl font-extrabold text-ink tracking-tight">2. Commercial White-Label Agency License</h2>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                Subscribers on active <strong>Professional Growth</strong> and <strong>Agency White-Label</strong> plans are granted a worldwide, royalty-free commercial license to:
              </p>
              <ul className="space-y-3 text-xs text-mute">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>
                    <strong className="text-ink">Rebrand PDF Audits:</strong> Replace Seospace AI branding on exported PDF audit reports and shareable links with your agency name, logo, hex palette, and booking link.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>
                    <strong className="text-ink">Commercial Resale:</strong> Sell, distribute, or include branded SEO, CRO, GEO, WCAG 2.2, and DNS diagnostic reports as part of paid client retainers and sales pitches.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>
                    <strong className="text-ink">Embed Lead Widget:</strong> Embed the White-Label Audit Widget (<code className="font-mono text-accent">/widget</code>) via <code className="font-mono text-accent">&lt;iframe&gt;</code> on unlimited agency properties to capture commercial prospect leads.
                  </span>
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="ai-ownership" className="p-6 sm:p-8 rounded-3xl border border-line bg-card sp-card-shadow space-y-4">
              <h2 className="text-xl font-extrabold text-ink tracking-tight">3. Ownership of AI SEO Articles &amp; Reports</h2>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                As between Seospace AI and Customer, Customer owns all right, title, and interest in and to all long-form articles, HTML/Markdown exports, meta tag rewrites, JSON-LD schema snippets, and <code className="font-mono text-accent">/llms.txt</code> files generated for Customer by the <strong>Seospace Neural Engine v4.2</strong>. Customer may publish, syndicate, modify, or transfer such generated works to end clients without attribution to Seospace AI.
              </p>
            </section>

            {/* Section 4 */}
            <section id="acceptable-use" className="p-6 sm:p-8 rounded-3xl border border-line bg-card sp-card-shadow space-y-4">
              <h2 className="text-xl font-extrabold text-ink tracking-tight">4. Ethical URL Scanning &amp; Acceptable Use</h2>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                Seospace AI is designed for ethical technical SEO, competitive benchmarking, and compliance auditing. You agree not to use the platform or REST API (<code className="font-mono text-accent">/api/audit</code>, <code className="font-mono text-accent">/api/dns-check</code>) to conduct denial-of-service (DoS) attacks, probe non-public intranet endpoints (SSRF), or harvest personally identifiable information from third-party websites.
              </p>
            </section>

            {/* Section 5 */}
            <section id="billing" className="p-6 sm:p-8 rounded-3xl border border-line bg-card sp-card-shadow space-y-4">
              <h2 className="text-xl font-extrabold text-ink tracking-tight">5. Subscriptions, Stripe Billing &amp; 30-Day Guarantee</h2>
              <div className="overflow-x-auto rounded-2xl border border-line">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stage text-ink border-b border-line font-mono uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-4 font-bold">Plan Tier</th>
                      <th className="py-3 px-4 font-bold">Monthly / Annual</th>
                      <th className="py-3 px-4 font-bold">Audit &amp; AI Quota</th>
                      <th className="py-3 px-4 font-bold">White-Label Rights</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    <tr className="hover:bg-stage/50 transition">
                      <td className="py-3 px-4 font-bold text-ink">Starter Sandbox</td>
                      <td className="py-3 px-4 text-mute">$0 / month</td>
                      <td className="py-3 px-4 text-mute">3 Live URL Audits / mo</td>
                      <td className="py-3 px-4 text-mute">Standard Seospace Watermark</td>
                    </tr>
                    <tr className="hover:bg-stage/50 transition">
                      <td className="py-3 px-4 font-bold text-cobalt">Professional Growth</td>
                      <td className="py-3 px-4 text-ink font-bold">$19/mo ($15/mo Annual)</td>
                      <td className="py-3 px-4 text-mute">50 Live Audits + Unlimited Saved Cache</td>
                      <td className="py-3 px-4 text-emerald-500 font-bold">Clean PDF Export Included</td>
                    </tr>
                    <tr className="hover:bg-stage/50 transition">
                      <td className="py-3 px-4 font-bold text-accent">Agency White-Label</td>
                      <td className="py-3 px-4 text-ink font-bold">$49/mo ($39/mo Annual)</td>
                      <td className="py-3 px-4 text-mute">Unlimited Audits, AI Studio &amp; REST API</td>
                      <td className="py-3 px-4 text-emerald-500 font-bold">Full Custom Logo, Colors &amp; Lead Widget</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-mute leading-relaxed">
                All paid plans are backed by our <strong>30-Day Money-Back Guarantee</strong>. If Seospace AI does not measurably accelerate your SEO workflow or agency sales within your first 30 days, contact <a href="mailto:billing@seospace.ai" className="text-accent underline">billing@seospace.ai</a> for a full refund.
              </p>
            </section>

            {/* Section 6 */}
            <section id="api-sla" className="p-6 sm:p-8 rounded-3xl border border-line bg-card sp-card-shadow space-y-4">
              <h2 className="text-xl font-extrabold text-ink tracking-tight">6. REST API Quotas &amp; 99.98% Uptime SLA</h2>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                Seospace AI maintains a 99.98% monthly uptime Service Level Agreement across our web workspace and headless REST API endpoints. Cached database lookups (<code className="font-mono text-accent">forceRefresh: false</code>) do not count against external RapidAPI rate limits and resolve in under 15ms.
              </p>
            </section>

            {/* Section 7 */}
            <section id="liability" className="p-6 sm:p-8 rounded-3xl border border-line bg-card sp-card-shadow space-y-4">
              <h2 className="text-xl font-extrabold text-ink tracking-tight">7. Disclaimers &amp; Limitation of Liability</h2>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                Search engine rankings and AI answer engine citations depend on third-party algorithms operated by Google, OpenAI, Perplexity, and Anthropic. While Seospace AI provides deterministic mathematical grading and best-practice optimizations, we do not guarantee specific SERP positions. In no event shall Seospace AI&apos;s aggregate liability exceed the total subscription fees paid by Customer in the twelve (12) months preceding a claim.
              </p>
            </section>

            {/* Section 8 */}
            <section id="governing-law" className="p-6 sm:p-8 rounded-3xl border border-line bg-card sp-card-shadow space-y-4">
              <h2 className="text-xl font-extrabold text-ink tracking-tight">8. Governing Law &amp; Dispute Resolution</h2>
              <p className="text-xs sm:text-sm text-mute leading-relaxed">
                This Agreement is governed by the laws of the State of Delaware and the federal laws of the United States, without regard to conflict of law principles. Questions regarding commercial licensing may be directed to <a href="mailto:legal@seospace.ai" className="text-accent font-semibold hover:underline">legal@seospace.ai</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
