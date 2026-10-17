from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.models.grievance import Grievance
from app.models.project import Project
from app.schemas.grievance import GrievanceCreate, GrievanceUpdateStatus, GrievanceResponse
from app.core.exceptions import NotFoundException, ConflictException, PermissionDeniedException
from app.core.permissions import UserRole
from app.api.deps import get_current_user, require_roles
from app.models.user import User

router = APIRouter()


def _format_grievance_response(g: Grievance) -> GrievanceResponse:
    return GrievanceResponse(
        id=g.id,
        grievance_id=g.grievance_id,
        beneficiary_name=g.beneficiary_name,
        beneficiary_contact=g.beneficiary_contact,
        scheme_name=g.project.scheme.name if g.project and g.project.scheme else "",
        project_name=g.project.name if g.project else "",
        project_id=g.project_id,
        category=g.category,
        description=g.description,
        priority=g.priority,
        status=g.status,
        filing_date=g.filing_date,
        sla_deadline=g.sla_deadline,
        assigned_authority=g.assigned_authority_name,
        resolution_remarks=g.resolution_remarks,
        resolved_at=g.resolved_at,
        created_at=g.created_at,
        updated_at=g.updated_at,
    )


@router.get("", response_model=List[GrievanceResponse])
def list_grievances(
    status_filter: Optional[str] = Query(None, alias="status"),
    priority: Optional[str] = Query(None),
    project_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List citizen grievances and dispute tickets."""
    stmt = select(Grievance)

    if status_filter:
        stmt = stmt.where(Grievance.status == status_filter)
    if priority:
        stmt = stmt.where(Grievance.priority == priority)
    if project_id:
        stmt = stmt.where(Grievance.project_id == project_id)

    # Beneficiary role can only view their own tickets
    if current_user.role == UserRole.BENEFICIARY.value:
        stmt = stmt.where(Grievance.beneficiary_name.ilike(f"%{current_user.name}%"))

    grievances = db.scalars(stmt).all()
    return [_format_grievance_response(g) for g in grievances]


@router.get("/{grievance_id}", response_model=GrievanceResponse)
def get_grievance_by_id(
    grievance_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve details for a single grievance ticket."""
    stmt = select(Grievance).where(Grievance.id == grievance_id)
    g = db.scalar(stmt)
    if not g:
        raise NotFoundException("Grievance", grievance_id)
    return _format_grievance_response(g)


@router.post("", response_model=GrievanceResponse, status_code=status.HTTP_201_CREATED)
def submit_grievance(
    g_in: GrievanceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Lodge a citizen grievance against a welfare facility."""
    project = db.scalar(select(Project).where(Project.id == g_in.project_id))
    if not project:
        raise NotFoundException("Project", g_in.project_id)

    total_count = len(db.scalars(select(Grievance)).all())
    code = f"GRV-2026-{(1001 + total_count)}"

    new_g = Grievance(
        grievance_id=code,
        beneficiary_name=g_in.beneficiary_name,
        beneficiary_contact=g_in.beneficiary_contact,
        project_id=g_in.project_id,
        scheme_id=g_in.scheme_id or project.scheme_id,
        category=g_in.category,
        description=g_in.description,
        priority=g_in.priority,
        status="OPEN",
        filing_date=g_in.filing_date,
        sla_deadline=g_in.sla_deadline,
        assigned_authority_name="District Nodal Officer",
    )
    db.add(new_g)
    db.commit()
    db.refresh(new_g)
    return _format_grievance_response(new_g)


@router.patch("/{grievance_id}/status", response_model=GrievanceResponse)
def update_grievance_status(
    grievance_id: str,
    status_in: GrievanceUpdateStatus,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.AUTHORITY)),
    db: Session = Depends(get_db),
):
    """Assign, escalate, or resolve a citizen grievance."""
    stmt = select(Grievance).where(Grievance.id == grievance_id)
    g = db.scalar(stmt)
    if not g:
        raise NotFoundException("Grievance", grievance_id)

    g.status = status_in.status
    if status_in.assigned_authority_id:
        g.assigned_authority_id = status_in.assigned_authority_id
    if status_in.assigned_authority_name:
        g.assigned_authority_name = status_in.assigned_authority_name
    if status_in.resolution_remarks:
        g.resolution_remarks = status_in.resolution_remarks
    if status_in.status == "RESOLVED":
        g.resolved_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(g)
    return _format_grievance_response(g)
