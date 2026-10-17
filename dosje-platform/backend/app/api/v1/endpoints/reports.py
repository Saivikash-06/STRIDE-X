from typing import Dict, Any
from decimal import Decimal
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func

from app.db.session import get_db
from app.models.project import Project
from app.models.scheme import Scheme
from app.models.organization import Organization
from app.models.beneficiary import Beneficiary
from app.models.grievance import Grievance
from app.models.audit import Audit
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/summary")
def get_national_kpi_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """Retrieve national aggregate KPIs, outlay status, and operational metrics."""
    total_projects = db.scalar(select(func.count(Project.id))) or 0
    total_schemes = db.scalar(select(func.count(Scheme.id))) or 0
    total_ngos = db.scalar(select(func.count(Organization.id))) or 0
    total_beneficiaries = db.scalar(select(func.count(Beneficiary.id))) or 0
    open_grievances = db.scalar(select(func.count(Grievance.id)).where(Grievance.status == "OPEN")) or 0
    completed_inspections = db.scalar(select(func.count(Audit.id)).where(Audit.status == "COMPLETED")) or 0

    sanctioned_sum = db.scalar(select(func.sum(Project.sanctioned_grant_lakhs))) or Decimal("0.00")
    utilized_sum = db.scalar(select(func.sum(Project.utilized_grant_lakhs))) or Decimal("0.00")

    high_risk_projects = db.scalar(select(func.count(Project.id)).where(Project.risk_level == "HIGH")) or 0
    medium_risk_projects = db.scalar(select(func.count(Project.id)).where(Project.risk_level == "MEDIUM")) or 0
    low_risk_projects = db.scalar(select(func.count(Project.id)).where(Project.risk_level == "LOW")) or 0

    return {
        "totalProjects": total_projects,
        "totalSchemes": total_schemes,
        "totalNgos": total_ngos,
        "totalBeneficiaries": total_beneficiaries,
        "openGrievances": open_grievances,
        "completedInspections": completed_inspections,
        "totalSanctionedCr": round(float(sanctioned_sum) / 100.0, 2),
        "totalUtilizedCr": round(float(utilized_sum) / 100.0, 2),
        "riskDistribution": {
            "high": high_risk_projects,
            "medium": medium_risk_projects,
            "low": low_risk_projects,
        },
    }
