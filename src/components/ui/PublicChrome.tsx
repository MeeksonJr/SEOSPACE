"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SeospaceLogo } from "@/components/ui/SeospaceLogo";
import { MotionEffects } from "@/components/ui/Motion";
import { triggerSiteNavigator } from "@/components/ui/SiteNavigatorDrawer";

const THEME_STORAGE_KEY = "seospace_theme_mode";

function applyTheme(dark: boolean) {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.spTheme = dark ? "dark" : "light";
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
    window.addEventListener("seospace:theme-change", handle);
    return () => window.removeEventListener("seospace:theme-change", handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = (nextDark: boolean) => {
    setIsDark(nextDark);
    applyTheme(nextDark);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextDark ? "dark" : "light");
      window.dispatchEvent(
        new CustomEvent("seospace:theme-change", { detail: { isDark: nextDark } })
      );
    }
  };

  return { isDark, setTheme, toggleTheme: () => setTheme(!isDark) };
}

/** Two-position switch with a sliding thumb. */
export function ThemeToggleButton({
  isDark,
  onToggle,
}: {
  isDark: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={onToggle}
      className="relative inline-flex h-9 w-[4.6rem] shrink-0 items-center rounded-full border border-line bg-card cursor-pointer sp-eyebrow !text-[0.6rem] text-ink"
    >
      <span
        className={`absolute top-[3px] h-[26px] w-[34px] rounded-full bg-ink transition-transform duration-300 ${
          isDark ? "translate-x-[34px]" : "translate-x-[3px]"
        }`}
      />
      <span className={`relative z-10 w-1/2 text-center transition-colors ${isDark ? "text-mute" : "text-paper"}`}>
        Day
      </span>
      <span className={`relative z-10 w-1/2 text-center transition-colors ${isDark ? "text-paper" : "text-mute"}`}>
        Night
      </span>
    </button>
  );
}

const NAV = [
  { href: "/#how", label: "How it works" },
  { href: "/tools", label: "Free tools" },
  { href: "/compare", label: "Compare" },
  { href: "/docs", label: "API" },
  { href: "/security", label: "Security" },
  { href: "/#pricing", label: "Pricing" },
];

export function PublicNavbar({
  isDark,
  onToggleTheme,
}: {
  isDark: boolean;
  onToggleTheme: () => void;
  badgeText?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-5 pt-3">
      <div className="mx-auto max-w-[88rem] flex items-center justify-between gap-3 rounded-full border border-line bg-card/95 backdrop-blur px-3 sm:px-4 py-2 sp-card-shadow">
        <Link href="/" className="shrink-0 pl-1" aria-label="Seospace home">
          <SeospaceLogo auto />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-[0.82rem] font-medium">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-3.5 py-2 rounded-full text-mute hover:text-ink hover:bg-stage transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggleButton isDark={isDark} onToggle={onToggleTheme} />
          <Link
            href="/login"
            className="hidden sm:inline-flex px-3 py-2 text-[0.82rem] font-medium text-ink hover:underline underline-offset-4"
          >
            Sign in
          </Link>
          <Link href="/dashboard" className="sp-btn sp-btn-primary !py-2.5 !px-4 hidden sm:inline-flex">
            Open live demo <span aria-hidden>↗</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="lg:hidden sp-btn sp-btn-ghost !py-2.5 !px-4"
            aria-label="Open menu"
            aria-expanded={open}
          >
            Menu
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] bg-night text-[#f3f0e8] flex flex-col p-6 sm:p-10 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex items-center justify-between">
            <SeospaceLogo darkText={false} />
            <button type="button" onClick={() => setOpen(false)} className="sp-btn sp-btn-ghost !text-[#f3f0e8] !border-[#f3f0e8]/60 !py-2.5">
              Close ✕
            </button>
          </div>
          <nav className="mt-10 flex flex-col">
            {[{ href: "/", label: "Home" }, ...NAV, { href: "/dashboard", label: "Live demo" }, { href: "/login", label: "Sign in" }].map((n, i) => (
              <Link
                key={n.href + n.label}
                href={n.href}
                onClick={() => setOpen(false)}
                className="sp-display text-[2.6rem] sm:text-6xl py-3 border-b border-white/10 flex items-baseline justify-between hover:text-[#ff4d14] transition-colors"
              >
                <span>{n.label}</span>
                <span className="sp-eyebrow !text-[0.65rem] text-white/40">{String(i + 1).padStart(2, "0")}</span>
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              triggerSiteNavigator(true);
            }}
            className="mt-8 sp-eyebrow text-left text-white/60 hover:text-white"
          >
            All pages & files ↗
          </button>
        </div>
      )}
    </header>
  );
}

const FOOT_COLS: Array<{ title: string; links: Array<{ href: string; label: string; ext?: boolean }> }> = [
  {
    title: "Product",
    links: [
      { href: "/dashboard", label: "Workspace" },
      { href: "/dashboard?tab=editor", label: "AI article studio" },
      { href: "/dashboard?tab=whitelabel", label: "White-label reports" },
      { href: "/dashboard?tab=widget", label: "Lead widget & CRM" },
      { href: "/dashboard?tab=billing", label: "Plans & billing" },
    ],
  },
  {
    title: "Free tools",
    links: [
      { href: "/tools", label: "llms.txt, schema & DNS tools" },
      { href: "/compare", label: "Competitor battlecard" },
      { href: "/report/voice-one-com", label: "Sample audit: voice-one.com" },
      { href: "/report/stripe-com", label: "Sample audit: stripe.com" },
      { href: "/article/art-voiceone-guide", label: "Sample AI article" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/docs", label: "REST API & webhooks" },
      { href: "/widget", label: "Embed widget" },
      { href: "/robots.txt", label: "/robots.txt", ext: true },
      { href: "/sitemap.xml", label: "/sitemap.xml", ext: true },
      { href: "/llms.txt", label: "/llms.txt", ext: true },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/security", label: "Security & trust" },
      { href: "/legal/privacy", label: "Privacy & DPA" },
      { href: "/legal/terms", label: "Terms & licence" },
      { href: "/login", label: "Sign in" },
      { href: "/admin", label: "Owner admin" },
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
      <footer className="mt-auto bg-night text-[#f3f0e8] relative overflow-hidden">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8 pt-16 sm:pt-24">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <h2 className="sp-display text-[clamp(2.6rem,8vw,7rem)] lg:col-span-8" data-reveal>
              Audit it.
              <br />
              Fix it. <span className="text-[#ff4d14]">Send it.</span>
            </h2>
            <div className="lg:col-span-4 space-y-5" data-reveal data-delay="2">
              <p className="text-[#f3f0e8]/70 text-[0.95rem] leading-relaxed max-w-sm">
                Scan any website in seconds, ship the fixes with AI, and hand clients a report that carries your brand, not ours.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard" className="sp-btn sp-btn-accent">
                  Open live demo <span aria-hidden>↗</span>
                </Link>
                <Link href="/signup" className="sp-btn sp-btn-ghost !text-[#f3f0e8] !border-[#f3f0e8]/50 hover:!bg-[#f3f0e8] hover:!text-[#141413]">
                  Start free
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-16 sm:mt-20 grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10 border-t border-white/10 pt-10">
            <div className="col-span-2 lg:col-span-1 space-y-4">
              <SeospaceLogo darkText={false} />
              <p className="text-xs leading-relaxed text-white/50 max-w-[16rem]">
                SEO, conversion, AI-search and DNS audits with a white-label report engine.
              </p>
            </div>
            {FOOT_COLS.map((col) => (
              <div key={col.title}>
                <div className="sp-eyebrow text-white/40 mb-4">{col.title}</div>
                <ul className="space-y-2.5 text-[0.85rem]">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.ext ? (
                        <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-[#ff4d14] transition-colors font-mono text-[0.78rem]">
                          {l.label} ↗
                        </a>
                      ) : (
                        <Link href={l.href} className="text-white/80 hover:text-[#ff4d14] transition-colors">
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 py-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              All systems operational · © {new Date().getFullYear()} Seospace AI Inc.
            </div>
            <div className="flex items-center gap-5">
              <button type="button" onClick={() => triggerSiteNavigator(true)} className="hover:text-white cursor-pointer">
                All pages
              </button>
              {onToggleTheme && <ThemeToggleButton isDark={isDark} onToggle={onToggleTheme} />}
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="sp-display select-none text-center text-[clamp(5rem,26vw,24rem)] leading-[0.72] text-white/[0.045] -mb-[0.06em] pointer-events-none"
        >
          seospace
        </div>
      </footer>
    </>
  );
}
