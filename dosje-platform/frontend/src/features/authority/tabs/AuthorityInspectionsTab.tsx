"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Calendar,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Camera,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCheck,
  X,
} from "lucide-react";
import { AuthorityInspection } from "@/types/authority";
import { MOCK_AUTHORITY_INSPECTIONS, AUTHORITY_DISTRICTS } from "@/mock/authorityMockData";

export default function AuthorityInspectionsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedPriority, setSelectedPriority] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInspection, setSelectedInspection] = useState<AuthorityInspection | null>(null);
  const pageSize = 8;

  // Filtered & Searched data
  const filteredInspections = useMemo(() => {
    return MOCK_AUTHORITY_INSPECTIONS.filter((item) => {
      const matchesSearch =
        item.inspectionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ngoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.inspectorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.district.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDistrict = selectedDistrict === "ALL" || item.district === selectedDistrict;
      const matchesStatus = selectedStatus === "ALL" || item.status === selectedStatus;
      const matchesPriority = selectedPriority === "ALL" || item.priority === selectedPriority;

      return matchesSearch && matchesDistrict && matchesStatus && matchesPriority;
    });
  }, [searchTerm, selectedDistrict, selectedStatus, selectedPriority]);

  const totalPages = Math.ceil(filteredInspections.length / pageSize) || 1;
  const paginatedInspections = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInspections.slice(start, start + pageSize);
  }, [filteredInspections, currentPage]);

  // Statistics
  const stats = useMemo(() => {
    const total = MOCK_AUTHORITY_INSPECTIONS.length;
    const completed = MOCK_AUTHORITY_INSPECTIONS.filter((i) => i.status === "COMPLETED").length;
    const scheduled = MOCK_AUTHORITY_INSPECTIONS.filter((i) => i.status === "SCHEDULED").length;
    const flagged = MOCK_AUTHORITY_INSPECTIONS.filter((i) => i.status === "FLAGGED").length;
    const overdue = MOCK_AUTHORITY_INSPECTIONS.filter((i) => i.status === "OVERDUE").length;
    const completedList = MOCK_AUTHORITY_INSPECTIONS.filter((i) => i.status === "COMPLETED" && i.scorePercent > 0);
    const avgScore = completedList.length > 0
      ? (completedList.reduce((acc, c) => acc + c.scorePercent, 0) / completedList.length).toFixed(1)
      : "85.2";

    return { total, completed, scheduled, flagged, overdue, avgScore };
  }, []);

  const handleExportCSV = () => {
    const headers = [
      "Inspection ID",
      "Project Name",
      "NGO",
      "District",
      "Inspector",
      "Priority",
      "Status",
      "Assigned Date",
      "Due Date",
      "Completed Date",
      "Score (%)",
      "Photo Evidence Count",
    ];
    const rows = filteredInspections.map((i) => [
      i.inspectionId,
      `"${i.projectName.replace(/"/g, '""')}"`,
      `"${i.ngoName.replace(/"/g, '""')}"`,
      i.district,
      `"${i.inspectorName.replace(/"/g, '""')}"`,
      i.priority,
      i.status,
      i.assignedDate,
      i.dueDate,
      i.completedDate || "N/A",
      i.scorePercent,
      i.photoEvidenceCount,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DoSJE_PMU_Inspections_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Audits</span>
            <FileCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</span>
            <span className="text-xs text-blue-600 font-medium">5 Districts</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">PMU Field Inspections</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">{stats.completed}</span>
            <span className="text-xs text-emerald-600 font-medium">{Math.round((stats.completed / stats.total) * 100)}% done</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Geotagged verified</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600">{stats.scheduled}</span>
            <span className="text-xs text-amber-600 font-medium">In Queue</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Roster assigned</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Flagged / Overdue</span>
            <ShieldAlert className="w-5 h-5 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600">{stats.flagged + stats.overdue}</span>
            <span className="text-xs text-rose-600 font-medium">Critical focus</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{stats.flagged} flagged, {stats.overdue} overdue</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Score</span>
            <UserCheck className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.avgScore}%</span>
            <span className="text-xs text-indigo-600 font-medium">Quality idx</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Completed audits baseline</p>
        </div>
      </div>

      {/* Control Bar: Search, Filters, CSV Export */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, Project, NGO, Inspector, or District..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* District Filter */}
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Districts ({AUTHORITY_DISTRICTS.length})</option>
              {AUTHORITY_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="FLAGGED">Flagged</option>
              <option value="OVERDUE">Overdue</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => {
                setSelectedPriority(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
            </select>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(selectedDistrict !== "ALL" || selectedStatus !== "ALL" || selectedPriority !== "ALL" || searchTerm) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400">Active Filters:</span>
            {selectedDistrict !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                District: {selectedDistrict}
                <button onClick={() => setSelectedDistrict("ALL")} className="hover:text-blue-900">×</button>
              </span>
            )}
            {selectedStatus !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Status: {selectedStatus}
                <button onClick={() => setSelectedStatus("ALL")} className="hover:text-indigo-900">×</button>
              </span>
            )}
            {selectedPriority !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Priority: {selectedPriority}
                <button onClick={() => setSelectedPriority("ALL")} className="hover:text-amber-900">×</button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Search: &quot;{searchTerm}&quot;
                <button onClick={() => setSearchTerm("")} className="hover:text-slate-900">×</button>
              </span>
            )}
            <button
              onClick={() => {
                setSelectedDistrict("ALL");
                setSelectedStatus("ALL");
                setSelectedPriority("ALL");
                setSearchTerm("");
              }}
              className="text-xs text-rose-600 hover:underline ml-auto"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Inspections Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Inspection ID</th>
                <th className="py-3 px-4">Project & NGO</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Inspector</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Due / Done</th>
                <th className="py-3 px-4 text-center">Evidence</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {paginatedInspections.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <FileCheck className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="text-base font-medium text-slate-600 dark:text-slate-300">No inspections found</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing your filters or changing search keywords</p>
                  </td>
                </tr>
              ) : (
                paginatedInspections.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {item.inspectionId}
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" /> {item.assignedDate}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-medium text-slate-900 dark:text-white truncate" title={item.projectName}>
                        {item.projectName}
                      </p>
                      <p className="text-xs text-slate-400 truncate" title={item.ngoName}>
                        {item.ngoName}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {item.district}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-100">{item.inspectorName}</p>
                      <span className="text-[10px] font-mono text-slate-400">{item.inspectorBadge}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                          item.priority === "CRITICAL"
                            ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                            : item.priority === "HIGH"
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                          item.status === "COMPLETED"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                            : item.status === "SCHEDULED"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : item.status === "FLAGGED"
                            ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300"
                            : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                        }`}
                      >
                        {item.status === "COMPLETED" && <CheckCircle2 className="w-3 h-3" />}
                        {item.status === "SCHEDULED" && <Clock className="w-3 h-3" />}
                        {item.status === "FLAGGED" && <AlertTriangle className="w-3 h-3" />}
                        {item.status === "OVERDUE" && <Clock className="w-3 h-3" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {item.completedDate ? (
                        <div>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Done: {item.completedDate}</span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-slate-600 dark:text-slate-400">Due: {item.dueDate}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.photoEvidenceCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          <Camera className="w-3 h-3 text-blue-500" />
                          {item.photoEvidenceCount} photos
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.scorePercent > 0 ? (
                        <span
                          className={`font-semibold text-xs ${
                            item.scorePercent >= 85
                              ? "text-emerald-600 dark:text-emerald-400"
                              : item.scorePercent >= 70
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {item.scorePercent}%
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedInspection(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 gap-2">
          <div>
            Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{filteredInspections.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{Math.min(currentPage * pageSize, filteredInspections.length)}</span> of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{filteredInspections.length}</span> inspections
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                  currentPage === idx + 1
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Inspection Detail Modal */}
      {selectedInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      PMU Inspection Dossier
                    </h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {selectedInspection.inspectionId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Government of Maharashtra • Directorate of Social Justice</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInspection(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              {/* Project Card in Modal */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Target Project</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {selectedInspection.district} District
                  </span>
                </div>
                <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                  {selectedInspection.projectName}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Operated by: <span className="font-medium">{selectedInspection.ngoName}</span>
                </p>
              </div>

              {/* Grid: Inspector & Audit Credentials */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-xs text-slate-400 block">Assigned Inspector</span>
                  <span className="font-medium text-slate-900 dark:text-white mt-1 block">
                    {selectedInspection.inspectorName}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{selectedInspection.inspectorBadge}</span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-xs text-slate-400 block">Audit Status</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block">
                    {selectedInspection.status}
                  </span>
                  <span className="text-[11px] text-slate-500">Priority: {selectedInspection.priority}</span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-xs text-slate-400 block">Quality Score</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">
                    {selectedInspection.scorePercent > 0 ? `${selectedInspection.scorePercent}%` : "Pending"}
                  </span>
                  <span className="text-[11px] text-slate-500">Benchmark: 80%</span>
                </div>
              </div>

              {/* Geo-tagging & GPS Verification */}
              <div className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-900/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-semibold text-xs">
                    <MapPin className="w-4 h-4" />
                    <span>GIS Geo-Fencing Verification</span>
                  </div>
                  {selectedInspection.geoVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" /> Geofence Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                      <AlertTriangle className="w-3 h-3" /> Coordinate Variance
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Audit tablet GPS fix within <span className="font-semibold text-slate-900 dark:text-white">{selectedInspection.geoDistanceMeters} meters</span> of registered project coordinates.
                  Tamper-proof satellite coordinate verification timestamped during physical visit.
                </p>
              </div>

              {/* Observation Summary */}
              <div>
                <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Auditor Field Observations
                </h5>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedInspection.observationSummary}
                </div>
              </div>

              {/* Photographic Evidence Summary */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Geotagged Photographic Proof ({selectedInspection.photoEvidenceCount} Uploads)
                  </h5>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Encrypted Storage</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {Array.from({ length: Math.min(4, selectedInspection.photoEvidenceCount || 3) }).map((_, idx) => (
                    <div
                      key={idx}
                      className="aspect-video rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-2 text-center text-slate-500"
                    >
                      <Camera className="w-5 h-5 mb-1 text-slate-400" />
                      <span className="text-[10px] font-mono">IMG_GEO_0{idx + 1}.jpg</span>
                      <span className="text-[9px] text-slate-400">2.4 MB • GPS Stamp</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Official DoSJE PMU Audit Record
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedInspection(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleExportCSV();
                    setSelectedInspection(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Audit Packet</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
