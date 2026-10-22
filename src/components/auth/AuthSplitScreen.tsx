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
  ShieldCheck,
  Star,
  Building2,
  QrCode,
  Code2,
} from "lucide-react";
import { TrustPulseLogo } from "@/components/ui/TrustPulseLogo";
import { OpenSiteNavigatorButton } from "@/components/ui/SiteNavigatorDrawer";
import { usePublicTheme, ThemeToggleButton } from "@/components/ui/PublicChrome";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import { saveWorkspaceUser } from "@/lib/storage/workspace-store";

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
      badge: "Negative Review Shield Funnel",
      title: "Intercept 1-Star Google Reviews Before They Go Public",
      subtitle:
        "Smart QR gatekeeper routes happy 4-5★ clients to Google Maps, while capturing grievances privately for direct resolution.",
      icon: ShieldCheck,
    },
    {
      badge: "Live Social Proof Studio",
      title: "1-Line Embeddable Wall of Love & Toast Widgets",
      subtitle:
        "Universal pure JavaScript script tag works on Webflow, WordPress, Shopify, and HTML with zero npm dependencies.",
      icon: Code2,
    },
    {
      badge: "Agency White-Label Suite",
      title: "Manage Unlimited Clients & Export Monthly PDF Reports",
      subtitle:
        "Bill local dentists, clinics, and service businesses $149/mo each for reputation management with $0/mo software overhead.",
      icon: Building2,
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
        // Fallback
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

      const supabase = getBrowserSupabaseClient();
      if (supabase) {
        await supabase.auth
          .signInWithPassword({
            email: cleanEmail,
            password: password.trim(),
          })
          .catch(() => {});
      }

      saveWorkspaceUser({
        id: data?.user?.id || `usr-${Date.now()}`,
        name: name.trim() || cleanEmail.split("@")[0],
        email: cleanEmail,
        plan: selectedPlan,
        creditsUsed: 1,
        creditsLimit: 999,
        joined: new Date().toISOString(),
      });

      router.push("/dashboard");
    } catch {
      handleInstantDemo();
    } finally {
      setLoading(false);
    }
  }

  function handleInstantDemo() {
    saveWorkspaceUser({
      id: "usr-demo-agency",
      name: "Agency Partner Demo",
      email: "demo@trustpulse.ai",
      plan: "agency",
      creditsUsed: 2,
      creditsLimit: 999,
      joined: new Date().toISOString(),
    });
    router.push("/dashboard");
  }

  return (
    <div className="sp-page min-h-screen bg-[var(--sp-paper)] text-[var(--sp-ink)] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-6xl bg-[var(--sp-card)] rounded-[32px] border border-[var(--sp-line)] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[700px]">
        {/* LEFT COLUMN: Login / Signup Form */}
        <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link href="/">
                <TrustPulseLogo auto size="md" />
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggleButton isDark={isDark} onToggle={toggleTheme} size="sm" />
                <OpenSiteNavigatorButton variant="dark" label="All Pages" />
                <Link
                  href="/"
                  className="text-xs font-semibold text-[var(--sp-mute)] hover:text-[var(--sp-ink)] transition"
                >
                  ← Home
                </Link>
              </div>
            </div>

            <div className="mt-8">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600">
                {mode === "login"
                  ? "Client & Agency Portal"
                  : mode === "signup"
                  ? "Start Agency Workspace"
                  : "Passwordless Sign-In"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--sp-ink)] mt-1">
                {mode === "login"
                  ? "Welcome back to TrustPulse"
                  : mode === "signup"
                  ? "Create your growth workspace"
                  : "Sign in with Magic Link"}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-[var(--sp-mute)] leading-relaxed">
                {mode === "login"
                  ? "Access your negative review shield inbox, live widget studio, and client accounts."
                  : "Launch your automated reputation funnel and manage client locations with $0/mo software cost."}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="mt-6 grid grid-cols-3 gap-1 p-1 rounded-2xl bg-[var(--sp-stage)] border border-[var(--sp-line)] text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setMagicLinkSent(false);
                  setAuthError("");
                }}
                className={`py-2 rounded-xl transition cursor-pointer ${
                  mode === "login"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-[var(--sp-mute)] hover:text-[var(--sp-ink)]"
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
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-[var(--sp-mute)] hover:text-[var(--sp-ink)]"
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("magic");
                  setAuthError("");
                }}
                className={`py-2 rounded-xl transition cursor-pointer ${
                  mode === "magic"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-[var(--sp-mute)] hover:text-[var(--sp-ink)]"
                }`}
              >
                Magic Link
              </button>
            </div>

            {/* Instant Demo Access Button */}
            <div className="mt-5">
              <button
                type="button"
                onClick={handleInstantDemo}
                className="w-full py-3 px-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>1-Click Instant Demo Access (No Password Needed)</span>
              </button>
            </div>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px bg-[var(--sp-line)] flex-1" />
              <span className="text-[11px] uppercase tracking-wider text-[var(--sp-mute)] font-mono font-semibold">
                or with email
              </span>
              <div className="h-px bg-[var(--sp-line)] flex-1" />
            </div>

            {authError && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                {authError}
              </div>
            )}

            {mode === "magic" && magicLinkSent ? (
              <div className="p-5 rounded-2xl bg-[var(--sp-stage)] border border-[var(--sp-line)] space-y-3">
                <div className="flex items-center gap-2 text-[var(--sp-ink)] font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Magic Link Sent!</span>
                </div>
                <p className="text-xs text-[var(--sp-mute)] leading-relaxed">
                  We sent a sign-in link to <strong className="text-[var(--sp-ink)]">{email}</strong>. Or click below to enter directly:
                </p>
                <button
                  type="button"
                  onClick={handleInstantDemo}
                  className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                >
                  Enter Workspace Directly →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label className="block text-xs font-semibold text-[var(--sp-mute)] uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dr. Jordan Hayes"
                        className="w-full text-xs border border-[var(--sp-line)] bg-[var(--sp-stage)]/40 rounded-xl pl-9 pr-3 py-2.5 text-[var(--sp-ink)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[var(--sp-mute)] uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jordan@apexdental.com"
                      className="w-full text-xs border border-[var(--sp-line)] bg-[var(--sp-stage)]/40 rounded-xl pl-9 pr-3 py-2.5 text-[var(--sp-ink)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {mode !== "magic" && (
                  <div>
                    <label className="block text-xs font-semibold text-[var(--sp-mute)] uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs border border-[var(--sp-line)] bg-[var(--sp-stage)]/40 rounded-xl pl-9 pr-3 py-2.5 text-[var(--sp-ink)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>
                    {loading
                      ? "Authenticating..."
                      : mode === "login"
                      ? "Sign In to Workspace"
                      : mode === "signup"
                      ? "Launch My Workspace"
                      : "Send Magic Link"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          <div className="pt-6 border-t border-[var(--sp-line)] text-center text-xs text-[var(--sp-mute)]">
            By signing in, you agree to our{" "}
            <Link href="/legal/terms" className="underline hover:text-emerald-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="underline hover:text-emerald-600">
              Privacy Policy
            </Link>
            .
          </div>
        </div>

        {/* RIGHT COLUMN: Feature Highlights Carousel */}
        <div className="lg:col-span-6 bg-slate-900 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                Autonomous Reputation Suite
              </span>
              <div className="flex text-amber-400 gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
            </div>

            {/* Slide */}
            <div className="space-y-4 min-h-[160px] animate-fade-in">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono">
                <span>{onboardingSlides[slideIndex].badge}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                {onboardingSlides[slideIndex].title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                {onboardingSlides[slideIndex].subtitle}
              </p>
            </div>

            {/* Slide Selector Indicators */}
            <div className="flex items-center gap-2 pt-4">
              {onboardingSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    slideIndex === idx ? "w-8 bg-emerald-400" : "w-2 bg-slate-700"
                  }`}
                />
              ))}
            </div>

            {/* Live Interactive Funnel Mini Card */}
            <div className="mt-8 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">
                  Live Gatekeeper Logic
                </span>
                <span className="text-emerald-400 font-mono text-[10px]">
                  ✓ Verified Active
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-200">
                  <div className="font-bold">4 or 5 Stars ⭐</div>
                  <div className="text-[10px] text-emerald-300/80 mt-0.5">
                    → Instant Google Maps redirect
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-200">
                  <div className="font-bold">1, 2 or 3 Stars ⚠️</div>
                  <div className="text-[10px] text-rose-300/80 mt-0.5">
                    → Private Shield resolution
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>© {new Date().getFullYear()} TrustPulse AI</span>
            <span>$0/mo Fixed Infrastructure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
