"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthContextType, AuthSession, DemoAccount, User, UserRole } from "@/types/auth";
import { DEMO_ACCOUNTS, ROLE_DEFAULT_ROUTES } from "@/constants/demoAccounts";
import { authApi, ApiError } from "@/lib/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "dosje_auth_session";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load session from localStorage on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsedSession: AuthSession = JSON.parse(stored);
        // Check session expiration
        if (parsedSession.expiresAt && Date.now() < parsedSession.expiresAt) {
          setSession(parsedSession);
        } else {
          // Session expired
          localStorage.removeItem(AUTH_STORAGE_KEY);
          setSession(null);
        }
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string,
      rememberMe: boolean = false
    ): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      const normalizedEmail = email.trim().toLowerCase();

      // 1. Try Live Backend Authentication First
      try {
        const authData = await authApi.login(normalizedEmail, password, rememberMe);
        if (authData?.access_token) {
          // Fetch real user profile from server
          const userProfile = await authApi.me();
          const user: User = {
            id: userProfile.id,
            name: userProfile.name,
            email: userProfile.email,
            role: userProfile.role,
            designation: userProfile.designation,
            department: userProfile.department,
            badgeNumber: userProfile.badgeNumber,
            jurisdiction: userProfile.jurisdiction,
            state: userProfile.state,
            district: userProfile.district,
            organizationId: userProfile.organizationId,
          };

          const validityDuration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
          const liveSession: AuthSession = {
            token: authData.access_token,
            user,
            expiresAt: Date.now() + validityDuration,
            rememberMe,
          };

          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(liveSession));
          setSession(liveSession);
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          // If server returned 401 or specific error, report it directly
          if (err.status === 401 || err.status === 403) {
            setIsLoading(false);
            return { success: false, error: err.detail || "Invalid credentials." };
          }
        }
        // If backend server is unreachable (NetworkError), log and continue to demo account simulation
      }

      // 2. Fallback to Local Demo Accounts when backend is offline
      const matchedAccount = DEMO_ACCOUNTS.find(
        (acc) => acc.email.toLowerCase() === normalizedEmail
      );

      if (!matchedAccount) {
        setIsLoading(false);
        return {
          success: false,
          error: "Account not found. Please verify the official email address or select a role from the Demo Login Panel.",
        };
      }

      if (matchedAccount.password !== password) {
        setIsLoading(false);
        return {
          success: false,
          error: "Invalid password. For demo accounts, use 'Demo@123' or click the auto-fill buttons.",
        };
      }

      const user: User = {
        id: matchedAccount.id,
        name: matchedAccount.name,
        email: matchedAccount.email,
        role: matchedAccount.role,
        designation: matchedAccount.designation,
        department: matchedAccount.department,
        badgeNumber: matchedAccount.badge,
        jurisdiction: matchedAccount.jurisdiction,
      };

      const validityDuration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      const newSession: AuthSession = {
        token: `mock_jwt_gov_${matchedAccount.role}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        user,
        expiresAt: Date.now() + validityDuration,
        rememberMe,
      };

      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newSession));
      } catch {
        // Handle localStorage limits or storage disabled
      }

      setSession(newSession);
      setIsLoading(false);
      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    setSession(null);
    router.push("/login");
  }, [router]);

  const switchDemoAccount = useCallback(
    async (account: DemoAccount) => {
      await login(account.email, account.password, true);
      const targetRoute = ROLE_DEFAULT_ROUTES[account.role] || "/admin";
      router.push(targetRoute);
    },
    [login, router]
  );

  const currentUser = session ? session.user : null;
  const role: UserRole | null = currentUser ? currentUser.role : null;
  const isAuthenticated = !!session && !!session.user;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        session,
        isAuthenticated,
        isLoading,
        login,
        logout,
        switchDemoAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
