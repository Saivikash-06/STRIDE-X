"use client";

import React, { useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { MOCK_AI_ALERTS } from "@/mock/adminMockData";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

export const NotificationsTab: React.FC = () => {
  const { showToast } = useToast();
  const [filterType, setFilterType] = useState("ALL");
  const [notifications, setNotifications] = useState(
    MOCK_AI_ALERTS.map((a, i) => ({ ...a, read: i > 5 }))
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast({
      type: "success",
      title: "Notifications Cleared",
      message: "All departmental alert notifications marked as read.",
    });
  };

  const markSingleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filtered = notifications.filter((n) => {
    if (filterType === "UNREAD") return !n.read;
    if (filterType === "CRITICAL") return n.priority === "CRITICAL";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#0B5ED7] dark:text-blue-400" />
            STRIDE-X National Vigilance & Alert Dispatch Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time feed of STRIDE-X alerts, statutory notices, telemetry flags, and inspection alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button size="sm" variant="outline" onClick={markAllRead} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Mark All as Read ({unreadCount})
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterType("ALL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            filterType === "ALL" ? "bg-[#0F4C81] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType("UNREAD")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            filterType === "UNREAD" ? "bg-[#0D9488] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilterType("CRITICAL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            filterType === "CRITICAL" ? "bg-rose-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          }`}
        >
          Critical Only
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className={`p-4 border-slate-200 dark:border-slate-800 transition-colors ${
              !item.read
                ? "bg-blue-50/40 dark:bg-blue-950/20 border-l-4 border-l-[#0F4C81] dark:border-l-blue-500"
                : "bg-white dark:bg-slate-900"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    item.priority === "CRITICAL"
                      ? "bg-rose-100 text-rose-600 dark:bg-rose-950"
                      : item.priority === "HIGH"
                      ? "bg-amber-100 text-amber-600 dark:bg-amber-950"
                      : "bg-blue-100 text-[#0F4C81] dark:bg-blue-950"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <Badge
                      variant={
                        item.priority === "CRITICAL"
                          ? "danger"
                          : item.priority === "HIGH"
                          ? "warning"
                          : "primary"
                      }
                      size="sm"
                    >
                      {item.priority}
                    </Badge>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                    <span>{item.projectName} ({item.state})</span>
                    <span>•</span>
                    <span className="font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.timestamp}
                    </span>
                  </div>
                </div>
              </div>

              {!item.read && (
                <button
                  onClick={() => markSingleRead(item.id)}
                  className="text-xs font-semibold text-[#0F4C81] dark:text-blue-400 hover:underline shrink-0"
                >
                  Mark Read
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
