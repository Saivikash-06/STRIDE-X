"use client";

import React from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeMode } from "@/types/theme";

export const ThemeToggle: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81]"
        aria-label={`Current theme is ${resolvedTheme}. Click to toggle.`}
        title={`Toggle theme (Current: ${resolvedTheme})`}
      >
        {resolvedTheme === "dark" ? (
          <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
        ) : (
          <Moon className="w-4 h-4 text-[#0F4C81] hover:-rotate-12 transition-transform" />
        )}
      </button>
    );
  }

  const themes: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: "light", label: "Light", icon: <Sun className="w-3.5 h-3.5" /> },
    { mode: "dark", label: "Dark", icon: <Moon className="w-3.5 h-3.5" /> },
    { mode: "system", label: "System", icon: <Laptop className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80">
        {themes.map((item) => {
          const isActive = theme === item.mode;
          return (
            <button
              key={item.mode}
              onClick={() => setTheme(item.mode)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? "bg-white dark:bg-slate-900 text-[#0F4C81] dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              aria-pressed={isActive}
              aria-label={`Set theme to ${item.label}`}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
