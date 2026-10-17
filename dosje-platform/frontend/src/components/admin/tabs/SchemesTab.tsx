"use client";

import React, { useState } from "react";
import { Layers, Search, Plus, Users, FolderKanban } from "lucide-react";
import { MOCK_SCHEMES } from "@/mock/adminMockData";
import { Scheme } from "@/types/admin";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";

export const SchemesTab: React.FC = () => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newScheme, setNewScheme] = useState({
    code: "",
    name: "",
    category: "SC Development",
    targetGroup: "",
    budget: "",
    nodalOfficer: "",
  });

  const filteredSchemes = MOCK_SCHEMES.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateScheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheme.code || !newScheme.name) {
      showToast({ type: "error", title: "Missing Fields", message: "Please provide scheme code and name." });
      return;
    }
    setIsCreateOpen(false);
    showToast({
      type: "success",
      title: "Scheme Registered",
      message: `Statutory scheme ${newScheme.code} onboarded for financial year 2026-27.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#0F4C81] dark:text-blue-400" />
            Central Scheme Administration
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitoring allocations, project sanction caps, and statutory guidelines for 8 Central Schemes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsCreateOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Register Central Scheme
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by scheme code, name, or target group..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/25"
          />
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredSchemes.map((scheme) => {
          const utilPct = ((scheme.budgetUtilizedCr / scheme.budgetAllocatedCr) * 100).toFixed(1);

          return (
            <Card
              key={scheme.id}
              hoverEffect
              className="p-5 border-slate-200 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#0F4C81] dark:text-blue-300">
                    {scheme.code}
                  </span>
                  <Badge variant="success" size="sm" dot>
                    ACTIVE
                  </Badge>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 mt-1">
                  {scheme.name}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
                  Target: {scheme.targetGroup}
                </span>

                {/* Progress Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Utilization Rate</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {utilPct}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-[#0F4C81] dark:bg-blue-500 rounded-full"
                      style={{ width: `${utilPct}%` }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-slate-400 block">Sanctioned</span>
                    <strong className="font-mono text-slate-800 dark:text-slate-200">
                      ₹{scheme.budgetAllocatedCr} Cr
                    </strong>
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-slate-400 block">Utilized</span>
                    <strong className="font-mono text-emerald-600 dark:text-emerald-400">
                      ₹{scheme.budgetUtilizedCr} Cr
                    </strong>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <FolderKanban className="w-3 h-3" /> {scheme.activeProjectsCount} Projects
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {(scheme.beneficiariesCount / 1000).toFixed(0)}k Enrolled
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  Nodal: {scheme.nodalOfficer.split(",")[0]}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedScheme(scheme)}
                >
                  View Policy
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <Modal
          isOpen={!!selectedScheme}
          onClose={() => setSelectedScheme(null)}
          title={`Scheme Overview: ${selectedScheme.code}`}
          description={selectedScheme.name}
          footer={
            <Button size="sm" variant="primary" onClick={() => setSelectedScheme(null)}>
              Close Review
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div>
                <span className="text-slate-400 block">Category:</span>
                <strong className="text-slate-800 dark:text-slate-200">{selectedScheme.category}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Target Group:</span>
                <strong className="text-slate-800 dark:text-slate-200">{selectedScheme.targetGroup}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Nodal Officer:</span>
                <strong className="text-slate-800 dark:text-slate-200">{selectedScheme.nodalOfficer}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Budget Sanctioned:</span>
                <strong className="font-mono text-slate-800 dark:text-slate-200">
                  ₹{selectedScheme.budgetAllocatedCr} Crores
                </strong>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-slate-900 dark:text-white mb-1">
                Statutory Implementation Directives:
              </h5>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                <li>Quarterly Utilization Certificates (GFR 19-A) must be authenticated by State Nodal Director.</li>
                <li>All grantee NGOs must submit continuous biometric attendance telemetry.</li>
                <li>Physical inspections must occur semi-annually with geotag verification.</li>
              </ul>
            </div>
          </div>
        </Modal>
      )}

      {/* Register Scheme Modal */}
      {isCreateOpen && (
        <Modal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Register New Central Scheme"
          description="Onboard an official scheme under the Department of Social Justice & Empowerment."
          footer={
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleCreateScheme}>
                Save & Publish Scheme
              </Button>
            </div>
          }
        >
          <form className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Scheme Acronym / Code"
                placeholder="e.g. PM-AJAY"
                isRequired
                value={newScheme.code}
                onChange={(e) => setNewScheme({ ...newScheme, code: e.target.value })}
              />
              <Input
                label="Budget (₹ Crores)"
                placeholder="e.g. 450.0"
                isRequired
                value={newScheme.budget}
                onChange={(e) => setNewScheme({ ...newScheme, budget: e.target.value })}
              />
            </div>
            <Input
              label="Official Scheme Full Title"
              placeholder="e.g. Pradhan Mantri Anusuchit Jaati Abhyuday Yojana"
              isRequired
              value={newScheme.name}
              onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })}
            />
            <Input
              label="Designated Nodal Officer"
              placeholder="e.g. Shri R. K. Mathur, Joint Secretary"
              value={newScheme.nodalOfficer}
              onChange={(e) => setNewScheme({ ...newScheme, nodalOfficer: e.target.value })}
            />
          </form>
        </Modal>
      )}
    </div>
  );
};
