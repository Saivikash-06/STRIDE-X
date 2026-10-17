export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export type ProjectStatus = "ACTIVE" | "PENDING_APPROVAL" | "SUSPENDED" | "COMPLETED" | "UNDER_REVIEW";

export type ComplianceStatus = "COMPLIANT" | "NON_COMPLIANT" | "UNDER_AUDIT" | "PENDING_UC";

export type GrievanceStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "ESCALATED";

export type InspectionStatus = "SCHEDULED" | "COMPLETED" | "OVERDUE" | "FLAGGED";

export interface Scheme {
  id: string;
  code: string;
  name: string;
  category: string;
  targetGroup: string;
  budgetAllocatedCr: number;
  budgetReleasedCr: number;
  budgetUtilizedCr: number;
  activeProjectsCount: number;
  beneficiariesCount: number;
  nodalOfficer: string;
  status: "ACTIVE" | "REVIEW";
}

export interface NGO {
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
  complianceScore: number;
  lastAuditDate: string;
  blacklisted: boolean;
}

export interface Project {
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
}

export interface Beneficiary {
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
  state: string;
  district: string;
  disbursedAmount: number;
  lastAttendanceDate: string;
  attendanceRate: number;
}

export interface Grievance {
  id: string;
  grievanceId: string;
  beneficiaryName: string;
  beneficiaryContact: string;
  schemeName: string;
  projectName: string;
  category: "Grant Not Received" | "Poor Facility Infrastructure" | "Food/Ration Quality" | "Harassment/Discrimination" | "False Attendance" | "Other";
  description: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: GrievanceStatus;
  filingDate: string;
  slaDeadline: string;
  assignedAuthority: string;
  resolutionRemarks?: string;
}

export interface Inspection {
  id: string;
  inspectionId: string;
  projectId: string;
  projectName: string;
  ngoName: string;
  state: string;
  district: string;
  inspectorName: string;
  inspectorBadge: string;
  scheduledDate: string;
  completedDate?: string;
  status: InspectionStatus;
  priority: "HIGH" | "MEDIUM" | "ROUTINE";
  geoVerified: boolean;
  geoDistanceMeters: number;
  observationSummary: string;
  photoEvidenceCount: number;
  scorePercent: number;
  criticalDefectsCount: number;
}

export interface ComplianceCase {
  id: string;
  complianceId: string;
  projectId: string;
  projectName: string;
  ngoName: string;
  observation: string;
  type: "UC Submission" | "Fire Safety Clearance" | "Doctor Visit Roster" | "Building Code" | "Financial Audit";
  severity: "CRITICAL" | "HIGH" | "MODERATE";
  deadline: string;
  status: "OPEN" | "IN_PROGRESS" | "RECTIFIED" | "DEFAULTED";
  assignedTo: string;
  penaltyClause: string;
}

export interface AiAlert {
  id: string;
  title: string;
  description: string;
  category: "High Risk Project" | "Attendance Anomaly" | "Repeated Complaint" | "Camera Offline" | "Inspection Overdue" | "Compliance Delay" | "Financial Deviation";
  priority: "CRITICAL" | "HIGH" | "MEDIUM";
  projectId: string;
  projectName: string;
  state: string;
  timestamp: string;
  status: "UNRESOLVED" | "INVESTIGATING" | "RESOLVED";
  suggestedAction: string;
}

export interface CctvCamera {
  id: string;
  cameraName: string;
  projectId: string;
  projectName: string;
  location: string;
  ipAddress: string;
  isOnline: boolean;
  healthIndicator: "HEALTHY" | "DEGRADED" | "OFFLINE";
  lastHeartbeat: string;
  streamUrl: string;
  fps: number;
  resolution: string;
}

export interface ActivityItem {
  id: string;
  type: "PROJECT_REGISTERED" | "INSPECTION_COMPLETED" | "COMPLAINT_RAISED" | "COMPLIANCE_CLOSED" | "RISK_UPDATED" | "ATTENDANCE_UPLOADED" | "CCTV_OFFLINE";
  title: string;
  description: string;
  time: string;
  entityId: string;
  badgeVariant: "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";
}

export interface AuditLogItem {
  id: string;
  user: string;
  role: string;
  action: string;
  module: string;
  timestamp: string;
  ipAddress: string;
  status: "SUCCESS" | "WARNING" | "BLOCKED";
  details: string;
}

export type AdminTab =
  | "overview"
  | "schemes"
  | "projects"
  | "ngos"
  | "beneficiaries"
  | "attendance"
  | "cctv"
  | "grievances"
  | "ai-risk"
  | "inspections"
  | "compliance"
  | "funds"
  | "reports"
  | "notifications"
  | "audit-logs"
  | "settings";
