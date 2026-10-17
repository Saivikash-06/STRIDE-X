"use client";

import React, { useState } from "react";
import { Globe, Shield, PhoneCall } from "lucide-react";
import { PLATFORM_INFO } from "@/constants/landingData";

export const GovernmentBanner: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState("English");

  return (
    <header className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
      {/* Tricolor Accent Bar */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Department & Ministry */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
            <Shield className="w-3.5 h-3.5 text-[#0F4C81] dark:text-blue-400" />
            <span>भारत सरकार | Government of India</span>
          </div>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-600 dark:text-slate-400 font-medium">
            {PLATFORM_INFO.department}
          </span>
        </div>

        {/* Right: Accessibility, Helpline, Language Selector */}
        <div className="flex items-center gap-3 ml-auto text-[11px]">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-white focus:text-[#0F4C81] font-bold shadow-md rounded"
          >
            Skip to main content
          </a>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <PhoneCall className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Helpline:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">1800-11-2001</span>
          </div>

          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>

          {/* Language Selector (UI only as requested) */}
          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-slate-500" />
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-transparent border-none text-[11px] font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              aria-label="Select Language (UI Only)"
            >
              <option value="English" className="dark:bg-slate-900">English</option>
              <option value="हिन्दी" className="dark:bg-slate-900">हिन्दी (Hindi)</option>
              <option value="मराठी" className="dark:bg-slate-900">मराठी (Marathi)</option>
              <option value="தமிழ்" className="dark:bg-slate-900">தமிழ் (Tamil)</option>
              <option value="తెలుగు" className="dark:bg-slate-900">తెలుగు (Telugu)</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
