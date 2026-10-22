import React from "react";

export function GoogleBadge({ className = "h-4" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-xs text-xs font-semibold text-slate-800 dark:text-slate-100 ${className}`}>
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        />
      </svg>
      <span>Google</span>
    </span>
  );
}

export function TrustpilotBadge({ className = "h-4" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#00b67a]/10 border border-[#00b67a]/30 text-xs font-semibold text-[#008156] dark:text-[#00b67a] ${className}`}>
      <svg className="w-3.5 h-3.5 fill-[#00b67a]" viewBox="0 0 24 24">
        <path d="M12 1.5l3.24 6.57 7.26 1.05-5.25 5.12 1.24 7.23L12 18.06l-6.49 3.41 1.24-7.23L1.5 9.12l7.26-1.05L12 1.5z" />
      </svg>
      <span>Trustpilot</span>
    </span>
  );
}

export function ProductHuntBadge({ className = "h-4" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#da552f]/10 border border-[#da552f]/30 text-xs font-semibold text-[#da552f] ${className}`}>
      <span className="w-3.5 h-3.5 rounded-full bg-[#da552f] text-white flex items-center justify-center font-bold text-[9px] leading-none">
        P
      </span>
      <span>Product Hunt</span>
    </span>
  );
}

export function YelpBadge({ className = "h-4" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#d32323]/10 border border-[#d32323]/30 text-xs font-semibold text-[#d32323] ${className}`}>
      <span className="font-extrabold text-xs">Y!</span>
      <span>Yelp</span>
    </span>
  );
}

export function PlatformBadgeRouter({
  platform,
}: {
  platform: "google" | "trustpilot" | "producthunt" | "yelp" | "direct";
}) {
  switch (platform) {
    case "google":
      return <GoogleBadge />;
    case "trustpilot":
      return <TrustpilotBadge />;
    case "producthunt":
      return <ProductHuntBadge />;
    case "yelp":
      return <YelpBadge />;
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
          <span>✓ Direct Verified</span>
        </span>
      );
  }
}
