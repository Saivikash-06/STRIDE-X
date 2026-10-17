"use client";

import React, { useState } from "react";
import { Building2, Search, ShieldCheck } from "lucide-react";
import { MOCK_NGOS } from "@/mock/adminMockData";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const NgosTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = MOCK_NGOS.filter(
    (n) =>
      n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.darpanId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#0F4C81] dark:text-blue-400" />
            Empaneled Grantee NGOs & Implementation Institutes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Registered implementing non-governmental organizations cross-verified with NITI Aayog NGO-Darpan.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by NGO name, Darpan ID, contact..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/25"
        />
      </div>

      {/* NGOs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((ngo) => (
          <Card
            key={ngo.id}
            hoverEffect
            className="p-5 border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] font-bold text-slate-500 block">
                    DARPAN ID: {ngo.darpanId}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {ngo.name}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {ngo.district}, {ngo.state} • Reg: {ngo.registrationNumber}
                  </span>
                </div>

                <Badge
                  variant={ngo.complianceScore > 85 ? "success" : ngo.complianceScore > 70 ? "warning" : "danger"}
                  size="sm"
                  dot
                >
                  Score: {ngo.complianceScore}%
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Authorized Head:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{ngo.contactPerson}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Active Sanctioned Projects:</span>
                  <strong className="font-mono text-slate-800 dark:text-slate-200">
                    {ngo.activeProjects} Facilities
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Official Email:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{ngo.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Last Statutory Audit:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{ngo.lastAuditDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> NITI Aayog Validated
              </span>
              <span className="text-slate-400 text-[11px]">Contact: {ngo.phone}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
