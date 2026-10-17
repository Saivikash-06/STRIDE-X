"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Layers,
  FolderKanban,
  Building2,
  Users,
  ShieldAlert,
  MessageSquareWarning,
  ClipboardCheck,
  CheckCircle2,
  CircleDollarSign,
  Camera,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { AdminTab } from "@/types/admin";

export interface KPICardData {
  id: string;
  title: string;
  count: string;
  growth: string;
  trend: "up" | "down" | "neutral";
  badgeText: string;
  badgeColor: "blue" | "emerald" | "teal" | "indigo" | "rose" | "amber" | "purple" | "cyan" | "sky";
  sparklineData: number[];
  icon: React.ReactNode;
  targetTab?: AdminTab;
  subtext: string;
}

interface KPICardsProps {
  onCardClick?: (tab: AdminTab) => void;
  isLoading?: boolean;
}

const DEFAULT_KPIS: KPICardData[] = [
  {
    id: "schemes",
    title: "Total Schemes",
    count: "8",
    growth: "+0 Active",
    trend: "neutral",
    badgeText: "Centrally Sponsored",
    badgeColor: "blue",
    sparklineData: [6, 6, 7, 7, 8, 8, 8],
    icon: <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    targetTab: "schemes",
    subtext: "100% active operational guidelines",
  },
  {
    id: "projects",
    title: "Active Projects",
    count: "2,480",
    growth: "+12.4% YoY",
    trend: "up",
    badgeText: "36 States/UTs",
    badgeColor: "emerald",
    sparklineData: [1980, 2100, 2220, 2350, 2400, 2440, 2480],
    icon: <FolderKanban className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    targetTab: "projects",
    subtext: "Nationwide welfare facilities",
  },
  {
    id: "ngos",
    title: "Registered NGOs",
    count: "865",
    growth: "+6.8% MoM",
    trend: "up",
    badgeText: "NITI Darpan Vetted",
    badgeColor: "teal",
    sparklineData: [780, 795, 810, 830, 845, 855, 865],
    icon: <Building2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    targetTab: "ngos",
    subtext: "Empaneled implementing agencies",
  },
  {
    id: "beneficiaries",
    title: "Total Beneficiaries",
    count: "1.84M",
    growth: "+8.9% MoM",
    trend: "up",
    badgeText: "Aadhaar e-KYC Verified",
    badgeColor: "indigo",
    sparklineData: [1.4, 1.52, 1.6, 1.68, 1.74, 1.8, 1.84],
    icon: <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    targetTab: "beneficiaries",
    subtext: "Direct DBT & amenity recipients",
  },
  {
    id: "high-risk",
    title: "High Risk Projects",
    count: "90",
    growth: "-4.2% Mitigated",
    trend: "down",
    badgeText: "Urgent Attention",
    badgeColor: "rose",
    sparklineData: [112, 108, 104, 98, 95, 92, 90],
    icon: <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
    targetTab: "ai-risk",
    subtext: "Flagged by AI threat engine",
  },
  {
    id: "pending-grievances",
    title: "Pending Grievances",
    count: "142",
    growth: "< 48h SLA",
    trend: "down",
    badgeText: "CPGRAMS Synced",
    badgeColor: "amber",
    sparklineData: [195, 180, 168, 160, 152, 147, 142],
    icon: <MessageSquareWarning className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    targetTab: "grievances",
    subtext: "Average turnaround: 28 hours",
  },
  {
    id: "pending-inspections",
    title: "Pending Inspections",
    count: "38",
    growth: "-18% Overdue",
    trend: "down",
    badgeText: "PMU Field Queue",
    badgeColor: "purple",
    sparklineData: [64, 58, 52, 49, 44, 41, 38],
    icon: <ClipboardCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    targetTab: "inspections",
    subtext: "District collectors & auditors assigned",
  },
  {
    id: "compliance-rate",
    title: "Compliance Rate",
    count: "94.2%",
    growth: "+3.1% QoQ",
    trend: "up",
    badgeText: "Statutory GFR-19A",
    badgeColor: "cyan",
    sparklineData: [89, 90.2, 91.5, 92, 93.1, 93.8, 94.2],
    icon: <CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
    targetTab: "compliance",
    subtext: "2,336 of 2,480 projects compliant",
  },
  {
    id: "fund-utilization",
    title: "Fund Utilization %",
    count: "81.6%",
    growth: "₹3,180 Cr Spent",
    trend: "up",
    badgeText: "PFMS Direct Sync",
    badgeColor: "emerald",
    sparklineData: [62, 67, 71, 74, 77, 79, 81.6],
    icon: <CircleDollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    targetTab: "funds",
    subtext: "Sanctioned ₹3,895 Cr total pool",
  },
  {
    id: "cctv-cameras",
    title: "Online CCTV Cameras",
    count: "1,420",
    growth: "95.9% Uptime",
    trend: "up",
    badgeText: "1,480 Total Feeds",
    badgeColor: "sky",
    sparklineData: [1360, 1375, 1390, 1402, 1410, 1415, 1420],
    icon: <Camera className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
    targetTab: "cctv",
    subtext: "60 cameras currently offline",
  },
];

// Mini SVG Sparkline generator
const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const colorMap: Record<string, { stroke: string; fill: string }> = {
    blue: { stroke: "#2563EB", fill: "rgba(37, 99, 235, 0.15)" },
    emerald: { stroke: "#059669", fill: "rgba(5, 150, 105, 0.15)" },
    teal: { stroke: "#0D9488", fill: "rgba(13, 148, 136, 0.15)" },
    indigo: { stroke: "#4F46E5", fill: "rgba(79, 70, 229, 0.15)" },
    rose: { stroke: "#E11D48", fill: "rgba(225, 29, 72, 0.15)" },
    amber: { stroke: "#D97706", fill: "rgba(217, 119, 6, 0.15)" },
    purple: { stroke: "#9333EA", fill: "rgba(147, 51, 234, 0.15)" },
    cyan: { stroke: "#0891B2", fill: "rgba(8, 145, 178, 0.15)" },
    sky: { stroke: "#0284C7", fill: "rgba(2, 132, 199, 0.15)" },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={c.stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export const KPICards: React.FC<KPICardsProps> = ({ onCardClick, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
            <div className="w-24 h-7 bg-slate-200 dark:bg-slate-800 rounded mt-2" />
            <div className="w-32 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="w-full h-5 bg-slate-100 dark:bg-slate-800/60 rounded pt-2" />
          </div>
        ))}
      </div>
    );
  }

  const badgeStyles: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60",
    teal: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/60",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/60",
    rose: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60",
    amber: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60",
    purple: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/60",
    sky: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/60",
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            National Performance Benchmarks (10 Core KPIs)
          </h2>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Live Sync
          </span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          Refreshed 2m ago
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {DEFAULT_KPIS.map((card, idx) => {
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => card.targetTab && onCardClick?.(card.targetTab)}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between"
            >
              {/* Top Accent Strip on Hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-[#0B5ED7] transition-colors" />

              <div>
                {/* Header: Icon, Badge, Sparkline */}
                <div className="flex items-center justify-between gap-2">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 shrink-0 group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <Sparkline data={card.sparklineData} color={card.badgeColor} />
                </div>

                {/* Counter & Title */}
                <div className="mt-3">
                  <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                    {card.count}
                  </div>
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                    {card.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {card.subtext}
                  </p>
                </div>
              </div>

              {/* Footer: Growth & Badge */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1 text-[10px]">
                <div
                  className={`inline-flex items-center gap-0.5 font-bold ${
                    card.trend === "up"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : card.trend === "down"
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {card.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : card.trend === "down" ? (
                    <ArrowDownRight className="w-3 h-3" />
                  ) : null}
                  <span>{card.growth}</span>
                </div>

                <span
                  className={`px-1.5 py-0.5 rounded border text-[9px] font-semibold tracking-wide ${
                    badgeStyles[card.badgeColor] || badgeStyles.blue
                  }`}
                >
                  {card.badgeText}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
