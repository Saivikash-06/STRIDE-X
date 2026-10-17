import { apiClient } from "./api-client";
import { Scheme } from "@/types/admin";

export const schemesService = {
  list: (status?: string) =>
    apiClient<Scheme[]>(
      status ? `/schemes?status=${encodeURIComponent(status)}` : "/schemes"
    ),

  getById: (id: string) => apiClient<Scheme>(`/schemes/${id}`),
};
