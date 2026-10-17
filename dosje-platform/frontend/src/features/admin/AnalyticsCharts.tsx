"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Line,
} from "recharts";
import {
  SCHEME_DISTRIBUTION_DATA,
  FUND_UTILIZATION_DATA,
  COMPLAINT_TRENDS_DATA,
  MOCK_SCHEMES,
} from "@/mock/adminMockData";
import {
  Layers,
  MessageSquareWarning,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const customTooltipStyle = {
  backgroundColor: "rgba(15, 23, 42, 0.95)",
  border: "1px solid rgba(51, 65, 85, 0.6)",
  borderRadius: "8px",
  color: "#F8FAFC",
  fontSize: "12px",
  padding: "8px 12px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
};

// Beneficiaries by scheme data
const BENEFICIARIES_BY_SCHEME = MOCK_SCHEMES.map((s) => ({
  name: s.code,
  beneficiaries: Math.round(s.beneficiariesCount / 1000), // in Thousands
  fullName: s.name,
}));

// Scheme Performance & Completion Rate
const SCHEME_PERFORMANCE_DATA = MOCK_SCHEMES.map((s) => {
  const completionRate = Math.round((s.budgetUtilizedCr / s.budgetAllocatedCr) * 100);
  return {
    name: s.code,
    completionRate,
    target: 100,
    activeProjects: s.activeProjectsCount,
  };
});

// Daily Complaints Grievance data (last 7 days)
const DAILY_COMPLAINTS_DATA = [
  { day: "Mon", lodged: 24, verified: 21, resolved: 18, pending: 6 },
  { day: "Tue", lodged: 32, verified: 29, resolved: 25, pending: 7 },
  { day: "Wed", lodged: 28, verified: 26, resolved: 24, pending: 4 },
  { day: "Thu", lodged: 36, verified: 34, resolved: 30, pending: 6 },
  { day: "Fri", lodged: 40, verified: 37, resolved: 32, pending: 8 },
  { day: "Sat", lodged: 18, verified: 16, resolved: 15, pending: 3 },
  { day: "Sun", lodged: 12, verified: 11, resolved: 10, pending: 2 },
];

// Grievance Categories distribution
const GRIEVANCE_CATEGORIES_DATA = [
  { name: "Grant Not Received", value: 38, fill: "#EF4444" },
  { name: "Infrastructure Deficit", value: 24, fill: "#F59E0B" },
  { name: "Food/Ration Quality", value: 16, fill: "#10B981" },
  { name: "False Attendance", value: 12, fill: "#6366F1" },
  { name: "Harassment/Other", value: 10, fill: "#8B5CF6" },
];

interface AnalyticsChartsProps {
  className?: string;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ className = "" }) => {
  const [activeTab, setActiveTab] = useState<"schemes" | "grievances">("schemes");

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Tab Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-[#0B5ED7] dark:text-blue-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Central Analytical Intelligence Suite
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time statistical synthesis across welfare programs, DBT disbursements, and CPGRAMS redressal.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab("schemes")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "schemes"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Scheme Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab("grievances")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "grievances"
                ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <MessageSquareWarning className="w-3.5 h-3.5" />
            <span>Grievance Redressal</span>
          </button>
        </div>
      </div>

      {/* SCHEME ANALYTICS VIEW */}
      {activeTab === "schemes" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Chart 1: Projects by Scheme */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  1. Active Projects by Scheme
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Distribution of 2,480 facilities nationwide
                </p>
              </div>
              <Badge variant="primary" size="sm">
                Donut
              </Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SCHEME_DISTRIBUTION_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {SCHEME_DISTRIBUTION_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Beneficiaries by Scheme */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  2. Beneficiaries by Scheme (&apos;000s)
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Aadhaar e-KYC authenticated recipients
                </p>
              </div>
              <Badge variant="secondary" size="sm">
                Bar
              </Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BENEFICIARIES_BY_SCHEME}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Bar
                    dataKey="beneficiaries"
                    fill="#3B82F6"
                    name="Beneficiaries ('000)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Budget Utilization (Allocated vs Released vs Utilized) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  3. Public Fund Utilization (₹ Crores)
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Allocated vs Released vs Utilized per scheme
                </p>
              </div>
              <Badge variant="primary" size="sm">
                Grouped Bar
              </Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FUND_UTILIZATION_DATA}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="scheme" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Bar dataKey="sanctioned" fill="#94A3B8" name="Sanctioned" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="released" fill="#0EA5E9" name="Released" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="utilized" fill="#10B981" name="Utilized (UC)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Scheme Performance & Completion Rate */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  4. Scheme Completion & Efficiency %
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Target achievement index and fund burn rate
                </p>
              </div>
              <Badge variant="success" size="sm">
                Progress
              </Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SCHEME_PERFORMANCE_DATA}>
                  <defs>
                    <linearGradient id="compGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="completionRate"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#compGradient)"
                    name="Completion %"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#94A3B8"
                    strokeDasharray="4 4"
                    name="100% Target"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* GRIEVANCES ANALYTICS VIEW */}
      {activeTab === "grievances" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Chart 1: Daily Intake & Verification */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  1. Daily Grievance Intake & Verification
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  7-Day CPGRAMS & Citizen portal ticket throughput
                </p>
              </div>
              <Badge variant="warning" size="sm">
                Daily
              </Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DAILY_COMPLAINTS_DATA}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Bar dataKey="lodged" fill="#F59E0B" name="Lodged" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="verified" fill="#3B82F6" name="Verified" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="resolved" fill="#10B981" name="Resolved" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Monthly Resolution Trend */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  2. Monthly Grievance Redressal Timeline
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Total lodged vs. resolved within SLA-48
                </p>
              </div>
              <Badge variant="primary" size="sm">
                Monthly
              </Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={COMPLAINT_TRENDS_DATA}>
                  <defs>
                    <linearGradient id="lodgedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={customTooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Area
                    type="monotone"
                    dataKey="received"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#lodgedGrad)"
                    name="Lodged"
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#resolvedGrad)"
                    name="Resolved"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Grievance Categories */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  3. Grievances by Issue Category
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Classification of beneficiary complaints
                </p>
              </div>
              <Badge variant="danger" size="sm">
                Category
              </Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={GRIEVANCE_CATEGORIES_DATA}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }: { name?: string; percent?: number }) => `${name || ""} ${(Number(percent || 0) * 100).toFixed(0)}%`}
                    dataKey="value"
                  >
                    {GRIEVANCE_CATEGORIES_DATA.map((entry, index) => (
                      <Cell key={`cat-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={customTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: SLA Compliance Rate */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    4. Citizen Service SLA-48 Compliance
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Mandatory 48-hour resolution audit
                  </p>
                </div>
                <Badge variant="success" size="sm">
                  96.4% Met
                </Badge>
              </div>

              <div className="space-y-4 pt-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Resolved within 24 Hours</span>
                    <span className="text-emerald-600 font-mono">72.4%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "72.4%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Resolved between 24 - 48 Hours</span>
                    <span className="text-blue-600 font-mono">24.0%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "24%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Escalated to District Collector (&gt; 48 Hours)</span>
                    <span className="text-rose-600 font-mono">3.6%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: "3.6%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span>Integrated with Central CPGRAMS Portal</span>
              <span className="text-emerald-600 font-semibold">Average Turnaround: 28.2 hrs</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
