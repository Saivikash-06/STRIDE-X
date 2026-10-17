"use client";

import React from "react";
import { KeyRound, Shield, Building, Award, Users, User, ArrowRight, Sparkles } from "lucide-react";
import { DEMO_ACCOUNTS } from "@/constants/demoAccounts";
import { DemoAccount } from "@/types/auth";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/contexts/AuthContext";

interface DemoAccountsPanelProps {
  onSelectAccount: (account: DemoAccount) => void;
  selectedEmail?: string;
}

export const DemoAccountsPanel: React.FC<DemoAccountsPanelProps> = ({
  onSelectAccount,
  selectedEmail,
}) => {
  const { switchDemoAccount, isLoading } = useAuth();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "authority":
        return <Award className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      case "ngo":
        return <Building className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case "staff":
        return <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case "beneficiary":
        return <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "pmu":
        return <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <KeyRound className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#0F4C81] dark:text-blue-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Demo Login Panel (1-Click Auto Fill)
          </h3>
        </div>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
          Click role to fill
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {DEMO_ACCOUNTS.map((account) => {
          const isSelected = selectedEmail?.toLowerCase() === account.email.toLowerCase();

          return (
            <div
              key={account.id}
              onClick={() => onSelectAccount(account)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onSelectAccount(account);
                }
              }}
              className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                isSelected
                  ? "bg-blue-50/80 dark:bg-blue-950/40 border-[#0F4C81] dark:border-blue-500 ring-1 ring-[#0F4C81]/30"
                  : "bg-white dark:bg-slate-850 hover:bg-slate-100/80 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700/80"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white truncate">
                    {getRoleIcon(account.role)}
                    <span className="truncate">{account.roleTitle}</span>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {account.role.toUpperCase()}
                  </Badge>
                </div>

                <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate">
                  {account.email}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 dark:text-slate-400">Pass: Demo@123</span>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    switchDemoAccount(account);
                  }}
                  className="font-semibold text-[#0F4C81] dark:text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  Quick Sign-In <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
