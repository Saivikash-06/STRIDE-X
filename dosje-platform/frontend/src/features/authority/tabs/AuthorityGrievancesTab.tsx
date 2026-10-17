"use client";

import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { AuthorityGrievance } from "@/types/authority";
import { MOCK_AUTHORITY_GRIEVANCES } from "@/mock/authorityMockData";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const AuthorityGrievancesTab: React.FC = () => {
  const [grievances, setGrievances] = useState<AuthorityGrievance[]>(MOCK_AUTHORITY_GRIEVANCES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [selectedGrievanceForAction, setSelectedGrievanceForAction] = useState<AuthorityGrievance | null>(null);
  const [actionRemarks, setActionRemarks] = useState("");

  // Statistics
  const pendingCount = grievances.filter((g) => g.status === "PENDING").length;
  const verifiedCount = grievances.filter((g) => g.status === "VERIFIED").length;
  const resolvedCount = grievances.filter((g) => g.status === "RESOLVED").length;
  const rejectedCount = grievances.filter((g) => g.status === "REJECTED").length;

  const filteredGrievances = useMemo(() => {
    return grievances.filter((g) => {
      if (statusFilter !== "ALL" && g.status !== statusFilter) return false;
      if (priorityFilter !== "ALL" && g.priority !== priorityFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          g.grievanceId.toLowerCase().includes(q) ||
          g.beneficiaryName.toLowerCase().includes(q) ||
          g.projectName.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.district.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [grievances, statusFilter, priorityFilter, searchQuery]);

  const handleResolveGrievance = (grievanceId: string) => {
    setGrievances((prev) =>
      prev.map((g) =>
        g.id === grievanceId
          ? {
              ...g,
              status: "RESOLVED",
              resolutionRemarks: actionRemarks || "Official redressal recorded by District Welfare Officer.",
            }
          : g
      )
    );
    setSelectedGrievanceForAction(null);
    setActionRemarks("");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            Citizen Grievance Redressal Desk (CPGRAMS & State Portal)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            SLA-monitored grievance management across 15 welfare projects in Maharashtra.
          </p>
        </div>
      </div>

      {/* 4 Key Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 border-slate-200 dark:border-slate-800 bg-rose-50/50 dark:bg-rose-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300">Pending SLA</span>
            <Clock className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-1">
            {pendingCount}
          </div>
          <span className="text-[10px] text-slate-500">Requires triage within 72 hrs</span>
        </Card>

        <Card className="p-3.5 border-slate-200 dark:border-slate-800 bg-amber-50/50 dark:bg-amber-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">Verified by PMU</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">
            {verifiedCount}
          </div>
          <span className="text-[10px] text-slate-500">Under on-site inquiry</span>
        </Card>

        <Card className="p-3.5 border-slate-200 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {resolvedCount}
          </div>
          <span className="text-[10px] text-slate-500">Action taken & confirmed</span>
        </Card>

        <Card className="p-3.5 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Rejected / Closed</span>
            <XCircle className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-700 dark:text-slate-300 mt-1">
            {rejectedCount}
          </div>
          <span className="text-[10px] text-slate-400">Duplicate or out of scope</span>
        </Card>
      </div>

      {/* Filter Row */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Ticket ID, Beneficiary, Project, Category..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#0F4C81]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending SLA 🔴</option>
            <option value="VERIFIED">Verified 🟡</option>
            <option value="RESOLVED">Resolved 🟢</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Grievances Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10.5px] border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-3">Grievance ID</th>
              <th className="py-3 px-3">Beneficiary</th>
              <th className="py-3 px-3">Project & District</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3 text-center">Priority</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3">Assigned Officer</th>
              <th className="py-3 px-3">Filing Date</th>
              <th className="py-3 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredGrievances.slice(0, 15).map((g) => (
              <tr key={g.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                  {g.grievanceId}
                </td>
                <td className="py-2.5 px-3">
                  <div className="font-semibold text-slate-900 dark:text-white">{g.beneficiaryName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{g.beneficiaryContact}</div>
                </td>
                <td className="py-2.5 px-3">
                  <div className="text-slate-800 dark:text-slate-200 font-medium max-w-[150px] truncate">
                    {g.projectName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold">{g.district}</div>
                </td>
                <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 max-w-[140px] truncate">
                  {g.category}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      g.priority === "CRITICAL"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        : g.priority === "HIGH"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    }`}
                  >
                    {g.priority}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      g.status === "RESOLVED"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : g.status === "PENDING"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {g.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 text-[11px] max-w-[140px] truncate">
                  {g.assignedOfficer}
                </td>
                <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                  {g.filingDate}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <button
                    onClick={() => setSelectedGrievanceForAction(g)}
                    className="px-2.5 py-1 rounded bg-[#0F4C81] text-white hover:bg-[#0c3c66] transition-colors text-[11px] font-semibold"
                  >
                    Take Action
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action / Redressal Modal */}
      {selectedGrievanceForAction && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-5 text-xs space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-rose-600 text-white">
                  {selectedGrievanceForAction.grievanceId}
                </span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1">
                  Redress Grievance: {selectedGrievanceForAction.category}
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Complainant: {selectedGrievanceForAction.beneficiaryName} • {selectedGrievanceForAction.district}
                </p>
              </div>
              <button
                onClick={() => setSelectedGrievanceForAction(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <span className="font-bold text-slate-900 dark:text-white">Citizen Description:</span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedGrievanceForAction.description}
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Official Redressal Remarks / Action Order:
              </label>
              <textarea
                rows={3}
                value={actionRemarks}
                onChange={(e) => setActionRemarks(e.target.value)}
                placeholder="Enter field audit observations, direct benefit disbursal reference, or corrective orders..."
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-[#0F4C81]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button size="sm" variant="outline" onClick={() => setSelectedGrievanceForAction(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleResolveGrievance(selectedGrievanceForAction.id)}
                leftIcon={<Check className="w-3.5 h-3.5" />}
              >
                Mark as Resolved & Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
