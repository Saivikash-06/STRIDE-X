"use client";

import React, { useEffect, useState, useRef } from "react";
import { FolderKanban, Users, Building2, Map, ClipboardCheck, AlertTriangle, ArrowUpRight } from "lucide-react";
import { StatItem } from "@/constants/landingData";
import { Card } from "@/components/ui/Card";

export const StatisticCard: React.FC<{ stat: StatItem }> = ({ stat }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const target = stat.numericTarget;
          const duration = 1200; // ms
          const steps = 40;
          const stepTime = duration / steps;
          let currentStep = 0;

          const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentVal = target * easeOutQuart;

            if (currentStep >= steps) {
              setDisplayValue(target);
              clearInterval(timer);
            } else {
              setDisplayValue(currentVal);
            }
          }, stepTime);
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [stat.numericTarget, hasAnimated]);

  const getIcon = (name: string) => {
    const props = { className: "w-5 h-5 text-[#0F4C81] dark:text-blue-400" };
    switch (name) {
      case "FolderKanban":
        return <FolderKanban {...props} />;
      case "Users":
        return <Users {...props} />;
      case "Building2":
        return <Building2 {...props} />;
      case "Map":
        return <Map {...props} />;
      case "ClipboardCheck":
        return <ClipboardCheck {...props} />;
      case "AlertTriangle":
        return <AlertTriangle {...props} className="w-5 h-5 text-amber-500" />;
      default:
        return <FolderKanban {...props} />;
    }
  };

  const formatNumber = () => {
    if (!hasAnimated) return stat.value;
    if (stat.numericTarget >= 1000000) {
      return (displayValue / 1000000).toFixed(2) + "M";
    }
    if (stat.numericTarget % 1 !== 0) {
      return displayValue.toFixed(1) + stat.suffix;
    }
    return Math.floor(displayValue).toLocaleString("en-IN") + stat.suffix;
  };

  return (
    <div ref={cardRef}>
      <Card hoverEffect className="p-6 h-full flex flex-col justify-between relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 dark:bg-blue-500/10 rounded-bl-full pointer-events-none" />

        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60">
              {getIcon(stat.iconName)}
            </div>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              <ArrowUpRight className="w-3 h-3" />
              {stat.change}
            </span>
          </div>

          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
            {formatNumber()}
          </div>

          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-2">
            {stat.label}
          </h4>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          {stat.subtext}
        </p>
      </Card>
    </div>
  );
};
