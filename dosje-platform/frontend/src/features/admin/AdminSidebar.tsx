"use client";

import React from "react";
import {
  LayoutDashboard,
  Layers,
  FolderKanban,
  Building2,
  Users,
  CalendarCheck,
  Camera,
  MessageSquareWarning,
  BrainCircuit,
  ClipboardCheck,
  ShieldCheck,
  CircleDollarSign,
  FileSpreadsheet,
  Bell,
  History,
  Settings,
  X,
} from "lucide-react";
import { AdminTab } from "@/types/admin";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
}) => {
  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    badgeVariant?: "primary" | "secondary" | "danger" | "warning";
  }[] = [
    {
      id: "overview",
      label: "Dashboard Home",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: "schemes",
      label: "Scheme Management",
      icon: <Layers className="w-4 h-4" />,
      badge: "8 Schemes",
    },
    {
      id: "projects",
      label: "Welfare Projects",
      icon: <FolderKanban className="w-4 h-4" />,
      badge: "25 Active",
    },
    {
      id: "ngos",
      label: "NGOs / Institutes",
      icon: <Building2 className="w-4 h-4" />,
      badge: "10 Vetted",
    },
    {
      id: "beneficiaries",
      label: "Beneficiary Directory",
      icon: <Users className="w-4 h-4" />,
      badge: "1.84M",
    },
    {
      id: "attendance",
      label: "Biometric Attendance",
      icon: <CalendarCheck className="w-4 h-4" />,
      badge: "92.4%",
    },
    {
      id: "cctv",
      label: "CCTV Telemetry",
      icon: <Camera className="w-4 h-4" />,
      badge: "15 Feeds",
    },
    {
      id: "grievances",
      label: "Grievance Desk",
      icon: <MessageSquareWarning className="w-4 h-4" />,
      badge: "40 Tickets",
      badgeVariant: "warning",
    },
    {
      id: "ai-risk",
      label: "AI Risk Engine",
      icon: <BrainCircuit className="w-4 h-4" />,
      badge: "3 High Risk",
      badgeVariant: "danger",
    },
    {
      id: "inspections",
      label: "Inspection Audits",
      icon: <ClipboardCheck className="w-4 h-4" />,
      badge: "20 Field",
    },
    {
      id: "compliance",
      label: "Statutory Compliance",
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: "12 Cases",
    },
    {
      id: "funds",
      label: "Public Fund Tracking",
      icon: <CircleDollarSign className="w-4 h-4" />,
      badge: "₹5,205 Cr",
    },
    {
      id: "reports",
      label: "National MIS Reports",
      icon: <FileSpreadsheet className="w-4 h-4" />,
    },
    {
      id: "notifications",
      label: "Notification Center",
      icon: <Bell className="w-4 h-4" />,
      badge: "30 Alerts",
      badgeVariant: "primary",
    },
    {
      id: "audit-logs",
      label: "Vigilance Audit Logs",
      icon: <History className="w-4 h-4" />,
    },
    {
      id: "settings",
      label: "System Settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 font-bold text-white text-sm">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#0B5ED7] to-[#198754] flex items-center justify-center text-white text-xs font-black shadow-xs">
              SX
            </div>
            <div className="flex flex-col">
              <span className="leading-tight text-xs font-extrabold tracking-tight">
                STRIDE-X
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Government Monitoring Platform</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Platform Modules
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#0F4C81] text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={isActive ? "text-white" : "text-slate-400"}>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                      isActive
                        ? "bg-white/20 text-white"
                        : item.badgeVariant === "danger"
                        ? "bg-rose-950 text-rose-300 border border-rose-800/60"
                        : item.badgeVariant === "warning"
                        ? "bg-amber-950 text-amber-300 border border-amber-800/60"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/60 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div className="truncate">
              <span className="text-white font-semibold">NIC Sovereign Cloud</span>
              <div className="text-[10px] text-slate-500">Server Node 10.42.0.1</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
