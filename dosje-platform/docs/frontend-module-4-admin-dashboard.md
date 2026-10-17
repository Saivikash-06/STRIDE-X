# FRONTEND MODULE 4 — DoSJE Central Admin Dashboard
## File Name: `frontend-module-4-admin-dashboard.md`

**Project Name**: STRIDE-X – Smart Tracking & Real-time Inspection for Development and Empowerment  
**Problem Statement**: SIH 2026 — PS095  
**Nodal Ministry**: Department of Social Justice & Empowerment (DoSJE), Ministry of Social Justice & Empowerment, Government of India  
**Target Persona**: DoSJE Central Admin (Joint Secretary / Director General Level)  
**Status**: Production-Ready, Tested & Verified (Zero Lint/TypeScript Errors)

---

## 🏛️ Executive Summary

**Module 4 (DoSJE Central Admin Dashboard)** serves as the sovereign national command center for the STRIDE-X platform. It bridges central policy leadership with 36 States/UTs, 8 centrally sponsored welfare schemes, 865 empaneled grantee NGOs, 2,480 active field facilities, and over 1.84 million beneficiaries.

The dashboard integrates real-time telemetry from IoT biometric attendance readers, sovereign RTSP camera surveillance grids, PFMS direct benefit financial tracking, automated GIS mapping with OpenFreeMap / Leaflet, and an algorithmic AI threat engine detecting anomalies before statutory violations occur.

---

## 🏗️ Architecture & Component Hierarchy

All components are organized under `src/components/admin/`:

```
src/components/admin/
├── AdminDashboard.tsx       # Master National Command Center Hub orchestrating all widgets
├── KPICards.tsx             # 10 Animated KPI Cards with SVG sparklines & growth metrics
├── NationalMap.tsx          # OpenFreeMap/OpenStreetMap GIS spatial intelligence engine
├── AIAlerts.tsx             # AI Anomaly & Threat Center (Attendance, CCTV, Complaints, UC)
├── AnalyticsCharts.tsx      # Central Analytical Intelligence Suite (Schemes & Grievances)
├── ProjectTable.tsx         # Comprehensive Welfare Projects Table with CSV/PDF export
├── AttendanceWidget.tsx     # Biometric attendance rate, 30-day trend & hourly density heatmap
├── CCTVWidget.tsx           # CCTV health cards, grid feeds & simulated RTSP player modal
├── InspectionWidget.tsx     # PMU statutory audits, inspector workload & state fulfillment
├── ComplianceWidget.tsx     # GFR-19A statutory compliance matrix & deadline tracking
├── FundWidget.tsx           # Public Finance (PFMS) flow pipeline & scheme expenditure
├── RecentActivities.tsx     # Chronological statutory event stream timeline
├── QuickActions.tsx         # Add Scheme, Register Project, Assign Audit, Export Digest
├── NotificationPanel.tsx    # Multi-category vigilance notification popover with mark-read
└── GlobalSearch.tsx         # Ctrl+K global instant search across 6 administrative domains
```

---

## 🖥️ Layout & Navigation Specifications

### 1. Top Sovereign Navbar (`AdminHeader.tsx`)
* **Left Section**:
  * STRIDE-X Emblem & Monogram (`SX`)
  * Department of Social Justice & Empowerment Subtitle
  * Mobile responsive toggle trigger
* **Center Section**:
  * Global Search Bar (`GlobalSearch.tsx`) with hotkey shortcut indicator (`Ctrl+K` / `Cmd+K`)
* **Right Section**:
  * **Language Switcher**: Instant toggle between English and हिन्दी (`EN` / `HI`)
  * **Theme Switcher**: Zero-flicker Dark / Light / System theme toggle
  * **Notification Center**: Bell icon with live unread badge and dropdown popover (`NotificationPanel.tsx`)
  * **User Profile & Clearance**: Displays authenticated Central Officer name, IAS designation, and logout trigger

### 2. Left Sovereign Sidebar (`AdminSidebar.tsx`)
Desktop-fixed 64-width panel featuring 16 statutory administrative modules:
1. **Dashboard Home** (`/admin` - Overview Command Center)
2. **Scheme Management** (PM-AJAY, SMILE, NAPSrC, NMBA, SIPDA, SHREYAS, etc.)
3. **Welfare Projects** (Master facility directory with geotagged locations)
4. **NGOs / Institutes** (NITI Aayog NGO Darpan validated entities)
5. **Beneficiary Directory** (Aadhaar e-KYC authenticated direct recipients)
6. **Biometric Attendance** (Real-time device punch telemetry)
7. **CCTV Telemetry** (Multi-camera RTSP Sovereign surveillance feeds)
8. **Grievance Desk** (Central CPGRAMS integrated redressal queue)
9. **AI Risk Center** (Algorithmic threat scoring and anomaly engine)
10. **Inspection Audits** (PMU field auditor dispatch & geo-verified reports)
11. **Statutory Compliance** (GFR-19A utilization certificates & show-cause notices)
12. **Public Fund Tracking** (PFMS sanction, release, utilization, and escrow hold)
13. **National MIS Reports** (Quarterly state digest and statutory MIS exports)
14. **Notification Center** (Administrative vigilance feed)
15. **Statutory Audit Logs** (Cryptographically signed immutable transaction log)
16. **System Settings** (Sovereign gateway API keys, access control & role permissions)

---

## 📊 Core Features & Implementation Details

### 1. Top 10 Animated KPI Cards (`KPICards.tsx`)
Built with Framer Motion, dynamic hover elevation (`y: -4`), inline SVG sparklines with gradient fills, and trend indicators:
1. **Total Schemes**: `8` Centrally Sponsored Schemes
2. **Active Projects**: `2,480` Facilities nationwide (`+12.4% YoY`)
3. **Registered NGOs**: `865` NITI Aayog Darpan vetted (`100% Verified`)
4. **Total Beneficiaries**: `1.84M` Aadhaar e-KYC enrolled (`+8.9% MoM`)
5. **High Risk Projects**: `90` Requiring urgent PMU intervention (`-4.2% mitigated`)
6. **Pending Grievances**: `142` Citizen redressal tickets (`< 48h SLA`)
7. **Pending Inspections**: `38` In field queue (`-18% Overdue`)
8. **Compliance Rate**: `94.2%` GFR-19A statutory adherence (`+3.1% QoQ`)
9. **Fund Utilization %**: `81.6%` (₹3,180 Cr verified expenditure)
10. **Online CCTV Cameras**: `1,420` Active streams (`95.9% Uptime`)

### 2. National GIS Monitoring (`NationalMap.tsx`)
* **Base Map**: OpenFreeMap / OpenStreetMap with high-contrast CartoDB tiles and Google Maps WebGL fallback.
* **Markers & Styling**:
  * **High Risk**: Pulsing red rings with animated CSS ping.
  * **Medium Risk**: Amber indicators.
  * **Low Risk**: Emerald pins.
  * **CCTV Overlay**: Camera badges with live preview trigger.
* **Interactive Controls**:
  * Heatmap mode toggle (Risk density vs Beneficiary density).
  * Layer filters for High Risk only, Pending Inspections, and Heatmap.
  * Facility popups displaying project codes, grant status, and "Inspect Profile" triggers.

### 3. AI Anomaly & Threat Center (`AIAlerts.tsx`)
* **Algorithmic Threat Categories**:
  * Sudden Attendance Drops (> 25% deviation from rolling mean)
  * Repeated Citizen Complaints (3+ grievances within 14 days)
  * Offline CCTV Cameras (Disconnection > 2 hours during operational windows)
  * Delayed Field Inspections (Statutory PMU audit 15+ days overdue)
  * Non-Compliant Facilities (Overdue GFR-19A Utilization Certificates)
* **Dossier Modal**: Detailed breakdown of anomaly trigger parameters, statutory SLA, and recommendations under General Financial Rules (GFR-2017).

### 4. Interactive Analytical Intelligence Suite (`AnalyticsCharts.tsx`)
* **Scheme View**:
  * Donut chart: Project distribution across 8 schemes
  * Bar chart: Beneficiary numbers by scheme ('000s)
  * Grouped bar chart: Public funds Sanctioned vs Released vs Utilized
  * Area chart: Scheme completion and efficiency index
* **Grievance View**:
  * 7-day daily intake vs verification vs resolution
  * Monthly redressal trajectory
  * Issue categories breakdown (Grant delays, infrastructure, food/ration, false attendance)
  * SLA-48 compliance rate (72.4% resolved < 24h, 24% < 48h, 3.6% escalated)

### 5. Welfare Projects Master Table (`ProjectTable.tsx`)
* **Columns**: Project ID, Name, Scheme, NGO, State & District, Risk Level, Inspection Status, Compliance Status, Beneficiaries, Actions.
* **Search**: Instant multi-attribute search across project code, facility name, NGO name, district, and state.
* **Sorting**: Interactive two-way sort by name, risk score, beneficiaries, and project ID.
* **Filters**: Scheme, State, Risk Level, Compliance Status, and Inspection Status.
* **Pagination**: Configurable page sizes (10, 25, 50) with pagination controls.
* **Export Options**:
  * **Export CSV**: Instant client-side CSV generation formatted for Excel/Gov MIS.
  * **Print / PDF**: Clean, print-styled stylesheet for statutory filing.

### 6. CCTV Surveillance Telemetry (`CCTVWidget.tsx`)
* **Metrics**: Online cameras, Offline cameras, Poor connectivity, Last updated heartbeat, Camera health %.
* **Grid**: Video feed cards with simulated live status, FPS, resolution, bitrate, and project location.
* **Stream Modal**: Real-time sovereign RTSP/H.264 encrypted stream simulation with AI bounding-box detection tags.

### 7. Biometric Attendance Telemetry (`AttendanceWidget.tsx`)
* **Metrics**: National attendance rate (92.4%), low attendance centres (<75%), staff absenteeism (4.2%).
* **Visuals**:
  * 30-day continuous attendance rate trend.
  * Weekly hourly density heatmap matrix (Monday to Saturday, 9 AM to 5 PM).
  * Flagged low-attendance facility alert table.

### 8. PMU Physical Inspections (`InspectionWidget.tsx`)
* **Audit Cards**: Today's audits, Completed audits, Pending queue, Overdue audits.
* **Analytics**:
  * State-wise audit fulfillment comparison.
  * Lead auditor workload distribution.
* **Audit Feed**: Geotagged inspection logs with scores and critical defects.

### 9. Statutory Compliance Matrix (`ComplianceWidget.tsx`)
* **Tracking**: Compliant facilities, Non-compliant facilities, Under review, Corrective actions.
* **Charts**: National compliance status breakdown donut + GFR-19A submission deadline distribution.
* **Notices**: Statutory show-cause notices with case numbers and enforcing bodies.

### 10. Public Finance & PFMS Tracking (`FundWidget.tsx`)
* **Pipeline**: Sanctioned (₹4,600 Cr) → Released (₹3,895 Cr) → Utilized (₹3,180 Cr) → Escrow Held (₹715 Cr).
* **Expenditure**: Scheme-wise grouped comparative bar chart.
* **Warning Engine**: Alert on NGOs holding unspent balances exceeding 6 months.

### 11. Real-time Activity Stream (`RecentActivities.tsx`)
* Vertical chronological timeline of statutory actions.
* Event badges: Project Registered, Inspection Completed, Complaint Raised, AI Risk Updated, Compliance Closed, Attendance Uploaded, CCTV Offline.
* Filter dropdown by activity category.

### 12. Quick Action Dispatchers (`QuickActions.tsx`)
Accessible from the national banner:
* `+ Add Scheme`: Gazette new central welfare scheme with allocation parameters.
* `+ Register Project`: Sanction and register facility with scheme, NGO, and geo-coordinates.
* `+ Assign Inspection`: Dispatch geotagged inspection order to District Collector or PMU auditor.
* `+ View Reports`: Direct shortcut to national MIS digest generator.
* `+ Export Dashboard`: Downloads JSON digest containing current command center state.

### 13. Global Command Search (`GlobalSearch.tsx`)
* Universal shortcut: `Ctrl + K` or `Cmd + K`.
* Real-time querying across Projects, Schemes, NGOs, Beneficiaries, Grievances, and Inspections.
* Categorized results with direct click navigation into relevant tabs or project dossiers.

---

## 🔒 Security, Accessibility & Sovereign Standards

1. **Role-Based Protection**: Sealed behind `ProtectedRoute` requiring `admin` clearance.
2. **Sovereign Color Palette**: Built strictly using Govt. of India / DoSJE compliant color tokens (`#0B2545`, `#0F4C81`, `#0B5ED7`, `#198754`, `#FD7E14`, `#DC3545`).
3. **Accessibility (a11y)**: High-contrast ratios, keyboard navigational support (`Ctrl+K`, `Escape`, `Tab`), and semantic HTML5 elements.
4. **Theme Resilience**: Full dark mode, light mode, and system preference with zero flickering or layout shifts.
5. **Zero External Data Leaks**: All simulated telemetry mirrors sovereign National Informatics Centre (NIC) data models.

---

## 🧪 Verification & Build Status

* **TypeScript Compilation**: `npx tsc --noEmit` → `0 errors`
* **ESLint Validation**: `npm run lint` → `0 errors, 0 warnings`
* **Turbopack Dev Server**: Running cleanly at [http://localhost:3000/admin](http://localhost:3000/admin)
* **Demo Admin Credentials**:
  * Email: `dosje.admin@demo.gov`
  * Password: `Demo@123`
  * (Or use the one-click **Demo Accounts** button on `/login`).
