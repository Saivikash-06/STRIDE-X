"use client";

import React, { useState } from "react";
import { BrainCircuit, AlertTriangle, Zap } from "lucide-react";
import { MOCK_AI_ALERTS } from "@/mock/adminMockData";
import { AiAlert } from "@/types/admin";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/hooks/useToast";

export const AiRiskTab: React.FC = () => {
  const { showToast } = useToast();
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [selectedAlert, setSelectedAlert] = useState<AiAlert | null>(null);

  const filtered = MOCK_AI_ALERTS.filter((a) => {
    if (priorityFilter === "ALL") return true;
    return a.priority === priorityFilter;
  });

  const handleAction = (alert: AiAlert, actionName: string) => {
    showToast({
      type: "success",
      title: "Statutory Directive Issued",
      message: `${actionName} initiated for ${alert.projectName}. Logged in central vigilance registry.`,
    });
    setSelectedAlert(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-[#0B5ED7] dark:text-blue-400" />
            STRIDE-X Intelligence Dashboard & Anomaly Matrix
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Machine learning anomaly detection continuously analyzing biometric punch variances, fund delays, and physical audits.
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPriorityFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              priorityFilter === "ALL" ? "bg-[#0F4C81] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            All Alerts (30)
          </button>
          <button
            onClick={() => setPriorityFilter("CRITICAL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              priorityFilter === "CRITICAL" ? "bg-rose-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            Critical (10)
          </button>
          <button
            onClick={() => setPriorityFilter("HIGH")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              priorityFilter === "HIGH" ? "bg-amber-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            High Priority (12)
          </button>
        </div>
      </div>

      {/* AI Alert Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((alert) => (
          <Card
            key={alert.id}
            hoverEffect
            className="p-5 border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-lg ${
                      alert.priority === "CRITICAL"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        : alert.priority === "HIGH"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-blue-100 text-[#0F4C81] dark:bg-blue-950 dark:text-blue-300"
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                      {alert.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 leading-snug">
                      {alert.title}
                    </h3>
                  </div>
                </div>

                <Badge
                  variant={
                    alert.priority === "CRITICAL"
                      ? "danger"
                      : alert.priority === "HIGH"
                      ? "warning"
                      : "primary"
                  }
                  size="sm"
                >
                  {alert.priority}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2.5">
                {alert.description}
              </p>

              <div className="mt-3 p-2.5 rounded bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Target Facility:</span>
                  <span>{alert.projectName} ({alert.state})</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Timestamp:</span>
                  <span className="font-mono">{alert.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Auto-Flagged
              </span>

              <Button
                size="sm"
                variant={alert.priority === "CRITICAL" ? "danger" : "primary"}
                onClick={() => setSelectedAlert(alert)}
              >
                Execute Mitigation Action
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Action Modal */}
      {selectedAlert && (
        <Modal
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          title={`Mitigation Protocol: ${selectedAlert.title}`}
          description={`Facility: ${selectedAlert.projectName} (${selectedAlert.state})`}
          footer={
            <Button size="sm" variant="outline" onClick={() => setSelectedAlert(null)}>
              Dismiss Modal
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200">
              <strong className="block font-bold">Recommended Mitigation Directive:</strong>
              <p className="mt-1">{selectedAlert.suggestedAction}</p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-900 dark:text-white block">
                Select Departmental Intervention:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => handleAction(selectedAlert, "Emergency PMU Physical Audit")}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <strong className="block text-slate-900 dark:text-white font-semibold">
                    Dispatch PMU Field Audit
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    Schedules surprise on-site GPS verification within 24 hours.
                  </span>
                </button>

                <button
                  onClick={() => handleAction(selectedAlert, "Statutory Show-Cause Summons")}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <strong className="block text-slate-900 dark:text-white font-semibold">
                    Issue Show-Cause Notice
                  </strong>
                  <span className="text-[11px] text-slate-500">
                    Issues digital summons holding upcoming grant releases.
                  </span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
