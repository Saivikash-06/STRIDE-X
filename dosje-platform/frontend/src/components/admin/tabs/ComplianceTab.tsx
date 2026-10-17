"use client";

import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { MOCK_COMPLIANCE_CASES } from "@/mock/adminMockData";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const ComplianceTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = MOCK_COMPLIANCE_CASES.filter(
    (c) =>
      c.complianceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.observation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0F4C81] dark:text-blue-400" />
            Statutory Compliance & Legal Adherence Matrix
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tracking of GFR-19A utilization certificates, fire/building clearances, and medical compliance rosters.
          </p>
        </div>
        <input
          type="text"
          placeholder="Search compliance cases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-[#0F4C81]"
        />
      </div>

      {/* Compliance Table */}
      <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Compliance ID</th>
                <th className="py-3 px-3">Project & Grantee</th>
                <th className="py-3 px-3">Statutory Category</th>
                <th className="py-3 px-3">Observation Notice</th>
                <th className="py-3 px-3 text-center">Severity</th>
                <th className="py-3 px-3 text-center">Deadline</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3">Enforcing Body</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {item.complianceId}
                  </td>
                  <td className="py-2.5 px-3 max-w-[200px]">
                    <div className="font-bold text-slate-900 dark:text-white truncate">
                      {item.projectName}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{item.ngoName}</div>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                    {item.type}
                  </td>
                  <td className="py-2.5 px-3 max-w-[260px] text-slate-600 dark:text-slate-400">
                    <p className="line-clamp-2">{item.observation}</p>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Badge
                      variant={
                        item.severity === "CRITICAL"
                          ? "danger"
                          : item.severity === "HIGH"
                          ? "warning"
                          : "primary"
                      }
                      size="sm"
                    >
                      {item.severity}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                    {item.deadline}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === "RECTIFIED"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          : item.status === "DEFAULTED"
                          ? "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 text-[11px]">
                    {item.assignedTo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
