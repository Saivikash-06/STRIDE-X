"use client";

import React, { useState } from "react";
import {
  Clock,
  FolderPlus,
  ClipboardCheck,
  MessageSquareWarning,
  AlertTriangle,
  ShieldCheck,
  CalendarCheck,
  CameraOff,
  User,
} from "lucide-react";
import { MOCK_ACTIVITIES } from "@/mock/adminMockData";
import { ActivityItem, AdminTab } from "@/types/admin";
import { Badge } from "@/components/ui/Badge";

interface RecentActivitiesProps {
  onSelectTab?: (tab: AdminTab) => void;
  className?: string;
  limit?: number;
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({
  onSelectTab: _onSelectTab,
  className = "",
  limit = 8,
}) => {
  const [filterType, setFilterType] = useState<ActivityItem["type"] | "ALL">("ALL");

  const filteredActivities = MOCK_ACTIVITIES.filter((act) => {
    if (filterType === "ALL") return true;
    return act.type === filterType;
  });

  const displayList = limit ? filteredActivities.slice(0, limit) : filteredActivities;

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "PROJECT_REGISTERED":
        return <FolderPlus className="w-3.5 h-3.5 text-blue-500" />;
      case "INSPECTION_COMPLETED":
        return <ClipboardCheck className="w-3.5 h-3.5 text-purple-500" />;
      case "COMPLAINT_RAISED":
        return <MessageSquareWarning className="w-3.5 h-3.5 text-amber-500" />;
      case "RISK_UPDATED":
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />;
      case "COMPLIANCE_CLOSED":
        return <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />;
      case "ATTENDANCE_UPLOADED":
        return <CalendarCheck className="w-3.5 h-3.5 text-emerald-500" />;
      case "CCTV_OFFLINE":
        return <CameraOff className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getActorDetails = (type: ActivityItem["type"]) => {
    switch (type) {
      case "PROJECT_REGISTERED":
        return { name: "Central Project Approval Bureau", role: "DoSJE Central" };
      case "INSPECTION_COMPLETED":
        return { name: "Dr. Ramesh Meena, IAS", role: "Lead PMU Auditor" };
      case "COMPLAINT_RAISED":
        return { name: "Beneficiary via CPGRAMS", role: "Citizen Redressal" };
      case "RISK_UPDATED":
        return { name: "DoSJE AI-AuditGuard Engine", role: "Automated ML" };
      case "COMPLIANCE_CLOSED":
        return { name: "State Nodal Clearance Cell", role: "State Authority" };
      case "ATTENDANCE_UPLOADED":
        return { name: "Field Supervisor Biometric", role: "Facility Centre" };
      case "CCTV_OFFLINE":
        return { name: "Sovereign RTSP Gateway", role: "Surveillance Monitor" };
      default:
        return { name: "Authorized Administrator", role: "Govt. Officer" };
    }
  };

  return (
    <div className={`p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-[#0B5ED7] dark:text-blue-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              National Real-time Activity Timeline
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Statutory event stream across central ministry, state nodal desks & PMU field units
            </p>
          </div>
        </div>

        {/* Filter Dropdown */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as ActivityItem["type"] | "ALL")}
          className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
        >
          <option value="ALL">All Activities</option>
          <option value="PROJECT_REGISTERED">Project Registered</option>
          <option value="INSPECTION_COMPLETED">Inspection Completed</option>
          <option value="COMPLAINT_RAISED">Grievance Raised</option>
          <option value="RISK_UPDATED">AI Risk Updated</option>
          <option value="COMPLIANCE_CLOSED">Compliance Closed</option>
          <option value="ATTENDANCE_UPLOADED">Attendance Uploaded</option>
          <option value="CCTV_OFFLINE">CCTV Telemetry Disconnected</option>
        </select>
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {displayList.map((item) => {
          const actor = getActorDetails(item.type);
          return (
            <div key={item.id} className="relative group">
              {/* Timeline bullet dot */}
              <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 group-hover:border-[#0B5ED7] flex items-center justify-center transition-colors">
                {getActivityIcon(item.type)}
              </div>

              {/* Content card */}
              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-850/50 group-hover:bg-slate-100/70 dark:group-hover:bg-slate-800/60 transition-all text-xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    <Badge variant={item.badgeVariant} size="sm">
                      {item.type.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {item.time}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                  {item.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="w-3 h-3 text-slate-400" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {actor.name}
                    </span>
                    <span className="text-slate-400">({actor.role})</span>
                  </div>

                  {item.entityId && (
                    <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 truncate max-w-40">
                      ID: {item.entityId}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
