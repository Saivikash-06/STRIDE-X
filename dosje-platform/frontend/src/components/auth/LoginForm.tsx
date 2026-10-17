"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  LogIn,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Globe,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { DemoAccount } from "@/types/auth";
import { ROLE_DEFAULT_ROUTES } from "@/constants/demoAccounts";
import { Logo } from "@/components/landing/Logo";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { DemoAccountsPanel } from "./DemoAccountsPanel";
import { PLATFORM_INFO } from "@/constants/landingData";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Official email is required")
    .email("Please provide a valid official email address (e.g. officer@demo.gov)"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const { login } = useAuth();
  const { showToast } = useToast();

  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "dosje.admin@demo.gov",
      password: "Demo@123",
      rememberMe: true,
    },
  });

  const emailValue = watch("email");

  const handleSelectDemoAccount = (account: DemoAccount) => {
    setValue("email", account.email, { shouldValidate: true });
    setValue("password", account.password, { shouldValidate: true });
    setAuthError(null);
    showToast({
      type: "info",
      title: `${account.roleTitle} Selected`,
      message: `Form populated with official credentials for ${account.name}`,
    });
  };

  const onSubmit = async (data: LoginFormData) => {
    if (isSubmitting) return;

    setAuthError(null);
    setIsSubmitting(true);

    try {
      const result = await login(data.email, data.password, data.rememberMe);

      if (result.success) {
        showToast({
          type: "success",
          title: "Authentication Successful",
          message: "Redirecting to your authorized departmental workspace...",
        });

        // Determine target route
        if (returnUrl) {
          router.push(decodeURIComponent(returnUrl));
        } else {
          // Route based on role
          const normalizedEmail = data.email.trim().toLowerCase();
          if (normalizedEmail.includes("admin")) router.push(ROLE_DEFAULT_ROUTES.admin);
          else if (normalizedEmail.includes("authority")) router.push(ROLE_DEFAULT_ROUTES.authority);
          else if (normalizedEmail.includes("ngo")) router.push(ROLE_DEFAULT_ROUTES.ngo);
          else if (normalizedEmail.includes("staff")) router.push(ROLE_DEFAULT_ROUTES.staff);
          else if (normalizedEmail.includes("beneficiary")) router.push(ROLE_DEFAULT_ROUTES.beneficiary);
          else if (normalizedEmail.includes("pmu")) router.push(ROLE_DEFAULT_ROUTES.pmu);
          else router.push("/admin");
        }
      } else {
        setAuthError(result.error || "Authentication failed. Please verify credentials.");
        showToast({
          type: "error",
          title: "Authentication Failed",
          message: result.error || "Invalid official credentials provided.",
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected server network error occurred.";
      setAuthError(message);
      showToast({
        type: "error",
        title: "Network / System Error",
        message: "Failed to connect to authentication authority. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center">
      {/* Top Bar with Language and Theme */}
      <div className="max-w-7xl w-full mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="inline-flex">
          <Logo size="sm" isLink={false} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
            <Globe className="w-3.5 h-3.5" />
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-transparent border-none text-xs font-medium cursor-pointer focus:outline-none"
              aria-label="Language selection"
            >
              <option value="English" className="dark:bg-slate-900">English</option>
              <option value="हिन्दी" className="dark:bg-slate-900">हिन्दी</option>
            </select>
          </div>
          <ThemeToggle compact />
        </div>
      </div>

      {/* Main Split Layout Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-stretch">
          {/* LEFT COLUMN: Government Enterprise Illustration & Authority Highlighting */}
          <div className="lg:col-span-6 bg-linear-to-br from-[#0B2545] to-[#0F4C81] text-white p-8 sm:p-10 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden">
            {/* Background Emblem Watermark */}
            <div className="absolute -right-16 -bottom-16 w-80 h-80 opacity-10 pointer-events-none">
              <svg viewBox="0 0 48 48" fill="currentColor">
                <path d="M24 4L40 10V22C40 32.5 33.2 41.8 24 44C14.8 41.8 8 32.5 8 22V10L24 4Z" />
              </svg>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-xs border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
                <span>STRIDE-X Government Single Sign-On (SSO)</span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  STRIDE-X National Platform
                </h1>
                <p className="text-xs sm:text-sm text-blue-200 mt-1 font-semibold">
                  Smart Tracking & Real-time Inspection for Development and Empowerment
                </p>
                <p className="mt-2 text-xs text-blue-100/80 leading-relaxed">
                  Authorized digital gateway for Departmental Officials, State Social Welfare Nodal Heads, Grantee NGOs, and Field PMU Auditors.
                </p>
              </div>

              <div className="space-y-3.5 pt-2">
                {[
                  {
                    title: "Automated Inspection Verifications",
                    desc: "Tamper-proof geo-tagged photos and realtime offline synchronization.",
                  },
                  {
                    title: "AI Compliance Scoring",
                    desc: "Zero-latency variance detection against PFMS grant allocations and UCs.",
                  },
                  {
                    title: "Beneficiary Entitlement Traceability",
                    desc: "Aadhaar e-KYC linked identity safeguards preventing proxy enrollments.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold">{item.title}</strong>
                      <span className="text-blue-100/70">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Notice Footer */}
            <div className="pt-8 mt-8 border-t border-white/15 relative z-10 text-[11px] text-blue-200/80 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Statutory Confidentiality Warning</span>
              </div>
              <p>
                Access to this system is restricted to authorized personnel only. All access attempts, sessions, and telemetry transactions are recorded and audited.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Login Card & Form */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="text-left mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Welcome to STRIDE-X
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Government Digital Monitoring & Compliance Platform
                </p>
              </div>

              {authError && (
                <div className="mb-5">
                  <Alert variant="error" title="Access Denied">
                    {authError}
                  </Alert>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Official Email Address"
                  type="email"
                  placeholder="e.g. dosje.admin@demo.gov"
                  isRequired
                  leftIcon={<Mail className="w-4 h-4" />}
                  error={errors.email?.message}
                  {...register("email")}
                />

                <PasswordInput
                  label="Security Password"
                  placeholder="Enter your security password"
                  isRequired
                  error={errors.password?.message}
                  {...register("password")}
                />

                <div className="flex items-center justify-between pt-1">
                  <Checkbox
                    label="Remember official workstation session"
                    id="rememberMe"
                    {...register("rememberMe")}
                  />

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#0F4C81] dark:text-blue-400 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full text-sm font-semibold tracking-wide"
                    leftIcon={<LogIn className="w-4 h-4" />}
                  >
                    {isSubmitting ? "Authenticating Official Credentials..." : "Authenticate & Sign In"}
                  </Button>
                </div>
              </form>

              {/* Version & Help Tag */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Platform Build: {PLATFORM_INFO.version}</span>
                <Link href="/#contact" className="hover:underline text-[#0F4C81] dark:text-blue-400">
                  Technical Desk Support
                </Link>
              </div>
            </div>

            {/* Demo Accounts Panel */}
            <DemoAccountsPanel
              onSelectAccount={handleSelectDemoAccount}
              selectedEmail={emailValue}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
