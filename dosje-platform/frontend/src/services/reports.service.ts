import { apiClient } from "./api-client";

export interface NationalKpiSummary {
  totalProjects: number;
  totalSchemes: number;
  totalNgos: number;
  totalBeneficiaries: number;
  openGrievances: number;
  completedInspections: number;
  totalSanctionedCr: number;
  totalUtilizedCr: number;
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
  };
}

export const reportsService = {
  getSummary: () => apiClient<NationalKpiSummary>("/reports/summary"),
};
