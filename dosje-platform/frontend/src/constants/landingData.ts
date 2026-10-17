export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  tag: string;
  iconName: string;
  colorScheme: string;
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  metric: string;
  iconName: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  numericTarget: number;
  suffix: string;
  change: string;
  trend: "up" | "neutral" | "down";
  subtext: string;
  iconName: string;
}

export const APP_NAME = "STRIDE-X";
export const APP_SHORT_NAME = "SX";
export const APP_TAGLINE = "Smart Tracking & Real-time Inspection for Development and Empowerment";

export const PLATFORM_INFO = {
  name: "STRIDE-X",
  fullName: "STRIDE-X – Smart Tracking & Real-time Inspection for Development and Empowerment",
  shortName: "STRIDE-X Platform",
  abbr: "STRIDE-X",
  subtitle: "Smart Tracking & Real-time Inspection for Development and Empowerment",
  tagline: "Smart Tracking & Real-time Inspection for Development and Empowerment",
  department: "Department of Social Justice & Empowerment",
  ministry: "Ministry of Social Justice & Empowerment",
  government: "Government of India",
  version: "v1.0.0 (STRIDE-X Production Release)",
  helpline: "1800-11-2001 (Toll-Free 24x7)",
  email: "support-stridex@dosje.gov.in",
  address: "Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001",
};

export const FEATURES: FeatureItem[] = [
  {
    id: "ai-monitoring",
    title: "AI Live Monitoring",
    description: "Continuous anomaly detection and automated variance auditing across welfare facility operations and records.",
    tag: "Autonomous AI",
    iconName: "BrainCircuit",
    colorScheme: "blue",
  },
  {
    id: "risk-analysis",
    title: "Intelligent Risk Scoring",
    description: "Predictive threat assessment indexing NGOs and projects by historical non-compliance and budget discrepancies.",
    tag: "Predictive ML",
    iconName: "ShieldAlert",
    colorScheme: "red",
  },
  {
    id: "cctv-monitoring",
    title: "CCTV Telemetry & Feeds",
    description: "Automated verification of facility operation hours, crowd density metrics, and infrastructure availability.",
    tag: "Computer Vision",
    iconName: "Camera",
    colorScheme: "teal",
  },
  {
    id: "attendance-analytics",
    title: "Biometric Attendance Insights",
    description: "Facial-recognition & biometric telemetry preventing proxy punches and ensuring actual beneficiary residency.",
    tag: "Biometric Verification",
    iconName: "UsersCheck",
    colorScheme: "indigo",
  },
  {
    id: "geo-tagged-inspection",
    title: "Geo-Fenced Inspections",
    description: "Tamper-proof GPS-tagged photo audits and PMU inspector route verification with offline sync resilience.",
    tag: "GIS & Geo-tagging",
    iconName: "MapPinCheck",
    colorScheme: "emerald",
  },
  {
    id: "compliance-tracking",
    title: "Statutory Compliance Matrix",
    description: "Real-time tracking of utilization certificates (UC), fire clearances, medical registrations, and building codes.",
    tag: "Regulatory Audit",
    iconName: "FileCheck2",
    colorScheme: "amber",
  },
  {
    id: "beneficiary-verification",
    title: "Aadhaar e-KYC Verification",
    description: "Instant deduplication and entitlement verification directly mapped with National Welfare Registries.",
    tag: "Identity Governance",
    iconName: "Fingerprint",
    colorScheme: "cyan",
  },
  {
    id: "fund-monitoring",
    title: "Public Finance & PFMS Sync",
    description: "Direct end-to-end tracing of grant disbursements, installment releases, and unspent balance reconciliation.",
    tag: "Financial Integrity",
    iconName: "CircleDollarSign",
    colorScheme: "violet",
  },
  {
    id: "reports",
    title: "Executive Analytics & MIS",
    description: "Automated generation of Parliamentary Q&A reports, district heatmaps, and downloadable compliance digests.",
    tag: "National MIS",
    iconName: "FileSpreadsheet",
    colorScheme: "slate",
  },
  {
    id: "notifications",
    title: "Multi-Channel Escalations",
    description: "Automated SMS, email, and portal summons dispatched to erring grantees upon critical compliance defaults.",
    tag: "Alert Dispatch",
    iconName: "BellRing",
    colorScheme: "orange",
  },
];

export const BENEFITS: BenefitItem[] = [
  {
    id: "transparency",
    title: "100% Traceability & Audit Trails",
    description: "Every inspection log, geotag, and grant approval is cryptographically logged with immutable timestamps.",
    metric: "100% Verifiable",
    iconName: "Sparkles",
  },
  {
    id: "fraud-prevention",
    title: "Real-time Ghost Beneficiary Detection",
    description: "AI pattern recognition highlights duplicate enrollment, inactive centres, and fraudulent reimbursement claims.",
    metric: "98.7% Accuracy",
    iconName: "ShieldCheck",
  },
  {
    id: "rapid-inspection",
    title: "65% Faster Inspection Turnaround",
    description: "Automated mobile checklists and offline-first reporting slash audit report completion from weeks to minutes.",
    metric: "3.5x Faster",
    iconName: "Zap",
  },
  {
    id: "streamlined-grievance",
    title: "Integrated Citizen Grievance Portal",
    description: "Direct lodging of welfare entitlement concerns by beneficiaries with strict SLA escalation tracking.",
    metric: "< 48 Hrs SLA",
    iconName: "Headphones",
  },
  {
    id: "data-driven",
    title: "Actionable High-Level Intelligence",
    description: "Ministerial and State dashboards provide real-time KPI overviews to allocate funding where impact is highest.",
    metric: "Live Telemetry",
    iconName: "TrendingUp",
  },
  {
    id: "empowerment",
    title: "Empowering Marginalized Communities",
    description: "Assures rightful benefits reach scheduled castes, backward classes, senior citizens, and persons with disabilities.",
    metric: "1.8M+ Citizens",
    iconName: "HeartHandshake",
  },
];

export const STATISTICS: StatItem[] = [
  {
    id: "projects",
    label: "Active Welfare Projects",
    value: "2,480+",
    numericTarget: 2480,
    suffix: "+",
    change: "+12.4%",
    trend: "up",
    subtext: "Centrally sponsored & state schemes",
    iconName: "FolderKanban",
  },
  {
    id: "beneficiaries",
    label: "Verified Beneficiaries",
    value: "1.84M",
    numericTarget: 1840000,
    suffix: "M",
    change: "+8.9%",
    trend: "up",
    subtext: "Aadhaar e-KYC authenticated recipients",
    iconName: "Users",
  },
  {
    id: "ngos",
    label: "Empaneled Grantee NGOs",
    value: "865",
    numericTarget: 865,
    suffix: "",
    change: "100% Vetted",
    trend: "neutral",
    subtext: "Monitored non-governmental entities",
    iconName: "Building2",
  },
  {
    id: "states",
    label: "Participating States & UTs",
    value: "36",
    numericTarget: 36,
    suffix: " All-India",
    change: "Pan-India",
    trend: "neutral",
    subtext: "Complete nation-wide deployment",
    iconName: "Map",
  },
  {
    id: "inspections",
    label: "Completed Field Audits",
    value: "14,350+",
    numericTarget: 14350,
    suffix: "+",
    change: "+24.1%",
    trend: "up",
    subtext: "Geo-tagged physical inspections",
    iconName: "ClipboardCheck",
  },
  {
    id: "risk-alerts",
    label: "AI Compliance Alerts Resolved",
    value: "99.4%",
    numericTarget: 99.4,
    suffix: "%",
    change: "+4.2%",
    trend: "up",
    subtext: "Proactive risk mitigation score",
    iconName: "AlertTriangle",
  },
];
