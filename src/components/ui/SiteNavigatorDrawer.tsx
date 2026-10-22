"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  Code2,
  Compass,
  CreditCard,
  FileText,
  Globe,
  Home,
  LayoutDashboard,
  LogIn,
  Menu,
  Palette,
  ShieldCheck,
  Sparkles,
  Swords,
  Terminal,
  UserPlus,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { SeospaceLogo } from "@/components/ui/SeospaceLogo";

export function triggerSiteNavigator(open?: boolean) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("seospace:toggle-nav", { detail: { open } })
  );
}

export function OpenSiteNavigatorButton({
  variant = "light",
  label = "All Pages",
  className = "",
}: {
  variant?: "light" | "dark" | "glass";
  label?: string;
  className?: string;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleState = (e: Event) => {
      const custom = e as CustomEvent<{ open: boolean }>;
      if (typeof custom.detail?.open === "boolean") {
        setDrawerOpen(custom.detail.open);
      }
    };
    window.addEventListener("seospace:nav-state", handleState);
    return () => window.removeEventListener("seospace:nav-state", handleState);
  }, []);

  if (drawerOpen) return null;

  const baseStyles =
    variant === "dark"
      ? "bg-slate-900 hover:bg-slate-800 text-white border-slate-700"
      : variant === "glass"
      ? "bg-white/10 hover:bg-white/20 text-white border-white/20"
      : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200/90";

  return (
    <button
      type="button"
      onClick={() => triggerSiteNavigator(true)}
      title="Open Universal Site Navigator (All Pages • Ctrl+K)"
      className={`no-print px-3 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer shrink-0 ${baseStyles} ${className}`}
    >
      <Compass className="w-3.5 h-3.5 text-blue-500" />
      <span>{label}</span>
    </button>
  );
}

const NAV_SECTIONS = [
  {
    heading: "Core Workspace & AI Studio",
    items: [
      {
        href: "/",
        label: "Landing Page & Live Scanner",
        desc: "Hero URL audit, keyword discovery & ROI calculator",
        icon: Home,
      },
      {
        href: "/dashboard",
        label: "Executive Workspace Dashboard",
        desc: "Portfolio KPIs, saved audits & real-time signals",
        icon: LayoutDashboard,
      },
      {
        href: "/dashboard?tab=editor",
        label: "AI SEO Content Studio",
        desc: "Multi-article editor, 0-100 grader & AI co-pilot",
        icon: BookOpen,
      },
      {
        href: "/dashboard?tab=whitelabel",
        label: "White-Label Agency PDF Studio",
        desc: "Custom agency logo, colors & booking CTA",
        icon: Palette,
      },
      {
        href: "/dashboard?tab=widget",
        label: "Lead Capture CRM & Widget",
        desc: "Manage captured agency prospects & export CSV",
        icon: Users,
      },
      {
        href: "/dashboard?tab=billing",
        label: "Subscription & Stripe Billing",
        desc: "Starter, Pro ($19/mo) & Agency ($49/mo) plans",
        icon: CreditCard,
      },
    ],
  },
  {
    heading: "Growth Tools & Competitive Intelligence",
    items: [
      {
        href: "/compare",
        label: "Competitor Domain Battlecard",
        desc: "Head-to-head 2-URL comparison & 1-click outrank",
        icon: Swords,
      },
      {
        href: "/tools",
        label: "4-in-1 Free SEO & DNS Tools",
        desc: "/llms.txt, JSON-LD, robots.txt & live 1.1.1.1 DNS",
        icon: Wrench,
      },
      {
        href: "/docs",
        label: "REST API & Webhook Playground",
        desc: "Interactive browser console & cURL snippets",
        icon: Terminal,
      },
    ],
  },
  {
    heading: "Live Shareable Reports & Previews",
    items: [
      {
        href: "/report/voice-one-com",
        label: "Audit Report: voice-one.com",
        desc: "Saved RapidAPI + Cloudflare DoH DNS diagnostic",
        icon: Globe,
      },
      {
        href: "/report/stripe-com",
        label: "Audit Report: stripe.com",
        desc: "Enterprise 92/100 (A+) benchmark report",
        icon: ShieldCheck,
      },
      {
        href: "/article/art-voiceone-guide",
        label: "Shareable AI Article & Grader",
        desc: "Live blog view, SERP snippet & clean HTML export",
        icon: FileText,
      },
      {
        href: "/widget",
        label: "Public Lead-Gen Audit Widget",
        desc: "Standalone embeddable agency lead magnet form",
        icon: Code2,
      },
    ],
  },
  {
    heading: "Administration, Legal & Public Manifests",
    items: [
      {
        href: "/admin",
        label: "SaaS Owner Admin Portal",
        desc: "MRR control center, user tiers & API health check",
        icon: Activity,
      },
      {
        href: "/security",
        label: "Security, SOC2 & Crawler Manifests",
        desc: "Live /robots.txt, /sitemap.xml, /llms.txt & RLS status",
        icon: ShieldCheck,
      },
      {
        href: "/legal/privacy",
        label: "Privacy Policy & GDPR / CCPA DPA",
        desc: "Subprocessors, data retention & zero AI training policy",
        icon: FileText,
      },
      {
        href: "/legal/terms",
        label: "Terms of Service & Agency License",
        desc: "Commercial white-label PDF rights & 30-day guarantee",
        icon: BookOpen,
      },
      {
        href: "/login",
        label: "Sign In / Switch Account",
        desc: "Password, Magic Link & 1-Click Demo sandbox",
        icon: LogIn,
      },
      {
        href: "/signup",
        label: "Create Growth Workspace",
        desc: "Instant onboarding for new agency accounts",
        icon: UserPlus,
      },
    ],
  },
];

export function SiteNavigatorDrawer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleCustomToggle = (e: Event) => {
      const custom = e as CustomEvent<{ open?: boolean }>;
      if (typeof custom.detail?.open === "boolean") {
        setOpen(custom.detail.open);
      } else {
        setOpen((prev) => !prev);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("seospace:toggle-nav", handleCustomToggle);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("seospace:toggle-nav", handleCustomToggle);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Automatically close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Broadcast drawer open state so OpenSiteNavigatorButton hides when already open
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("seospace:nav-state", { detail: { open } })
    );
  }, [open]);

  if (!open) return null;

  return (
    <div className="no-print fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

          {/* Drawer Content */}
          <aside className="relative z-10 w-full max-w-sm bg-slate-950 text-white h-full border-l border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <SeospaceLogo darkText={false} size="sm" />
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  ALL PAGES
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close Navigation Drawer"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Links List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {NAV_SECTIONS.map((sec) => (
                <div key={sec.heading} className="space-y-2">
                  <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {sec.heading}
                  </div>
                  <div className="space-y-1">
                    {sec.items.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/" &&
                          !item.href.includes("?") &&
                          pathname?.startsWith(item.href));
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-start gap-3 p-2.5 rounded-2xl border transition ${
                            isActive
                              ? "bg-blue-600/20 border-blue-500/50 text-white"
                              : "bg-slate-900/50 border-slate-800/60 hover:bg-slate-900 hover:border-slate-700 text-slate-200"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                              isActive
                                ? "bg-blue-600 text-white"
                                : "bg-slate-800 text-blue-400"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold truncate">
                              {item.label}
                            </div>
                            <div className="text-[11px] text-slate-400 leading-snug mt-0.5">
                              {item.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-blue-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Seospace Neural Engine v4.2
              </span>
              <span>Press ESC to close</span>
            </div>
          </aside>
        </div>
  );
}
