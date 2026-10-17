"use client";

import React, { useState } from "react";
import {
  Bell,
  LogOut,
  Shield,
  Menu,
  ChevronDown,
  Globe,
  Settings,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Logo } from "@/components/landing/Logo";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationPanel } from "./NotificationPanel";
import { AdminTab, Project } from "@/types/admin";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onSelectProject?: (project: Project) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  activeTab: _activeTab,
  onSelectTab,
  onSelectProject,
}) => {
  const { currentUser, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<"EN" | "HI">("EN");

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Sidebar Toggle + Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <Logo size="sm" isLink={true} showSubtitle={false} />
            <span className="hidden xl:inline-block text-slate-300 dark:text-slate-700">|</span>
            <div className="hidden xl:flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                STRIDE-X National Command Center
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Department of Social Justice & Empowerment • Govt. of India
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-lg hidden md:block">
          <GlobalSearch
            onSelectTab={onSelectTab}
            onSelectProject={onSelectProject}
            placeholder="Search across projects, schemes, NGOs, beneficiaries, inspections (Ctrl+K)..."
          />
        </div>

        {/* Right: Language, Notifications, Theme, User Profile, Logout */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={() => setCurrentLanguage((l) => (l === "EN" ? "HI" : "EN"))}
            className="px-2 py-1 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-colors"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{currentLanguage === "EN" ? "English" : "हिन्दी"}</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <ThemeToggle />

          {/* Notification Center Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 z-50 animate-in fade-in">
                <NotificationPanel
                  onSelectTab={onSelectTab}
                  onClose={() => setShowNotifications(false)}
                />
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-[#0B5ED7] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser?.name?.slice(0, 2).toUpperCase() || "JS"}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {currentUser?.name || "Dr. Rajeshwar Verma, IAS"}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Joint Secretary (Central)
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white">
                    {currentUser?.name || "Dr. Rajeshwar Verma, IAS"}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {currentUser?.email || "dosje.admin@demo.gov"}
                  </div>
                  <div className="mt-1.5 inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    Authorized IAS Central Clearance
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onSelectTab("settings");
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Security & Profile Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      onSelectTab("audit-logs");
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Statutory Audit Logs</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
