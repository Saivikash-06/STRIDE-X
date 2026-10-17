"use client";

import React, { useState } from "react";
import { FileSpreadsheet, Download, Eye, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/hooks/useToast";

export const ReportsTab: React.FC = () => {
  const { showToast } = useToast();
  const [previewReport, setPreviewReport] = useState<{ title: string; desc: string; date: string } | null>(null);

  const reports = [
    {
      id: "REP-01",
      title: "Scheme Performance & Physical Target Report",
      category: "Statutory Scheme Progress",
      period: "FY 2025-26 (Q4 Final)",
      format: "PDF & Excel",
      records: "8 Schemes • 2,480 Projects",
      desc: "Comprehensive evaluation of physical targets, beneficiary outreach, and state-wise implementation pace.",
    },
    {
      id: "REP-02",
      title: "Project Risk Index & Anomaly Audit Report",
      category: "AI Risk Monitoring",
      period: "Monthly Cycle (September 2026)",
      format: "PDF",
      records: "25 Monitored Facilities",
      desc: "Detailed algorithmic breakdown of attendance variances, CCTV uptime flags, and high-risk facility audits.",
    },
    {
      id: "REP-03",
      title: "Aadhaar e-KYC Beneficiary Entitlement Digest",
      category: "Beneficiary Verification",
      period: "Live Cumulative",
      format: "Excel / CSV",
      records: "1.84 Million Citizens",
      desc: "De-duplicated Aadhaar beneficiary roster categorized by SC, OBC, Senior Citizens, and Divyangjan cohorts.",
    },
    {
      id: "REP-04",
      title: "PMU Field Inspection & Geo-tag Compliance Audit",
      category: "Physical Field Audits",
      period: "Bi-Annual Digest",
      format: "PDF Dossier",
      records: "14,350 Completed Inspections",
      desc: "Geospatially validated inspector reports, photo evidence registries, and facility hygiene rating indices.",
    },
    {
      id: "REP-05",
      title: "Statutory Compliance & GFR-19A Clearance Register",
      category: "Legal & Regulatory",
      period: "Quarterly Review",
      format: "PDF",
      records: "865 Implementing NGOs",
      desc: "Status of fire clearances, registration renewals, building codes, and pending Utilization Certificates.",
    },
    {
      id: "REP-06",
      title: "Citizen Grievance Redressal & Whistleblower Analysis",
      category: "CPGRAMS / Nodal Desk",
      period: "Monthly Report",
      format: "PDF & Excel",
      records: "1,240 Complaints Logged",
      desc: "Analysis of grievances by category, resolution timelines, and disciplinary directives issued to centers.",
    },
    {
      id: "REP-07",
      title: "Public Finance (PFMS) & Grant Disbursement Reconciliation",
      category: "Financial Accounts",
      period: "BE 2026-27 YTD",
      format: "Excel & CSV",
      records: "₹5,205 Crores Outlay",
      desc: "Complete transaction-level audit trail tracing treasury releases to NGO account drawdowns.",
    },
    {
      id: "REP-08",
      title: "National Biometric & CCTV Telemetry Summary",
      category: "Infrastructure Telemetry",
      period: "Weekly Telemetry",
      format: "PDF",
      records: "2,480 Centres Synced",
      desc: "Camera stream health uptime stats, biometric hardware failure logs, and daily punch percentages.",
    },
  ];

  const handleDownload = (title: string) => {
    showToast({
      type: "success",
      title: "Report Dispatched for Download",
      message: `Generated encrypted official copy of "${title}" (Govt of India Secure Digest).`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#0F4C81] dark:text-blue-400" />
            National MIS Reporting & Statutory Documentation
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated generation of Parliamentary Q&A digests, CAG audit files, and departmental analytical reports.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reports.map((rep) => (
          <Card
            key={rep.id}
            hoverEffect
            className="p-5 border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#0F4C81] dark:text-blue-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                      {rep.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 leading-snug">
                      {rep.title}
                    </h3>
                  </div>
                </div>

                <Badge variant="neutral" size="sm">
                  {rep.format}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                {rep.desc}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <span className="text-slate-400 block text-[10px]">Reporting Cycle:</span>
                  <strong className="text-slate-700 dark:text-slate-300">{rep.period}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Data Coverage:</span>
                  <strong className="text-slate-700 dark:text-slate-300">{rep.records}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPreviewReport({ title: rep.title, desc: rep.desc, date: rep.period })}
                leftIcon={<Eye className="w-3.5 h-3.5" />}
              >
                Preview Document
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleDownload(rep.title)}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download Official Copy
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      {previewReport && (
        <Modal
          isOpen={!!previewReport}
          onClose={() => setPreviewReport(null)}
          title={`Document Preview: ${previewReport.title}`}
          description={`Period: ${previewReport.date} • Ministry of Social Justice & Empowerment`}
          maxWidth="lg"
          footer={
            <Button size="sm" variant="primary" onClick={() => setPreviewReport(null)}>
              Close Document
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  STRIDE-X • Government Monitoring Report
                </span>
                <span className="font-mono text-emerald-600 font-bold">CERTIFIED OFFICIAL</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {previewReport.desc}
              </p>
              <div className="text-[11px] text-slate-500 font-mono pt-1">
                Generated with Cryptographic Timestamp: 2026-09-29 11:42:00 IST
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
