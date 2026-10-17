"use client";

import React, { useState } from "react";
import { Shield, ExternalLink, Phone, Mail, Building, CheckCircle2 } from "lucide-react";
import { PLATFORM_INFO } from "@/constants/landingData";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export const Footer: React.FC = () => {
  const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null);

  const openPrivacyModal = () => {
    setModalContent({
      title: "Government Data Privacy & Security Policy",
      content: (
        <div className="space-y-3 text-xs leading-relaxed">
          <p>
            The Department of Social Justice & Empowerment (DoSJE) is committed to protecting the privacy and personal data of beneficiaries, grantees, and inspecting officers in accordance with the Digital Personal Data Protection Act, 2023.
          </p>
          <h6 className="font-bold text-slate-800 dark:text-slate-200">1. Data Collection & Purpose Limitation</h6>
          <p>
            Biometric data, Aadhaar authentication logs, and geo-location coordinates are collected solely for the verification of welfare scheme entitlements, DBT disbursements, and genuine physical inspections.
          </p>
          <h6 className="font-bold text-slate-800 dark:text-slate-200">2. Encryption & Storage</h6>
          <p>
            All telemetry and inspection records are encrypted in transit using TLS 1.3 and stored at REST in National Informatics Centre (NIC) / MeitY-empaneled sovereign cloud data centers.
          </p>
          <h6 className="font-bold text-slate-800 dark:text-slate-200">3. Audit Trails</h6>
          <p>
            All administrative access and data queries generate immutable, tamper-evident audit logs maintained for statutory vigilance reviews.
          </p>
        </div>
      ),
    });
  };

  const openTermsModal = () => {
    setModalContent({
      title: "Terms & Conditions of Platform Usage",
      content: (
        <div className="space-y-3 text-xs leading-relaxed">
          <p>
            This portal is an official digital asset of the Department of Social Justice & Empowerment, Government of India. Unauthorized access, falsification of inspection reports, or submission of fraudulent attendance records is punishable under the Information Technology Act, 2000 and the Indian Penal Code.
          </p>
          <h6 className="font-bold text-slate-800 dark:text-slate-200">User Obligations:</h6>
          <ul className="list-disc pl-5 space-y-1">
            <li>Officers and NGOs must maintain confidentiality of login credentials.</li>
            <li>Physical inspection coordinates must be captured live at the facility location.</li>
            <li>No proxy punches or unverified beneficiary registrations are permitted.</li>
          </ul>
        </div>
      ),
    });
  };

  return (
    <>
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
            {/* Column 1: Ministry Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5 text-white font-bold text-base">
                <div className="w-8 h-8 rounded-lg bg-[#0F4C81] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span>{PLATFORM_INFO.name}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                Centralized digital platform facilitating automated AI compliance scoring, geo-tagged inspection audits, CCTV verification, and real-time beneficiary authentication for all welfare programs under the Department of Social Justice & Empowerment.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Protected by CERT-In Security Compliant Architecture</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Welfare Portals</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <a href="https://socialjustice.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    DoSJE Ministry Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://ngodarpan.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    NGO-Darpan NITI Aayog <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://pfms.nic.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    Public Financial MIS (PFMS) <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="https://pgportal.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    CPGRAMS Grievance Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Platform & Policy */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Governance & Legal</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <button onClick={openPrivacyModal} className="hover:text-white transition-colors text-left">
                    Privacy & Data Protection Policy
                  </button>
                </li>
                <li>
                  <button onClick={openTermsModal} className="hover:text-white transition-colors text-left">
                    Terms & Standard Operating Rules
                  </button>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    Security Architecture & Audit
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Nodal Grievance Redressal
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Official Helpline */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Nodal Contact</h4>
              <div className="space-y-2.5 text-xs text-slate-400">
                <div className="flex items-start gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
                  <span>{PLATFORM_INFO.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span>{PLATFORM_INFO.helpline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  <span>{PLATFORM_INFO.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar & Disclaimer */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="text-center md:text-left space-y-1">
              <p className="font-bold text-slate-300">
                © 2026 STRIDE-X
              </p>
              <p className="text-[11px] text-slate-400">
                Smart Tracking & Real-time Inspection for Development and Empowerment
              </p>
              <p className="text-[10px] text-slate-500">
                Powered for DoSJE Digital Governance Prototype • Ministry of Social Justice & Empowerment, Government of India
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
                {PLATFORM_INFO.version}
              </span>
              <span>Hosted on National Informatics Centre (NIC) Sovereign Cloud</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Dialog for Privacy & Terms */}
      {modalContent && (
        <Modal
          isOpen={!!modalContent}
          onClose={() => setModalContent(null)}
          title={modalContent.title}
          footer={
            <Button size="sm" variant="primary" onClick={() => setModalContent(null)}>
              Close Document
            </Button>
          }
        >
          {modalContent.content}
        </Modal>
      )}
    </>
  );
};
