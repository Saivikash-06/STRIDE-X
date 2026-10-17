"use client";

import React, { useState } from "react";
import { ClipboardCheck, Search, MapPin, Camera } from "lucide-react";
import { MOCK_INSPECTIONS } from "@/mock/adminMockData";
import { Inspection } from "@/types/admin";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export const InspectionsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);

  const filtered = MOCK_INSPECTIONS.filter((i) => {
    const matchesSearch =
      i.inspectionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.inspectorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-[#0F4C81] dark:text-blue-400" />
            PMU Field Inspection & Geo-Tagged Audit Roster
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tamper-proof physical audit reports authenticated via live GPS geo-fencing within 15 meters of facility coordinates.
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
              placeholder="Search audit ID, project, inspector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/25"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="ALL">All Inspection Statuses</option>
              <option value="COMPLETED">Completed Audits</option>
              <option value="SCHEDULED">Scheduled / In-Flight</option>
              <option value="FLAGGED">Flagged / Deficiencies</option>
              <option value="OVERDUE">Overdue Audits</option>
            </select>
          </div>

          <div className="flex items-center justify-end text-xs text-slate-500">
            <span>Showing: <strong>{filtered.length}</strong> Audit Cases</span>
          </div>
        </div>
      </Card>

      {/* Inspections Table */}
      <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Audit ID</th>
                <th className="py-3 px-3">Target Facility</th>
                <th className="py-3 px-3">Designated PMU Auditor</th>
                <th className="py-3 px-3">Scheduled / Completed</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Geo-Fenced</th>
                <th className="py-3 px-3 text-center">Audit Score</th>
                <th className="py-3 px-3 text-center">Photo Evidence</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {item.inspectionId}
                  </td>
                  <td className="py-2.5 px-3 max-w-[200px]">
                    <div className="font-bold text-slate-900 dark:text-white truncate">
                      {item.projectName}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {item.district}, {item.state}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    <div>{item.inspectorName}</div>
                    <span className="text-[10px] font-mono text-slate-400">{item.inspectorBadge}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    {item.completedDate || item.scheduledDate}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === "COMPLETED"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          : item.status === "FLAGGED"
                          ? "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300"
                          : item.status === "OVERDUE"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-blue-100 text-[#0F4C81]"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.geoVerified ? (
                      <span className="text-emerald-600 font-bold text-[11px] flex items-center justify-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> ±{item.geoDistanceMeters}m
                      </span>
                    ) : (
                      <span className="text-rose-500 font-bold text-[11px]">Divergent</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold">
                    {item.scorePercent > 0 ? `${item.scorePercent}%` : "—"}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 font-mono text-xs text-slate-600 dark:text-slate-400">
                      <Camera className="w-3.5 h-3.5" /> {item.photoEvidenceCount} Files
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs px-2.5 py-1"
                      onClick={() => setSelectedInspection(item)}
                    >
                      Audit File
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Inspection Modal */}
      {selectedInspection && (
        <Modal
          isOpen={!!selectedInspection}
          onClose={() => setSelectedInspection(null)}
          title={`Audit Dossier: ${selectedInspection.inspectionId}`}
          description={`${selectedInspection.projectName} • Inspected by ${selectedInspection.inspectorName}`}
          footer={
            <Button size="sm" variant="primary" onClick={() => setSelectedInspection(null)}>
              Close Dossier
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div>
                <span className="text-slate-400 block">Status:</span>
                <strong className="text-slate-800 dark:text-slate-200">{selectedInspection.status}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Score:</span>
                <strong className="font-mono text-emerald-600">{selectedInspection.scorePercent}% Quality Benchmark</strong>
              </div>
              <div>
                <span className="text-slate-400 block">GPS Tolerance:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">Verified within {selectedInspection.geoDistanceMeters}m</span>
              </div>
              <div>
                <span className="text-slate-400 block">Defects Flagged:</span>
                <strong className="font-mono text-rose-600">{selectedInspection.criticalDefectsCount} Critical Defects</strong>
              </div>
            </div>

            <div>
              <strong className="text-slate-900 dark:text-white block mb-1">Auditor Observation Findings:</strong>
              <p className="p-3 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedInspection.observationSummary}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
