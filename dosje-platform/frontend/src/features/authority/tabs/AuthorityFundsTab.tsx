"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  FileCheck2,
  PieChart as PieIcon,
  BarChart3,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { MOCK_AUTHORITY_FUNDS } from "@/mock/authorityMockData";

// Monthly fund flow telemetry (Maharashtra FY 2026-27 Apr-Sep)
const MONTHLY_FUND_FLOW = [
  { month: "Apr 2026", released: 48.0, utilized: 42.5 },
  { month: "May 2026", released: 52.0, utilized: 47.8 },
  { month: "Jun 2026", released: 45.0, utilized: 43.1 },
  { month: "Jul 2026", released: 55.0, utilized: 51.4 },
  { month: "Aug 2026", released: 38.0, utilized: 35.8 },
  { month: "Sep 2026", released: 35.0, utilized: 27.5 },
];

export default function AuthorityFundsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScheme, setSelectedScheme] = useState("ALL");

  // Filtered Scheme Fund Data
  const filteredFunds = useMemo(() => {
    return MOCK_AUTHORITY_FUNDS.filter((f) => {
      const matchesSearch =
        f.schemeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.schemeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesScheme = selectedScheme === "ALL" || f.schemeId === selectedScheme;
      return matchesSearch && matchesScheme;
    });
  }, [searchTerm, selectedScheme]);

  // Aggregate Totals across Maharashtra
  const aggregateMetrics = useMemo(() => {
    const totalAllocated = MOCK_AUTHORITY_FUNDS.reduce((sum, f) => sum + f.allocatedCr, 0);
    const totalReleased = MOCK_AUTHORITY_FUNDS.reduce((sum, f) => sum + f.releasedCr, 0);
    const totalUtilized = MOCK_AUTHORITY_FUNDS.reduce((sum, f) => sum + f.utilizedCr, 0);
    const remaining = totalReleased - totalUtilized;
    const avgUtilization = ((totalUtilized / totalReleased) * 100).toFixed(1);
    const totalUcPending = MOCK_AUTHORITY_FUNDS.reduce((sum, f) => sum + f.ucPendingCr, 0);

    return {
      allocated: totalAllocated.toFixed(1),
      released: totalReleased.toFixed(1),
      utilized: totalUtilized.toFixed(1),
      remaining: remaining.toFixed(1),
      utilizationPercent: avgUtilization,
      ucPending: totalUcPending.toFixed(1),
    };
  }, []);

  const handleExportCSV = () => {
    const headers = [
      "Scheme ID",
      "Scheme Name",
      "Allocated (Cr)",
      "Released (Cr)",
      "Utilized (Cr)",
      "Remaining (Cr)",
      "Utilization (%)",
      "UC Pending (Cr)",
      "Active Projects",
      "Districts Covered",
    ];
    const rows = filteredFunds.map((f) => [
      f.schemeId,
      `"${f.schemeName.replace(/"/g, '""')}"`,
      f.allocatedCr,
      f.releasedCr,
      f.utilizedCr,
      (f.releasedCr - f.utilizedCr).toFixed(1),
      f.utilizationPercent,
      f.ucPendingCr,
      f.activeProjects,
      f.districtsCovered,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DoSJE_Fund_Tracking_Maharashtra_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sanctioned Outlay</span>
            <Layers className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">₹{aggregateMetrics.allocated}</span>
            <span className="text-xs font-semibold text-slate-500">Cr</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">State Budget Approved</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Treasury Released</span>
            <IndianRupee className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-indigo-600">₹{aggregateMetrics.released}</span>
            <span className="text-xs font-semibold text-indigo-600">Cr</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">PFMS Transferred</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Utilized on Ground</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-emerald-600">₹{aggregateMetrics.utilized}</span>
            <span className="text-xs font-semibold text-emerald-600">Cr</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Verified expenditure</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Utilization Rate</span>
            <FileCheck2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-blue-600">{aggregateMetrics.utilizationPercent}%</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Benchmark &gt; 85%</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending UC Audit</span>
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-amber-600">₹{aggregateMetrics.ucPending}</span>
            <span className="text-xs font-semibold text-amber-600">Cr</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">GFR 238(1) awaiting</p>
        </div>
      </div>

      {/* Fund Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Utilization Line Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Monthly Treasury Release vs Field Utilization (Cr)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">FY 2026-27 Q1 - Q2 expenditure trajectory</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_FUND_FLOW} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(val: unknown) => [`₹${val} Cr`, ""]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Line
                  type="monotone"
                  dataKey="released"
                  name="Released (Cr)"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="utilized"
                  name="Utilized (Cr)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scheme-wise Allocation Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-600" />
                Scheme-wise Outlay vs Utilization
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Comparison across the 5 flagship DoSJE schemes</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={MOCK_AUTHORITY_FUNDS.map((f) => ({
                  name: f.schemeId.replace("SCH-", "S-"),
                  fullName: f.schemeName,
                  Allocated: f.allocatedCr,
                  Released: f.releasedCr,
                  Utilized: f.utilizedCr,
                }))}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(val: unknown) => [`₹${val} Cr`, ""]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="Allocated" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Released" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Utilized" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Export CSV */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search scheme name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedScheme}
            onChange={(e) => setSelectedScheme(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Schemes ({MOCK_AUTHORITY_FUNDS.length})</option>
            {MOCK_AUTHORITY_FUNDS.map((f) => (
              <option key={f.id} value={f.schemeId}>
                {f.schemeName}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Scheme-wise Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Scheme-wise Fund Utilization Ledger
          </h3>
          <span className="text-xs text-slate-500">Department of Social Justice, Maharashtra</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Scheme</th>
                <th className="py-3 px-4 text-right">Allocated (Cr)</th>
                <th className="py-3 px-4 text-right">Released (Cr)</th>
                <th className="py-3 px-4 text-right">Utilized (Cr)</th>
                <th className="py-3 px-4 text-right">Remaining (Cr)</th>
                <th className="py-3 px-4">Utilization (%)</th>
                <th className="py-3 px-4 text-right">UC Pending (Cr)</th>
                <th className="py-3 px-4 text-center">Projects</th>
                <th className="py-3 px-4 text-center">Districts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredFunds.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 max-w-xs">
                    <p className="font-semibold text-slate-900 dark:text-white">{item.schemeName}</p>
                    <span className="font-mono text-xs text-blue-600 dark:text-blue-400">{item.schemeId}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-600 dark:text-slate-300">
                    ₹{item.allocatedCr.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-indigo-600 dark:text-indigo-400">
                    ₹{item.releasedCr.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{item.utilizedCr.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 dark:text-slate-400 font-medium">
                    ₹{(item.releasedCr - item.utilizedCr).toFixed(1)}
                  </td>
                  <td className="py-3 px-4 w-48">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.utilizationPercent >= 90
                              ? "bg-emerald-500"
                              : item.utilizationPercent >= 80
                              ? "bg-blue-500"
                              : "bg-amber-500"
                          }`}
                          style={{ width: `${Math.min(100, item.utilizationPercent)}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white w-10 text-right">
                        {item.utilizationPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`font-medium text-xs ${
                        item.ucPendingCr > 5 ? "text-rose-600 font-bold" : "text-amber-600"
                      }`}
                    >
                      ₹{item.ucPendingCr.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.activeProjects}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {item.districtsCovered} / 5
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
