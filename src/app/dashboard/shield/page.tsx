"use client";

import React, { useState, useEffect } from "react";
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
  RefreshCw,
  ExternalLink,
  MessageSquareWarning,
  PlusCircle,
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
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "new" | "contacted" | "resolved">("all");
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState("");
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);

  // Sync feedback from API
  const fetchFreshFeedback = async (workspaceId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shield?workspaceId=${encodeURIComponent(workspaceId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.feedback)) {
        setFeedbackList(data.feedback);
      } else {
        setFeedbackList(TrustPulseStore.getPrivateFeedback(workspaceId));
      }
    } catch {
      setFeedbackList(TrustPulseStore.getPrivateFeedback(workspaceId));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreshFeedback(selectedWsId);
  }, [selectedWsId]);

  const filtered = feedbackList.filter((f) => {
    if (filter === "all") return true;
    return f.status === filter;
  });

  const handleStatusChange = async (id: string, newStatus: FeedbackStatus) => {
    // 1. Local update
    TrustPulseStore.updatePrivateFeedback(id, newStatus);
    setFeedbackList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    // 2. Server API sync
    try {
      await fetch("/api/shield", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to patch feedback status on server:", err);
    }
  };

  const handleSaveNotes = async (id: string) => {
    const currentFb = feedbackList.find((f) => f.id === id);
    if (!currentFb) return;

    // 1. Local update
    TrustPulseStore.updatePrivateFeedback(id, currentFb.status, notesText);
    setFeedbackList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, resolutionNotes: notesText } : item))
    );
    setEditingNotesId(null);
    setSavedSuccessId(id);
    setTimeout(() => setSavedSuccessId(null), 2500);

    // 2. Server API sync
    try {
      await fetch("/api/shield", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: currentFb.status,
          resolutionNotes: notesText,
        }),
      });
    } catch (err) {
      console.error("Failed to save resolution notes on server:", err);
    }
  };

  const handleSimulateGrievance = async () => {
    setSimulating(true);
    const mockNames = ["David Miller", "Elena Rostova", "Marcus Vance", "Chloe Bennett"];
    const mockGrievances = [
      "Front desk receptionist seemed rushed and didn't validate my parking ticket.",
      "Waiting room TV was playing loud news, and my appointment was delayed 15 minutes.",
      "Hygiene cleaning felt somewhat rushed compared to my previous appointment with Dr. Thorne.",
      "Pharmacy prescription was sent to the wrong branch, causing a 30-minute delay.",
    ];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const randomGrievance = mockGrievances[Math.floor(Math.random() * mockGrievances.length)];
    const randomRating = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3

    try {
      const res = await fetch("/api/shield/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: ws.id,
          rating: randomRating,
          customerName: randomName,
          customerEmail: `${randomName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
          customerPhone: "(555) 234-5678",
          grievanceText: randomGrievance,
        }),
      });
      const data = await res.json();
      if (data.success && data.feedback) {
        TrustPulseStore.addPrivateFeedback(data.feedback);
        setFeedbackList((prev) => [data.feedback, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <span>Negative Review Shield Inbox</span>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                Private &amp; Confidential
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Customer grievances intercepted before they could be published on Google Maps
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleSimulateGrievance}
            disabled={simulating}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{simulating ? "Simulating..." : "Simulate Incoming Grievance"}</span>
          </button>

          <button
            type="button"
            onClick={() => fetchFreshFeedback(selectedWsId)}
            className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            title="Refresh Inbox"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-600" : ""}`} />
          </button>

          <select
            value={selectedWsId}
            onChange={(e) => {
              setSelectedWsId(e.target.value);
            }}
            className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none text-slate-800"
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
        <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-500/20 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              Public Rating Protection Active
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {feedbackList.length} Negative Public Reviews Successfully Shielded
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              When dissatisfied customers rated 1 to 3 stars via{" "}
              <Link
                href={`/r/${ws.slug}`}
                target="_blank"
                className="underline text-rose-300 hover:text-white"
              >
                /r/{ws.slug}
              </Link>
              , TrustPulse diverted them to your private inbox. This protected {ws.name}&apos;s public 4.9+ Google rating.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/r/${ws.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
            >
              <span>Test Live Funnel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={handleSimulateGrievance}
              disabled={simulating}
              className="sm:hidden inline-flex items-center gap-1.5 text-xs font-bold text-white bg-rose-600 px-3.5 py-2.5 rounded-xl transition-all"
            >
              <span>Simulate Grievance</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-1 text-xs font-semibold">
            {(["all", "new", "contacted", "resolved"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${
                  filter === tab
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab}
                {tab === "new" && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                    {feedbackList.filter((f) => f.status === "new").length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing {filtered.length} of {feedbackList.length} records
          </span>
        </div>

        {/* Feedback Records List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">
              No Feedback Under &quot;{filter}&quot; Filter
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All grievances under this filter are cleared. Click &quot;Simulate Incoming Grievance&quot; to test.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => {
              const isEditingNotes = editingNotesId === item.id;
              const isSaved = savedSuccessId === item.id;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl border p-6 shadow-sm transition-all ${
                    item.status === "new"
                      ? "border-rose-300 ring-2 ring-rose-100"
                      : item.status === "contacted"
                      ? "border-amber-200"
                      : "border-slate-200 opacity-90"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                    {/* Customer info & rating */}
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-extrabold text-base text-slate-900">
                          {item.customerName}
                        </span>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                          <span>{item.rating}★ Rated</span>
                        </div>
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                            item.status === "new"
                              ? "bg-rose-100 text-rose-700"
                              : item.status === "contacted"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <a href={`mailto:${item.customerEmail}`} className="hover:underline text-slate-700">
                            {item.customerEmail}
                          </a>
                        </span>
                        {item.customerPhone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <a href={`tel:${item.customerPhone}`} className="hover:underline text-slate-700">
                              {item.customerPhone}
                            </a>
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(item.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Status Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, "new")}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition cursor-pointer ${
                          item.status === "new"
                            ? "bg-rose-600 text-white border-rose-600"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        New
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, "contacted")}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition cursor-pointer ${
                          item.status === "contacted"
                            ? "bg-amber-500 text-white border-amber-500"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        Contacted
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, "resolved")}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition cursor-pointer ${
                          item.status === "resolved"
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        Resolved ✓
                      </button>
                    </div>
                  </div>

                  {/* Grievance Body */}
                  <div className="py-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Customer&apos;s Private Statement
                    </span>
                    <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      &quot;{item.grievanceText}&quot;
                    </p>
                  </div>

                  {/* Resolution Notes Section */}
                  <div className="pt-2">
                    {isEditingNotes ? (
                      <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                        <label className="text-xs font-bold text-slate-700 block">
                          Internal Resolution Notes &amp; Action Taken:
                        </label>
                        <textarea
                          rows={2}
                          value={notesText}
                          onChange={(e) => setNotesText(e.target.value)}
                          placeholder="e.g. Called client, apologized for hygiene room delay, offered $30 courtesy credit..."
                          className="w-full text-xs p-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 resize-none"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingNotesId(null)}
                            className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveNotes(item.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Notes</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="text-slate-600">
                          <span className="font-bold text-slate-700">Resolution Status: </span>
                          {item.resolutionNotes ? (
                            <span className="text-emerald-700 font-medium">
                              {item.resolutionNotes}
                            </span>
                          ) : (
                            <span className="italic text-slate-400">No notes recorded yet</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {isSaved && (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                              <Check className="w-3.5 h-3.5" />
                              <span>Saved!</span>
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNotesId(item.id);
                              setNotesText(item.resolutionNotes || "");
                            }}
                            className="text-xs font-semibold text-slate-600 hover:text-emerald-700 underline cursor-pointer"
                          >
                            {item.resolutionNotes ? "Edit Notes" : "+ Add Resolution Notes"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
