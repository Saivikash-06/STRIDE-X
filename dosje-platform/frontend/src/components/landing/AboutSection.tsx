import React from "react";
import { Building, Award, CheckCircle2, Users, FileCheck } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { Card } from "@/components/ui/Card";

export const AboutSection: React.FC = () => {
  const tiers = [
    {
      level: "Tier 1: Central DoSJE & PMU Directorate",
      role: "Central Administration & National Policy",
      desc: "Central policy setting, nationwide macro telemetry, cross-state resource optimization, and statutory vigilance oversight.",
      icon: <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    },
    {
      level: "Tier 2: State & District Nodal Authorities",
      role: "State Allocation & Approval Clearance",
      desc: "District-level validation of grant proposals, field auditor dispatch, state budget reconciliation, and physical inspection approvals.",
      icon: <Award className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    },
    {
      level: "Tier 3: Empaneled Grantee NGOs & Staff",
      role: "Execution & Real-time Record Keeping",
      desc: "Daily biometric rosters, geotagged infrastructure photo uploads, live CCTV uptime reports, and utilization certificate filings.",
      icon: <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      level: "Tier 4: Citizen Beneficiaries & Grievance Desk",
      role: "Direct Verification & Entitlement Recipient",
      desc: "Aadhaar e-KYC entitlement confirmation, biometric attendance validation, meal/amenity feedback, and direct grievance escalation.",
      icon: <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Institutional Mandate"
          badgeVariant="primary"
          title="About the STRIDE-X Platform"
          subtitle="Smart Tracking & Real-time Inspection for Development and Empowerment – Empowering affirmative social development for DoSJE through cutting-edge digital verification, institutional accountability, and transparent grant stewardship."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Vision & Mission */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
              Ensuring Rightful Social Justice Reaches the Last Mile Without Leakage
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The Department of Social Justice & Empowerment implements numerous welfare schemes for the educational, economic, and social upliftment of Scheduled Castes (SC), Other Backward Classes (OBC), Senior Citizens, Persons with Disabilities, and Victims of Substance Abuse.
            </p>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              This centralized monitoring platform integrates state-of-the-art AI verification routines to eliminate phantom centres, automate utilization audits, and guarantee that public funds directly enrich the lives of targeted citizens.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "Strict alignment with General Financial Rules (GFR) 2017 & PFMS Protocols",
                "Geo-fenced verification ensuring audits occur physically at approved coordinates",
                "Continuous automated cross-referencing against National NGO-Darpan registry",
                "Aadhaar-authenticated direct beneficiary entitlement tracing",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Multi-Tier Inspection Framework */}
          <div className="lg:col-span-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Multi-Tier Governance & Inspection Architecture
            </h4>

            {tiers.map((tier, idx) => (
              <Card
                key={idx}
                className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                    {tier.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-[#0F4C81] dark:text-blue-400 uppercase tracking-wider">
                      {tier.level}
                    </span>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {tier.role}
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {tier.desc}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
