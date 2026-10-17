"use client";

import React from "react";
import {
  CalendarCheck,
  AlertTriangle,
  TrendingUp,
  UserX,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ATTENDANCE_TREND_DATA } from "@/mock/adminMockData";
import { Badge } from "@/components/ui/Badge";
import { AdminTab, Project } from "@/types/admin";

interface AttendanceWidgetProps {
  onSelectTab?: (tab: AdminTab) => void;
  onSelectProject?: (project: Project) => void;
  className?: string;
}

const HEATMAP_HOURS = ["9 AM", "11 AM", "1 PM", "3 PM", "5 PM"];
const HEATMAP_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Heatmap density scores (0 - 100)
const HEATMAP_MATRIX = [
  [88, 94, 92, 85, 78], // Mon
  [91, 96, 94, 89, 82], // Tue
  [89, 95, 93, 87, 80], // Wed
  [92, 97, 95, 90, 83], // Thu
  [86, 92, 88, 81, 74], // Fri
  [74, 80, 78, 69, 60], // Sat
];

const LOW_ATTENDANCE_PROJECTS = [
  {
    code: "UP-LKO-001",
    name: "Ashray Welfare Senior Living Centre",
    state: "Uttar Pradesh",
    district: "Lucknow",
    rate: 58.4,
    deviation: "-38% drop",
  },
  {
    code: "BR-PAT-004",
    name: "Navjeevan De-addiction Rehab",
    state: "Bihar",
    district: "Patna",
    rate: 64.2,
    deviation: "-26% drop",
  },
  {
    code: "RJ-JAI-002",
    name: "Samarth Divyangjan Skill Workshop",
    state: "Rajasthan",
    district: "Jaipur",
    rate: 69.8,
    deviation: "-18% drop",
  },
];

export const AttendanceWidget: React.FC<AttendanceWidgetProps> = ({
  onSelectTab,
  onSelectProject: _onSelectProject,
  className = "",
}) => {

  const getHeatmapColor = (score: number) => {
    if (score >= 90) return "bg-emerald-600 text-white";
    if (score >= 80) return "bg-emerald-400 text-slate-900";
    if (score >= 70) return "bg-amber-400 text-slate-900";
    return "bg-rose-500 text-white animate-pulse";
  };

  return (
    <div className={`p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Biometric Attendance Telemetry
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              National daily Aadhaar-linked punch authentication
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectTab?.("attendance")}
          className="text-xs font-bold text-[#0B5ED7] dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <span>Full Log</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Top 3 Metric Pills */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <div className="text-[10px] text-slate-500 dark:text-slate-400">National Rate</div>
          <div className="text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5">
            92.4%
          </div>
          <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3 h-3" /> +1.2% this wk
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Low Attendance (&lt;75%)</div>
          <div className="text-lg font-black text-rose-600 font-mono mt-0.5">
            18 Centres
          </div>
          <div className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5 mt-0.5">
            <AlertTriangle className="w-3 h-3" /> Alert Triggered
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Staff Absenteeism</div>
          <div className="text-lg font-black text-amber-600 font-mono mt-0.5">
            4.2%
          </div>
          <div className="text-[10px] font-bold text-slate-500 flex items-center gap-0.5 mt-0.5">
            <UserX className="w-3 h-3" /> Normal range
          </div>
        </div>
      </div>

      {/* Trend Area Chart */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
            30-Day National Attendance Rate Trend
          </span>
          <Badge variant="success" size="sm">
            Live Stream
          </Badge>
        </div>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ATTENDANCE_TREND_DATA}>
              <defs>
                <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(51, 65, 85, 0.6)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#attGrad)"
                name="Attendance %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendance Heatmap Matrix */}
      <div>
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-2">
          Weekly Hourly Punch Density Heatmap
        </span>
        <div className="overflow-x-auto">
          <table className="w-full text-center text-[10px]">
            <thead>
              <tr>
                <th className="py-1 px-1 text-left text-slate-400">Day</th>
                {HEATMAP_HOURS.map((hr) => (
                  <th key={hr} className="py-1 px-1 font-semibold text-slate-500">
                    {hr}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HEATMAP_DAYS.map((day, dIdx) => (
                <tr key={day}>
                  <td className="py-1 px-1 text-left font-bold text-slate-700 dark:text-slate-300">
                    {day}
                  </td>
                  {HEATMAP_MATRIX[dIdx].map((score, sIdx) => (
                    <td key={sIdx} className="py-1 px-1">
                      <div
                        className={`rounded py-1 font-mono font-bold ${getHeatmapColor(score)}`}
                        title={`${day} at ${HEATMAP_HOURS[sIdx]}: ${score}% attendance`}
                      >
                        {score}%
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Attendance Centres List */}
      <div>
        <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 block mb-2">
          Flagged Low Attendance Facilities
        </span>
        <div className="space-y-2">
          {LOW_ATTENDANCE_PROJECTS.map((p) => (
            <div
              key={p.code}
              className="p-2.5 rounded-lg border border-rose-100 dark:border-rose-950 bg-rose-50/40 dark:bg-rose-950/20 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-slate-900 dark:text-white truncate max-w-xs">
                  {p.name}
                </div>
                <div className="text-[10px] text-slate-500">
                  {p.district}, {p.state} • {p.code}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono font-bold text-rose-600 block">
                  {p.rate}%
                </span>
                <span className="text-[9px] text-rose-500 font-semibold">{p.deviation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
