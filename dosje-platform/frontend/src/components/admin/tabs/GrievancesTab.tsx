"use client";

import React, { useState } from "react";
import { MessageSquareWarning, Search } from "lucide-react";
import { MOCK_GRIEVANCES } from "@/mock/adminMockData";
import { Grievance } from "@/types/admin";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/hooks/useToast";

export const GrievancesTab: React.FC = () => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [resolutionText, setResolutionText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const filtered = MOCK_GRIEVANCES.filter((g) => {
    const matchesSearch =
      g.grievanceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleResolve = () => {
    if (!selectedGrievance) return;
    showToast({
      type: "success",
      title: "Grievance Updated",
      message: `Ticket ${selectedGrievance.grievanceId} marked resolved with official directive dispatched.`,
    });
    setSelectedGrievance(null);
    setResolutionText("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquareWarning className="w-5 h-5 text-[#0F4C81] dark:text-blue-400" />
            Citizen Grievance & Whistleblower Redressal Desk
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time intake from CPGRAMS, citizen helpline, and direct beneficiary lodging with strict 48-hour SLA resolution.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <Card className="p-4 border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search grievance ID, citizen, project, category..."
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
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="ALL">All Ticket Statuses</option>
              <option value="OPEN">Open (Action Pending)</option>
              <option value="IN_PROGRESS">In Progress / Investigation</option>
              <option value="RESOLVED">Resolved / Redressed</option>
              <option value="ESCALATED">Escalated to Vigilance</option>
            </select>
          </div>

          <div className="flex items-center justify-end text-xs text-slate-500">
            <span>Filtered: <strong>{filtered.length}</strong> Grievance Tickets</span>
          </div>
        </div>
      </Card>

      {/* Grievances Table */}
      <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Grievance ID</th>
                <th className="py-3 px-3">Citizen Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Project / Centre</th>
                <th className="py-3 px-3 text-center">Priority</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3">Assigned Authority</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {paginated.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {g.grievanceId}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    {g.beneficiaryName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    {g.category}
                  </td>
                  <td className="py-2.5 px-3 max-w-[180px] truncate text-slate-600 dark:text-slate-400">
                    {g.projectName}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Badge
                      variant={
                        g.priority === "CRITICAL"
                          ? "danger"
                          : g.priority === "HIGH"
                          ? "warning"
                          : "primary"
                      }
                      size="sm"
                    >
                      {g.priority}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        g.status === "RESOLVED"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          : g.status === "ESCALATED"
                          ? "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                      }`}
                    >
                      {g.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 text-[11px]">
                    {g.assignedAuthority}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs px-2.5 py-1"
                      onClick={() => setSelectedGrievance(g)}
                    >
                      Inspect / Redress
                    </Button>
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
            {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} tickets
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

      {/* Grievance Action Modal */}
      {selectedGrievance && (
        <Modal
          isOpen={!!selectedGrievance}
          onClose={() => setSelectedGrievance(null)}
          title={`Grievance File: ${selectedGrievance.grievanceId}`}
          description={`Filed by ${selectedGrievance.beneficiaryName} on ${selectedGrievance.filingDate}`}
          footer={
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedGrievance(null)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleResolve}>
                Record Redressal & Close Ticket
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 space-y-1.5">
              <div><strong className="text-slate-400">Category:</strong> {selectedGrievance.category}</div>
              <div><strong className="text-slate-400">Target Facility:</strong> {selectedGrievance.projectName}</div>
              <div><strong className="text-slate-400">Contact:</strong> {selectedGrievance.beneficiaryContact}</div>
              <div><strong className="text-slate-400">SLA Resolution Deadline:</strong> <span className="font-mono text-rose-500">{selectedGrievance.slaDeadline}</span></div>
            </div>

            <div>
              <strong className="text-slate-900 dark:text-white block mb-1">Citizen Statement:</strong>
              <p className="p-3 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedGrievance.description}
              </p>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Official Redressal Observation / Action Taken:
              </label>
              <textarea
                rows={3}
                placeholder="Enter nodal resolution remarks, sanction order references, or inspector directives..."
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                className="w-full p-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
