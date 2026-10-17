import { apiClient } from "./api-client";
import { Beneficiary } from "@/types/admin";

export const beneficiariesService = {
  list: (params?: { state?: string; district?: string; projectId?: string }) => {
    const query = new URLSearchParams();
    if (params?.state) query.set("state", params.state);
    if (params?.district) query.set("district", params.district);
    if (params?.projectId) query.set("project_id", params.projectId);
    const qs = query.toString();
    return apiClient<Beneficiary[]>(qs ? `/beneficiaries?${qs}` : "/beneficiaries");
  },

  getById: (id: string) => apiClient<Beneficiary>(`/beneficiaries/${id}`),
};
