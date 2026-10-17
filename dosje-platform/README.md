# STRIDE-X
### Smart Tracking & Real-time Inspection for Development and Empowerment
**Problem Statement SIH-2026 PS095** | **Department of Social Justice & Empowerment (DoSJE)**, Ministry of Social Justice & Empowerment, Government of India.

---

## 🌟 Overview
**STRIDE-X** is an enterprise AI-powered governance and inspection platform for DoSJE welfare schemes, delivering real-time telemetry, CCTV streaming, anomaly detection, geo-tagged mobile audits, grievance tracking, compliance management, and direct beneficiary verification.

Designed to meet the stringent security, accessibility (GIGW 3.0), and architectural standards of the Government of India, STRIDE-X bridges the gap between Central Policy Directors, State/District Nodal Officers, Grantee NGOs, and Ground PMU Auditors.

---

## 📁 Repository Structure

```
dosje-platform/
├── .github/                 # CI/CD Workflows
│   └── workflows/ci.yml     # Automated lint, typecheck, & backend test pipeline
├── backend/                 # FastAPI REST API Backend
│   ├── app/
│   │   ├── api/v1/          # Endpoints (auth, users, schemes, projects, etc.)
│   │   ├── core/            # Config, security (JWT/bcrypt), database session
│   │   ├── models/          # SQLAlchemy ORM models
│   │   ├── schemas/         # Pydantic v2 schemas
│   │   ├── services/        # Business logic & authentication service
│   │   └── main.py          # Application entrypoint & middleware
│   ├── alembic/             # Database migration versions
│   ├── scripts/seed_data.py # Initial database seed script
│   ├── tests/               # Pytest suite
│   ├── requirements.txt     # Python backend dependencies
│   └── .env.example         # Backend environment template
├── frontend/                # Next.js 16 (App Router) Frontend
│   ├── public/              # Static assets (images, icons, flags)
│   ├── src/
│   │   ├── app/             # Next.js pages & layouts (/, /login, /admin, etc.)
│   │   ├── components/      # UI components (dashboard, charts, shared, admin)
│   │   ├── features/        # Feature modules (admin, auth, authority, ngo, etc.)
│   │   ├── context/         # Auth & Notification providers
│   │   ├── services/        # API client & domain service layers
│   │   ├── mock/            # Demo accounts and dataset fixtures
│   │   ├── types/           # TypeScript data models
│   │   └── utils/           # Helper functions & formatting utilities
│   ├── package.json         # Frontend dependencies & scripts
│   ├── tsconfig.json        # TypeScript configuration with path aliases
│   └── .env.example         # Frontend environment template
├── database/                # Database Schemas & Migrations
│   ├── schema/              # SQL schema documentation & definitions
│   └── seeds/               # Data fixtures & seed scripts
├── docs/                    # Technical & Architectural Documentation
│   ├── architecture/        # System design specifications
│   ├── api/                 # OpenAPI & Swagger specifications
│   └── deployment/          # Infrastructure & deployment guides
└── scripts/                 # Automation & Developer Scripts
    └── run_dev.ps1          # Unified dev launcher script
```

---

## 🚀 Key Modules & Architecture

### 1. Central Admin Command Dashboard (`/admin`)
- **National GIS Telemetry**: Interactive GIS map engine (Google Maps / Leaflet CartoDB fallback) visualizing facilities, risk levels, and geotagged audits across 36 States/UTs.
- **AI Anomaly & Risk Engine**: Algorithmic threat scoring calculating facility risk indices based on attendance deviations, CCTV downtime, and PFMS utilization ratios.
- **Scheme & Project Lifecycle Management**: Centrally tracking PM-AJAY, SMILE, NAPSrC, Divyangjan Aid, and NMBA mission portfolios.
- **CCTV Live Telemetry**: Multi-camera grid status with sovereign protocol streaming and automated disconnection alerts.
- **Statutory Audit Logs**: Cryptographically sealed transaction logs recording every officer modification and grant authorization.

### 2. State & District Authority Hub (`/authority`)
- **Jurisdiction GIS Command**: District-level spatial intelligence mapping with facility density and anomaly indicators.
- **Grant Proposal & Approval Clearance**: Multi-tier vetting of NGO annual plans and utilization certificates.
- **Inspection Management**: Dispatching physical inspections to designated District Collectors and PMU field officers.
- **Grievance Resolution Desk**: CPGRAMS integrated citizen ticket tracking with SLA breach escalation.

### 3. Dedicated Stakeholder Portals
- **Grantee NGO Management Portal** (`/ngo`): Facility registration, daily telemetry uploads, and GFR-19A utilization certificate submission.
- **Project Monitoring Unit (PMU)** (`/pmu`): Geotagged offline-capable inspection logging with tamper-proof photo capture.
- **Field Staff Attendance Portal** (`/staff`): Biometric punch logging and meal/amenity distribution records.
- **Beneficiary Verification Portal** (`/beneficiary`): Aadhaar e-KYC entitlement validation safeguarding against proxy enrollments.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16 (Turbopack, App Router), React 19, TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS v4, Vanilla CSS Custom Design Tokens |
| **GIS & Maps** | `@react-google-maps/api`, Leaflet, `@googlemaps/markerclusterer` |
| **Visualizations** | Recharts (Responsive SVG Data Charts) |
| **Icons & Forms** | Lucide React, React Hook Form, Zod |
| **Backend API** | FastAPI (Python 3.11+ / 3.14), Pydantic v2, Uvicorn (ASGI) |
| **Database** | PostgreSQL / SQLite (Development), SQLAlchemy 2.0 (Async/Sync), Alembic |
| **Security** | OAuth2 Password Bearer, JWT (HS256), Passlib (Bcrypt), Role-Based Access Control |

---

## ⚡ Getting Started

### 1. Unified Quick Start (PowerShell)
From the repository root:
```powershell
.\scripts\run_dev.ps1
```

---

### 2. Manual Setup

#### Backend Setup (FastAPI)
```bash
cd backend
python -m venv .venv
# Windows:
.\.venv\Scripts\Activate.ps1
# Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt
python scripts/seed_data.py
uvicorn app.main:app --reload --port 8000
```
- Interactive API Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)
- Alternative Docs (ReDoc): [http://localhost:8000/redoc](http://localhost:8000/redoc)
- Health Status: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

#### Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```
- Open [http://localhost:3000](http://localhost:3000) to view the STRIDE-X portal.

---

## 🧪 Testing & Validation

### Backend Tests
```bash
cd backend
pytest -v
```

### Frontend Typecheck & Lint
```bash
cd frontend
npm run lint
npx tsc --noEmit
```

---

## 🔐 Built-in Demo Credentials
STRIDE-X includes built-in quick login personas accessible directly from the [Login Portal](/login):
- **Central Administrator**: `dosje.admin@demo.gov` (Password: `Demo@123`)
- **State Nodal Authority**: `state.authority@demo.gov` (Password: `Demo@123`)
- **Grantee NGO Head**: `ngo.admin@demo.org` (Password: `Demo@123`)
- **PMU Field Auditor**: `pmu.auditor@demo.gov` (Password: `Demo@123`)

---

## 📜 Statutory Notice
Content on this platform is published for the Department of Social Justice & Empowerment, Government of India. Hosted securely on National Informatics Centre (NIC) sovereign infrastructure.
