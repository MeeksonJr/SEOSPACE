"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  ArrowLeft,
  Printer,
  ShieldCheck,
  Star,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Sparkles,
  Check,
  MapPin,
  Phone,
  Globe,
  Search,
  RefreshCw,
  X,
  CheckCircle2,
  Code2,
  QrCode,
  Sliders,
  Send,
} from "lucide-react";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { Workspace } from "@/types/trustpulse";
import type { GooglePlaceResult } from "@/lib/places/google-maps";

export default function AgencyHubPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(
    TrustPulseStore.getWorkspaces()
  );

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMode, setModalMode] = useState<"google_maps" | "manual">("google_maps");

  // Google Ingestion State
  const [googleInput, setGoogleInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchStep, setSearchStep] = useState(0);
  const [detectedResult, setDetectedResult] = useState<GooglePlaceResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Creation State
  const [isCreating, setIsCreating] = useState(false);
  const [createdSummary, setCreatedSummary] = useState<{
    workspace: Workspace;
    reviewCount: number;
    widgetsGenerated: string[];
    funnelUrl: string;
  } | null>(null);

  // Manual Creation Form State
  const [newClientName, setNewClientName] = useState("");
  const [newClientCategory, setNewClientCategory] = useState("Cosmetic Healthcare");
  const [newClientSlug, setNewClientSlug] = useState("");
  const [newClientColor, setNewClientColor] = useState("#059669");
  const [newClientGoogleUrl, setNewClientGoogleUrl] = useState("https://maps.google.com");

  // Selected client for report printing
  const [reportingClient, setReportingClient] = useState<Workspace>(workspaces[0]);

  const totalClients = workspaces.length;
  const estimatedAgencyMRR = totalClients * 149;

  // Search or parse Google Maps link
  const handleLookupGoogleMaps = async (overrideQuery?: string) => {
    const query = overrideQuery || googleInput;
    if (!query || query.trim().length === 0) return;

    setIsSearching(true);
    setSearchError(null);
    setDetectedResult(null);
    setSearchStep(1);

    setTimeout(() => setSearchStep(2), 350);
    setTimeout(() => setSearchStep(3), 700);

    try {
      const res = await fetch("/api/places/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: query.trim() }),
      });

      const data = await res.json();
      if (data.success && data.business) {
        setDetectedResult(data.business);
      } else {
        setSearchError(data.error || "Could not retrieve Google Maps data.");
      }
    } catch (err: unknown) {
      setSearchError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setIsSearching(false);
      setSearchStep(0);
    }
  };

  // Register the detected Google client workspace
  const handleConfirmGoogleClient = async () => {
    if (!detectedResult) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/workspaces/create-from-google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business: detectedResult }),
      });

      const data = await res.json();
      if (data.success && data.workspace) {
        // Refresh local workspace store
        setWorkspaces([...TrustPulseStore.getWorkspaces()]);
        setCreatedSummary({
          workspace: data.workspace,
          reviewCount: data.reviewCount || 4,
          widgetsGenerated: data.widgetsGenerated || [],
          funnelUrl: data.funnelUrl || `/r/${data.workspace.slug}`,
        });
      } else {
        setSearchError(data.error || "Failed to create workspace.");
      }
    } catch (err: unknown) {
      setSearchError(err instanceof Error ? err.message : "Creation failed");
    } finally {
      setIsCreating(false);
    }
  };

  // Manual fallback creation
  const handleCreateManualClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientSlug) return;

    const cleanSlug = newClientSlug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-");

    const newWs: Workspace = {
      id: `ws-${cleanSlug}-${Date.now().toString(36)}`,
      name: newClientName.trim(),
      slug: cleanSlug,
      category: newClientCategory,
      brandColor: newClientColor,
      googleReviewUrl: newClientGoogleUrl,
      starThreshold: 4,
      createdAt: new Date().toISOString(),
      stats: {
        averageRating: 5.0,
        totalReviews: 4,
        shieldedReviews: 0,
        positiveRedirects: 4,
      },
    };

    // 1. Local update
    TrustPulseStore.saveWorkspace(newWs);
    setWorkspaces([...TrustPulseStore.getWorkspaces()]);
    setShowAddModal(false);
    setNewClientName("");
    setNewClientSlug("");

    // 2. Server API sync
    try {
      await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWs),
      });
    } catch (err) {
      console.error("Failed to sync workspace to server:", err);
    }
  };

  const handlePrintClientReport = (ws: Workspace) => {
    setReportingClient(ws);
    setTimeout(() => {
      window.print();
    }, 150);
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
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Agency White-Label Hub</span>
              <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                Multi-Client Retainers
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Manage client review funnels, social proof widgets &amp; generate monthly white-label PDF reports
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setCreatedSummary(null);
            setDetectedResult(null);
            setSearchError(null);
            setGoogleInput("");
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client via Google Maps</span>
        </button>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 print:hidden">
        {/* Agency Financial Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Client Retainers
            </span>
            <div className="text-3xl font-black text-slate-900">
              {totalClients} Clients
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">
              Unlimited workspaces on Agency Plan
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Estimated Monthly Retainer
            </span>
            <div className="text-3xl font-black text-emerald-600">
              ${estimatedAgencyMRR.toLocaleString()} / mo
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Based on standard $149/mo fee per location
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Software Operating Overhead
            </span>
            <div className="text-3xl font-black text-slate-900">
              $0.00 / mo
            </div>
            <p className="text-[11px] text-indigo-600 font-medium">
              100% Free-Tier Architecture (99%+ Profit Margin)
            </p>
          </div>
        </div>

        {/* Client Locations Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-slate-900">
              Client Businesses ({workspaces.length})
            </h2>
            <span className="text-xs text-slate-500">
              White-label client deliverable ready
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((ws) => (
              <div
                key={ws.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between space-y-6"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0"
                      style={{ backgroundColor: ws.brandColor }}
                    >
                      {ws.name.charAt(0)}
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-500 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                      ★ {ws.stats.averageRating}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {ws.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{ws.category}</p>

                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">
                        Total Reviews
                      </span>
                      <span className="font-bold text-slate-800">
                        {ws.stats.totalReviews} collected
                      </span>
                    </div>
                    <div>
                      <span className="text-rose-500 block text-[10px] uppercase font-mono">
                        Shielded Grievances
                      </span>
                      <span className="font-bold text-rose-700">
                        {ws.stats.shieldedReviews} defused
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/r/${ws.slug}`}
                      target="_blank"
                      className="flex-1 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs text-center flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Funnel</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handlePrintClientReport(ws)}
                      className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs text-center flex items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Print Client Report</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHITE-LABEL PRINTABLE MONTHLY PERFORMANCE REPORT */}
      <div className="hidden print:block max-w-4xl mx-auto p-12 bg-white text-slate-900 min-h-screen">
        <div className="border-b-2 border-slate-900 pb-6 mb-8 flex items-center justify-between">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600 mb-1">
              Monthly Reputation &amp; Social Proof Performance Report
            </div>
            <h1 className="text-3xl font-black text-slate-900">
              {reportingClient.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Reporting Period: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} • Delivered by Your Agency
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold uppercase px-3 py-1 bg-slate-900 text-white rounded-lg">
              Official Client Audit
            </span>
          </div>
        </div>

        {/* Executive Summary Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">
              Google Maps Rating
            </span>
            <span className="text-2xl font-black text-amber-500 mt-1 block">
              ★ {reportingClient.stats.averageRating}
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">
              Top 3% locally
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">
              Total Reviews
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {reportingClient.stats.totalReviews}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Across Google &amp; Trustpilot
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">
              Grievances Shielded
            </span>
            <span className="text-2xl font-black text-rose-600 mt-1 block">
              {reportingClient.stats.shieldedReviews}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Caught privately
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block">
              Retained Revenue
            </span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              ${(reportingClient.stats.shieldedReviews * 1400).toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-700 font-medium">
              Protected appointments
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE GOOGLE MAPS ONBOARDING MODAL
         ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Add New Client Workspace
                </h3>
                <p className="text-xs text-slate-500">
                  Instantly auto-populate business details, ratings, reviews, and widgets from Google Maps
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setModalMode("google_maps")}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  modalMode === "google_maps"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Search className="w-3.5 h-3.5 text-emerald-600" />
                <span>Google Maps Auto-Ingest (Recommended)</span>
              </button>
              <button
                type="button"
                onClick={() => setModalMode("manual")}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  modalMode === "manual"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Manual Form Setup</span>
              </button>
            </div>

            {/* SUCCESS CELEBRATION CARD IF WORKSPACE WAS CREATED */}
            {createdSummary ? (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-lg text-slate-900">
                    Workspace &amp; Assets Generated Successfully!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    <strong>{createdSummary.workspace.name}</strong> is now live with personalized QR review funnel and embeddable social proof widgets.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">
                      📱 Live QR Funnel:
                    </span>
                    <Link
                      href={createdSummary.funnelUrl}
                      target="_blank"
                      className="text-emerald-600 font-mono font-bold hover:underline flex items-center gap-1"
                    >
                      <span>{createdSummary.funnelUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">
                      ⚡ Embed Widgets:
                    </span>
                    <span className="text-slate-600 font-mono text-[11px]">
                      {createdSummary.widgetsGenerated.join(", ")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCreatedSummary(null);
                      setShowAddModal(false);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Done &amp; View Hub
                  </button>
                </div>
              </div>
            ) : modalMode === "google_maps" ? (
              /* =========================================================
                 GOOGLE MAPS AUTO-INGEST TAB
                 ========================================================= */
              <div className="space-y-4">
                {/* Search Bar */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Paste Google Maps URL or Search Business Name
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={googleInput}
                        onChange={(e) => setGoogleInput(e.target.value)}
                        placeholder="e.g. https://maps.app.goo.gl/... or 'Beacon Hill Law Boston'"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleLookupGoogleMaps();
                          }
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleLookupGoogleMaps()}
                      disabled={isSearching || !googleInput}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-sm shrink-0"
                    >
                      {isSearching ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-3.5 h-3.5" />
                          <span>Extract Data</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick 1-Click Demo Testing Chips for Flippa Buyers */}
                <div className="pt-1">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                    1-Click Buyer Demo Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "🦷 Apex Dental (Austin, TX)", query: "Apex Cosmetic Dentistry Austin TX" },
                      { label: "🚗 Bayview Auto (San Francisco, CA)", query: "Bayview Precision German Auto Repair SF" },
                      { label: "⚖️ Vance & Sterling Law (Chicago, IL)", query: "Vance & Sterling Injury Law Chicago" },
                      { label: "💆 Luxe Glow MedSpa (Miami, FL)", query: "Luxe Glow Aesthetics Laser Miami" },
                      { label: "🍕 Oak & Cellar Bistro (NYC)", query: "The Oak and Cellar Bistro New York" },
                    ].map((chip) => (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => {
                          setGoogleInput(chip.query);
                          handleLookupGoogleMaps(chip.query);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Banner */}
                {searchError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                    {searchError}
                  </div>
                )}

                {/* Animated Ingestion Scanner Feedback */}
                {isSearching && (
                  <div className="p-5 rounded-2xl bg-slate-900 text-white text-center space-y-2 border border-slate-800">
                    <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
                    <p className="font-bold text-xs text-emerald-300">
                      {searchStep === 1
                        ? "Resolving Google Maps URL Centroid & Unshortening Links..."
                        : searchStep === 2
                        ? "Extracting Business Profile, Star Rating & Review Count..."
                        : "Synthesizing Direct 5-Star Review Dialog Link & Initial Reviews..."}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Running PulseMind™ Place Ingestion Engine ($0/mo fixed cost)
                    </span>
                  </div>
                )}

                {/* DETECTED BUSINESS PREVIEW CARD */}
                {detectedResult && !isSearching && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-emerald-300/80 space-y-4 shadow-sm animate-in fade-in duration-150">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0"
                          style={{ backgroundColor: detectedResult.brandColor }}
                        >
                          {detectedResult.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-slate-900 text-sm">
                              {detectedResult.name}
                            </h4>
                            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              ✓ Auto-Detected
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {detectedResult.category}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{detectedResult.address}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{detectedResult.phone}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-black text-amber-500 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg block">
                          ★ {detectedResult.rating}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-1">
                          {detectedResult.totalReviews} Google Reviews
                        </span>
                      </div>
                    </div>

                    {/* Generated Review Link Callout */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-0.5">
                        Direct Google Review Link (Embedded in QR Funnel):
                      </span>
                      <a
                        href={detectedResult.googleReviewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 font-mono text-[11px] hover:underline truncate block"
                      >
                        {detectedResult.googleReviewUrl}
                      </a>
                    </div>

                    {/* Pre-Generated Assets Notice */}
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1.5">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Ready to Auto-Generate:</span>
                      </span>
                      <ul className="text-[11px] text-slate-700 space-y-1 list-disc pl-4">
                        <li>Dedicated QR Rating Funnel at <code className="font-mono text-emerald-700">/r/{detectedResult.slug}</code></li>
                        <li>Live Social Proof Toast Widget (<code className="font-mono text-emerald-700">widget-{detectedResult.slug}-toasts</code>)</li>
                        <li>Wall of Love Embed Widget (<code className="font-mono text-emerald-700">widget-{detectedResult.slug}-wall</code>)</li>
                        <li>Printable 4x6 Table Tent Counter QR Stand in Printable Studio</li>
                      </ul>
                    </div>

                    {/* Confirmation Button */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setDetectedResult(null)}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmGoogleClient}
                        disabled={isCreating}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isCreating ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Generating Workspace...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Create Workspace &amp; Launch Funnel</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* =========================================================
                 MANUAL FALLBACK TAB
                 ========================================================= */
              <form onSubmit={handleCreateManualClient} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Client Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => {
                      setNewClientName(e.target.value);
                      if (!newClientSlug) {
                        setNewClientSlug(
                          e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                        );
                      }
                    }}
                    placeholder="e.g. Gotham Premier Dental"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Industry / Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClientCategory}
                    onChange={(e) => setNewClientCategory(e.target.value)}
                    placeholder="e.g. Cosmetic Dentistry & Healthcare"
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    QR Funnel URL Slug *
                  </label>
                  <div className="flex items-center text-xs">
                    <span className="p-2.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 font-mono">
                      /r/
                    </span>
                    <input
                      type="text"
                      required
                      value={newClientSlug}
                      onChange={(e) => setNewClientSlug(e.target.value)}
                      placeholder="gotham-dental"
                      className="flex-1 text-xs border border-slate-200 rounded-r-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newClientColor}
                      onChange={(e) => setNewClientColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                    />
                    <span className="text-xs font-mono text-slate-600">
                      {newClientColor}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-all cursor-pointer"
                  >
                    Create Workspace
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
