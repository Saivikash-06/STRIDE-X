import { apiClient } from "./api-client";
import { User } from "@/types/auth";

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export const authService = {
  login: (email: string, password: string, rememberMe: boolean = false) =>
    apiClient<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, remember_me: rememberMe }),
    }),

  me: () => apiClient<User>("/auth/me"),

  logout: () =>
    apiClient<{ message: string; success: boolean }>("/auth/logout", {
      method: "POST",
    }),
};
