import React from "react";
import { FEATURES } from "@/constants/landingData";
import { SectionHeader } from "./SectionHeader";
import { FeatureCard } from "./FeatureCard";

export const FeatureSection: React.FC = () => {
  return (
    <section id="features" className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Platform Capabilities"
          badgeVariant="primary"
          title="Enterprise Monitoring & Intelligent Compliance Suite"
          subtitle="Engineered to provide end-to-end transparency, automated fraud prevention, and real-time operational governance across all welfare touchpoints."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((feature, idx) => (
            <FeatureCard key={feature.id} feature={feature} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};
