"use client";

import React, { useState } from "react";
import { Settings, User, Globe, Bell, Palette, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Checkbox } from "@/components/ui/Checkbox";
import { useToast } from "@/hooks/useToast";

export const SettingsTab: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [officerName, setOfficerName] = useState(currentUser?.name || "Dr. Rajeshwar Sharma, IAS");
  const [designation, setDesignation] = useState(currentUser?.designation || "Joint Secretary (Monitoring & Compliance)");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [highRiskPush, setHighRiskPush] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState("60");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      type: "success",
      title: "Preferences Saved",
      message: "Central administrator profile and dashboard settings updated successfully.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#0F4C81] dark:text-blue-400" />
          Command Center Settings & Governance Preferences
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage officer credentials, notification escalations, and national dashboard telemetry sync.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <User className="w-4 h-4 text-[#0F4C81] dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Administrator Profile & Departmental Role
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Designated Officer Name"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
            />
            <Input
              label="Official Designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
            <Input
              label="Official Email"
              disabled
              value={currentUser?.email || "dosje.admin@demo.gov"}
              helperText="Managed by National Informatics Centre (NIC) domain authority."
            />
            <Input
              label="Assigned Clearance Level"
              disabled
              value="Level 1 Central (All States & UTs)"
              helperText="Statutory clearance under Government of India norms."
            />
          </div>
        </Card>

        {/* Theme and Display Preferences */}
        <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Palette className="w-4 h-4 text-[#0F4C81] dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Theme & Interface Mode
            </h3>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Command Center Theme Selection
              </span>
              <p className="text-xs text-slate-500">
                Switch between Light, Dark, or System mode for optimal day/night monitoring.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </Card>

        {/* Notification Escalations */}
        <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Bell className="w-4 h-4 text-[#0F4C81] dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Vigilance Escalation & Alert Subscriptions
            </h3>
          </div>

          <div className="space-y-3">
            <Checkbox
              label="Urgent High-Risk Anomaly Push Notifications"
              description="Immediately alert when a facility risk index crosses 75 points or CCTV drops offline."
              checked={highRiskPush}
              onChange={(e) => setHighRiskPush(e.target.checked)}
            />
            <Checkbox
              label="Daily National Telemetry Digest (Official Email)"
              description="Receive 08:00 AM summary of completed inspections and fund reconciliations."
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
            />
            <Checkbox
              label="Emergency SMS Alerts to Registered Work Phone"
              description="Critical security or parliamentary Q&A summons dispatch via SMS."
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
            />
          </div>
        </Card>

        {/* Dashboard Refresh Frequency */}
        <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Globe className="w-4 h-4 text-[#0F4C81] dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Telemetry Sync Frequency
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider uppercase text-slate-700 dark:text-slate-300 mb-1.5">
              Live Data Polling Interval
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(e.target.value)}
              className="w-full max-w-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 shadow-sm focus:border-[#0F4C81]"
            >
              <option value="30">Every 30 Seconds (High Velocity)</option>
              <option value="60">Every 60 Seconds (Standard Balanced)</option>
              <option value="300">Every 5 Minutes (Low Bandwidth)</option>
            </select>
          </div>
        </Card>

        <div className="flex items-center justify-end">
          <Button type="submit" variant="primary" size="md" leftIcon={<Check className="w-4 h-4" />}>
            Save All Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
