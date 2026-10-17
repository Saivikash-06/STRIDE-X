"use client";

import React from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Building2,
  Users,
  UserCheck,
  MessageSquareWarning,
  Video,
  ShieldAlert,
  ClipboardCheck,
  FileCheck2,
  CircleDollarSign,
  FileText,
  Bell,
  UserCog,
  X,
  MapPin,
} from "lucide-react";
import { AuthorityTab } from "@/types/authority";

interface AuthoritySidebarProps {
  activeTab: AuthorityTab;
  onSelectTab: (tab: AuthorityTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: AuthorityTab;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
}

export const AuthoritySidebar: React.FC<AuthoritySidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
}) => {
  const navItems: NavItem[] = [
    {
      id: "overview",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: "projects",
      label: "Projects",
      icon: <FolderKanban className="w-4 h-4" />,
      badge: 15,
      badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    },
    {
      id: "ngos",
      label: "NGOs / Institutes",
      icon: <Building2 className="w-4 h-4" />,
      badge: 8,
    },
    {
      id: "beneficiaries",
      label: "Beneficiaries",
      icon: <Users className="w-4 h-4" />,
      badge: "300",
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: <UserCheck className="w-4 h-4" />,
      badge: "Alerts",
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    },
    {
      id: "grievances",
      label: "Grievances",
      icon: <MessageSquareWarning className="w-4 h-4" />,
      badge: 8,
      badgeColor: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
    },
    {
      id: "cctv",
      label: "CCTV Monitoring",
      icon: <Video className="w-4 h-4" />,
      badge: "3 Off",
      badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    },
    {
      id: "ai-risk",
      label: "AI Risk Alerts",
      icon: <ShieldAlert className="w-4 h-4" />,
      badge: 4,
      badgeColor: "bg-rose-600 text-white animate-pulse",
    },
    {
      id: "inspections",
      label: "Inspection Management",
      icon: <ClipboardCheck className="w-4 h-4" />,
      badge: 6,
    },
    {
      id: "compliance",
      label: "Compliance",
      icon: <FileCheck2 className="w-4 h-4" />,
      badge: 3,
      badgeColor: "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900",
    },
    {
      id: "funds",
      label: "Fund Tracking",
      icon: <CircleDollarSign className="w-4 h-4" />,
      badge: "91%",
    },
    {
      id: "reports",
      label: "Reports",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
      badge: 3,
      badgeColor: "bg-blue-600 text-white",
    },
    {
      id: "profile",
      label: "Profile",
      icon: <UserCog className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden animate-in fade-in"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 z-50 lg:z-30 h-screen lg:h-[calc(100vh-4rem)] w-64 lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out shrink-0 flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Mobile Header in Drawer */}
          <div className="lg:hidden p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#0F4C81] text-white flex items-center justify-center font-bold text-xs">
                MH
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                State Authority Hub
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close Sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Jurisdiction Summary Card */}
          <div className="p-3 m-3 mb-1 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0F4C81] dark:text-blue-400">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>Assigned Jurisdiction</span>
            </div>
            <div className="text-xs font-black text-slate-800 dark:text-slate-100 mt-1">
              Maharashtra Directorate
            </div>
            <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
              Pune, Nagpur, Thane, Nashik, Sambhajinagar (5 Districts)
            </div>
          </div>

          {/* Navigation Item List */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 text-xs">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? "bg-[#0F4C81] text-white font-bold shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono shrink-0 ml-1 ${
                        item.badgeColor ||
                        (isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400")
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom System Health Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2 text-[10.5px] text-slate-600 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-semibold truncate">Directorate GIS Live: 15 Hubs</span>
          </div>
        </div>
      </aside>
    </>
  );
};
