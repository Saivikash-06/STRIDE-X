"use client";

import React, { useState } from "react";
import { Camera, ShieldAlert, Video, Eye } from "lucide-react";
import { MOCK_CCTV_CAMERAS } from "@/mock/adminMockData";
import { CctvCamera } from "@/types/admin";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
export const CctvTab: React.FC = () => {
  const [filter, setFilter] = useState<"ALL" | "ONLINE" | "OFFLINE">("ALL");
  const [selectedCam, setSelectedCam] = useState<CctvCamera | null>(null);

  const filtered = MOCK_CCTV_CAMERAS.filter((c) => {
    if (filter === "ONLINE") return c.isOnline;
    if (filter === "OFFLINE") return !c.isOnline;
    return true;
  });

  const onlineCount = MOCK_CCTV_CAMERAS.filter((c) => c.isOnline).length;
  const offlineCount = MOCK_CCTV_CAMERAS.length - onlineCount;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#0F4C81] dark:text-blue-400" />
            National CCTV Video Telemetry & Anomaly Feeds
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Continuous automated telemetry streams verifying facility open hours, resident safety, and infrastructure presence.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filter === "ALL" ? "bg-[#0F4C81] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            All Cameras (15)
          </button>
          <button
            onClick={() => setFilter("ONLINE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filter === "ONLINE" ? "bg-emerald-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            Online ({onlineCount})
          </button>
          <button
            onClick={() => setFilter("OFFLINE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filter === "OFFLINE" ? "bg-rose-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            Offline Alerts ({offlineCount})
          </button>
        </div>
      </div>

      {/* Cameras Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((cam) => (
          <Card
            key={cam.id}
            hoverEffect
            className="overflow-hidden border-slate-200 dark:border-slate-800 flex flex-col justify-between"
          >
            <div>
              {/* CCTV Video Preview Mockup Window */}
              <div className="relative h-44 bg-slate-950 flex flex-col justify-between p-3 text-white overflow-hidden">
                {/* Background CCTV scanlines effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
                  <span className="flex items-center gap-1.5 font-bold">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        cam.isOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                      }`}
                    />
                    {cam.cameraName} • {cam.isOnline ? "LIVE REC" : "FEED LOST"}
                  </span>
                  <span className="opacity-75">{cam.resolution}</span>
                </div>

                {/* Center visual: Facility silhouette or offline alert */}
                <div className="relative z-10 flex flex-col items-center justify-center py-4">
                  {cam.isOnline ? (
                    <div className="text-center space-y-1">
                      <Video className="w-8 h-8 text-teal-400/80 mx-auto" />
                      <span className="text-[10px] font-mono text-teal-300">
                        FPS: {cam.fps} • Bitrate: 2.4 Mbps
                      </span>
                    </div>
                  ) : (
                    <div className="text-center space-y-1">
                      <ShieldAlert className="w-8 h-8 text-rose-500 mx-auto animate-bounce" />
                      <span className="text-[10px] font-mono text-rose-400 font-bold">
                        SIGNAL LOSS DETECTED
                      </span>
                    </div>
                  )}
                </div>

                <div className="relative z-10 flex items-center justify-between text-[10px] font-mono opacity-80 border-t border-white/10 pt-1">
                  <span>{cam.location}</span>
                  <span>2026-09-29 11:42 IST</span>
                </div>
              </div>

              {/* Card Metadata */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {cam.projectName}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                      IP: {cam.ipAddress}
                    </span>
                  </div>
                  <Badge
                    variant={cam.isOnline ? "success" : "danger"}
                    size="sm"
                    dot
                  >
                    {cam.healthIndicator}
                  </Badge>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Heartbeat:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {cam.lastHeartbeat}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs"
                onClick={() => setSelectedCam(cam)}
                leftIcon={<Eye className="w-3.5 h-3.5" />}
              >
                Inspect Telemetry Feed
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Video Feed Inspection Modal */}
      {selectedCam && (
        <Modal
          isOpen={!!selectedCam}
          onClose={() => setSelectedCam(null)}
          title={`CCTV Telemetry: ${selectedCam.cameraName}`}
          description={`${selectedCam.projectName} • ${selectedCam.location}`}
          maxWidth="lg"
          footer={
            <Button size="sm" variant="primary" onClick={() => setSelectedCam(null)}>
              Close Video Stream
            </Button>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="h-64 bg-slate-950 rounded-lg flex flex-col items-center justify-center text-white relative p-4">
              <Video className="w-12 h-12 text-teal-400 mb-2" />
              <span className="font-bold text-sm">RTSP Sovereign Video Protocol</span>
              <span className="font-mono text-xs text-slate-400 mt-1">{selectedCam.streamUrl}</span>
              <span className="text-[11px] text-emerald-400 font-mono mt-3">
                {selectedCam.isOnline ? "● Stream Encrypted under CERT-In Guidelines" : "● Offline Alert dispatched to District Collectorate"}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
