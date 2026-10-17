import React from "react";
import { RoleLandingPreview } from "@/features/auth/RoleLandingPreview";

export const NgoFeature: React.FC = () => {
  return (
    <RoleLandingPreview
      role="ngo"
      title="Empaneled Grantee NGO Workspace"
      nextModule="Frontend Module 4: NGO, Staff & Beneficiary Dashboard"
      moduleFile="Frontend_04_NGO_Staff_Beneficiary_Dashboard.md"
    />
  );
};
