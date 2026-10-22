"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Mounted once per public page (via PublicFooter). Adds:
 *  - fixed Aurora ambient background
 *  - scroll progress bar
 *  - scroll-reveal for cards / section blocks (staggered)
 *  - back-to-top button
 * Content is only hidden by JS-added classes, so it is always visible without JS.
 */
export function MotionEffects({ isDark }: { isDark: boolean }) {
  const barRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.spTheme = isDark ? "dark" : "light";
  }, [isDark]);

  useEffect(() => {
    document.body.classList.add("sp-public");
    return () => {
      document.body.classList.remove("sp-public");
      delete document.documentElement.dataset.spTheme;
    };
  }, []);

  // Scroll progress + back-to-top
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      setShowTop(window.scrollY > 700);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll reveal
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isCard = (el: Element) =>
      el.classList.contains("border") &&
      (el.classList.contains("rounded-2xl") ||
        el.classList.contains("rounded-3xl"));

    const skip = (el: Element) =>
      !!el.closest(
        "header, nav, footer, .sticky, [class*='sticky'], [class*='fixed'], .sp-no-reveal, [data-sp-skip]"
      );

    const scan = () => {
      const cards = Array.from(
        document.querySelectorAll<HTMLElement>(
          "section .rounded-2xl.border, section .rounded-3xl.border, main .rounded-2xl.border, main .rounded-3xl.border"
        )
      ).filter((el) => !skip(el));
      const outerCards = cards.filter(
        (el) => !cards.some((o) => o !== el && o.contains(el))
      );

      const blocks = Array.from(
        document.querySelectorAll<HTMLElement>(
          "section > div > *, main > section > *"
        )
      ).filter(
        (el) =>
          !skip(el) &&
          !isCard(el) &&
          !outerCards.some((c) => el.contains(c) || c.contains(el))
      );

      const targets = [...outerCards, ...blocks];
      const vh = window.innerHeight;

      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add("sp-in");
              io.unobserve(e.target);
            }
          }
        },
        { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
      );

      for (const el of targets) {
        if (el.classList.contains("sp-reveal")) continue;
        const rect = el.getBoundingClientRect();
        // Already on screen at load (or above) - leave visible, avoid flash
        if (rect.top < vh * 0.92) continue;
        const siblings = el.parentElement
          ? Array.from(el.parentElement.children)
          : [];
        const idx = Math.max(0, siblings.indexOf(el));
        el.style.setProperty("--sp-delay", `${(idx % 6) * 80}ms`);
        el.classList.add("sp-reveal");
        io.observe(el);
      }
      return io;
    };

    let io: IntersectionObserver | null = null;
    const t = window.setTimeout(() => {
      io = scan();
    }, 120);

    return () => {
      window.clearTimeout(t);
      io?.disconnect();
      document
        .querySelectorAll(".sp-reveal")
        .forEach((el) => el.classList.add("sp-in"));
    };
  }, []);

  return (
    <>
      <div ref={barRef} className="sp-progress no-print" aria-hidden="true" />
      <div className="sp-aurora no-print" aria-hidden="true">
        <i />
      </div>
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`sp-top no-print w-10 h-10 rounded-full inline-flex items-center justify-center shadow-lg border cursor-pointer ${
          showTop ? "sp-show" : ""
        } ${
          isDark
            ? "bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
            : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </>
  );
}

/** Animated number that counts up once when scrolled into view. */
export function CountUp({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1600,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(to);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          setVal(to * eased);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {val.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

const STACK = [
  "Next.js 15",
  "Supabase PostgreSQL",
  "Stripe Billing",
  "Cloudflare 1.1.1.1 DoH",
  "RapidAPI Metadata",
  "Wayback Machine",
  "WCAG 2.2 AA",
  "llms.txt / GEO",
  "JSON-LD Schema",
  "Row-Level Security",
  "Vercel Edge",
  "REST + Webhooks",
];

const STATS = [
  { to: 35, suffix: "", label: "Automated checks per audit" },
  { to: 5, suffix: "", label: "Scoring pillars: SEO, CRO, GEO, A11y, Security" },
  { to: 15, suffix: "s", prefix: "<", label: "Typical live scan time" },
  { to: 95, suffix: "+", label: "Target AI article SEO score" },
];

/** Landing-page proof band: animated metrics + tech-stack marquee. */
export function TrustStrip({ isDark }: { isDark: boolean }) {
  const items = [...STACK, ...STACK];
  return (
    <section
      aria-label="Platform proof points"
      className={`relative py-12 border-y ${
        isDark
          ? "bg-[#070b1c] border-slate-800/80"
          : "bg-gradient-to-b from-white to-slate-50 border-slate-200/80"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((s) => (
            <div
              key={s.label}
              className={`rounded-2xl border p-5 text-center ${
                isDark
                  ? "bg-slate-900/60 border-slate-800"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="text-3xl sm:text-4xl font-extrabold sp-gradient-text">
                <CountUp to={s.to} suffix={s.suffix} prefix={s.prefix} />
              </div>
              <div
                className={`mt-1.5 text-xs font-medium leading-snug ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="sp-marquee mt-9" aria-hidden="true">
          <div className="sp-marquee-track">
            {items.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className={`inline-flex items-center gap-2 text-sm font-semibold whitespace-nowrap ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
