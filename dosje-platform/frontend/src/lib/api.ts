import { User, UserRole } from "@/types/auth";
import { Scheme, Project, Beneficiary, Grievance, Inspection, AiAlert, CctvCamera } from "@/types/admin";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const sessionStr = localStorage.getItem("dosje_auth_session");
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      if (session?.token) {
        return { Authorization: `Bearer ${session.token}` };
      }
    }
  } catch {
    // Ignore storage parse issues
  }
  return {};
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson.detail) {
        errorMessage = errorJson.detail;
      }
    } catch {
      // Body not JSON
    }
    throw new ApiError(response.status, errorMessage);
  }

  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Typed API Client Submodules
// ---------------------------------------------------------------------------

export const healthApi = {
  check: () => request<{ status: string; service: string; version: string; database: string }>("/health"),
};

export const authApi = {
  login: (email: string, password: string, rememberMe: boolean = false) =>
    request<{ access_token: string; refresh_token: string; token_type: string; expires_in: number }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password, remember_me: rememberMe }),
      }
    ),
  me: () => request<User>("/auth/me"),
  logout: () => request<{ message: string; success: boolean }>("/auth/logout", { method: "POST" }),
};

export const schemesApi = {
  list: (status?: string) =>
    request<Scheme[]>(status ? `/schemes?status=${encodeURIComponent(status)}` : "/schemes"),
  getById: (id: string) => request<Scheme>(`/schemes/${id}`),
};

export const projectsApi = {
  list: (params?: { state?: string; district?: string; riskLevel?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.state) query.set("state", params.state);
    if (params?.district) query.set("district", params.district);
    if (params?.riskLevel) query.set("risk_level", params.riskLevel);
    if (params?.status) query.set("status", params.status);
    const qs = query.toString();
    return request<Project[]>(qs ? `/projects?${qs}` : "/projects");
  },
  getById: (id: string) => request<Project>(`/projects/${id}`),
};

export const beneficiariesApi = {
  list: (params?: { state?: string; district?: string; projectId?: string }) => {
    const query = new URLSearchParams();
    if (params?.state) query.set("state", params.state);
    if (params?.district) query.set("district", params.district);
    if (params?.projectId) query.set("project_id", params.projectId);
    const qs = query.toString();
    return request<Beneficiary[]>(qs ? `/beneficiaries?${qs}` : "/beneficiaries");
  },
};

export const auditsApi = {
  list: (params?: { status?: string; priority?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.priority) query.set("priority", params.priority);
    const qs = query.toString();
    return request<Inspection[]>(qs ? `/audits?${qs}` : "/audits");
  },
};

export const grievancesApi = {
  list: (params?: { status?: string; priority?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.priority) query.set("priority", params.priority);
    const qs = query.toString();
    return request<Grievance[]>(qs ? `/grievances?${qs}` : "/grievances");
  },
  create: (data: { beneficiary_name: string; project_id: string; category: string; description: string; priority: string; filing_date: string; sla_deadline: string }) =>
    request<Grievance>("/grievances", { method: "POST", body: JSON.stringify(data) }),
};

export const monitoringApi = {
  anomalies: (status?: string) =>
    request<AiAlert[]>(status ? `/monitoring/anomalies?status=${encodeURIComponent(status)}` : "/monitoring/anomalies"),
  cctv: () => request<CctvCamera[]>("/monitoring/cctv"),
};

export const reportsApi = {
  summary: () =>
    request<{
      totalProjects: number;
      totalSchemes: number;
      totalNgos: number;
      totalBeneficiaries: number;
      openGrievances: number;
      completedInspections: number;
      totalSanctionedCr: number;
      totalUtilizedCr: number;
      riskDistribution: { high: number; medium: number; low: number };
    }>("/reports/summary"),
};
