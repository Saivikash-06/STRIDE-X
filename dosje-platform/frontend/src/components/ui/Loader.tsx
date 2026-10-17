import React from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = "md", className, text }) => {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <div className={cn("inline-flex flex-col items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-[#0F4C81] dark:text-blue-400", sizeMap[size])} />
      {text && <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{text}</span>}
    </div>
  );
};

export const FullScreenLoader: React.FC<{ message?: string; subMessage?: string }> = ({
  message = "STRIDE-X",
  subMessage = "Loading Government Monitoring Platform...",
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm p-4">
      <div className="flex flex-col items-center max-w-sm text-center">
        <div className="relative mb-5 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center border border-blue-200 dark:border-blue-800">
            <ShieldCheck className="w-9 h-9 text-[#0F4C81] dark:text-blue-400 animate-pulse" />
          </div>
          <Loader2 className="absolute -inset-1.5 w-[76px] h-[76px] text-[#0F4C81]/30 dark:text-blue-500/30 animate-spin" />
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{message}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{subMessage}</p>
        <div className="w-48 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-5 overflow-hidden">
          <div className="w-full h-full bg-[#0F4C81] dark:bg-blue-500 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export const PageLoader: React.FC<{ title?: string }> = ({ title = "Retrieving official records..." }) => {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center text-center">
      <Loader size="lg" />
      <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
    </div>
  );
};

export const AuthLoader: React.FC<{ roleName?: string }> = ({ roleName = "Officer" }) => {
  return (
    <div className="p-8 flex flex-col items-center justify-center text-center">
      <Loader2 className="w-10 h-10 animate-spin text-[#0F4C81] dark:text-blue-400 mb-4" />
      <h4 className="text-base font-bold text-slate-900 dark:text-white">Authenticating {roleName}...</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
        Generating authenticated session token and verifying role privileges.
      </p>
    </div>
  );
};
