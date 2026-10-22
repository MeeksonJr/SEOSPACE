"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Loader2,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import {
  addCapturedLead,
  getWhiteLabelConfig,
  saveAuditReport,
} from "@/lib/storage/workspace-store";
import { OpenSiteNavigatorButton } from "@/components/ui/SiteNavigatorDrawer";
import {
  PublicFooter,
  PublicNavbar,
  usePublicTheme,
} from "@/components/ui/PublicChrome";

function WidgetFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDark, toggleTheme } = usePublicTheme(false);
  const defaultWl = getWhiteLabelConfig();

  const agencyName =
    searchParams.get("agency") || defaultWl.agencyName || "Apex Digital Growth";
  const primaryColor =
    searchParams.get("color") || defaultWl.primaryColor || "#2563EB";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleWidgetSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!websiteUrl.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: websiteUrl }),
      });
      const data = await res.json();

      const score = data?.report?.overallScore || 78;
      addCapturedLead({
        name: name.trim() || "Website Visitor",
        email: email.trim() || "prospect@company.com",
        websiteUrl: websiteUrl.trim(),
        auditScore: score,
      });

      if (data?.report) {
        saveAuditReport(data.report);
        router.push(`/report/${data.report.id}`);
      } else {
        router.push("/report/stripe-com");
      }
    } catch {
      router.push("/report/stripe-com");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark
          ? "bg-[#050814] text-white bg-seospace-dark-grid"
          : "bg-slate-50 text-slate-900 bg-seospace-grid"
      }`}
    >
      <PublicNavbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        badgeText="Embeddable Agency Lead-Gen Widget"
      />

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 py-16">
        <div
          className={`w-full max-w-xl rounded-3xl border p-6 sm:p-10 shadow-xl transition ${
            isDark
              ? "bg-[#0B1022] border-slate-800 text-white"
              : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <span
              style={{
                backgroundColor: `${primaryColor}20`,
                color: primaryColor,
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" /> Free 60-Second Website Audit
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">
                {agencyName}
              </span>
              <OpenSiteNavigatorButton
                variant={isDark ? "dark" : "light"}
                label="All Pages"
              />
            </div>
          </div>

          <h1
            className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-slate-950"
            }`}
          >
            Get Your Free AI SEO, CRO &amp; Search Readiness Score
          </h1>
          <p
            className={`mt-2 text-xs sm:text-sm leading-relaxed ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Enter your website URL below to receive an instant 35-point
            diagnostic report with custom AI copywriting &amp; ranking fixes
            prepared by <strong>{agencyName}</strong>.
          </p>

          <form onSubmit={handleWidgetSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-xs font-bold mb-1.5 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Your Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-blue-600 ${
                      isDark
                        ? "bg-slate-950 border-slate-800 text-white"
                        : "bg-white border-slate-200 text-slate-900"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-xs font-bold mb-1.5 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Work Email (For PDF Copy)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-blue-600 ${
                      isDark
                        ? "bg-slate-950 border-slate-800 text-white"
                        : "bg-white border-slate-200 text-slate-900"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                className={`block text-xs font-bold mb-1.5 ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Website URL to Audit
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourcompany.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-blue-600 ${
                    isDark
                      ? "bg-slate-950 border-slate-800 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: primaryColor }}
              className="w-full py-3.5 px-6 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Branded Audit Report...</span>
                </>
              ) : (
                <>
                  <span>Generate My Free Audit Report</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div
            className={`mt-5 pt-4 border-t flex items-center justify-between text-[11px] ${
              isDark
                ? "border-slate-800 text-slate-400"
                : "border-slate-100 text-slate-400"
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Free
              • Instant Results
            </span>
            <Link
              href="/dashboard?tab=widget"
              className="text-blue-500 font-semibold hover:underline"
            >
              Configure Widget in Dashboard →
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}

export default function WidgetPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs text-slate-400">
          Loading Audit Widget...
        </div>
      }
    >
      <WidgetFormContent />
    </Suspense>
  );
}
