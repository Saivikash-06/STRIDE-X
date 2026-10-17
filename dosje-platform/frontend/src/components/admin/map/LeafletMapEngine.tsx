"use client";

import React, { useEffect, useRef, useState } from "react";
import type * as LType from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  EnrichedMapProject,
  HeatmapMode,
  DrawingMode,
  LatLngPoint,
} from "./mapTypes";
import { InfoWindowCard } from "./InfoWindowCard";
import { calculateHaversineDistanceKm } from "./mapUtils";

interface LeafletMapEngineProps {
  theme: "light" | "dark";
  mapTypeId: "roadmap" | "satellite" | "terrain" | "hybrid";
  heatmapMode: HeatmapMode;
  drawingMode: DrawingMode;
  projects: EnrichedMapProject[];
  selectedProject: EnrichedMapProject | null;
  onSelectProject: (p: EnrichedMapProject | null) => void;
  onViewDetails?: (p: EnrichedMapProject) => void;
  onMeasureUpdate?: (distanceKm: number, points: LatLngPoint[]) => void;
}

export const LeafletMapEngine: React.FC<LeafletMapEngineProps> = ({
  theme,
  mapTypeId,
  heatmapMode,
  drawingMode,
  projects,
  selectedProject,
  onSelectProject,
  onViewDetails,
  onMeasureUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leafletModuleRef = useRef<typeof LType | null>(null);
  const mapInstanceRef = useRef<LType.Map | null>(null);
  const tileLayerRef = useRef<LType.TileLayer | null>(null);
  const markersLayerRef = useRef<LType.LayerGroup | null>(null);
  const heatmapLayerRef = useRef<LType.LayerGroup | null>(null);
  const measureLayerRef = useRef<LType.LayerGroup | null>(null);
  const measurePointsRef = useRef<LatLngPoint[]>([]);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  const drawingModeRef = useRef(drawingMode);
  const onMeasureUpdateRef = useRef(onMeasureUpdate);

  useEffect(() => {
    drawingModeRef.current = drawingMode;
    onMeasureUpdateRef.current = onMeasureUpdate;
  }, [drawingMode, onMeasureUpdate]);

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!containerRef.current || mapInstanceRef.current) return;
      const L = (await import("leaflet")).default;

      if (!isMounted) return;
      leafletModuleRef.current = L;

      // Fix default Leaflet icon paths
      delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current, {
        center: [21.7679, 78.8718], // Geocenter of India
        zoom: 5,
        minZoom: 4,
        maxZoom: 18,
        zoomControl: false, // We use custom controls
        attributionControl: false,
      });

      // Layer groups for markers, heatmap, and measurements
      markersLayerRef.current = L.layerGroup().addTo(map);
      heatmapLayerRef.current = L.layerGroup().addTo(map);
      measureLayerRef.current = L.layerGroup().addTo(map);

      // Handle Map Click for Measurement
      map.on("click", (e: LType.LeafletMouseEvent) => {
        if (drawingModeRef.current === "MEASURE" && measureLayerRef.current) {
          const pt = { lat: e.latlng.lat, lng: e.latlng.lng };
          const pts = [...measurePointsRef.current, pt];
          measurePointsRef.current = pts;

          measureLayerRef.current.clearLayers();

          // Draw Points and Polyline
          pts.forEach((p) => {
            L.circleMarker([p.lat, p.lng], {
              radius: 6,
              color: "#EF4444",
              fillColor: "#FFFFFF",
              fillOpacity: 1,
              weight: 3,
            }).addTo(measureLayerRef.current!);
          });

          if (pts.length > 1) {
            const latlngs: [number, number][] = pts.map((p) => [p.lat, p.lng]);
            L.polyline(latlngs, {
              color: "#EF4444",
              weight: 4,
              dashArray: "6, 6",
            }).addTo(measureLayerRef.current);

            // Compute total distance
            let dist = 0;
            for (let i = 1; i < pts.length; i++) {
              dist += calculateHaversineDistanceKm(pts[i - 1], pts[i]);
            }
            const roundedDist = Math.round(dist * 10) / 10;
            if (onMeasureUpdateRef.current) {
              onMeasureUpdateRef.current(roundedDist, pts);
            }
          }
        }
      });

      mapInstanceRef.current = map;
      setIsLeafletReady(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer based on theme and mapTypeId
  useEffect(() => {
    const L = leafletModuleRef.current;
    if (!isLeafletReady || !mapInstanceRef.current || !L) return;
    const map = mapInstanceRef.current;

    // Remove existing tile layer if present
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    let tileUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
    let attribution = '&copy; <a href="https://carto.com/">CARTO</a>';

    if (mapTypeId === "satellite" || mapTypeId === "hybrid") {
      tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      attribution = "&copy; Esri World Imagery";
    } else if (mapTypeId === "terrain") {
      tileUrl = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
      attribution = "&copy; OpenTopoMap";
    } else if (theme === "dark") {
      tileUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
      attribution = '&copy; <a href="https://carto.com/">CARTO</a>';
    }

    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution,
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);
  }, [isLeafletReady, theme, mapTypeId]);

  // Update Markers
  useEffect(() => {
    const L = leafletModuleRef.current;
    if (!isLeafletReady || !mapInstanceRef.current || !markersLayerRef.current || !L) return;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    projects.forEach((p) => {
      const isSelected = selectedProject?.id === p.id;
      const isHighRisk = p.riskLevel === "HIGH";

      const iconHtml = `
        <div class="relative group cursor-pointer" style="transform: translate(-50%, -100%);">
          ${
            isHighRisk
              ? `<span class="absolute -inset-2 rounded-full animate-ping opacity-60" style="background-color: ${p.markerHex};"></span>`
              : ""
          }
          <div class="w-8 h-10 transition-transform duration-200 ${
            isSelected ? "scale-125 z-50" : "hover:scale-115"
          }">
            <svg viewBox="0 0 38 48" class="w-full h-full drop-shadow-md">
              <path d="M19 2 C9.6 2 2 9.6 2 19 C2 29.5 16.5 44 19 46 C21.5 44 36 29.5 36 19 C36 9.6 28.4 2 19 2 Z"
                    fill="${p.markerHex}" stroke="#FFFFFF" stroke-width="2.5"/>
              <circle cx="19" cy="18" r="7.5" fill="#FFFFFF"/>
              <circle cx="19" cy="18" r="5" fill="${p.markerHex}"/>
            </svg>
          </div>
        </div>
      `;

      const customDivIcon = L.divIcon({
        className: "dosje-leaflet-marker",
        html: iconHtml,
        iconSize: [32, 42],
        iconAnchor: [16, 42],
      });

      const marker = L.marker([p.coordinates.lat, p.coordinates.lng], {
        icon: customDivIcon,
        zIndexOffset: isSelected ? 1000 : isHighRisk ? 500 : 100,
      });

      marker.on("click", () => {
        onSelectProject(p);
      });

      markersLayer.addLayer(marker);
    });
  }, [isLeafletReady, projects, selectedProject, onSelectProject]);

  // Update Heatmap Layer
  useEffect(() => {
    const L = leafletModuleRef.current;
    if (!isLeafletReady || !mapInstanceRef.current || !heatmapLayerRef.current || !L) return;
    const heatmapLayer = heatmapLayerRef.current;
    heatmapLayer.clearLayers();

    if (heatmapMode === "NONE") return;

    projects.forEach((p) => {
      let radius = 25000; // meters
      let color = "#3B82F6";
      let opacity = 0.35;

      if (heatmapMode === "HIGH_RISK") {
        radius = p.riskScore * 800;
        color = p.riskScore > 70 ? "#EF4444" : p.riskScore > 40 ? "#F59E0B" : "#10B981";
        opacity = 0.45;
      } else if (heatmapMode === "BENEFICIARIES") {
        radius = Math.max(15000, p.beneficiariesCount * 400);
        color = "#8B5CF6";
        opacity = 0.35;
      } else if (heatmapMode === "COMPLAINTS") {
        radius = (p.activeComplaintsCount + 1) * 12000;
        color = "#F97316";
        opacity = 0.45;
      } else if (heatmapMode === "INSPECTIONS") {
        radius = p.inspectionStatus === "COMPLETED" ? 35000 : 20000;
        color = "#2563EB";
        opacity = 0.4;
      }

      L.circle([p.coordinates.lat, p.coordinates.lng], {
        radius,
        color,
        fillColor: color,
        fillOpacity: opacity,
        stroke: false,
      }).addTo(heatmapLayer);
    });
  }, [isLeafletReady, heatmapMode, projects]);

  // Pan to selected project
  useEffect(() => {
    if (selectedProject && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedProject.coordinates.lat, selectedProject.coordinates.lng],
        9,
        { duration: 1.2 }
      );
    }
  }, [selectedProject]);

  // Clear measurement layer if drawingMode is NONE
  useEffect(() => {
    if (drawingMode === "NONE") {
      measurePointsRef.current = [];
      if (measureLayerRef.current) {
        measureLayerRef.current.clearLayers();
      }
    }
  }, [drawingMode]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full z-0" />

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
