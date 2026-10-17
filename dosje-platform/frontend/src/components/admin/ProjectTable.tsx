"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  FileText,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { MOCK_PROJECTS, MOCK_SCHEMES } from "@/mock/adminMockData";
import { Project, RiskLevel, ComplianceStatus, InspectionStatus, AdminTab } from "@/types/admin";

interface ProjectTableProps {
  onSelectProject?: (project: Project) => void;
  onSelectTab?: (tab: AdminTab) => void;
  className?: string;
}

export const ProjectTable: React.FC<ProjectTableProps> = ({
  onSelectProject,
  onSelectTab: _onSelectTab,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [schemeFilter, setSchemeFilter] = useState("ALL");
  const [stateFilter, setStateFilter] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "ALL">("ALL");
  const [complianceFilter, setComplianceFilter] = useState<ComplianceStatus | "ALL">("ALL");
  const [inspectionFilter, setInspectionFilter] = useState<InspectionStatus | "ALL">("ALL");

  // Sorting
  const [sortField, setSortField] = useState<keyof Project>("name");
  const [sortAsc, setSortAsc] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal View Project
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Unique States list for filter
  const stateOptions = useMemo(() => {
    const states = Array.from(new Set(MOCK_PROJECTS.map((p) => p.state))).sort();
    return states;
  }, []);

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.projectCode.toLowerCase().includes(q) ||
          p.ngoName.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Scheme
      if (schemeFilter !== "ALL" && p.schemeId !== schemeFilter) return false;

      // State
      if (stateFilter !== "ALL" && p.state !== stateFilter) return false;

      // Risk
      if (riskFilter !== "ALL" && p.riskLevel !== riskFilter) return false;

      // Compliance
      if (complianceFilter !== "ALL" && p.complianceStatus !== complianceFilter) return false;

      // Inspection
      if (inspectionFilter !== "ALL" && p.inspectionStatus !== inspectionFilter) return false;

      return true;
    }).sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === "string") {
        return sortAsc
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }
      if (typeof aVal === "number") {
        return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
      }
      return 0;
    });
  }, [searchQuery, schemeFilter, stateFilter, riskFilter, complianceFilter, inspectionFilter, sortField, sortAsc]);

  // Pagination slice
  const totalPages = Math.ceil(filteredProjects.length / pageSize) || 1;
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: keyof Project) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Project Code",
      "Project Name",
      "Scheme",
      "NGO Name",
      "State",
      "District",
      "Risk Level",
      "Risk Score",
      "Inspection Status",
      "Compliance Status",
      "Beneficiaries",
      "Sanctioned (₹ Lakhs)",
      "Released (₹ Lakhs)",
      "Utilized (₹ Lakhs)",
    ];

    const rows = filteredProjects.map((p) => [
      `"${p.projectCode}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.schemeName}"`,
      `"${p.ngoName.replace(/"/g, '""')}"`,
      `"${p.state}"`,
      `"${p.district}"`,
      `"${p.riskLevel}"`,
      p.riskScore,
      `"${p.inspectionStatus}"`,
      `"${p.complianceStatus}"`,
      p.beneficiariesCount,
      p.sanctionedGrantLakhs,
      p.releasedGrantLakhs,
      p.utilizedGrantLakhs,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `STRIDE_X_Projects_Master_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Export PDF / Print view
  const handleExportPDF = () => {
    window.print();
  };

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case "HIGH":
        return <Badge variant="danger" size="sm">HIGH RISK</Badge>;
      case "MEDIUM":
        return <Badge variant="warning" size="sm">MED RISK</Badge>;
      case "LOW":
        return <Badge variant="success" size="sm">LOW RISK</Badge>;
      default:
        return null;
    }
  };

  const getComplianceBadge = (status: ComplianceStatus) => {
    switch (status) {
      case "COMPLIANT":
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="w-3 h-3" /> Compliant</span>;
      case "NON_COMPLIANT":
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400"><ShieldAlert className="w-3 h-3" /> Non-Compliant</span>;
      case "PENDING_UC":
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400"><AlertCircle className="w-3 h-3" /> Pending UC</span>;
      case "UNDER_AUDIT":
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400"><AlertCircle className="w-3 h-3" /> Under Audit</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Controls: Search, Filters, CSV/PDF Export */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Welfare Projects Master Monitoring Table
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive registry of sanctioned welfare facilities, compliance status, and PMU audit tracks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportCSV}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export CSV
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportPDF}
              leftIcon={<FileText className="w-3.5 h-3.5" />}
            >
              Print / PDF
            </Button>
          </div>
        </div>

        {/* Search & Filter Dropdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by code, facility, NGO, district..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Scheme Filter */}
          <select
            value={schemeFilter}
            onChange={(e) => {
              setSchemeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="ALL">All Schemes</option>
            {MOCK_SCHEMES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code}
              </option>
            ))}
          </select>

          {/* State Filter */}
          <select
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="ALL">All States</option>
            {stateOptions.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value as RiskLevel | "ALL");
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>

          {/* Compliance Filter */}
          <select
            value={complianceFilter}
            onChange={(e) => {
              setComplianceFilter(e.target.value as ComplianceStatus | "ALL");
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="ALL">All Compliance</option>
            <option value="COMPLIANT">Compliant</option>
            <option value="NON_COMPLIANT">Non-Compliant</option>
            <option value="PENDING_UC">Pending UC</option>
            <option value="UNDER_AUDIT">Under Audit</option>
          </select>

          {/* Inspection Filter */}
          <select
            value={inspectionFilter}
            onChange={(e) => {
              setInspectionFilter(e.target.value as InspectionStatus | "ALL");
              setCurrentPage(1);
            }}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="ALL">All Inspections</option>
            <option value="COMPLETED">Completed</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="OVERDUE">Overdue</option>
            <option value="FLAGGED">Flagged</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                <th
                  onClick={() => handleSort("projectCode")}
                  className="py-3 px-3.5 cursor-pointer hover:text-blue-600 select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Project ID</span>
                    {sortField === "projectCode" && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("name")}
                  className="py-3 px-3.5 cursor-pointer hover:text-blue-600 select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Project Name</span>
                    {sortField === "name" && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="py-3 px-3.5 whitespace-nowrap">Scheme</th>
                <th className="py-3 px-3.5 whitespace-nowrap">NGO / Agency</th>
                <th className="py-3 px-3.5 whitespace-nowrap">State & District</th>
                <th
                  onClick={() => handleSort("riskScore")}
                  className="py-3 px-3.5 cursor-pointer hover:text-blue-600 select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Risk Level</span>
                    {sortField === "riskScore" && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="py-3 px-3.5 whitespace-nowrap">Inspection</th>
                <th className="py-3 px-3.5 whitespace-nowrap">Compliance</th>
                <th
                  onClick={() => handleSort("beneficiariesCount")}
                  className="py-3 px-3.5 cursor-pointer hover:text-blue-600 select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Beneficiaries</span>
                    {sortField === "beneficiariesCount" && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="py-3 px-3.5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <p className="font-semibold text-sm">No projects matching your search & filters</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting filters to view all projects.</p>
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="py-3 px-3.5 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {project.projectCode}
                    </td>
                    <td className="py-3 px-3.5 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                      {project.name}
                    </td>
                    <td className="py-3 px-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold text-[10px]">
                        {project.schemeName}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {project.ngoName}
                    </td>
                    <td className="py-3 px-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {project.district}, {project.state}
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      {getRiskBadge(project.riskLevel)}
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        project.inspectionStatus === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : project.inspectionStatus === "OVERDUE"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      }`}>
                        {project.inspectionStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      {getComplianceBadge(project.complianceStatus)}
                    </td>
                    <td className="py-3 px-3.5 font-mono font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {project.beneficiariesCount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSelectProject?.(project)}
                          className="p-1 rounded text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Locate on Map"
                        >
                          <MapPin className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>
              Showing {filteredProjects.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredProjects.length)} of {filteredProjects.length} projects
            </span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>per page</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-semibold text-slate-900 dark:text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: View Project Dossier */}
      {selectedProject && (
        <Modal
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          title={`Facility Dossier: ${selectedProject.name}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="font-mono text-slate-400 block text-[10px]">
                  {selectedProject.projectCode}
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {selectedProject.name}
                </span>
              </div>
              {getRiskBadge(selectedProject.riskLevel)}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Scheme</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedProject.schemeName}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Grantee NGO</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedProject.ngoName}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Location</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedProject.district}, {selectedProject.state}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Beneficiaries</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {selectedProject.beneficiariesCount} Registered
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Public Financial Management System (PFMS) Grants
              </span>
              <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[9px]">Sanctioned</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    ₹{selectedProject.sanctionedGrantLakhs}L
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">Released</span>
                  <span className="font-bold text-blue-600">
                    ₹{selectedProject.releasedGrantLakhs}L
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">Utilized</span>
                  <span className="font-bold text-emerald-600">
                    ₹{selectedProject.utilizedGrantLakhs}L
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedProject(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (onSelectProject) onSelectProject(selectedProject);
                  setSelectedProject(null);
                }}
              >
                Inspect on GIS Map
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
