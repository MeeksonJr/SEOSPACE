"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Save,
  Check,
  Sparkles,
} from "lucide-react";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { PrivateFeedback, FeedbackStatus } from "@/types/trustpulse";

export default function ShieldInboxPage() {
  const workspaces = TrustPulseStore.getWorkspaces();
  const [selectedWsId, setSelectedWsId] = useState<string>("ws-apex-dental");
  const ws = workspaces.find((w) => w.id === selectedWsId) || workspaces[0];

  const [feedbackList, setFeedbackList] = useState<PrivateFeedback[]>(
    TrustPulseStore.getPrivateFeedback(ws.id)
  );

  const [filter, setFilter] = useState<"all" | "new" | "contacted" | "resolved">("all");
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState("");
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);

  const filtered = feedbackList.filter((f) => {
    if (filter === "all") return true;
    return f.status === filter;
  });

  const handleStatusChange = (id: string, newStatus: FeedbackStatus) => {
    const updated = TrustPulseStore.updatePrivateFeedback(id, newStatus);
    if (updated) {
      setFeedbackList([...TrustPulseStore.getPrivateFeedback(ws.id)]);
    }
  };

  const handleSaveNotes = (id: string) => {
    const currentFb = feedbackList.find((f) => f.id === id);
    if (!currentFb) return;
    TrustPulseStore.updatePrivateFeedback(id, currentFb.status, notesText);
    setFeedbackList([...TrustPulseStore.getPrivateFeedback(ws.id)]);
    setEditingNotesId(null);
    setSavedSuccessId(id);
    setTimeout(() => setSavedSuccessId(null), 2000);
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
              <span>Negative Review Shield Inbox</span>
              <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                Private &amp; Shielded
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Customer grievances intercepted before they could be published on Google
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedWsId}
            onChange={(e) => {
              setSelectedWsId(e.target.value);
              setFeedbackList(TrustPulseStore.getPrivateFeedback(e.target.value));
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

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Protection Impact Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-rose-100 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Negative Review Shield Status: Active</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              {ws.stats.shieldedReviews} Negative Complaints Defused Privately
            </h2>
            <p className="text-xs sm:text-sm text-rose-100 max-w-xl leading-relaxed">
              Every item in this inbox was intercepted by the smart QR gatekeeper. If these had been posted to Google Maps, your public score would have dropped by an estimated ~0.6 stars!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-center flex-shrink-0">
            <div className="text-3xl font-black">{ws.stats.averageRating} ★</div>
            <div className="text-[11px] text-rose-100 font-medium">
              Current Protected Rating
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: `All (${feedbackList.length})` },
              {
                id: "new",
                label: `New (${feedbackList.filter((f) => f.status === "new").length})`,
              },
              {
                id: "contacted",
                label: `Contacted (${
                  feedbackList.filter((f) => f.status === "contacted").length
                })`,
              },
              {
                id: "resolved",
                label: `Resolved (${
                  feedbackList.filter((f) => f.status === "resolved").length
                })`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as typeof filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === tab.id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Direct Private Submissions
          </div>
        </div>

        {/* Feedback List Cards */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-sm text-slate-800">
                No complaints in this category!
              </h3>
              <p className="text-xs text-slate-500">
                All customer grievances for this location have been addressed.
              </p>
            </div>
          ) : (
            filtered.map((fb) => (
              <div
                key={fb.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 transition-all hover:border-slate-300"
              >
                {/* Top Row: Customer Info & Status Pill */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {fb.customerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <span>{fb.customerName}</span>
                        <span className="text-amber-500 font-mono text-xs font-bold">
                          {"★".repeat(fb.rating)} ({fb.rating} Stars)
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <a href={`mailto:${fb.customerEmail}`} className="hover:underline">
                            {fb.customerEmail}
                          </a>
                        </span>
                        {fb.customerPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <a href={`tel:${fb.customerPhone}`} className="hover:underline">
                              {fb.customerPhone}
                            </a>
                          </span>
                        )}
                        <span>• {new Date(fb.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Status:</span>
                    <select
                      value={fb.status}
                      onChange={(e) =>
                        handleStatusChange(fb.id, e.target.value as FeedbackStatus)
                      }
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none ${
                        fb.status === "resolved"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : fb.status === "contacted"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-rose-50 text-rose-800 border-rose-200"
                      }`}
                    >
                      <option value="new">New (Unopened)</option>
                      <option value="contacted">Customer Contacted</option>
                      <option value="resolved">Resolved &amp; Closed</option>
                    </select>
                  </div>
                </div>

                {/* Grievance Body */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed">
                  &ldquo;{fb.grievanceText}&rdquo;
                </div>

                {/* Resolution Notes Box */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex-1 min-w-0">
                    {editingNotesId === fb.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          type="text"
                          value={notesText}
                          onChange={(e) => setNotesText(e.target.value)}
                          placeholder="e.g. Called customer, waived copay, apologized..."
                          className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveNotes(fb.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </div>
                    ) : (
                      <div className="text-slate-600">
                        <strong className="text-slate-800">Resolution Log: </strong>
                        <span>{fb.resolutionNotes || "No notes logged yet."}</span>
                      </div>
                    )}
                  </div>

                  {editingNotesId !== fb.id && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNotesId(fb.id);
                        setNotesText(fb.resolutionNotes || "");
                      }}
                      className="text-xs font-semibold text-emerald-600 hover:underline flex-shrink-0"
                    >
                      {fb.resolutionNotes ? "Edit Notes" : "+ Add Resolution Log"}
                    </button>
                  )}

                  {savedSuccessId === fb.id && (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Saved!
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
