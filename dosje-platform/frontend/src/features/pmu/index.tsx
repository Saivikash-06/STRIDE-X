import React from "react";
import { RoleLandingPreview } from "@/features/auth/RoleLandingPreview";

export const PmuFeature: React.FC = () => {
  return (
    <RoleLandingPreview
      role="pmu"
      title="National Project Monitoring Unit (PMU) Workspace"
      nextModule="Frontend Module 3: PMU Field Inspection Suite"
      moduleFile="Frontend_03_PMU_Inspection_App.md"
    />
  );
};
