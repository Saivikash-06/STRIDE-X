import {
  MOCK_PROJECTS,
  MOCK_INSPECTIONS,
  MOCK_COMPLIANCE_CASES,
  MOCK_GRIEVANCES,
} from "@/mock/adminMockData";
import {
  EnrichedMapProject,
  MarkerColorCategory,
  MapFilterType,
  LatLngPoint,
} from "./mapTypes";
import { MARKER_COLORS } from "./mapStyles";

/**
 * Resolves the primary marker color category for a project based on DoSJE priority rules:
 * 1. Black: Statutory Compliance Default / Notice Issued
 * 2. Purple: CCTV Offline / Telemetry Disconnected
 * 3. Red: High Risk Project (AI Flagged >= 80)
 * 4. Orange: Inspection Pending / Scheduled / Flagged
 * 5. Yellow: Moderate Risk Project (AI Score 40-79)
 * 6. Blue: Inspection Completed & Geotagged
 * 7. Green: Low Risk Project (AI Score < 40)
 */
export function resolveMarkerCategory(
  riskLevel: string,
  riskScore: number,
  inspectionStatus: string,
  complianceStatus: string,
  cctvOnline: boolean,
  hasComplianceCase: boolean
): MarkerColorCategory {
  if (complianceStatus === "NON_COMPLIANT" || hasComplianceCase) {
    return "BLACK";
  }
  if (!cctvOnline) {
    return "PURPLE";
  }
  if (riskLevel === "HIGH" || riskScore >= 75) {
    return "RED";
  }
  if (inspectionStatus === "SCHEDULED" || inspectionStatus === "FLAGGED") {
    return "ORANGE";
  }
  if (riskLevel === "MEDIUM" || (riskScore >= 40 && riskScore < 75)) {
    return "YELLOW";
  }
  if (inspectionStatus === "COMPLETED") {
    return "BLUE";
  }
  return "GREEN";
}

/**
 * Generates an enriched dataset combining Project telemetry with audits and feeds
 */
export function getEnrichedMapProjects(): EnrichedMapProject[] {
  return MOCK_PROJECTS.map((project, idx) => {
    // Find matching inspection
    const matchingInspection = MOCK_INSPECTIONS.find((i) => i.projectId === project.id) ||
      MOCK_INSPECTIONS[idx % MOCK_INSPECTIONS.length];

    // Find matching compliance case
    const matchingCompliance = MOCK_COMPLIANCE_CASES.find((c) => c.projectId === project.id);

    // Active grievances
    const activeComplaints = MOCK_GRIEVANCES.filter(
      (g) => g.projectName === project.name && g.status !== "RESOLVED"
    ).length;

    // Attendance Rate (Derived realistically based on risk & biometric status)
    const baseAttendance = project.biometricActive ? 84 : 62;
    const attendancePercent = Math.max(
      38,
      Math.min(98, baseAttendance + ((idx * 7) % 21) - (project.riskLevel === "HIGH" ? 28 : 0))
    );

    const hasComplianceCase = !!matchingCompliance && matchingCompliance.status !== "RECTIFIED";

    const colorCategory = resolveMarkerCategory(
      project.riskLevel,
      project.riskScore,
      project.inspectionStatus,
      project.complianceStatus,
      project.cctvOnline,
      hasComplianceCase
    );

    const colorConfig = MARKER_COLORS[colorCategory];

    return {
      ...project,
      inspectorName: matchingInspection ? matchingInspection.inspectorName : "PMU Field Auditor",
      inspectorBadge: matchingInspection ? matchingInspection.inspectorBadge : "PMU-INSP-01",
      lastInspectionDate: matchingInspection?.completedDate || matchingInspection?.scheduledDate || "2026-08-15",
      attendancePercent,
      activeComplaintsCount: activeComplaints,
      complianceObservation: matchingCompliance?.observation,
      colorCategory,
      markerHex: colorConfig.hex,
      statusLabel: colorConfig.label,
    };
  });
}

/**
 * Filter projects based on active top filter, state, district, scheme, and search query
 */
export function filterMapProjects(
  projects: EnrichedMapProject[],
  activeFilter: MapFilterType,
  selectedState: string,
  selectedDistrict: string,
  selectedScheme: string,
  searchQuery: string
): EnrichedMapProject[] {
  return projects.filter((p) => {
    // Top Filter Buttons
    if (activeFilter === "HIGH_RISK" && p.riskLevel !== "HIGH") return false;
    if (activeFilter === "MEDIUM_RISK" && p.riskLevel !== "MEDIUM") return false;
    if (activeFilter === "LOW_RISK" && p.riskLevel !== "LOW") return false;
    if (activeFilter === "NGOS" && !["NGO-01", "NGO-02", "NGO-03", "NGO-04"].includes(p.ngoId)) return false;
    if (activeFilter === "CCTV" && p.cctvOnline) return false; // Show CCTV anomalies/offline
    if (activeFilter === "INSPECTION" && p.inspectionStatus !== "SCHEDULED" && p.inspectionStatus !== "FLAGGED") return false;
    if (activeFilter === "COMPLIANCE" && p.complianceStatus === "COMPLIANT" && !p.complianceObservation) return false;
    if (activeFilter === "ATTENDANCE" && p.attendancePercent >= 75) return false; // Flag low attendance
    if (activeFilter === "BENEFICIARY_DENSITY" && p.beneficiariesCount < 100) return false;

    // Dropdown Filters
    if (selectedState && selectedState !== "ALL" && p.state !== selectedState) return false;
    if (selectedDistrict && selectedDistrict !== "ALL" && p.district !== selectedDistrict) return false;
    if (selectedScheme && selectedScheme !== "ALL" && p.schemeId !== selectedScheme) return false;

    // Search Query (Multi-field)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.projectCode.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.ngoName.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.schemeName.toLowerCase().includes(q) ||
        (p.inspectorName && p.inspectorName.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });
}

/**
 * Calculates Haversine distance in kilometers between two GPS coordinates
 */
export function calculateHaversineDistanceKm(p1: LatLngPoint, p2: LatLngPoint): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
