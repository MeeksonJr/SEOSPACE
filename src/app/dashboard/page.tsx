"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  QrCode,
  Sparkles,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  Check,
  Copy,
  ChevronDown,
  Building2,
  Sliders,
  Code2,
  Plus,
  X,
} from "lucide-react";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { Workspace, ReviewItem, PrivateFeedback } from "@/types/trustpulse";

export default function DashboardPage() {
  const workspaces = TrustPulseStore.getWorkspaces();
  const [selectedWsId, setSelectedWsId] = useState<string>(workspaces[0]?.id || "ws-apex-dental");

  const currentWorkspace = workspaces.find((w) => w.id === selectedWsId) || workspaces[0];
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(
    TrustPulseStore.getReviews(currentWorkspace?.id)
  );
  const feedback = TrustPulseStore.getPrivateFeedback(currentWorkspace?.id);

  // Add Review Modal State
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState("");
  const [newAuthorRole, setNewAuthorRole] = useState("Verified Client");
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [newPlatform, setNewPlatform] = useState<"google" | "trustpilot" | "direct">("google");
  const [submittingReview, setSubmittingReview] = useState(false);

  React.useEffect(() => {
    setReviewsList(TrustPulseStore.getReviews(currentWorkspace?.id));
  }, [selectedWsId, currentWorkspace?.id]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthorName || !newReviewText) return;

    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: currentWorkspace?.id,
          authorName: newAuthorName.trim(),
          authorRole: newAuthorRole.trim(),
          rating: newRating,
          reviewText: newReviewText.trim(),
          platform: newPlatform,
          isFeatured: true,
        }),
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviewsList((prev) => [data.review, ...prev]);
        setShowAddReviewModal(false);
        setNewAuthorName("");
        setNewReviewText("");
      }
    } catch (err) {
      console.error("Failed to add review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  // AI Reply Modal State
  const [activeReviewForAI, setActiveReviewForAI] = useState<ReviewItem | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiOptions, setAiOptions] = useState<
    Array<{ type: string; title: string; description: string; content: string }>
  >([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerateAI = async (rev: ReviewItem) => {
    setActiveReviewForAI(rev);
    setAiLoading(true);
    setAiOptions([]);
    try {
      const res = await fetch("/api/reviews/ai-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: rev.id,
          workspaceId: currentWorkspace?.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiOptions(data.options);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const copyReply = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              TrustPulse<span className="text-emerald-500">.ai</span>
            </span>
          </Link>

          {/* Workspace Switcher */}
          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-slate-200">
            <Building2 className="w-4 h-4 text-slate-600" />
            <select
              value={selectedWsId}
              onChange={(e) => setSelectedWsId(e.target.value)}
              className="text-xs font-semibold bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            >
              {workspaces.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={`/r/${currentWorkspace.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <span>Live QR Funnel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/dashboard/agency"
            className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            Agency Hub
          </Link>
        </div>
      </header>

      {/* Sub-header Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 overflow-x-auto">
        <nav className="flex space-x-6 text-xs font-medium">
          <Link
            href="/dashboard"
            className="py-3 border-b-2 border-emerald-600 text-emerald-600 font-bold flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Overview</span>
          </Link>
          <Link
            href="/dashboard/shield"
            className="py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Shielded Feedback</span>
            {feedback.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                {feedback.length}
              </span>
            )}
          </Link>
          <Link
            href="/dashboard/widgets"
            className="py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Widget Studio</span>
          </Link>
          <Link
            href="/dashboard/qr-studio"
            className="py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Printable QR Stand</span>
          </Link>
          <Link
            href="/dashboard/ai-replies"
            className="py-3 border-b-2 border-transparent text-slate-600 hover:text-slate-900 flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>PulseMind™ AI Responder</span>
          </Link>
        </nav>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Workspace Identity Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
              style={{ backgroundColor: currentWorkspace.brandColor }}
            >
              {currentWorkspace.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {currentWorkspace.name}
              </h1>
              <p className="text-xs text-slate-600">
                {currentWorkspace.category} • Funnel Slug:{" "}
                <code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  /r/{currentWorkspace.slug}
                </code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/widgets"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Get Embed Code</span>
            </Link>
            <Link
              href="/dashboard/qr-studio"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-all"
            >
              <QrCode className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Table Card</span>
            </Link>
          </div>
        </div>

        {/* 4 Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Average Rating
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {currentWorkspace.stats.averageRating}
              <span className="text-sm font-semibold text-slate-600 ml-1">/ 5.0</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Top 3% in {currentWorkspace.category}</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Total Reviews
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {currentWorkspace.stats.totalReviews}
            </div>
            <div className="text-[11px] text-slate-600 mt-1">
              Across Google, Trustpilot &amp; Direct
            </div>
          </div>

          {/* Metric 3 (The Shield!) */}
          <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
                Shielded Grievances
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-rose-900">
              {currentWorkspace.stats.shieldedReviews}
            </div>
            <div className="text-[11px] text-rose-700 font-semibold mt-1">
              Caught privately • 0 negative stars on Google
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Positive Google Leads
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {currentWorkspace.stats.positiveRedirects}
            </div>
            <div className="text-[11px] text-indigo-600 font-semibold mt-1">
              Direct one-click 5-star redirects
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Reviews Stream (Left 8 cols) & Shield Feed (Right 4 cols) */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* REVIEWS STREAM */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-base text-slate-900">
                  Aggregated Customer Reviews ({reviewsList.length})
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Streamed live to your embeddable widgets &amp; Wall of Love
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Review</span>
                </button>
                <Link
                  href="/dashboard/ai-replies"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Responder</span>
                </Link>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="p-5 space-y-3 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                        {rev.authorName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{rev.authorName}</span>
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {rev.platform}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600">
                          {rev.authorRole || "Customer"} {rev.authorLocation ? `• ${rev.authorLocation}` : ""}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleGenerateAI(rev)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>AI Reply</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    &ldquo;{rev.reviewText}&rdquo;
                  </p>

                  {rev.aiReply && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>Published Response ({rev.aiReply.type}):</span>
                      </div>
                      <p className="text-slate-600 italic">
                        {rev.aiReply.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* NEGATIVE REVIEW SHIELD INBOX (Right 4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-rose-50/40 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base text-rose-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>Shielded Grievances</span>
                </h2>
                <p className="text-xs text-rose-800 mt-0.5">
                  Private feedback caught before reaching Google
                </p>
              </div>
              <Link
                href="/dashboard/shield"
                className="text-xs font-bold text-rose-700 hover:underline"
              >
                View all ({feedback.length})
              </Link>
            </div>

            <div className="divide-y divide-slate-100 p-2">
              {feedback.slice(0, 3).map((fb) => (
                <div key={fb.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{fb.customerName}</span>
                    <span className="font-mono text-[10px] text-amber-500 font-bold">
                      {"★".repeat(fb.rating)} ({fb.rating} Stars)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    &ldquo;{fb.grievanceText}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-600">{fb.customerEmail}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-semibold text-[10px] uppercase ${
                        fb.status === "resolved"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {fb.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
              <Link
                href="/dashboard/shield"
                className="text-xs font-bold text-slate-700 hover:text-emerald-600"
              >
                Open Full Resolution Inbox ↗
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ADD VERIFIED REVIEW MODAL */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">
                  Add Verified Review
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddReviewModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    placeholder="e.g. Dr. Aris Thorne"
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Role / Subtitle
                  </label>
                  <input
                    type="text"
                    value={newAuthorRole}
                    onChange={(e) => setNewAuthorRole(e.target.value)}
                    placeholder="e.g. Verified Patient"
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Rating (Stars)
                  </label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 font-semibold"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                    <option value={2}>★★☆☆☆ (2 Stars)</option>
                    <option value={1}>★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Platform Source
                  </label>
                  <select
                    value={newPlatform}
                    onChange={(e) =>
                      setNewPlatform(e.target.value as "google" | "trustpilot" | "direct")
                    }
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 font-semibold"
                  >
                    <option value="google">Google Maps</option>
                    <option value="trustpilot">Trustpilot</option>
                    <option value="direct">Direct In-Person</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Customer Review Praise *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Paste or write the customer review..."
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 bg-white p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {submittingReview ? "Saving Review..." : "Add to Live Feeds"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI REPLY MODAL */}
      {activeReviewForAI && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-lg text-slate-900">
                  PulseMind™ AI Review Responder
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveReviewForAI(null)}
                className="text-slate-600 hover:text-slate-800 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Target Review summary */}
            <div className="my-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="font-semibold text-slate-900 mb-1">
                Customer: {activeReviewForAI.authorName} ({"★".repeat(activeReviewForAI.rating)})
              </div>
              <div className="text-slate-600 italic">
                &ldquo;{activeReviewForAI.reviewText}&rdquo;
              </div>
            </div>

            {aiLoading && (
              <div className="py-12 text-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="text-xs text-slate-600">
                  PulseMind™ Neural Engine is analyzing sentiment and generating 3 strategic response angles...
                </p>
              </div>
            )}

            {!aiLoading && aiOptions.length > 0 && (
              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                {aiOptions.map((opt, idx) => (
                  <div
                    key={opt.type}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-slate-900">
                          {opt.title}
                        </span>
                        <p className="text-[11px] text-slate-600">
                          {opt.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyReply(opt.content, idx)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs transition-colors"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Reply</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {opt.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveReviewForAI(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
