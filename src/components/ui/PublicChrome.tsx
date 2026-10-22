"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  FileCode2,
  Globe,
  Lock,
  Menu,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { SeospaceLogo } from "@/components/ui/SeospaceLogo";
import { MotionEffects } from "@/components/ui/Motion";
import {
  OpenSiteNavigatorButton,
  triggerSiteNavigator,
} from "@/components/ui/SiteNavigatorDrawer";

const THEME_STORAGE_KEY = "seospace_theme_mode";

export function usePublicTheme(defaultDark = false) {
  const [isDark, setIsDark] = useState<boolean>(defaultDark);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark") {
      setIsDark(true);
    } else if (saved === "light") {
      setIsDark(false);
    }

    const handleThemeEvent = (e: Event) => {
      const custom = e as CustomEvent<{ isDark: boolean }>;
      if (typeof custom.detail?.isDark === "boolean") {
        setIsDark(custom.detail.isDark);
      }
    };

    window.addEventListener("seospace:theme-change", handleThemeEvent);
    return () => {
      window.removeEventListener("seospace:theme-change", handleThemeEvent);
    };
  }, []);

  const setTheme = (nextDark: boolean) => {
    setIsDark(nextDark);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        THEME_STORAGE_KEY,
        nextDark ? "dark" : "light"
      );
      window.dispatchEvent(
        new CustomEvent("seospace:theme-change", {
          detail: { isDark: nextDark },
        })
      );
    }
  };

  const toggleTheme = () => setTheme(!isDark);

  return { isDark, setTheme, toggleTheme };
}

export function ThemeToggleButton({
  isDark,
  onToggle,
  size = "md",
}: {
  isDark: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={
        isDark
          ? "Switch to Crisp Light Mode"
          : "Switch to Deep Space Navy Dark Mode"
      }
      className={`rounded-full border font-semibold inline-flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
        size === "sm" ? "px-2.5 py-1.5 text-[11px]" : "px-3 py-2 text-xs"
      } ${
        isDark
          ? "border-slate-700 bg-slate-900 text-amber-300 hover:bg-slate-800 shadow-sm shadow-amber-500/10"
          : "border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200"
      }`}
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Dark Mode</span>
        </>
      )}
    </button>
  );
}

export function PublicNavbar({
  isDark,
  onToggleTheme,
  badgeText,
}: {
  isDark: boolean;
  onToggleTheme: () => void;
  badgeText?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
        isDark
          ? "bg-[#050814]/90 border-slate-800/80 text-white"
          : "bg-white/90 border-slate-200/80 text-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 min-h-[4rem] sm:min-h-[4.5rem] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" className="shrink-0">
            <SeospaceLogo darkText={!isDark} />
          </Link>
          {badgeText && (
            <span
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                isDark
                  ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badgeText}</span>
            </span>
          )}
        </div>

        <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold">
          {[
            { href: "/", label: "Home" },
            { href: "/dashboard", label: "Dashboard" },
            { href: "/dashboard?tab=editor", label: "AI Article Studio" },
            { href: "/compare", label: "Battlecard" },
            { href: "/tools", label: "Free SEO & DNS Tools" },
            { href: "/docs", label: "REST API" },
            { href: "/security", label: "Security & Trust" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                isDark
                  ? "text-slate-300 hover:text-white transition"
                  : "text-slate-600 hover:text-slate-950 transition"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden xl:block">
            <OpenSiteNavigatorButton
              variant={isDark ? "dark" : "light"}
              label="All Pages"
            />
          </div>

          <ThemeToggleButton isDark={isDark} onToggle={onToggleTheme} />

          <Link
            href="/dashboard"
            className={`hidden sm:inline-flex px-4 py-2 rounded-full text-xs font-bold transition ${
              isDark
                ? "bg-blue-600 hover:bg-blue-500 text-white"
                : "bg-slate-950 hover:bg-slate-800 text-white"
            }`}
          >
            Open Workspace
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
            className={`xl:hidden px-3 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition cursor-pointer ${
              isDark
                ? "border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                : "border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200"
            }`}
          >
            {mobileOpen ? (
              <>
                <X className="w-4 h-4" />
                <span>Close</span>
              </>
            ) : (
              <>
                <Menu className="w-4 h-4" />
                <span>Menu</span>
              </>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className={`xl:hidden border-t px-4 py-4 space-y-3 ${
            isDark
              ? "bg-[#050814] border-slate-800 text-slate-200"
              : "bg-white border-slate-200 text-slate-800"
          }`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
            {[
              { href: "/", label: "Landing Page" },
              { href: "/dashboard", label: "Dashboard" },
              { href: "/dashboard?tab=editor", label: "AI Article Studio" },
              { href: "/compare", label: "Battlecard" },
              { href: "/tools", label: "Free SEO Tools" },
              { href: "/docs", label: "REST API Docs" },
              { href: "/security", label: "Security & Trust" },
              { href: "/legal/privacy", label: "Privacy & GDPR" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 rounded-xl border ${
                  isDark
                    ? "border-slate-800 bg-slate-900/60 hover:bg-slate-800"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                triggerSiteNavigator(true);
              }}
              className="col-span-2 sm:col-span-4 px-3 py-2.5 rounded-xl border border-blue-500/40 bg-blue-600/15 text-blue-500 font-bold text-center cursor-pointer"
            >
              Open Full Site Navigator (All 17 Pages &amp; Files) ↗
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export function PublicFooter({
  isDark,
  onToggleTheme,
}: {
  isDark: boolean;
  onToggleTheme?: () => void;
}) {
  return (
    <>
    <MotionEffects isDark={isDark} />
    <footer
      className={`border-t transition-colors duration-300 mt-auto ${
        isDark
          ? "bg-[#050814] border-slate-800/80 text-slate-300"
          : "bg-white border-slate-200 text-slate-600"
      }`}
    >
      {/* Top Crawler & System Readiness Strip */}
      <div
        className={`border-b ${
          isDark
            ? "bg-[#0B1022]/80 border-slate-800/80"
            : "bg-slate-50/90 border-slate-200/70"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational (99.98% SLA)
            </span>
            <span className={isDark ? "text-slate-700" : "text-slate-300"}>
              •
            </span>
            <span
              className={`font-medium ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Powered by{" "}
              <strong className={isDark ? "text-white" : "text-slate-900"}>
                Seospace Neural Engine v4.2
              </strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Live Public Manifests:
            </span>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] font-semibold inline-flex items-center gap-1 transition ${
                isDark
                  ? "border-slate-800 bg-slate-900 text-blue-400 hover:border-blue-500"
                  : "border-slate-200 bg-white text-blue-600 hover:border-blue-500"
              }`}
            >
              <Bot className="w-3 h-3" /> /robots.txt
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] font-semibold inline-flex items-center gap-1 transition ${
                isDark
                  ? "border-slate-800 bg-slate-900 text-emerald-400 hover:border-emerald-500"
                  : "border-slate-200 bg-white text-emerald-700 hover:border-emerald-500"
              }`}
            >
              <Globe className="w-3 h-3" /> /sitemap.xml
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href="/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] font-semibold inline-flex items-center gap-1 transition ${
                isDark
                  ? "border-slate-800 bg-slate-900 text-purple-400 hover:border-purple-500"
                  : "border-slate-200 bg-white text-purple-700 hover:border-purple-500"
              }`}
            >
              <FileCode2 className="w-3 h-3" /> /llms.txt
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main 5-Column Enterprise Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Brand & Architecture Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <SeospaceLogo darkText={!isDark} />
            </Link>
            <p
              className={`text-xs leading-relaxed max-w-sm ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Autonomous 35-point Technical SEO, CRO, Generative Engine
              Optimization (GEO), WCAG 2.2 AA compliance, and live Cloudflare
              1.1.1.1 DNS security intelligence — paired with an AI Content
              Studio and White-Label Agency PDF reporting.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                  isDark
                    ? "bg-slate-900 border-slate-800 text-slate-300"
                    : "bg-slate-100 border-slate-200 text-slate-700"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> SOC2 &amp;
                GDPR Ready
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                  isDark
                    ? "bg-slate-900 border-slate-800 text-slate-300"
                    : "bg-slate-100 border-slate-200 text-slate-700"
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-blue-500" /> Stripe PCI-DSS L1
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                  isDark
                    ? "bg-slate-900 border-slate-800 text-slate-300"
                    : "bg-slate-100 border-slate-200 text-slate-700"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> Zero AI
                Training
              </span>
            </div>
            {onToggleTheme && (
              <div className="pt-2">
                <ThemeToggleButton isDark={isDark} onToggle={onToggleTheme} />
              </div>
            )}
          </div>

          {/* Column 2: Core Platform & AI Studio (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <div
              className={`font-bold uppercase tracking-wider text-[11px] ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              Platform &amp; Studio
            </div>
            <ul className="space-y-2.5 font-medium">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-blue-500 transition"
                >
                  Executive Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard?tab=editor"
                  className="hover:text-blue-500 transition"
                >
                  AI SEO Article Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard?tab=whitelabel"
                  className="hover:text-blue-500 transition"
                >
                  White-Label PDF Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard?tab=widget"
                  className="hover:text-blue-500 transition"
                >
                  Agency Lead CRM
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard?tab=billing"
                  className="hover:text-blue-500 transition"
                >
                  Plans &amp; Stripe Billing
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-blue-500 transition">
                  SaaS Owner Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Growth Tools & Live Reports (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <div
              className={`font-bold uppercase tracking-wider text-[11px] ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              Growth Tools &amp; Live Reports
            </div>
            <ul className="space-y-2.5 font-medium">
              <li>
                <Link
                  href="/compare"
                  className="hover:text-blue-500 transition"
                >
                  Competitor Domain Battlecard
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-blue-500 transition">
                  4-in-1 Free SEO, GEO &amp; DNS Tools
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-blue-500 transition">
                  Developer REST API &amp; Webhooks
                </Link>
              </li>
              <li>
                <Link href="/widget" className="hover:text-blue-500 transition">
                  Embeddable Lead-Capture Widget
                </Link>
              </li>
              <li>
                <Link
                  href="/report/voice-one-com"
                  className="hover:text-blue-500 transition"
                >
                  Live Audit: voice-one.com (74/100)
                </Link>
              </li>
              <li>
                <Link
                  href="/report/stripe-com"
                  className="hover:text-blue-500 transition"
                >
                  Live Audit: stripe.com (92/100 A+)
                </Link>
              </li>
              <li>
                <Link
                  href="/article/art-voiceone-guide"
                  className="hover:text-blue-500 transition"
                >
                  Shareable AI Article &amp; Scorecard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal, Trust & Crawler Files (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <div
              className={`font-bold uppercase tracking-wider text-[11px] ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              Legal, Compliance &amp; Crawlers
            </div>
            <ul className="space-y-2.5 font-medium">
              <li>
                <Link
                  href="/legal/privacy"
                  className="hover:text-blue-500 transition"
                >
                  Privacy Policy &amp; GDPR / CCPA DPA
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="hover:text-blue-500 transition"
                >
                  Terms of Service &amp; Agency License
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="hover:text-blue-500 transition"
                >
                  Security, SOC2 &amp; Trust Center
                </Link>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition inline-flex items-center gap-1"
                >
                  Robots Exclusion (/robots.txt)
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition inline-flex items-center gap-1"
                >
                  XML Sitemap (/sitemap.xml)
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="/llms.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition inline-flex items-center gap-1"
                >
                  AI Search Manifest (/llms.txt)
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-500 transition">
                  Sign In / Switch Workspace
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Quick Action Bar */}
        <div
          className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
            isDark ? "border-slate-800/80 text-slate-400" : "border-slate-200 text-slate-500"
          }`}
        >
          <div>
            © {new Date().getFullYear()} Seospace AI Inc. All rights reserved.
            Built with Next.js 16 App Router, RapidAPI Metadata, Cloudflare DoH
            1.1.1.1 &amp; Seospace Neural Engine v4.2.
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/legal/privacy"
              className="hover:text-blue-500 transition"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="hover:text-blue-500 transition"
            >
              Terms
            </Link>
            <Link href="/security" className="hover:text-blue-500 transition">
              Security
            </Link>
            <a
              href="/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition font-mono"
            >
              llms.txt
            </a>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
