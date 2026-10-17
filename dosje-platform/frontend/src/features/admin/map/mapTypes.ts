import { Project } from "@/types/admin";

export type MarkerColorCategory =
  | "GREEN"     // Low Risk
  | "YELLOW"    // Moderate Risk
  | "ORANGE"    // Inspection Pending
  | "RED"       // High Risk
  | "BLUE"      // Inspection Completed
  | "PURPLE"    // CCTV Offline
  | "BLACK";    // Compliance Issue

export interface EnrichedMapProject extends Project {
  inspectorName?: string;
  inspectorBadge?: string;
  lastInspectionDate?: string;
  attendancePercent: number;
  activeComplaintsCount: number;
  complianceObservation?: string;
  colorCategory: MarkerColorCategory;
  markerHex: string;
  statusLabel: string;
}

export type MapFilterType =
  | "ALL"
  | "HIGH_RISK"
  | "MEDIUM_RISK"
  | "LOW_RISK"
  | "NGOS"
  | "CCTV"
  | "INSPECTION"
  | "COMPLIANCE"
  | "ATTENDANCE"
  | "BENEFICIARY_DENSITY";

export type HeatmapMode = "NONE" | "COMPLAINTS" | "HIGH_RISK" | "BENEFICIARIES" | "INSPECTIONS";

export type MapEngineType = "GOOGLE_MAPS" | "LEAFLET";

export type DrawingMode = "NONE" | "MEASURE" | "ZONE";

export interface LatLngPoint {
  lat: number;
  lng: number;
}

export interface InspectionZone {
  id: string;
  name: string;
  points: LatLngPoint[];
  color: string;
  areaSqKm?: number;
}

export interface MeasureLine {
  points: LatLngPoint[];
  distanceKm: number;
}
