export type UserRole =
  | "admin"
  | "authority"
  | "ngo"
  | "staff"
  | "beneficiary"
  | "pmu";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  department: string;
  state?: string;
  district?: string;
  organizationId?: string;
  ngoName?: string;
  avatarUrl?: string;
  badgeNumber?: string;
  phone?: string;
  jurisdiction?: string;
}

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: number;
  rememberMe: boolean;
}

export interface DemoAccount {
  id: string;
  role: UserRole;
  roleTitle: string;
  email: string;
  password: string;
  name: string;
  designation: string;
  department: string;
  jurisdiction: string;
  badge: string;
  route: string;
  description: string;
}

export interface AuthContextType {
  currentUser: User | null;
  role: UserRole | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchDemoAccount: (account: DemoAccount) => Promise<void>;
}
