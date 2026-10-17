"use client";

import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import { GoogleMap, useJsApiLoader, TrafficLayer, DrawingManager } from "@react-google-maps/api";
import {
  EnrichedMapProject,
  HeatmapMode,
  LatLngPoint,
} from "./mapTypes";
import {
  GOOGLE_MAPS_DARK_STYLE,
  GOOGLE_MAPS_LIGHT_STYLE,
} from "./mapStyles";
import { MarkerCluster } from "./MarkerCluster";
import { HeatmapLayer } from "./HeatmapLayer";
import { InfoWindowCard } from "./InfoWindowCard";
import { calculateHaversineDistanceKm } from "./mapUtils";

const LIBRARIES: ("visualization" | "drawing")[] = ["visualization", "drawing"];
const INDIA_CENTER = { lat: 21.7679, lng: 78.8718 };
const DEFAULT_ZOOM = 5;

interface MapComponentProps {
  apiKey: string;
  theme: "light" | "dark";
  mapTypeId: "roadmap" | "satellite" | "terrain" | "hybrid";
  trafficLayerActive: boolean;
  heatmapMode: HeatmapMode;
  drawingTool: "NONE" | "POLYGON" | "CIRCLE" | "RECTANGLE" | "MEASURE" | "ZONE";
  projects: EnrichedMapProject[];
  selectedProject: EnrichedMapProject | null;
  onSelectProject: (project: EnrichedMapProject | null) => void;
  onViewDetails?: (project: EnrichedMapProject) => void;
  onFallback: (reason: string) => void;
  onMeasureUpdate?: (distanceKm: number, points: LatLngPoint[]) => void;
}

const MapComponentInner: React.FC<MapComponentProps> = ({
  apiKey,
  theme,
  mapTypeId,
  trafficLayerActive,
  heatmapMode,
  drawingTool,
  projects,
  selectedProject,
  onSelectProject,
  onViewDetails,
  onFallback,
  onMeasureUpdate,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "dosje-gov-maps-loader",
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const measurePointsRef = useRef<LatLngPoint[]>([]);
  const measureLineRef = useRef<google.maps.Polyline | null>(null);
  // If loading fails, trigger automatic silent fallback
  useEffect(() => {
    if (loadError) {
      console.warn("Google Maps load failed:", loadError);
      onFallback("Unable to load Google Maps. OpenStreetMap is being used.");
    }
  }, [loadError, onFallback]);

  // Intercept Google Maps authentication error if key is invalid
  useEffect(() => {
    const handleAuthFailure = () => {
      console.warn("Google Maps authentication failure. Falling back to OpenStreetMap.");
      onFallback("Google Maps API authentication failed. OpenStreetMap is being used.");
    };

    (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = handleAuthFailure;
    return () => {
      (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = undefined;
    };
  }, [onFallback]);

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Center on selected project
  useEffect(() => {
    if (selectedProject && map) {
      map.panTo({
        lat: selectedProject.coordinates.lat,
        lng: selectedProject.coordinates.lng,
      });
      if (map.getZoom()! < 8) {
        map.setZoom(9);
      }
    }
  }, [selectedProject, map]);

  // Distance Measurement clicks
  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng || !map || drawingTool !== "MEASURE") return;

      const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      const updatedPoints = [...measurePointsRef.current, newPoint];
      measurePointsRef.current = updatedPoints;

      if (!measureLineRef.current) {
        measureLineRef.current = new google.maps.Polyline({
          path: updatedPoints,
          strokeColor: "#EF4444",
          strokeOpacity: 0.9,
          strokeWeight: 4,
          map,
        });
      } else {
        measureLineRef.current.setPath(updatedPoints);
      }

      let totalKm = 0;
      for (let i = 1; i < updatedPoints.length; i++) {
        totalKm += calculateHaversineDistanceKm(updatedPoints[i - 1], updatedPoints[i]);
      }

      if (onMeasureUpdate) {
        onMeasureUpdate(Math.round(totalKm * 10) / 10, updatedPoints);
      }
    },
    [drawingTool, map, onMeasureUpdate]
  );

  // Clear measure lines if drawing tool changes
  useEffect(() => {
    if (drawingTool !== "MEASURE") {
      if (measureLineRef.current) {
        measureLineRef.current.setMap(null);
        measureLineRef.current = null;
      }
      measurePointsRef.current = [];
    }
  }, [drawingTool]);

  // Map Skeleton Loader
  if (!isLoaded) {
    return (
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
    );
  }

  const mapStyles =
    mapTypeId === "satellite" || mapTypeId === "hybrid"
      ? undefined
      : theme === "dark"
      ? GOOGLE_MAPS_DARK_STYLE
      : GOOGLE_MAPS_LIGHT_STYLE;

  // Determine drawing manager overlay type
  let googleDrawingMode: google.maps.drawing.OverlayType | null = null;
  if (drawingTool === "POLYGON" || drawingTool === "ZONE") {
    googleDrawingMode = typeof google !== "undefined" && google.maps.drawing ? google.maps.drawing.OverlayType.POLYGON : null;
  } else if (drawingTool === "CIRCLE") {
    googleDrawingMode = typeof google !== "undefined" && google.maps.drawing ? google.maps.drawing.OverlayType.CIRCLE : null;
  } else if (drawingTool === "RECTANGLE") {
    googleDrawingMode = typeof google !== "undefined" && google.maps.drawing ? google.maps.drawing.OverlayType.RECTANGLE : null;
  }

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={INDIA_CENTER}
        zoom={DEFAULT_ZOOM}
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        onClick={handleMapClick}
        options={{
          styles: mapStyles,
          mapTypeId,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false, // We provide modern gov control buttons
          scaleControl: true,
          streetViewControl: true,
          rotateControl: true,
          fullscreenControl: false,
          gestureHandling: "greedy",
          maxZoom: 19,
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

        {/* Heatmap Layer */}
        <HeatmapLayer heatmapMode={heatmapMode} projects={projects} />

        {/* Marker Clustering Engine */}
        <MarkerCluster
          map={map}
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={onSelectProject}
        />

        {/* Drawing Manager for Polygons, Circles, Rectangles, Zones */}
        {googleDrawingMode && (
          <DrawingManager
            drawingMode={googleDrawingMode}
            options={{
              drawingControl: false,
              polygonOptions: {
                fillColor: "#0F4C81",
                fillOpacity: 0.25,
                strokeWeight: 2,
                strokeColor: "#0F4C81",
                clickable: true,
                editable: true,
                zIndex: 1,
              },
              circleOptions: {
                fillColor: "#EF4444",
                fillOpacity: 0.2,
                strokeWeight: 2,
                strokeColor: "#EF4444",
                clickable: true,
                editable: true,
                zIndex: 1,
              },
              rectangleOptions: {
                fillColor: "#10B981",
                fillOpacity: 0.2,
                strokeWeight: 2,
                strokeColor: "#10B981",
                clickable: true,
                editable: true,
                zIndex: 1,
              },
            }}
          />
        )}
      </GoogleMap>

      {/* Floating InfoWindowCard for selected project */}
      {selectedProject && (
        <div className="absolute top-4 right-4 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
          <InfoWindowCard
            project={selectedProject}
            onClose={() => onSelectProject(null)}
            onViewDetails={onViewDetails}
          />
        </div>
      )}
    </div>
  );
};

export const MapComponent = memo(MapComponentInner);
