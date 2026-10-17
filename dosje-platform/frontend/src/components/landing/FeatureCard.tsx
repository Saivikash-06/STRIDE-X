import React from "react";
import {
  BrainCircuit,
  ShieldAlert,
  Camera,
  UserCheck,
  MapPin,
  FileCheck2,
  Fingerprint,
  CircleDollarSign,
  FileSpreadsheet,
  BellRing,
  Sparkles,
} from "lucide-react";
import { FeatureItem } from "@/constants/landingData";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const FeatureCard: React.FC<{ feature: FeatureItem; index: number }> = ({ feature }) => {
  const getIcon = (name: string) => {
    const props = { className: "w-6 h-6" };
    switch (name) {
      case "BrainCircuit":
        return <BrainCircuit {...props} className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case "ShieldAlert":
        return <ShieldAlert {...props} className="w-6 h-6 text-rose-600 dark:text-rose-400" />;
      case "Camera":
        return <Camera {...props} className="w-6 h-6 text-teal-600 dark:text-teal-400" />;
      case "UsersCheck":
        return <UserCheck {...props} className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case "MapPinCheck":
        return <MapPin {...props} className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case "FileCheck2":
        return <FileCheck2 {...props} className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case "Fingerprint":
        return <Fingerprint {...props} className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />;
      case "CircleDollarSign":
        return <CircleDollarSign {...props} className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      case "FileSpreadsheet":
        return <FileSpreadsheet {...props} className="w-6 h-6 text-slate-600 dark:text-slate-400" />;
      case "BellRing":
        return <BellRing {...props} className="w-6 h-6 text-orange-600 dark:text-orange-400" />;
      default:
        return <Sparkles {...props} className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <Card
      hoverEffect
      className="p-6 flex flex-col justify-between transition-all duration-300 hover:border-[#0F4C81]/40 dark:hover:border-blue-500/40"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
            {getIcon(feature.iconName)}
          </div>
          <Badge variant="neutral" size="sm">
            {feature.tag}
          </Badge>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
          {feature.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {feature.description}
        </p>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-[#0F4C81] dark:text-blue-400">
        <span>Statutory DoSJE Protocol</span>
        <span className="text-slate-400">● Live Active</span>
      </div>
    </Card>
  );
};
