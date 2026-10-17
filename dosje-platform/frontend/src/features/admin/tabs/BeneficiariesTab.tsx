"use client";

import React, { useState } from "react";
import { Users, Search, CheckCircle2, AlertCircle, Download } from "lucide-react";
import { MOCK_BENEFICIARIES } from "@/mock/adminMockData";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";

export const BeneficiariesTab: React.FC = () => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 12;

  const filtered = MOCK_BENEFICIARIES.filter((b) => {
    const matchesSearch =
      b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.beneficiaryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExport = () => {
    showToast({
      type: "success",
      title: "Beneficiary Roll Exported",
      message: `Exported ${filtered.length} beneficiary records for DBT reconciliation.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0F4C81] dark:text-blue-400" />
            National Welfare Beneficiary Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Aadhaar e-KYC authenticated direct entitlement recipients mapped to approved facilities.
          </p>
        </div>

        <Button size="sm" variant="outline" onClick={handleExport} leftIcon={<Download className="w-4 h-4" />}>
          Export Beneficiary Roll
        </Button>
      </div>

      {/* Filter and Search */}
      <Card className="p-4 border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search beneficiary ID, name, district..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/25"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="ALL">All Statutory Categories</option>
              <option value="SC">Scheduled Caste (SC)</option>
              <option value="OBC">Other Backward Classes (OBC)</option>
              <option value="Senior Citizen">Senior Citizen (60+)</option>
              <option value="Divyangjan (PwD)">Divyangjan (Persons with Disabilities)</option>
              <option value="Transgender">Transgender Community</option>
              <option value="Safai Karamchari">Safai Karamchari</option>
            </select>
          </div>

          <div className="flex items-center justify-end text-xs text-slate-500">
            <span>Total Filtered: <strong>{filtered.length}</strong> Citizens</span>
          </div>
        </div>
      </Card>

      {/* Beneficiaries Table */}
      <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Beneficiary ID</th>
                <th className="py-3 px-3">Citizen Name</th>
                <th className="py-3 px-3">Gender / Age</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">Aadhaar e-KYC</th>
                <th className="py-3 px-3 text-center">DBT Account</th>
                <th className="py-3 px-3">Mapped Facility</th>
                <th className="py-3 px-3 text-right">Disbursed (₹)</th>
                <th className="py-3 px-3 text-center">Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {paginated.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {b.beneficiaryId}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    {b.fullName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {b.gender} • {b.age} yrs
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {b.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {b.aadhaarVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                        <AlertCircle className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {b.dbtAccountLinked ? (
                      <span className="text-[11px] font-mono text-emerald-600 font-bold">LINKED</span>
                    ) : (
                      <span className="text-[11px] font-mono text-rose-500 font-bold">UNLINKED</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 max-w-[180px] truncate text-slate-600 dark:text-slate-400">
                    {b.projectName}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                    ₹{b.disbursedAmount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-semibold text-emerald-600">
                    {b.attendanceRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} citizens
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
    </div>
  );
};
