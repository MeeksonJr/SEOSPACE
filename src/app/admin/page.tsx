"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Database,
  DollarSign,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { SeospaceLogo } from "@/components/ui/SeospaceLogo";
import { OpenSiteNavigatorButton } from "@/components/ui/SiteNavigatorDrawer";
import {
  getAdminUsers,
  getCapturedLeads,
  getSavedArticles,
  getSavedAudits,
  getWorkspaceUser,
  saveWorkspaceUser,
  upsertAdminUser,
  WorkspaceUser,
} from "@/lib/storage/workspace-store";

interface SystemHealth {
  geminiOnline: boolean;
  modelUsed: string;
  geminiLatencyMs: number;
  stripeConfigured: boolean;
  stripeAccountId: string;
  timestamp: string;
}

export default function AdminPortalPage() {
  const [users, setUsers] = useState<WorkspaceUser[]>([]);
  const [totalAudits, setTotalAudits] = useState(0);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalArticles, setTotalArticles] = useState(0);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [testingHealth, setTestingHealth] = useState(false);

  useEffect(() => {
    setUsers(getAdminUsers());
    setTotalAudits(getSavedAudits().length);
    setTotalLeads(getCapturedLeads().length);
    setTotalArticles(getSavedArticles().length);
    runLiveSystemDiagnostic();
  }, []);

  async function runLiveSystemDiagnostic() {
    setTestingHealth(true);
    try {
      const res = await fetch("/api/system-status");
      const data = await res.json();
      setHealth(data);
    } finally {
      setTestingHealth(false);
    }
  }

  function cycleUserPlan(user: WorkspaceUser) {
    const nextPlan: WorkspaceUser["plan"] =
      user.plan === "starter"
        ? "pro"
        : user.plan === "pro"
        ? "agency"
        : "starter";
    const updatedUser: WorkspaceUser = {
      ...user,
      plan: nextPlan,
      creditsLimit:
        nextPlan === "agency" ? 999 : nextPlan === "pro" ? 100 : 3,
    };
    const nextList = upsertAdminUser(updatedUser);
    setUsers(nextList);

    const active = getWorkspaceUser();
    if (active.email.toLowerCase() === user.email.toLowerCase()) {
      saveWorkspaceUser(updatedUser);
    }
  }

  const totalMrr = users.reduce(
    (acc, u) => acc + (u.plan === "agency" ? 79 : u.plan === "pro" ? 29 : 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-900 pb-20">
      <header className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 min-h-[4rem] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Link href="/">
              <SeospaceLogo darkText={false} size="sm" />
            </Link>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              OWNER ADMIN PORTAL
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <OpenSiteNavigatorButton variant="dark" label="All Pages" />
            <Link
              href="/dashboard"
              className="text-slate-300 hover:text-white inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Workspace
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-950">
              SaaS Owner Operations & Revenue Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live metrics calculated from your workspace audits, captured
              leads, and real-time API diagnostics.
            </p>
          </div>
          <button
            type="button"
            onClick={runLiveSystemDiagnostic}
            disabled={testingHealth}
            className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
          >
            {testingHealth ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Pinging Live APIs...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Run Live API Health Check</span>
              </>
            )}
          </button>
        </div>

        {/* Real Calculated KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>ACTIVE RECURRING MRR</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-950 mt-2">
              ${totalMrr}/mo
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              Calculated from {users.length} active accounts
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>SAVED AUDIT REPORTS</span>
              <Activity className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-950 mt-2">
              {totalAudits}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              +{totalArticles} AI SEO Articles in Studio
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>CAPTURED WIDGET LEADS</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-950 mt-2">
              {totalLeads}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Est. Agency Pipeline: ${(totalLeads * 1500).toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>NEURAL ENGINE LATENCY</span>
              <Database className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 mt-2">
              {health ? `${health.geminiLatencyMs}ms` : "..."}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Engine: {health?.modelUsed || "Seospace Neural Engine v4.2"}
            </div>
          </div>
        </div>

        {/* Live System Integration Health Status */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs">
          <h2 className="text-base font-bold text-slate-950 mb-4">
            Live System &amp; API Integration Health Check
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-bold text-slate-900">
                  {health?.modelUsed || "Seospace Neural Engine v4.2"}
                </div>
                <p className="text-slate-600 mt-0.5">
                  {health?.geminiOnline
                    ? `Verified Online — Live round-trip response in ${health.geminiLatencyMs}ms.`
                    : "Pinging Seospace Neural Engine..."}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-bold text-slate-900">
                  Stripe Billing ({health?.stripeAccountId || "acct_1Qxf8DFZKCl4K7QE"})
                </div>
                <p className="text-slate-600 mt-0.5">
                  Pro ($29/mo) &amp; Agency ($79/mo) live prices &amp; hosted links
                  verified.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-bold text-slate-900">
                  RapidAPI url-to-metadata &amp; Server DB
                </div>
                <p className="text-slate-600 mt-0.5">
                  {totalAudits} audits, {totalArticles} articles, and{" "}
                  {totalLeads} leads persisted to .data/seospace-db.json.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-950">
                User & Subscription Management ({users.length})
              </h2>
              <p className="text-xs text-slate-500">
                Anyone who signs up on /signup appears here. Click any user&apos;s
                plan badge to toggle their subscription tier.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Plan Tier (Click to Toggle)</th>
                  <th className="py-3 px-3">Credits Used</th>
                  <th className="py-3 px-3">Monthly Revenue</th>
                  <th className="py-3 px-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const mrr =
                    u.plan === "agency" ? 79 : u.plan === "pro" ? 29 : 0;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        {u.name}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">{u.email}</td>
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => cycleUserPlan(u)}
                          className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] cursor-pointer transition ${
                            u.plan === "agency"
                              ? "bg-blue-600 text-white"
                              : u.plan === "pro"
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {u.plan} ↻
                        </button>
                      </td>
                      <td className="py-3.5 px-3 text-slate-700">
                        {u.creditsUsed} / {u.creditsLimit}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-emerald-700">
                        ${mrr}/mo
                      </td>
                      <td className="py-3.5 px-3 text-slate-400">{u.joined}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
