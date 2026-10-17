import React from "react";
import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Password Recovery | STRIDE-X",
  description: "Recover access credentials for the STRIDE-X Government Digital Monitoring & Compliance Platform.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
