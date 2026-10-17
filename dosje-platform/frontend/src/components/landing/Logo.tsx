import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LogoProps {
  showSubtitle?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  isLink?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  showSubtitle = true,
  size = "md",
  className,
  isLink = true,
}) => {
  const content = (
    <div className={cn("flex items-center gap-3 select-none", className)}>
      {/* STRIDE-X Official Emblem: Shield + Map Pin + Analytics */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10"
          )}
        >
          <defs>
            <linearGradient id="sxShieldGrad" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0B5ED7" />
              <stop offset="100%" stopColor="#084298" />
            </linearGradient>
            <linearGradient id="sxPinGrad" x1="14" y1="10" x2="34" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#198754" />
              <stop offset="100%" stopColor="#0F5132" />
            </linearGradient>
          </defs>

          {/* 1. Shield Base (Primary Blue #0B5ED7) */}
          <path
            d="M24 3L42 9V21C42 32 34.5 41.5 24 45C13.5 41.5 6 32 6 21V9L24 3Z"
            fill="url(#sxShieldGrad)"
          />
          <path
            d="M24 6L39 11V21C39 30 32.8 38 24 41C15.2 38 9 30 9 21V11L24 6Z"
            className="fill-[#0F172A]/30 dark:fill-slate-900/60"
          />

          {/* 2. Map Pin & Telemetry Marker (Government Green #198754) */}
          <path
            d="M24 10C18.5 10 14 14.5 14 20C14 27 24 35 24 35C24 35 34 27 34 20C34 14.5 29.5 10 24 10Z"
            fill="url(#sxPinGrad)"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />

          {/* 3. Analytics Forward-Stride Graph Bars (Orange #FD7E14 & White) */}
          <rect x="19" y="21" width="2" height="4" rx="0.5" fill="#FFFFFF" opacity="0.9" />
          <rect x="23" y="18" width="2" height="7" rx="0.5" fill="#FFFFFF" />
          <rect x="27" y="15" width="2" height="10" rx="0.5" fill="#FD7E14" />

          {/* 4. Live Telemetry Pulse Radar Core */}
          <circle cx="24" cy="14" r="2" fill="#FD7E14" className="animate-pulse" />

          {/* 5. Sovereign Golden Border Accent */}
          <path
            d="M24 3L42 9V21C42 32 34.5 41.5 24 45C13.5 41.5 6 32 6 21V9L24 3Z"
            stroke="#FD7E14"
            strokeWidth="1"
            strokeOpacity="0.75"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={cn(
              "font-black tracking-tight text-slate-900 dark:text-white leading-none",
              size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base"
            )}
          >
            STRIDE<span className="text-[#0B5ED7] dark:text-blue-400">-X</span>
          </span>
          <span className="hidden sm:inline-block text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-[#198754]/15 text-[#198754] dark:bg-emerald-950/60 dark:text-emerald-300 border border-[#198754]/30">
            Govt. of India
          </span>
          <span className="hidden md:inline-block text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-blue-100 dark:bg-blue-950/60 text-[#0B5ED7] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            DoSJE
          </span>
        </div>
        {showSubtitle && (
          <span
            className={cn(
              "text-slate-500 dark:text-slate-400 font-medium leading-tight tracking-normal mt-0.5",
              size === "sm" ? "text-[10px]" : "text-xs"
            )}
          >
            Smart Tracking & Real-time Inspection for Development and Empowerment
          </span>
        )}
      </div>
    </div>
  );

  if (isLink) {
    return (
      <Link href="/" className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B5ED7] rounded-md">
        {content}
      </Link>
    );
  }

  return content;
};
