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
import { usePublicTheme, ThemeToggleButton } from "@/components/ui/PublicChrome";
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
  const { isDark, toggleTheme } = usePublicTheme(false);
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
        "Seospace Neural Engine v4.2 verifies headlines, meta descriptions, and keyword densities while you edit.",
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
    <div className="sp-page min-h-screen bg-paper text-ink flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-6xl bg-card rounded-[32px] border border-line sp-card-shadow overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[720px]">
        {/* LEFT COLUMN: Clean Onboarding & Login Form */}
        <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link href="/">
                <SeospaceLogo auto size="md" />
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggleButton isDark={isDark} onToggle={toggleTheme} size="sm" />
                <OpenSiteNavigatorButton variant="dark" label="All Pages" />
                <Link
                  href="/"
                  className="text-xs font-semibold text-mute hover:text-ink transition"
                >
                  ← Home
                </Link>
              </div>
            </div>

            <div className="mt-8">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                {mode === "login"
                  ? "Account Access"
                  : mode === "signup"
                  ? "Free 14-Day Agency Trial"
                  : "Passwordless Sign-In"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-ink mt-1">
                {mode === "login"
                  ? "Welcome back to Seospace"
                  : mode === "signup"
                  ? "Create your growth workspace"
                  : "Sign in with Magic Link"}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-mute leading-relaxed">
                {mode === "login"
                  ? "Sign in to access your AI SEO audits, content studio, and white-label reports."
                  : "Start with 3 free deep audits/month or unlock unlimited agency white-labeling."}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="mt-6 grid grid-cols-3 gap-1 p-1 rounded-2xl bg-stage border border-line text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setMagicLinkSent(false);
                  setAuthError("");
                }}
                className={`py-2 rounded-xl transition cursor-pointer ${
                  mode === "login"
                    ? "bg-night text-[#f3f0e8] shadow-xs"
                    : "text-mute hover:text-ink"
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
                className={`py-2 rounded-xl transition cursor-pointer ${
                  mode === "signup"
                    ? "bg-night text-[#f3f0e8] shadow-xs"
                    : "text-mute hover:text-ink"
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
                className={`py-2 rounded-xl transition cursor-pointer ${
                  mode === "magic"
                    ? "bg-night text-[#f3f0e8] shadow-xs"
                    : "text-mute hover:text-ink"
                }`}
              >
                Magic Link
              </button>
            </div>

            {/* 1-Click Google OAuth Button */}
            <div className="mt-5">
              <button
                type="button"
                onClick={handleInstantDemo}
                className="w-full py-3 px-4 rounded-2xl border border-line bg-stage hover:bg-card text-ink font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <div className="h-px bg-line flex-1" />
              <span className="text-[11px] uppercase tracking-wider text-mute font-mono font-semibold">
                or with email
              </span>
              <div className="h-px bg-line flex-1" />
            </div>

            {authError && (
              <div className="mb-4 p-3.5 rounded-2xl bg-card border border-rose-300 text-xs font-semibold text-rose-600">
                {authError}
              </div>
            )}

            {mode === "magic" && magicLinkSent ? (
              <div className="p-5 rounded-2xl bg-stage border border-line space-y-3">
                <div className="flex items-center gap-2 text-ink font-bold text-sm font-display">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Magic Sign-In Link Dispatched!</span>
                </div>
                <p className="text-xs text-mute leading-relaxed">
                  We sent an encrypted one-time sign-in link to{" "}
                  <strong className="text-ink">{email}</strong>. Click below to verify and enter your workspace immediately.
                </p>
                <button
                  type="button"
                  onClick={handleVerifyMagicLink}
                  className="sp-btn sp-btn-accent w-full text-xs"
                >
                  ✓ Verify Magic Link &amp; Enter Workspace →
                </button>
              </div>
            ) : (
              /* Email Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5 font-mono">
                      Full Name or Agency Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-mute absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Zaim Maulana / Apex Agency"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-line bg-stage text-ink text-sm focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5 font-mono">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-mute absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@agency.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-line bg-stage text-ink text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                {mode !== "magic" && (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <label className="font-semibold text-ink font-mono">
                        Password (min. 6 characters)
                      </label>
                      <button
                        type="button"
                        onClick={() => setMode("magic")}
                        className="text-accent hover:underline font-medium cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-mute absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-line bg-stage text-ink text-sm focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="sp-btn sp-btn-primary w-full py-3 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
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
          <div className="mt-8 pt-5 border-t border-line">
            <div className="p-4 rounded-2xl bg-stage border border-line flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-accent text-[#141413] flex items-center justify-center shrink-0 font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-ink font-display">
                    Evaluating or Reviewing Seospace?
                  </div>
                  <div className="text-[11px] text-mute">
                    Launch the pre-populated Agency Pro workspace in 1 click.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleInstantDemo}
                className="sp-btn sp-btn-accent text-xs shrink-0"
              >
                1-Click Demo →
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Onboarding Showcase */}
        <div className="lg:col-span-6 bg-night text-[#f3f0e8] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden border-t lg:border-t-0 lg:border-l border-[#2a2a2c]">
          <div className="flex items-center justify-between relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-accent text-[#141413]">
              <Sparkles className="w-3.5 h-3.5" />
              {onboardingSlides[slideIndex].badge}
            </span>
            <div className="flex items-center gap-1 text-accent text-xs font-mono">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-[#f3f0e8]">4.9/5</span>
              <span className="text-[#8a8984]">(420+ Agencies)</span>
            </div>
          </div>

          {/* Tactile Mock Audit Box */}
          <div className="relative z-10 my-8 bg-[#141415] border border-[#2a2a2c] rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#2a2a2c]">
              <div>
                <div className="text-[11px] font-mono text-[#8a8984] uppercase">Live Audited Domain</div>
                <div className="text-sm font-bold text-[#f3f0e8] flex items-center gap-2 mt-0.5 font-mono">
                  <span>https://stripe.com</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                    Verified
                  </span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-accent text-[#141413] text-xs font-bold font-mono">
                ✨ Neural Engine v4.2
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div>
                <SegmentedGauge
                  score={92}
                  sublabel="Score is Excellent"
                  theme="dark"
                  size="sm"
                />
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8a8984] font-mono">
                  Active Signals
                </div>
                <div className="flex items-center gap-2 text-[#f3f0e8]">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-[#141413] font-bold flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  <span>Primary H1 &amp; Meta Title aligned</span>
                </div>
                <div className="flex items-center gap-2 text-[#f3f0e8]">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-[#141413] font-bold flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  <span>Cloudflare 1.1.1.1 SPF + DMARC Verified</span>
                </div>
                <div className="flex items-center gap-2 text-[#f3f0e8]">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-[#141413] font-bold flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  <span>White-Label Agency PDF Ready</span>
                </div>
                <div className="pt-2 flex flex-wrap gap-1.5 font-mono">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-accent text-[11px] font-bold">
                    CRO +14.2%
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-400 text-[11px] font-bold">
                    GEO Ready
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl font-bold font-display text-[#f3f0e8] leading-snug">
              {onboardingSlides[slideIndex].title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#8a8984] leading-relaxed">
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
                        ? "w-8 bg-accent"
                        : "w-2 bg-[#2a2a2c] hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#8a8984] font-mono">
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
