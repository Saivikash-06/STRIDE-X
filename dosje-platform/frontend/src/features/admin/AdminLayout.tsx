"use client";

import React, { useState } from "react";
import { AdminTab, Project } from "@/types/admin";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminDashboard } from "./AdminDashboard";
import { SchemesTab } from "./tabs/SchemesTab";
import { ProjectsTab } from "./tabs/ProjectsTab";
import { NgosTab } from "./tabs/NgosTab";
import { BeneficiariesTab } from "./tabs/BeneficiariesTab";
import { AttendanceTab } from "./tabs/AttendanceTab";
import { CctvTab } from "./tabs/CctvTab";
import { GrievancesTab } from "./tabs/GrievancesTab";
import { AiRiskTab } from "./tabs/AiRiskTab";
import { InspectionsTab } from "./tabs/InspectionsTab";
import { ComplianceTab } from "./tabs/ComplianceTab";
import { FundsTab } from "./tabs/FundsTab";
import { ReportsTab } from "./tabs/ReportsTab";
import { NotificationsTab } from "./tabs/NotificationsTab";
import { AuditLogsTab } from "./tabs/AuditLogsTab";
import { SettingsTab } from "./tabs/SettingsTab";
import { ChevronRight, Home } from "lucide-react";

export const AdminLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectForView, setSelectedProjectForView] = useState<Project | null>(null);

  const handleSelectProjectFromMap = (project: Project) => {
    setSelectedProjectForView(project);
    setActiveTab("projects");
  };

  const getBreadcrumbTitle = (tab: AdminTab) => {
    switch (tab) {
      case "overview":
        return "National Command Center";
      case "schemes":
        return "Scheme Management";
      case "projects":
        return "Welfare Projects Master Directory";
      case "ngos":
        return "Empaneled Grantee NGOs";
      case "beneficiaries":
        return "Beneficiary Directory (Aadhaar e-KYC)";
      case "attendance":
        return "Biometric Attendance Telemetry";
      case "cctv":
        return "CCTV Telemetry & Feeds";
      case "grievances":
        return "Citizen Grievance Redressal Desk";
      case "ai-risk":
        return "AI Risk Engine & Anomaly Flags";
      case "inspections":
        return "PMU Field Inspection Audits";
      case "compliance":
        return "Statutory Compliance & Legal Matrix";
      case "funds":
        return "Public Finance & PFMS Tracking";
      case "reports":
        return "National MIS Reporting";
      case "notifications":
        return "Vigilance Notification Center";
      case "audit-logs":
        return "Statutory Audit Trail";
      case "settings":
        return "Command Center Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Panel with left offset for desktop sidebar */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Sticky Header */}
        <AdminHeader
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onSelectProject={handleSelectProjectFromMap}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Breadcrumb Bar */}
        <div className="px-4 sm:px-6 lg:px-8 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveTab("overview")}
              className="flex items-center gap-1 hover:text-[#0F4C81] dark:hover:text-blue-400 font-medium"
            >
              <Home className="w-3.5 h-3.5" />
              <span>DoSJE Central</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {getBreadcrumbTitle(activeTab)}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span>Auth Level: IAS (Central Joint Secretary)</span>
          </div>
        </div>

        {/* Tab View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === "overview" && (
            <AdminDashboard
              onSelectTab={setActiveTab}
              onSelectProject={handleSelectProjectFromMap}
            />
          )}
          {activeTab === "schemes" && <SchemesTab />}
          {activeTab === "projects" && (
            <ProjectsTab
              selectedProject={selectedProjectForView}
              onClearSelectedProject={() => setSelectedProjectForView(null)}
            />
          )}
          {activeTab === "ngos" && <NgosTab />}
          {activeTab === "beneficiaries" && <BeneficiariesTab />}
          {activeTab === "attendance" && <AttendanceTab />}
          {activeTab === "cctv" && <CctvTab />}
          {activeTab === "grievances" && <GrievancesTab />}
          {activeTab === "ai-risk" && <AiRiskTab />}
          {activeTab === "inspections" && <InspectionsTab />}
          {activeTab === "compliance" && <ComplianceTab />}
          {activeTab === "funds" && <FundsTab />}
          {activeTab === "reports" && <ReportsTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "audit-logs" && <AuditLogsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>
            © 2026 Department of Social Justice & Empowerment, Government of India. All rights reserved.
          </span>
          <span className="font-mono">Central Command Portal • v2.0.0 (Production)</span>
        </footer>
      </div>
    </div>
  );
};
