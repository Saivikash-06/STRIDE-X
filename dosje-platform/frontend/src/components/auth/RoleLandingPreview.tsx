"use client";

import React from "react";
import {
  Shield,
  LogOut,
  UserCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import { DEMO_ACCOUNTS } from "@/constants/demoAccounts";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Logo } from "@/components/landing/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface RoleLandingPreviewProps {
  role: UserRole;
  title: string;
  nextModule: string;
  moduleFile: string;
}

export const RoleLandingPreview: React.FC<RoleLandingPreviewProps> = ({
  role,
  title,
  nextModule,
  moduleFile,
}) => {
  const { currentUser, session, logout, switchDemoAccount, isLoading } = useAuth();

  return (
    <ProtectedRoute allowedRoles={[role]}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo size="sm" isLink={true} />
              <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">|</span>
              <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-[#0F4C81] dark:text-blue-400">
                {title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle compact />

              {currentUser && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                    {currentUser.name}
                  </span>
                  <Badge variant="primary" size="sm">
                    {currentUser.role.toUpperCase()}
                  </Badge>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                leftIcon={<LogOut className="w-3.5 h-3.5" />}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 flex-1">
          {/* Module 1 Foundation Banner */}
          <div className="p-6 rounded-2xl bg-linear-to-r from-blue-900 to-[#0F4C81] text-white shadow-lg space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Badge variant="secondary" size="md" dot>
                Frontend Module 1: Foundation Active
              </Badge>
              <span className="text-xs font-mono text-blue-200">
                Session Active • Protected Route Verified
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {title}
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-3xl">
              You have successfully authenticated via DoSJE Role-Based Access Control. This workspace is protected by Route Guards and session validation. In the upcoming phase, <strong className="text-white underline">{nextModule}</strong> ({moduleFile}) will attach full operational analytics, tables, and inspection forms.
            </p>
          </div>

          {/* User Profile & Session Telemetry Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Authenticated Officer Details Card */}
            <Card className="lg:col-span-2 p-6 border-slate-200 dark:border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#0F4C81] dark:text-blue-400" />
                  Authenticated Profile & Statutory Scope
                </h2>
                <Badge variant="success" size="sm" dot>
                  Session Verified
                </Badge>
              </div>

              {currentUser && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-medium">Official Name</span>
                    <strong className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
                      {currentUser.name}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-medium">Clearance Designation</span>
                    <span className="text-slate-800 dark:text-slate-200 mt-0.5 block font-semibold">
                      {currentUser.designation}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-medium">Department / Org</span>
                    <span className="text-slate-800 dark:text-slate-200 mt-0.5 block">
                      {currentUser.department}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-medium">Assigned Jurisdiction</span>
                    <span className="text-slate-800 dark:text-slate-200 mt-0.5 block">
                      {currentUser.jurisdiction || "National"}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-medium">Official Email</span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono mt-0.5 block">
                      {currentUser.email}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-medium">Security Badge</span>
                    <span className="text-slate-800 dark:text-slate-200 font-mono font-semibold mt-0.5 block">
                      {currentUser.badgeNumber || "SEC-01"}
                    </span>
                  </div>
                </div>
              )}

              {session && (
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-[11px] font-mono space-y-1">
                  <div className="text-slate-500 dark:text-slate-400">
                    Bearer Token: {session.token.substring(0, 36)}...
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    Session Valid Until: {formatDate(session.expiresAt)}
                  </div>
                </div>
              )}
            </Card>

            {/* Quick Role Switcher for Testing */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <Layers className="w-4 h-4 text-[#0F4C81] dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Test Other Roles
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any role to verify seamless role-switching, session updates, and route guard redirects:
              </p>

              <div className="space-y-1.5">
                {DEMO_ACCOUNTS.map((acc) => {
                  const isCurrent = acc.role === role;
                  return (
                    <button
                      key={acc.id}
                      disabled={isLoading || isCurrent}
                      onClick={() => switchDemoAccount(acc)}
                      className={`w-full p-2 rounded-lg text-left text-xs transition-all flex items-center justify-between ${
                        isCurrent
                          ? "bg-blue-50 dark:bg-blue-950/60 text-[#0F4C81] dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <span className="truncate">{acc.roleTitle}</span>
                      {isCurrent ? (
                        <span className="text-[10px] text-blue-600 dark:text-blue-400">Active</span>
                      ) : (
                        <ArrowRight className="w-3 h-3 opacity-60" />
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Module 1 Foundation Ready Checklist */}
          <Card className="p-6 border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Module 1 UI Foundation Deliverables Status:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {[
                "Landing Page with 7 Complete Sections",
                "Theme System (Light/Dark/System + Storage)",
                "Role-based Protected Routes (/admin, /authority, etc.)",
                "Login System with 6 Demo Accounts & 1-Click Fill",
                "Password Recovery with Token Dispatch UX",
                "Accessible Reusable UI Primitives (Button, Modal, Input...)",
                "Toast Notification System & Alert States",
                "403 Forbidden & 404 Error State Guards",
                "Government Enterprise Design & Brand Logo",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
          <span>DoSJE Welfare Monitoring & Compliance Platform • Module 1 Authentication & UI Foundation</span>
        </footer>
      </div>
    </ProtectedRoute>
  );
};
