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
  Send,
  X,
  FileText,
  Inbox,
  CheckCircle,
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

  // Email Test Modal State
  const [testEmailModalOpen, setTestEmailModalOpen] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [testEmailType, setTestEmailType] = useState<
    "shield_alert" | "customer_apology" | "weekly_digest"
  >("shield_alert");
  const [selectedFeedbackForEmail, setSelectedFeedbackForEmail] = useState<PrivateFeedback | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<{
    success: boolean;
    messageId?: string;
    simulated?: boolean;
    configUsed?: string;
    note?: string;
    error?: string;
  } | null>(null);

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
    const mockNames = ["David Miller", "Elena Rostova", "Marcus Vance", "Chloe Bennett", "Arthur Pendelton"];
    const mockGrievances = [
      "Front desk receptionist seemed rushed and didn't validate my parking ticket.",
      "Waiting room TV was playing loud news, and my appointment was delayed 15 minutes.",
      "Hygiene cleaning felt somewhat rushed compared to my previous appointment with Dr. Thorne.",
      "Pharmacy prescription was sent to the wrong branch, causing a 30-minute delay.",
      "The anesthetic injection pinched more than usual and I was left in chair for 20 minutes without check-in.",
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
          customerPhone: "(512) 555-0144",
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

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailAddress || !testEmailAddress.includes("@")) return;

    setSendingEmail(true);
    setEmailResult(null);

    try {
      const res = await fetch("/api/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: testEmailAddress,
          templateType: testEmailType,
          customData: {
            businessName: ws.name,
            brandColor: ws.brandColor,
            rating: selectedFeedbackForEmail ? selectedFeedbackForEmail.rating : 2,
            customerName: selectedFeedbackForEmail ? selectedFeedbackForEmail.customerName : "Marcus Vance (Test)",
            customerPhone: selectedFeedbackForEmail ? selectedFeedbackForEmail.customerPhone : "(512) 555-0199",
            grievanceText: selectedFeedbackForEmail
              ? selectedFeedbackForEmail.grievanceText
              : "Wait time was 25 minutes past appointment time and staff was rushed.",
          },
        }),
      });

      const data = await res.json();
      setEmailResult(data);
    } catch (err: unknown) {
      setEmailResult({
        success: false,
        error: err instanceof Error ? err.message : "Failed to connect to email API",
      });
    } finally {
      setSendingEmail(false);
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
          {/* Test Email Dispatch Button */}
          <button
            type="button"
            onClick={() => {
              setSelectedFeedbackForEmail(null);
              setEmailResult(null);
              setTestEmailModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Send className="w-3.5 h-3.5 text-emerald-600" />
            <span>Send Test Alert Email</span>
          </button>

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
            className="text-xs font-bold bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
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
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Intercepted Ratings
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {feedbackList.length}
              </p>
              <p className="text-[11px] text-rose-600 font-semibold mt-0.5">
                Prevented from reaching Google
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Needs Immediate Action
              </p>
              <p className="text-2xl font-black text-rose-600 mt-1">
                {feedbackList.filter((f) => f.status === "new").length}
              </p>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Waiting for follow-up call
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Resolution Rate
              </p>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {feedbackList.length > 0
                  ? Math.round(
                      (feedbackList.filter((f) => f.status === "resolved").length /
                        feedbackList.length) *
                        100
                    )
                  : 100}
                %
              </p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                Turned into happy advocates
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Public Rating Protected
              </span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Active Shield
              </span>
            </div>
            <div className="mt-2">
              <div className="text-3xl font-black text-white">4.94 ★</div>
              <p className="text-xs text-slate-300 mt-1">
                Without Shield, rating would drop to{" "}
                <span className="text-rose-400 font-bold">4.41 ★</span>
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar & Quick Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            {(["all", "new", "contacted", "resolved"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                  filter === tab
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab === "all" ? "All Interceptions" : tab}
                <span className="ml-1.5 text-[10px] font-mono py-0.2 px-1.5 rounded-full bg-slate-200 text-slate-700">
                  {tab === "all"
                    ? feedbackList.length
                    : feedbackList.filter((f) => f.status === tab).length}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Google SMTP Dispatcher:{" "}
              <strong className="text-slate-900">
                Automatic Alert on 1-3★ Submission
              </strong>
            </span>
          </div>
        </div>

        {/* Grievance Feed */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              No grievance records found in this view
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              All intercepted ratings have been handled, or no reviews match this filter. Use
              &ldquo;Simulate Incoming Grievance&rdquo; above to test how incoming ratings are processed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => {
              const isEditing = editingNotesId === item.id;
              const isSaved = savedSuccessId === item.id;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-sm hover:shadow-md ${
                    item.status === "new"
                      ? "border-rose-300 bg-rose-50/20"
                      : item.status === "contacted"
                      ? "border-amber-200"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Customer & Rating Column */}
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                          item.rating <= 2
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.rating}★
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-sm">{item.customerName}</h4>
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
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {/* Contact details */}
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1.5 flex-wrap">
                          <a
                            href={`mailto:${item.customerEmail}`}
                            className="inline-flex items-center gap-1 hover:text-emerald-700 transition-colors"
                          >
                            <Mail className="w-3 h-3" />
                            <span>{item.customerEmail}</span>
                          </a>
                          {item.customerPhone && (
                            <a
                              href={`tel:${item.customerPhone}`}
                              className="inline-flex items-center gap-1 hover:text-emerald-700 transition-colors"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{item.customerPhone}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons & Status selector */}
                    <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                      {/* Send Test Email specifically with this grievance */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFeedbackForEmail(item);
                          setTestEmailType("shield_alert");
                          setEmailResult(null);
                          setTestEmailModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 cursor-pointer transition-colors"
                        title="Send this exact grievance alert to your inbox"
                      >
                        <Send className="w-3 h-3 text-emerald-600" />
                        <span>Email Alert to Me</span>
                      </button>

                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(item.id, e.target.value as FeedbackStatus)
                        }
                        className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                      >
                        <option value="new">Mark New (Unread)</option>
                        <option value="contacted">Mark Contacted</option>
                        <option value="resolved">Mark Resolved</option>
                      </select>

                      {item.customerPhone && (
                        <a
                          href={`tel:${item.customerPhone}`}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call Patient</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Intercepted Grievance Statement */}
                  <div className="mt-4 pl-3 border-l-2 border-rose-400 bg-rose-50/40 rounded-r-xl p-3 text-xs leading-relaxed text-slate-700">
                    <p className="italic font-medium text-slate-800">
                      &ldquo;{item.grievanceText}&rdquo;
                    </p>
                  </div>

                  {/* Resolution Notes area */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={notesText}
                          onChange={(e) => setNotesText(e.target.value)}
                          placeholder="Record resolution notes (e.g., Called patient, offered complimentary polishing, apologized for wait)..."
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                          rows={2}
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

      {/* Test Email Dispatch Modal */}
      {testEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setTestEmailModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Send Test Email to Your Inbox
                </h3>
                <p className="text-xs text-slate-500">
                  Test TrustPulse AI&apos;s Google SMTP email templates live
                </p>
              </div>
            </div>

            <form onSubmit={handleSendTestEmail} className="space-y-4">
              {/* Template Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Select Email Template
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTestEmailType("shield_alert")}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      testEmailType === "shield_alert"
                        ? "border-rose-500 bg-rose-50 text-rose-900 font-bold"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    🚨 Shield Alert
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                      Practice manager
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTestEmailType("customer_apology")}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      testEmailType === "customer_apology"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    💌 Patient Note
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                      Apology letter
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTestEmailType("weekly_digest")}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      testEmailType === "weekly_digest"
                        ? "border-sky-500 bg-sky-50 text-sky-900 font-bold"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    📊 Weekly Digest
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                      Dark-mode report
                    </span>
                  </button>
                </div>
              </div>

              {/* Recipient Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email (e.g. buyer@example.com)"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  We will send a formatted responsive HTML email directly to this address.
                </p>
              </div>

              {/* Selected Grievance Context if row clicked */}
              {selectedFeedbackForEmail && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 block mb-0.5">
                    Using data from {selectedFeedbackForEmail.customerName}&apos;s grievance:
                  </span>
                  <p className="text-slate-600 italic line-clamp-2">
                    &ldquo;{selectedFeedbackForEmail.grievanceText}&rdquo;
                  </p>
                </div>
              )}

              {/* Status/Result Banner */}
              {emailResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    emailResult.success
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-rose-50 border-rose-200 text-rose-900"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {emailResult.success ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Email Dispatched Successfully!</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>Dispatch Error</span>
                      </>
                    )}
                  </div>
                  <p className="mt-1 text-slate-600">{emailResult.note || emailResult.error}</p>
                  {emailResult.messageId && (
                    <p className="mt-1 text-[10px] font-mono text-slate-500">
                      Message ID: {emailResult.messageId}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTestEmailModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail || !testEmailAddress}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-600/20"
                >
                  {sendingEmail ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Test Email Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
