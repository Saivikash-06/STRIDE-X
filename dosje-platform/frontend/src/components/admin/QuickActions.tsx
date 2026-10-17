"use client";

import React, { useState } from "react";
import {
  PlusCircle,
  FolderPlus,
  FileSpreadsheet,
  UserCheck,
  Download,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { AdminTab } from "@/types/admin";
import { MOCK_SCHEMES, MOCK_NGOS } from "@/mock/adminMockData";

interface QuickActionsProps {
  onSelectTab?: (tab: AdminTab) => void;
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onSelectTab,
  className = "",
}) => {
  // Modal states
  const [activeModal, setActiveModal] = useState<
    "none" | "add-scheme" | "register-project" | "assign-inspection" | "export-dashboard"
  >("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Scheme Form State
  const [schemeForm, setSchemeForm] = useState({
    code: "",
    name: "",
    category: "SC Development",
    targetGroup: "",
    budgetAllocatedCr: "",
    nodalOfficer: "",
  });

  // Register Project Form State
  const [projectForm, setProjectForm] = useState({
    name: "",
    schemeId: MOCK_SCHEMES[0]?.id || "",
    ngoId: MOCK_NGOS[0]?.id || "",
    state: "Uttar Pradesh",
    district: "",
    sanctionedGrantLakhs: "",
    beneficiariesCount: "",
  });

  // Assign Inspection Form State
  const [inspectionForm, setInspectionForm] = useState({
    projectId: "",
    inspectorName: "",
    inspectionDate: new Date().toISOString().split("T")[0],
    inspectionType: "Statutory Surprise Audit",
  });

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddSchemeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setActiveModal("none");
      showNotification(`Scheme "${schemeForm.code}" successfully gazetted into central directory.`);
      setSchemeForm({
        code: "",
        name: "",
        category: "SC Development",
        targetGroup: "",
        budgetAllocatedCr: "",
        nodalOfficer: "",
      });
    }, 700);
  };

  const handleRegisterProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setActiveModal("none");
      showNotification(`Project "${projectForm.name}" registered and grant earmarked.`);
      setProjectForm({
        name: "",
        schemeId: MOCK_SCHEMES[0]?.id || "",
        ngoId: MOCK_NGOS[0]?.id || "",
        state: "Uttar Pradesh",
        district: "",
        sanctionedGrantLakhs: "",
        beneficiariesCount: "",
      });
    }, 700);
  };

  const handleAssignInspectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setActiveModal("none");
      showNotification(`Inspection order dispatched to ${inspectionForm.inspectorName}.`);
      setInspectionForm({
        projectId: "",
        inspectorName: "",
        inspectionDate: new Date().toISOString().split("T")[0],
        inspectionType: "Statutory Surprise Audit",
      });
    }, 700);
  };

  const handleExportDashboard = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify(
        {
          portal: "STRIDE-X National Command Center",
          ministry: "Department of Social Justice & Empowerment, Govt. of India",
          timestamp: new Date().toISOString(),
          kpis: {
            activeSchemes: 8,
            activeProjects: 2480,
            registeredNgos: 865,
            beneficiaries: "1.84M",
            complianceRate: "94.2%",
            fundUtilization: "81.6%",
          },
        },
        null,
        2
      )
    );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `STRIDE_X_National_Dashboard_Digest_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showNotification("National Command Center digest downloaded successfully.");
  };

  return (
    <>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Button Row */}
      <div className={`flex items-center gap-2 flex-wrap ${className}`}>
        <Button
          size="sm"
          variant="primary"
          onClick={() => setActiveModal("add-scheme")}
          leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
        >
          Add Scheme
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setActiveModal("register-project")}
          leftIcon={<FolderPlus className="w-3.5 h-3.5" />}
        >
          Register Project
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setActiveModal("assign-inspection")}
          leftIcon={<UserCheck className="w-3.5 h-3.5" />}
        >
          Assign Inspection
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => onSelectTab?.("reports")}
          leftIcon={<FileSpreadsheet className="w-3.5 h-3.5" />}
        >
          View Reports
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleExportDashboard}
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          Export Dashboard
        </Button>
      </div>

      {/* Modal 1: Add Scheme */}
      <Modal
        isOpen={activeModal === "add-scheme"}
        onClose={() => setActiveModal("none")}
        title="Gazette New Central Welfare Scheme"
      >
        <form onSubmit={handleAddSchemeSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Scheme Acronym / Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. PM-AJAY, SMILE-2"
              value={schemeForm.code}
              onChange={(e) => setSchemeForm({ ...schemeForm, code: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Full Official Scheme Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pradhan Mantri Anusuchit Jaati Abhyuday Yojana"
              value={schemeForm.name}
              onChange={(e) => setSchemeForm({ ...schemeForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Category
              </label>
              <select
                value={schemeForm.category}
                onChange={(e) => setSchemeForm({ ...schemeForm, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="SC Development">SC Development</option>
                <option value="Elderly Welfare">Elderly Welfare</option>
                <option value="Divyangjan Aid">Divyangjan Aid</option>
                <option value="Healthcare & De-addiction">Healthcare & De-addiction</option>
                <option value="Livelihood Rehabilitation">Livelihood Rehabilitation</option>
                <option value="Education & Fellowship">Education & Fellowship</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Budget Allocated (₹ Cr) *
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 500"
                value={schemeForm.budgetAllocatedCr}
                onChange={(e) => setSchemeForm({ ...schemeForm, budgetAllocatedCr: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Target Beneficiary Group
            </label>
            <input
              type="text"
              placeholder="e.g. Indigent Senior Citizens (60+) below poverty line"
              value={schemeForm.targetGroup}
              onChange={(e) => setSchemeForm({ ...schemeForm, targetGroup: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Designated Central Nodal Officer (IAS / Director)
            </label>
            <input
              type="text"
              placeholder="e.g. Shri Rajeshwar Verma, Joint Secy"
              value={schemeForm.nodalOfficer}
              onChange={(e) => setSchemeForm({ ...schemeForm, nodalOfficer: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setActiveModal("none")}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Gazette Scheme
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Register Project */}
      <Modal
        isOpen={activeModal === "register-project"}
        onClose={() => setActiveModal("none")}
        title="Sanction & Register Welfare Project Facility"
      >
        <form onSubmit={handleRegisterProjectSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Facility / Project Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Ambedkar Skill Centre & Hostel"
              value={projectForm.name}
              onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Parent Scheme *
              </label>
              <select
                value={projectForm.schemeId}
                onChange={(e) => setProjectForm({ ...projectForm, schemeId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {MOCK_SCHEMES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name.slice(0, 30)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Grantee NGO *
              </label>
              <select
                value={projectForm.ngoId}
                onChange={(e) => setProjectForm({ ...projectForm, ngoId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {MOCK_NGOS.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name} ({n.darpanId})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                State
              </label>
              <input
                type="text"
                required
                value={projectForm.state}
                onChange={(e) => setProjectForm({ ...projectForm, state: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                District *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Varanasi, Lucknow"
                value={projectForm.district}
                onChange={(e) => setProjectForm({ ...projectForm, district: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Sanctioned Grant (₹ Lakhs) *
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 85.5"
                value={projectForm.sanctionedGrantLakhs}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, sanctionedGrantLakhs: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Enrolled Beneficiary Target
              </label>
              <input
                type="number"
                placeholder="e.g. 250"
                value={projectForm.beneficiariesCount}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, beneficiariesCount: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setActiveModal("none")}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Register Facility
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 3: Assign Inspection */}
      <Modal
        isOpen={activeModal === "assign-inspection"}
        onClose={() => setActiveModal("none")}
        title="Dispatch PMU Statutory Inspection Audit"
      >
        <form onSubmit={handleAssignInspectionSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Target Facility *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ashray Senior Living Centre (UP-LKO-001)"
              value={inspectionForm.projectId}
              onChange={(e) => setInspectionForm({ ...inspectionForm, projectId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
              Designated Auditor / Inspecting Officer *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Ramesh Meena, IAS / PMU Senior Auditor"
              value={inspectionForm.inspectorName}
              onChange={(e) =>
                setInspectionForm({ ...inspectionForm, inspectorName: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Audit Due Date
              </label>
              <input
                type="date"
                required
                value={inspectionForm.inspectionDate}
                onChange={(e) =>
                  setInspectionForm({ ...inspectionForm, inspectionDate: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Audit Protocol
              </label>
              <select
                value={inspectionForm.inspectionType}
                onChange={(e) =>
                  setInspectionForm({ ...inspectionForm, inspectionType: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Statutory Surprise Audit">Statutory Surprise Audit</option>
                <option value="Quarterly Routine Inspection">Quarterly Routine Inspection</option>
                <option value="Grievance Redressal Verification">Grievance Redressal Verification</option>
                <option value="Tranche Release Clearance">Tranche Release Clearance</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg text-amber-800 dark:text-amber-300 text-[11px]">
            ⚠️ Officer will be provided with geotagged cryptographic inspection app credentials with tamper-proof photo verification.
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setActiveModal("none")}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Dispatch Order
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
