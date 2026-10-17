"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Filter,
  Maximize2,
  Minimize2,
  Compass,
  Layers,
  Info,
} from "lucide-react";
import { AuthorityProject } from "@/types/authority";
import { MOCK_AUTHORITY_PROJECTS, AUTHORITY_DISTRICTS } from "@/mock/authorityMockData";
import { MARKER_COLORS } from "@/components/admin/map/mapStyles";
import { EnrichedMapProject, MarkerColorCategory } from "@/components/admin/map/mapTypes";
import { useTheme } from "@/contexts/ThemeContext";

const LeafletMapEngine = dynamic(
  () => import("@/components/admin/map/LeafletMapEngine").then((mod) => mod.LeafletMapEngine),
  { ssr: false }
);

interface AuthorityInteractiveMapProps {
  onSelectProject?: (project: AuthorityProject) => void;
  selectedDistrictFilter?: string;
}

export const AuthorityInteractiveMap: React.FC<AuthorityInteractiveMapProps> = ({
  onSelectProject,
  selectedDistrictFilter = "ALL",
}) => {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme || "light";

  const [activeFilter, setActiveFilter] = useState<"ALL" | "HIGH_RISK" | "INSPECTIONS" | "CCTV" | "COMPLIANCE">("ALL");
  const [districtFilter, setDistrictFilter] = useState<string>(selectedDistrictFilter);
  const [selectedProject, setSelectedProject] = useState<EnrichedMapProject | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 4000);
  }, []);

  // Convert AuthorityProject to EnrichedMapProject for Map Component compatibility
  const enrichedProjects: EnrichedMapProject[] = useMemo(() => {
    return MOCK_AUTHORITY_PROJECTS.map((p) => {
      let colorCategory: MarkerColorCategory = "GREEN";
      if (p.complianceStatus === "NON_COMPLIANT" || p.complianceStatus === "PENDING_UC") {
        colorCategory = "BLACK";
      } else if (!p.cctvOnline) {
        colorCategory = "PURPLE";
      } else if (p.riskLevel === "HIGH") {
        colorCategory = "RED";
      } else if (p.inspectionStatus === "SCHEDULED" || p.inspectionStatus === "FLAGGED") {
        colorCategory = "ORANGE";
      } else if (p.riskLevel === "MEDIUM") {
        colorCategory = "YELLOW";
      } else if (p.inspectionStatus === "COMPLETED") {
        colorCategory = "BLUE";
      }

      return {
        ...p,
        colorCategory,
        markerHex: MARKER_COLORS[colorCategory].hex,
        statusLabel: MARKER_COLORS[colorCategory].label,
      };
    });
  }, []);

  // Filtered projects by active quick filter and district
  const filteredProjects = useMemo(() => {
    return enrichedProjects.filter((p) => {
      if (districtFilter !== "ALL" && p.district !== districtFilter) return false;
      if (activeFilter === "HIGH_RISK" && p.riskLevel !== "HIGH") return false;
      if (activeFilter === "INSPECTIONS" && p.inspectionStatus !== "SCHEDULED" && p.inspectionStatus !== "FLAGGED") return false;
      if (activeFilter === "CCTV" && p.cctvOnline) return false;
      if (activeFilter === "COMPLIANCE" && p.complianceStatus === "COMPLIANT") return false;
      return true;
    });
  }, [enrichedProjects, districtFilter, activeFilter]);

  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const resetView = () => {
    setDistrictFilter("ALL");
    setActiveFilter("ALL");
    setSelectedProject(null);
    showToast("Jurisdiction map reset to Maharashtra statewide view.");
  };

  return (
    <div
      ref={mapContainerRef}
      className={`relative w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md overflow-hidden flex flex-col ${
        isFullscreen ? "h-screen rounded-none z-50 p-4" : "p-4 sm:p-5"
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#0F4C81] text-white px-4 py-2 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Info className="w-4 h-4 text-blue-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1.5 rounded-lg bg-[#0F4C81] text-white">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              State & District Jurisdiction GIS Matrix
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Maharashtra (5 Districts)
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {filteredProjects.length}/15 Monitored Facilities
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time geospatial tracking of welfare projects, field inspection audits, and CCTV telemetry in assigned jurisdiction.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* District Selector */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold"
          >
            <option value="ALL">All 5 Districts</option>
            {AUTHORITY_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <button
            onClick={resetView}
            title="Reset Jurisdiction View"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Compass className="w-4 h-4 text-[#0F4C81]" />
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Quick Filter Bar */}
      <div className="py-2.5 flex items-center gap-1.5 flex-wrap text-xs">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5 text-[#0F4C81]" /> Triage Filters:
        </span>
        {[
          { key: "ALL", label: `All Facilities (${enrichedProjects.length})` },
          { key: "HIGH_RISK", label: "High Risk 🔴 (4)" },
          { key: "INSPECTIONS", label: "Pending Inspections 🟠 (6)" },
          { key: "CCTV", label: "CCTV Offline 🟣 (3)" },
          { key: "COMPLIANCE", label: "Compliance Default ⚫ (3)" },
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => setActiveFilter(btn.key as typeof activeFilter)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              activeFilter === btn.key
                ? "bg-[#0F4C81] text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Interactive Map Canvas */}
      <div className="relative w-full flex-1 min-h-[440px] sm:min-h-[480px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
        <LeafletMapEngine
          theme={theme}
          mapTypeId="roadmap"
          heatmapMode="NONE"
          drawingMode="NONE"
          projects={filteredProjects}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
          onViewDetails={(p) => {
            if (onSelectProject) {
              const original = MOCK_AUTHORITY_PROJECTS.find((proj) => proj.id === p.id);
              if (original) onSelectProject(original);
            }
          }}
        />

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg text-[11px] space-y-1 z-30 max-w-[200px]">
          <div className="font-black text-slate-800 dark:text-slate-200">
            Jurisdiction Telemetry
          </div>
          <div className="space-y-0.5 text-[10.5px]">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Compliant / Low Risk
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Moderate Observation
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" /> High Risk Alert
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> CCTV Disconnected
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 dark:bg-black" /> Compliance Default
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
