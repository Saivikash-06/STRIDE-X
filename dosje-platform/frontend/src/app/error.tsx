"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/landing/Logo";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("STRIDE-X Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col justify-between p-4 sm:p-6">
      <div className="max-w-xl w-full mx-auto py-2">
        <Link href="/" className="inline-flex">
          <Logo size="sm" isLink={false} />
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto">
        <Card className="p-8 sm:p-10 border-slate-200 dark:border-slate-800 shadow-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-900">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded bg-rose-100 dark:bg-rose-950/80 inline-block mb-3">
              Error Code 500 • System Fault
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              STRIDE-X encountered an unexpected error.
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              An unexpected runtime exception was intercepted by the STRIDE-X security barrier. Telemetry logs have been captured for vigilance review.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => reset()}
              className="w-full sm:w-auto"
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Retry Operation
            </Button>
            <Link href="/admin" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                className="w-full sm:w-auto"
                leftIcon={<Home className="w-4 h-4" />}
              >
                Return to STRIDE-X Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-2">
        <span>STRIDE-X • Department of Social Justice & Empowerment • Government of India</span>
      </div>
    </div>
  );
}
