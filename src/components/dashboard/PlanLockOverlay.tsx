"use client";

import React from "react";
import { Lock, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { PRICING_PLANS } from "@/lib/stripe/plans";

interface PlanLockOverlayProps {
  requiredPlan: "pro" | "agency";
  featureTitle: string;
  featureDescription: string;
  bulletPoints?: string[];
  onOpenUpgradeModal?: () => void;
}

export function PlanLockOverlay({
  requiredPlan,
  featureTitle,
  featureDescription,
  bulletPoints = [],
  onOpenUpgradeModal,
}: PlanLockOverlayProps) {
  const plan =
    PRICING_PLANS.find((p) => p.id === requiredPlan) ||
    (requiredPlan === "agency" ? PRICING_PLANS[2] : PRICING_PLANS[1]);

  return (
    <div className="relative rounded-3xl border-2 border-line bg-card/95 backdrop-blur-md p-8 sm:p-12 text-center text-ink max-w-2xl mx-auto my-8 sp-card-shadow overflow-hidden">
      {/* Decorative accent glow */}
      <div
        className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${
          requiredPlan === "agency" ? "bg-accent" : "bg-cobalt"
        }`}
      />

      <div className="relative z-10 max-w-lg mx-auto space-y-4">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stage border border-line text-xs font-mono font-bold">
          <Lock className="w-3.5 h-3.5 text-accent" />
          <span className="uppercase text-ink">
            {requiredPlan === "agency"
              ? `Agency Feature ($${plan.monthlyPrice}/mo)`
              : `Professional Feature ($${plan.monthlyPrice}/mo)`}
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-ink font-display tracking-tight">
          {featureTitle}
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-mute leading-relaxed">
          {featureDescription}
        </p>

        {/* Feature bullets */}
        {bulletPoints.length > 0 && (
          <div className="pt-2 pb-1 space-y-2 text-left max-w-md mx-auto">
            {bulletPoints.map((bp, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-ink">
                <Sparkles className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                <span>{bp}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={plan.monthlyPaymentLink}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-accent text-[#141413] font-bold text-xs inline-flex items-center justify-center gap-2 hover:opacity-90 transition shadow-xs cursor-pointer"
          >
            <span>Upgrade to {plan.name} (${plan.monthlyPrice}/mo)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          {onOpenUpgradeModal && (
            <button
              type="button"
              onClick={onOpenUpgradeModal}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-stage border border-line hover:bg-card text-ink font-semibold text-xs transition cursor-pointer"
            >
              Compare All Plans
            </button>
          )}
        </div>

        <div className="pt-3 text-[11px] text-mute flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Instant activation via Stripe • Cancel or pause anytime</span>
        </div>
      </div>
    </div>
  );
}
