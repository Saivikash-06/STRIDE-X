"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, checked, defaultChecked, onChange, disabled, ...props }, ref) => {
    const inputId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex items-start gap-2.5 text-left">
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={onChange}
            disabled={disabled}
            className={cn(
              "peer h-4 w-4 shrink-0 appearance-none rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/25 dark:focus:ring-blue-500/30 checked:bg-[#0F4C81] dark:checked:bg-blue-600 checked:border-[#0F4C81] dark:checked:border-blue-600 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-rose-500 dark:border-rose-500",
              className
            )}
            {...props}
          />
          <Check className="pointer-events-none absolute h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
        </div>
        {(label || description) && (
          <div className="flex flex-col text-xs">
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  "font-medium text-slate-700 dark:text-slate-300 select-none cursor-pointer",
                  disabled && "cursor-not-allowed opacity-60"
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">{description}</p>
            )}
            {error && <p className="text-rose-600 dark:text-rose-400 mt-1 font-medium">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
