"use client";

import React, { useState } from "react";
import {
  FolderKanban,
  Search,
  Download,
  Eye,
  ArrowUpDown,
} from "lucide-react";
import { MOCK_PROJECTS } from "@/mock/adminMockData";
import { Project } from "@/types/admin";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/hooks/useToast";

interface ProjectsTabProps {
  selectedProject?: Project | null;
  onClearSelectedProject?: () => void;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({
  selectedProject: initialProject,
  onClearSelectedProject,
}) => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"name" | "riskScore" | "beneficiariesCount" | "sanctionedGrantLakhs">("riskScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingProject, setViewingProject] = useState<Project | null>(initialProject || null);

  const handleCloseModal = () => {
    setViewingProject(null);
    onClearSelectedProject?.();
  };

  const pageSize = 8;

  // Filter logic
  const filtered = MOCK_PROJECTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ngoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesState = stateFilter === "ALL" || p.state === stateFilter;
    const matchesRisk = riskFilter === "ALL" || p.riskLevel === riskFilter;

    return matchesSearch && matchesState && matchesRisk;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else {
      comparison = (a[sortBy] as number) - (b[sortBy] as number);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExport = () => {
    showToast({
      type: "success",
      title: "Data Export Generated",
      message: `Exported ${sorted.length} project records in CSV / National MIS format.`,
    });
  };

  const states = Array.from(new Set(MOCK_PROJECTS.map((p) => p.state))).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-[#0F4C81] dark:text-blue-400" />
            Welfare Facilities & Project Master Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time compliance, risk metrics, and inspection status for 25 registered projects.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleExport}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export Master Table (CSV)
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search code, project, NGO, district..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/25"
            />
          </div>

          {/* State Filter */}
          <div>
            <select
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/25"
            >
              <option value="ALL">All States / UTs</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <select
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/25"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">High Risk Only</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "riskScore" | "beneficiariesCount" | "sanctionedGrantLakhs")}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="riskScore">Sort by Risk Score</option>
              <option value="beneficiariesCount">Sort by Beneficiaries</option>
              <option value="sanctionedGrantLakhs">Sort by Grant Size</option>
              <option value="name">Sort by Name</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Projects Table */}
      <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Project Code</th>
                <th className="py-3 px-3">Project Name & Scheme</th>
                <th className="py-3 px-3">Grantee NGO</th>
                <th className="py-3 px-3">State / District</th>
                <th className="py-3 px-3 text-right">Beneficiaries</th>
                <th className="py-3 px-3 text-center">AI Risk</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Inspection</th>
                <th className="py-3 px-3 text-center">Compliance</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {paginated.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {project.projectCode}
                  </td>
                  <td className="py-3 px-3 max-w-[220px]">
                    <div className="font-bold text-slate-900 dark:text-white truncate">
                      {project.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {project.schemeName}
                    </div>
                  </td>
                  <td className="py-3 px-3 max-w-[160px] truncate text-slate-700 dark:text-slate-300">
                    {project.ngoName}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {project.district}, {project.state}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold">
                    {project.beneficiariesCount}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge
                      variant={
                        project.riskLevel === "HIGH"
                          ? "danger"
                          : project.riskLevel === "MEDIUM"
                          ? "warning"
                          : "success"
                      }
                      size="sm"
                      dot
                    >
                      {project.riskScore}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        project.status === "ACTIVE"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          : project.status === "UNDER_REVIEW"
                          ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                          : "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-[10px] font-semibold ${
                        project.inspectionStatus === "COMPLETED"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : project.inspectionStatus === "FLAGGED"
                          ? "text-rose-600 dark:text-rose-400 font-bold"
                          : "text-amber-600"
                      }`}
                    >
                      {project.inspectionStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge
                      variant={
                        project.complianceStatus === "COMPLIANT"
                          ? "success"
                          : project.complianceStatus === "NON_COMPLIANT"
                          ? "danger"
                          : "warning"
                      }
                      size="sm"
                    >
                      {project.complianceStatus}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => setViewingProject(project)}
                      className="p-1 rounded text-slate-500 hover:text-[#0F4C81] dark:hover:text-blue-400"
                      title="View Full Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} projects
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="px-2 font-mono font-semibold">
              {currentPage} / {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Project Details Modal */}
      {viewingProject && (
        <Modal
          isOpen={!!viewingProject}
          onClose={handleCloseModal}
          title={`Facility File: ${viewingProject.projectCode}`}
          description={viewingProject.name}
          maxWidth="lg"
          footer={
            <Button size="sm" variant="primary" onClick={handleCloseModal}>
              Done Reviewing
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div>
                <span className="text-slate-400 block">Scheme:</span>
                <strong className="text-slate-800 dark:text-slate-200">{viewingProject.schemeName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Grantee NGO:</span>
                <strong className="text-slate-800 dark:text-slate-200">{viewingProject.ngoName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Location:</span>
                <span className="text-slate-800 dark:text-slate-200">
                  {viewingProject.district}, {viewingProject.state}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">GPS Coordinates:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  {viewingProject.coordinates.lat.toFixed(4)}, {viewingProject.coordinates.lng.toFixed(4)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Sanctioned Grant:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  ₹{viewingProject.sanctionedGrantLakhs} Lakhs
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Utilized:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  ₹{viewingProject.utilizedGrantLakhs} Lakhs
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700/80 space-y-2">
              <h5 className="font-bold text-slate-900 dark:text-white">Facility Hardware & Telemetry Status</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${viewingProject.cctvOnline ? "bg-emerald-500" : "bg-rose-500"}`} />
                  <span>CCTV Live Feed: {viewingProject.cctvOnline ? "Online (Stream Active)" : "Camera Offline"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${viewingProject.biometricActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                  <span>Biometric Device: {viewingProject.biometricActive ? "Active Daily Punch" : "Telemetry Inactive"}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block">Facility Physical Address:</span>
              <p className="text-slate-700 dark:text-slate-300 mt-0.5">{viewingProject.address}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
