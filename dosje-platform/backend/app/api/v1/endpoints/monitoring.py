from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.models.monitoring import MonitoringRecord, AiAnomaly, AuditLog, CctvTelemetry
from app.models.project import Project
from app.schemas.monitoring import (
    MonitoringRecordCreate,
    MonitoringRecordResponse,
    AiAnomalyResponse,
    AiAnomalyUpdate,
    AuditLogResponse,
    CctvTelemetryResponse,
)
from app.core.exceptions import NotFoundException, PermissionDeniedException
from app.core.permissions import UserRole
from app.api.deps import get_current_user, require_roles
from app.models.user import User

router = APIRouter()


@router.get("/projects/{project_id}/monitoring", response_model=List[MonitoringRecordResponse])
def get_project_monitoring_records(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve periodic monitoring logs for a specific facility."""
    stmt = select(MonitoringRecord).where(MonitoringRecord.project_id == project_id)
    records = db.scalars(stmt).all()
    return records


@router.post("/projects/{project_id}/monitoring", response_model=MonitoringRecordResponse, status_code=status.HTTP_201_CREATED)
def record_project_monitoring(
    project_id: str,
    rec_in: MonitoringRecordCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.AUTHORITY, UserRole.STAFF, UserRole.PMU)),
    db: Session = Depends(get_db),
):
    """Log field observation telemetry."""
    project = db.scalar(select(Project).where(Project.id == project_id))
    if not project:
        raise NotFoundException("Project", project_id)

    new_rec = MonitoringRecord(
        project_id=project_id,
        officer_id=current_user.id,
        officer_name=current_user.name,
        monitoring_date=rec_in.monitoring_date,
        status=rec_in.status,
        observations=rec_in.observations,
        next_monitoring_date=rec_in.next_monitoring_date,
    )
    db.add(new_rec)
    db.commit()
    db.refresh(new_rec)
    return new_rec


@router.get("/anomalies", response_model=List[AiAnomalyResponse])
def list_ai_anomalies(
    status_filter: Optional[str] = Query(None, alias="status"),
    priority: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List automated algorithmic risk anomalies detected across welfare facilities."""
    stmt = select(AiAnomaly)
    if status_filter:
        stmt = stmt.where(AiAnomaly.status == status_filter)
    if priority:
        stmt = stmt.where(AiAnomaly.priority == priority)

    anomalies = db.scalars(stmt).all()
    results = []
    for a in anomalies:
        project = db.scalar(select(Project).where(Project.id == a.project_id))
        results.append(
            AiAnomalyResponse(
                id=a.id,
                anomaly_code=a.anomaly_code,
                project_id=a.project_id,
                project_name=project.name if project else "",
                state=project.state if project else "",
                title=a.title,
                description=a.description,
                category=a.category,
                priority=a.priority,
                risk_score=a.risk_score,
                status=a.status,
                suggested_action=a.suggested_action,
                detected_at=a.detected_at,
                resolved_by_id=a.resolved_by_id,
                resolution_notes=a.resolution_notes,
            )
        )
    return results


@router.patch("/anomalies/{anomaly_id}", response_model=AiAnomalyResponse)
def update_ai_anomaly_status(
    anomaly_id: str,
    anomaly_in: AiAnomalyUpdate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.AUTHORITY)),
    db: Session = Depends(get_db),
):
    """Acknowledge, investigate, or resolve an automated anomaly detection flag."""
    a = db.scalar(select(AiAnomaly).where(AiAnomaly.id == anomaly_id))
    if not a:
        raise NotFoundException("AiAnomaly", anomaly_id)

    a.status = anomaly_in.status
    a.resolved_by_id = current_user.id
    if anomaly_in.resolution_notes:
        a.resolution_notes = anomaly_in.resolution_notes

    db.commit()
    db.refresh(a)

    project = db.scalar(select(Project).where(Project.id == a.project_id))
    return AiAnomalyResponse(
        id=a.id,
        anomaly_code=a.anomaly_code,
        project_id=a.project_id,
        project_name=project.name if project else "",
        state=project.state if project else "",
        title=a.title,
        description=a.description,
        category=a.category,
        priority=a.priority,
        risk_score=a.risk_score,
        status=a.status,
        suggested_action=a.suggested_action,
        detected_at=a.detected_at,
        resolved_by_id=a.resolved_by_id,
        resolution_notes=a.resolution_notes,
    )


@router.get("/cctv", response_model=List[CctvTelemetryResponse])
def list_cctv_cameras(
    is_online: Optional[bool] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve CCTV camera telemetry grid feeds."""
    stmt = select(CctvTelemetry)
    if is_online is not None:
        stmt = stmt.where(CctvTelemetry.is_online == is_online)

    cameras = db.scalars(stmt).all()
    results = []
    for c in cameras:
        project = db.scalar(select(Project).where(Project.id == c.project_id))
        results.append(
            CctvTelemetryResponse(
                id=c.id,
                camera_name=c.camera_name,
                project_id=c.project_id,
                project_name=project.name if project else "",
                location=c.location,
                ip_address=c.ip_address,
                is_online=c.is_online,
                health_indicator=c.health_indicator,
                last_heartbeat=c.last_heartbeat,
                stream_url=c.stream_url,
                fps=c.fps,
                resolution=c.resolution,
            )
        )
    return results


@router.get("/audit-logs", response_model=List[AuditLogResponse])
def list_audit_trail_logs(
    module: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    """Retrieve immutable administrative audit trail logs. Central Admin clearance required."""
    stmt = select(AuditLog).order_by(AuditLog.timestamp.desc())
    if module:
        stmt = stmt.where(AuditLog.module == module)
    if status_filter:
        stmt = stmt.where(AuditLog.status == status_filter)

    logs = db.scalars(stmt).all()
    return [
        AuditLogResponse(
            id=log.id,
            user=log.user_email,
            role=log.role,
            action=log.action,
            module=log.module,
            timestamp=log.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            ip_address=log.ip_address,
            status=log.status,
            details=log.details,
        )
        for log in logs
    ]
