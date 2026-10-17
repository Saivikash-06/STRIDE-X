"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  AlertOctagon,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Send,
  X,
  Calendar,
} from "lucide-react";
import { AuthorityComplianceCase } from "@/types/authority";
import { MOCK_AUTHORITY_COMPLIANCE, AUTHORITY_DISTRICTS } from "@/mock/authorityMockData";

export default function AuthorityComplianceTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCase, setSelectedCase] = useState<AuthorityComplianceCase | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const pageSize = 8;

  // Filtered & Searched data
  const filteredCases = useMemo(() => {
    return MOCK_AUTHORITY_COMPLIANCE.filter((c) => {
      const matchesSearch =
        c.complianceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.ngoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.observation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.assignedOfficer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.district.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDistrict = selectedDistrict === "ALL" || c.district === selectedDistrict;
      const matchesSeverity = selectedSeverity === "ALL" || c.severity === selectedSeverity;
      const matchesStatus = selectedStatus === "ALL" || c.status === selectedStatus;

      return matchesSearch && matchesDistrict && matchesSeverity && matchesStatus;
    });
  }, [searchTerm, selectedDistrict, selectedSeverity, selectedStatus]);

  const totalPages = Math.ceil(filteredCases.length / pageSize) || 1;
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCases.slice(start, start + pageSize);
  }, [filteredCases, currentPage]);

  // Statistics
  const stats = useMemo(() => {
    const total = MOCK_AUTHORITY_COMPLIANCE.length;
    const openCases = MOCK_AUTHORITY_COMPLIANCE.filter((c) => c.status === "OPEN").length;
    const inProgress = MOCK_AUTHORITY_COMPLIANCE.filter((c) => c.status === "IN_PROGRESS").length;
    const rectified = MOCK_AUTHORITY_COMPLIANCE.filter((c) => c.status === "RECTIFIED").length;
    const critical = MOCK_AUTHORITY_COMPLIANCE.filter((c) => c.severity === "CRITICAL").length;

    return { total, openCases, inProgress, rectified, critical };
  }, []);

  const handleExportCSV = () => {
    const headers = [
      "Case ID",
      "Project Name",
      "NGO",
      "District",
      "Audit Type",
      "Observation",
      "Severity",
      "Deadline",
      "Status",
      "Assigned Officer",
      "Action Required",
    ];
    const rows = filteredCases.map((c) => [
      c.complianceId,
      `"${c.projectName.replace(/"/g, '""')}"`,
      `"${c.ngoName.replace(/"/g, '""')}"`,
      c.district,
      c.type,
      `"${c.observation.replace(/"/g, '""')}"`,
      c.severity,
      c.deadline,
      c.status,
      `"${c.assignedOfficer.replace(/"/g, '""')}"`,
      `"${c.actionRequired.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DoSJE_Compliance_Cases_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleIssueNotice = (caseCode: string) => {
    setActionSuccess(`Formal Statutory Notice issued under GFR 238 for case ${caseCode}. Dispatched to District Welfare Officer.`);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Notices</span>
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</span>
            <span className="text-xs text-blue-600 font-medium">10 Active Dossiers</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Across 5 Districts</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open / Pending</span>
            <AlertOctagon className="w-5 h-5 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600">{stats.openCases}</span>
            <span className="text-xs text-rose-600 font-medium">{stats.critical} Critical</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Action notice pending</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Corrective Action</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600">{stats.inProgress}</span>
            <span className="text-xs text-amber-600 font-medium">Under Review</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Rectification underway</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rectified / Cleared</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">{stats.rectified}</span>
            <span className="text-xs text-emerald-600 font-medium">{Math.round((stats.rectified / stats.total) * 100)}% resolved</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Full compliance restored</p>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-emerald-800 dark:text-emerald-200 text-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Control Bar: Search, Filters, CSV Export */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Case ID, Project, Observation, Officer, or District..."
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

            {/* Severity Filter */}
            <select
              value={selectedSeverity}
              onChange={(e) => {
                setSelectedSeverity(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MODERATE">Moderate</option>
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
              <option value="OPEN">Open Notice</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RECTIFIED">Rectified</option>
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
        {(selectedDistrict !== "ALL" || selectedSeverity !== "ALL" || selectedStatus !== "ALL" || searchTerm) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400">Active Filters:</span>
            {selectedDistrict !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                District: {selectedDistrict}
                <button onClick={() => setSelectedDistrict("ALL")} className="hover:text-blue-900">×</button>
              </span>
            )}
            {selectedSeverity !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                Severity: {selectedSeverity}
                <button onClick={() => setSelectedSeverity("ALL")} className="hover:text-rose-900">×</button>
              </span>
            )}
            {selectedStatus !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Status: {selectedStatus}
                <button onClick={() => setSelectedStatus("ALL")} className="hover:text-indigo-900">×</button>
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
                setSelectedSeverity("ALL");
                setSelectedStatus("ALL");
                setSearchTerm("");
              }}
              className="text-xs text-rose-600 hover:underline ml-auto"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Compliance Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Project & NGO</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Audit Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Officer In-Charge</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {paginatedCases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
                    <p className="text-base font-medium text-slate-600 dark:text-slate-300">No compliance defaults found</p>
                    <p className="text-xs text-slate-400 mt-1">All selected centers conform to statutory GFR and guideline requirements</p>
                  </td>
                </tr>
              ) : (
                paginatedCases.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {item.complianceId}
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
                      <span className="text-xs text-slate-600 dark:text-slate-300">{item.district}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                          item.severity === "CRITICAL"
                            ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                            : item.severity === "HIGH"
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        {item.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium">
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.deadline}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                          item.status === "RECTIFIED"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                            : item.status === "IN_PROGRESS"
                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                            : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300"
                        }`}
                      >
                        {item.status === "RECTIFIED" && <CheckCircle2 className="w-3 h-3" />}
                        {item.status === "IN_PROGRESS" && <Clock className="w-3 h-3" />}
                        {item.status === "OPEN" && <AlertTriangle className="w-3 h-3" />}
                        {item.status === "OPEN" ? "OPEN NOTICE" : item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate" title={item.assignedOfficer}>
                      {item.assignedOfficer}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedCase(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
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
            Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{filteredCases.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{Math.min(currentPage * pageSize, filteredCases.length)}</span> of{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{filteredCases.length}</span> compliance dossiers
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

      {/* Compliance Case Review Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Statutory Compliance Dossier
                    </h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      {selectedCase.complianceId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">DoSJE Statutory Vigilance & GFR 238(1) Enforcement</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              {/* Project Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Target Project & Entity</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {selectedCase.district} District
                  </span>
                </div>
                <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                  {selectedCase.projectName}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Implementing NGO: <span className="font-medium">{selectedCase.ngoName}</span>
                </p>
              </div>

              {/* Status & Deadline Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-xs text-slate-400 block">Severity Level</span>
                  <span
                    className={`font-semibold text-xs mt-1 inline-block ${
                      selectedCase.severity === "CRITICAL"
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {selectedCase.severity}
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-xs text-slate-400 block">Resolution Status</span>
                  <span className="font-semibold text-xs text-blue-600 dark:text-blue-400 mt-1 inline-block">
                    {selectedCase.status}
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-xs text-slate-400 block">Statutory Deadline</span>
                  <span className="font-semibold text-xs text-slate-900 dark:text-white mt-1 inline-block">
                    {selectedCase.deadline}
                  </span>
                </div>
              </div>

              {/* Observation Detail */}
              <div>
                <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Official Audit Observation
                </h5>
                <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/30 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedCase.observation}
                </div>
              </div>

              {/* Corrective Action Directive */}
              <div>
                <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Mandated Corrective Action
                </h5>
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedCase.actionRequired}
                </div>
              </div>

              {/* Supervisory Authority */}
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
                <span className="text-slate-500">Supervisory Officer:</span>
                <span className="font-medium text-slate-900 dark:text-white">{selectedCase.assignedOfficer}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Statutory Notice Authority: State Nodal Director
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleIssueNotice(selectedCase.complianceId);
                    setSelectedCase(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Issue Statutory Show Cause</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
