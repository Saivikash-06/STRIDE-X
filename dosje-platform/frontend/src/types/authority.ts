import { RiskLevel, ProjectStatus, ComplianceStatus, InspectionStatus } from "./admin";

export type AuthorityTab =
  | "overview"
  | "projects"
  | "ngos"
  | "beneficiaries"
  | "attendance"
  | "grievances"
  | "cctv"
  | "ai-risk"
  | "inspections"
  | "compliance"
  | "funds"
  | "reports"
  | "notifications"
  | "profile";

export interface AuthorityProject {
  id: string;
  projectCode: string;
  name: string;
  schemeId: string;
  schemeName: string;
  ngoId: string;
  ngoName: string;
  state: string;
  district: string;
  address: string;
  coordinates: { lat: number; lng: number };
  beneficiariesCount: number;
  riskLevel: RiskLevel;
  riskScore: number;
  status: ProjectStatus;
  inspectionStatus: InspectionStatus;
  complianceStatus: ComplianceStatus;
  sanctionedGrantLakhs: number;
  releasedGrantLakhs: number;
  utilizedGrantLakhs: number;
  startDate: string;
  cctvOnline: boolean;
  biometricActive: boolean;
  attendancePercent: number;
  inspectorName?: string;
  inspectorBadge?: string;
  lastInspectionDate?: string;
  activeComplaintsCount: number;
  complianceObservation?: string;
}

export interface AuthorityNgo {
  id: string;
  darpanId: string;
  name: string;
  state: string;
  district: string;
  registrationNumber: string;
  contactPerson: string;
  email: string;
  phone: string;
  activeProjects: number;
  totalBeneficiaries: number;
  staffCount: number;
  complianceStatus: "VERIFIED" | "UNDER_REVIEW" | "NOTICE_SERVED";
  inspectionScore: number;
  lastAuditDate: string;
  documents: { title: string; type: string; verified: boolean; date: string }[];
}

export interface AuthorityBeneficiary {
  id: string;
  beneficiaryId: string;
  fullName: string;
  gender: "Male" | "Female" | "Other";
  age: number;
  category: "SC" | "OBC" | "Senior Citizen" | "Divyangjan (PwD)" | "Transgender" | "Safai Karamchari";
  aadhaarVerified: boolean;
  dbtAccountLinked: boolean;
  projectId: string;
  projectName: string;
  schemeName: string;
  district: string;
  benefitStatus: "Active Direct Benefit" | "Under Verification" | "Pending Disbursal" | "Suspended";
  attendanceRate: number;
  lastAttendanceDate: string;
  hasActiveGrievance: boolean;
  verificationStatus: "VERIFIED" | "PENDING_AADHAAR" | "FLAGGED_DUPLICATE";
}

export interface AuthorityStaff {
  id: string;
  staffId: string;
  fullName: string;
  role: "Facility Manager" | "Consultant Doctor" | "Vocational Trainer" | "Caregiver / Warden" | "Accountant / MIS";
  projectId: string;
  projectName: string;
  district: string;
  phone: string;
  aadhaarVerified: boolean;
  joinedDate: string;
  active: boolean;
}

export interface AuthorityGrievance {
  id: string;
  grievanceId: string;
  beneficiaryName: string;
  beneficiaryContact: string;
  projectId: string;
  projectName: string;
  schemeName: string;
  district: string;
  category: "Grant Not Received" | "Poor Facility Infrastructure" | "Food/Ration Quality" | "Harassment/Discrimination" | "False Attendance" | "Other";
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING" | "VERIFIED" | "RESOLVED" | "REJECTED";
  filingDate: string;
  slaDeadline: string;
  assignedOfficer: string;
  description: string;
  resolutionRemarks?: string;
}

export interface AuthorityInspection {
  id: string;
  inspectionId: string;
  projectId: string;
  projectName: string;
  ngoName: string;
  district: string;
  inspectorName: string;
  inspectorBadge: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "ROUTINE";
  status: "COMPLETED" | "SCHEDULED" | "FLAGGED" | "OVERDUE";
  assignedDate: string;
  dueDate: string;
  completedDate?: string;
  geoVerified: boolean;
  geoDistanceMeters: number;
  scorePercent: number;
  photoEvidenceCount: number;
  observationSummary: string;
  criticalDefectsCount: number;
}

export interface AuthorityComplianceCase {
  id: string;
  complianceId: string;
  projectId: string;
  projectName: string;
  ngoName: string;
  district: string;
  type: "UC Submission" | "Fire Safety Clearance" | "Doctor Visit Roster" | "Building Code" | "Financial Audit";
  observation: string;
  severity: "CRITICAL" | "HIGH" | "MODERATE";
  deadline: string;
  status: "OPEN" | "IN_PROGRESS" | "RECTIFIED" | "DEFAULTED";
  assignedOfficer: string;
  actionRequired: string;
}

export interface AuthorityAiAlert {
  id: string;
  alertId: string;
  projectId: string;
  projectName: string;
  district: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  category: "Attendance Drop" | "Repeated Complaints" | "CCTV Offline" | "Previous Non-compliance" | "Inspection Failure";
  riskScore: number;
  title: string;
  explanation: string;
  timestamp: string;
  recommendedAction: string;
  status: "ACTIVE" | "INVESTIGATING" | "RESOLVED";
}

export interface AuthorityCctvCamera {
  id: string;
  cameraId: string;
  name: string;
  projectId: string;
  projectName: string;
  district: string;
  locationDescription: string;
  online: boolean;
  lastActive: string;
  ipAddress: string;
  resolution: string;
  fps: number;
  alertStatus: "NORMAL" | "MOTION_ALERT" | "OFFLINE_WARNING" | "TAMPER_DETECTED";
  previewUrl: string;
}

export interface AuthorityFundAllocation {
  id: string;
  schemeId: string;
  schemeName: string;
  allocatedCr: number;
  releasedCr: number;
  utilizedCr: number;
  utilizationPercent: number;
  districtsCovered: number;
  activeProjects: number;
  ucPendingCr: number;
}

export interface AuthorityReportCard {
  id: string;
  title: string;
  category: "Projects" | "Beneficiaries" | "Attendance" | "Grievances" | "Inspection" | "Compliance" | "Fund Utilization" | "Risk Report";
  description: string;
  period: string;
  generatedDate: string;
  fileSize: string;
  format: "PDF" | "CSV" | "XLSX";
  recordsCount: number;
}

export interface AuthorityNotificationItem {
  id: string;
  title: string;
  description: string;
  type: "INSPECTION_ASSIGNED" | "NEW_GRIEVANCE" | "HIGH_RISK_ALERT" | "CCTV_OFFLINE" | "ATTENDANCE_ALERT" | "COMPLIANCE_DUE" | "FUND_ALERT";
  timestamp: string;
  read: boolean;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "INFO";
  linkTab: AuthorityTab;
}

export interface AuthorityProfile {
  name: string;
  role: string;
  assignedState: string;
  assignedDistricts: string[];
  department: string;
  email: string;
  phone: string;
  officeAddress: string;
  badgeNumber: string;
  lastLogin: string;
}
