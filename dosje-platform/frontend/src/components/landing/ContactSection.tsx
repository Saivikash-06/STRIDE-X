"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { PLATFORM_INFO } from "@/constants/landingData";
import { useToast } from "@/hooks/useToast";

export const ContactSection: React.FC = () => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "Grievance / Whistleblower",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast({
        type: "error",
        title: "Required Fields Missing",
        message: "Please fill in all inquiry fields before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast({
        type: "success",
        title: "Inquiry / Grievance Registered",
        message: "Your submission has been logged into the DoSJE Nodal Verification Desk. Reference ID: GRV-2026-9041",
      });
    }, 800);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Nodal Desk & Support"
          badgeVariant="primary"
          title="Official Grievance Desk & Institutional Contact"
          subtitle="Direct escalation channels for citizens, grantee organizations, state nodal officers, and field audit inquiries."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official Contact Directory */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Departmental Nodal Directory
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0F4C81] dark:text-blue-400 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Official Headquarters</span>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5 leading-relaxed">
                      {PLATFORM_INFO.department}, {PLATFORM_INFO.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">National Toll-Free Helpline</span>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                      {PLATFORM_INFO.helpline}
                    </p>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Operates 24x7 in 12 Official Languages
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Technical & Audit Email</span>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                      {PLATFORM_INFO.email}
                    </p>
                    <span className="text-[11px] text-slate-500 text-xs">Response within 24 business hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">Vigilance & Audit Cell Hours</span>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                      Monday to Friday: 09:30 AM to 06:00 PM IST
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Alert variant="warning" title="Anti-Fraud & Whistleblower Notice">
              DoSJE maintains a zero-tolerance policy against misappropriation of welfare grants. Whistleblower identities are safeguarded under Government of India vigilance norms.
            </Alert>
          </div>

          {/* Right Column: Inquiry / Grievance Lodging Form */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-8 border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Submit Query or Compliance Escalation
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
                All submissions are logged with digital timestamps and assigned to the respective Zonal Welfare Director.
              </p>

              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Ticket Successfully Registered
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    Acknowledgment sent to <span className="font-semibold">{formData.email}</span>. A designated monitoring officer will inspect the reported matter under SLA-48.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", category: "Grievance / Whistleblower", message: "" });
                    }}
                  >
                    Submit Another Query
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name / Officer Designation"
                      placeholder="e.g. Ramesh Kumar / Inspector"
                      isRequired
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="Official or Citizen Email"
                      type="email"
                      placeholder="e.g. officer@nic.in or citizen@domain.com"
                      isRequired
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-wider uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                      Subject Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 shadow-sm focus:border-[#0F4C81] focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20"
                    >
                      <option value="Grievance / Whistleblower">Grievance / Whistleblower Non-Compliance Report</option>
                      <option value="Physical Inspection Clarification">Physical Inspection Clarification / Geotag Issue</option>
                      <option value="NGO Grant Utilization Inquiry">NGO Grant Utilization & UC Submission</option>
                      <option value="Beneficiary DBT Inquiry">Beneficiary Aadhaar e-KYC / DBT Status</option>
                      <option value="Technical Portal Support">Technical Portal Access & API Telemetry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold tracking-wider uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                      Detailed Observation / Description <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Provide specific details including Scheme Name, Project ID, District, or Observation details..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 shadow-sm focus:border-[#0F4C81] focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/20"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      🔒 Secured via 256-bit encryption under National Data Protocols
                    </span>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      isLoading={isSubmitting}
                      leftIcon={<Send className="w-4 h-4" />}
                    >
                      Transmit to Nodal Desk
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
