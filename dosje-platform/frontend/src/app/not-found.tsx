import React from "react";
import Link from "next/link";
import { Compass, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/landing/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-6">
      <div className="max-w-xl w-full mx-auto py-2">
        <Link href="/" className="inline-flex">
          <Logo size="sm" isLink={false} />
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto">
        <Card className="p-8 sm:p-10 border-slate-200 dark:border-slate-800 shadow-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-[#0F4C81] dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-900">
            <Compass className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 inline-block mb-3">
              Error Code 404 • Resource Not Located
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              The requested official URL does not exist or has been relocated under updated STRIDE-X portal routing directives.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/admin" className="w-full sm:w-auto">
              <Button variant="primary" size="md" className="w-full sm:w-auto" leftIcon={<Home className="w-4 h-4" />}>
                Return to STRIDE-X Dashboard
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto" leftIcon={<LogIn className="w-4 h-4" />}>
                Portal Login
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
