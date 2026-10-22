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
} from "lucide-react";
import Script from "next/script";

export default function ApexDentalDemoSite() {
  const [toastCount, setToastCount] = useState(0);

  useEffect(() => {
    // Increment toast display count for previewer feedback
    const interval = setInterval(() => {
      setToastCount((c) => c + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* BUYER / PROSPECTIVE CLIENT DEMO BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white px-4 py-2.5 text-xs border-b border-emerald-500/30 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-bold text-emerald-300">
              LIVE EMBED SHOWCASE:
            </span>
            <span className="text-slate-300">
              This simulated dental practice site is powered by TrustPulse AI. Watch the floating reviews appear in the corner!
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard/widgets"
              className="text-[11px] font-bold text-emerald-400 hover:text-white underline flex items-center gap-1"
            >
              <span>Widget Studio</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href="/r/apex-dental"
              target="_blank"
              className="text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <span>Scan Counter QR Stand</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
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
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </header>

      {/* CLINIC HERO SECTION */}
      <section className="bg-gradient-to-b from-white via-slate-50 to-slate-100 py-16 sm:py-20 px-4 border-b border-slate-200">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>Rated 4.98 / 5.0 Across 2,400+ Verified Patients</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Transform Your Smile with Gentle, Painless Modern Dentistry.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              Led by Dr. Aris Thorne, Apex Dentistry provides 3D-guided dental implants, porcelain veneers, and Invisalign in a serene, spa-like environment.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                className="px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition"
              >
                Schedule Free Consultation
              </button>
              <Link
                href="/r/apex-dental"
                target="_blank"
                className="px-5 py-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-xs transition flex items-center gap-2"
              >
                <span>Experience Patient Funnel</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </Link>
            </div>

            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200 text-slate-700 text-xs">
              <div>
                <span className="font-extrabold text-base text-slate-900 block">
                  15+ Years
                </span>
                <span>Clinical Excellence</span>
              </div>
              <div>
                <span className="font-extrabold text-base text-emerald-700 block">
                  4.98 ★
                </span>
                <span>Google Verified</span>
              </div>
              <div>
                <span className="font-extrabold text-base text-slate-900 block">
                  100% Painless
                </span>
                <span>Sedation Available</span>
              </div>
            </div>
          </div>

          {/* Right showcase card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-extrabold text-xl">
                AT
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Dr. Aris Thorne, DDS, FAGD
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Fellow of Academy of General Dentistry
                </p>
                <div className="flex items-center gap-1 text-amber-500 mt-1">
                  {"★★★★★"}
                  <span className="text-[11px] text-slate-600 font-bold ml-1">
                    (184 Patient Reviews)
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-4 rounded-2xl border border-slate-100">
              &ldquo;Our promise to you is complete transparency, zero judgment, and painless treatment utilizing the latest 3D digital oral imaging.&rdquo;
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Complimentary 3D CT digital oral scan</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Same-day porcelain veneer appointments</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Direct billing with all major dental PPO insurance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLINIC SERVICES */}
      <section className="py-16 px-4 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
            Comprehensive Cosmetic Care
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Tailored Treatments for Lifelong Smiles
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Porcelain Veneers
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ultra-thin, custom-crafted ceramic shells designed to restore discoloration, gaps, and chips with natural luster.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              3D Dental Implants
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Permanent titanium tooth replacements anchored securely into the jawbone for natural chewing and aesthetics.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Clear Invisalign®
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Discreet, removable clear aligners that straighten crowded teeth and correct bite misalignments comfortably.
            </p>
          </div>
        </div>
      </section>

      {/* EMBEDDED SOCIAL PROOF WALL OF LOVE (PROVES TRUSTPULSE WIDGET WORKS IN PRODUCTION) */}
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                TrustPulse AI Social Proof Stream
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Verified Patient Experiences
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Embedded directly into the website using TrustPulse&apos;s 1-line script
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Powered by</span>
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
                &ldquo;I chipped my front tooth playing pickleball on Saturday morning. They got me in within 90 minutes and you can not even tell which tooth was repaired!&rdquo;
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
            <Link href="/r/apex-dental" className="text-emerald-400 hover:underline">
              Rate Visit (QR Funnel)
            </Link>
          </div>
        </div>
      </footer>

      {/* ACTUAL LIVE 1-LINE TRUSTPULSE WIDGET INJECTOR SCRIPT */}
      <Script
        src="/api/widget/script?id=widget-apex-toasts"
        strategy="lazyOnload"
      />
    </div>
  );
}
