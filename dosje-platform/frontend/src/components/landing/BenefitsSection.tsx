import React from "react";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Headphones,
  TrendingUp,
  HeartHandshake,
  CheckCircle,
} from "lucide-react";
import { BENEFITS } from "@/constants/landingData";
import { SectionHeader } from "./SectionHeader";
import { Card } from "@/components/ui/Card";

export const BenefitsSection: React.FC = () => {
  const getIcon = (name: string) => {
    const props = { className: "w-5 h-5 text-teal-600 dark:text-teal-400" };
    switch (name) {
      case "Sparkles":
        return <Sparkles {...props} />;
      case "ShieldCheck":
        return <ShieldCheck {...props} />;
      case "Zap":
        return <Zap {...props} />;
      case "Headphones":
        return <Headphones {...props} />;
      case "TrendingUp":
        return <TrendingUp {...props} />;
      case "HeartHandshake":
        return <HeartHandshake {...props} />;
      default:
        return <CheckCircle {...props} />;
    }
  };

  return (
    <section id="benefits" className="py-20 lg:py-28 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Measurable Impact"
          badgeVariant="secondary"
          title="Direct Benefits to Central, State & Citizen Stakeholders"
          subtitle="Transforming social welfare administration from reactive periodic paperwork into continuous, verifiable, and compassionate governance."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {BENEFITS.map((benefit) => (
            <Card
              key={benefit.id}
              hoverEffect
              className="p-6 border-slate-200 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-100 dark:border-teal-900/60">
                    {getIcon(benefit.iconName)}
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    {benefit.metric}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {benefit.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <CheckCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Standardized under DoSJE SOPs</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
