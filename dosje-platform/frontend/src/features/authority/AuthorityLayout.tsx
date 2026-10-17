"use client";

import React, { useState } from "react";
import { AuthorityTab, AuthorityProject } from "@/types/authority";
import { AuthorityHeader } from "./AuthorityHeader";
import { AuthoritySidebar } from "./AuthoritySidebar";

// Tab Components
import { AuthorityOverviewTab } from "./tabs/AuthorityOverviewTab";
import { AuthorityProjectsTab } from "./tabs/AuthorityProjectsTab";
import { AuthorityNgosTab } from "./tabs/AuthorityNgosTab";
import { AuthorityBeneficiariesTab } from "./tabs/AuthorityBeneficiariesTab";
import { AuthorityAttendanceTab } from "./tabs/AuthorityAttendanceTab";
import { AuthorityGrievancesTab } from "./tabs/AuthorityGrievancesTab";
import { AuthorityCctvTab } from "./tabs/AuthorityCctvTab";
import { AuthorityAiRiskTab } from "./tabs/AuthorityAiRiskTab";
import AuthorityInspectionsTab from "./tabs/AuthorityInspectionsTab";
import AuthorityComplianceTab from "./tabs/AuthorityComplianceTab";
import AuthorityFundsTab from "./tabs/AuthorityFundsTab";
import AuthorityReportsTab from "./tabs/AuthorityReportsTab";
import AuthorityNotificationsTab from "./tabs/AuthorityNotificationsTab";
import AuthorityProfileTab from "./tabs/AuthorityProfileTab";

import {
  ChevronRight,
  Home,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { AUTHORITY_STATE, AUTHORITY_DISTRICTS } from "@/mock/authorityMockData";

export const AuthorityLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AuthorityTab>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<AuthorityProject | null>(null);

  const handleSelectTab = (tab: AuthorityTab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectProjectFromOverview = (project: AuthorityProject) => {
    setSelectedProject(project);
    setActiveTab("projects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getTabLabel = (tab: AuthorityTab): string => {
    switch (tab) {
      case "overview":
        return "Dashboard Overview";
      case "projects":
        return "Project Monitoring";
      case "ngos":
        return "NGOs / Institutes Management";
      case "beneficiaries":
        return "Beneficiary Monitoring";
      case "attendance":
        return "Biometric Attendance";
      case "grievances":
        return "Grievance Management";
      case "cctv":
        return "CCTV Telemetry Monitoring";
      case "ai-risk":
        return "AI Risk Alerts Engine";
      case "inspections":
        return "PMU Inspection Management";
      case "compliance":
        return "Statutory Compliance & GFR 238";
      case "funds":
        return "PFMS Fund Tracking";
      case "reports":
        return "Analytical Reports Dossier";
      case "notifications":
        return "Notification Center";
      case "profile":
        return "Authority Profile & Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Universal Government Top Header */}
      <AuthorityHeader
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onSelectTab={handleSelectTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        unreadCount={3}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <AuthoritySidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Breadcrumb & Sub-Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <button
                onClick={() => handleSelectTab("overview")}
                className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Portal</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-700 dark:text-slate-300">
                State / District Authority
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {getTabLabel(activeTab)}
              </span>
            </nav>

            {/* Jurisdiction Badge */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Jurisdiction: {AUTHORITY_STATE} ({AUTHORITY_DISTRICTS.length} Districts)</span>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Refresh Live Telemetry"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Tab Component Render */}
          <div className="w-full">
            {activeTab === "overview" && (
              <AuthorityOverviewTab
                onSelectTab={handleSelectTab}
                onSelectProject={handleSelectProjectFromOverview}
              />
            )}

            {activeTab === "projects" && (
              <AuthorityProjectsTab
                initialSelectedProject={selectedProject}
                onSelectProject={(proj) => setSelectedProject(proj)}
              />
            )}

            {activeTab === "ngos" && <AuthorityNgosTab />}

            {activeTab === "beneficiaries" && <AuthorityBeneficiariesTab />}

            {activeTab === "attendance" && <AuthorityAttendanceTab />}

            {activeTab === "grievances" && <AuthorityGrievancesTab />}

            {activeTab === "cctv" && <AuthorityCctvTab />}

            {activeTab === "ai-risk" && <AuthorityAiRiskTab />}

            {activeTab === "inspections" && <AuthorityInspectionsTab />}

            {activeTab === "compliance" && <AuthorityComplianceTab />}

            {activeTab === "funds" && <AuthorityFundsTab />}

            {activeTab === "reports" && <AuthorityReportsTab />}

            {activeTab === "notifications" && (
              <AuthorityNotificationsTab onNavigateTab={handleSelectTab} />
            )}

            {activeTab === "profile" && <AuthorityProfileTab />}
          </div>
        </main>
      </div>

      {/* Official Government Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © 2026 Department of Social Justice & Empowerment, Government of India & Government of Maharashtra.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>SIH 2026 – PS095</span>
            <span>•</span>
            <span>Module 3: State / District Authority Dashboard</span>
            <span>•</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">Telemetry Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default AuthorityLayout;
