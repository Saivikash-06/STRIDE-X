"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Download,
  Eye,
  Search,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  FileCheck,
  ShieldAlert,
  Layers,
  Users,
  Activity,
  X,
  Sparkles,
} from "lucide-react";
import { AuthorityReportCard } from "@/types/authority";
import { MOCK_AUTHORITY_REPORTS } from "@/mock/authorityMockData";

export default function AuthorityReportsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedReport, setSelectedReport] = useState<AuthorityReportCard | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const categories = [
    "ALL",
    "Projects",
    "Beneficiaries",
    "Attendance",
    "Grievances",
    "Inspection",
    "Compliance",
    "Fund Utilization",
    "Risk Report",
  ];

  const filteredReports = useMemo(() => {
    return MOCK_AUTHORITY_REPORTS.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "ALL" || r.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleDownload = (report: AuthorityReportCard) => {
    setDownloadingId(report.id);
    setTimeout(() => {
      setDownloadingId(null);
      // Simulate file download
      const fakeContent = `Department of Social Justice and Empowerment - Government of Maharashtra\nReport: ${report.title}\nCategory: ${report.category}\nGenerated Date: ${report.generatedDate}\nRecords: ${report.recordsCount}\nFile Size: ${report.fileSize}\n\n[CONFIDENTIAL STATUTORY AUDIT REPORT DOCUMENT]`;
      const blob = new Blob([fakeContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `DoSJE_${report.category.replace(/\s+/g, "_")}_${report.id}.${report.format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 800);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Projects":
        return <Layers className="w-5 h-5 text-blue-600" />;
      case "Beneficiaries":
        return <Users className="w-5 h-5 text-emerald-600" />;
      case "Attendance":
        return <Activity className="w-5 h-5 text-purple-600" />;
      case "Grievances":
        return <FileText className="w-5 h-5 text-amber-600" />;
      case "Inspection":
        return <FileCheck className="w-5 h-5 text-indigo-600" />;
      case "Compliance":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "Fund Utilization":
        return <FileSpreadsheet className="w-5 h-5 text-blue-600" />;
      case "Risk Report":
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      default:
        return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>State Nodal Analytical Reports & Audits</span>
          </div>
          <h2 className="text-xl font-bold mt-1">Official DoSJE Statutory Documentation Dossier</h2>
          <p className="text-xs text-blue-100/80 mt-1 max-w-2xl">
            Pre-compiled GFR statutory reports, biometric telemetry logs, and financial reconciliation ledgers for Maharashtra State and its 5 assigned districts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-xs">
            <span className="text-blue-200">Total Pre-compiled:</span>{" "}
            <span className="font-bold text-white">{MOCK_AUTHORITY_REPORTS.length} Reports</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Category Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports by title, keyword, or summary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {getCategoryIcon(report.category)}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {report.format}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{report.fileSize}</span>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {report.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                  {report.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {report.description}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {report.generatedDate}
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {report.recordsCount.toLocaleString()} Records
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedReport(report)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => handleDownload(report)}
                  disabled={downloadingId === report.id}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadingId === report.id ? "Preparing..." : "Download"}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  {getCategoryIcon(selectedReport.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Document Preview
                    </h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {selectedReport.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">STRIDE-X • Government Monitoring Report</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {selectedReport.category} Official Report
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedReport.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedReport.description}
                </p>
              </div>

              {/* Metadata Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-xs text-slate-400 block">Reporting Period</span>
                  <span className="font-medium text-xs text-slate-900 dark:text-white mt-1 block">
                    {selectedReport.period}
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-xs text-slate-400 block">Generated Date</span>
                  <span className="font-medium text-xs text-slate-900 dark:text-white mt-1 block">
                    {selectedReport.generatedDate}
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-xs text-slate-400 block">Format & Size</span>
                  <span className="font-medium text-xs text-slate-900 dark:text-white mt-1 block">
                    {selectedReport.format} • {selectedReport.fileSize}
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-xs text-slate-400 block">Record Count</span>
                  <span className="font-bold text-xs text-blue-600 dark:text-blue-400 mt-1 block">
                    {selectedReport.recordsCount.toLocaleString()} Entries
                  </span>
                </div>
              </div>

              {/* Simulated Report Preview Content */}
              <div>
                <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Sample Data Summary (Confidential Preview)
                </h5>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4 font-mono text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                  <p>------------------------------------------------------------------------</p>
                  <p className="font-bold text-slate-900 dark:text-white">
                    GOVERNMENT OF MAHARASHTRA • DEPARTMENT OF SOCIAL JUSTICE
                  </p>
                  <p>STATE MONITORING DOSSIER : {selectedReport.title.toUpperCase()}</p>
                  <p>JURISDICTION : PUNE, NAGPUR, THANE, NASHIK, SAMBHAJINAGAR</p>
                  <p>CERTIFIED AUDITOR : Smt. Vandana Suryavanshi, IAS (State Nodal Director)</p>
                  <p>------------------------------------------------------------------------</p>
                  <p>TOTAL DATA POINTS EXTRACTED : {selectedReport.recordsCount}</p>
                  <p>STATUS : STATUTORILY VALIDATED & DIGITALLY SIGNED</p>
                  <p>HASH VERIFICATION : 8f42d93e1b7c... [SHA-256 CHECK VERIFIED]</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Official DoSJE Document Repository
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDownload(selectedReport);
                    setSelectedReport(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document ({selectedReport.format})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
