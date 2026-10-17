"use client";

import React from "react";
import { CalendarCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AttendanceTrendChart } from "@/components/admin/charts/ChartComponents";
import { MOCK_PROJECTS } from "@/mock/adminMockData";

export const AttendanceTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-[#0F4C81] dark:text-blue-400" />
          National Biometric Attendance Telemetry
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time biometric punch tracking and facial telemetry ensuring genuine beneficiary presence at welfare centres.
        </p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 font-medium">National Attendance Rate</span>
          <div className="text-2xl font-black font-mono text-[#0F4C81] dark:text-blue-400 mt-1">
            92.4%
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">↑ 1.8% vs last week</span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 font-medium">Today&apos;s Check-ins</span>
          <div className="text-2xl font-black font-mono text-emerald-600 mt-1">
            1,698,420
          </div>
          <span className="text-[10px] text-slate-400">Captured by 11:30 AM</span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 font-medium">Monthly Attendance Trend</span>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
            91.7%
          </div>
          <span className="text-[10px] text-slate-400">30-day weighted average</span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 font-medium">Absent Count</span>
          <div className="text-2xl font-black font-mono text-amber-600 mt-1">
            141,580
          </div>
          <span className="text-[10px] text-slate-400">7.6% variance</span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 font-medium">Late / Proxy Suspicions</span>
          <div className="text-2xl font-black font-mono text-rose-600 mt-1">
            42
          </div>
          <span className="text-[10px] text-rose-500 font-semibold">Flagged for inspection</span>
        </Card>
      </div>

      {/* Attendance Chart */}
      <Card className="p-5 border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Weekly Biometric Punch Distribution (%)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Verified daily attendance punches across all 2,480 approved welfare centers
            </p>
          </div>
          <Badge variant="success" size="sm">Live Telemetry</Badge>
        </div>
        <AttendanceTrendChart />
      </Card>

      {/* Center Punch Roster Summary */}
      <Card className="p-5 border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          Facility Hardware & Biometric Punch Verification
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {MOCK_PROJECTS.slice(0, 6).map((prj) => (
            <div key={prj.id} className="py-2.5 flex items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{prj.name}</span>
                <span className="text-[10px] text-slate-500">{prj.district}, {prj.state} • {prj.ngoName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-emerald-600 font-bold">{prj.beneficiariesCount} Punches Verified</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${prj.biometricActive ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300" : "bg-rose-100 text-rose-800"}`}>
                  {prj.biometricActive ? "ONLINE" : "DEVICE FAULT"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
