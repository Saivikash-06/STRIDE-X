"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { MOCK_AUTHORITY_PROJECTS } from "@/mock/authorityMockData";
import { Card } from "@/components/ui/Card";

export const AuthorityAttendanceTab: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState("September 2026");

  // Comparison data across the 15 projects
  const comparisonData = MOCK_AUTHORITY_PROJECTS.map((p) => ({
    name: p.projectCode.split("-").slice(0, 3).join("-"),
    fullName: p.name,
    district: p.district,
    attendance: p.attendancePercent,
  }));

  // Low attendance alert projects (< 75%)
  const lowAttendanceProjects = MOCK_AUTHORITY_PROJECTS.filter((p) => p.attendancePercent < 75);

  // 30 days attendance heatmap grid simulation
  const days = Array.from({ length: 30 }).map((_, i) => {
    const day = i + 1;
    // Generate realistic daily rates
    const rate = Math.round(78 + Math.sin(i / 2) * 12 + ((i * 3) % 7));
    return { day, rate: Math.min(98, Math.max(55, rate)) };
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            Biometric Attendance Telemetry & Heatmap
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Aadhaar-authenticated biometric sensor telemetry across 15 welfare facilities in Maharashtra.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold"
          >
            <option value="September 2026">September 2026 (Active)</option>
            <option value="August 2026">August 2026</option>
            <option value="July 2026">July 2026</option>
          </select>
        </div>
      </div>

      {/* Top Attendance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Today&apos;s Attendance Rate
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono flex items-baseline gap-2">
            87.4%
            <span className="text-xs text-emerald-600 font-bold flex items-center">
              <TrendingUp className="w-3 h-3" /> +1.8%
            </span>
          </div>
          <span className="text-[10px] text-slate-400">1,248 Verified punches today</span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Monthly Average
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            88.2%
          </div>
          <span className="text-[10px] text-slate-400">Across 15 operational projects</span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Biometric Hardware
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            14 / 15
          </div>
          <span className="text-[10px] text-slate-400">1 Machine hardware defect in Thane</span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Low Attendance Alerts
          </span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 font-mono">
            {lowAttendanceProjects.length} Facilities
          </div>
          <span className="text-[10px] text-rose-500 font-semibold">Below 75% threshold</span>
        </Card>
      </div>

      {/* Low Attendance Alerts Callout */}
      {lowAttendanceProjects.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-2">
          <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Urgent: Low Attendance Warning in {lowAttendanceProjects.length} Facilities</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {lowAttendanceProjects.map((p) => (
              <div
                key={p.id}
                className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-slate-400">{p.district}</div>
                </div>
                <span className="px-2 py-0.5 rounded font-mono font-black text-xs bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  {p.attendancePercent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Project-wise Attendance Comparison */}
        <Card className="p-5 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Facility Attendance Comparison (%)
              </h3>
              <p className="text-[11px] text-slate-500">
                Sorted across 15 facilities (Red below 75%)
              </p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" angle={-45} textAnchor="end" tick={{ fontSize: 9.5 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="attendance" name="Attendance %" fill="#0F4C81" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Heatmap: 30-Day September Attendance Heatmap Grid */}
        <Card className="p-5 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  September 2026 Daily Attendance Heatmap
                </h3>
                <p className="text-[11px] text-slate-500">
                  Day-by-day statewide punch density
                </p>
              </div>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>

            {/* Grid of 30 days */}
            <div className="grid grid-cols-6 sm:grid-cols-6 gap-2 my-4">
              {days.map((d) => {
                const color =
                  d.rate >= 90
                    ? "bg-emerald-500 text-white"
                    : d.rate >= 80
                    ? "bg-emerald-400 text-slate-900"
                    : d.rate >= 70
                    ? "bg-amber-400 text-slate-900"
                    : "bg-rose-500 text-white";

                return (
                  <div
                    key={d.day}
                    className={`p-2 rounded-lg text-center font-mono transition-transform hover:scale-105 cursor-pointer shadow-xs ${color}`}
                    title={`Day ${d.day}: ${d.rate}% Attendance`}
                  >
                    <div className="text-[10px] font-bold opacity-80">Day {d.day}</div>
                    <div className="text-xs font-black">{d.rate}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>&lt; 70% Alert</span>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-rose-500" />
              <span className="w-3 h-3 rounded bg-amber-400" />
              <span className="w-3 h-3 rounded bg-emerald-400" />
              <span className="w-3 h-3 rounded bg-emerald-500" />
            </div>
            <span>&gt; 90% Optimal</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
