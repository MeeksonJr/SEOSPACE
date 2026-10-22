"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  Scale,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
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
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark ? "bg-[#050814] text-white" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      <PublicNavbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        badgeText="Terms, Agency License & SLA"
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-500 border border-blue-500/30 mb-4">
                <Scale className="w-3.5 h-3.5" /> Master SaaS Agreement &amp;
                Commercial White-Label Rights
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Terms of Service &amp; Agency License
              </h1>
              <p
                className={`mt-3 text-sm sm:text-base leading-relaxed ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Last Updated: October 21, 2026 • Governing all Starter,
                Professional Growth ($19/mo), and Agency White-Label ($49/mo)
                subscriptions on Seospace AI.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 no-print">
              <button
                type="button"
                onClick={() => window.print()}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 border transition cursor-pointer ${
                  isDark
                    ? "bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
                    : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50 shadow-2xs"
                }`}
              >
                <Download className="w-3.5 h-3.5 text-blue-500" />
                <span>Print / Export Terms PDF</span>
              </button>
              <Link
                href="/legal/privacy"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
              >
                View Privacy Policy &amp; DPA →
              </Link>
            </div>
          </div>

          {/* 4-Card Commercial License Highlights */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Award,
                title: "Full Client Resale Rights",
                desc: "Agency & Pro subscribers may rebrand PDF audits and sell SEO/CRO diagnostics to unlimited commercial clients.",
              },
              {
                icon: FileText,
                title: "100% Article Copyright",
                desc: "You own full intellectual property and publishing rights to all AI SEO articles generated in your workspace.",
              },
              {
                icon: CreditCard,
                title: "30-Day Money-Back Guarantee",
                desc: "Cancel any paid subscription in 1 click. First-time subscribers receive a no-questions-asked 30-day refund guarantee.",
              },
              {
                icon: Terminal,
                title: "99.98% Uptime SLA",
                desc: "Backed by globally distributed edge functions, saved-first database caching, and live DNS failover.",
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

      {/* Main Content Grid */}
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
              Clauses &amp; Schedules
            </div>
            <nav className="space-y-1">
              {TERMS_SECTIONS.map((sec) => (
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
              <div className="font-bold">Quick Legal Links:</div>
              <div className="flex flex-col gap-1.5 text-blue-500 font-semibold">
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

        {/* Right Detailed Sections */}
        <div className="lg:col-span-8 space-y-8">
          <section
            id="acceptance"
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark
                ? "bg-[#0B1022] border-slate-800"
                : "bg-white border-slate-200 shadow-2xs"
            }`}
          >
            <h2 className="text-xl font-bold">
              1. Acceptance of Terms &amp; Scope
            </h2>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              By creating a workspace, running a live or cached URL diagnostic,
              generating AI SEO content, or embedding the Seospace Lead-Capture
              Widget, you (&ldquo;Customer&rdquo;, &ldquo;Agency&rdquo;, or
              &ldquo;User&rdquo;) agree to be bound by these Terms of Service
              (&ldquo;Agreement&rdquo;) with Seospace AI Inc. If you are
              entering into this Agreement on behalf of a digital agency or
              corporate entity, you represent that you have authority to bind
              that entity.
            </p>
          </section>

          <section
            id="whitelabel"
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark
                ? "bg-[#0B1022] border-slate-800"
                : "bg-white border-slate-200 shadow-2xs"
            }`}
          >
            <h2 className="text-xl font-bold">
              2. Commercial White-Label Agency License
            </h2>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Subscribers on active <strong>Professional Growth</strong> and{" "}
              <strong>Agency White-Label</strong> plans are granted a worldwide,
              royalty-free commercial license to:
            </p>
            <ul
              className={`space-y-2.5 text-xs sm:text-sm ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}
            >
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span>
                  Replace Seospace AI branding on exported PDF audit reports and
                  public shareable links with your own agency name, logo, hex
                  color palette, and booking link.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span>
                  Sell, distribute, or include branded SEO, CRO, GEO, WCAG 2.2,
                  and DNS diagnostic reports as part of paid client retainers,
                  sales proposals, or lead magnets.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span>
                  Embed the White-Label Audit Widget (<code>/widget</code>) via{" "}
                  <code>&lt;iframe&gt;</code> on unlimited agency properties to
                  capture commercial prospect leads.
                </span>
              </li>
            </ul>
          </section>

          <section
            id="ai-ownership"
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark
                ? "bg-[#0B1022] border-slate-800"
                : "bg-white border-slate-200 shadow-2xs"
            }`}
          >
            <h2 className="text-xl font-bold">
              3. Ownership of AI SEO Articles &amp; Reports
            </h2>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              As between Seospace AI and Customer, Customer owns all right,
              title, and interest in and to all long-form articles, HTML/Markdown
              exports, meta tag rewrites, JSON-LD schema snippets, and{" "}
              <code>/llms.txt</code> files generated for Customer by the{" "}
              <strong>Seospace Neural Engine v4.2</strong>. Customer may publish,
              syndicate, modify, or transfer such generated works to end clients
              without attribution to Seospace AI.
            </p>
          </section>

          <section
            id="acceptable-use"
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark
                ? "bg-[#0B1022] border-slate-800"
                : "bg-white border-slate-200 shadow-2xs"
            }`}
          >
            <h2 className="text-xl font-bold">
              4. Ethical URL Scanning &amp; Acceptable Use
            </h2>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Seospace AI is designed for ethical technical SEO, competitive
              benchmarking, and compliance auditing. You agree not to use the
              platform or REST API (<code>/api/audit</code>,{" "}
              <code>/api/dns-check</code>) to conduct denial-of-service (DoS)
              attacks, probe non-public intranet endpoints (SSRF), or harvest
              personally identifiable information from third-party websites.
            </p>
          </section>

          <section
            id="billing"
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark
                ? "bg-[#0B1022] border-slate-800"
                : "bg-white border-slate-200 shadow-2xs"
            }`}
          >
            <h2 className="text-xl font-bold">
              5. Subscriptions, Stripe Billing &amp; 30-Day Guarantee
            </h2>
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
                    <th className="py-3 px-4 font-bold">Plan Tier</th>
                    <th className="py-3 px-4 font-bold">Monthly / Annual</th>
                    <th className="py-3 px-4 font-bold">Audit &amp; AI Quota</th>
                    <th className="py-3 px-4 font-bold">White-Label Rights</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-500/15">
                  <tr>
                    <td className="py-3 px-4 font-bold">Starter Sandbox</td>
                    <td className="py-3 px-4">$0 / month</td>
                    <td className="py-3 px-4">3 Live URL Audits / mo</td>
                    <td className="py-3 px-4 text-slate-400">
                      Standard Seospace Watermark
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-blue-500">
                      Professional Growth
                    </td>
                    <td className="py-3 px-4">$19/mo ($15/mo Annual)</td>
                    <td className="py-3 px-4">
                      50 Live Audits + Unlimited Saved Cache
                    </td>
                    <td className="py-3 px-4 text-emerald-500 font-bold">
                      Clean PDF Export Included
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-purple-500">
                      Agency White-Label
                    </td>
                    <td className="py-3 px-4">$49/mo ($39/mo Annual)</td>
                    <td className="py-3 px-4">
                      Unlimited Audits, AI Studio &amp; REST API
                    </td>
                    <td className="py-3 px-4 text-emerald-500 font-bold">
                      Full Custom Logo, Colors &amp; Lead Widget
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p
              className={`text-xs leading-relaxed ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              All paid plans are backed by our{" "}
              <strong>30-Day Money-Back Guarantee</strong>. If Seospace AI does
              not measurably accelerate your SEO workflow or agency sales
              pipeline within your first 30 days, contact{" "}
              <a
                href="mailto:billing@seospace.ai"
                className="text-blue-500 underline"
              >
                billing@seospace.ai
              </a>{" "}
              for a full refund.
            </p>
          </section>

          <section
            id="api-sla"
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark
                ? "bg-[#0B1022] border-slate-800"
                : "bg-white border-slate-200 shadow-2xs"
            }`}
          >
            <h2 className="text-xl font-bold">
              6. REST API Quotas &amp; 99.98% Uptime SLA
            </h2>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Seospace AI maintains a 99.98% monthly uptime Service Level
              Agreement across our web workspace and headless REST API
              endpoints. Cached database lookups (<code>forceRefresh: false</code>)
              do not count against external RapidAPI rate limits and resolve in
              under 15ms.
            </p>
          </section>

          <section
            id="liability"
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark
                ? "bg-[#0B1022] border-slate-800"
                : "bg-white border-slate-200 shadow-2xs"
            }`}
          >
            <h2 className="text-xl font-bold">
              7. Disclaimers &amp; Limitation of Liability
            </h2>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Search engine rankings and AI answer engine citations depend on
              third-party algorithms operated by Google, OpenAI, Perplexity, and
              Anthropic. While Seospace AI provides deterministic mathematical
              grading and best-practice optimizations, we do not guarantee
              specific SERP positions. In no event shall Seospace AI&apos;s
              aggregate liability exceed the total subscription fees paid by
              Customer in the twelve (12) months preceding a claim.
            </p>
          </section>

          <section
            id="governing-law"
            className={`p-6 sm:p-8 rounded-3xl border space-y-4 ${
              isDark
                ? "bg-[#0B1022] border-slate-800"
                : "bg-white border-slate-200 shadow-2xs"
            }`}
          >
            <h2 className="text-xl font-bold">
              8. Governing Law &amp; Dispute Resolution
            </h2>
            <p
              className={`text-sm leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              This Agreement is governed by the laws of the State of Delaware
              and the federal laws of the United States, without regard to
              conflict of law principles. Questions regarding commercial
              licensing may be directed to{" "}
              <a
                href="mailto:legal@seospace.ai"
                className="text-blue-500 font-semibold hover:underline"
              >
                legal@seospace.ai
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
