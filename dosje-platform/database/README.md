# STRIDE-X Database Architecture

This directory maintains the database schema definitions, entity-relationship models, and data seed configurations for the **STRIDE-X Platform**.

---

## 🏛️ Database Engine & Dialects
- **Production Engine**: PostgreSQL 14+ (Connection via `psycopg` 3 and SQLAlchemy 2.0 ORM)
- **Local Dev / Testing Engine**: SQLite (Embedded zero-setup mode via `sqlite:///./stride_x.db`)
- **Migration Engine**: Alembic (Located in `backend/alembic/`)

---

## 📂 Subdirectories
- `schema/`: Detailed documentation of tables, constraints, indexes, and precision rules.
- `seeds/`: Initial administrative user accounts, welfare scheme portfolios, and facility records.

---

## 📜 Core Schema Tables
1. **`users`**: Administrative and field officer identities (Argon2id password hashes, role-based scopes).
2. **`organizations`**: Empaneled NGOs, DARPAN registrations, and statutory compliance status.
3. **`schemes`**: Centrally sponsored welfare schemes (PM-AJAY, SMILE, NAPSrC, Divyangjan Aid, NMBA).
4. **`projects`**: Welfare project facilities with GPS coordinates, risk tier, and grant outlays.
5. **`beneficiaries`**: Direct benefit transfer records and Aadhaar e-KYC validation flags.
6. **`budget_allocations`**: Sanctioned financial outlays using strict `Numeric(12,2)` precision.
7. **`expenditures`**: Line-item financial claims with dual-approval workflow.
8. **`audits`**: PMU physical inspection logs, geo-distance checks, and photo evidence counts.
9. **`grievances`**: Citizen dispute tickets with SLA escalation monitoring.
10. **`monitoring_records`**: Periodic field observations and facility status reports.
11. **`ai_anomalies`**: Automated risk alerts (attendance drops, CCTV downtime, budget deviations).
12. **`cctv_telemetry`**: Surveillance camera heartbeat and sovereign RTSP feed status.
13. **`staff`**: Center supervisors, care personnel, and doctor rosters.
14. **`audit_logs`**: Immutable statutory admin actions.
