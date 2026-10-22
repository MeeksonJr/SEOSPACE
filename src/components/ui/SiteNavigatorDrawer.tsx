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
  QrCode,
  Building2,
  Star,
  Sliders,
} from "lucide-react";
import { TrustPulseLogo } from "@/components/ui/TrustPulseLogo";

export function triggerSiteNavigator(open?: boolean) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("trustpulse:toggle-nav", { detail: { open } })
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
    window.addEventListener("trustpulse:nav-state", handleState);
    return () => window.removeEventListener("trustpulse:nav-state", handleState);
  }, []);

  if (drawerOpen) return null;

  return (
    <button
      type="button"
      onClick={() => triggerSiteNavigator(true)}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer ${
        variant === "dark"
          ? "bg-slate-900 text-white hover:bg-slate-800"
          : variant === "glass"
          ? "bg-white/80 backdrop-blur border border-slate-200 text-slate-800 hover:bg-white"
          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
      } ${className}`}
    >
      <Compass className="w-3.5 h-3.5 text-emerald-600" />
      <span>{label}</span>
    </button>
  );
}

const NAV_SECTIONS = [
  {
    heading: "Core Social Proof & Reputation Suite",
    items: [
      {
        href: "/",
        label: "Landing Page & Live Simulator",
        desc: "Interactive widget switcher, shield simulator & ROI calculator",
        icon: Home,
      },
      {
        href: "/dashboard",
        label: "Reputation Overview Dashboard",
        desc: "Live average rating (4.94★), total reviews & quick actions",
        icon: LayoutDashboard,
      },
      {
        href: "/dashboard/shield",
        label: "Negative Review Shield Inbox",
        desc: "Private 1-3 star customer grievances caught before Google",
        icon: ShieldCheck,
      },
      {
        href: "/dashboard/widgets",
        label: "Interactive Widget Studio",
        desc: "Floating toasts, Wall of Love masonry & 1-line script generator",
        icon: Code2,
      },
      {
        href: "/dashboard/qr-studio",
        label: "Printable QR Stand Studio",
        desc: "Download printable 4x6 table tents for reception & dining tables",
        icon: QrCode,
      },
      {
        href: "/dashboard/ai-replies",
        label: "PulseMind™ AI Review Auto-Responder",
        desc: "Synthesize 3 SEO-boosted and de-escalating replies in 1.8s",
        icon: Sparkles,
      },
      {
        href: "/dashboard/agency",
        label: "Agency White-Label Hub",
        desc: "Multi-client management and monthly PDF performance reports",
        icon: Building2,
      },
    ],
  },
  {
    heading: "Live Customer Funnels & Embeds",
    items: [
      {
        href: "/r/apex-dental",
        label: "Dental Clinic Review Funnel",
        desc: "Test the 5-star gatekeeper & negative review shield live",
        icon: Star,
      },
      {
        href: "/r/bayview-auto",
        label: "German Auto Shop Funnel",
        desc: "Live mobile-optimized customer feedback experience",
        icon: Star,
      },
      {
        href: "/embed/widget-apex-wall",
        label: "Standalone Wall of Love iFrame",
        desc: "Embeddable masonry view of verified patient reviews",
        icon: Globe,
      },
    ],
  },
  {
    heading: "Documentation, Security & Tools",
    items: [
      {
        href: "/compare",
        label: "Competitor Comparison Battlecard",
        desc: "TrustPulse AI vs. Birdeye ($399/mo) vs. Podium ($449/mo)",
        icon: Swords,
      },
      {
        href: "/tools",
        label: "Free Public Reputation Utilities",
        desc: "QR stand maker, review sentiment tester & widget playground",
        icon: Wrench,
      },
      {
        href: "/docs",
        label: "REST API & Embed Documentation",
        desc: "Interactive cURL and JSON console for developers",
        icon: Terminal,
      },
      {
        href: "/security",
        label: "Security & SOC2 Readiness",
        desc: "PostgreSQL RLS, TLS 1.3 transit & zero-retention AI policy",
        icon: ShieldCheck,
      },
      {
        href: "/legal/privacy",
        label: "Privacy Policy & GDPR / CCPA",
        desc: "Confidentiality of intercepted negative customer grievances",
        icon: FileText,
      },
      {
        href: "/legal/terms",
        label: "Terms of Service & Agency License",
        desc: "Commercial white-label resale rights and Stripe billing terms",
        icon: BookOpen,
      },
    ],
  },
];

export function SiteNavigatorDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const custom = e as CustomEvent<{ open?: boolean }>;
      if (typeof custom.detail?.open === "boolean") {
        setOpen(custom.detail.open);
      } else {
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("trustpulse:toggle-nav", handleToggle);
    return () => window.removeEventListener("trustpulse:toggle-nav", handleToggle);
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("trustpulse:nav-state", { detail: { open } })
    );
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <TrustPulseLogo auto size="sm" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Links Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {NAV_SECTIONS.map((sec) => (
            <div key={sec.heading} className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block px-2">
                {sec.heading}
              </span>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                        isActive
                          ? "bg-emerald-50 text-emerald-900 font-semibold"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isActive
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold leading-tight">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-slate-500 leading-tight mt-0.5 truncate">
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
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
          TrustPulse AI • Complete Sitemap &amp; Navigator
        </div>
      </div>
    </div>
  );
}
