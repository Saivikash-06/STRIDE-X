# ============================================================================
# FILE NAME      : Frontend_02_DoSJE_Admin_Dashboard.md
# PROJECT        : DoSJE Welfare Monitoring & Compliance Platform
# PROBLEM STATEMENT : SIH 2026 - PS095
# MODULE         : Frontend Module 2 – DoSJE Central Admin Dashboard
# VERSION        : 1.0.0
# STATUS         : COMPLETED & PRODUCTION-READY
# ============================================================================

## 1. Overview
This module delivers the complete **DoSJE Central Administrator Command Dashboard** located at [`/admin`](file:///c:/DLCO/dosje-platform/src/app/admin/page.tsx). It acts as the national command center for the **Department of Social Justice & Empowerment (DoSJE), Government of India**.

---

## 2. Implemented Architecture & Features

### 🏛️ 1. National Command Center Layout
- **Sticky Header**: DoSJE Emblem & Logo, National Command Center title, Global search bar, Notification popover with live unread counts, Theme toggle (Light/Dark/System), Officer Profile dropdown, and Session Logout.
- **Left Sidebar**: 16 dedicated platform modules with live status badges.
- **Breadcrumb Navigation**: Live tracking of current active module with Level 1 Central IAS Clearance indicator.
- **Role Guard**: Protected by [`ProtectedRoute`](file:///c:/DLCO/dosje-platform/src/components/auth/ProtectedRoute.tsx) ensuring only authenticated Central Administrators (`admin` role) have access.

---

### 📊 2. Dashboard Home (`OverviewTab.tsx`)
- **9 High-Level KPI Cards**:
  1. **Total Schemes**: 8 Centrally Sponsored Schemes
  2. **Active Projects**: 2,480+ Nationwide Facilities (+12.4%)
  3. **Total NGOs**: 865 Empaneled & 100% Vetted
  4. **Total Beneficiaries**: 1.84M Citizens (+8.9%)
  5. **High Risk Projects**: 90 Flagged Facilities (-4.2% mitigated)
  6. **Pending Grievances**: 142 Active Tickets (<48h SLA)
  7. **Pending Inspections**: 342 Scheduled Field Audits (+24.1%)
  8. **Non-Compliant Projects**: 90 Statutory Defaults Flagged
  9. **Fund Utilization**: 91.8% Effective Utilization (₹4,115 Cr UC Verified)

- **8 Interactive Charts (Recharts)**:
  1. **Scheme Distribution**: Pie/Donut chart breaking down projects across schemes.
  2. **State-wise Facilities & Risk**: Grouped bar chart comparing projects, audits, and risk across top 10 states.
  3. **Beneficiary Growth**: Dual-area chart tracking enrolled vs. Aadhaar e-KYC verified citizens.
  4. **Complaint Trends**: Area chart comparing monthly grievances received vs. resolved.
  5. **Inspection Completion**: Target vs. completed physical audits bar chart.
  6. **Statutory Compliance Breakdown**: Donut chart of compliant vs. pending UC vs. non-compliant projects.
  7. **Risk Distribution**: Pie chart illustrating low, moderate, and high risk index distribution.
  8. **Fund Utilization Outlay**: Stacked bar chart analyzing sanctioned vs. released vs. utilized budget in ₹ Crores.

- **Interactive India Map Module (`IndiaInteractiveMap.tsx`)**:
  - Live vector projection of Indian states with GPS facility coordinates.
  - Interactive filter chips: All Hubs, Projects (25), High Risk (3), and Inspection Alerts.
  - Interactive clickable markers with detail modal popup displaying project name, scheme, NGO, beneficiaries, grant size, risk score, and CCTV status.

- **AI Anomaly Alert Panel**:
  - Real-time statutory anomaly cards with severity indicators and 1-click execution for emergency PMU physical audits or statutory show-cause summons.

- **National Activity Timeline**:
  - Continuous log of cross-departmental operations (inspections completed, complaints raised, attendance uploaded).

---

### 📑 3. Dedicated Platform Sub-Modules
1. **Scheme Management (`SchemesTab.tsx`)**: Outlay and utilization progress bars for 8 Central Schemes (PM-AJAY, SMILE, NAPSrC, NMBA, SIPDA, SHREYAS, NAMASTE, PM-DAKSH) with scheme registration modal.
2. **Projects Master Directory (`ProjectsTab.tsx`)**: Master table of 25 projects with search, state/risk filtering, multi-column sorting, pagination, CSV export, and full dossier modal.
3. **Empaneled NGOs (`NgosTab.tsx`)**: Directory of 10 NGOs with Darpan IDs, compliance scores, registration numbers, contact details, and audit records.
4. **Beneficiary Directory (`BeneficiariesTab.tsx`)**: Searchable roster of 150 beneficiaries with Aadhaar e-KYC status, DBT link status, caste/social category, and attendance rates.
5. **Biometric Attendance (`AttendanceTab.tsx`)**: Weekly biometric punch line chart, daily check-in counts, proxy punch detection flags, and center-level telemetry.
6. **CCTV Telemetry (`CctvTab.tsx`)**: Live feed status for 15 cameras, heartbeat latency, resolution, FPS, health indicator, and interactive stream inspection modal.
7. **Grievance Desk (`GrievancesTab.tsx`)**: 40 grievance tickets with priority classification, SLA deadlines, assigned state authorities, and redressal modal.
8. **AI Risk Engine (`AiRiskTab.tsx`)**: 30 algorithmic risk flags categorized by attendance anomalies, fund delays, and physical deviations with mitigation protocols.
9. **Inspection Audits (`InspectionsTab.tsx`)**: 20 PMU field inspection dossiers with GPS geo-fencing tolerance (±4m to ±15m), photo evidence counts, and quality scores.
10. **Statutory Compliance (`ComplianceTab.tsx`)**: 12 compliance cases tracking fire safety, building codes, doctor visit rosters, and GFR-19A utilization certificates.
11. **Public Finance & PFMS (`FundsTab.tsx`)**: Complete financial breakdown of ₹5,205 Cr outlay with sanctioned vs. released vs. utilized budget tables.
12. **National MIS Reports (`ReportsTab.tsx`)**: 8 report types with PDF/Excel preview modals and simulated encrypted downloads.
13. **Notification Center (`NotificationsTab.tsx`)**: Alert inbox with priority filtering and mark-as-read functionality.
14. **Vigilance Audit Trail (`AuditLogsTab.tsx`)**: Immutable timeline recording official user, clearance role, action, target module, IP, and status.
15. **Settings (`SettingsTab.tsx`)**: Central administrator profile management, theme selection, notification preferences, and telemetry polling frequency.

---

## 4. Key Files Created
- Model Types: [`src/types/admin.ts`](file:///c:/DLCO/dosje-platform/src/types/admin.ts)
- Comprehensive Mock Data: [`src/mock/adminMockData.ts`](file:///c:/DLCO/dosje-platform/src/mock/adminMockData.ts)
- Interactive Charts: [`src/components/admin/charts/ChartComponents.tsx`](file:///c:/DLCO/dosje-platform/src/components/admin/charts/ChartComponents.tsx)
- India Map: [`src/components/admin/map/IndiaInteractiveMap.tsx`](file:///c:/DLCO/dosje-platform/src/components/admin/map/IndiaInteractiveMap.tsx)
- Header & Sidebar: [`AdminHeader.tsx`](file:///c:/DLCO/dosje-platform/src/components/admin/AdminHeader.tsx), [`AdminSidebar.tsx`](file:///c:/DLCO/dosje-platform/src/components/admin/AdminSidebar.tsx)
- Master Layout: [`src/components/admin/AdminLayout.tsx`](file:///c:/DLCO/dosje-platform/src/components/admin/AdminLayout.tsx)
- Admin Route Page: [`src/app/admin/page.tsx`](file:///c:/DLCO/dosje-platform/src/app/admin/page.tsx)
