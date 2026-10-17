# STRIDE-X Backend API
### Smart Tracking & Real-time Inspection for Development and Empowerment
**Problem Statement SIH-2026 PS095** | Department of Social Justice & Empowerment (DoSJE), Ministry of Social Justice & Empowerment, Government of India.

---

## 🏛️ Overview
The **STRIDE-X Backend** is an enterprise-grade RESTful API built with **Python, FastAPI, PostgreSQL, SQLAlchemy 2.x, and Alembic**. It provides secure identity management, role-based authorization, state jurisdiction enforcement, financial grant auditing, physical inspection logging, citizen grievance resolution, and extensible telemetry anomaly detection for national welfare schemes (PM-AJAY, SMILE, NAPSrC, Divyangjan Aid, NMBA).

---

## 🛠️ Technology Stack
- **Runtime**: Python 3.11+ / Python 3.14 compatible
- **API Framework**: FastAPI 0.114+ (High-performance ASGI, OpenAPI 3.1 autodocs)
- **Database**: PostgreSQL (Production) / SQLite (Isolated local development & in-memory testing)
- **ORM**: SQLAlchemy 2.0+ (Strict Mapped typing)
- **Database Migrations**: Alembic 1.13+
- **Data Validation & Settings**: Pydantic v2 & `pydantic-settings`
- **PostgreSQL Driver**: Psycopg 3 (`psycopg[binary]>=3.1.18`)
- **Authentication & Security**: Argon2id password hashing (`argon2-cffi`), Signed JWT Access & Refresh Tokens (`pyjwt`)
- **Automated Testing**: `pytest`, `pytest-asyncio`, `httpx`

---

## 📂 Architecture & Directory Structure
```
backend/
├── app/
│   ├── main.py                     # FastAPI application factory, CORS, and exception handlers
│   ├── api/
│   │   ├── deps.py                 # JWT authentication & role-based route dependencies
│   │   └── v1/
│   │       ├── api.py              # Bundled v1 router
│   │       └── endpoints/          # Domain REST endpoints
│   │           ├── auth.py         # Login, logout, me, refresh
│   │           ├── users.py        # User management & state scoping
│   │           ├── schemes.py      # National welfare scheme registry
│   │           ├── projects.py     # Welfare facility master records & GIS
│   │           ├── beneficiaries.py# Entitlement verification & attendance
│   │           ├── budgets.py      # Budget sanctioning & expenditure claims
│   │           ├── audits.py       # PMU inspections & GPS verification
│   │           ├── grievances.py   # Citizen grievance ticketing & SLA tracking
│   │           ├── monitoring.py   # AI anomaly detection & CCTV telemetry
│   │           ├── ngos.py         # Empaneled NGO registration
│   │           ├── staff.py        # Caretaker & supervisor directory
│   │           └── reports.py      # National KPI summary analytics
│   ├── core/
│   │   ├── config.py               # Pydantic environment settings
│   │   ├── security.py             # Argon2 & JWT signing logic
│   │   ├── permissions.py          # Role definitions & jurisdiction boundaries
│   │   └── exceptions.py          # Standardized HTTP error responses
│   ├── db/
│   │   ├── base.py                 # DeclarativeBase foundation
│   │   └── session.py              # Engine creation & isolated DB sessions
│   ├── models/                     # SQLAlchemy 2.0 ORM database tables
│   ├── schemas/                    # Pydantic v2 request & response models
│   └── services/                   # Business logic & heuristic anomaly scanning
├── alembic/                        # Version-controlled schema migrations
├── scripts/
│   └── seed_data.py                # Database population script with official demo data
├── tests/                          # Automated pytest regression suite
├── .env.example                    # Environment variable template
├── alembic.ini                     # Migration engine configuration
├── requirements.txt                # Pinned production dependencies
└── pyproject.toml                  # Project packaging & test configurations
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python 3.11+** installed (`python --version`)
- **PostgreSQL 14+** (Optional: defaults automatically to `sqlite:///./stride_x.db` for instant local setup)

### 2. Virtual Environment Setup
In PowerShell or Terminal:
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# Linux / macOS:
source .venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment
Copy the template configuration:
```bash
cp .env.example .env
```
Key configuration parameters in `.env`:
```env
DATABASE_URL="sqlite:///./stride_x.db"
# For PostgreSQL: DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/stride_x"
JWT_SECRET_KEY="stride_x_development_secret_key_change_in_production"
ACCESS_TOKEN_EXPIRE_MINUTES=60
FRONTEND_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"
```

### 5. Apply Database Migrations
```bash
alembic upgrade head
```

### 6. Seed Demo Data
Populate the database with official test accounts and facility records:
```bash
python scripts/seed_data.py
```

### 7. Run Development Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- **API Base URL**: `http://localhost:8000/api/v1`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`
- **Health Telemetry**: `http://localhost:8000/api/v1/health`

---

## 🔐 Authentication & Roles

### Built-in Seeded Accounts (Password: `Demo@123`)
1. **Central Admin**: `dosje.admin@demo.gov` (National Clearance, All Schemes & Audit Logs)
2. **State Authority**: `state.authority@demo.gov` (Maharashtra State Jurisdiction)
3. **Grantee NGO Lead**: `ngo.admin@demo.org` (Navachetna Foundation)
4. **PMU Field Inspector**: `pmu.inspector@demo.gov` (Field Audits & Geotagged Inspections)
5. **Field Facility Staff**: `staff@demo.org` (Daily Roster & Telemetry)
6. **Welfare Beneficiary**: `beneficiary@demo.org` (Entitlement Verification)

---

## 🧪 Automated Testing
Run the comprehensive test suite with in-memory database isolation:
```bash
pytest -v
```
Verified Test Coverage:
- `tests/test_health.py`: Healthcheck and root endpoint uptime.
- `tests/test_auth.py`: Login, invalid credentials, token verification, `/auth/me`, token refreshing.
- `tests/test_schemes.py`: Scheme creation, listing, role enforcement.
- `tests/test_budgets.py`: Allocation validation, expenditure claims, negative value rejection, exceeding allocation prevention, status approvals.
- `tests/test_jurisdiction_and_projects.py`: State-level jurisdiction boundaries and cross-state access prevention.

---

## 🛡️ Security Best Practices
- **Password Protection**: Passwords hashed with Argon2id (memory-hard, resistant to GPU attacks).
- **Zero Plaintext Storage**: Credentials never stored or exposed in logs.
- **Granular Scoping**: State authorities cannot inspect or modify projects outside their assigned state.
- **No Direct Aadhaar Storage**: Beneficiary records do not store raw Aadhaar numbers; only verified status flags and synthetic test identifiers are recorded.
- **Financial Validation**: Floating-point math is strictly forbidden in financial columns; exact `Numeric(12, 2)` decimal precision is enforced.
