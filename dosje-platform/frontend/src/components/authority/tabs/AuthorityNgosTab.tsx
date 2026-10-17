"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  ShieldCheck,
  FileText,
  Search,
  X,
} from "lucide-react";
import { AuthorityNgo } from "@/types/authority";
import { MOCK_AUTHORITY_NGOS, AUTHORITY_DISTRICTS } from "@/mock/authorityMockData";
import { Button } from "@/components/ui/Button";

export const AuthorityNgosTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [selectedNgoForDocs, setSelectedNgoForDocs] = useState<AuthorityNgo | null>(null);

  const filteredNgos = MOCK_AUTHORITY_NGOS.filter((ngo) => {
    if (districtFilter !== "ALL" && ngo.district !== districtFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ngo.name.toLowerCase().includes(q) ||
        ngo.darpanId.toLowerCase().includes(q) ||
        ngo.contactPerson.toLowerCase().includes(q) ||
        ngo.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            Empaneled Grantee NGOs & Implementing Institutes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            NITI Aayog Darpan registered agencies executing DoSJE welfare schemes in Maharashtra.
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search NGO Name, Darpan ID, Contact Person..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#0F4C81]"
          />
        </div>

        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
        >
          <option value="ALL">All 5 Districts</option>
          {AUTHORITY_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* NGO Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNgos.map((ngo) => {
          const isVerified = ngo.complianceStatus === "VERIFIED";
          const isNotice = ngo.complianceStatus === "NOTICE_SERVED";

          return (
            <div
              key={ngo.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-[#0F4C81]/50 dark:hover:border-blue-500/50 transition-all text-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0F4C81]/10 dark:bg-blue-900/30 text-[#0F4C81] dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {ngo.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-slate-500 text-[11px] font-mono">
                      <span>{ngo.darpanId}</span>
                      <span>•</span>
                      <span>{ngo.district}, Maharashtra</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isVerified
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                      : isNotice
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300"
                  }`}
                >
                  {ngo.complianceStatus}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Projects</span>
                  <div className="text-sm font-black font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                    {ngo.activeProjects}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Beneficiaries</span>
                  <div className="text-sm font-black font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                    {ngo.totalBeneficiaries}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Staff Count</span>
                  <div className="text-sm font-black font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                    {ngo.staffCount}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Audit Score</span>
                  <div className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {ngo.inspectionScore}%
                  </div>
                </div>
              </div>

              {/* Contact and Audit */}
              <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> Secretary / Nodal:
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {ngo.contactPerson} ({ngo.phone})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Physical Audit:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{ngo.lastAuditDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => setSelectedNgoForDocs(ngo)}
                  leftIcon={<FileText className="w-3.5 h-3.5 text-[#0F4C81]" />}
                >
                  View Documents ({ngo.documents.length})
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  className="flex-1 text-xs bg-[#0F4C81]"
                  onClick={() => alert(`Issued official inquiry memo to ${ngo.name}`)}
                  leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                >
                  Action Dossier
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Documents Modal */}
      {selectedNgoForDocs && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-5 text-xs space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {selectedNgoForDocs.name}
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  {selectedNgoForDocs.darpanId} • Verified Documentation Vault
                </span>
              </div>
              <button
                onClick={() => setSelectedNgoForDocs(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {selectedNgoForDocs.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#0F4C81]" />
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {doc.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {doc.type} • Uploaded on {doc.date}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.verified
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {doc.verified ? "VERIFIED" : "PENDING AUDIT"}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setSelectedNgoForDocs(null)}>
                Close Vault
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
