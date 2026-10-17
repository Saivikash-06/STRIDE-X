"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
} from "lucide-react";
import { AuthorityProject } from "@/types/authority";
import { MOCK_AUTHORITY_PROJECTS, AUTHORITY_DISTRICTS } from "@/mock/authorityMockData";
import { Button } from "@/components/ui/Button";

interface AuthorityProjectsTabProps {
  onSelectProject?: (project: AuthorityProject) => void;
  initialSelectedProject?: AuthorityProject | null;
}

export const AuthorityProjectsTab: React.FC<AuthorityProjectsTabProps> = ({
  onSelectProject,
  initialSelectedProject,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<AuthorityProject | null>(
    initialSelectedProject || null
  );

  const handleOpenProjectDetails = (p: AuthorityProject) => {
    setSelectedProjectForModal(p);
    onSelectProject?.(p);
  };

  const filteredProjects = useMemo(() => {
    return MOCK_AUTHORITY_PROJECTS.filter((p) => {
      if (districtFilter !== "ALL" && p.district !== districtFilter) return false;
      if (riskFilter !== "ALL" && p.riskLevel !== riskFilter) return false;
      if (statusFilter !== "ALL" && p.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.projectCode.toLowerCase().includes(q) ||
          p.ngoName.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.schemeName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, districtFilter, riskFilter, statusFilter]);

  const totalPages = Math.ceil(filteredProjects.length / pageSize) || 1;
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleExportCsv = () => {
    const headers = [
      "Project ID",
      "Project Code",
      "Project Name",
      "Scheme",
      "NGO Name",
      "District",
      "Beneficiaries",
      "Attendance Rate (%)",
      "Risk Level",
      "Risk Score",
      "Inspection Status",
      "Compliance Status",
      "Sanctioned (Lakhs)",
      "Released (Lakhs)",
      "Utilized (Lakhs)",
    ];
    const rows = filteredProjects.map((p) => [
      p.id,
      p.projectCode,
      `"${p.name}"`,
      `"${p.schemeName}"`,
      `"${p.ngoName}"`,
      p.district,
      p.beneficiariesCount,
      p.attendancePercent,
      p.riskLevel,
      p.riskScore,
      p.inspectionStatus,
      p.complianceStatus,
      p.sanctionedGrantLakhs,
      p.releasedGrantLakhs,
      p.utilizedGrantLakhs,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Maharashtra_Authority_Projects_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            Jurisdiction Welfare Projects Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitoring 15 sanctioned facilities across Pune, Nagpur, Thane, Nashik, and Sambhajinagar.
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={handleExportCsv}
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          Export CSV ({filteredProjects.length})
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search Project Code, Name, NGO, Scheme, District..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#0F4C81]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* District Filter */}
          <select
            value={districtFilter}
            onChange={(e) => {
              setDistrictFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="ALL">All 5 Districts</option>
            {AUTHORITY_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk 🔴</option>
            <option value="MEDIUM">Medium Risk 🟡</option>
            <option value="LOW">Low Risk 🟢</option>
          </select>

          {/* Operational Status */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10.5px] border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-3">Project ID</th>
              <th className="py-3 px-3">Project Name</th>
              <th className="py-3 px-3">Scheme</th>
              <th className="py-3 px-3">NGO</th>
              <th className="py-3 px-3">District</th>
              <th className="py-3 px-3 text-right">Beneficiaries</th>
              <th className="py-3 px-3 text-center">Attendance %</th>
              <th className="py-3 px-3 text-center">Risk Level</th>
              <th className="py-3 px-3 text-center">Inspection</th>
              <th className="py-3 px-3 text-center">Compliance</th>
              <th className="py-3 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedProjects.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-slate-400 font-medium">
                  No projects match the selected criteria.
                </td>
              </tr>
            ) : (
              paginatedProjects.map((p) => {
                const isHighRisk = p.riskLevel === "HIGH";
                const isMedium = p.riskLevel === "MEDIUM";
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {p.projectCode}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">
                      {p.name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 max-w-[130px] truncate">
                      {p.schemeName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 max-w-[150px] truncate">
                      {p.ngoName}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                      {p.district}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {p.beneficiariesCount}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                          p.attendancePercent < 60
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                            : p.attendancePercent < 80
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                      >
                        {p.attendancePercent}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isHighRisk
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300"
                            : isMedium
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                        }`}
                      >
                        {p.riskLevel} ({p.riskScore})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          p.inspectionStatus === "COMPLETED"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            : p.inspectionStatus === "FLAGGED"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold"
                            : "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                        }`}
                      >
                        {p.inspectionStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.complianceStatus === "COMPLIANT"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {p.complianceStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => handleOpenProjectDetails(p)}
                        className="px-2 py-1 rounded bg-[#0F4C81] text-white hover:bg-[#0c3c66] transition-colors text-[11px] font-semibold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
        <span>
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredProjects.length)} of {filteredProjects.length} projects
        </span>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>
          <span className="px-2 font-mono font-bold text-slate-700 dark:text-slate-300">
            {currentPage} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Project Details Modal Drawer */}
      {selectedProjectForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 text-xs max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-[#0F4C81] text-white">
                  {selectedProjectForModal.projectCode}
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                  {selectedProjectForModal.name}
                </h3>
                <p className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3 h-3 text-[#0F4C81]" />
                  {selectedProjectForModal.ngoName} • {selectedProjectForModal.district}, Maharashtra
                </p>
              </div>
              <button
                onClick={() => setSelectedProjectForModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Financials & Grant Utilization */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Sanctioned Grant</span>
                <p className="text-sm font-black font-mono text-slate-900 dark:text-white mt-0.5">
                  ₹{selectedProjectForModal.sanctionedGrantLakhs} Lakhs
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Released (PFMS)</span>
                <p className="text-sm font-black font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                  ₹{selectedProjectForModal.releasedGrantLakhs} Lakhs
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Utilized Grant</span>
                <p className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  ₹{selectedProjectForModal.utilizedGrantLakhs} Lakhs
                </p>
              </div>
            </div>

            {/* Telemetry Grid */}
            <div className="grid grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white">Facility Audit Status</span>
                <div className="flex justify-between">
                  <span>Inspection Status:</span>
                  <span className="font-bold">{selectedProjectForModal.inspectionStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Audit Date:</span>
                  <span className="font-mono">{selectedProjectForModal.lastInspectionDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Inspector:</span>
                  <span>{selectedProjectForModal.inspectorName}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white">Surveillance & Devices</span>
                <div className="flex justify-between">
                  <span>CCTV Live Feed:</span>
                  <span className={`font-bold ${selectedProjectForModal.cctvOnline ? "text-emerald-500" : "text-rose-500"}`}>
                    {selectedProjectForModal.cctvOnline ? "ONLINE (Active)" : "OFFLINE (Alert)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Biometric Machine:</span>
                  <span className="font-bold text-emerald-500">OPERATIONAL</span>
                </div>
                <div className="flex justify-between">
                  <span>Attendance Rate:</span>
                  <span className="font-mono font-bold">{selectedProjectForModal.attendancePercent}%</span>
                </div>
              </div>
            </div>

            {selectedProjectForModal.complianceObservation && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs">
                <strong>Compliance Citation:</strong> {selectedProjectForModal.complianceObservation}
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedProjectForModal(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
