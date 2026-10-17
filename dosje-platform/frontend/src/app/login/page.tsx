import React, { Suspense } from "react";
import { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { FullScreenLoader } from "@/components/ui/Loader";

export const metadata: Metadata = {
  title: "Officer & Stakeholder Portal Login | STRIDE-X",
  description: "Secure government single sign-on authentication for STRIDE-X – Smart Tracking & Real-time Inspection for Development and Empowerment.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<FullScreenLoader message="Loading Security Gateway..." />}>
      <LoginForm />
    </Suspense>
  );
}
