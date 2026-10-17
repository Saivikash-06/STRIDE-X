"use client";

import React from "react";
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { MOCK_INSPECTIONS } from "@/mock/adminMockData";
import { Badge } from "@/components/ui/Badge";
import { AdminTab } from "@/types/admin";

interface InspectionWidgetProps {
  onSelectTab?: (tab: AdminTab) => void;
  className?: string;
  limit?: number;
}

// Inspector Workload distribution
const INSPECTOR_WORKLOAD_DATA = [
  { name: "Dr. Ramesh Meena", completed: 18, pending: 4 },
  { name: "Smt. Sunita Rao", completed: 15, pending: 3 },
  { name: "Shri Alok Pathak", completed: 12, pending: 5 },
  { name: "Er. Vivek Shinde", completed: 14, pending: 2 },
  { name: "Dr. Ananya Sen", completed: 10, pending: 6 },
];

// Inspection by State
const INSPECTIONS_BY_STATE = [
  { state: "UP", target: 45, done: 38 },
  { state: "MH", target: 35, done: 31 },
  { state: "RJ", target: 28, done: 22 },
  { state: "MP", target: 25, done: 20 },
  { state: "TN", target: 22, done: 19 },
  { state: "WB", target: 20, done: 14 },
];

export const InspectionWidget: React.FC<InspectionWidgetProps> = ({
  onSelectTab,
  className = "",
  limit = 4,
}) => {
  const completedCount = MOCK_INSPECTIONS.filter((i) => i.status === "COMPLETED").length;
  const scheduledCount = MOCK_INSPECTIONS.filter((i) => i.status === "SCHEDULED").length;
  const overdueCount = MOCK_INSPECTIONS.filter((i) => i.status === "OVERDUE").length;

  const displayList = limit ? MOCK_INSPECTIONS.slice(0, limit) : MOCK_INSPECTIONS;

  return (
    <div className={`p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
            <ClipboardCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              PMU Physical Inspection Telemetry
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Statutory ground audits by District Collectors & PMU Auditors
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectTab?.("inspections")}
          className="text-xs font-bold text-[#0B5ED7] dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <span>All Audits</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* 4 Cards: Today's Inspections, Pending, Completed, Overdue */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-blue-800 dark:text-blue-300 font-semibold">Today&apos;s Audits</span>
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-xl font-black text-blue-700 dark:text-blue-400 font-mono mt-1">
            {scheduledCount}
          </div>
          <span className="text-[9px] text-blue-600">Dispatched in field</span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold">Completed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-1">
            {completedCount}
          </div>
          <span className="text-[9px] text-emerald-600">Geotagged verified</span>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold">Pending Queue</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-700 dark:text-amber-400 font-mono mt-1">
            38
          </div>
          <span className="text-[9px] text-amber-600">Awaiting schedule</span>
        </div>

        <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-rose-800 dark:text-rose-300 font-semibold">Overdue Audits</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-xl font-black text-rose-700 dark:text-rose-400 font-mono mt-1">
            {overdueCount}
          </div>
          <span className="text-[9px] text-rose-600">SLA escalated</span>
        </div>
      </div>

      {/* 2 Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Inspection by State */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              State-wise Inspection Fulfillment
            </span>
            <Badge variant="primary" size="sm">Bar</Badge>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INSPECTIONS_BY_STATE}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="state" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(51, 65, 85, 0.6)",
                    borderRadius: "8px",
                    fontSize: "11px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="target" fill="#94A3B8" name="Target" radius={[2, 2, 0, 0]} />
                <Bar dataKey="done" fill="#9333EA" name="Completed" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inspector Workload Distribution */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Lead Auditor Workload Balance
            </span>
            <Badge variant="secondary" size="sm">Workload</Badge>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={INSPECTOR_WORKLOAD_DATA}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={95} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(51, 65, 85, 0.6)",
                    borderRadius: "8px",
                    fontSize: "11px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="completed" stackId="a" fill="#10B981" name="Completed" />
                <Bar dataKey="pending" stackId="a" fill="#F59E0B" name="Assigned" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Inspection Feed */}
      <div>
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-2">
          Recent Ground PMU Inspections
        </span>
        <div className="space-y-2">
          {displayList.map((insp) => (
            <div
              key={insp.id}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 flex items-center justify-between gap-3 text-xs hover:border-purple-500/50 transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {insp.inspectionId}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      insp.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : insp.status === "OVERDUE"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                    }`}
                  >
                    {insp.status}
                  </span>
                </div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                  {insp.projectName}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Auditor: {insp.inspectorName} ({insp.inspectorBadge}) • Date: {insp.scheduledDate}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono font-bold text-purple-600 block">
                  Score: {insp.scorePercent}%
                </span>
                <span className="text-[9px] text-slate-400 font-semibold">
                  {insp.criticalDefectsCount} defects noted
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
