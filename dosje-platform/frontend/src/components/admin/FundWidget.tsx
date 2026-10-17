"use client";

import React from "react";
import {
  CircleDollarSign,
  AlertTriangle,
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
  Legend,
} from "recharts";
import { FUND_UTILIZATION_DATA } from "@/mock/adminMockData";
import { Badge } from "@/components/ui/Badge";
import { AdminTab } from "@/types/admin";

interface FundWidgetProps {
  onSelectTab?: (tab: AdminTab) => void;
  className?: string;
}

export const FundWidget: React.FC<FundWidgetProps> = ({
  onSelectTab,
  className = "",
}) => {
  const sanctionedTotal = 4600; // in Cr
  const releasedTotal = 3895; // in Cr
  const utilizedTotal = 3180; // in Cr
  const remainingTotal = releasedTotal - utilizedTotal; // 715 Cr

  const utilizationRate = Math.round((utilizedTotal / releasedTotal) * 100);

  const fundPipeline = [
    { label: "Sanctioned Grant Pool", value: `₹${sanctionedTotal.toLocaleString()} Cr`, pct: 100, color: "bg-slate-400" },
    { label: "Released by Ministry (PFMS)", value: `₹${releasedTotal.toLocaleString()} Cr`, pct: 84.7, color: "bg-blue-500" },
    { label: "Utilized with Verified UC", value: `₹${utilizedTotal.toLocaleString()} Cr`, pct: 69.1, color: "bg-emerald-500" },
    { label: "Unspent Balance with NGOs", value: `₹${remainingTotal.toLocaleString()} Cr`, pct: 15.6, color: "bg-amber-500" },
  ];

  return (
    <div className={`p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
            <CircleDollarSign className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Public Finance & PFMS Direct Benefit Tracking
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Centrally Sponsored Scheme grant flow, escrow balances & GFR-19A utilization
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectTab?.("funds")}
          className="text-xs font-bold text-[#0B5ED7] dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <span>PFMS Portal</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">Total Sanctioned</span>
          <div className="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
            ₹{sanctionedTotal} Cr
          </div>
          <span className="text-[9px] text-slate-400">Cabinet budget pool</span>
        </div>

        <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60">
          <span className="text-[10px] text-blue-800 dark:text-blue-300 font-semibold block">Released (PFMS)</span>
          <div className="text-xl font-black text-blue-700 dark:text-blue-400 font-mono mt-0.5">
            ₹{releasedTotal} Cr
          </div>
          <span className="text-[9px] text-blue-600">84.7% of sanction</span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
          <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold block">Utilized (UC Vetted)</span>
          <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
            ₹{utilizedTotal} Cr
          </div>
          <span className="text-[9px] text-emerald-600">{utilizationRate}% burn rate</span>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60">
          <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold block">Unspent Balance</span>
          <div className="text-xl font-black text-amber-700 dark:text-amber-400 font-mono mt-0.5">
            ₹{remainingTotal} Cr
          </div>
          <span className="text-[9px] text-amber-600">Pending Q4 release</span>
        </div>
      </div>

      {/* Grant Pipeline Flow Bars */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-2">
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
          Central Fund Disbursal & Verification Pipeline
        </span>
        <div className="space-y-2">
          {fundPipeline.map((item) => (
            <div key={item.label} className="text-[11px]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{item.value}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart: Scheme-wise Sanctioned vs Utilized */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
            Scheme-wise Public Expenditure (PFMS)
          </span>
          <Badge variant="primary" size="sm">Bar Chart</Badge>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={FUND_UTILIZATION_DATA}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="scheme" tick={{ fontSize: 10 }} />
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
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              <Bar dataKey="sanctioned" fill="#94A3B8" name="Sanctioned" radius={[2, 2, 0, 0]} />
              <Bar dataKey="released" fill="#0EA5E9" name="Released" radius={[2, 2, 0, 0]} />
              <Bar dataKey="utilized" fill="#10B981" name="Utilized" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fund Warning Banner */}
      <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 text-amber-900 dark:text-amber-200 text-xs">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Public Finance Warning:</span> 12 NGOs have unspent balances exceeding 6 months without GFR-19A justification. Second tranche disbursements have been automatically placed on escrow hold.
        </div>
      </div>
    </div>
  );
};
