"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { MOCK_AUTHORITY_BENEFICIARIES, AUTHORITY_DISTRICTS } from "@/mock/authorityMockData";
import { Button } from "@/components/ui/Button";

export const AuthorityBeneficiariesTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [verificationFilter, setVerificationFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  const filteredBeneficiaries = useMemo(() => {
    return MOCK_AUTHORITY_BENEFICIARIES.filter((b) => {
      if (districtFilter !== "ALL" && b.district !== districtFilter) return false;
      if (verificationFilter !== "ALL" && b.verificationStatus !== verificationFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.fullName.toLowerCase().includes(q) ||
          b.beneficiaryId.toLowerCase().includes(q) ||
          b.projectName.toLowerCase().includes(q) ||
          b.schemeName.toLowerCase().includes(q) ||
          b.district.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, districtFilter, verificationFilter]);

  const totalPages = Math.ceil(filteredBeneficiaries.length / pageSize) || 1;
  const paginatedBeneficiaries = filteredBeneficiaries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleExportCsv = () => {
    const headers = [
      "Beneficiary ID",
      "Full Name",
      "Gender",
      "Age",
      "Category",
      "Aadhaar Verified",
      "DBT Linked",
      "Scheme Name",
      "Project Name",
      "District",
      "Benefit Status",
      "Attendance Rate (%)",
      "Last Attendance",
      "Active Grievance",
      "Verification Status",
    ];

    const rows = filteredBeneficiaries.map((b) => [
      b.beneficiaryId,
      `"${b.fullName}"`,
      b.gender,
      b.age,
      b.category,
      b.aadhaarVerified ? "YES" : "NO",
      b.dbtAccountLinked ? "YES" : "NO",
      `"${b.schemeName}"`,
      `"${b.projectName}"`,
      b.district,
      b.benefitStatus,
      b.attendanceRate,
      b.lastAttendanceDate,
      b.hasActiveGrievance ? "YES" : "NO",
      b.verificationStatus,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Maharashtra_Beneficiaries_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            Beneficiary Registry & Direct Benefit Tracking
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Aadhaar verified beneficiaries receiving benefits across 15 projects in Maharashtra.
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={handleExportCsv}
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          Export CSV ({filteredBeneficiaries.length})
        </Button>
      </div>

      {/* Filter Row */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search Beneficiary Name, ID, Scheme, Project, District..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#0F4C81]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={districtFilter}
            onChange={(e) => {
              setDistrictFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="ALL">All Districts</option>
            {AUTHORITY_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={verificationFilter}
            onChange={(e) => {
              setVerificationFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="ALL">All Verification Statuses</option>
            <option value="VERIFIED">Verified (Aadhaar OK) 🟢</option>
            <option value="PENDING_AADHAAR">Pending Aadhaar 🟡</option>
            <option value="FLAGGED_DUPLICATE">Flagged Duplicate 🔴</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10.5px] border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-3">Beneficiary ID</th>
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Scheme</th>
              <th className="py-3 px-3">Project & District</th>
              <th className="py-3 px-3">Benefit Status</th>
              <th className="py-3 px-3 text-center">Attendance</th>
              <th className="py-3 px-3 text-center">Grievance</th>
              <th className="py-3 px-3 text-center">Verification Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedBeneficiaries.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                  {b.beneficiaryId}
                </td>
                <td className="py-2.5 px-3">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {b.fullName}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {b.gender} • {b.age} yrs • {b.category}
                  </div>
                </td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 max-w-[140px] truncate">
                  {b.schemeName}
                </td>
                <td className="py-2.5 px-3">
                  <div className="text-slate-800 dark:text-slate-200 font-medium max-w-[160px] truncate">
                    {b.projectName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold">{b.district}</div>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {b.benefitStatus}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center font-mono font-bold">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[11px] ${
                      b.attendanceRate < 60
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        : b.attendanceRate < 80
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}
                  >
                    {b.attendanceRate}%
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  {b.hasActiveGrievance ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      FLAGGED
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">None</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      b.verificationStatus === "VERIFIED"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : b.verificationStatus === "PENDING_AADHAAR"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                    }`}
                  >
                    {b.verificationStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
        <span>
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredBeneficiaries.length)} of {filteredBeneficiaries.length} beneficiaries
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
    </div>
  );
};
