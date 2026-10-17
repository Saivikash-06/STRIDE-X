import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";

export const metadata: Metadata = {
  title: "STRIDE-X | Smart Tracking & Real-time Inspection for Development and Empowerment",
  description:
    "STRIDE-X - Smart Tracking & Real-time Inspection for Development and Empowerment. Centralized AI-powered monitoring, inspection, and statutory compliance platform for DoSJE welfare schemes, Government of India.",
  keywords: [
    "STRIDE-X",
    "Smart Tracking",
    "Real-time Inspection",
    "DoSJE",
    "Welfare Monitoring",
    "Government of India",
    "Compliance Platform",
    "AI Inspection",
    "NGO Monitoring",
    "Beneficiary Verification",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-[#0F4C81] selection:text-white">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
