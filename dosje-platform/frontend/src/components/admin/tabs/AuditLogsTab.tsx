"use client";

import React, { useState } from "react";
import { History, Download } from "lucide-react";
import { MOCK_AUDIT_LOGS } from "@/mock/adminMockData";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

export const AuditLogsTab: React.FC = () => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = MOCK_AUDIT_LOGS.filter(
    (l) =>
      l.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    showToast({
      type: "success",
      title: "Vigilance Audit Trail Exported",
      message: "Encrypted statutory audit log exported for vigilance and cybersecurity compliance.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-[#0F4C81] dark:text-blue-400" />
            Statutory Vigilance & Immutable Audit Trail
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cryptographically sealed system transaction log recording all administrative modifications and grant authorizations.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 w-full sm:w-60 focus:outline-none focus:ring-1 focus:ring-[#0F4C81]"
          />
          <Button size="sm" variant="outline" onClick={handleExport} leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </div>

      {/* Audit Log Table */}
      <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Official User</th>
                <th className="py-3 px-3">Clearance Role</th>
                <th className="py-3 px-3">Action Recorded</th>
                <th className="py-3 px-3">Target Module</th>
                <th className="py-3 px-3 font-mono">Timestamp</th>
                <th className="py-3 px-3 font-mono">IP Network</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    {log.user}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {log.action}
                    <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                      {log.details}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">
                    {log.module}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge
                      variant={
                        log.status === "SUCCESS"
                          ? "success"
                          : log.status === "WARNING"
                          ? "warning"
                          : "danger"
                      }
                      size="sm"
                      dot
                    >
                      {log.status}
                    </Badge>
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
