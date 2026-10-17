"use client";

import React, { useState } from "react";
import { IndiaInteractiveMap } from "./map/IndiaInteractiveMap";
import { Project } from "@/types/admin";
import {
  MapPin,
  Flame,
  ShieldAlert,
  Layers,
  Filter,
} from "lucide-react";

interface NationalMapProps {
  onSelectProject?: (project: Project) => void;
  className?: string;
  height?: string;
}

export const NationalMap: React.FC<NationalMapProps> = ({
  onSelectProject,
  className = "",
}) => {
  const [activeLayer, setActiveLayer] = useState<"all" | "high-risk" | "inspections" | "heatmap">("all");

  return (
    <div className={`space-y-4 ${className}`}>
      {/* GIS Header & Quick Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-[#0B5ED7] dark:text-blue-400">
              <MapPin className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              National GIS Telemetry & Spatial Intelligence
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            OpenFreeMap / OpenStreetMap live spatial engine tracking 2,480 facilities across 36 States & UTs.
          </p>
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveLayer("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeLayer === "all"
                ? "bg-[#0B5ED7] text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Facilities (2,480)</span>
          </button>

          <button
            onClick={() => setActiveLayer("high-risk")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeLayer === "high-risk"
                ? "bg-rose-600 text-white"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>High Risk (90)</span>
          </button>

          <button
            onClick={() => setActiveLayer("inspections")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeLayer === "inspections"
                ? "bg-purple-600 text-white"
                : "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Active Audits (38)</span>
          </button>

          <button
            onClick={() => setActiveLayer("heatmap")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeLayer === "heatmap"
                ? "bg-amber-600 text-white"
                : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Risk Heatmap</span>
          </button>
        </div>
      </div>

      {/* Embed India Interactive Map */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
        <IndiaInteractiveMap onSelectProject={onSelectProject} />
      </div>

      {/* Map Legend Footer */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-slate-800 dark:text-slate-200">Map Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-600 inline-block ring-2 ring-rose-300 dark:ring-rose-900 animate-pulse" />
            <span>High Threat Risk (Index &gt; 70)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span>Medium Risk (Index 40-70)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span>Low Risk / Optimal (&lt; 40)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-500 inline-block ring-1 ring-sky-300" />
            <span>CCTV Live Feed Available</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
          <span>Coordinate Reference: EPSG:4326 (WGS84)</span>
          <span>•</span>
          <span>Sovereign NIC GIS Layer</span>
        </div>
      </div>
    </div>
  );
};
