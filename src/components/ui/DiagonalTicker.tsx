"use client";

import React from "react";
import { Star, ShieldCheck, CheckCircle2 } from "lucide-react";
import { GoogleBadge, TrustpilotBadge, ProductHuntBadge } from "./PlatformBadges";

const MARQUEE_ITEMS = [
  {
    name: "Dr. Aris Thorne",
    role: "Cosmetic Dentist, Austin TX",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    quote: "TrustPulse intercepted 14 long-wait complaints and let my office manager resolve them privately. Our public Google rating stayed at 4.9!",
    platform: "google",
  },
  {
    name: "Marcus Vance",
    role: "Agency Founder, 28 Clients",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    quote: "We bill 18 local clients $149/mo each for reputation protection. That is $2,682/mo pure recurring profit with zero server overhead.",
    platform: "trustpilot",
  },
  {
    name: "Sarah Jenkins",
    role: "Invisalign Patient",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    quote: "Scanned the QR code on the desk and gave 5 stars in literally 10 seconds. So smooth and easy!",
    platform: "google",
  },
  {
    name: "David Sterling",
    role: "Porsche 911 Owner",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    quote: "World-class inspection report and honest mechanics. I always check their live website reviews before booking service.",
    platform: "producthunt",
  },
];

export function DiagonalRibbon() {
  const ribbonText =
    "★ 4.94 AVERAGE VERIFIED RATING  ·  NEGATIVE REVIEW SHIELD™ ACTIVE  ·  1-LINE JAVASCRIPT EMBED  ·  $0.00 / MO INFRASTRUCTURE  ·  STRIPE BILLING READY  ·  MULTI-TENANT AGENCY HUB  ·  FLIPPA TURNKEY ASSET  ·  ";

  return (
    <div className="relative py-6 overflow-hidden select-none pointer-events-none">
      {/* Rotated slanted background tape */}
      <div className="w-[120vw] -ml-[10vw] bg-emerald-600 text-white font-mono font-bold text-xs uppercase tracking-widest py-3 -rotate-1 shadow-lg border-y-2 border-emerald-400/80 flex items-center">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="mx-4">{ribbonText}</span>
          <span className="mx-4">{ribbonText}</span>
          <span className="mx-4">{ribbonText}</span>
        </div>
      </div>
    </div>
  );
}

export function CustomerReviewMarquee() {
  return (
    <div className="py-12 overflow-hidden relative">
      {/* Subtle edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[var(--sp-paper)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[var(--sp-paper)] to-transparent z-10 pointer-events-none" />

      {/* Marquee Track */}
      <div className="flex gap-4 sm:gap-6 animate-marquee hover:[animation-play-state:paused] w-max">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
          <div
            key={idx}
            className="w-[280px] sm:w-[340px] p-5 rounded-2xl border border-[var(--sp-line)] bg-[var(--sp-card)] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-amber-400 gap-0.5">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                {item.platform === "google" && <GoogleBadge />}
                {item.platform === "trustpilot" && <TrustpilotBadge />}
                {item.platform === "producthunt" && <ProductHuntBadge />}
              </div>
              <p className="text-xs sm:text-[13px] text-[var(--sp-ink)] leading-relaxed italic mb-4 line-clamp-3">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-[var(--sp-line)]/50">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-9 h-9 rounded-full object-cover border border-[var(--sp-line)]"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-[var(--sp-ink)] flex items-center gap-1 truncate">
                  <span>{item.name}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                </div>
                <div className="text-[11px] text-[var(--sp-mute)] truncate">
                  {item.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
