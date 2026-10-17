"use client";

import React from "react";
import Link from "next/link";
import {
  LogIn,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Camera,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/80 dark:border-slate-800">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Subtle Government Blue ambient halo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-500/10 dark:bg-blue-600/10 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading, Description, Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2">
              <Badge variant="primary" size="md" dot>
                Department of Social Justice & Empowerment • SIH PS095
              </Badge>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#0B5ED7]/10 text-[#0B5ED7] dark:bg-blue-900/40 dark:text-blue-300 border border-[#0B5ED7]/25">
                STRIDE-X Platform
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              <span className="text-[#0B5ED7] dark:text-blue-400">STRIDE-X</span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold mt-1.5 text-slate-800 dark:text-slate-100">
                Smart Tracking & Real-time Inspection for Development and Empowerment
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              A centralized AI-powered monitoring and inspection platform for DoSJE welfare schemes featuring real-time monitoring, CCTV integration, AI-based anomaly detection, geo-tagged inspections, grievance tracking, compliance management, and beneficiary verification.
            </p>

            {/* Scheme Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400 mr-1 text-[11px] uppercase tracking-wider">
                Active Schemes:
              </span>
              {["PM-AJAY", "SMILE Program", "NAPSrC Elder Care", "Divyangjan Aid", "NMBA Mission"].map((scheme) => (
                <span
                  key={scheme}
                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 text-xs"
                >
                  {scheme}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-3">
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto font-semibold px-8"
                  leftIcon={<LogIn className="w-4 h-4" />}
                >
                  Officer & Stakeholder Login
                </Button>
              </Link>
              <a href="#features" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto font-semibold px-6"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Platform Capabilities
                </Button>
              </a>
            </div>

            {/* Verification Guarantee Badges */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Zero-Trust Architecture</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Aadhaar e-KYC Enabled</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>24/7 Geofenced Telemetry</span>
              </div>
            </div>
          </div>

          {/* Right Column: Government Digital Dashboard Illustration / Live Mockup */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
              {/* Window Title Bar */}
              <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400">
                    dosje-telemetry.nic.in/live-monitor
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>AI Monitor Live</span>
                </div>
              </div>

              {/* Mock Dashboard Body */}
              <div className="p-5 space-y-4 text-left">
                {/* Metric Summary Bar */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/60">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                      National Compliance
                    </span>
                    <div className="text-xl font-extrabold text-[#0F4C81] dark:text-blue-300 font-mono mt-0.5">
                      98.7%
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      ↑ 1.2% this quarter
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/50 border border-teal-100 dark:border-teal-900/60">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                      Active Inspections
                    </span>
                    <div className="text-xl font-extrabold text-teal-800 dark:text-teal-300 font-mono mt-0.5">
                      342
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      In-field right now
                    </span>
                  </div>
                </div>

                {/* Live Inspection Audit Item */}
                <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      Pune Zonal Centre #104
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                      GEO-VERIFIED
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    PMU Auditor #4088 submitted surprise inspection. Geotag verified within 12 meters of registered coordinates.
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 dark:text-slate-400">
                    <span>Scheme: Senior Citizen Care</span>
                    <span className="font-mono">Timestamp: 11:42:09 IST</span>
                  </div>
                </div>

                {/* CCTV Telemetry Mock Line */}
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                        CCTV Stream Anomaly Engine
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        865 NGOs linked • Zero feed blackouts
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    100% ONLINE
                  </span>
                </div>

                {/* Risk scoring alert pill */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="text-[11px] leading-tight">
                    AI Automated Risk Engine: 12 potential fund utilization deviations flagged for State Authority review.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
