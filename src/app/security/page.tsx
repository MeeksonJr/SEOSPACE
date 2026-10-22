"use client";

import React from "react";
import Link from "next/link";
import {
  PublicFooter,
  PublicNavbar,
  usePublicTheme,
} from "@/components/ui/PublicChrome";
import { ShieldCheck, Lock, Database, Bot, Globe, CheckCircle2 } from "lucide-react";

const SECURITY_PILLARS = [
  {
    title: "PostgreSQL Row-Level Security (RLS)",
    badge: "Multi-Tenant Isolation",
    icon: Database,
    desc: "Every workspace, customer review, and private grievance is strictly isolated by workspace ID and user ownership. No agency or business can access another tenant's reviews.",
  },
  {
    title: "Stripe PCI-DSS Level 1 Billing",
    badge: "Payment Security",
    icon: Lock,
    desc: "Credit card details and subscription checkouts are tokenized through Stripe's certified PCI-DSS Level 1 infrastructure. TrustPulse servers never see or store raw card numbers.",
  },
  {
    title: "Zero-Retention Gemini AI Architecture",
    badge: "Enterprise AI Safety",
    icon: Bot,
    desc: "Review text submitted for AI sentiment analysis and auto-reply synthesis is processed ephemerally and is never retained to train public generative models.",
  },
  {
    title: "Edge CDN Widget Sandboxing",
    badge: "Lightweight & Safe",
    icon: Globe,
    desc: "Our embed script (`/api/widget/script`) is self-contained with no external npm libraries or tracking scripts, ensuring zero client page slowdown and wildcard CORS security.",
  },
  {
    title: "Negative Review Shield Encryption",
    badge: "Confidential Grievances",
    icon: ShieldCheck,
    desc: "1 to 3 star customer grievances collected via `/r/[slug]` are encrypted in transit via TLS 1.3 and stored privately for direct leadership resolution.",
  },
];

export default function SecurityPage() {
  const { isDark, toggleTheme } = usePublicTheme(false);

  return (
    <div className="sp-page min-h-screen flex flex-col bg-[var(--sp-paper)] text-[var(--sp-ink)]">
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              SOC2 &amp; GDPR Architectural Security
            </div>
            <h1 className="sp-display text-3xl sm:text-5xl font-bold tracking-tight">
              Trust &amp; Infrastructure Security
            </h1>
            <p className="text-base sm:text-lg text-[var(--sp-mute)] max-w-2xl leading-relaxed">
              Designed for enterprise healthcare clinics, legal firms, and digital marketing agencies who demand strict tenant isolation and customer data privacy.
            </p>
          </div>

          {/* 5 Security Pillars */}
          <div className="grid md:grid-cols-2 gap-6">
            {SECURITY_PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="p-6 rounded-3xl border border-[var(--sp-line)] bg-[var(--sp-card)] shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md bg-[var(--sp-stage)] text-[var(--sp-mute)]">
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[var(--sp-ink)]">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[var(--sp-mute)] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Compliance & SLA Banner */}
          <div className="p-8 rounded-3xl bg-[var(--sp-card)] border border-[var(--sp-line)] shadow-lg space-y-4">
            <h2 className="text-lg font-bold text-[var(--sp-ink)]">
              Operational SLA &amp; Zero-Cost Architecture Guarantee
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-xl bg-[var(--sp-stage)] space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-100 block">
                  99.9% Uptime Target
                </span>
                <span className="text-[var(--sp-mute)]">
                  Vercel Edge Global Network with automatic failover
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[var(--sp-stage)] space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-100 block">
                  Zero Hosting Debt
                </span>
                <span className="text-[var(--sp-mute)]">
                  Runs entirely within free tiers ($0/month operating cost)
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[var(--sp-stage)] space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-100 block">
                  CORS Wildcard Safe
                </span>
                <span className="text-[var(--sp-mute)]">
                  Strict cross-origin resource sharing headers for widgets
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
