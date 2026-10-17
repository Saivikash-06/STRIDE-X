import React from "react";
import { Metadata } from "next";
import { AuthorityLayout } from "@/components/authority/AuthorityLayout";

export const metadata: Metadata = {
  title: "State & District Authority Dashboard | DoSJE Welfare Monitoring Platform",
  description:
    "Government monitoring dashboard for State and District Authorities overseeing DoSJE welfare schemes in Maharashtra.",
};

export default function AuthorityPage() {
  return <AuthorityLayout />;
}
