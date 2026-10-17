import { MarkerColorCategory } from "./mapTypes";

export const MARKER_COLORS: Record<
  MarkerColorCategory,
  {
    hex: string;
    border: string;
    label: string;
    description: string;
    tailwindBg: string;
    tailwindText: string;
    badgeEmoji: string;
  }
> = {
  GREEN: {
    hex: "#10B981",
    border: "#047857",
    label: "Low Risk",
    description: "Low Risk Project (Compliant & Audited)",
    tailwindBg: "bg-emerald-500",
    tailwindText: "text-emerald-700 dark:text-emerald-300",
    badgeEmoji: "🟢",
  },
  YELLOW: {
    hex: "#F59E0B",
    border: "#B45309",
    label: "Moderate Risk",
    description: "Moderate Risk Project (Caution Level)",
    tailwindBg: "bg-amber-500",
    tailwindText: "text-amber-700 dark:text-amber-300",
    badgeEmoji: "🟡",
  },
  ORANGE: {
    hex: "#F97316",
    border: "#C2410C",
    label: "Inspection Pending",
    description: "Inspection Scheduled or Overdue",
    tailwindBg: "bg-orange-500",
    tailwindText: "text-orange-700 dark:text-orange-300",
    badgeEmoji: "🟠",
  },
  RED: {
    hex: "#EF4444",
    border: "#B91C1C",
    label: "High Risk",
    description: "High Risk Project (Urgent Audit Flag)",
    tailwindBg: "bg-rose-500",
    tailwindText: "text-rose-700 dark:text-rose-300",
    badgeEmoji: "🔴",
  },
  BLUE: {
    hex: "#2563EB",
    border: "#1D4ED8",
    label: "Inspection Completed",
    description: "Inspection Verified with Geo-Evidence",
    tailwindBg: "bg-blue-600",
    tailwindText: "text-blue-700 dark:text-blue-300",
    badgeEmoji: "🔵",
  },
  PURPLE: {
    hex: "#8B5CF6",
    border: "#6D28D9",
    label: "CCTV Offline",
    description: "Camera Telemetry Stream Disconnected",
    tailwindBg: "bg-purple-600",
    tailwindText: "text-purple-700 dark:text-purple-300",
    badgeEmoji: "🟣",
  },
  BLACK: {
    hex: "#18181B",
    border: "#09090B",
    label: "Compliance Issue",
    description: "Statutory Default / Notice Issued",
    tailwindBg: "bg-zinc-900 dark:bg-black",
    tailwindText: "text-zinc-900 dark:text-zinc-200",
    badgeEmoji: "⚫",
  },
};

/**
 * Clean Google Maps Dark Style (Slate / Midnight Navy)
 */
export const GOOGLE_MAPS_DARK_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#cbd5e1" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#064e3b" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#334155" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3b82f6" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1d4ed8" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0369a1" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#7dd3fc" }],
  },
];

/**
 * Clean Google Maps Light Style (Gov Administrative Positron)
 */
export const GOOGLE_MAPS_LIGHT_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f8fafc" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#334155" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#0f4c81" }, { weight: 1.5 }],
  },
  {
    featureType: "administrative.province",
    elementType: "geometry.stroke",
    stylers: [{ color: "#94a3b8" }, { weight: 0.8 }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#cbe5ff" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#0284c7" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#d1fae5" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e2e8f0" }],
  },
];

/**
 * Generates an SVG string or Data URL for Google Maps and Leaflet markers
 */
export function getCustomSvgMarkerUri(
  colorHex: string,
  isPulsing: boolean = false,
  symbolText: string = ""
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="48" viewBox="0 0 38 48">
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.35"/>
      </filter>
      ${
        isPulsing
          ? `<radialGradient id="halo" cx="50%" cy="50%" r="50%">
               <stop offset="0%" stop-color="${colorHex}" stop-opacity="0.6"/>
               <stop offset="100%" stop-color="${colorHex}" stop-opacity="0"/>
             </radialGradient>`
          : ""
      }
    </defs>
    ${
      isPulsing
        ? `<circle cx="19" cy="20" r="18" fill="url(#halo)">
             <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite"/>
             <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite"/>
           </circle>`
        : ""
    }
    <!-- Pin Body -->
    <path d="M19 2 C9.6 2 2 9.6 2 19 C2 29.5 16.5 44 19 46 C21.5 44 36 29.5 36 19 C36 9.6 28.4 2 19 2 Z"
          fill="${colorHex}" stroke="#FFFFFF" stroke-width="2.2" filter="url(#shadow)"/>
    <!-- Pin Inner Core -->
    <circle cx="19" cy="18" r="8" fill="#FFFFFF"/>
    <circle cx="19" cy="18" r="5.5" fill="${colorHex}"/>
    ${
      symbolText
        ? `<text x="19" y="21" font-size="7" font-weight="900" fill="#FFFFFF" text-anchor="middle" font-family="system-ui, sans-serif">${symbolText}</text>`
        : ""
    }
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
