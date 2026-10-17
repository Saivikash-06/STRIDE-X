import React from "react";
import { Metadata } from "next";
import { RoleLandingPreview } from "@/components/auth/RoleLandingPreview";

export const metadata: Metadata = {
  title: "Beneficiary Citizen Portal | Welfare Monitoring Platform",
  description: "Citizen beneficiary entitlement and grievance workspace.",
};

export default function BeneficiaryPage() {
  return (
    <RoleLandingPreview
      role="beneficiary"
      title="Beneficiary Entitlement Workspace"
      nextModule="Frontend Module 4: NGO, Staff & Beneficiary Dashboard"
      moduleFile="Frontend_04_NGO_Staff_Beneficiary_Dashboard.md"
    />
  );
}
