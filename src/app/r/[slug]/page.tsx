"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  ArrowRight,
  Copy,
  Check,
  MessageSquareWarning,
  Sparkles,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { Workspace } from "@/types/trustpulse";

export default function ReviewFunnelPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "apex-dental";

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Positive flow state
  const [positiveComment, setPositiveComment] = useState("");
  const [copied, setCopied] = useState(false);

  // Private feedback (Shield) state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [grievanceText, setGrievanceText] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    // 1. Try local TrustPulse store first (immediate)
    const local = TrustPulseStore.getWorkspaceBySlug(slug);
    if (local) {
      setWorkspace(local);
      setLoading(false);
    }

    // 2. Query API to ensure server-persisted workspaces are fresh
    fetch(`/api/workspaces?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.workspace) {
          setWorkspace(data.workspace);
        } else if (!local) {
          // Graceful fallback for arbitrary unseeded slugs
          const formattedName = slug
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          setWorkspace({
            id: `ws-${slug}`,
            name: formattedName,
            slug: slug,
            category: "Local Business",
            brandColor: "#10b981",
            googleReviewUrl: "https://maps.google.com",
            starThreshold: 4,
            customHeadline: `How was your visit to ${formattedName}?`,
            customSubheadline: "Please take 10 seconds to share your authentic feedback with our team.",
            createdAt: new Date().toISOString(),
            stats: {
              averageRating: 5.0,
              totalReviews: 12,
              shieldedReviews: 0,
              positiveRedirects: 12,
            },
          });
        }
      })
      .catch(() => {
        if (!local) {
          const formattedName = slug
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          setWorkspace({
            id: `ws-${slug}`,
            name: formattedName,
            slug: slug,
            category: "Local Business",
            brandColor: "#10b981",
            googleReviewUrl: "https://maps.google.com",
            starThreshold: 4,
            customHeadline: "How was your experience today?",
            customSubheadline: "Please take 10 seconds to share your authentic feedback with our team.",
            createdAt: new Date().toISOString(),
            stats: {
              averageRating: 5.0,
              totalReviews: 12,
              shieldedReviews: 0,
              positiveRedirects: 12,
            },
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleCopyAndRedirect = () => {
    if (positiveComment) {
      navigator.clipboard.writeText(positiveComment);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
    setTimeout(() => {
      window.open(workspace?.googleReviewUrl || "https://maps.google.com", "_blank");
    }, 450);
  };

  const handlePrivateFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !grievanceText) return;

    setSubmittingFeedback(true);
    try {
      await fetch("/api/shield/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: workspace?.id,
          rating: selectedRating,
          customerName,
          customerEmail,
          customerPhone,
          grievanceText,
        }),
      });

      // Also register in local client store for instant multi-tab visibility
      TrustPulseStore.addPrivateFeedback({
        workspaceId: workspace?.id || "ws-apex-dental",
        rating: Number(selectedRating) || 2,
        customerName,
        customerEmail,
        customerPhone,
        grievanceText,
        status: "new",
      });

      setFeedbackSubmitted(true);
    } catch (err) {
      console.error(err);
      setFeedbackSubmitted(true);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading || !workspace) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-emerald-600"></div>
          <span className="text-xs font-mono font-medium text-slate-500">
            Loading Review Gatekeeper...
          </span>
        </div>
      </div>
    );
  }

  const isPositive = selectedRating !== null && selectedRating >= workspace.starThreshold;
  const isNegative = selectedRating !== null && selectedRating < workspace.starThreshold;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200/80 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Brand Badge Card */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden transition-all">
        {/* Top Accent Strip */}
        <div
          className="h-2.5 w-full transition-colors"
          style={{ backgroundColor: workspace.brandColor || "#10b981" }}
        />

        <div className="p-6 sm:p-8">
          {/* Business Info Header */}
          <div className="text-center mb-6">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-3.5 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg ring-4 ring-white"
              style={{ backgroundColor: workspace.brandColor || "#10b981" }}
            >
              {workspace.name.charAt(0)}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {workspace.name}
            </h1>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
              {workspace.category}
            </p>
          </div>

          {/* INITIAL RATING SELECTOR */}
          {selectedRating === null && (
            <div className="text-center py-2 animate-fade-in">
              <h2 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                {workspace.customHeadline || "How was your experience today?"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-xs mx-auto leading-relaxed">
                {workspace.customSubheadline || "Tap a star to share your feedback with our team:"}
              </p>

              {/* 5 Big Touch Stars */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 py-3">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || 0) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setSelectedRating(star)}
                      className="p-1 sm:p-2 rounded-2xl transition-all duration-150 transform hover:scale-125 focus:outline-none cursor-pointer"
                      aria-label={`Rate ${star} out of 5 stars`}
                    >
                      <Star
                        className={`w-10 h-10 sm:w-12 sm:h-12 transition-all ${
                          active
                            ? "fill-amber-400 text-amber-500 drop-shadow-md scale-105"
                            : "text-slate-200 fill-slate-100 hover:text-amber-200 hover:fill-amber-50"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Fast Feedback • Takes 15 Seconds</span>
              </div>
            </div>
          )}

          {/* POSITIVE FLOW (4 or 5 Stars -> Direct Google Redirect) */}
          {isPositive && (
            <div className="text-center py-2 animate-fade-in space-y-4">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl border border-amber-200/60 flex items-center justify-center mx-auto shadow-sm">
                <div className="flex text-amber-400">
                  {Array.from({ length: selectedRating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  We are thrilled you had a 5-star visit! 🎉
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Thank you for giving us a {selectedRating}-star rating! Would you take 15 seconds to share your experience on Google? It helps other local patients find us.
                </p>
              </div>

              <div className="text-left bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  What did you like most? (Optional)
                </label>
                <textarea
                  value={positiveComment}
                  onChange={(e) => setPositiveComment(e.target.value)}
                  placeholder="e.g. Clean modern office, friendly reception, gentle staff, on time..."
                  rows={3}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 bg-white p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 placeholder-slate-400 resize-none shadow-xs"
                />
                <span className="text-[11px] text-slate-500 block mt-1">
                  We&apos;ll copy this so you can paste it directly onto Google Maps with 1 click.
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyAndRedirect}
                className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 hover:opacity-95 transform active:scale-[0.98] cursor-pointer"
                style={{ backgroundColor: workspace.brandColor || "#10b981" }}
              >
                {positiveComment ? (
                  <>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "Copied! Opening Google..." : "Copy Review & Post on Google"}</span>
                  </>
                ) : (
                  <>
                    <span>Share Rating on Google Maps</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRating(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  ← Change rating
                </button>
              </div>
            </div>
          )}

          {/* NEGATIVE FLOW (1, 2, or 3 Stars -> The Negative Review Shield!) */}
          {isNegative && !feedbackSubmitted && (
            <div className="py-2 animate-fade-in space-y-4">
              <div className="flex items-start gap-3 p-3.5 bg-rose-50/90 border border-rose-200 rounded-2xl">
                <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0 mt-0.5">
                  <MessageSquareWarning className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-rose-950">
                    We are so sorry we let you down.
                  </h3>
                  <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                    Your feedback goes directly to our practice director so we can immediately make this right.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePrivateFeedbackSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-800 placeholder-slate-400 shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-800 placeholder-slate-400 shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-800 placeholder-slate-400 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    What went wrong and how can we make it right? *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={grievanceText}
                    onChange={(e) => setGrievanceText(e.target.value)}
                    placeholder="Please explain what happened during your visit..."
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 bg-white p-3.5 focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-800 placeholder-slate-400 resize-none shadow-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <HeartHandshake className="w-4 h-4 text-rose-400" />
                  <span>
                    {submittingFeedback ? "Delivering Privately..." : "Send Private Feedback to Leadership"}
                  </span>
                </button>
              </form>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setSelectedRating(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  ← Change rating
                </button>
              </div>
            </div>
          )}

          {/* NEGATIVE FLOW SUBMITTED STATE */}
          {isNegative && feedbackSubmitted && (
            <div className="text-center py-6 animate-fade-in space-y-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Thank You for Your Candor
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-xs mx-auto">
                  Your private grievance has been dispatched directly to the leadership of {workspace.name}. We will review the details and reach out to you within 24 hours to resolve this.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Confidential: Stored privately, never published on Google.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="bg-slate-50 border-t border-slate-100 py-3.5 px-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <span>Protected by</span>
          <Link href="/" className="font-bold text-slate-800 hover:text-emerald-600 transition-colors">
            TrustPulse AI
          </Link>
          <span>• Negative Review Shield</span>
        </div>
      </div>
    </div>
  );
}
