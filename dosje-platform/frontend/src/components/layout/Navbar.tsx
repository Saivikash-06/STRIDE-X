"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, LogIn, LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import { Logo } from "@/components/landing/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_DEFAULT_ROUTES } from "@/constants/demoAccounts";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, currentUser, role, logout } = useAuth();

  const navLinks = [
    { label: "Features", href: "/#features" },
    { label: "Benefits", href: "/#benefits" },
    { label: "Statistics", href: "/#statistics" },
    { label: "About STRIDE-X", href: "/#about" },
    { label: "Contact & Desk", href: "/#contact" },
  ];

  const userDashboardRoute = role ? ROLE_DEFAULT_ROUTES[role] || "/admin" : "/login";

  return (
    <nav className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 py-2 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-[#0F4C81] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Action Area */}
          <div className="hidden sm:flex items-center space-x-3">
            <ThemeToggle compact />

            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-2">
                <Link href={userDashboardRoute}>
                  <Button
                    size="sm"
                    variant="primary"
                    leftIcon={<LayoutDashboard className="w-3.5 h-3.5" />}
                  >
                    <span>Dashboard ({currentUser.role.toUpperCase()})</span>
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={logout}
                  title="Sign Out"
                  aria-label="Sign Out"
                  leftIcon={<LogOut className="w-3.5 h-3.5" />}
                >
                  <span className="sr-only sm:not-sr-only">Logout</span>
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<LogIn className="w-4 h-4" />}
                >
                  Portal Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center space-x-2">
            <ThemeToggle compact />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={isOpen ? "Close main navigation menu" : "Open main navigation menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            {isAuthenticated && currentUser ? (
              <>
                <div className="px-3 py-2 rounded-md bg-slate-50 dark:bg-slate-800/60 text-xs">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-[#0F4C81]" />
                    {currentUser.name}
                  </div>
                  <div className="text-slate-500 text-[10px] mt-0.5">{currentUser.designation}</div>
                </div>
                <Link href={userDashboardRoute} onClick={() => setIsOpen(false)}>
                  <Button variant="primary" size="md" className="w-full" leftIcon={<LayoutDashboard className="w-4 h-4" />}>
                    Enter Dashboard ({currentUser.role})
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="primary" size="md" className="w-full" leftIcon={<LogIn className="w-4 h-4" />}>
                  Officer & Stakeholder Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
