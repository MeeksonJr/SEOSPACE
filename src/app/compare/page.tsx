"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PublicNavbar,
  PublicFooter,
  usePublicTheme,
} from "@/components/ui/PublicChrome";
import {
  Swords,
  Check,
  X,
  ShieldCheck,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function ComparePage() {
  const { isDark, toggleTheme } = usePublicTheme(false);

  const COMPARISON_ROWS = [
    {
      feature: "Monthly Software Overhead",
      trustpulse: "$0.00 / month (100% Free Tier)",
      birdeye: "$399 / location / mo",
      podium: "$449 / location / mo",
      generic: "$29 - $79 / mo",
      winner: true,
    },
    {
      feature: "Negative Review Shield Gatekeeper",
      trustpulse: "✓ Included (Routes 1-3★ to private form)",
      birdeye: "⚠️ Expensive Add-On",
      podium: "✕ Not Available (Public only)",
      generic: "✕ Basic star display only",
      winner: true,
    },
    {
      feature: "Codebase & IP Ownership",
      trustpulse: "✓ 100% Turnkey Transfer (You Own It)",
      birdeye: "✕ Proprietary Lock-In",
      podium: "✕ Proprietary Lock-In",
      generic: "✕ SaaS Lock-In",
      winner: true,
    },
    {
      feature: "1-Line Embed Script (< 15KB)",
      trustpulse: "✓ Vanilla JS (CORS wildcard enabled)",
      birdeye: "Heavy multi-megabyte bundle",
      podium: "Proprietary iframe widget",
      generic: "Third-party script dependency",
      winner: true,
    },
    {
      feature: "Gemini AI Review Auto-Responder",
      trustpulse: "✓ 3 Angles (Local SEO, Empathy, Loyalty)",
      birdeye: "Basic templated AI",
      podium: "Manual template snippets",
      generic: "✕ No AI capabilities",
      winner: true,
    },
    {
      feature: "Agency White-Label Resale License",
      trustpulse: "✓ Unlimited Client Workspaces ($129/mo)",
      birdeye: "✕ $200+ per location minimum",
      podium: "✕ No agency reselling",
      generic: "Limited sub-accounts",
      winner: true,
    },
    {
      feature: "Printable QR Stand Studio (4x6)",
      trustpulse: "✓ Instant SVG & Print Card Generator",
      birdeye: "✓ Included",
      podium: "✓ Included",
      generic: "✕ Static link only",
      winner: true,
    },
  ];

  return (
    <div className="sp-page min-h-screen flex flex-col bg-[var(--sp-paper)] text-[var(--sp-ink)]">
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <Swords className="w-3.5 h-3.5" />
              Competitor Battlecard &amp; Market Intelligence
            </div>
            <h1 className="sp-display text-3xl sm:text-5xl font-bold tracking-tight">
              TrustPulse AI vs. Legacy Reputation SaaS
            </h1>
            <p className="text-base sm:text-lg text-[var(--sp-mute)] max-w-2xl leading-relaxed">
              Why marketing agencies and Flippa investors are migrating away from expensive Birdeye and Podium subscriptions to TrustPulse&apos;s zero-cost, owned-code architecture.
            </p>
          </div>

          {/* Matrix Table */}
          <div className="bg-[var(--sp-card)] rounded-3xl border border-[var(--sp-line)] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--sp-line)] bg-[var(--sp-stage)] text-[var(--sp-mute)]">
                    <th className="py-4 px-6 font-bold">Feature / Metric</th>
                    <th className="py-4 px-6 font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30">
                      TrustPulse AI (Ours)
                    </th>
                    <th className="py-4 px-6 font-semibold">Birdeye</th>
                    <th className="py-4 px-6 font-semibold">Podium</th>
                    <th className="py-4 px-6 font-semibold">Generic Widgets</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--sp-line)]">
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr key={i} className="hover:bg-[var(--sp-stage)]/30 transition-colors">
                      <td className="py-4 px-6 font-semibold text-[var(--sp-ink)]">
                        {row.feature}
                      </td>
                      <td className="py-4 px-6 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20">
                        {row.trustpulse}
                      </td>
                      <td className="py-4 px-6 text-[var(--sp-mute)]">
                        {row.birdeye}
                      </td>
                      <td className="py-4 px-6 text-[var(--sp-mute)]">
                        {row.podium}
                      </td>
                      <td className="py-4 px-6 text-[var(--sp-mute)]">
                        {row.generic}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Advantages Summary */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Zero Infrastructure Debt</h3>
              <p className="text-xs text-[var(--sp-mute)] leading-relaxed">
                Operates permanently on Vercel, Supabase, and Gemini free tiers. You pocket 99%+ of every client subscription.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">The Negative Review Shield</h3>
              <p className="text-xs text-[var(--sp-mute)] leading-relaxed">
                Prevents 1–3 star customer complaints from appearing on Google Maps by giving the owner a private resolution channel.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Agency Retainer Reselling</h3>
              <p className="text-xs text-[var(--sp-mute)] leading-relaxed">
                Manage dozens of client locations, white-label custom colors, and export monthly PDF reports for recurring retainer revenue.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Ready to Experience TrustPulse AI?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                Explore the live demo workspace or test the customer QR funnel right now.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
              >
                Open Demo Workspace →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
