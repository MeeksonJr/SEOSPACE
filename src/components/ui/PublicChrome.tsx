"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TrustPulseLogo } from "@/components/ui/TrustPulseLogo";
import { MotionEffects } from "@/components/ui/Motion";
import { triggerSiteNavigator } from "@/components/ui/SiteNavigatorDrawer";

const THEME_STORAGE_KEY = "trustpulse_theme_mode";

function applyTheme(dark: boolean) {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.spTheme = dark ? "dark" : "light";
    if (dark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }
}

export function usePublicTheme(defaultDark = false) {
  const [isDark, setIsDark] = useState<boolean>(defaultDark);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    const dark = saved === "dark" ? true : saved === "light" ? false : defaultDark;
    setIsDark(dark);
    applyTheme(dark);

    const handle = (e: Event) => {
      const custom = e as CustomEvent<{ isDark: boolean }>;
      if (typeof custom.detail?.isDark === "boolean") {
        setIsDark(custom.detail.isDark);
        applyTheme(custom.detail.isDark);
      }
    };
    window.addEventListener("trustpulse:theme-change", handle);
    return () => window.removeEventListener("trustpulse:theme-change", handle);
  }, [defaultDark]);

  const setTheme = (nextDark: boolean) => {
    setIsDark(nextDark);
    applyTheme(nextDark);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextDark ? "dark" : "light");
      window.dispatchEvent(
        new CustomEvent("trustpulse:theme-change", { detail: { isDark: nextDark } })
      );
    }
  };

  return { isDark, setTheme, toggleTheme: () => setTheme(!isDark) };
}

/** Theme toggle: compact icon on mobile, sleek switch on desktop */
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
    <>
      {/* Mobile / Compact icon button */}
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        onClick={onToggle}
        className={`inline-flex items-center justify-center rounded-full border border-line bg-card hover:bg-stage cursor-pointer text-ink transition-colors ${
          size === "sm" ? "h-8 w-8 text-xs" : "h-8 w-8 sm:hidden text-xs"
        }`}
        title={isDark ? "Switch to day theme" : "Switch to night theme"}
      >
        {isDark ? (
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        ) : (
          <svg
            className="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </button>

      {/* Desktop two-position sliding switch */}
      {size !== "sm" && (
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          onClick={onToggle}
          className="relative hidden sm:inline-flex h-8 w-[4.6rem] shrink-0 items-center rounded-full border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 cursor-pointer text-[0.62rem] font-bold font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 shadow-inner"
        >
          <span
            className={`absolute top-[2px] h-[26px] w-[34px] rounded-full bg-white dark:bg-zinc-950 shadow-sm border border-slate-200/80 dark:border-zinc-700 transition-transform duration-200 ${
              isDark ? "translate-x-[36px]" : "translate-x-[2px]"
            }`}
          />
          <span
            className={`relative z-10 w-1/2 text-center transition-colors ${
              isDark ? "text-slate-400 dark:text-slate-500" : "text-emerald-700 font-extrabold"
            }`}
          >
            Day
          </span>
          <span
            className={`relative z-10 w-1/2 text-center transition-colors ${
              isDark ? "text-emerald-400 font-extrabold" : "text-slate-400"
            }`}
          >
            Night
          </span>
        </button>
      )}
    </>
  );
}

export function PublicNavbar({
  isDark,
  onToggleTheme,
}: {
  isDark: boolean;
  onToggleTheme: () => void;
  badgeText?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2.5 sm:px-4 lg:px-6 pt-2 sm:pt-3 pointer-events-none transition-all duration-300">
      <div
        className={`mx-auto max-w-5xl xl:max-w-6xl w-full flex items-center justify-between gap-2 sm:gap-4 rounded-full border border-line bg-card/95 backdrop-blur-md px-3 sm:px-4 py-2 pointer-events-auto transition-all duration-300 ${
          isScrolled
            ? "shadow-xl border-line/90 bg-card/98 scale-[0.99]"
            : "sp-card-shadow"
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="shrink-0 pl-0.5" aria-label="TrustPulse AI home">
          <TrustPulseLogo auto size="sm" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 text-[0.8rem] font-medium min-w-0">
          <Link
            href="/#shield"
            className="px-2.5 lg:px-3 py-1.5 rounded-full text-mute hover:text-ink hover:bg-stage transition-colors"
          >
            Review Shield
          </Link>
          <Link
            href="/#widgets"
            className="px-2.5 lg:px-3 py-1.5 rounded-full text-mute hover:text-ink hover:bg-stage transition-colors"
          >
            Widgets
          </Link>
          <Link
            href="/#ai-replies"
            className="px-2.5 lg:px-3 py-1.5 rounded-full text-mute hover:text-ink hover:bg-stage transition-colors"
          >
            AI Replies
          </Link>
          <Link
            href="/#roi"
            className="px-2.5 lg:px-3 py-1.5 rounded-full text-mute hover:text-ink hover:bg-stage transition-colors"
          >
            Agency ROI
          </Link>
          <Link
            href="/#pricing"
            className="px-2.5 lg:px-3 py-1.5 rounded-full text-mute hover:text-ink hover:bg-stage transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/docs"
            className="px-2.5 lg:px-3 py-1.5 rounded-full text-mute hover:text-ink hover:bg-stage transition-colors"
          >
            Docs
          </Link>
        </nav>

        {/* Right CTA cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ThemeToggleButton isDark={isDark} onToggle={onToggleTheme} />

          <Link
            href="/r/apex-dental"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1 text-[0.78rem] font-semibold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 transition-colors"
          >
            <span>Live Funnel</span>
            <span aria-hidden>↗</span>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[0.78rem] px-3.5 sm:px-4 py-1.5 transition-colors shadow-sm"
          >
            Dashboard
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
            className="md:hidden inline-flex items-center justify-center h-8 w-8 rounded-full border border-line bg-card text-ink hover:bg-stage cursor-pointer transition-colors"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {open ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drop menu */}
      {open && (
        <div className="md:hidden fixed inset-x-3 top-16 z-50 rounded-3xl border border-line bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-ink pointer-events-auto">
          <nav className="flex flex-col space-y-3">
            {[
              { href: "/#shield", label: "Negative Review Shield" },
              { href: "/#widgets", label: "Embeddable Social Proof Widgets" },
              { href: "/#ai-replies", label: "PulseMind™ AI Review Responder" },
              { href: "/#roi", label: "Agency Retainer Calculator" },
              { href: "/#pricing", label: "Pricing & Plans" },
              { href: "/r/apex-dental", label: "Test Live QR Funnel ↗" },
              { href: "/dashboard", label: "Client Workspace Dashboard ↗" },
              { href: "/docs", label: "Documentation & API" },
            ].map((n, i) => (
              <Link
                key={n.href + n.label}
                href={n.href}
                onClick={() => setOpen(false)}
                className="text-lg font-bold py-2 border-b border-line flex items-center justify-between hover:text-emerald-500 transition-colors"
              >
                <span>{n.label}</span>
                <span className="text-xs text-mute font-mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-line">
            <span className="text-xs font-mono uppercase text-mute">Theme Mode:</span>
            <ThemeToggleButton isDark={isDark} onToggle={onToggleTheme} size="sm" />
          </div>
        </div>
      )}
    </header>
  );
}

const FOOT_COLS: Array<{
  title: string;
  links: Array<{ href: string; label: string; ext?: boolean }>;
}> = [
  {
    title: "Product",
    links: [
      { href: "/dashboard", label: "Reputation Dashboard" },
      { href: "/dashboard/widgets", label: "Widget Studio (Toasts & Wall)" },
      { href: "/dashboard/shield", label: "Shielded Feedback Inbox" },
      { href: "/dashboard/ai-replies", label: "PulseMind™ Review Responder" },
      { href: "/dashboard/qr-studio", label: "Printable QR Code Studio" },
    ],
  },
  {
    title: "Live Demos",
    links: [
      { href: "/r/apex-dental", label: "Dental Clinic Review Funnel" },
      { href: "/r/bayview-auto", label: "German Auto Shop Funnel" },
      { href: "/embed/widget-apex-wall", label: "Standalone Wall of Love" },
      { href: "/dashboard/agency", label: "Agency Multi-Client Hub" },
    ],
  },
  {
    title: "Integrations & API",
    links: [
      { href: "/docs", label: "Widget 1-Line Script API" },
      { href: "/api/widget/script?id=widget-apex-toasts", label: "CDN Embed Engine" },
      { href: "/robots.txt", label: "/robots.txt", ext: true },
      { href: "/sitemap.xml", label: "/sitemap.xml", ext: true },
    ],
  },
  {
    title: "Company & Legal",
    links: [
      { href: "/compare", label: "Competitor Battlecard" },
      { href: "/tools", label: "Free Reputation Utilities" },
      { href: "/security", label: "Security & SOC2 Readiness" },
      { href: "/legal/privacy", label: "Privacy Policy & GDPR" },
      { href: "/legal/terms", label: "Terms of Service" },
      { href: "/login", label: "Client Login" },
      { href: "/admin", label: "Admin Panel" },
    ],
  },
];

export function PublicFooter({
  isDark,
  onToggleTheme,
}: {
  isDark: boolean;
  onToggleTheme?: () => void;
}) {
  return (
    <>
      <MotionEffects />
      <footer className="mt-auto bg-slate-950 text-slate-100 relative overflow-hidden border-t border-slate-800">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8 pt-16 sm:pt-24">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <h2 className="sp-display text-[clamp(2.4rem,7vw,6.5rem)] lg:col-span-8 text-white">
              Protect your stars.
              <br />
              Amplify your <span className="text-emerald-400">social proof.</span>
            </h2>
            <div className="lg:col-span-4 space-y-5">
              <p className="text-slate-300 text-[0.95rem] leading-relaxed max-w-sm">
                Shield local businesses from unfair 1-star public reviews while streaming verified 5-star customer praise into high-converting website widgets.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Open Live Demo Workspace <span aria-hidden className="ml-1">↗</span>
                </Link>
                <Link
                  href="/r/apex-dental"
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 hover:bg-slate-900 text-white font-medium px-5 py-3 transition-colors"
                >
                  Test QR Shield Funnel
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-16 sm:mt-20 grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10 border-t border-slate-800/80 pt-10">
            <div className="col-span-2 lg:col-span-1 space-y-4">
              <TrustPulseLogo darkText={false} />
              <p className="text-xs leading-relaxed text-slate-400 max-w-[16rem]">
                Autonomous Social Proof, Multi-Source Review Aggregator &amp; Negative Review Shield for Local Businesses &amp; Agencies.
              </p>
            </div>
            {FOOT_COLS.map((col) => (
              <div key={col.title}>
                <div className="sp-eyebrow text-slate-400 mb-4">{col.title}</div>
                <ul className="space-y-2.5 text-[0.85rem]">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.ext ? (
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-300 hover:text-emerald-400 transition-colors font-mono text-[0.78rem]"
                        >
                          {l.label} ↗
                        </a>
                      ) : (
                        <Link
                          href={l.href}
                          className="text-slate-300 hover:text-emerald-400 transition-colors"
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 py-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational · © {new Date().getFullYear()} TrustPulse AI Inc. Built for zero-cost operation.
            </div>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => triggerSiteNavigator(true)}
                className="hover:text-white cursor-pointer"
              >
                All pages
              </button>
              {onToggleTheme && (
                <ThemeToggleButton isDark={isDark} onToggle={onToggleTheme} />
              )}
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="sp-display select-none text-center text-[clamp(4.5rem,24vw,22rem)] leading-[0.72] text-white/[0.035] -mb-[0.06em] pointer-events-none"
        >
          trustpulse
        </div>
      </footer>
    </>
  );
}
