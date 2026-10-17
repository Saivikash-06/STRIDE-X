"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  Layers,
  Sparkles,
  ShieldAlert,
  ClipboardCheck,
  UserCheck,
  Video,
  Info,
  Maximize2,
  Minimize2,
  Compass,
  Ruler,
  Car,
  Square,
  Circle,
  Pentagon,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  EnrichedMapProject,
  MapFilterType,
  HeatmapMode,
  MapEngineType,
} from "./mapTypes";
import { MARKER_COLORS } from "./mapStyles";
import { MOCK_MAP_PROJECTS } from "./mockMapData";
import { filterMapProjects } from "./mapUtils";
import { Project } from "@/types/admin";
import { useTheme } from "@/contexts/ThemeContext";
import { MapFilters } from "./MapFilters";
import { SearchControl } from "./SearchControl";

// Dynamically import MapComponent to ensure zero SSR errors and lazy loading
const MapComponent = dynamic(
  () => import("./MapComponent").then((mod) => mod.MapComponent),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 animate-pulse text-slate-500 gap-3">
        <div className="w-10 h-10 border-3 border-[#0F4C81] border-t-transparent rounded-full animate-spin" />
        <div className="text-center space-y-1">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Loading Google Maps Enterprise Telemetry...
          </p>
          <p className="text-[11px] text-slate-400">
            Initializing WebGL canvas, Drawing tools & GIS layers
          </p>
        </div>
      </div>
    ),
  }
);

// Fallback OpenStreetMap / Leaflet Engine
const LeafletMapEngine = dynamic(
  () => import("./LeafletMapEngine").then((mod) => mod.LeafletMapEngine),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 animate-pulse text-slate-500 gap-3">
        <div className="w-10 h-10 border-3 border-[#0F4C81] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold">Initializing OpenStreetMap Engine...</span>
      </div>
    ),
  }
);

interface IndiaInteractiveMapProps {
  onSelectProject?: (project: Project) => void;
  externalFilter?: string;
}

export const IndiaInteractiveMap: React.FC<IndiaInteractiveMapProps> = ({
  onSelectProject,
}) => {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme || "light";

  // Check Google Maps API Key securely from .env.local
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const hasValidApiKey = apiKey.trim() !== "" && apiKey !== "YOUR_API_KEY";

  // Engine state: automatically fallback if API key is not configured
  const [mapEngine, setMapEngine] = useState<MapEngineType>(
    hasValidApiKey ? "GOOGLE_MAPS" : "LEAFLET"
  );

  // Non-intrusive banner notification state (NO browser alerts)
  const [bannerMessage, setBannerMessage] = useState<string | null>(
    !hasValidApiKey
      ? "Google Maps API Key not configured. Using OpenStreetMap fallback."
      : null
  );

  // Toast notification for user actions (replaces any alert())
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4500);
  }, []);

  // Map Controls State
  const [mapTypeId, setMapTypeId] = useState<"roadmap" | "satellite" | "terrain" | "hybrid">("roadmap");
  const [trafficLayerActive, setTrafficLayerActive] = useState(false);
  const [heatmapMode, setHeatmapMode] = useState<HeatmapMode>("NONE");
  const [drawingTool, setDrawingTool] = useState<"NONE" | "POLYGON" | "CIRCLE" | "RECTANGLE" | "MEASURE" | "ZONE">("NONE");
  const [measuredDistanceKm, setMeasuredDistanceKm] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Filters and Search State
  const [activeFilter, setActiveFilter] = useState<MapFilterType>("ALL");
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("ALL");
  const [selectedScheme, setSelectedScheme] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<EnrichedMapProject | null>(null);

  // Live Telemetry Feed Ticker
  const [liveTelemetryPing, setLiveTelemetryPing] = useState<string>(
    "WebSocket: Connected to DoSJE National Geotagging Gateway (Latency: 22ms)"
  );

  // Verified 25 Projects (5 High, 5 Medium, 15 Low Risk) across India
  const allProjects = useMemo(() => MOCK_MAP_PROJECTS, []);

  // Compute available filter dropdown options
  const availableStates = useMemo(() => {
    const set = new Set<string>();
    allProjects.forEach((p) => set.add(p.state));
    return Array.from(set).sort();
  }, [allProjects]);

  const availableDistricts = useMemo(() => {
    const set = new Set<string>();
    allProjects
      .filter((p) => selectedState === "ALL" || p.state === selectedState)
      .forEach((p) => set.add(p.district));
    return Array.from(set).sort();
  }, [allProjects, selectedState]);

  const availableSchemes = useMemo(() => {
    const map = new Map<string, string>();
    allProjects.forEach((p) => map.set(p.schemeId, p.schemeName));
    return Array.from(map.entries());
  }, [allProjects]);

  // Apply Search & Filters
  const filteredProjects = useMemo(() => {
    return filterMapProjects(
      allProjects,
      activeFilter,
      selectedState,
      selectedDistrict,
      selectedScheme,
      searchQuery
    );
  }, [allProjects, activeFilter, selectedState, selectedDistrict, selectedScheme, searchQuery]);

  // Simulated WebSocket telemetry pulse
  useEffect(() => {
    const timer = setInterval(() => {
      const pings = [
        "WebSocket: Geotagged inspection completed at Lucknow Divyangjan Facility (24ms)",
        "Telemetry: Biometric attendance stream synchronized across 25 nodal hubs (18ms)",
        "AI Vigilance: Facial recognition attendance variance detected at Patna Training Centre",
        "PMU Auditor: Live inspection initiated at Bhopal SC Skill Centre (GPS Lock: ±3m)",
        "CCTV Telemetry: 14/15 live camera video feeds broadcasting to Central Command Server",
      ];
      setLiveTelemetryPing(pings[Math.floor(Math.random() * pings.length)]);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Reset View / Locate India
  const handleLocateIndia = () => {
    setSelectedProject(null);
    setSearchQuery("");
    setActiveFilter("ALL");
    setSelectedState("ALL");
    setSelectedDistrict("ALL");
    setSelectedScheme("ALL");
    setDrawingTool("NONE");
    setMeasuredDistanceKm(null);
    showToast("Map view reset to All-India extent.");
  };

  // Fallback callback if Google Maps fails to load
  const handleMapFallback = useCallback((_reason: string) => {
    setBannerMessage("Unable to load Google Maps. OpenStreetMap is being used.");
    setMapEngine("LEAFLET");
  }, []);

  return (
    <div
      ref={mapContainerRef}
      className={`relative w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md transition-all overflow-hidden flex flex-col ${
        isFullscreen ? "h-screen rounded-none z-50 p-4" : "p-4 sm:p-5"
      }`}
    >
      {/* Toast Notification (replaces alert popups) */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#0F4C81] text-white px-4 py-2 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <Info className="w-4 h-4 text-blue-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================== */}
      {/* 1. TOP HEADER & TELEMETRY STATUS */}
      {/* ========================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1.5 rounded-lg bg-[#0F4C81] text-white">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              National Monitoring & Inspection Matrix
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              DoSJE GIS Command Control
            </span>

            {/* Active Engine Badge */}
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                mapEngine === "GOOGLE_MAPS"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              {mapEngine === "GOOGLE_MAPS" ? "Google Maps JS API (Active)" : "OpenStreetMap Fallback"}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Geospatial tracking of 2,480 facilities, live PMU field audits, AI risk alerts, and CCTV streams across 36 States/UTs.
          </p>
        </div>

        {/* Live Dashboard Sync Buttons (KPI Sync triggers) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Live Sync:
          </span>
          <button
            onClick={() => {
              setActiveFilter("HIGH_RISK");
              const highRisk = allProjects.find((p) => p.riskLevel === "HIGH");
              if (highRisk) setSelectedProject(highRisk);
              showToast("Filtered: 5 High Risk Projects flagged by AI Vigilance.");
            }}
            className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors flex items-center gap-1"
          >
            <ShieldAlert className="w-3 h-3 text-rose-600" /> High Risk (5)
          </button>
          <button
            onClick={() => {
              setActiveFilter("INSPECTION");
              const flagged = allProjects.find((p) => p.inspectionStatus === "FLAGGED" || p.inspectionStatus === "SCHEDULED");
              if (flagged) setSelectedProject(flagged);
              showToast("Filtered: 5 Pending PMU Inspections.");
            }}
            className="px-2.5 py-1 rounded-md text-xs font-bold bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200 dark:border-orange-900 hover:bg-orange-100 transition-colors flex items-center gap-1"
          >
            <ClipboardCheck className="w-3 h-3 text-orange-600" /> Inspections (10)
          </button>
          <button
            onClick={() => {
              setActiveFilter("ATTENDANCE");
              const lowAtt = allProjects.find((p) => p.attendancePercent < 75);
              if (lowAtt) setSelectedProject(lowAtt);
              showToast("Filtered: Facilities with Biometric Attendance Drops.");
            }}
            className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900 hover:bg-amber-100 transition-colors flex items-center gap-1"
          >
            <UserCheck className="w-3 h-3 text-amber-600" /> Attendance Drops
          </button>
          <button
            onClick={() => {
              setActiveFilter("CCTV");
              const offline = allProjects.find((p) => !p.cctvOnline);
              if (offline) setSelectedProject(offline);
              showToast("Filtered: CCTV Offline alert facilities.");
            }}
            className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-900 hover:bg-purple-100 transition-colors flex items-center gap-1"
          >
            <Video className="w-3 h-3 text-purple-600" /> CCTV Feeds (15)
          </button>
        </div>
      </div>

      {/* Non-intrusive Inline Warning Banner if fallback is active */}
      {bannerMessage && (
        <div className="my-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Fallback Notice:</strong> {bannerMessage}
            </span>
          </div>
          {hasValidApiKey && mapEngine !== "GOOGLE_MAPS" && (
            <button
              onClick={() => {
                setMapEngine("GOOGLE_MAPS");
                setBannerMessage(null);
                showToast("Switching to Google Maps JS API Engine...");
              }}
              className="text-[11px] font-bold underline hover:text-amber-800 shrink-0"
            >
              Switch to Google Maps
            </button>
          )}
        </div>
      )}

      {/* ========================================================== */}
      {/* 2. REUSABLE MAP FILTERS COMPONENT */}
      {/* ========================================================== */}
      <div className="pt-2">
        <MapFilters
          activeFilter={activeFilter}
          onFilterChange={(f) => setActiveFilter(f)}
          selectedState={selectedState}
          onStateChange={(st) => setSelectedState(st)}
          selectedDistrict={selectedDistrict}
          onDistrictChange={(d) => setSelectedDistrict(d)}
          selectedScheme={selectedScheme}
          onSchemeChange={(sch) => setSelectedScheme(sch)}
          availableStates={availableStates}
          availableDistricts={availableDistricts}
          availableSchemes={availableSchemes}
          projects={allProjects}
        />
      </div>

      {/* ========================================================== */}
      {/* 3. SEARCH & GIS TOOLBAR ROW */}
      {/* ========================================================== */}
      <div className="py-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {/* Search Control Component */}
        <SearchControl
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          matchesCount={filteredProjects.length}
          totalCount={allProjects.length}
        />

        {/* GIS Controls (Drawing Tools, Map Styles, Heatmap, Reset, Fullscreen) */}
        <div className="flex items-center gap-1.5 flex-wrap self-end md:self-auto shrink-0">
          {/* Heatmap Layer Selector */}
          <select
            value={heatmapMode}
            onChange={(e) => setHeatmapMode(e.target.value as HeatmapMode)}
            className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
            aria-label="Heatmap Mode"
          >
            <option value="NONE">🔥 Heatmap: Off</option>
            <option value="HIGH_RISK">🔥 Heatmap: High Risk Projects</option>
            <option value="COMPLAINTS">🔥 Heatmap: High Complaint Areas</option>
            <option value="BENEFICIARIES">🔥 Heatmap: Beneficiary Density</option>
            <option value="INSPECTIONS">🔥 Heatmap: Inspection Density</option>
            <option value="ATTENDANCE">🔥 Heatmap: Attendance Drops</option>
          </select>

          {/* Google Drawing Tools Selector */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-0.5">
            <button
              onClick={() => {
                const next = drawingTool === "MEASURE" ? "NONE" : "MEASURE";
                setDrawingTool(next);
                if (next === "NONE") setMeasuredDistanceKm(null);
                showToast(next === "MEASURE" ? "Distance Measuring Tool active. Click points on map." : "Measuring tool cleared.");
              }}
              title="Measure Distance between Projects"
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                drawingTool === "MEASURE"
                  ? "bg-rose-600 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ruler</span>
            </button>

            <button
              onClick={() => {
                const next = drawingTool === "ZONE" ? "NONE" : "ZONE";
                setDrawingTool(next);
                showToast(next === "ZONE" ? "Inspection Zone Polygon tool active. Click map to draw boundary." : "Zone tool closed.");
              }}
              title="Draw Inspection Zone / Polygon"
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                drawingTool === "ZONE" || drawingTool === "POLYGON"
                  ? "bg-[#0F4C81] text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <Pentagon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Zone</span>
            </button>

            <button
              onClick={() => {
                const next = drawingTool === "CIRCLE" ? "NONE" : "CIRCLE";
                setDrawingTool(next);
                showToast(next === "CIRCLE" ? "Draw Geofence Circle active." : "Circle tool closed.");
              }}
              title="Draw Monitoring Circle"
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                drawingTool === "CIRCLE"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <Circle className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                const next = drawingTool === "RECTANGLE" ? "NONE" : "RECTANGLE";
                setDrawingTool(next);
                showToast(next === "RECTANGLE" ? "Draw Monitoring Rectangle active." : "Rectangle tool closed.");
              }}
              title="Draw Monitoring Rectangle"
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                drawingTool === "RECTANGLE"
                  ? "bg-amber-600 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <Square className="w-3.5 h-3.5" />
            </button>

            {drawingTool !== "NONE" && (
              <button
                onClick={() => {
                  setDrawingTool("NONE");
                  setMeasuredDistanceKm(null);
                  showToast("Drawing tools cleared.");
                }}
                title="Clear Drawings"
                className="p-1.5 rounded-md text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Map Type Switcher (Roadmap, Satellite, Terrain, Hybrid) */}
          <select
            value={mapTypeId}
            onChange={(e) => setMapTypeId(e.target.value as "roadmap" | "satellite" | "terrain" | "hybrid")}
            className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold capitalize"
            aria-label="Map Type"
          >
            <option value="roadmap">Roadmap</option>
            <option value="satellite">Satellite</option>
            <option value="terrain">Terrain</option>
            <option value="hybrid">Hybrid</option>
          </select>

          {/* Traffic Layer Toggle */}
          {mapEngine === "GOOGLE_MAPS" && (
            <button
              onClick={() => {
                setTrafficLayerActive((prev) => !prev);
                showToast(!trafficLayerActive ? "Traffic Layer enabled." : "Traffic Layer disabled.");
              }}
              title="Toggle Live Traffic Layer"
              className={`p-1.5 rounded-lg border text-xs font-medium ${
                trafficLayerActive
                  ? "bg-blue-600 text-white border-blue-700"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              }`}
            >
              <Car className="w-4 h-4" />
            </button>
          )}

          {/* Reset View / Locate India */}
          <button
            onClick={handleLocateIndia}
            title="Reset View to All-India Extent"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <Compass className="w-4 h-4 text-[#0F4C81]" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Measurement Banner if measuring */}
      {drawingTool === "MEASURE" && (
        <div className="mb-2 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-rose-600" />
            <span>
              <strong>Distance Measuring Active:</strong> Click multiple facilities on the map to calculate linear PMU inspection route distance.
            </span>
            {measuredDistanceKm !== null && (
              <span className="ml-2 px-2 py-0.5 rounded font-mono font-black bg-rose-600 text-white">
                Total: {measuredDistanceKm} km
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setDrawingTool("NONE");
              setMeasuredDistanceKm(null);
            }}
            className="text-xs font-bold underline hover:text-rose-900"
          >
            Done
          </button>
        </div>
      )}

      {/* ========================================================== */}
      {/* 4. REAL INTERACTIVE MAP CANVAS CONTAINER */}
      {/* ========================================================== */}
      <div className="relative w-full flex-1 min-h-[460px] sm:min-h-[530px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
        {mapEngine === "GOOGLE_MAPS" && hasValidApiKey ? (
          <MapComponent
            apiKey={apiKey}
            theme={theme}
            mapTypeId={mapTypeId}
            trafficLayerActive={trafficLayerActive}
            heatmapMode={heatmapMode}
            drawingTool={drawingTool}
            projects={filteredProjects}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
            onViewDetails={(p) => {
              if (onSelectProject) onSelectProject(p);
            }}
            onFallback={handleMapFallback}
            onMeasureUpdate={(dist) => setMeasuredDistanceKm(dist)}
          />
        ) : (
          <LeafletMapEngine
            theme={theme}
            mapTypeId={mapTypeId}
            heatmapMode={heatmapMode}
            drawingMode={drawingTool === "MEASURE" ? "MEASURE" : "NONE"}
            projects={filteredProjects}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
            onViewDetails={(p) => {
              if (onSelectProject) onSelectProject(p);
            }}
            onMeasureUpdate={(dist) => setMeasuredDistanceKm(dist)}
          />
        )}

        {/* Floating Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg text-[11px] space-y-1.5 z-30 max-w-[215px]">
          <div className="font-black text-slate-800 dark:text-slate-200 flex items-center justify-between">
            <span>National Telemetry</span>
            <span className="text-[10px] text-slate-400 font-mono font-normal">
              {filteredProjects.length}/{allProjects.length} Facilities
            </span>
          </div>
          <div className="space-y-1 text-[10.5px]">
            {Object.entries(MARKER_COLORS).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: val.hex }}
                />
                <span className="truncate">{val.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Engine Switcher Pill (Interactive Switch without alert popups) */}
        <div className="absolute top-3 left-3 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs p-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1 text-[11px]">
          <span className="px-1.5 font-bold text-slate-500 dark:text-slate-400">Engine:</span>
          <button
            onClick={() => {
              if (!hasValidApiKey) {
                showToast("Notice: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not configured in .env.local. Operating in OpenStreetMap mode.");
                return;
              }
              setMapEngine("GOOGLE_MAPS");
              setBannerMessage(null);
              showToast("Switched to Google Maps JavaScript API Engine.");
            }}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              mapEngine === "GOOGLE_MAPS"
                ? "bg-[#0F4C81] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Google Maps
          </button>
          <button
            onClick={() => {
              setMapEngine("LEAFLET");
              showToast("Switched to OpenStreetMap + Leaflet Fallback Engine.");
            }}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              mapEngine === "LEAFLET"
                ? "bg-[#0F4C81] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            OpenStreetMap
          </button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 5. BOTTOM REAL-TIME WEBSOCKET TELEMETRY PULSE */}
      {/* ========================================================== */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-[11px] truncate">{liveTelemetryPing}</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono shrink-0">
          <span>Surveillance: 100% Geofenced</span>
          <span className="hidden md:inline">•</span>
          <span>FastAPI Endpoint: /api/v1/geo/telemetry</span>
        </div>
      </div>
    </div>
  );
};
