"use client";

import React, { memo } from "react";
import { HeatmapLayer as GoogleHeatmap } from "@react-google-maps/api";
import { EnrichedMapProject, HeatmapMode } from "./mapTypes";

interface HeatmapLayerProps {
  heatmapMode: HeatmapMode;
  projects: EnrichedMapProject[];
}

const HeatmapLayerComponent: React.FC<HeatmapLayerProps> = ({
  heatmapMode,
  projects,
}) => {
  if (heatmapMode === "NONE" || typeof google === "undefined" || !google.maps) return null;

  // Generate weighted LatLng points for Google Maps Heatmap
  const points = projects.map((p) => {
    let weight = 1;

    switch (heatmapMode) {
      case "HIGH_RISK":
        weight = p.riskScore;
        break;
      case "BENEFICIARIES":
        weight = Math.min(p.beneficiariesCount / 5, 100);
        break;
      case "COMPLAINTS":
        weight = (p.activeComplaintsCount + 1) * 20;
        break;
      case "INSPECTIONS":
        weight = p.inspectionStatus === "COMPLETED" ? 80 : 35;
        break;
      default:
        weight = 100 - p.attendancePercent; // Attendance Drops
        break;
    }

    return {
      location: new google.maps.LatLng(p.coordinates.lat, p.coordinates.lng),
      weight,
    };
  });

  return (
    <GoogleHeatmap
      data={points}
      options={{
        radius: 38,
        opacity: 0.75,
        dissipating: true,
      }}
    />
  );
};

export const HeatmapLayer = memo(HeatmapLayerComponent);
