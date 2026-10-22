"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  Calendar,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Smile,
  Award,
  Send,
  Smartphone,
  Eye,
  RefreshCw,
  X,
  CheckCircle,
  Bell,
  Sliders,
} from "lucide-react";
import Script from "next/script";

export default function ApexDentalDemoSite() {
  const [toastCount, setToastCount] = useState(0);
  const [dockExpanded, setDockExpanded] = useState(true);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [manualToast, setManualToast] = useState<{
    name: string;
    text: string;
    stars: number;
    procedure: string;
  } | null>(null);

  useEffect(() => {
    // Increment toast display count for previewer feedback
    const interval = setInterval(() => {
      setToastCount((c) => c + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const triggerManualToast = () => {
    const samples = [
      {
        name: "Dr. Rachel Higgins",
        procedure: "Porcelain Veneers",
        stars: 5,
        text: "Painless procedure, luxurious clinic ambiance, and pristine hygiene. My smile looks radiant!",
      },
      {
        name: "Jonathan Blair",
        procedure: "Invisalign Clear Aligners",
        stars: 5,
        text: "Completed my 6-month Invisalign course yesterday. Dr. Thorne & the staff are top tier in Austin.",
      },
      {
        name: "Claire Montrose",
        procedure: "Laser Whitening",
        stars: 5,
        text: "Zero tooth sensitivity and instantly 4 shades brighter. Will recommend to all my colleagues!",
      },
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    setManualToast(picked);
    setTimeout(() => {
      setManualToast(null);
    }, 5500);
  };

  const handleSendBuyerTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerEmail || !buyerEmail.includes("@")) return;

    setSendingEmail(true);
    setEmailSuccess(null);

    try {
      const res = await fetch("/api/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: buyerEmail,
          templateType: "shield_alert",
          customData: {
            businessName: "Apex Cosmetic Dentistry & Orthodontics",
            brandColor: "#059669",
            rating: 2,
            customerName: "Buyer Test Patient",
            customerPhone: "(512) 555-0199",
            grievanceText:
              "Scheduled cleaning appointment was delayed by 25 minutes. Front reception staff appeared overwhelmed.",
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailSuccess(
          data.hasLiveCredentials
            ? `✅ Delivered live to ${buyerEmail} via Google SMTP!`
            : `⚡ Simulation verified! Set GOOGLE_SMTP_USER & GOOGLE_SMTP_APP_PASSWORD for live inbox delivery.`
        );
      } else {
        setEmailSuccess(`❌ Failed: ${data.error}`);
      }
    } catch (err: unknown) {
      setEmailSuccess(
        `❌ Error: ${err instanceof Error ? err.message : "Network error"}`
      );
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white relative">
      {/* BUYER / PROSPECTIVE CLIENT DEMO BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white px-4 py-2.5 text-xs border-b border-emerald-500/30 sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-bold text-emerald-300">
              BUYER SHOWCASE ENVIRONMENT:
            </span>
            <span className="text-slate-300">
              Simulated luxury dental practice powered by TrustPulse AI.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setEmailModalOpen(true)}
              className="text-[11px] font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3 h-3 text-emerald-400" />
              <span>Test Google SMTP Email</span>
            </button>
            <Link
              href="/dashboard/widgets"
              className="text-[11px] font-bold text-emerald-400 hover:text-white underline flex items-center gap-1"
            >
              <span>Widget Studio</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Smartphone className="w-3 h-3" />
              <span>Test Patient QR Funnel</span>
            </button>
          </div>
        </div>
      </div>

      {/* DENTAL CLINIC HEADER */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Smile className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">
                Apex Cosmetic Dentistry
              </div>
              <div className="text-[10px] font-semibold text-emerald-700 tracking-widest uppercase mt-0.5">
                Orthodontics &amp; Implant Institute
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <span className="hover:text-emerald-700 cursor-pointer">Treatments</span>
            <span className="hover:text-emerald-700 cursor-pointer">Smile Gallery</span>
            <span className="hover:text-emerald-700 cursor-pointer">Dr. Thorne</span>
            <span className="hover:text-emerald-700 cursor-pointer">Patient Reviews</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:5125550192"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>(512) 555-0192</span>
            </a>
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Austin&apos;s #1 Rated Cosmetic &amp; Sedation Dentistry</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-[1.15]">
                Sculpting Confident Smiles with{" "}
                <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy">
                  Painless Precision
                </span>
                .
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Experience luxury healthcare. From porcelain veneers to guided 3D implants and clear aligners, Dr. Thorne delivers life-changing results in an anxiety-free spa environment.
              </p>

              {/* Social Proof Metric Pill */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 max-w-md mx-auto lg:mx-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
                    <Star className="w-5 h-5 fill-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 font-black text-slate-900 text-base">
                      <span>4.94</span>
                      <span className="text-amber-400">★★★★★</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      184 Google &amp; Trustpilot Reviews
                    </p>
                  </div>
                </div>

                <div className="border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-4 text-center sm:text-left">
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Shield Protected
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    99.2% positive sentiment
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setQrModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-700/20 transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Patient Visit</span>
                </button>
                <button
                  type="button"
                  onClick={triggerManualToast}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm px-5 py-3.5 rounded-xl border border-slate-300 shadow-sm transition-all cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-emerald-600" />
                  <span>Trigger Live Review Toast</span>
                </button>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-slate-900 p-6 text-white shadow-2xl border border-slate-800 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="font-bold text-xs text-white">TrustPulse Social Proof Feed</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    ACTIVE SCRIPT EMBED
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">Marcus Vance</span>
                      <span className="text-amber-400 text-[11px]">★★★★★</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      &ldquo;They gave me a warm scented towel after treatment. You simply cannot find a better dental practice in Austin.&rdquo;
                    </p>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                      <span>Westlake, TX • Google Maps</span>
                      <span className="text-emerald-400 font-bold">✓ Verified Patient</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">Elena Rostova</span>
                      <span className="text-amber-400 text-[11px]">★★★★★</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      &ldquo;Did the 1-hour laser whitening before my wedding. 4 shades whiter with zero sensitivity.&rdquo;
                    </p>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                      <span>Round Rock, TX • Trustpilot</span>
                      <span className="text-emerald-400 font-bold">✓ Verified Patient</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Widget: <code className="text-emerald-400 font-mono">widget-apex-toasts</code></span>
                  <span>Auto-loops every 6s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY APEX & TRUSTPULSE SHIELD OVERVIEW */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why Premier Practices Rely on TrustPulse AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Patients scan counter QR stands at checkout. 5-star patients post directly to Google Maps, while unhappy patients are routed privately to management before public damage occurs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Negative Review Shield
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sub-4 star ratings are captured in a private inbox and emailed to practice leadership within seconds, turning grievances into loyal advocates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Star className="w-5 h-5 fill-amber-500" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Google 5-Star Surge
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Satisfied patients are instantly deep-linked into the Google Maps review dialog, increasing review conversion by 340% over email campaigns.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                Live Website Embeds
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Floating social proof notifications display recent verified patient experiences on the clinic&apos;s website to boost appointment bookings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WALL OF LOVE SECTION */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                PATIENT EXPERIENCES
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Verified Patient Testimonials
              </h2>
            </div>
            <div className="text-xs text-slate-400">
              Synced automatically via{" "}
              <Link
                href="/"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline"
              >
                TrustPulse AI
              </Link>
            </div>
          </div>

          {/* Patient Reviews Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {"★★★★★"}
                </div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                  ✓ Google Verified
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                &ldquo;Dr. Thorne is an absolute miracle worker. I was terrified of dental implants for 3 years, but their painless sedation and 3D imaging made the entire procedure seamless.&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-bold text-white">Sarah Jenkins</span>
                <span className="text-slate-500 text-[11px]">Invisalign Patient</span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {"★★★★★"}
                </div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                  ✓ Trustpilot Verified
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                &ldquo;Brought my entire family here after relocating from Seattle. The office is immaculate, staff is warm, and billing is completely transparent.&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-bold text-white">Michael R. Chang</span>
                <span className="text-slate-500 text-[11px]">Family Care</span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {"★★★★★"}
                </div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                  ✓ Direct In-Person
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                &ldquo;I chipped my front tooth playing pickleball on Saturday morning. They got me in within 90 minutes and you cannot even tell which tooth was repaired!&rdquo;
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-bold text-white">Emily Vance</span>
                <span className="text-slate-500 text-[11px]">Emergency Care</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-10 px-4 text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-bold text-white">Apex Cosmetic Dentistry &amp; Orthodontics</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              100 Congress Ave, Suite 1200, Austin, TX 78701 • (512) 555-0192
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/" className="hover:text-emerald-400">
              Powered by TrustPulse AI
            </Link>
            <Link href="/dashboard" className="hover:text-white">
              Agency Hub
            </Link>
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="text-emerald-400 hover:underline cursor-pointer"
            >
              Rate Visit (QR Funnel)
            </button>
          </div>
        </div>
      </footer>

      {/* FLOATING BUYER TESTING DOCK */}
      <div className="fixed bottom-6 right-6 z-50">
        {dockExpanded ? (
          <div className="bg-slate-950/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-4 shadow-2xl text-white w-80 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-extrabold text-xs text-white uppercase tracking-wider">
                  Buyer Testing Dock
                </span>
              </div>
              <button
                type="button"
                onClick={() => setDockExpanded(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-xs"
              >
                Minimize ✕
              </button>
            </div>

            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              Interact directly with live SaaS features on this client site:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={triggerManualToast}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>Spawn Review Toast</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">TEST</span>
              </button>

              <button
                type="button"
                onClick={() => setEmailModalOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Test Google SMTP Email</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">SEND</span>
              </button>

              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                  <span>Try QR Rating Gatekeeper</span>
                </span>
                <span className="text-[10px] text-sky-400 font-mono font-bold">TRY</span>
              </button>

              <Link
                href="/dashboard"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-xs font-bold text-emerald-300 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Open Client Command Center</span>
                </span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setDockExpanded(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-950/90 hover:bg-slate-900 border border-emerald-500/50 shadow-2xl text-white text-xs font-bold cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Buyer Testing Dock</span>
          </button>
        )}
      </div>

      {/* MANUAL POPUP TOAST INJECTOR (FALLBACK / MANUAL DEMO) */}
      {manualToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900/95 backdrop-blur-md text-white border border-slate-700 rounded-2xl p-4 shadow-2xl max-w-sm animate-in fade-in slide-in-from-bottom-6 duration-200">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
              {manualToast.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-xs text-white">{manualToast.name}</span>
                <span className="text-amber-400 text-xs">{"★".repeat(manualToast.stars)}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                &ldquo;{manualToast.text}&rdquo;
              </p>
              <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                <span>{manualToast.procedure}</span>
                <span className="text-emerald-400 font-bold">✓ Verified Google Patient</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SMARTPHONE QR FUNNEL MODAL */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white relative shadow-2xl">
            <button
              type="button"
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-white">
                Live Patient QR Experience
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Test the exact rating gatekeeper patients encounter upon scanning
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <span className="text-slate-300">
                  Rate <strong>4 or 5 Stars</strong>: Instant redirect to Google Maps review dialog
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <span className="text-slate-300">
                  Rate <strong>1 to 3 Stars</strong>: Negative Review Shield intercepts feedback privately
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                href="/r/apex-dental"
                target="_blank"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-center font-bold text-xs transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <span>Open Live Patient Funnel in New Tab</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => setQrModalOpen(false)}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEST EMAIL MODAL FOR BUYERS */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-slate-900 relative shadow-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setEmailModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-950">
                  Send Test Shield Alert
                </h3>
                <p className="text-xs text-slate-500">
                  Experience the email practice managers receive within 5 seconds of a 2★ grievance
                </p>
              </div>
            </div>

            <form onSubmit={handleSendBuyerTestEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. buyer@example.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Will dispatch the responsive HTML Practice Alert template.
                </p>
              </div>

              {emailSuccess && (
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-800">
                  {emailSuccess}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail || !buyerEmail}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md"
                >
                  {sendingEmail ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Alert Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACTUAL LIVE 1-LINE TRUSTPULSE WIDGET INJECTOR SCRIPT */}
      <Script
        src="/api/widget/script?id=widget-apex-toasts"
        strategy="lazyOnload"
      />
    </div>
  );
}
