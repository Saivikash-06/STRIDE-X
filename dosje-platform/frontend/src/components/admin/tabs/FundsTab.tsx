"use client";

import React from "react";
import { CircleDollarSign, Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FundUtilizationChart } from "@/components/admin/charts/ChartComponents";
import { MOCK_SCHEMES } from "@/mock/adminMockData";
import { useToast } from "@/hooks/useToast";

export const FundsTab: React.FC = () => {
  const { showToast } = useToast();

  const totalSanctioned = MOCK_SCHEMES.reduce((acc, s) => acc + s.budgetAllocatedCr, 0);
  const totalReleased = MOCK_SCHEMES.reduce((acc, s) => acc + s.budgetReleasedCr, 0);
  const totalUtilized = MOCK_SCHEMES.reduce((acc, s) => acc + s.budgetUtilizedCr, 0);
  const remaining = totalReleased - totalUtilized;
  const utilizationRate = ((totalUtilized / totalReleased) * 100).toFixed(1);

  const handleExport = () => {
    showToast({
      type: "success",
      title: "PFMS Reconciliation Report Exported",
      message: "Public financial accounts digest exported for parliamentary audit review.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5 text-[#0F4C81] dark:text-blue-400" />
            Public Financial Management (PFMS) & Grant Tracking
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Centralized fiscal tracking tracing grant sanction orders, installment releases, and authenticated UC reconciliations.
          </p>
        </div>

        <Button size="sm" variant="outline" onClick={handleExport} leftIcon={<Download className="w-4 h-4" />}>
          Export PFMS Digest
        </Button>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 font-medium">Sanctioned Outlay</span>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
            ₹{totalSanctioned.toFixed(0)} Cr
          </div>
          <span className="text-[10px] text-slate-400">BE 2026-27 Allocation</span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 font-medium">Released to States/NGOs</span>
          <div className="text-2xl font-black font-mono text-[#0D9488] mt-1">
            ₹{totalReleased.toFixed(0)} Cr
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">85.9% Disbursed</span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 font-medium">Utilized with UC</span>
          <div className="text-2xl font-black font-mono text-[#0F4C81] dark:text-blue-400 mt-1">
            ₹{totalUtilized.toFixed(0)} Cr
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">GFR 19-A Verified</span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 font-medium">Unspent Balance</span>
          <div className="text-2xl font-black font-mono text-amber-600 mt-1">
            ₹{remaining.toFixed(0)} Cr
          </div>
          <span className="text-[10px] text-slate-400">In State Treasuries</span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 font-medium">Effective Utilization %</span>
          <div className="text-2xl font-black font-mono text-emerald-600 mt-1">
            {utilizationRate}%
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">↑ 4.2% YoY Improvement</span>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-5 border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Scheme-wise Fund Outlay vs. UC Reconciled (₹ Crores)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Comparative analysis of budget sanction, treasury release, and certified physical utilization
            </p>
          </div>
          <Badge variant="primary" size="sm">National PFMS</Badge>
        </div>
        <FundUtilizationChart />
      </Card>

      {/* Scheme Breakdown Table */}
      <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Scheme Code</th>
                <th className="py-3 px-3">Scheme Name</th>
                <th className="py-3 px-3 text-right">Sanctioned (₹ Cr)</th>
                <th className="py-3 px-3 text-right">Released (₹ Cr)</th>
                <th className="py-3 px-3 text-right">Utilized (₹ Cr)</th>
                <th className="py-3 px-3 text-right">Unspent (₹ Cr)</th>
                <th className="py-3 px-3 text-center">Utilization Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {MOCK_SCHEMES.map((s) => {
                const pct = ((s.budgetUtilizedCr / s.budgetReleasedCr) * 100).toFixed(1);
                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {s.code}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white max-w-[280px]">
                      {s.name}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      ₹{s.budgetAllocatedCr}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-teal-600 dark:text-teal-400">
                      ₹{s.budgetReleasedCr}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#0F4C81] dark:text-blue-400">
                      ₹{s.budgetUtilizedCr}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-amber-600">
                      ₹{(s.budgetReleasedCr - s.budgetUtilizedCr).toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600">
                      {pct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
