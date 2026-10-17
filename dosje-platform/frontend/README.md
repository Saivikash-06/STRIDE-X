# STRIDE-X
### Smart Tracking & Real-time Inspection for Development and Empowerment
**Problem Statement SIH-2026 PS095** | **Department of Social Justice & Empowerment (DoSJE)**, Ministry of Social Justice & Empowerment, Government of India.

---

## 🌟 Overview
**STRIDE-X** is a centralized AI-powered monitoring and inspection platform for DoSJE welfare schemes featuring real-time monitoring, CCTV integration, AI-based anomaly detection, geo-tagged inspections, grievance tracking, compliance management, and beneficiary verification.

Designed to meet the stringent security, accessibility, and architectural standards of the Government of India, STRIDE-X bridges the gap between Central Policy Directors, State/District Nodal Officers, Grantee NGOs, and Ground PMU Auditors.

---

## 🚀 Key Modules & Architecture

### 1. Central Admin Command Dashboard (`/admin`)
- **National GIS Telemetry**: Interactive GIS map engine (Google Maps / Leaflet CartoDB fallback) visualizing facilities, risk levels, and geotagged audits across 36 States/UTs.
- **AI Anomaly & Risk Engine**: Algorithmic threat scoring calculating facility risk indices based on attendance deviations, CCTV downtime, and PFMS utilization ratios.
- **Scheme & Project Lifecycle Management**: Centrally tracking PM-AJAY, SMILE, NAPSrC, Divyangjan Aid, and NMBA mission portfolios.
- **CCTV Live Telemetry**: Multi-camera grid status with RTSP sovereign protocol streaming and automated disconnection alerts.
- **Statutory Audit Logs**: Cryptographically sealed transaction logs recording every officer modification and grant authorization.

### 2. State & District Authority Hub (`/authority`)
- **Jurisdiction GIS Command**: District-level spatial intelligence mapping with facility density and anomaly indicators.
- **Grant proposal & Approval Clearance**: Multi-tier vetting of NGO annual plans and utilization certificates.
- **Inspection Management**: Dispatching physical inspections to designated District Collectors and PMU field officers.
- **Grievance Resolution Desk**: CPGRAMS integrated citizen ticket tracking with SLA breach escalation.

### 3. Dedicated Stakeholder Portals
- **Grantee NGO Management Portal** (`/ngo`): Facility registration, daily telemetry uploads, and GFR-19A utilization certificate submission.
- **Project Monitoring Unit (PMU)** (`/pmu`): Geotagged offline-capable inspection logging with tamper-proof photo capture.
- **Field Staff Attendance Portal** (`/staff`): Biometric punch logging and meal/amenity distribution records.
- **Beneficiary Verification Portal** (`/beneficiary`): Aadhaar e-KYC entitlement validation safeguarding against proxy enrollments.

---

## 🎨 Branding & Design System
- **Product Name**: STRIDE-X
- **Expanded Name**: Smart Tracking & Real-time Inspection for Development and Empowerment
- **Monogram**: SX
- **Color Palette**:
  - Primary Blue: `#0B5ED7`
  - Government Green: `#198754`
  - Orange Alert: `#FD7E14`
  - Critical Danger: `#DC3545`
  - Background (Light): `#F8FAFC`
  - Background (Dark): `#0F172A`
- **Typography**: Inter / Clean Modern Sans-Serif
- **Theme**: Full Dark / Light / System Mode with zero flicker

---

## 🛠️ Technology Stack
- **Framework**: Next.js 16 (Turbopack, App Router)
- **UI Engine**: React 19, TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4, Vanilla CSS Custom Tokens
- **Mapping & GIS**: `@react-google-maps/api`, `leaflet`, `@googlemaps/markerclusterer`
- **Analytics & Data Viz**: Recharts (Responsive SVG)
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form, Zod

---

## ⚡ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local` in `dosje-platform/`:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_KEY_HERE"
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api/v1"
```
*(If no Google Maps API key is provided, the platform automatically activates high-performance OpenStreetMap / CartoDB fallback seamlessly).*

### 3. Start the Backend API (FastAPI)
In a separate terminal:
```bash
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```
- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Status: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

### 4. Run Frontend Development Server
```bash
cd dosje-platform
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the STRIDE-X portal.

### 4. Build for Production
```bash
npm run build
npm run start
```

### 5. Lint & Type Check
```bash
npm run lint
npx tsc --noEmit
```

---

## 🔐 Demo Credentials
STRIDE-X includes built-in quick login personas accessible directly from the [Login Portal](/login):
- **Central Administrator**: `dosje.admin@demo.gov` (Password: `Demo@123`)
- **State Nodal Authority**: `state.authority@demo.gov` (Password: `Demo@123`)
- **Grantee NGO Head**: `ngo.admin@demo.org` (Password: `Demo@123`)
- **PMU Field Auditor**: `pmu.auditor@demo.gov` (Password: `Demo@123`)

---

## 📜 Statutory Notice
Content on this platform is published for the Department of Social Justice & Empowerment, Government of India. Hosted securely on National Informatics Centre (NIC) sovereign infrastructure.
