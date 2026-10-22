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
} from "lucide-react";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { Workspace } from "@/types/trustpulse";

export default function AgencyHubPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(
    TrustPulseStore.getWorkspaces()
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientCategory, setNewClientCategory] = useState("Local Healthcare");
  const [newClientSlug, setNewClientSlug] = useState("");
  const [newClientColor, setNewClientColor] = useState("#059669");
  const [newClientGoogleUrl, setNewClientGoogleUrl] = useState("https://maps.google.com");

  // Selected client for report printing
  const [reportingClient, setReportingClient] = useState<Workspace>(workspaces[0]);

  const totalClients = workspaces.length;
  const estimatedAgencyMRR = totalClients * 149;

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientSlug) return;

    const newWs: Workspace = {
      id: `ws-${newClientSlug}-${Date.now().toString(36)}`,
      name: newClientName,
      slug: newClientSlug.toLowerCase().replace(/\s+/g, "-"),
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

    TrustPulseStore.saveWorkspace(newWs);
    setWorkspaces([...TrustPulseStore.getWorkspaces()]);
    setShowAddModal(false);
    setNewClientName("");
    setNewClientSlug("");
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
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client Location</span>
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
                      className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs text-center flex items-center justify-center gap-1 transition-colors shadow-sm"
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
            <p className="text-sm text-slate-600 mt-1">
              Category: {reportingClient.category} • Reporting Period:{" "}
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold uppercase text-slate-400">
              Delivered By
            </div>
            <div className="text-lg font-bold text-slate-900">
              Apex Marketing Agency
            </div>
            <div className="text-xs text-emerald-600 font-medium">
              White-Label Retainer Partner
            </div>
          </div>
        </div>

        {/* Big Metrics Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="text-xs text-slate-500 uppercase font-mono">
              Current Rating
            </div>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {reportingClient.stats.averageRating} ★
            </div>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="text-xs text-slate-500 uppercase font-mono">
              Verified Reviews
            </div>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {reportingClient.stats.totalReviews}
            </div>
          </div>
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40">
            <div className="text-xs text-rose-700 uppercase font-mono">
              Shielded Complaints
            </div>
            <div className="text-3xl font-black text-rose-900 mt-1">
              {reportingClient.stats.shieldedReviews}
            </div>
          </div>
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
            <div className="text-xs text-emerald-700 uppercase font-mono">
              5-Star Redirects
            </div>
            <div className="text-3xl font-black text-emerald-900 mt-1">
              {reportingClient.stats.positiveRedirects}
            </div>
          </div>
        </div>

        {/* Narrative Analysis */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 mb-8">
          <h2 className="font-bold text-base text-slate-900">
            Executive Summary &amp; ROI
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            During this cycle, your TrustPulse automated review funnel successfully directed{" "}
            <strong>{reportingClient.stats.positiveRedirects} happy customers</strong> to submit
            public 5-star reviews on Google My Business. Concurrently, the Negative Review Shield
            intercepted <strong>{reportingClient.stats.shieldedReviews} grievances</strong> privately,
            safeguarding your public profile from critical rating drops.
          </p>
        </div>

        <div className="pt-8 border-t border-slate-200 text-xs text-slate-400 flex items-center justify-between font-mono">
          <span>Generated securely via TrustPulse AI White-Label Engine</span>
          <span>Confidential Client Assessment</span>
        </div>
      </div>

      {/* ADD CLIENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-lg text-slate-900">
                Add New Client Location
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business Name *
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
                  <span className="p-2.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-slate-500">
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
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-all"
                >
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
