import React from "react";
import { Metadata } from "next";
import { RoleLandingPreview } from "@/components/auth/RoleLandingPreview";

export const metadata: Metadata = {
  title: "Grantee NGO Portal | Welfare Monitoring Platform",
  description: "Grantee NGO administrator workspace for grant utilization and project records.",
};

export default function NgoPage() {
  return (
    <RoleLandingPreview
      role="ngo"
      title="Empaneled Grantee NGO Workspace"
      nextModule="Frontend Module 4: NGO, Staff & Beneficiary Dashboard"
      moduleFile="Frontend_04_NGO_Staff_Beneficiary_Dashboard.md"
    />
  );
}
