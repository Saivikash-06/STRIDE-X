"use client";

import React, { useState } from "react";
import {
  FolderKanban,
  CheckCircle2,
  Building2,
  Users,
  ShieldAlert,
  MessageSquareWarning,
  ClipboardCheck,
  FileCheck2,
  Video,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AuthorityTab, AuthorityProject } from "@/types/authority";
import {
  MOCK_AUTHORITY_PROJECTS,
  MOCK_AUTHORITY_NGOS,
  MOCK_AUTHORITY_BENEFICIARIES,
  MOCK_AUTHORITY_GRIEVANCES,
  MOCK_AUTHORITY_INSPECTIONS,
  MOCK_AUTHORITY_CAMERAS,
  MOCK_AUTHORITY_FUNDS,
  AUTHORITY_DISTRICTS,
} from "@/mock/authorityMockData";
import { AuthorityInteractiveMap } from "../AuthorityInteractiveMap";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface AuthorityOverviewTabProps {
  onSelectTab: (tab: AuthorityTab) => void;
  onSelectProject: (project: AuthorityProject) => void;
}

export const AuthorityOverviewTab: React.FC<AuthorityOverviewTabProps> = ({
  onSelectTab,
  onSelectProject,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("ALL");

  // Metrics computation
  const totalProjects = MOCK_AUTHORITY_PROJECTS.length;
  const activeProjects = MOCK_AUTHORITY_PROJECTS.filter((p) => p.status === "ACTIVE").length;
  const ngosCount = MOCK_AUTHORITY_NGOS.length;
  const beneficiariesCount = MOCK_AUTHORITY_BENEFICIARIES.length;
  const highRiskCount = MOCK_AUTHORITY_PROJECTS.filter((p) => p.riskLevel === "HIGH").length;
  const pendingGrievances = MOCK_AUTHORITY_GRIEVANCES.filter((g) => g.status === "PENDING" || g.status === "VERIFIED").length;
  const pendingInspections = MOCK_AUTHORITY_INSPECTIONS.filter((i) => i.status === "SCHEDULED" || i.status === "FLAGGED").length;
  const compliantCount = MOCK_AUTHORITY_PROJECTS.filter((p) => p.complianceStatus === "COMPLIANT").length;
  const compliancePercent = Math.round((compliantCount / totalProjects) * 100);
  const cctvOnlineCount = MOCK_AUTHORITY_CAMERAS.filter((c) => c.online).length;
  const cctvTotal = MOCK_AUTHORITY_CAMERAS.length;

  const kpis = [
    {
      title: "Total Projects",
      value: totalProjects.toString(),
      subtext: "Sanctioned in Maharashtra",
      change: "5 Districts",
      icon: <FolderKanban className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      tab: "projects" as AuthorityTab,
    },
    {
      title: "Active Projects",
      value: activeProjects.toString(),
      subtext: "Operational field centers",
      change: "93.3% Active",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      tab: "projects" as AuthorityTab,
    },
    {
      title: "Empaneled NGOs",
      value: ngosCount.toString(),
      subtext: "NITI Darpan Verified",
      change: "100% Vetted",
      icon: <Building2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      tab: "ngos" as AuthorityTab,
    },
    {
      title: "Beneficiaries",
      value: `${beneficiariesCount}+`,
      subtext: "Direct Aadhaar e-KYC",
      change: "+12.4% MoM",
      icon: <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      tab: "beneficiaries" as AuthorityTab,
    },
    {
      title: "High Risk Projects",
      value: highRiskCount.toString(),
      subtext: "Requires Urgent Audit",
      change: "Action Notice",
      icon: <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      tab: "ai-risk" as AuthorityTab,
    },
    {
      title: "Pending Grievances",
      value: pendingGrievances.toString(),
      subtext: "Under SLA resolution",
      change: "< 72 hrs SLA",
      icon: <MessageSquareWarning className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      tab: "grievances" as AuthorityTab,
    },
    {
      title: "Pending Inspections",
      value: pendingInspections.toString(),
      subtext: "PMU Field Visits",
      change: "Assigned Roster",
      icon: <ClipboardCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      tab: "inspections" as AuthorityTab,
    },
    {
      title: "Compliance %",
      value: `${compliancePercent}%`,
      subtext: "Statutory GFR Audit",
      change: "11/15 Clear",
      icon: <FileCheck2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      tab: "compliance" as AuthorityTab,
    },
    {
      title: "CCTV Online",
      value: `${cctvOnlineCount}/${cctvTotal}`,
      subtext: "Telemetry Stream Health",
      change: "3 Offline Alerts",
      icon: <Video className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
      tab: "cctv" as AuthorityTab,
    },
  ];

  // District distribution chart data
  const districtChartData = AUTHORITY_DISTRICTS.map((d) => {
    const projects = MOCK_AUTHORITY_PROJECTS.filter((p) => p.district === d);
    const highRisk = projects.filter((p) => p.riskLevel === "HIGH").length;
    return {
      district: d.length > 9 ? d.substring(0, 9) + ".." : d,
      fullName: d,
      projects: projects.length,
      highRisk,
      beneficiaries: projects.reduce((acc, p) => acc + p.beneficiariesCount, 0),
    };
  });

  // Scheme fund utilization data
  const schemeFundData = MOCK_AUTHORITY_FUNDS.map((f) => ({
    name: f.schemeName.split(" ")[0],
    released: f.releasedCr,
    utilized: f.utilizedCr,
  }));

  // Monthly Attendance trend
  const attendanceTrendData = [
    { month: "Apr", attendance: 82 },
    { month: "May", attendance: 85 },
    { month: "Jun", attendance: 84 },
    { month: "Jul", attendance: 88 },
    { month: "Aug", attendance: 86 },
    { month: "Sep", attendance: 89 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-[#0B2545] to-[#0F4C81] text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider">
              ● Directorate Stream Active
            </span>
            <span className="text-xs text-blue-200">State Jurisdiction Command Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            STRIDE-X State & District Authority Portal
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-2xl leading-relaxed">
            Smart Tracking & Real-time Inspection across 15 welfare projects, 8 grantee NGOs, and 300+ direct beneficiaries in Pune, Nagpur, Thane, Nashik, and Chhatrapati Sambhajinagar.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onSelectTab("reports")}
            leftIcon={<TrendingUp className="w-4 h-4" />}
          >
            Export Directorate Digest
          </Button>
        </div>
      </div>

      {/* 9 KPI Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Jurisdiction Performance Benchmarks (KPIs)
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Synced with Central DoSJE Gateway</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3.5">
          {kpis.map((kpi, idx) => (
            <Card
              key={idx}
              hoverEffect
              onClick={() => onSelectTab(kpi.tab)}
              className="p-4 cursor-pointer border-slate-200 dark:border-slate-800 transition-all hover:border-[#0F4C81]/50 dark:hover:border-blue-500/50"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                  {kpi.icon}
                </div>
                <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {kpi.change}
                </span>
              </div>

              <div className="mt-3">
                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                  {kpi.value}
                </div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {kpi.title}
                </h3>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {kpi.subtext}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Interactive Map (State / District Jurisdiction) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Jurisdiction GIS Command Map
          </h2>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold"
          >
            <option value="ALL">All Districts ({AUTHORITY_DISTRICTS.length})</option>
            {AUTHORITY_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <AuthorityInteractiveMap
          onSelectProject={onSelectProject}
          selectedDistrictFilter={selectedDistrict}
        />
      </div>

      {/* Analytics Suite (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: District-wise Projects & High Risk Flags */}
        <Card className="p-5 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                1. District-wise Facility & Risk Density
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Total projects vs AI high risk flags across 5 districts
              </p>
            </div>
            <Badge variant="primary" size="sm">Bar Chart</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="district" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="projects" name="Total Projects" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                <Bar dataKey="highRisk" name="High Risk Alerts" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 2: Scheme Fund Released vs Utilized */}
        <Card className="p-5 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                2. Scheme Fund Released vs Utilized (₹ Cr)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                PFMS synchronized expenditure by central welfare scheme
              </p>
            </div>
            <Badge variant="primary" size="sm">Expenditure</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={schemeFundData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="released" name="Released (₹ Cr)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="utilized" name="Utilized (₹ Cr)" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 3: Monthly Attendance Trend */}
        <Card className="p-5 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                3. Biometric Attendance Trend (Apr - Sep 2026)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Average percentage across all 15 operational facilities
              </p>
            </div>
            <Badge variant="success" size="sm">Line Trend</Badge>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  name="Attendance %"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#10B981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Chart 4: Grievance Redressal Status Ratio */}
        <Card className="p-5 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                4. Grievance Redressal Velocity
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Resolution distribution for 50 registered citizen complaints
              </p>
            </div>
            <Badge variant="warning" size="sm">CPGRAMS</Badge>
          </div>
          <div className="h-56 w-full flex items-center justify-around">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Resolved: 26 (52%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Under Review: 12 (24%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Pending SLA: 8 (16%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Rejected / Duplicate: 4 (8%)</span>
              </div>
            </div>

            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Resolved", value: 26, color: "#10B981" },
                      { name: "Under Review", value: 12, color: "#F59E0B" },
                      { name: "Pending", value: 8, color: "#EF4444" },
                      { name: "Rejected", value: 4, color: "#94A3B8" },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {[
                      { color: "#10B981" },
                      { color: "#F59E0B" },
                      { color: "#EF4444" },
                      { color: "#94A3B8" },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
