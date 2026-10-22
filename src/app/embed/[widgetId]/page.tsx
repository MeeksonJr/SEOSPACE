"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Star, CheckCircle, ShieldCheck } from "lucide-react";
import { ReviewItem, WidgetConfig } from "@/types/trustpulse";

export default function EmbedWidgetPage() {
  const params = useParams();
  const widgetId = (params?.widgetId as string) || "widget-apex-wall";

  const [widget, setWidget] = useState<WidgetConfig | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/widget/${widgetId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWidget(data.widget);
          setReviews(data.reviews || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [widgetId]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center font-sans">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const isDark = widget?.theme === "dark";

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 font-sans ${
        isDark ? "bg-[#0f172a] text-slate-100" : "bg-white text-slate-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Wall of Love Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/50">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span>{widget?.title || "Customer Reviews"}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Authentic customer testimonials from verified appointments
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Powered by</span>
            <span className="font-semibold text-emerald-600">TrustPulse</span>
          </div>
        </div>

        {/* Masonry / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isDark
                  ? "bg-slate-800/80 border-slate-700 hover:border-slate-600"
                  : "bg-slate-50/80 border-slate-200/90 hover:border-slate-300 hover:shadow-md"
              }`}
            >
              <div>
                {/* Stars & Platform */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isDark
                        ? "bg-slate-700 text-slate-300"
                        : "bg-slate-200/80 text-slate-600"
                    }`}
                  >
                    {rev.platform}
                  </span>
                </div>

                {/* Body Text */}
                <p
                  className={`text-sm leading-relaxed mb-4 ${
                    isDark ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  &ldquo;{rev.reviewText}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-200/40">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
                  style={{
                    backgroundColor: widget?.customAccentColor || "#059669",
                  }}
                >
                  {rev.authorName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold truncate flex items-center gap-1">
                    <span>{rev.authorName}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  </div>
                  <div className="text-[11px] text-slate-600 truncate">
                    {rev.authorRole || "Verified Client"} {rev.authorLocation ? `• ${rev.authorLocation}` : ""}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
