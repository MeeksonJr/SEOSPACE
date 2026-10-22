"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  QrCode,
  Printer,
  Download,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Star,
  Copy,
  Check,
  Sliders,
  ExternalLink,
} from "lucide-react";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";

export default function QRStudioPage() {
  const workspaces = TrustPulseStore.getWorkspaces();
  const [selectedWsId, setSelectedWsId] = useState<string>("ws-apex-dental");
  const ws = workspaces.find((w) => w.id === selectedWsId) || workspaces[0];

  const [heading, setHeading] = useState("How was your visit today?");
  const [subheading, setSubheading] = useState("Scan to share your feedback & help our team grow");
  const [color, setColor] = useState(ws.brandColor || "#059669");
  const [includeStars, setIncludeStars] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [origin, setOrigin] = useState("https://seospace-kappa.vercel.app");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const funnelUrl = `${origin}/r/${ws.slug}`;

  // Generate SVG QR Code representation using pure SVG vectors (no external heavy library required)
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    funnelUrl
  )}&color=${color.replace("#", "")}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(funnelUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <span>Printable QR Stand Studio</span>
              <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                Table Tent &amp; Counter Flyer
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Printable 4x6&quot; review capture cards for clinic desks, dining tables &amp; counters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Counter Stand</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 grid lg:grid-cols-12 gap-8 items-start">
        {/* Controls on Left (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 print:hidden">
          <h2 className="font-bold text-sm uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            <span>Card Customizer</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Target Location
            </label>
            <select
              value={selectedWsId}
              onChange={(e) => {
                setSelectedWsId(e.target.value);
                const target = workspaces.find((w) => w.id === e.target.value);
                if (target) setColor(target.brandColor);
              }}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            >
              {workspaces.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Headline
            </label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Subheadline / Instructions
            </label>
            <input
              type="text"
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Brand Accent Color
            </label>
            <div className="flex items-center gap-3">
              {["#059669", "#2563eb", "#7c3aed", "#e11d48", "#0f172a"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? "scale-125 ring-2 ring-offset-2 ring-slate-900" : ""
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">
                Customer Direct URL
              </span>
              <button
                type="button"
                onClick={copyUrl}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl font-mono text-[11px] text-slate-600 break-all border border-slate-200">
              {funnelUrl}
            </div>
          </div>
        </div>

        {/* Live Printable Preview Canvas on Right (7 cols) */}
        <div className="lg:col-span-7 flex justify-center">
          {/* 4x6" Table Stand Container */}
          <div
            id="printable-card"
            className="w-full max-w-sm bg-white rounded-3xl border-2 border-slate-300 shadow-2xl overflow-hidden p-8 text-center flex flex-col justify-between items-center min-h-[540px] relative print:border-none print:shadow-none print:m-0"
          >
            {/* Top Brand Bar */}
            <div
              className="absolute top-0 left-0 right-0 h-3"
              style={{ backgroundColor: color }}
            />

            {/* Header */}
            <div className="space-y-3 pt-4">
              <div
                className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white font-bold text-xl shadow-md"
                style={{ backgroundColor: color }}
              >
                {ws.name.charAt(0)}
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                {ws.name}
              </h2>
              <div className="flex justify-center text-amber-400 gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>
            </div>

            {/* Middle: Crisp QR Code */}
            <div className="my-6 p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl shadow-inner">
              <img
                src={qrSvgUrl}
                alt={`QR code for ${ws.name}`}
                className="w-44 h-44 mx-auto object-contain"
              />
              <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-2">
                Point Camera &amp; Tap
              </div>
            </div>

            {/* Footer Prompt */}
            <div className="space-y-1.5 pb-2">
              <h3 className="text-base font-bold text-slate-900">
                {heading}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                {subheading}
              </p>
              <div className="pt-3 text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Private &amp; Public Customer Funnel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
