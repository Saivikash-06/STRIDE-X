"use client";

import React, { useState, useMemo } from "react";
import {
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Users,
  FileCheck,
  ShieldAlert,
  IndianRupee,
  Clock,
  ArrowRight,
  CheckCheck,
} from "lucide-react";
import { AuthorityNotificationItem, AuthorityTab } from "@/types/authority";
import { MOCK_AUTHORITY_NOTIFICATIONS } from "@/mock/authorityMockData";

interface AuthorityNotificationsTabProps {
  onNavigateTab?: (tab: AuthorityTab) => void;
}

export default function AuthorityNotificationsTab({ onNavigateTab }: AuthorityNotificationsTabProps) {
  const [notifications, setNotifications] = useState<AuthorityNotificationItem[]>(MOCK_AUTHORITY_NOTIFICATIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [filterRead, setFilterRead] = useState<"ALL" | "UNREAD" | "READ">("ALL");

  const types = [
    { label: "All Types", value: "ALL" },
    { label: "High Risk Alerts", value: "HIGH_RISK_ALERT" },
    { label: "CCTV Offline", value: "CCTV_OFFLINE" },
    { label: "New Grievances", value: "NEW_GRIEVANCE" },
    { label: "Inspections Assigned", value: "INSPECTION_ASSIGNED" },
    { label: "Attendance Alerts", value: "ATTENDANCE_ALERT" },
    { label: "Compliance Due", value: "COMPLIANCE_DUE" },
    { label: "Fund Alerts", value: "FUND_ALERT" },
  ];

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "ALL" || item.type === selectedType;
      const matchesRead =
        filterRead === "ALL" ||
        (filterRead === "UNREAD" && !item.read) ||
        (filterRead === "READ" && item.read);

      return matchesSearch && matchesType && matchesRead;
    });
  }, [notifications, searchTerm, selectedType, filterRead]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const getNotificationIcon = (type: AuthorityNotificationItem["type"]) => {
    switch (type) {
      case "HIGH_RISK_ALERT":
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case "CCTV_OFFLINE":
        return <Camera className="w-5 h-5 text-rose-500" />;
      case "NEW_GRIEVANCE":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "INSPECTION_ASSIGNED":
        return <FileCheck className="w-5 h-5 text-blue-500" />;
      case "ATTENDANCE_ALERT":
        return <Users className="w-5 h-5 text-purple-500" />;
      case "COMPLIANCE_DUE":
        return <CheckCircle2 className="w-5 h-5 text-orange-500" />;
      case "FUND_ALERT":
        return <IndianRupee className="w-5 h-5 text-emerald-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              STRIDE-X State & District Notification Center
            </h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time critical telemetry notifications, inspection assignments, and CPGRAMS grievance escalations across Maharashtra.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-colors border border-blue-200 dark:border-blue-800 shadow-sm"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Control Bar: Search & Filter Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {types.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800 text-xs font-medium">
              <button
                onClick={() => setFilterRead("ALL")}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  filterRead === "ALL"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterRead("UNREAD")}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  filterRead === "UNREAD"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilterRead("READ")}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  filterRead === "READ"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Read
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-slate-400">
            <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
              No notifications found
            </p>
            <p className="text-xs text-slate-400 mt-1">
              You are all caught up with your monitoring telemetry.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                !notif.read
                  ? "bg-blue-50/40 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/60 shadow-xs"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100"
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5">
                  {getNotificationIcon(notif.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        notif.priority === "CRITICAL"
                          ? "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                          : notif.priority === "HIGH"
                          ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                          : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                      }`}
                    >
                      {notif.priority}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {notif.description}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{notif.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => toggleRead(notif.id)}
                  className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {notif.read ? "Mark unread" : "Mark read"}
                </button>

                {notif.linkTab && onNavigateTab && (
                  <button
                    onClick={() => {
                      toggleRead(notif.id);
                      onNavigateTab(notif.linkTab as AuthorityTab);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                  >
                    <span>View Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
