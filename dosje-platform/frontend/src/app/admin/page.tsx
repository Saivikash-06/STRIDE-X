import React from "react";
import { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const metadata: Metadata = {
  title: "DoSJE Central Admin Command Dashboard | Govt. of India",
  description:
    "National command center for welfare schemes, implementing agencies, beneficiaries, inspections, grievances, compliance, AI alerts, and analytics.",
};

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminLayout />
    </ProtectedRoute>
  );
}
