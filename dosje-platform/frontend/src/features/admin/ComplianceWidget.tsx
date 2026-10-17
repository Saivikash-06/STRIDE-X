"use client";

import React from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileText,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { COMPLIANCE_STATUS_DATA, MOCK_COMPLIANCE_CASES } from "@/mock/adminMockData";
import { Badge } from "@/components/ui/Badge";
import { AdminTab, ComplianceCase } from "@/types/admin";

interface ComplianceWidgetProps {
  onSelectTab?: (tab: AdminTab) => void;
  className?: string;
  limit?: number;
}

const DEADLINE_TRACKING_DATA = [
  { timeframe: "Overdue", cases: 14, fill: "#EF4444" },
  { timeframe: "Due < 7 Days", cases: 26, fill: "#F59E0B" },
  { timeframe: "Due 7-30 Days", cases: 48, fill: "#3B82F6" },
  { timeframe: "Due > 30 Days", cases: 92, fill: "#10B981" },
];

export const ComplianceWidget: React.FC<ComplianceWidgetProps> = ({
  onSelectTab,
  className = "",
  limit = 3,
}) => {
  const compliantCount = 2336;
  const nonCompliantCount = 90;
  const underReviewCount = 38;
  const correctiveActionCount = 16;

  const displayCases: ComplianceCase[] = limit ? MOCK_COMPLIANCE_CASES.slice(0, limit) : MOCK_COMPLIANCE_CASES;

  return (
    <div className={`p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Statutory Compliance & GFR-19A Matrix
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              General Financial Rules audit, Utilization Certificates & statutory compliance
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectTab?.("compliance")}
          className="text-xs font-bold text-[#0B5ED7] dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <span>All Cases</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* 4 Cards: Compliant, Non-Compliant, Under Review, Corrective Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold">Compliant</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-1">
            {compliantCount}
          </div>
          <span className="text-[9px] text-emerald-600">94.2% statutory rate</span>
        </div>

        <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-rose-800 dark:text-rose-300 font-semibold">Non-Compliant</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-xl font-black text-rose-700 dark:text-rose-400 font-mono mt-1">
            {nonCompliantCount}
          </div>
          <span className="text-[9px] text-rose-600">Notice issued</span>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold">Under Review</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-700 dark:text-amber-400 font-mono mt-1">
            {underReviewCount}
          </div>
          <span className="text-[9px] text-amber-600">Pending officer review</span>
        </div>

        <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-blue-800 dark:text-blue-300 font-semibold">Corrective Action</span>
            <FileText className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-xl font-black text-blue-700 dark:text-blue-400 font-mono mt-1">
            {correctiveActionCount}
          </div>
          <span className="text-[9px] text-blue-600">Under rectification</span>
        </div>
      </div>

      {/* 2 Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Compliance % Breakdown Donut */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              National Compliance Breakdown
            </span>
            <Badge variant="success" size="sm">Donut</Badge>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={COMPLIANCE_STATUS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {COMPLIANCE_STATUS_DATA.map((entry, index) => (
                    <Cell key={`comp-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(51, 65, 85, 0.6)",
                    borderRadius: "8px",
                    fontSize: "11px",
                    color: "#fff",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deadline Tracking Bar */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              UC Submission Deadline Tracking
            </span>
            <Badge variant="warning" size="sm">Deadlines</Badge>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEADLINE_TRACKING_DATA}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="timeframe" tick={{ fontSize: 9 }} />
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
                <Bar dataKey="cases" radius={[3, 3, 0, 0]}>
                  {DEADLINE_TRACKING_DATA.map((entry, index) => (
                    <Cell key={`dl-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Statutory Notice Alerts */}
      <div>
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-2">
          Statutory Show-Cause Notices & Action Plans
        </span>
        <div className="space-y-2">
          {displayCases.map((c) => (
            <div
              key={c.id}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 flex items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {c.complianceId}
                  </span>
                  <Badge variant={c.severity === "CRITICAL" ? "danger" : c.severity === "HIGH" ? "warning" : "primary"} size="sm">
                    {c.severity}
                  </Badge>
                </div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                  {c.projectName} • {c.ngoName}
                </div>
                <div className="text-[10px] text-slate-500">
                  Observation: {c.observation}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 block">
                  Deadline: {c.deadline}
                </span>
                <span className="text-[9px] text-rose-500 font-bold">
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
