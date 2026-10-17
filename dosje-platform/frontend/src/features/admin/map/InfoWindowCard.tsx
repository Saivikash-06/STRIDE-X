"use client";

import React, { memo } from "react";
import {
  Building2,
  MapPin,
  Users,
  ShieldAlert,
  ClipboardCheck,
  Video,
  FileCheck2,
  Calendar,
  ExternalLink,
  X,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import { EnrichedMapProject } from "./mapTypes";
import { MARKER_COLORS } from "./mapStyles";
import { Button } from "@/components/ui/Button";

interface InfoWindowCardProps {
  project: EnrichedMapProject;
  onClose: () => void;
  onViewDetails?: (project: EnrichedMapProject) => void;
}

const InfoWindowCardComponent: React.FC<InfoWindowCardProps> = ({
  project,
  onClose,
  onViewDetails,
}) => {
  const colorConfig = MARKER_COLORS[project.colorCategory];
  const isCctvLive = project.cctvOnline;
  const isHighRisk = project.riskLevel === "HIGH";

  return (
    <div className="w-[320px] sm:w-[350px] max-w-[92vw] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-white font-sans text-xs">
      {/* Top Color Banner */}
      <div
        className="px-3.5 py-2.5 flex items-center justify-between text-white"
        style={{ backgroundColor: colorConfig.hex }}
      >
        <div className="flex items-center gap-1.5 font-bold tracking-tight">
          <span className="text-sm">{colorConfig.badgeEmoji}</span>
          <span className="uppercase text-[11px] tracking-wider font-mono">
            {project.projectCode}
          </span>
          <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded font-medium">
            {colorConfig.label}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white p-1 rounded-md hover:bg-black/20 transition-colors"
          aria-label="Close Information Window"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="p-3.5 space-y-3">
        {/* Project Name & NGO */}
        <div>
          <h4 className="text-sm font-black leading-snug text-slate-900 dark:text-white">
            {project.name}
          </h4>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-600 dark:text-slate-400">
            <Building2 className="w-3.5 h-3.5 text-[#0F4C81] dark:text-blue-400 shrink-0" />
            <span className="font-semibold truncate">{project.ngoName}</span>
          </div>
        </div>

        {/* Scheme & District/State */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
              Scheme
            </span>
            <p className="font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
              {project.schemeName}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
              District & State
            </span>
            <p className="font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
              {project.district}, {project.state}
            </p>
          </div>
        </div>

        {/* Metrics Grid (Beneficiaries, Risk Score/Level, Attendance %, CCTV Status) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Beneficiaries */}
          <div className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[10px] font-semibold">Beneficiaries</span>
              <Users className="w-3 h-3 text-indigo-500" />
            </div>
            <div className="text-base font-black text-slate-900 dark:text-white mt-0.5 font-mono">
              {project.beneficiariesCount}
            </div>
          </div>

          {/* Risk Score & Risk Level */}
          <div className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[10px] font-semibold">Risk Score</span>
              <ShieldAlert className="w-3 h-3 text-rose-500" />
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span
                className={`text-base font-black font-mono ${
                  isHighRisk
                    ? "text-rose-600 dark:text-rose-400"
                    : project.riskLevel === "MEDIUM"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {project.riskScore}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">/100</span>
              <span
                className={`text-[9px] font-bold px-1 rounded ml-auto ${
                  isHighRisk
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                    : project.riskLevel === "MEDIUM"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                }`}
              >
                {project.riskLevel}
              </span>
            </div>
          </div>

          {/* Attendance % */}
          <div className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[10px] font-semibold">Attendance %</span>
              <UserCheck className="w-3 h-3 text-emerald-500" />
            </div>
            <div className="text-base font-black text-slate-900 dark:text-white mt-0.5 font-mono">
              {project.attendancePercent}%
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  project.attendancePercent < 60
                    ? "bg-rose-500"
                    : project.attendancePercent < 80
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${project.attendancePercent}%` }}
              />
            </div>
          </div>

          {/* CCTV Status */}
          <div className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[10px] font-semibold">CCTV Status</span>
              <Video className="w-3 h-3 text-purple-500" />
            </div>
            <div className="flex items-center gap-1.5 mt-1 font-bold">
              <span
                className={`w-2 h-2 rounded-full ${
                  isCctvLive ? "bg-emerald-500 animate-pulse" : "bg-purple-600"
                }`}
              />
              <span
                className={
                  isCctvLive
                    ? "text-emerald-600 dark:text-emerald-400 font-mono text-xs"
                    : "text-purple-600 dark:text-purple-400 font-mono text-xs"
                }
              >
                {isCctvLive ? "ONLINE (3/3)" : "OFFLINE (ALERT)"}
              </span>
            </div>
          </div>
        </div>

        {/* Audit & Compliance Footnotes */}
        <div className="space-y-1.5 pt-1 text-[11px] border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ClipboardCheck className="w-3.5 h-3.5 text-blue-500" />
              Inspection:
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {project.inspectionStatus}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Last Inspection:
            </span>
            <span className="font-mono text-slate-700 dark:text-slate-300">
              {project.lastInspectionDate} ({project.inspectorName?.split(" ")[0]})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
              Compliance:
            </span>
            <span
              className={`font-semibold ${
                project.complianceStatus === "NON_COMPLIANT"
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {project.complianceStatus}
            </span>
          </div>
        </div>

        {/* Compliance Warning note if flagged */}
        {project.complianceObservation && (
          <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-[10px] text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
            <span className="leading-tight">{project.complianceObservation}</span>
          </div>
        )}

        {/* View Details Button */}
        <div className="pt-1">
          <Button
            size="sm"
            variant="primary"
            className="w-full justify-center text-xs py-2 bg-[#0F4C81] hover:bg-[#0c3c66]"
            onClick={() => {
              if (onViewDetails) onViewDetails(project);
            }}
            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            View Project Details & Telemetry
          </Button>
        </div>
      </div>
    </div>
  );
};

export const InfoWindowCard = memo(InfoWindowCardComponent);
