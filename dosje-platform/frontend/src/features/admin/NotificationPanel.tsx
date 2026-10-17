"use client";

import React, { useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  AlertTriangle,
  ClipboardCheck,
  MessageSquareWarning,
  Camera,
  ShieldCheck,
  CalendarCheck,
  ExternalLink,
} from "lucide-react";
import { AdminTab } from "@/types/admin";

export type NotificationCategory =
  | "all"
  | "ai-alert"
  | "inspection"
  | "grievance"
  | "cctv"
  | "compliance"
  | "attendance";

export interface AdminNotification {
  id: string;
  type: "ai-alert" | "inspection" | "grievance" | "cctv" | "compliance" | "attendance";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  targetTab: AdminTab;
  metaInfo?: string;
}

const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "notif-01",
    type: "ai-alert",
    title: "Critical Anomaly: Sudden 38% Attendance Drop",
    description: "Ashray Welfare Senior Living Centre (UP-LKO-001) attendance dropped below statutory minimum threshold.",
    timestamp: "8 minutes ago",
    read: false,
    priority: "CRITICAL",
    targetTab: "ai-risk",
    metaInfo: "Lucknow, Uttar Pradesh",
  },
  {
    id: "notif-02",
    type: "cctv",
    title: "CCTV Telemetry Disconnected",
    description: "Camera feed CAM-04 (Main Hallway) at Disha Vocational Centre went offline without heartbeat signal.",
    timestamp: "24 minutes ago",
    read: false,
    priority: "HIGH",
    targetTab: "cctv",
    metaInfo: "Patna, Bihar",
  },
  {
    id: "notif-03",
    type: "grievance",
    title: "New Critical Grievance (SLA-48)",
    description: "Grievance #GRV-2026-089 filed regarding non-receipt of disability aid stipends.",
    timestamp: "45 minutes ago",
    read: false,
    priority: "HIGH",
    targetTab: "grievances",
    metaInfo: "Jaipur, Rajasthan",
  },
  {
    id: "notif-04",
    type: "inspection",
    title: "PMU Field Inspection Overdue",
    description: "Statutory surprise audit at Navchetna Substance Rehab Centre is 7 days past mandatory deadline.",
    timestamp: "2 hours ago",
    read: false,
    priority: "HIGH",
    targetTab: "inspections",
    metaInfo: "Amritsar, Punjab",
  },
  {
    id: "notif-05",
    type: "compliance",
    title: "GFR-19A Utilization Certificate Pending",
    description: "Samarpan Foundation has not submitted audited expenditure sheet for Q3 tranche release.",
    timestamp: "4 hours ago",
    read: true,
    priority: "MEDIUM",
    targetTab: "compliance",
    metaInfo: "Bhopal, Madhya Pradesh",
  },
  {
    id: "notif-06",
    type: "attendance",
    title: "Staff Biometric Punch Discrepancy",
    description: "3 field supervisors registered identical IP geo-punches within 90 seconds. Proxy flagged.",
    timestamp: "6 hours ago",
    read: true,
    priority: "MEDIUM",
    targetTab: "attendance",
    metaInfo: "Ranchi, Jharkhand",
  },
];

interface NotificationPanelProps {
  onSelectTab?: (tab: AdminTab) => void;
  onClose?: () => void;
  className?: string;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  onSelectTab,
  onClose,
  className = "",
}) => {
  const [notifications, setNotifications] = useState<AdminNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<NotificationCategory>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    return n.type === activeFilter;
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: AdminNotification["type"]) => {
    switch (type) {
      case "ai-alert":
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case "inspection":
        return <ClipboardCheck className="w-4 h-4 text-purple-500" />;
      case "grievance":
        return <MessageSquareWarning className="w-4 h-4 text-amber-500" />;
      case "cctv":
        return <Camera className="w-4 h-4 text-sky-500" />;
      case "compliance":
        return <ShieldCheck className="w-4 h-4 text-teal-500" />;
      case "attendance":
        return <CalendarCheck className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  const filterTabs: { id: NotificationCategory; label: string }[] = [
    { id: "all", label: `All (${notifications.length})` },
    { id: "ai-alert", label: "AI Alerts" },
    { id: "inspection", label: "Inspections" },
    { id: "grievance", label: "Grievances" },
    { id: "cctv", label: "CCTV" },
    { id: "compliance", label: "Compliance" },
    { id: "attendance", label: "Attendance" },
  ];

  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-850/50">
        <div className="flex items-center gap-2">
          <div className="relative p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-[#0B5ED7] dark:text-blue-400">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Vigilance & Command Notifications
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {unreadCount} unread administrative notices
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-2 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-md transition-colors flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
              title="Clear all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-slate-50/30 dark:bg-slate-900">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeFilter === tab.id
                ? "bg-[#0B5ED7] text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-96 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircleIcon className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No notifications in this category
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              All statutory telemetry within normal thresholds.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 transition-colors flex items-start justify-between gap-3 group ${
                item.read
                  ? "bg-white dark:bg-slate-900 opacity-80 hover:opacity-100"
                  : "bg-blue-50/40 dark:bg-blue-950/20"
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                  {getNotificationIcon(item.type)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {item.title}
                    </span>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-medium">
                    <span>{item.timestamp}</span>
                    {item.metaInfo && (
                      <>
                        <span>•</span>
                        <span>{item.metaInfo}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0 pt-0.5">
                {!item.read && (
                  <button
                    onClick={() => markAsRead(item.id)}
                    className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                    title="Mark as read"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => {
                    markAsRead(item.id);
                    onSelectTab?.(item.targetTab);
                    onClose?.();
                  }}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  title="Open module"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 text-center">
        <button
          onClick={() => {
            onSelectTab?.("notifications");
            onClose?.();
          }}
          className="text-xs font-bold text-[#0B5ED7] dark:text-blue-400 hover:underline"
        >
          Open Full Vigilance Notification Center →
        </button>
      </div>
    </div>
  );
};

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
