"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  VideoOff,
  Search,
  Maximize2,
  X,
  Eye,
} from "lucide-react";
import { AuthorityCctvCamera } from "@/types/authority";
import { MOCK_AUTHORITY_CAMERAS, AUTHORITY_DISTRICTS } from "@/mock/authorityMockData";
import { Button } from "@/components/ui/Button";

export const AuthorityCctvTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ONLINE" | "OFFLINE">("ALL");
  const [selectedCameraForStream, setSelectedCameraForStream] = useState<AuthorityCctvCamera | null>(null);

  const filteredCameras = MOCK_AUTHORITY_CAMERAS.filter((c) => {
    if (districtFilter !== "ALL" && c.district !== districtFilter) return false;
    if (statusFilter === "ONLINE" && !c.online) return false;
    if (statusFilter === "OFFLINE" && c.online) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.projectName.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.cameraId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const onlineCount = MOCK_AUTHORITY_CAMERAS.filter((c) => c.online).length;
  const offlineCount = MOCK_AUTHORITY_CAMERAS.filter((c) => !c.online).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            Centralized CCTV Surveillance & Feed Monitoring
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time visual surveillance feeds across 15 welfare facilities in Maharashtra.
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {onlineCount} Feeds Online
          </span>
          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 flex items-center gap-1.5">
            <VideoOff className="w-3.5 h-3.5" />
            {offlineCount} Offline Alert
          </span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Camera Name, Project, Location..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#0F4C81]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
          >
            <option value="ALL">All Districts</option>
            {AUTHORITY_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | "ONLINE" | "OFFLINE")}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
          >
            <option value="ALL">All Feeds ({MOCK_AUTHORITY_CAMERAS.length})</option>
            <option value="ONLINE">Online Feeds ({onlineCount})</option>
            <option value="OFFLINE">Offline Feeds ({offlineCount})</option>
          </select>
        </div>
      </div>

      {/* Camera Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCameras.map((cam) => {
          const isOnline = cam.online;

          return (
            <div
              key={cam.id}
              className={`rounded-2xl border overflow-hidden shadow-xs transition-all flex flex-col justify-between ${
                isOnline
                  ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  : "bg-rose-50/20 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900"
              }`}
            >
              {/* Snapshot Preview Box */}
              <div className="relative aspect-video w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <Image
                  src={cam.previewUrl}
                  alt={cam.name}
                  fill
                  unoptimized
                  className={`object-cover ${!isOnline ? "grayscale contrast-125 opacity-40" : ""}`}
                />

                {/* Status Badges Overlay */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono text-white flex items-center gap-1 ${
                      isOnline ? "bg-emerald-600/90 backdrop-blur-xs" : "bg-rose-600/90 backdrop-blur-xs"
                    }`}
                  >
                    {isOnline && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                    {isOnline ? "LIVE FEED" : "OFFLINE"}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/60 text-slate-300">
                    {cam.fps} FPS
                  </span>
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <button
                    onClick={() => setSelectedCameraForStream(cam)}
                    className="p-1 rounded bg-black/60 hover:bg-black/90 text-white transition-colors"
                    title="Fullscreen Preview"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {!isOnline && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-3 text-white">
                    <VideoOff className="w-6 h-6 text-rose-400 mb-1" />
                    <span className="font-bold text-xs">Video Stream Disconnected</span>
                    <span className="text-[10px] text-rose-300 mt-0.5">Last active: {cam.lastActive}</span>
                  </div>
                )}
              </div>

              {/* Card Meta Content */}
              <div className="p-4 space-y-2.5 text-xs flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-bold text-slate-900 dark:text-white leading-snug">
                      {cam.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {cam.resolution}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate mt-0.5">
                    {cam.projectName}
                  </div>
                  <div className="text-[10.5px] text-slate-400 truncate mt-0.5">
                    {cam.locationDescription}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-between font-mono">
                    <span>IP / Node:</span>
                    <span>{cam.ipAddress}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Alert Status:</span>
                    <span
                      className={`font-bold ${
                        cam.alertStatus === "NORMAL"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {cam.alertStatus}
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full justify-center text-xs mt-2"
                  onClick={() => setSelectedCameraForStream(cam)}
                  leftIcon={<Eye className="w-3.5 h-3.5 text-[#0F4C81]" />}
                >
                  Inspect Live Stream & AI Log
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Stream Fullscreen Dialog Modal */}
      {selectedCameraForStream && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-950 text-white rounded-2xl border border-slate-800 shadow-2xl max-w-3xl w-full overflow-hidden space-y-3">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${selectedCameraForStream.online ? "bg-emerald-500 animate-ping" : "bg-rose-500"}`} />
                <div>
                  <h3 className="text-sm font-bold">{selectedCameraForStream.name}</h3>
                  <p className="text-[11px] text-slate-400">{selectedCameraForStream.projectName} • {selectedCameraForStream.district}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCameraForStream(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Canvas Container */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <Image
                src={selectedCameraForStream.previewUrl}
                alt="Stream"
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded text-xs font-mono space-x-2">
                <span className="text-emerald-400 font-bold">● REC</span>
                <span>STREAM: RTSP://10.42.x.x/live</span>
                <span>LATENCY: 42ms</span>
              </div>
            </div>

            {/* Telemetry Footer */}
            <div className="p-4 pt-1 flex items-center justify-between text-xs text-slate-400">
              <span>AI Face Detection: Enabled</span>
              <span>Resolution: {selectedCameraForStream.resolution} @ {selectedCameraForStream.fps} FPS</span>
              <Button size="sm" variant="secondary" onClick={() => setSelectedCameraForStream(null)}>
                Close Feed
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
