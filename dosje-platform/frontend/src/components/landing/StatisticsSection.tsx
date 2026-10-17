import React from "react";
import { STATISTICS } from "@/constants/landingData";
import { SectionHeader } from "./SectionHeader";
import { StatisticCard } from "./StatisticCard";

export const StatisticsSection: React.FC = () => {
  return (
    <section id="statistics" className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="National Telemetry"
          badgeVariant="primary"
          title="Pan-India Operational Metrics & Verification Benchmarks"
          subtitle="Real-time statistical overview capturing verified welfare delivery, active inspection coverage, and compliance integrity across India."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {STATISTICS.map((stat) => (
            <StatisticCard key={stat.id} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};
