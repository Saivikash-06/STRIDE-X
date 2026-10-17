"use client";

import React, { useState } from "react";
import {
  Camera,
  CameraOff,
  Wifi,
  CheckCircle2,
  Play,
  ExternalLink,
  Shield,
  Activity,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { MOCK_CCTV_CAMERAS } from "@/mock/adminMockData";
import { CctvCamera, AdminTab } from "@/types/admin";

interface CCTVWidgetProps {
  onSelectTab?: (tab: AdminTab) => void;
  className?: string;
  limit?: number;
}

export const CCTVWidget: React.FC<CCTVWidgetProps> = ({
  onSelectTab,
  className = "",
  limit = 6,
}) => {
  const [selectedCamera, setSelectedCamera] = useState<CctvCamera | null>(null);

  const onlineCount = MOCK_CCTV_CAMERAS.filter((c) => c.isOnline || c.healthIndicator === "HEALTHY").length;
  const offlineCount = MOCK_CCTV_CAMERAS.filter((c) => !c.isOnline || c.healthIndicator === "OFFLINE").length;
  const degradedCount = MOCK_CCTV_CAMERAS.filter((c) => c.healthIndicator === "DEGRADED").length;
  const totalCount = MOCK_CCTV_CAMERAS.length;
  const healthPercent = Math.round((onlineCount / totalCount) * 100);

  const displayCameras = limit ? MOCK_CCTV_CAMERAS.slice(0, limit) : MOCK_CCTV_CAMERAS;

  return (
    <div className={`p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              CCTV Telemetry & Sovereign Surveillance
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              RTSP protocol monitoring across grantee welfare hostels & centres
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectTab?.("cctv")}
          className="text-xs font-bold text-[#0B5ED7] dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <span>All Feeds (15)</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold">Online</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-1">
            {onlineCount}
          </div>
          <span className="text-[9px] text-emerald-600">Active video feeds</span>
        </div>

        <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-rose-800 dark:text-rose-300 font-semibold">Offline</span>
            <CameraOff className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-xl font-black text-rose-700 dark:text-rose-400 font-mono mt-1">
            {offlineCount}
          </div>
          <span className="text-[9px] text-rose-600">Heartbeat lost</span>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold">Poor Network</span>
            <Wifi className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-700 dark:text-amber-400 font-mono mt-1">
            {degradedCount}
          </div>
          <span className="text-[9px] text-amber-600">Packet drops</span>
        </div>

        <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-blue-800 dark:text-blue-300 font-semibold">Camera Health</span>
            <Activity className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-xl font-black text-blue-700 dark:text-blue-400 font-mono mt-1">
            {healthPercent}%
          </div>
          <span className="text-[9px] text-blue-600">SLA 95% met</span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold block">Last Updated</span>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono mt-1">
            Just Now
          </div>
          <span className="text-[9px] text-slate-400">Sync: 15s interval</span>
        </div>
      </div>

      {/* Grid View of Camera Feeds */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayCameras.map((camera) => {
          const isCamOnline = camera.isOnline && camera.healthIndicator !== "OFFLINE";
          return (
            <div
              key={camera.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 p-3 flex flex-col justify-between hover:border-blue-500/50 transition-all group"
            >
              <div>
                {/* Camera header */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {camera.cameraName}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      camera.healthIndicator === "HEALTHY"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : camera.healthIndicator === "OFFLINE"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {camera.healthIndicator}
                  </span>
                </div>

                {/* Video Preview Box */}
                <div
                  onClick={() => setSelectedCamera(camera)}
                  className="relative h-28 w-full bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer group-hover:ring-2 ring-blue-500/40 transition-all"
                >
                  {isCamOnline ? (
                    <>
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/30" />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        <span className="text-[9px] font-mono text-white/90 uppercase tracking-wider font-bold">
                          REC • {camera.resolution}
                        </span>
                      </div>
                      <Play className="w-6 h-6 text-white/70 group-hover:text-white group-hover:scale-110 transition-transform z-10" />
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[9px] font-mono text-slate-300">
                        <span>{camera.fps} FPS</span>
                        <span>RTSP / H.264</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-2">
                      <CameraOff className="w-6 h-6 text-slate-500 mx-auto mb-1" />
                      <span className="text-[10px] text-slate-400 font-mono block">SIGNAL LOST</span>
                      <span className="text-[9px] text-slate-500">Check IP / Power</span>
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {camera.projectName}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {camera.location}
                  </div>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>Last heartbeat: {camera.lastHeartbeat}</span>
                <button
                  onClick={() => setSelectedCamera(camera)}
                  className="font-bold text-[#0B5ED7] dark:text-blue-400 hover:underline"
                >
                  Preview Stream
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Live Camera Stream Simulation */}
      {selectedCamera && (
        <Modal
          isOpen={!!selectedCamera}
          onClose={() => setSelectedCamera(null)}
          title={`Sovereign RTSP Video Stream: ${selectedCamera.cameraName}`}
        >
          <div className="space-y-3 text-xs">
            <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
              {selectedCamera.isOnline ? (
                <>
                  <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-mono font-bold text-white tracking-wider">
                      LIVE STREAM • RTSP/H.264 ENCRYPTED
                    </span>
                  </div>
                  <div className="text-slate-500 font-mono text-center">
                    <Shield className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                    <p className="text-white font-bold text-sm">
                      {selectedCamera.projectName}
                    </p>
                    <p className="text-slate-400 text-xs">
                      Location: {selectedCamera.location}
                    </p>
                    <p className="text-emerald-400 text-[11px] mt-2">
                      AI Computer Vision Anomaly Detection Active
                    </p>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[11px] font-mono text-slate-400">
                    <span>IP: {selectedCamera.ipAddress}</span>
                    <span>FPS: {selectedCamera.fps} • Resolution: {selectedCamera.resolution}</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <CameraOff className="w-10 h-10 mx-auto text-rose-500 mb-2" />
                  <p className="text-white font-bold text-sm">Camera Disconnected</p>
                  <p className="text-xs text-slate-400 mt-1">
                    RTSP gateway received no packet response since {selectedCamera.lastHeartbeat}.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block uppercase">Stream Endpoint</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono truncate block">
                  {selectedCamera.streamUrl}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block uppercase">Sovereignty Shield</span>
                <span className="font-bold text-emerald-600 font-mono">
                  NIC Cloud Air-Gapped
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
