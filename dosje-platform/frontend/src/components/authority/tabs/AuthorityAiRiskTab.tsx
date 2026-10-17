"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  BrainCircuit,
  Filter,
  Info,
} from "lucide-react";
import { MOCK_AUTHORITY_AI_ALERTS, MOCK_AUTHORITY_PROJECTS } from "@/mock/authorityMockData";
import { Card } from "@/components/ui/Card";

export const AuthorityAiRiskTab: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const lowRiskCount = MOCK_AUTHORITY_PROJECTS.filter((p) => p.riskLevel === "LOW").length;
  const mediumRiskCount = MOCK_AUTHORITY_PROJECTS.filter((p) => p.riskLevel === "MEDIUM").length;
  const highRiskCount = MOCK_AUTHORITY_PROJECTS.filter((p) => p.riskLevel === "HIGH").length;
  const avgRiskScore = Math.round(
    MOCK_AUTHORITY_PROJECTS.reduce((acc, p) => acc + p.riskScore, 0) / MOCK_AUTHORITY_PROJECTS.length
  );

  const filteredAlerts = MOCK_AUTHORITY_AI_ALERTS.filter((a) => {
    if (categoryFilter !== "ALL" && a.category !== categoryFilter) return false;
    if (severityFilter !== "ALL" && a.severity !== severityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#0F4C81] text-white">
              <BrainCircuit className="w-4 h-4" />
            </span>
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              AI Risk Engine & Predictive Anomaly Flags
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time multi-variate risk scoring across biometric attendance, CPGRAMS grievances, CCTV uptime, and historical audits.
          </p>
        </div>
      </div>

      {/* Risk Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            State Avg Risk Score
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono flex items-baseline gap-1.5">
            {avgRiskScore}
            <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">● Moderate Baseline</span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800 bg-rose-50/40 dark:bg-rose-950/20">
          <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
            High Risk Projects
          </span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 font-mono">
            {highRiskCount}
          </div>
          <span className="text-[10px] text-rose-600 font-bold">Immediate Audit Required</span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800 bg-amber-50/40 dark:bg-amber-950/20">
          <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            Medium Risk Projects
          </span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">
            {mediumRiskCount}
          </div>
          <span className="text-[10px] text-amber-600 font-semibold">Under Active Surveillance</span>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800 bg-emerald-50/40 dark:bg-emerald-950/20">
          <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            Low Risk Projects
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {lowRiskCount}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Compliant Benchmarks</span>
        </Card>
      </div>

      {/* AI Explanation Banner */}
      <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-sm">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>How the DoSJE AI Risk Engine Computes Threat Scores:</span>
        </div>
        <p className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
          The machine learning risk model continuously evaluates 5 core behavioral features:
          <strong> Biometric Attendance Drop</strong> (30% weight), 
          <strong> Repeated CPGRAMS Grievances</strong> (25% weight), 
          <strong> CCTV Telemetry Uptime</strong> (20% weight), 
          <strong> Previous Non-compliance Defaults</strong> (15% weight), and 
          <strong> PMU Inspection Failures</strong> (10% weight). Projects with scores $\ge 75$ are automatically locked for priority physical audit.
        </p>
      </div>

      {/* Reason Filters Toolbar */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#0F4C81]" /> Filter by Root Cause Reason:
          </span>

          {[
            { key: "ALL", label: `All Reasons (${MOCK_AUTHORITY_AI_ALERTS.length})` },
            { key: "Attendance Drop", label: "Attendance Drop" },
            { key: "Repeated Complaints", label: "Repeated Complaints" },
            { key: "CCTV Offline", label: "CCTV Offline" },
            { key: "Previous Non-compliance", label: "Prior Non-compliance" },
            { key: "Inspection Failure", label: "Inspection Failure" },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                categoryFilter === cat.key
                  ? "bg-[#0F4C81] text-white shadow-xs"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical Severity</option>
          <option value="HIGH">High Severity</option>
          <option value="MEDIUM">Medium Severity</option>
        </select>
      </div>

      {/* Action Notice Alert */}
      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold">{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-blue-600 hover:text-blue-800 font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* AI Alert Cards Feed */}
      <div className="space-y-3">
        {filteredAlerts.map((item) => {
          const isCritical = item.severity === "CRITICAL";
          const isHigh = item.severity === "HIGH";

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all text-xs space-y-2.5 ${
                isCritical
                  ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60"
                  : isHigh
                  ? "bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      isCritical
                        ? "bg-rose-600 text-white animate-pulse"
                        : isHigh
                        ? "bg-amber-600 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {item.severity} • {item.category}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs">
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>Score: {item.riskScore}/100</span>
                  <span>•</span>
                  <span>{item.timestamp}</span>
                </div>
              </div>

              {/* Facility details */}
              <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Facility: <span className="text-[#0F4C81] dark:text-blue-400">{item.projectName}</span> ({item.district})
              </div>

              {/* Explanation */}
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                {item.explanation}
              </p>

              {/* Action Box */}
              <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                  <strong>Recommended Action:</strong> {item.recommendedAction}
                </span>
                <button
                  onClick={() => {
                    setActionNotice(`Initiated rapid dispatch inspection order for ${item.projectName}. Auditor notification dispatched.`);
                    setTimeout(() => setActionNotice(null), 5000);
                  }}
                  className="px-2.5 py-1 rounded bg-[#0F4C81] text-white hover:bg-[#0c3c66] text-[11px] font-bold shrink-0"
                >
                  Deploy Inspection
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
