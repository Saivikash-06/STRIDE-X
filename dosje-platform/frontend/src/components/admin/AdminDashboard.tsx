"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { KPICards } from "./KPICards";
import { QuickActions } from "./QuickActions";
import { NationalMap } from "./NationalMap";
import { AIAlerts } from "./AIAlerts";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { ProjectTable } from "./ProjectTable";
import { AttendanceWidget } from "./AttendanceWidget";
import { CCTVWidget } from "./CCTVWidget";
import { InspectionWidget } from "./InspectionWidget";
import { ComplianceWidget } from "./ComplianceWidget";
import { FundWidget } from "./FundWidget";
import { RecentActivities } from "./RecentActivities";
import { AdminTab, Project } from "@/types/admin";

interface AdminDashboardProps {
  onSelectTab: (tab: AdminTab) => void;
  onSelectProject?: (project: Project) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectTab,
  onSelectProject,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>("Just Now");

  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 800);
  };

  // Error simulation recovery
  if (hasError) {
    return (
      <div className="p-12 text-center rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 max-w-xl mx-auto my-12 space-y-4">
        <WifiOff className="w-12 h-12 text-rose-500 mx-auto" />
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Telemetry Connection Error
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Unable to establish secure handshake with the Central Ministry Telemetry Ingestion Node.
          </p>
        </div>
        <div className="pt-2">
          <Button
            variant="primary"
            onClick={() => setHasError(false)}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Retry Secure Reconnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* 1. National Command Center Banner & Quick Actions */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#0B2545] via-[#0F4C81] to-[#0B5ED7] text-white shadow-lg flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Sovereign Grid Operational
            </span>
            <span className="text-xs text-blue-200">National Command Level • MoSJE</span>
            <span className="text-xs text-blue-300/60">• Last sync: {lastRefreshedTime}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            STRIDE-X National Command Center
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1.5 max-w-2xl leading-relaxed">
            Smart Tracking & Real-time Inspection telemetry across 8 central schemes, 36 States/UTs, 2,480 welfare facilities, and 1.84M beneficiaries.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 relative z-10">
          <QuickActions onSelectTab={onSelectTab} />

          <Button
            size="sm"
            variant="secondary"
            onClick={handleRefreshTelemetry}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* 2. Top 10 Animated KPI Cards */}
      <section>
        <KPICards onCardClick={onSelectTab} isLoading={isRefreshing} />
      </section>

      {/* 3. National GIS Monitoring (OpenFreeMap / OSM) */}
      <section>
        <NationalMap onSelectProject={onSelectProject} />
      </section>

      {/* 4. AI Monitoring Panel (Threat Engine & Anomaly Flags) */}
      <section>
        <AIAlerts
          onSelectTab={onSelectTab}
          onSelectProject={onSelectProject}
        />
      </section>

      {/* 5. Central Scheme Overview & Grievance Analytical Charts */}
      <section>
        <AnalyticsCharts />
      </section>

      {/* 6. Biometric Attendance & CCTV Real-time Telemetry Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceWidget
          onSelectTab={onSelectTab}
          onSelectProject={onSelectProject}
        />
        <CCTVWidget onSelectTab={onSelectTab} />
      </section>

      {/* 7. PMU Inspections & Statutory Compliance Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InspectionWidget onSelectTab={onSelectTab} />
        <ComplianceWidget onSelectTab={onSelectTab} />
      </section>

      {/* 8. Public Fund Monitoring (PFMS) & Grant Flow */}
      <section>
        <FundWidget onSelectTab={onSelectTab} />
      </section>

      {/* 9. Welfare Projects Master Monitoring Table */}
      <section>
        <ProjectTable
          onSelectProject={onSelectProject}
          onSelectTab={onSelectTab}
        />
      </section>

      {/* 10. Real-time Activity Timeline */}
      <section>
        <RecentActivities onSelectTab={onSelectTab} />
      </section>
    </motion.div>
  );
};
