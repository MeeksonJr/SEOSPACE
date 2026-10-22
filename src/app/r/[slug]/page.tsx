"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Star, ShieldCheck, CheckCircle2, HeartHandshake, ArrowRight, Copy, Check, MessageSquareWarning } from "lucide-react";
import Link from "next/link";

interface WorkspaceData {
  id: string;
  name: string;
  slug: string;
  category: string;
  brandColor: string;
  googleReviewUrl: string;
  starThreshold: number;
  customHeadline?: string;
  customSubheadline?: string;
}

export default function ReviewFunnelPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "apex-dental";

  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
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
    // In demo / SSR fallback, use default data
    const defaultData: Record<string, WorkspaceData> = {
      "apex-dental": {
        id: "ws-apex-dental",
        name: "Apex Cosmetic Dentistry & Orthodontics",
        slug: "apex-dental",
        category: "Dental & Healthcare",
        brandColor: "#059669",
        googleReviewUrl: "https://maps.google.com/?cid=108392109312019",
        starThreshold: 4,
        customHeadline: "How was your dental visit today?",
        customSubheadline: "Dr. Thorne & the clinic team value your candid feedback.",
      },
      "bayview-auto": {
        id: "ws-bayview-auto",
        name: "Bayview Precision German Auto Repair",
        slug: "bayview-auto",
        category: "Automotive Services",
        brandColor: "#2563eb",
        googleReviewUrl: "https://maps.google.com/?cid=9842103912301",
        starThreshold: 4,
        customHeadline: "How did we do servicing your vehicle?",
        customSubheadline: "Your feedback helps our master technicians maintain top standards.",
      },
    };

    const found = defaultData[slug] || {
      id: `ws-${slug}`,
      name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      slug,
      category: "Local Business",
      brandColor: "#059669",
      googleReviewUrl: "https://maps.google.com",
      starThreshold: 4,
      customHeadline: "How was your experience today?",
      customSubheadline: "Please take 10 seconds to share your feedback.",
    };

    setWorkspace(found);
    setLoading(false);
  }, [slug]);

  const handleCopyAndRedirect = () => {
    if (positiveComment) {
      navigator.clipboard.writeText(positiveComment);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
    setTimeout(() => {
      window.open(workspace?.googleReviewUrl || "https://maps.google.com", "_blank");
    }, 400);
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
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] text-slate-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const isPositive = selectedRating !== null && selectedRating >= workspace.starThreshold;
  const isNegative = selectedRating !== null && selectedRating < workspace.starThreshold;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      {/* Brand Badge */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Top Header bar with custom brand color */}
        <div
          className="h-3 w-full"
          style={{ backgroundColor: workspace.brandColor }}
        />

        <div className="p-6 sm:p-8">
          {/* Business Info */}
          <div className="text-center mb-6">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl shadow-md"
              style={{ backgroundColor: workspace.brandColor }}
            >
              {workspace.name.charAt(0)}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {workspace.name}
            </h1>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mt-1">
              {workspace.category}
            </p>
          </div>

          {/* INITIAL RATING SELECTOR */}
          {selectedRating === null && (
            <div className="text-center py-4">
              <h2 className="text-lg font-semibold text-slate-800 mb-2">
                {workspace.customHeadline || "How was your experience today?"}
              </h2>
              <p className="text-sm text-slate-500 mb-8 max-w-xs mx-auto">
                {workspace.customSubheadline || "Tap a star to rate your visit:"}
              </p>

              {/* 5 Big Touch Stars */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 py-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || 0) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setSelectedRating(star)}
                      className="p-1 sm:p-2 rounded-xl transition-all duration-150 transform hover:scale-125 focus:outline-none"
                      aria-label={`Rate ${star} star`}
                    >
                      <Star
                        className={`w-9 h-9 sm:w-11 sm:h-11 transition-colors ${
                          active
                            ? "fill-amber-400 text-amber-400 drop-shadow"
                            : "text-slate-300 fill-slate-100"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Feedback Funnel</span>
              </div>
            </div>
          )}

          {/* POSITIVE FLOW (4 or 5 Stars -> Google Redirect) */}
          {isPositive && (
            <div className="text-center py-2 animate-fade-in">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="flex text-amber-400">
                  {Array.from({ length: selectedRating || 5 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" />
                  ))}
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-2">
                We are so thrilled! 🎉
              </h2>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Thank you for giving us a {selectedRating}-star rating! Would you take 10 seconds to share this on Google? It means the world to our small team.
              </p>

              <div className="text-left mb-4">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  What did you like most? (Optional)
                </label>
                <textarea
                  value={positiveComment}
                  onChange={(e) => setPositiveComment(e.target.value)}
                  placeholder="e.g. Dr. Thorne was gentle, fast, and the clinic was immaculate..."
                  rows={3}
                  className="w-full text-sm rounded-xl border border-slate-200 p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 placeholder-slate-400 resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleCopyAndRedirect}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-white shadow-lg transition-all flex items-center justify-center gap-2 hover:opacity-95 transform active:scale-[0.98]"
                style={{ backgroundColor: workspace.brandColor }}
              >
                {positiveComment ? (
                  <>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? "Copied! Opening Google..." : "Copy & Post on Google"}</span>
                  </>
                ) : (
                  <>
                    <span>Share Review on Google</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedRating(null)}
                className="mt-4 text-xs text-slate-600 hover:text-slate-800 underline"
              >
                Change rating
              </button>
            </div>
          )}

          {/* NEGATIVE FLOW (1, 2, or 3 Stars -> The Negative Review Shield!) */}
          {isNegative && !feedbackSubmitted && (
            <div className="py-2 animate-fade-in">
              <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-200/80 rounded-2xl mb-5">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
                  <MessageSquareWarning className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-rose-900">
                    We are so sorry we let you down.
                  </h3>
                  <p className="text-xs text-rose-800">
                    Your candid feedback goes directly to our owner/director.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePrivateFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    What went wrong and how can we make it right? *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={grievanceText}
                    onChange={(e) => setGrievanceText(e.target.value)}
                    placeholder="Please explain what happened during your visit..."
                    className="w-full text-sm rounded-xl border border-slate-200 p-3 focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-800 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <HeartHandshake className="w-4 h-4 text-rose-400" />
                  <span>
                    {submittingFeedback ? "Delivering Privately..." : "Send Private Feedback to Leadership"}
                  </span>
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setSelectedRating(null)}
                  className="text-xs text-slate-600 hover:text-slate-800 underline"
                >
                  Change rating
                </button>
              </div>
            </div>
          )}

          {/* NEGATIVE FLOW SUBMITTED STATE */}
          {isNegative && feedbackSubmitted && (
            <div className="text-center py-6 animate-fade-in">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Thank You for Your Honesty
              </h2>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-xs mx-auto">
                Your private grievance has been dispatched directly to the director of {workspace.name}. We will review the details and reach out to you within 24–48 hours to make this right.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                Privacy Shield Active: This feedback is stored privately and was not published publicly.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 py-3 px-6 text-center text-xs text-slate-600 flex items-center justify-center gap-1.5">
          <span>Powered by</span>
          <Link href="/" className="font-semibold text-slate-700 hover:text-emerald-600">
            TrustPulse AI
          </Link>
        </div>
      </div>
    </div>
  );
}
