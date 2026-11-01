"use client";

import React from "react";
import { Lock, Sparkles, X, Check, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { PRICING_PLANS } from "@/lib/stripe/plans";

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: "starter" | "pro" | "agency";
  creditsUsed?: number;
  creditsLimit?: number;
  reason?: "audit_limit" | "feature_locked";
  lockedFeatureName?: string;
  targetPlan?: "pro" | "agency";
}

export function PlanUpgradeModal({
  isOpen,
  onClose,
  currentPlan = "starter",
  creditsUsed = 3,
  creditsLimit = 3,
  reason = "audit_limit",
  lockedFeatureName,
  targetPlan = "pro",
}: PlanUpgradeModalProps) {
  if (!isOpen) return null;

  const proPlan = PRICING_PLANS.find((p) => p.id === "pro") || PRICING_PLANS[1];
  const agencyPlan = PRICING_PLANS.find((p) => p.id === "agency") || PRICING_PLANS[2];

  const isQuotaReached = reason === "audit_limit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-card border-2 border-line rounded-3xl sp-card-shadow p-6 sm:p-8 text-ink overflow-hidden max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-full bg-stage border border-line text-mute hover:text-ink hover:bg-card transition cursor-pointer"
          aria-label="Close upgrade modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent border border-accent/25 text-xs font-mono font-bold mb-3">
            {isQuotaReached ? (
              <>
                <Zap className="w-3.5 h-3.5 fill-accent" />
                <span>MONTHLY AUDIT LIMIT REACHED</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>UPGRADE TO UNLOCK FEATURE</span>
              </>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink font-display tracking-tight">
            {isQuotaReached
              ? `You've used all ${creditsLimit} of ${creditsLimit} audits this month`
              : `Unlock ${lockedFeatureName || "Advanced Agency Features"}`}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-mute leading-relaxed">
            {isQuotaReached
              ? `Your current ${currentPlan.toUpperCase()} plan is limited to ${creditsLimit} audits per month. Upgrade today to continue auditing websites and generating client reports.`
              : `This tool is reserved for our paying members. Choose a plan below to unlock immediate access and expand your agency growth.`}
          </p>
        </div>

        {/* Plan Upgrade Options */}
        <div className="grid sm:grid-cols-2 gap-4 mt-6 items-stretch">
          {/* Pro Plan Card */}
          <div
            className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
              targetPlan === "pro"
                ? "border-2 border-cobalt bg-stage/70 relative shadow-sm"
                : "border-line bg-stage/40"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono uppercase text-cobalt">
                  Professional
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cobalt/10 text-cobalt font-bold">
                  100 Audits / mo
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-ink font-display">
                  ${proPlan.monthlyPrice}
                </span>
                <span className="text-xs text-mute font-mono">/month</span>
              </div>
              <p className="text-[11px] text-mute mt-1">
                Ideal for solo SEO consultants & growing marketing teams.
              </p>

              <div className="mt-4 pt-4 border-t border-line space-y-2 text-xs text-ink">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cobalt shrink-0" />
                  <span>100 deep website audits / month</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cobalt shrink-0" />
                  <span>AI Content Studio & 0–100 Grader</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cobalt shrink-0" />
                  <span>1-Click PDF Report Export</span>
                </div>
              </div>
            </div>

            <a
              href={proPlan.monthlyPaymentLink}
              target="_blank"
              rel="noreferrer"
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-cobalt hover:opacity-95 text-white font-bold text-xs text-center inline-flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <span>Upgrade to Pro (${proPlan.monthlyPrice}/mo)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Agency Plan Card */}
          <div
            className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
              targetPlan === "agency" || isQuotaReached
                ? "border-2 border-accent bg-card relative shadow-md"
                : "border-line bg-stage/40"
            }`}
          >
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-accent text-[#141413] text-[9px] font-bold font-mono uppercase shadow-xs">
              Recommended
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono uppercase text-accent">
                  Agency White-Label
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-accent/15 text-accent font-bold">
                  Unlimited
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-ink font-display">
                  ${agencyPlan.monthlyPrice}
                </span>
                <span className="text-xs text-mute font-mono">/month</span>
              </div>
              <p className="text-[11px] text-mute mt-1">
                Close high-ticket agency retainers with branded deliverables.
              </p>

              <div className="mt-4 pt-4 border-t border-line space-y-2 text-xs text-ink">
                <div className="flex items-center gap-2 font-medium">
                  <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>Unlimited URL Audits across all domains</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>100% White-Label PDFs (Your Agency Logo)</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>Embeddable Lead-Gen Audit Widget & CRM</span>
                </div>
              </div>
            </div>

            <a
              href={agencyPlan.monthlyPaymentLink}
              target="_blank"
              rel="noreferrer"
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-accent hover:opacity-90 text-[#141413] font-bold text-xs text-center inline-flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <span>Unlock Agency (${agencyPlan.monthlyPrice}/mo)</span>
              <Sparkles className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Modal Footer info */}
        <div className="mt-5 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3 text-[11px] text-mute">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure Stripe Checkout • Cancel anytime • Immediate activation</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="hover:text-ink font-medium transition cursor-pointer"
          >
            Stay on {currentPlan.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}
