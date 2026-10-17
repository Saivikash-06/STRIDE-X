import React from "react";
import { Metadata } from "next";
import { RoleLandingPreview } from "@/components/auth/RoleLandingPreview";

export const metadata: Metadata = {
  title: "Field Centre Staff Portal | Welfare Monitoring Platform",
  description: "Field supervisor and center staff daily operations workspace.",
};

export default function StaffPage() {
  return (
    <RoleLandingPreview
      role="staff"
      title="Field Center Staff Workspace"
      nextModule="Frontend Module 4: NGO, Staff & Beneficiary Dashboard"
      moduleFile="Frontend_04_NGO_Staff_Beneficiary_Dashboard.md"
    />
  );
}
