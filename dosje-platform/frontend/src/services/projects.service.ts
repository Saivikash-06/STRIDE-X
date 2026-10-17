import { apiClient } from "./api-client";
import { Project } from "@/types/admin";

export const projectsService = {
  list: (params?: {
    state?: string;
    district?: string;
    riskLevel?: string;
    status?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.state) query.set("state", params.state);
    if (params?.district) query.set("district", params.district);
    if (params?.riskLevel) query.set("risk_level", params.riskLevel);
    if (params?.status) query.set("status", params.status);
    const qs = query.toString();
    return apiClient<Project[]>(qs ? `/projects?${qs}` : "/projects");
  },

  getById: (id: string) => apiClient<Project>(`/projects/${id}`),
};
