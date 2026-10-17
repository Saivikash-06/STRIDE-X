import React from "react";
import { RoleLandingPreview } from "@/features/auth/RoleLandingPreview";

export const BeneficiaryFeature: React.FC = () => {
  return (
    <RoleLandingPreview
      role="beneficiary"
      title="Direct Welfare Beneficiary Pass"
      nextModule="Frontend Module 4: Beneficiary Entitlement Portal"
      moduleFile="Frontend_04_NGO_Staff_Beneficiary_Dashboard.md"
    />
  );
};
