"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  CalendarX,
  CameraOff,
  Clock,
  ExternalLink,
  MessageSquareWarning,
  FileWarning,
  BrainCircuit,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { MOCK_AI_ALERTS, MOCK_PROJECTS } from "@/mock/adminMockData";
import { AiAlert, AdminTab, Project } from "@/types/admin";

interface AIAlertsProps {
  onSelectTab?: (tab: AdminTab) => void;
  onSelectProject?: (project: Project) => void;
  className?: string;
  limit?: number;
}

export const AIAlerts: React.FC<AIAlertsProps> = ({
  onSelectTab,
  onSelectProject,
  className = "",
  limit,
}) => {
  const [selectedAlert, setSelectedAlert] = useState<AiAlert | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<
    | "all"
    | "ATTENDANCE_DROP"
    | "REPEATED_COMPLAINTS"
    | "CCTV_OFFLINE"
    | "DELAYED_INSPECTION"
    | "NON_COMPLIANT"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Risk project counts
  const highRiskCount = MOCK_PROJECTS.filter((p) => p.riskLevel === "HIGH").length;
  const medRiskCount = MOCK_PROJECTS.filter((p) => p.riskLevel === "MEDIUM").length;
  const lowRiskCount = MOCK_PROJECTS.filter((p) => p.riskLevel === "LOW").length;

  const filteredAlerts = MOCK_AI_ALERTS.filter((alert) => {
    // Category filter
    if (categoryFilter === "ATTENDANCE_DROP" && !alert.title.toLowerCase().includes("attendance") && !alert.description.toLowerCase().includes("attendance")) return false;
    if (categoryFilter === "REPEATED_COMPLAINTS" && !alert.title.toLowerCase().includes("complaint") && !alert.description.toLowerCase().includes("complaint") && !alert.description.toLowerCase().includes("grievance")) return false;
    if (categoryFilter === "CCTV_OFFLINE" && !alert.title.toLowerCase().includes("cctv") && !alert.description.toLowerCase().includes("cctv") && !alert.description.toLowerCase().includes("camera")) return false;
    if (categoryFilter === "DELAYED_INSPECTION" && !alert.title.toLowerCase().includes("inspection") && !alert.description.toLowerCase().includes("audit") && !alert.description.toLowerCase().includes("inspection")) return false;
    if (categoryFilter === "NON_COMPLIANT" && !alert.title.toLowerCase().includes("compliance") && !alert.description.toLowerCase().includes("compliance") && !alert.description.toLowerCase().includes("uc")) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        alert.title.toLowerCase().includes(q) ||
        alert.projectName.toLowerCase().includes(q) ||
        alert.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const displayAlerts = limit ? filteredAlerts.slice(0, limit) : filteredAlerts;

  const handleOpenProject = (projectName: string) => {
    const proj = MOCK_PROJECTS.find((p) => p.name.toLowerCase() === projectName.toLowerCase()) || MOCK_PROJECTS[0];
    if (onSelectProject) {
      onSelectProject(proj);
    } else if (onSelectTab) {
      onSelectTab("projects");
    }
    setSelectedAlert(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header & Risk Score Badges */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              AI Anomaly & Risk Threat Center
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Algorithmic anomaly detection analyzing biometric attendance drops, CCTV downtimes, CPGRAMS complaints, and PFMS utilization.
          </p>
        </div>

        {/* 3 Risk Counters */}
        <div className="flex items-center gap-2.5">
          <div className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
            <div>
              <div className="text-xs font-bold text-rose-700 dark:text-rose-300">
                {highRiskCount} High Risk
              </div>
              <div className="text-[10px] text-rose-600/80 dark:text-rose-400/70">
                Urgent Action
              </div>
            </div>
          </div>

          <div className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <div>
              <div className="text-xs font-bold text-amber-700 dark:text-amber-300">
                {medRiskCount} Medium Risk
              </div>
              <div className="text-[10px] text-amber-600/80 dark:text-amber-400/70">
                Watchlist
              </div>
            </div>
          </div>

          <div className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <div>
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                {lowRiskCount} Low Risk
              </div>
              <div className="text-[10px] text-emerald-600/80 dark:text-emerald-400/70">
                Compliant
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              categoryFilter === "all"
                ? "bg-[#0B5ED7] text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All AI Alerts ({MOCK_AI_ALERTS.length})
          </button>

          <button
            onClick={() => setCategoryFilter("ATTENDANCE_DROP")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 ${
              categoryFilter === "ATTENDANCE_DROP"
                ? "bg-[#0B5ED7] text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <CalendarX className="w-3.5 h-3.5 text-rose-500" />
            <span>Attendance Drops</span>
          </button>

          <button
            onClick={() => setCategoryFilter("REPEATED_COMPLAINTS")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 ${
              categoryFilter === "REPEATED_COMPLAINTS"
                ? "bg-[#0B5ED7] text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <MessageSquareWarning className="w-3.5 h-3.5 text-amber-500" />
            <span>Repeated Complaints</span>
          </button>

          <button
            onClick={() => setCategoryFilter("CCTV_OFFLINE")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 ${
              categoryFilter === "CCTV_OFFLINE"
                ? "bg-[#0B5ED7] text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <CameraOff className="w-3.5 h-3.5 text-sky-500" />
            <span>Offline CCTV</span>
          </button>

          <button
            onClick={() => setCategoryFilter("DELAYED_INSPECTION")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 ${
              categoryFilter === "DELAYED_INSPECTION"
                ? "bg-[#0B5ED7] text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-purple-500" />
            <span>Delayed Inspections</span>
          </button>

          <button
            onClick={() => setCategoryFilter("NON_COMPLIANT")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 ${
              categoryFilter === "NON_COMPLIANT"
                ? "bg-[#0B5ED7] text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <FileWarning className="w-3.5 h-3.5 text-orange-500" />
            <span>Non-Compliant</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search anomalies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {displayAlerts.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No anomalies found matching current criteria
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Reset search or select &quot;All AI Alerts&quot; to view ongoing facility alerts.
            </p>
          </div>
        ) : (
          displayAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header: Priority, Title, Date */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        alert.priority === "CRITICAL"
                          ? "bg-rose-600 animate-ping"
                          : alert.priority === "HIGH"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#0B5ED7] dark:group-hover:text-blue-400">
                      {alert.title}
                    </h3>
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

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {alert.description}
                </p>
              </div>

              {/* Footer Meta & View Details */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-[11px]">
                <div className="text-slate-500 dark:text-slate-400 truncate">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {alert.projectName}
                  </span>
                  <span className="mx-1">•</span>
                  <span>{alert.timestamp}</span>
                </div>

                <button
                  onClick={() => setSelectedAlert(alert)}
                  className="font-bold text-[#0B5ED7] dark:text-blue-400 hover:underline shrink-0 flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: View Alert Details */}
      {selectedAlert && (
        <Modal
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
          title={`AI Anomaly Dossier: ${selectedAlert.title}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Target Facility
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedAlert.projectName}
                </span>
              </div>
              <Badge
                variant={
                  selectedAlert.priority === "CRITICAL"
                    ? "danger"
                    : selectedAlert.priority === "HIGH"
                    ? "warning"
                    : "primary"
                }
              >
                {selectedAlert.priority} THREAT
              </Badge>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                Telemetry Anomaly Finding
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                {selectedAlert.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase block">
                  Algorithmic Confidence
                </span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  98.7%
                </span>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase block">
                  Statutory SLA Timeframe
                </span>
                <span className="text-base font-bold text-rose-600 dark:text-rose-400 font-mono">
                  &lt; 24 Hours
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-300 text-[11px]">
              ℹ️ Recommendation: Dispatch designated PMU field inspection auditor and initiate statutory show-cause notice to grantee NGO under General Financial Rules (GFR-2017).
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedAlert(null)}>
                Dismiss
              </Button>
              <Button
                variant="primary"
                onClick={() => handleOpenProject(selectedAlert.projectName)}
              >
                Inspect Facility Profile
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
