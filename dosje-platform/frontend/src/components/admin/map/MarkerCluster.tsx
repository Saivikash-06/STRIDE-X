"use client";

import React, { useEffect, useRef, memo } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { EnrichedMapProject } from "./mapTypes";
import { getCustomSvgMarkerUri } from "./mapStyles";

interface MarkerClusterProps {
  map: google.maps.Map | null;
  projects: EnrichedMapProject[];
  selectedProject: EnrichedMapProject | null;
  onSelectProject: (project: EnrichedMapProject) => void;
}

const MarkerClusterComponent: React.FC<MarkerClusterProps> = ({
  map,
  projects,
  selectedProject,
  onSelectProject,
}) => {
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!map || typeof google === "undefined" || !google.maps) return;

    // Clear previous clusterer and markers
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // Create markers for projects
    const markers = projects.map((p) => {
      const isSelected = selectedProject?.id === p.id;
      const isHighRisk = p.riskLevel === "HIGH";

      const marker = new google.maps.Marker({
        position: { lat: p.coordinates.lat, lng: p.coordinates.lng },
        title: `${p.name} (${p.projectCode})`,
        icon: {
          url: getCustomSvgMarkerUri(p.markerHex, isHighRisk),
          scaledSize: new google.maps.Size(isSelected ? 44 : 36, isSelected ? 56 : 46),
          anchor: new google.maps.Point(isSelected ? 22 : 18, isSelected ? 54 : 44),
        },
        zIndex: isSelected ? 999 : isHighRisk ? 500 : 100,
      });

      marker.addListener("click", () => {
        onSelectProject(p);
      });

      return marker;
    });

    markersRef.current = markers;

    // Initialize MarkerClusterer with custom government badge renderer
    clustererRef.current = new MarkerClusterer({
      map,
      markers,
      renderer: {
        render: ({ count, position }) => {
          const badgeText =
            count > 99 ? "100+" : count > 49 ? "50+" : count > 24 ? "25+" : `${count}`;
          const color =
            count > 15 ? "#EF4444" : count > 8 ? "#F59E0B" : "#0F4C81";

          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="22" fill="${color}" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="3"/>
            <text x="25" y="30" font-size="14" font-weight="bold" fill="#FFFFFF" text-anchor="middle" font-family="system-ui, sans-serif">${badgeText}</text>
          </svg>`;

          return new google.maps.Marker({
            position,
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
              scaledSize: new google.maps.Size(50, 50),
              anchor: new google.maps.Point(25, 25),
            },
            zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
          });
        },
      },
    });

    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
      }
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
    };
  }, [map, projects, selectedProject, onSelectProject]);

  return null;
};

export const MarkerCluster = memo(MarkerClusterComponent);
