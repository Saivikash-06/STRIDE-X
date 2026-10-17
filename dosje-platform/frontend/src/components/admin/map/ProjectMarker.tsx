"use client";

import React, { memo } from "react";
import { Marker } from "@react-google-maps/api";
import { EnrichedMapProject } from "./mapTypes";
import { getCustomSvgMarkerUri } from "./mapStyles";

interface ProjectMarkerProps {
  project: EnrichedMapProject;
  isSelected: boolean;
  onClick: (project: EnrichedMapProject) => void;
}

/**
 * Reusable Google Maps Project Marker with custom SVG styling and risk pulse
 */
const ProjectMarkerComponent: React.FC<ProjectMarkerProps> = ({
  project,
  isSelected,
  onClick,
}) => {
  const isHighRisk = project.riskLevel === "HIGH";

  const iconConfig: google.maps.Icon = {
    url: getCustomSvgMarkerUri(project.markerHex, isHighRisk),
    scaledSize:
      typeof google !== "undefined" && google.maps
        ? new google.maps.Size(isSelected ? 44 : 36, isSelected ? 56 : 46)
        : undefined,
    anchor:
      typeof google !== "undefined" && google.maps
        ? new google.maps.Point(isSelected ? 22 : 18, isSelected ? 54 : 44)
        : undefined,
  };

  return (
    <Marker
      position={{ lat: project.coordinates.lat, lng: project.coordinates.lng }}
      title={`${project.name} (${project.projectCode})`}
      icon={iconConfig}
      zIndex={isSelected ? 999 : isHighRisk ? 500 : 100}
      onClick={() => onClick(project)}
      animation={
        isHighRisk && typeof google !== "undefined" && google.maps
          ? google.maps.Animation.BOUNCE
          : undefined
      }
    />
  );
};

export const ProjectMarker = memo(ProjectMarkerComponent);
