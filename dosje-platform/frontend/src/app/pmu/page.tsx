import React from "react";
import { Metadata } from "next";
import { RoleLandingPreview } from "@/components/auth/RoleLandingPreview";

export const metadata: Metadata = {
  title: "PMU Field Inspection Portal | Welfare Monitoring Platform",
  description: "PMU Inspector workspace for physical audits and geo-tagged inspections.",
};

export default function PmuPage() {
  return (
    <RoleLandingPreview
      role="pmu"
      title="PMU Field Inspector Workspace"
      nextModule="Frontend Module 5: PMU Inspection Module"
      moduleFile="Frontend_05_PMU_Inspection_Module.md"
    />
  );
}
