"use client";

import React, { memo } from "react";
import { Filter } from "lucide-react";
import { MapFilterType, EnrichedMapProject } from "./mapTypes";

interface MapFiltersProps {
  activeFilter: MapFilterType;
  onFilterChange: (filter: MapFilterType) => void;
  selectedState: string;
  onStateChange: (state: string) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  selectedScheme: string;
  onSchemeChange: (scheme: string) => void;
  availableStates: string[];
  availableDistricts: string[];
  availableSchemes: [string, string][];
  projects: EnrichedMapProject[];
}

const MapFiltersComponent: React.FC<MapFiltersProps> = ({
  activeFilter,
  onFilterChange,
  selectedState,
  onStateChange,
  selectedDistrict,
  onDistrictChange,
  selectedScheme,
  onSchemeChange,
  availableStates,
  availableDistricts,
  availableSchemes,
  projects,
}) => {
  // Compute counts for top pills
  const counts = {
    ALL: projects.length,
    HIGH_RISK: projects.filter((p) => p.riskLevel === "HIGH").length,
    MEDIUM_RISK: projects.filter((p) => p.riskLevel === "MEDIUM").length,
    LOW_RISK: projects.filter((p) => p.riskLevel === "LOW").length,
    INSPECTION_PENDING: projects.filter(
      (p) => p.inspectionStatus === "SCHEDULED" || p.inspectionStatus === "FLAGGED"
    ).length,
    INSPECTION_COMPLETED: projects.filter((p) => p.inspectionStatus === "COMPLETED").length,
    COMPLIANCE: projects.filter(
      (p) =>
        p.complianceStatus === "NON_COMPLIANT" ||
        p.complianceStatus === "UNDER_AUDIT" ||
        p.complianceStatus === "PENDING_UC"
    ).length,
    ATTENDANCE: projects.filter((p) => p.attendancePercent < 75).length,
    CCTV: projects.filter((p) => !p.cctvOnline).length,
    BENEFICIARY_DENSITY: projects.filter((p) => p.beneficiariesCount >= 100).length,
  };

  const filterButtons: { key: MapFilterType; label: string; count: number }[] = [
    { key: "ALL", label: `All Projects`, count: counts.ALL },
    { key: "HIGH_RISK", label: `High Risk 🔴`, count: counts.HIGH_RISK },
    { key: "MEDIUM_RISK", label: `Medium Risk 🟡`, count: counts.MEDIUM_RISK },
    { key: "LOW_RISK", label: `Low Risk 🟢`, count: counts.LOW_RISK },
    { key: "INSPECTION", label: `Inspection Pending 🟠`, count: counts.INSPECTION_PENDING },
    { key: "COMPLIANCE", label: `Compliance Issues ⚫`, count: counts.COMPLIANCE },
    { key: "ATTENDANCE", label: `Attendance Alerts ⚠️`, count: counts.ATTENDANCE },
    { key: "CCTV", label: `Offline CCTV 🟣`, count: counts.CCTV },
    { key: "BENEFICIARY_DENSITY", label: `Beneficiary Density 👥`, count: counts.BENEFICIARY_DENSITY },
  ];

  return (
    <div className="space-y-2">
      {/* Top Filter Pills */}
      <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto text-xs font-medium pb-1">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1 shrink-0">
          <Filter className="w-3.5 h-3.5 text-[#0F4C81]" /> Top Filters:
        </span>

        {filterButtons.map((f) => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeFilter === f.key
                ? "bg-[#0F4C81] text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <span>{f.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeFilter === f.key
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Cascading Dropdown Row (State, District, Scheme) */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        {/* State */}
        <select
          value={selectedState}
          onChange={(e) => {
            onStateChange(e.target.value);
            onDistrictChange("ALL");
          }}
          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
        >
          <option value="ALL">All States ({availableStates.length})</option>
          {availableStates.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        {/* District */}
        <select
          value={selectedDistrict}
          onChange={(e) => onDistrictChange(e.target.value)}
          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
        >
          <option value="ALL">All Districts ({availableDistricts.length})</option>
          {availableDistricts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Scheme */}
        <select
          value={selectedScheme}
          onChange={(e) => onSchemeChange(e.target.value)}
          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium max-w-[170px] truncate"
        >
          <option value="ALL">All Schemes ({availableSchemes.length})</option>
          {availableSchemes.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export const MapFilters = memo(MapFiltersComponent);
