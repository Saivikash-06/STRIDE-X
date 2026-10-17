"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useJsApiLoader, GoogleMap, TrafficLayer } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import {
  EnrichedMapProject,
  HeatmapMode,
  DrawingMode,
  LatLngPoint,
} from "./mapTypes";
import {
  GOOGLE_MAPS_DARK_STYLE,
  GOOGLE_MAPS_LIGHT_STYLE,
  getCustomSvgMarkerUri,
} from "./mapStyles";
import { MapInfoWindow } from "./MapInfoWindow";
import { calculateHaversineDistanceKm } from "./mapUtils";

// Required static libraries list outside component to prevent re-renders
const LIBRARIES: ("visualization" | "drawing")[] = ["visualization", "drawing"];

const DEFAULT_CENTER = { lat: 21.7679, lng: 78.8718 }; // Geocenter of India
const DEFAULT_ZOOM = 5;

interface GoogleMapEngineProps {
  apiKey: string;
  theme: "light" | "dark";
  mapTypeId: "roadmap" | "satellite" | "terrain" | "hybrid";
  trafficLayerActive: boolean;
  heatmapMode: HeatmapMode;
  drawingMode: DrawingMode;
  projects: EnrichedMapProject[];
  selectedProject: EnrichedMapProject | null;
  onSelectProject: (p: EnrichedMapProject | null) => void;
  onViewDetails?: (p: EnrichedMapProject) => void;
  onFallbackToLeaflet: (reason: string) => void;
  measureDistanceKm?: number;
  onMeasureUpdate?: (distanceKm: number, points: LatLngPoint[]) => void;
}

export const GoogleMapEngine: React.FC<GoogleMapEngineProps> = ({
  apiKey,
  theme,
  mapTypeId,
  trafficLayerActive,
  heatmapMode,
  drawingMode,
  projects,
  selectedProject,
  onSelectProject,
  onViewDetails,
  onFallbackToLeaflet,
  onMeasureUpdate,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "dosje-google-map-script",
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const heatmapLayerRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);
  const measureLineRef = useRef<google.maps.Polyline | null>(null);
  const measurePointsRef = useRef<LatLngPoint[]>([]);

  // If loading fails, trigger automatic fallback
  useEffect(() => {
    if (loadError) {
      console.warn("Google Maps load failed:", loadError);
      onFallbackToLeaflet(`Google Maps load failed: ${loadError.message}`);
    }
  }, [loadError, onFallbackToLeaflet]);

  // Intercept Google Maps authentication error if key is invalid
  useEffect(() => {
    const handleAuthFailure = () => {
      console.warn("Google Maps authentication failure detected. Falling back to Leaflet.");
      onFallbackToLeaflet("Google Maps API authentication failed (invalid or restricted key).");
    };

    (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = handleAuthFailure;
    return () => {
      (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = undefined;
    };
  }, [onFallbackToLeaflet]);

  // Callback when Map is loaded
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // Update Markers and Clusters
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    const map = mapRef.current;

    // Clear existing markers & clusterer
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // Create markers for filtered projects
    const newMarkers = projects.map((p) => {
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

    markersRef.current = newMarkers;

    // Initialize MarkerClusterer with count badges
    clustererRef.current = new MarkerClusterer({
      map,
      markers: newMarkers,
      renderer: {
        render: ({ count, position }) => {
          const badgeText = count > 99 ? "100+" : count > 49 ? "50+" : count > 24 ? "25+" : `${count}`;
          const color = count > 15 ? "#EF4444" : count > 8 ? "#F59E0B" : "#0F4C81";

          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="22" fill="${color}" fill-opacity="0.88" stroke="#FFFFFF" stroke-width="3"/>
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
    };
  }, [isLoaded, projects, selectedProject, onSelectProject]);

  // Handle Heatmap Layer updates
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    const map = mapRef.current;

    if (heatmapLayerRef.current) {
      heatmapLayerRef.current.setMap(null);
      heatmapLayerRef.current = null;
    }

    if (heatmapMode === "NONE") return;

    if (window.google && window.google.maps && window.google.maps.visualization) {
      const heatmapData = projects.map((p) => {
        let weight = 1;
        if (heatmapMode === "HIGH_RISK") weight = p.riskScore;
        else if (heatmapMode === "BENEFICIARIES") weight = Math.min(p.beneficiariesCount / 10, 100);
        else if (heatmapMode === "COMPLAINTS") weight = (p.activeComplaintsCount + 1) * 20;
        else if (heatmapMode === "INSPECTIONS") weight = p.inspectionStatus === "COMPLETED" ? 80 : 30;

        return {
          location: new google.maps.LatLng(p.coordinates.lat, p.coordinates.lng),
          weight,
        };
      });

      heatmapLayerRef.current = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map,
        radius: 36,
        opacity: 0.75,
      });
    }
  }, [isLoaded, heatmapMode, projects]);

  // Pan to selected project when selected
  useEffect(() => {
    if (selectedProject && mapRef.current) {
      mapRef.current.panTo({
        lat: selectedProject.coordinates.lat,
        lng: selectedProject.coordinates.lng,
      });
      if (mapRef.current.getZoom()! < 8) {
        mapRef.current.setZoom(9);
      }
    }
  }, [selectedProject]);

  // Handle Click for Distance Measurement or Zone Drawing
  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng || !mapRef.current) return;

      if (drawingMode === "MEASURE") {
        const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        const updatedPoints = [...measurePointsRef.current, newPoint];
        measurePointsRef.current = updatedPoints;

        if (!measureLineRef.current) {
          measureLineRef.current = new google.maps.Polyline({
            path: updatedPoints,
            strokeColor: "#EF4444",
            strokeOpacity: 0.9,
            strokeWeight: 4,
            map: mapRef.current,
          });
        } else {
          measureLineRef.current.setPath(updatedPoints);
        }

        // Calculate total distance
        let totalKm = 0;
        for (let i = 1; i < updatedPoints.length; i++) {
          totalKm += calculateHaversineDistanceKm(updatedPoints[i - 1], updatedPoints[i]);
        }

        if (onMeasureUpdate) {
          onMeasureUpdate(Math.round(totalKm * 10) / 10, updatedPoints);
        }
      }
    },
    [drawingMode, onMeasureUpdate]
  );

  // Clear measure line if drawing mode resets
  useEffect(() => {
    if (drawingMode === "NONE") {
      if (measureLineRef.current) {
        measureLineRef.current.setMap(null);
        measureLineRef.current = null;
      }
      measurePointsRef.current = [];
    }
  }, [drawingMode]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 gap-3">
        <div className="w-8 h-8 border-3 border-[#0F4C81] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold">Initializing Google Maps Engine...</span>
      </div>
    );
  }

  const mapStyles =
    mapTypeId === "satellite" || mapTypeId === "hybrid"
      ? undefined
      : theme === "dark"
      ? GOOGLE_MAPS_DARK_STYLE
      : GOOGLE_MAPS_LIGHT_STYLE;

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        onClick={handleMapClick}
        options={{
          styles: mapStyles,
          mapTypeId: mapTypeId,
          disableDefaultUI: true, // We provide custom DoSJE Gov control bar
          gestureHandling: "greedy",
          maxZoom: 18,
          minZoom: 4,
          restriction: {
            latLngBounds: {
              north: 37.5,
              south: 6.5,
              west: 67.0,
              east: 98.5,
            },
            strictBounds: false,
          },
        }}
      >
        {trafficLayerActive && <TrafficLayer />}
      </GoogleMap>

      {/* Floating InfoWindow for selected project */}
      {selectedProject && (
        <div className="absolute top-4 right-4 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
          <MapInfoWindow
            project={selectedProject}
            onClose={() => onSelectProject(null)}
            onViewDetails={onViewDetails}
          />
        </div>
      )}
    </div>
  );
};
