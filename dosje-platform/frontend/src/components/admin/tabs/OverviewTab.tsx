"use client";

import React from "react";
import {
  Layers,
  FolderKanban,
  Building2,
  Users,
  ShieldAlert,
  MessageSquareWarning,
  ClipboardCheck,
  FileWarning,
  CircleDollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  SchemeDistributionChart,
  StateWiseProjectsChart,
  BeneficiaryGrowthChart,
  ComplaintTrendsChart,
  InspectionCompletionChart,
  ComplianceStatusChart,
  RiskDistributionChart,
  FundUtilizationChart,
} from "@/components/admin/charts/ChartComponents";
import { IndiaInteractiveMap } from "@/components/admin/map/IndiaInteractiveMap";
import { MOCK_ACTIVITIES, MOCK_AI_ALERTS } from "@/mock/adminMockData";
import { AdminTab, Project } from "@/types/admin";

interface OverviewTabProps {
  onSelectTab: (tab: AdminTab) => void;
  onSelectProject: (project: Project) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onSelectTab, onSelectProject }) => {
  const kpis = [
    {
      title: "Total Schemes",
      value: "8",
      subtext: "Centrally Sponsored Schemes",
      change: "+0 (Active)",
      trend: "up",
      color: "blue",
      icon: <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      tab: "schemes" as AdminTab,
    },
    {
      title: "Active Projects",
      value: "2,480",
      subtext: "Nationwide Facilities",
      change: "+12.4% YoY",
      trend: "up",
      color: "emerald",
      icon: <FolderKanban className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      tab: "projects" as AdminTab,
    },
    {
      title: "Empaneled NGOs",
      value: "865",
      subtext: "NITI Aayog Darpan Vetted",
      change: "100% Verified",
      trend: "up",
      color: "teal",
      icon: <Building2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      tab: "ngos" as AdminTab,
    },
    {
      title: "Total Beneficiaries",
      value: "1.84M",
      subtext: "Aadhaar e-KYC Enrolled",
      change: "+8.9% MoM",
      trend: "up",
      color: "indigo",
      icon: <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      tab: "beneficiaries" as AdminTab,
    },
    {
      title: "High Risk Projects",
      value: "90",
      subtext: "Requires Urgent PMU Audit",
      change: "-4.2% mitigated",
      trend: "down",
      color: "rose",
      icon: <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      tab: "ai-risk" as AdminTab,
    },
    {
      title: "Pending Grievances",
      value: "142",
      subtext: "Active CPGRAMS / Desk Tickets",
      change: "< 48 hrs SLA",
      trend: "down",
      color: "amber",
      icon: <MessageSquareWarning className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      tab: "grievances" as AdminTab,
    },
    {
      title: "Pending Inspections",
      value: "342",
      subtext: "Field Auditors Deployed",
      change: "24.1% done",
      trend: "up",
      color: "purple",
      icon: <ClipboardCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      tab: "inspections" as AdminTab,
    },
    {
      title: "Non-Compliant Projects",
      value: "90",
      subtext: "Statutory Defaults Flagged",
      change: "Under Notice",
      trend: "down",
      color: "orange",
      icon: <FileWarning className="w-5 h-5 text-orange-600 dark:text-orange-400" />,
      tab: "compliance" as AdminTab,
    },
    {
      title: "Fund Utilization %",
      value: "91.8%",
      subtext: "PFMS Direct Benefit Sync",
      change: "₹4,115 Cr UC Verified",
      trend: "up",
      color: "cyan",
      icon: <CircleDollarSign className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      tab: "funds" as AdminTab,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#0B2545] to-[#0F4C81] text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider">
              ● All Systems Operational
            </span>
            <span className="text-xs text-blue-200">National Dashboard Live Telemetry</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            STRIDE-X National Monitoring Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-2xl leading-relaxed">
            Smart Tracking & Real-time Inspection telemetry across 8 centrally sponsored schemes, 36 States/UTs, and 2,480 active field facilities.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onSelectTab("reports")}
            leftIcon={<TrendingUp className="w-4 h-4" />}
          >
            Export National MIS Digest
          </Button>
        </div>
      </div>

      {/* 9 KPI Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            National Performance Benchmarks (KPIs)
          </h2>
          <span className="text-xs text-slate-500 font-mono">Updated 2m ago</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi, idx) => (
            <Card
              key={idx}
              hoverEffect
              onClick={() => onSelectTab(kpi.tab)}
              className="p-5 cursor-pointer border-slate-200 dark:border-slate-800 transition-all hover:border-[#0F4C81]/50 dark:hover:border-blue-500/50"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {kpi.icon}
                </div>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {kpi.change}
                </span>
              </div>

              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                  {kpi.value}
                </div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                  {kpi.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {kpi.subtext}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Interactive India Map Section */}
      <div>
        <IndiaInteractiveMap onSelectProject={onSelectProject} />
      </div>

      {/* Interactive Charts Suite (8 Required Charts) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Interactive Analytical Intelligence Suite
          </h2>
          <span className="text-xs text-slate-500">Live Visual Telemetry</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Scheme Distribution */}
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  1. Scheme Project Distribution
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Total active sanctioned projects by central welfare program
                </p>
              </div>
              <Badge variant="primary" size="sm">Pie Chart</Badge>
            </div>
            <SchemeDistributionChart />
          </Card>

          {/* Chart 2: State-wise Projects */}
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  2. State-wise Facilities & High Risk Flags
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Projects, completed inspections, and risk flags across top 10 States
                </p>
              </div>
              <Badge variant="primary" size="sm">Bar Chart</Badge>
            </div>
            <StateWiseProjectsChart />
          </Card>

          {/* Chart 3: Beneficiary Growth */}
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  3. Beneficiary Enrolment Growth
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Enrolled citizens vs. Aadhaar e-KYC authenticated direct beneficiaries
                </p>
              </div>
              <Badge variant="secondary" size="sm">Area Chart</Badge>
            </div>
            <BeneficiaryGrowthChart />
          </Card>

          {/* Chart 4: Complaint Trends */}
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  4. Grievance Lodging & Redressal Trends
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Monthly intake vs. official resolution compliance under SLA-48
                </p>
              </div>
              <Badge variant="warning" size="sm">Area Trend</Badge>
            </div>
            <ComplaintTrendsChart />
          </Card>

          {/* Chart 5: Inspection Completion */}
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  5. Quarterly Physical Inspection Completion
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Targeted statutory audits vs. geo-verified completed audits
                </p>
              </div>
              <Badge variant="primary" size="sm">Bar Chart</Badge>
            </div>
            <InspectionCompletionChart />
          </Card>

          {/* Chart 6: Compliance Status */}
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  6. National Statutory Compliance Breakdown
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Compliant projects, pending UC submissions, and defaulting agencies
                </p>
              </div>
              <Badge variant="success" size="sm">Donut Chart</Badge>
            </div>
            <ComplianceStatusChart />
          </Card>

          {/* Chart 7: Risk Distribution */}
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  7. AI Risk Engine Index Distribution
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Categorization of grantee NGOs by automated predictive threat level
                </p>
              </div>
              <Badge variant="danger" size="sm">Pie Chart</Badge>
            </div>
            <RiskDistributionChart />
          </Card>

          {/* Chart 8: Fund Utilization */}
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  8. Scheme Budget Sanctioned vs. Utilized
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Public financial tracking (PFMS) in ₹ Crores by central scheme
                </p>
              </div>
              <Badge variant="secondary" size="sm">Stacked Bar</Badge>
            </div>
            <FundUtilizationChart />
          </Card>
        </div>
      </div>

      {/* Activity Timeline & AI Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Risk Alerts Panel */}
        <div className="lg:col-span-7">
          <Card className="p-5 sm:p-6 border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      AI Anomaly Alerts (Action Required)
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Real-time statutory deviations and predictive irregularities
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelectTab("ai-risk")}
                >
                  View All (30)
                </Button>
              </div>

              <div className="space-y-3">
                {MOCK_AI_ALERTS.slice(0, 4).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1 text-xs">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            alert.priority === "CRITICAL"
                              ? "bg-rose-600"
                              : alert.priority === "HIGH"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                          }`}
                        />
                        {alert.title}
                      </span>
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

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                      {alert.description}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{alert.projectName}</span>
                      <button
                        onClick={() => onSelectTab("ai-risk")}
                        className="font-semibold text-[#0F4C81] dark:text-blue-400 hover:underline flex items-center gap-0.5"
                      >
                        Resolve Anomaly →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Predictive ML Model: DoSJE-AuditGuard v2.4</span>
              <span className="text-emerald-600 font-semibold">99.4% Alert Accuracy</span>
            </div>
          </Card>
        </div>

        {/* Right: National Activity Timeline */}
        <div className="lg:col-span-5">
          <Card className="p-5 sm:p-6 border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-950 text-[#0F4C81] dark:text-blue-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Live Operational Activity Log
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Cross-departmental actions logged in real-time
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelectTab("audit-logs")}
                >
                  Audit Trail
                </Button>
              </div>

              <div className="space-y-4">
                {MOCK_ACTIVITIES.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#0F4C81] dark:bg-blue-400 mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900 dark:text-white truncate">
                          {act.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">{act.time}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5 leading-snug">
                        {act.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
              <span>National Audit Registry Sync: OK</span>
              <span className="font-mono">Timezone: IST (UTC+05:30)</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
