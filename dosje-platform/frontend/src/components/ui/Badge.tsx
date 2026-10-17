import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "neutral" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "primary",
  size = "md",
  dot = false,
  children,
  ...props
}) => {
  const variantStyles = {
    primary: "bg-blue-100 dark:bg-blue-950 text-[#0F4C81] dark:text-blue-300 border-blue-200 dark:border-blue-800",
    secondary: "bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    success: "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    warning: "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    danger: "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    neutral: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    outline: "bg-transparent text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600",
  };

  const dotColors = {
    primary: "bg-[#0F4C81] dark:bg-blue-400",
    secondary: "bg-teal-600 dark:bg-teal-400",
    success: "bg-emerald-600 dark:bg-emerald-400",
    warning: "bg-amber-600 dark:bg-amber-400",
    danger: "bg-rose-600 dark:bg-rose-400",
    neutral: "bg-slate-500 dark:bg-slate-400",
    outline: "bg-slate-500",
  };

  const sizeStyles = {
    sm: "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
    md: "text-xs font-semibold px-2.5 py-1 rounded-full border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 uppercase tracking-wider",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />}
      {children}
    </span>
  );
};
