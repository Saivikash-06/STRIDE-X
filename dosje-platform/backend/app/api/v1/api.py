from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    users,
    schemes,
    projects,
    beneficiaries,
    budgets,
    audits,
    grievances,
    monitoring,
    ngos,
    staff,
    reports,
)
from app.schemas.common import HealthResponse
from app.core.config import settings

api_router = APIRouter()


@api_router.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    """Service health telemetry check."""
    return HealthResponse(
        status="ok",
        service="STRIDE-X National Governance Platform API",
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        database="ready",
    )


api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users & Access Control"])
api_router.include_router(schemes.router, prefix="/schemes", tags=["Welfare Schemes"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects & Facilities"])
api_router.include_router(beneficiaries.router, prefix="/beneficiaries", tags=["Beneficiaries"])
api_router.include_router(budgets.router, tags=["Budgets & Expenditures"])
api_router.include_router(audits.router, prefix="/audits", tags=["Audits & Inspections"])
api_router.include_router(grievances.router, prefix="/grievances", tags=["Grievances & Disputes"])
api_router.include_router(monitoring.router, prefix="/monitoring", tags=["Monitoring & CCTV"])
api_router.include_router(ngos.router, prefix="/ngos", tags=["NGOs & Agencies"])
api_router.include_router(staff.router, prefix="/staff", tags=["Staff Directory"])
api_router.include_router(reports.router, prefix="/reports", tags=["National Reports"])
