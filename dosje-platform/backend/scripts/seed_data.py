import sys
import os
from decimal import Decimal

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.core.security import hash_password
from app.models.user import User
from app.models.organization import Organization
from app.models.scheme import Scheme
from app.models.project import Project
from app.models.beneficiary import Beneficiary
from app.models.audit import Audit
from app.models.grievance import Grievance
from app.models.monitoring import AiAnomaly, CctvTelemetry, Staff, AuditLog


def seed_database():
    print("[STRIDE-X] Initializing database tables...")
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        # 1. Seed Users (Matching frontend demoAccounts.ts)
        default_pwd_hash = hash_password("Demo@123")
        demo_users = [
            {
                "id": "demo-admin-1",
                "email": "dosje.admin@demo.gov",
                "name": "Dr. Rajeshwar Sharma, IAS",
                "role": "admin",
                "designation": "Joint Secretary (Monitoring & Compliance)",
                "department": "Department of Social Justice & Empowerment, Govt. of India",
                "jurisdiction": "National Level (All States & UTs)",
                "badge_number": "CENTRAL GOVT",
            },
            {
                "id": "demo-authority-1",
                "email": "state.authority@demo.gov",
                "name": "Smt. Sunita Murmu",
                "role": "authority",
                "designation": "State Nodal Director (Social Welfare)",
                "department": "Directorate of Social Welfare, Government of Maharashtra",
                "state": "Maharashtra",
                "district": "Pune",
                "jurisdiction": "State Level (Maharashtra & Regional Districts)",
                "badge_number": "STATE AUTHORITY",
            },
            {
                "id": "demo-ngo-1",
                "email": "ngo.admin@demo.org",
                "name": "Vikramaditya Sengupta",
                "role": "ngo",
                "designation": "Executive Director & Grantee Head",
                "department": "Navachetna Social Welfare Foundation (Registered NGO)",
                "state": "Maharashtra",
                "district": "Pune",
                "organization_id": "ngo-1",
                "jurisdiction": "Operational Units (5 Districts)",
                "badge_number": "GRANTEE NGO",
            },
            {
                "id": "demo-staff-1",
                "email": "staff@demo.org",
                "name": "Pooja Verma",
                "role": "staff",
                "designation": "Center Care Supervisor & Educator",
                "department": "Navachetna Rehabilitation & Skill Centre - Ward 4",
                "state": "Maharashtra",
                "district": "Pune",
                "jurisdiction": "Field Facility #104",
                "badge_number": "FIELD STAFF",
            },
            {
                "id": "demo-beneficiary-1",
                "email": "beneficiary@demo.org",
                "name": "Rameshwar Prasad",
                "role": "beneficiary",
                "designation": "Direct Scheme Recipient (Senior Citizen / PwD Support)",
                "department": "National Action Plan for Senior Citizens (NAPSrC)",
                "state": "Maharashtra",
                "district": "Pune",
                "jurisdiction": "District Resident, Pune",
                "badge_number": "BENEFICIARY",
            },
            {
                "id": "demo-pmu-1",
                "email": "pmu.inspector@demo.gov",
                "name": "Anand Kulkarni",
                "role": "pmu",
                "designation": "Senior Project Monitoring Unit Field Auditor",
                "department": "National PMU Directorate - Inspection Division",
                "state": "Maharashtra",
                "jurisdiction": "Western Zonal Audit Zone",
                "badge_number": "INSPECTION AUDITOR",
            },
        ]

        for u in demo_users:
            if not db.scalar(select(User).where(User.email == u["email"])):
                new_u = User(
                    id=u["id"],
                    email=u["email"],
                    hashed_password=default_pwd_hash,
                    name=u["name"],
                    role=u["role"],
                    designation=u.get("designation", ""),
                    department=u.get("department", ""),
                    state=u.get("state"),
                    district=u.get("district"),
                    organization_id=u.get("organization_id"),
                    badge_number=u.get("badge_number"),
                    jurisdiction=u.get("jurisdiction"),
                    is_active=True,
                )
                db.add(new_u)
        db.commit()
        print(f"[STRIDE-X] Seeded {len(demo_users)} official demo user accounts.")

        # 2. Seed Schemes
        schemes_data = [
            {
                "id": "scheme-1",
                "code": "PM-AJAY",
                "name": "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana",
                "category": "Scheduled Caste Welfare",
                "target_group": "Scheduled Castes & Economically Disadvantaged Groups",
                "description": "Comprehensive socio-economic upliftment through infrastructure development, skill training, and income-generating asset creation.",
                "budget_allocated_cr": Decimal("2150.00"),
                "budget_released_cr": Decimal("1850.00"),
                "budget_utilized_cr": Decimal("1640.50"),
                "active_projects_count": 12,
                "beneficiaries_count": 48200,
                "nodal_officer": "Shri Arvind Kaushik, Joint Secy.",
                "status": "ACTIVE",
            },
            {
                "id": "scheme-2",
                "code": "SMILE",
                "name": "Support for Marginalised Individuals for Livelihood and Enterprise",
                "category": "Transgender & Beggary Rehabilitation",
                "target_group": "Transgender Persons & Persons Engaged in Begging",
                "description": "Holistic rehabilitation packages, identity documentation, medical camps, and enterprise startup funding.",
                "budget_allocated_cr": Decimal("365.00"),
                "budget_released_cr": Decimal("295.00"),
                "budget_utilized_cr": Decimal("245.20"),
                "active_projects_count": 8,
                "beneficiaries_count": 14500,
                "nodal_officer": "Dr. Vandana Rao, Director",
                "status": "ACTIVE",
            },
            {
                "id": "scheme-3",
                "code": "NAPSrC",
                "name": "National Action Plan for Senior Citizens",
                "category": "Elderly Care & Support",
                "target_group": "Senior Citizens (Aged 60+)",
                "description": "Sustenance support, shelter homes, geriatric clinics, and physical mobility aids distribution.",
                "budget_allocated_cr": Decimal("720.00"),
                "budget_released_cr": Decimal("640.00"),
                "budget_utilized_cr": Decimal("580.00"),
                "active_projects_count": 15,
                "beneficiaries_count": 32000,
                "nodal_officer": "Smt. Neelam Saxena, Director",
                "status": "ACTIVE",
            },
            {
                "id": "scheme-4",
                "code": "DIVYANG",
                "name": "Scheme of Assistance to Disabled Persons (ADIP)",
                "category": "Divyangjan Aid & Assistive Devices",
                "target_group": "Persons with Disabilities (PwDs)",
                "description": "Modern aids and assistive equipment (smart canes, hearing aids, motorized tricycles) distribution.",
                "budget_allocated_cr": Decimal("480.00"),
                "budget_released_cr": Decimal("410.00"),
                "budget_utilized_cr": Decimal("395.40"),
                "active_projects_count": 9,
                "beneficiaries_count": 21800,
                "nodal_officer": "Shri Mukesh Meena, Joint Secy.",
                "status": "ACTIVE",
            },
            {
                "id": "scheme-5",
                "code": "NMBA",
                "name": "Nasha Mukt Bharat Abhiyaan",
                "category": "Substance Reduction & De-addiction",
                "target_group": "Vulnerable Youth and Substance Abuse Victims",
                "description": "Community outreach, Integrated Rehabilitation Centres for Addicts (IRCAs), and preventive counseling.",
                "budget_allocated_cr": Decimal("340.00"),
                "budget_released_cr": Decimal("290.00"),
                "budget_utilized_cr": Decimal("265.80"),
                "active_projects_count": 14,
                "beneficiaries_count": 19400,
                "nodal_officer": "Dr. Pradeep Mishra, Director",
                "status": "ACTIVE",
            },
        ]

        for s in schemes_data:
            if not db.scalar(select(Scheme).where(Scheme.code == s["code"])):
                new_s = Scheme(**s)
                db.add(new_s)
        db.commit()
        print(f"[STRIDE-X] Seeded {len(schemes_data)} core welfare schemes.")

        # 3. Seed Organizations (NGOs)
        ngos_data = [
            {
                "id": "ngo-1",
                "darpan_id": "MH/2021/0284912",
                "name": "Navachetna Social Welfare Foundation",
                "state": "Maharashtra",
                "district": "Pune",
                "registration_number": "REG-MH-2021-998",
                "contact_person": "Vikramaditya Sengupta",
                "email": "contact@navachetna.org",
                "phone": "+91 98230 11223",
                "active_projects": 5,
                "compliance_score": 96.5,
                "last_audit_date": "2026-08-15",
                "blacklisted": False,
            },
            {
                "id": "ngo-2",
                "darpan_id": "DL/2020/0193481",
                "name": "Samarthya Empowerment Society",
                "state": "Delhi",
                "district": "Central Delhi",
                "registration_number": "REG-DL-2020-442",
                "contact_person": "Sunita Aggarwal",
                "email": "info@samarthya-india.org",
                "phone": "+91 98110 44556",
                "active_projects": 3,
                "compliance_score": 88.0,
                "last_audit_date": "2026-07-20",
                "blacklisted": False,
            },
            {
                "id": "ngo-3",
                "darpan_id": "UP/2019/0088123",
                "name": "Pragati Gramin Vikas Sansthan",
                "state": "Uttar Pradesh",
                "district": "Varanasi",
                "registration_number": "REG-UP-2019-112",
                "contact_person": "Ramesh Chandra Yadav",
                "email": "pragati.varanasi@ngo.in",
                "phone": "+91 94150 77889",
                "active_projects": 4,
                "compliance_score": 62.0,
                "last_audit_date": "2026-06-10",
                "blacklisted": False,
            },
        ]

        for n in ngos_data:
            if not db.scalar(select(Organization).where(Organization.darpan_id == n["darpan_id"])):
                new_n = Organization(**n)
                db.add(new_n)
        db.commit()
        print(f"[STRIDE-X] Seeded {len(ngos_data)} empaneled NGOs.")

        # 4. Seed Projects
        projects_data = [
            {
                "id": "proj-1",
                "project_code": "MH-PUN-PMAJAY-001",
                "name": "Pune Scheduled Caste Skill & Livelihood Center",
                "scheme_id": "scheme-1",
                "ngo_id": "ngo-1",
                "state": "Maharashtra",
                "district": "Pune",
                "address": "Plot 42, Hadapsar Industrial Area, Pune, Maharashtra 411028",
                "latitude": 18.5089,
                "longitude": 73.9260,
                "beneficiaries_count": 450,
                "risk_level": "LOW",
                "risk_score": 12.5,
                "status": "ACTIVE",
                "inspection_status": "COMPLETED",
                "compliance_status": "COMPLIANT",
                "sanctioned_grant_lakhs": Decimal("185.00"),
                "released_grant_lakhs": Decimal("150.00"),
                "utilized_grant_lakhs": Decimal("138.50"),
                "start_date": "2025-04-01",
                "expected_completion_date": "2027-03-31",
                "cctv_online": True,
                "biometric_active": True,
            },
            {
                "id": "proj-2",
                "project_code": "MH-NAG-NAPSRC-002",
                "name": "Nagpur Vrudhashram Geriatric Support Unit",
                "scheme_id": "scheme-3",
                "ngo_id": "ngo-1",
                "state": "Maharashtra",
                "district": "Nagpur",
                "address": "Civil Lines, Near High Court, Nagpur, Maharashtra 440001",
                "latitude": 21.1458,
                "longitude": 79.0882,
                "beneficiaries_count": 280,
                "risk_level": "MEDIUM",
                "risk_score": 48.0,
                "status": "ACTIVE",
                "inspection_status": "SCHEDULED",
                "compliance_status": "PENDING_UC",
                "sanctioned_grant_lakhs": Decimal("120.00"),
                "released_grant_lakhs": Decimal("95.00"),
                "utilized_grant_lakhs": Decimal("72.00"),
                "start_date": "2025-06-15",
                "expected_completion_date": "2026-12-31",
                "cctv_online": False,
                "biometric_active": True,
            },
            {
                "id": "proj-3",
                "project_code": "UP-VAR-NMBA-003",
                "name": "Kashi Nasha Mukti & Counseling IRCA",
                "scheme_id": "scheme-5",
                "ngo_id": "ngo-3",
                "state": "Uttar Pradesh",
                "district": "Varanasi",
                "address": "Bhelupur Crossing, Varanasi, Uttar Pradesh 221005",
                "latitude": 25.3176,
                "longitude": 82.9739,
                "beneficiaries_count": 190,
                "risk_level": "HIGH",
                "risk_score": 82.0,
                "status": "UNDER_REVIEW",
                "inspection_status": "FLAGGED",
                "compliance_status": "NON_COMPLIANT",
                "sanctioned_grant_lakhs": Decimal("110.00"),
                "released_grant_lakhs": Decimal("85.00"),
                "utilized_grant_lakhs": Decimal("40.00"),
                "start_date": "2025-02-10",
                "expected_completion_date": "2026-08-30",
                "cctv_online": False,
                "biometric_active": False,
            },
        ]

        for p in projects_data:
            if not db.scalar(select(Project).where(Project.project_code == p["project_code"])):
                new_p = Project(**p)
                db.add(new_p)
        db.commit()
        print(f"[STRIDE-X] Seeded {len(projects_data)} project facilities.")

        # 5. Seed Beneficiaries
        beneficiaries_data = [
            {
                "id": "ben-1",
                "beneficiary_id": "DoSJE-B-2026-10001",
                "full_name": "Rameshwar Prasad",
                "gender": "Male",
                "age": 68,
                "category": "Senior Citizen",
                "project_id": "proj-2",
                "state": "Maharashtra",
                "district": "Pune",
                "disbursed_amount": Decimal("18000.00"),
                "aadhaar_verified": True,
                "dbt_account_linked": True,
                "attendance_rate": 92.5,
                "last_attendance_date": "2026-09-28",
                "verification_status": "VERIFIED",
            },
            {
                "id": "ben-2",
                "beneficiary_id": "DoSJE-B-2026-10002",
                "full_name": "Savitri Bai Shinde",
                "gender": "Female",
                "age": 64,
                "category": "SC",
                "project_id": "proj-1",
                "state": "Maharashtra",
                "district": "Pune",
                "disbursed_amount": Decimal("15000.00"),
                "aadhaar_verified": True,
                "dbt_account_linked": True,
                "attendance_rate": 88.0,
                "last_attendance_date": "2026-09-29",
                "verification_status": "VERIFIED",
            },
            {
                "id": "ben-3",
                "beneficiary_id": "DoSJE-B-2026-10003",
                "full_name": "Devendra Nath Tiwari",
                "gender": "Male",
                "age": 34,
                "category": "Divyangjan (PwD)",
                "project_id": "proj-3",
                "state": "Uttar Pradesh",
                "district": "Varanasi",
                "disbursed_amount": Decimal("9500.00"),
                "aadhaar_verified": False,
                "dbt_account_linked": False,
                "attendance_rate": 45.0,
                "last_attendance_date": "2026-09-10",
                "verification_status": "PENDING_AADHAAR",
            },
        ]

        for b in beneficiaries_data:
            if not db.scalar(select(Beneficiary).where(Beneficiary.beneficiary_id == b["beneficiary_id"])):
                new_b = Beneficiary(**b)
                db.add(new_b)
        db.commit()
        print(f"[STRIDE-X] Seeded {len(beneficiaries_data)} beneficiary records.")

        # 6. Seed Audits
        audits_data = [
            {
                "id": "insp-1",
                "inspection_id": "INSP-2026-001",
                "project_id": "proj-1",
                "inspector_id": "demo-pmu-1",
                "inspector_name": "Anand Kulkarni",
                "inspector_badge": "PMU-WEST-402",
                "scheduled_date": "2026-09-15",
                "completed_date": "2026-09-15",
                "status": "COMPLETED",
                "priority": "ROUTINE",
                "inspection_type": "STATUTORY",
                "geo_verified": True,
                "geo_distance_meters": 14.5,
                "observation_summary": "Facility complies fully with GFR-19A guidelines. Biometric loggers operational.",
                "photo_evidence_count": 6,
                "score_percent": 94.0,
                "critical_defects_count": 0,
            },
            {
                "id": "insp-2",
                "inspection_id": "INSP-2026-002",
                "project_id": "proj-3",
                "inspector_id": "demo-pmu-1",
                "inspector_name": "Anand Kulkarni",
                "inspector_badge": "PMU-WEST-402",
                "scheduled_date": "2026-10-02",
                "status": "FLAGGED",
                "priority": "HIGH",
                "inspection_type": "SURPRISE",
                "geo_verified": False,
                "geo_distance_meters": 320.0,
                "observation_summary": "CCTV feed disconnected. Attendance sheet deviates from electronic records.",
                "photo_evidence_count": 3,
                "score_percent": 41.5,
                "critical_defects_count": 3,
                "corrective_actions": "Submit explanation within 7 days and re-establish CCTV RTSP stream.",
            },
        ]

        for a in audits_data:
            if not db.scalar(select(Audit).where(Audit.inspection_id == a["inspection_id"])):
                new_a = Audit(**a)
                db.add(new_a)
        db.commit()
        print(f"[STRIDE-X] Seeded {len(audits_data)} inspection records.")

        # 7. Seed Grievances
        grievances_data = [
            {
                "id": "grv-1",
                "grievance_id": "GRV-2026-1001",
                "beneficiary_name": "Savitri Bai Shinde",
                "beneficiary_contact": "+91 98220 55443",
                "project_id": "proj-1",
                "scheme_id": "scheme-1",
                "category": "Grant Not Received",
                "description": "DBT installment for July month not credited to Bank of Maharashtra account.",
                "priority": "HIGH",
                "status": "IN_PROGRESS",
                "filing_date": "2026-09-18",
                "sla_deadline": "2026-09-28",
                "assigned_authority_name": "District Social Welfare Officer, Pune",
                "resolution_remarks": "PFMS batch re-processed; bank acknowledgment awaited.",
            },
            {
                "id": "grv-2",
                "grievance_id": "GRV-2026-1002",
                "beneficiary_name": "Devendra Nath Tiwari",
                "beneficiary_contact": "+91 94150 99881",
                "project_id": "proj-3",
                "scheme_id": "scheme-5",
                "category": "Poor Facility Infrastructure",
                "description": "Clean drinking water purifier non-operational for 3 weeks.",
                "priority": "MEDIUM",
                "status": "OPEN",
                "filing_date": "2026-09-24",
                "sla_deadline": "2026-10-04",
                "assigned_authority_name": "District Collectorate, Varanasi",
            },
        ]

        for g in grievances_data:
            if not db.scalar(select(Grievance).where(Grievance.grievance_id == g["grievance_id"])):
                new_g = Grievance(**g)
                db.add(new_g)
        db.commit()
        print(f"[STRIDE-X] Seeded {len(grievances_data)} grievance tickets.")

        # 8. Seed AI Anomalies
        anomalies_data = [
            {
                "id": "anom-1",
                "anomaly_code": "ANOM-2026-081",
                "project_id": "proj-3",
                "title": "Severe Biometric & CCTV Downtime Detected",
                "description": "Camera feeds have been offline for 96 consecutive hours; attendance punches dropped by 68%.",
                "category": "Camera Offline",
                "priority": "CRITICAL",
                "risk_score": 88.5,
                "status": "UNRESOLVED",
                "suggested_action": "Freeze next grant tranche and dispatch emergency PMU surprise audit.",
            },
            {
                "id": "anom-2",
                "anomaly_code": "ANOM-2026-082",
                "project_id": "proj-2",
                "title": "Utilization Certificate GFR-19A Overdue",
                "description": "Q2 Utilization Certificate submission is overdue by 21 days.",
                "category": "Compliance Delay",
                "priority": "MEDIUM",
                "risk_score": 45.0,
                "status": "INVESTIGATING",
                "suggested_action": "Issue statutory reminder notice to Grantee NGO.",
            },
        ]

        for an in anomalies_data:
            if not db.scalar(select(AiAnomaly).where(AiAnomaly.anomaly_code == an["anomaly_code"])):
                new_an = AiAnomaly(**an)
                db.add(new_an)
        db.commit()
        print(f"[STRIDE-X] Seeded {len(anomalies_data)} AI anomaly flags.")

        # 9. Seed CCTV Cameras
        cctv_data = [
            {
                "id": "cam-1",
                "camera_name": "Pune Skill Center - Gate & Biometric Hall",
                "project_id": "proj-1",
                "location": "Entrance Main Lobby",
                "ip_address": "10.14.22.101",
                "is_online": True,
                "health_indicator": "HEALTHY",
                "last_heartbeat": "Just now (12s ago)",
                "stream_url": "rtsp://edge-gateway.dosje.gov/live/mh-pun-001-cam1",
                "fps": 25.0,
                "resolution": "1080p FHD",
            },
            {
                "id": "cam-2",
                "camera_name": "Nagpur Vrudhashram - Common Dining & Medical Room",
                "project_id": "proj-2",
                "location": "Geriatric Care Wing",
                "ip_address": "10.14.22.102",
                "is_online": False,
                "health_indicator": "OFFLINE",
                "last_heartbeat": "96 hours ago",
                "stream_url": "rtsp://edge-gateway.dosje.gov/live/mh-nag-002-cam1",
                "fps": 0.0,
                "resolution": "1080p FHD",
            },
        ]

        for c in cctv_data:
            if not db.scalar(select(CctvTelemetry).where(CctvTelemetry.id == c["id"])):
                new_c = CctvTelemetry(**c)
                db.add(new_c)
        db.commit()
        print(f"[STRIDE-X] Seeded {len(cctv_data)} CCTV camera records.")

        # 10. Seed Staff
        staff_data = [
            {
                "id": "staff-1",
                "staff_id": "STF-PUN-001",
                "full_name": "Pooja Verma",
                "role": "Facility Manager",
                "project_id": "proj-1",
                "district": "Pune",
                "phone": "+91 98220 12345",
                "aadhaar_verified": True,
                "joined_date": "2024-03-01",
            },
            {
                "id": "staff-2",
                "staff_id": "STF-PUN-002",
                "full_name": "Dr. Ashok Deshmukh",
                "role": "Consultant Doctor",
                "project_id": "proj-1",
                "district": "Pune",
                "phone": "+91 98220 67890",
                "aadhaar_verified": True,
                "joined_date": "2024-05-15",
            },
        ]

        for st in staff_data:
            if not db.scalar(select(Staff).where(Staff.staff_id == st["staff_id"])):
                new_st = Staff(**st)
                db.add(new_st)
        db.commit()
        print(f"[STRIDE-X] Seeded {len(staff_data)} staff records.")

        print("[STRIDE-X] Database successfully seeded with production mock datasets!")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
