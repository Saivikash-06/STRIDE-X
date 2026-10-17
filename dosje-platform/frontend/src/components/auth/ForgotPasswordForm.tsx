"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Logo } from "@/components/landing/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useToast } from "@/hooks/useToast";

export const ForgotPasswordForm: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setError("Please enter a valid registered official email address.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      showToast({
        type: "success",
        title: "Reset Dispatch Issued",
        message: `A secure password reset link has been dispatched to ${email}`,
      });
    }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-6">
      <div className="max-w-md w-full mx-auto flex items-center justify-between py-2">
        <Link href="/" className="inline-flex">
          <Logo size="sm" isLink={false} />
        </Link>
        <ThemeToggle compact />
      </div>

      <div className="max-w-md w-full mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900 text-[#0F4C81] dark:text-blue-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Official Credential Recovery
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Enter your registered official email address to receive an authorized password recovery token.
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-5">
            <Alert variant="success" title="Recovery Token Dispatched">
              A secure password reset authorization link has been forwarded to <strong className="font-semibold text-emerald-900 dark:text-emerald-200">{email}</strong>. Please check your official inbox and follow the departmental instructions.
            </Alert>

            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Next Steps:</span>
              <p>• The reset token is cryptographically valid for 15 minutes.</p>
              <p>• If you do not receive the email, verify with your Zonal Welfare IT Administrator.</p>
            </div>

            <Link href="/login" className="block w-full">
              <Button variant="primary" size="md" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="error" title="Validation Error">
                {error}
              </Alert>
            )}

            <Input
              label="Registered Official Email"
              type="email"
              placeholder="e.g. dosje.admin@demo.gov"
              isRequired
              leftIcon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText="Must match your official government or grantee NGO email profile."
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full font-semibold"
            >
              {isLoading ? "Dispatching Recovery Link..." : "Send Password Reset Link"}
            </Button>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F4C81] dark:text-blue-400 hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Official Sign In
              </Link>
            </div>
          </form>
        )}
      </div>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-2">
        <span>Department of Social Justice & Empowerment, Government of India</span>
      </div>
    </div>
  );
};
