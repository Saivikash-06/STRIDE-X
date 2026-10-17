"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/landing/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_DEFAULT_ROUTES } from "@/constants/demoAccounts";

export default function UnauthorizedPage() {
  const { currentUser, role, logout } = useAuth();

  const userHome = role ? ROLE_DEFAULT_ROUTES[role] || "/" : "/login";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-6">
      <div className="max-w-xl w-full mx-auto py-2">
        <Link href="/" className="inline-flex">
          <Logo size="sm" isLink={false} />
        </Link>
      </div>

      <div className="max-w-xl w-full mx-auto">
        <Card className="p-8 sm:p-10 border-rose-200 dark:border-rose-900/60 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-800">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 inline-block mb-3">
              Error Code 403 • Access Prohibited
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Unauthorized Clearance Level
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              Your authenticated official profile does not possess the statutory privileges required to access this departmental workspace.
            </p>
          </div>

          {currentUser && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left text-xs space-y-1.5">
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                Current Session Profile:
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                <span className="font-medium text-slate-700 dark:text-slate-300">Name:</span> {currentUser.name}
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                <span className="font-medium text-slate-700 dark:text-slate-300">Role:</span>{" "}
                <span className="uppercase font-bold text-[#0F4C81] dark:text-blue-400">
                  {currentUser.role}
                </span>
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                <span className="font-medium text-slate-700 dark:text-slate-300">Department:</span> {currentUser.department}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href={userHome} className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full sm:w-auto" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Return to My Authorized Workspace
              </Button>
            </Link>
            <Button
              variant="outline"
              size="md"
              onClick={logout}
              className="w-full sm:w-auto"
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              Sign In with Another Account
            </Button>
          </div>
        </Card>
      </div>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-2">
        <span>Statutory Vigilance & IT Security Cell • Department of Social Justice & Empowerment</span>
      </div>
    </div>
  );
}
