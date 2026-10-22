"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  ArrowLeft,
  Copy,
  Check,
  Star,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { ReviewItem, AIReplyOption } from "@/types/trustpulse";

export default function AIReplyStudioPage() {
  const workspaces = TrustPulseStore.getWorkspaces();
  const [selectedWsId, setSelectedWsId] = useState<string>("ws-apex-dental");
  const ws = workspaces.find((w) => w.id === selectedWsId) || workspaces[0];

  const reviews = TrustPulseStore.getReviews(ws.id);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(reviews[0] || null);

  const [loadingAI, setLoadingAI] = useState(false);
  const [options, setOptions] = useState<AIReplyOption[]>([]);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const generateReplies = async (review: ReviewItem) => {
    setSelectedReview(review);
    setLoadingAI(true);
    setOptions([]);
    try {
      const res = await fetch("/api/reviews/ai-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: review.id,
          workspaceId: ws.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOptions(data.options);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  const copyReply = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>PulseMind™ AI Review Responder</span>
              <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                SEO &amp; Sentiment
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Generate 3 strategic reply angles (SEO Local, Empathy, Loyalty) for any customer review
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedWsId}
            onChange={(e) => {
              setSelectedWsId(e.target.value);
              const targetReviews = TrustPulseStore.getReviews(e.target.value);
              setSelectedReview(targetReviews[0] || null);
              setOptions([]);
            }}
            className="text-xs font-semibold bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none text-slate-800"
          >
            {workspaces.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Studio Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Review Selector List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Incoming Review ({reviews.length})
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
            {reviews.map((r) => {
              const isSelected = selectedReview?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => generateReplies(r)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-emerald-50/60 border-l-4 border-emerald-600"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-slate-900">
                      {r.authorName}
                    </span>
                    <div className="flex text-amber-400">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    &ldquo;{r.reviewText}&rdquo;
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="uppercase font-semibold">{r.platform}</span>
                    <span className="text-emerald-700 font-semibold">
                      {isSelected ? "Active Review" : "Click to Generate"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Generation Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedReview && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400">
                    Target Review
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">
                    {selectedReview.authorName} ({selectedReview.authorRole || "Client"})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => generateReplies(selectedReview)}
                  disabled={loadingAI}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingAI ? "animate-spin" : ""}`} />
                  <span>{loadingAI ? "Synthesizing..." : "Regenerate AI Replies"}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                &ldquo;{selectedReview.reviewText}&rdquo;
              </div>

              {loadingAI && (
                <div className="py-12 text-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto" />
                  <p className="text-xs text-slate-500">
                    PulseMind™ Neural Engine is extracting sentiment and generating SEO-rich responses...
                  </p>
                </div>
              )}

              {!loadingAI && options.length === 0 && (
                <div className="py-10 text-center space-y-3">
                  <Bot className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Click &ldquo;Regenerate AI Replies&rdquo; to create 3 ready-to-copy responses optimized for Google My Business and customer retention.
                  </p>
                </div>
              )}

              {!loadingAI && options.length > 0 && (
                <div className="space-y-4 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    3 AI Strategic Reply Drafts:
                  </span>

                  {options.map((opt) => (
                    <div
                      key={opt.type}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-all space-y-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-sm text-slate-900">
                            {opt.title}
                          </span>
                          <p className="text-[11px] text-slate-500">
                            {opt.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyReply(opt.content, opt.type)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors"
                        >
                          {copiedType === opt.type ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy to Clipboard</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800 leading-relaxed font-sans">
                        {opt.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
