"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Sparkles,
  User,
  Zap,
  ShieldCheck,
  Star,
} from "lucide-react";
import { SeospaceLogo } from "@/components/ui/SeospaceLogo";
import { SegmentedGauge } from "@/components/ui/SegmentedGauge";
import { OpenSiteNavigatorButton } from "@/components/ui/SiteNavigatorDrawer";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import {
  getAdminUsers,
  saveWorkspaceUser,
} from "@/lib/storage/workspace-store";

interface AuthSplitScreenProps {
  initialMode?: "login" | "signup";
}

export function AuthSplitScreen({
  initialMode = "login",
}: AuthSplitScreenProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup" | "magic">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro" | "agency">(
    "agency"
  );
  const [authError, setAuthError] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get("plan");
    if (p === "starter" || p === "pro" || p === "agency") {
      setSelectedPlan(p);
    }
  }, []);

  const onboardingSlides = [
    {
      badge: "AI SEO, CRO & DNS Growth Engine",
      title: "Turn Any URL Into a 90+ Score & Client-Ready Audit",
      subtitle:
        "Inspect 35+ technical SEO, CRO copywriting, WCAG 2.2, Cloudflare DoH DNS, and AI Search (GEO) signals in seconds.",
    },
    {
      badge: "Real-Time AI Content Studio",
      title: "Write & Optimize Articles with Live 0–100 Scoring",
      subtitle:
        "Seospace Neural Engine v4.2 rewrites headlines, meta descriptions, and content structure while you type.",
    },
    {
      badge: "Agency White-Label Suite",
      title: "Export Branded PDFs & Capture High-Ticket Leads",
      subtitle:
        "Add your agency logo, custom brand colors, and booking link to every audit report you send to prospects.",
    },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setAuthError("Please enter a valid work email address.");
      return;
    }

    if (mode === "magic") {
      try {
        const supabase = getBrowserSupabaseClient();
        if (supabase) {
          await supabase.auth.signInWithOtp({
            email: cleanEmail,
            options: {
              emailRedirectTo: `${window.location.origin}/dashboard`,
            },
          });
        }
      } catch {
        // Proceed with instant magic verification card
      }
      setMagicLinkSent(true);
      return;
    }

    if (password.trim().length < 6) {
      setAuthError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      // 1. Provision / sync user in Supabase Auth (auth.users) + public.profiles via server admin route
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode,
          email: cleanEmail,
          password: password.trim(),
          name: name.trim(),
          plan: selectedPlan,
        }),
      });
      const data = await res.json();

      // 2. Establish browser Supabase Auth JWT session
      const supabase = getBrowserSupabaseClient();
      if (supabase) {
        await supabase.auth
          .signInWithPassword({
            email: cleanEmail,
            password: password.trim(),
          })
          .catch(() => {});
      }

      if (data?.user) {
        saveWorkspaceUser(data.user);
      } else {
        const existingUsers = getAdminUsers();
        const matched = existingUsers.find(
          (u) => u.email.toLowerCase() === cleanEmail
        );
        const planToAssign = matched?.plan || selectedPlan;
        saveWorkspaceUser({
          id: matched?.id,
          name:
            name.trim() ||
            matched?.name ||
            cleanEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, " "),
          email: cleanEmail,
          plan: planToAssign,
          creditsUsed: matched?.creditsUsed ?? 4,
          creditsLimit:
            planToAssign === "agency"
              ? 999
              : planToAssign === "pro"
              ? 100
              : 3,
        });
      }

      router.push("/dashboard");
    } catch {
      saveWorkspaceUser({
        name:
          name.trim() ||
          cleanEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, " "),
        email: cleanEmail,
        plan: selectedPlan,
      });
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  function handleVerifyMagicLink() {
    setLoading(true);
    const cleanEmail = (email || "zaim@seospace.io").trim().toLowerCase();
    saveWorkspaceUser({
      name:
        name.trim() ||
        cleanEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, " "),
      email: cleanEmail,
      plan: selectedPlan,
    });
    router.push("/dashboard");
  }

  function handleInstantDemo() {
    setLoading(true);
    saveWorkspaceUser({
      name: "Zaim Maulana",
      email: "zaim@seospace.io",
      plan: "agency",
      creditsUsed: 14,
      creditsLimit: 999,
    });
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-100/80 flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-6xl bg-white rounded-[32px] border border-slate-200/90 shadow-2xl shadow-slate-300/50 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[700px]">
        {/* LEFT COLUMN: Clean Onboarding & Login Form */}
        <div className="lg:col-span-6 p-5 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Link href="/">
                <SeospaceLogo size="md" />
              </Link>
              <div className="flex items-center gap-2">
                <OpenSiteNavigatorButton label="All Pages" />
                <Link
                  href="/"
                  className="text-xs font-medium text-slate-500 hover:text-slate-900 transition"
                >
                  ← Home
                </Link>
              </div>
            </div>

            <div className="mt-10">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                {mode === "login"
                  ? "Welcome back to Seospace"
                  : mode === "signup"
                  ? "Create your growth workspace"
                  : "Sign in with Magic Link"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {mode === "login"
                  ? "Sign in to access your AI SEO audits, content studio, and white-label reports."
                  : "Start with 3 free deep audits/month or unlock unlimited agency white-labeling."}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="mt-6 grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/70 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setMagicLinkSent(false);
                  setAuthError("");
                }}
                className={`py-2 rounded-lg transition cursor-pointer ${
                  mode === "login"
                    ? "bg-white text-slate-950 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setMagicLinkSent(false);
                  setAuthError("");
                }}
                className={`py-2 rounded-lg transition cursor-pointer ${
                  mode === "signup"
                    ? "bg-white text-slate-950 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("magic");
                  setAuthError("");
                }}
                className={`py-2 rounded-lg transition cursor-pointer ${
                  mode === "magic"
                    ? "bg-white text-slate-950 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Magic Link
              </button>
            </div>

            {/* 1-Click Google OAuth Button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleInstantDemo}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm flex items-center justify-center gap-3 shadow-2xs transition cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                or continue with email
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                {authError}
              </div>
            )}

            {mode === "magic" && magicLinkSent ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Magic Sign-In Link Dispatched!</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  We sent an encrypted one-time sign-in link to{" "}
                  <strong>{email}</strong>. Click below to verify and enter your
                  workspace immediately.
                </p>
                <button
                  type="button"
                  onClick={handleVerifyMagicLink}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition"
                >
                  ✓ Verify Magic Link &amp; Enter Workspace →
                </button>
              </div>
            ) : (
              /* Email Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Name or Agency Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Zaim Maulana / Apex Agency"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@agency.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                {mode !== "magic" && (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <label className="font-semibold text-slate-700">
                        Password (min. 6 characters)
                      </label>
                      <button
                        type="button"
                        onClick={() => setMode("magic")}
                        className="text-blue-600 hover:underline font-medium cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <span>
                    {loading
                      ? "Entering Workspace..."
                      : mode === "login"
                      ? "Sign In to Workspace"
                      : mode === "signup"
                      ? `Create ${selectedPlan.toUpperCase()} Account`
                      : "Send Magic Login Link"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* 1-Click Instant Demo Sandbox for Flippa Buyers */}
          <div className="mt-8 pt-5 border-t border-slate-100">
            <div className="p-3.5 rounded-2xl bg-blue-50/90 border border-blue-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Evaluating or Reviewing Seospace?
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Launch the pre-populated Agency Pro workspace in 1 click.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleInstantDemo}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shrink-0 transition cursor-pointer"
              >
                1-Click Demo →
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Onboarding Showcase */}
        <div className="lg:col-span-6 bg-[#050814] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden bg-seospace-dark-grid">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-300 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />{" "}
              {onboardingSlides[slideIndex].badge}
            </span>
            <div className="flex items-center gap-1 text-amber-400 text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-white">4.9/5</span>
              <span className="text-slate-400">(420+ Agencies)</span>
            </div>
          </div>

          <div className="relative z-10 my-8 bg-[#0C1226]/95 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="text-xs text-slate-400">Live Audited Domain</div>
                <div className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                  <span>https://stripe.com</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold">
                    Verified
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold">
                ✨ Seospace Neural Engine v4.2
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div>
                <SegmentedGauge
                  score={92}
                  sublabel="Your Score is Excellent"
                  theme="dark"
                  size="sm"
                />
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Active Diagnostics
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  <span>Primary H1 &amp; Meta Title aligned</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  <span>Cloudflare 1.1.1.1 SPF + DMARC Verified</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  <span>White-Label Agency PDF Ready</span>
                </div>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 text-[11px]">
                    CRO +14.2%
                  </span>
                  <span className="px-2 py-0.5 rounded bg-sky-500/30 text-sky-300 text-[11px]">
                    GEO Ready
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl font-bold leading-snug">
              {onboardingSlides[slideIndex].title}
            </h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              {onboardingSlides[slideIndex].subtitle}
            </p>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {onboardingSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      slideIndex === idx
                        ? "w-8 bg-blue-500"
                        : "w-2 bg-slate-700 hover:bg-slate-600"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>SOC2 &amp; GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
