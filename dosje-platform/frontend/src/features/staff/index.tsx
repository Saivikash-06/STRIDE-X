import React from "react";
import { RoleLandingPreview } from "@/features/auth/RoleLandingPreview";

export const StaffFeature: React.FC = () => {
  return (
    <RoleLandingPreview
      role="staff"
      title="Field Verification & Inspection Staff Workspace"
      nextModule="Frontend Module 4: Field Operations & Geotagged Evidence"
      moduleFile="Frontend_04_Field_Verification.md"
    />
  );
};
