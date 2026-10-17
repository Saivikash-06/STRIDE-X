from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.models.audit import Audit
from app.models.project import Project
from app.schemas.audit import AuditCreate, AuditUpdate, AuditResponse
from app.core.exceptions import NotFoundException, ConflictException, PermissionDeniedException
from app.core.permissions import UserRole
from app.api.deps import get_current_user, require_roles
from app.models.user import User

router = APIRouter()


def _format_audit_response(a: Audit) -> AuditResponse:
    return AuditResponse(
        id=a.id,
        inspection_id=a.inspection_id,
        project_id=a.project_id,
        project_name=a.project.name if a.project else "",
        ngo_name=a.project.organization.name if a.project and a.project.organization else "",
        state=a.project.state if a.project else "",
        district=a.project.district if a.project else "",
        inspector_name=a.inspector_name,
        inspector_badge=a.inspector_badge,
        scheduled_date=a.scheduled_date,
        completed_date=a.completed_date,
        status=a.status,
        priority=a.priority,
        inspection_type=a.inspection_type,
        geo_verified=a.geo_verified,
        geo_distance_meters=a.geo_distance_meters,
        observation_summary=a.observation_summary,
        photo_evidence_count=a.photo_evidence_count,
        score_percent=a.score_percent,
        critical_defects_count=a.critical_defects_count,
        corrective_actions=a.corrective_actions,
        follow_up_date=a.follow_up_date,
        created_at=a.created_at,
        updated_at=a.updated_at,
    )


@router.get("", response_model=List[AuditResponse])
def list_audits(
    project_id: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    priority: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List physical inspections and statutory audits."""
    stmt = select(Audit)

    if project_id:
        stmt = stmt.where(Audit.project_id == project_id)
    if status_filter:
        stmt = stmt.where(Audit.status == status_filter)
    if priority:
        stmt = stmt.where(Audit.priority == priority)

    # PMU Auditor sees audits assigned to them or their zonal jurisdiction
    if current_user.role == UserRole.PMU.value:
        stmt = stmt.where((Audit.inspector_id == current_user.id) | (Audit.inspector_name.ilike(f"%{current_user.name}%")))

    audits = db.scalars(stmt).all()
    return [_format_audit_response(a) for a in audits]


@router.get("/{audit_id}", response_model=AuditResponse)
def get_audit_by_id(
    audit_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve details for a single inspection audit."""
    stmt = select(Audit).where(Audit.id == audit_id)
    audit = db.scalar(stmt)
    if not audit:
        raise NotFoundException("Audit", audit_id)
    return _format_audit_response(audit)


@router.post("", response_model=AuditResponse, status_code=status.HTTP_201_CREATED)
def schedule_audit(
    audit_in: AuditCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.AUTHORITY, UserRole.PMU)),
    db: Session = Depends(get_db),
):
    """Dispatch and schedule an inspection audit."""
    project = db.scalar(select(Project).where(Project.id == audit_in.project_id))
    if not project:
        raise NotFoundException("Project", audit_in.project_id)

    count_stmt = select(Audit)
    total_count = len(db.scalars(count_stmt).all())
    inspection_code = f"INSP-2026-{(101 + total_count):03d}"

    new_audit = Audit(
        inspection_id=inspection_code,
        project_id=audit_in.project_id,
        inspector_id=audit_in.inspector_id,
        inspector_name=audit_in.inspector_name,
        inspector_badge=audit_in.inspector_badge or "PMU-INSP",
        scheduled_date=audit_in.scheduled_date,
        priority=audit_in.priority,
        inspection_type=audit_in.inspection_type,
        observation_summary=audit_in.observation_summary,
        status="SCHEDULED",
    )
    db.add(new_audit)
    db.commit()
    db.refresh(new_audit)
    return _format_audit_response(new_audit)


@router.patch("/{audit_id}", response_model=AuditResponse)
def update_audit(
    audit_id: str,
    audit_in: AuditUpdate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.AUTHORITY, UserRole.PMU)),
    db: Session = Depends(get_db),
):
    """Record inspection findings, GPS validation, evidence, and scores."""
    stmt = select(Audit).where(Audit.id == audit_id)
    audit = db.scalar(stmt)
    if not audit:
        raise NotFoundException("Audit", audit_id)

    update_data = audit_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(audit, field, value)

    # If marked COMPLETED, update project inspection status
    if audit_in.status == "COMPLETED":
        audit.completed_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        project = db.scalar(select(Project).where(Project.id == audit.project_id))
        if project:
            project.inspection_status = "COMPLETED"

    db.commit()
    db.refresh(audit)
    return _format_audit_response(audit)
