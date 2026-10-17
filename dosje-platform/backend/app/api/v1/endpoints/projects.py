from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.models.project import Project
from app.models.scheme import Scheme
from app.models.organization import Organization
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectStatusUpdate, ProjectResponse, Coordinates
from app.core.exceptions import NotFoundException, ConflictException, PermissionDeniedException
from app.core.permissions import UserRole
from app.api.deps import get_current_user, require_roles
from app.models.user import User

router = APIRouter()


def _format_project_response(project: Project) -> ProjectResponse:
    return ProjectResponse(
        id=project.id,
        project_code=project.project_code,
        name=project.name,
        scheme_id=project.scheme_id,
        scheme_name=project.scheme.name if project.scheme else "",
        ngo_id=project.ngo_id,
        ngo_name=project.organization.name if project.organization else "",
        state=project.state,
        district=project.district,
        address=project.address,
        coordinates=Coordinates(lat=project.latitude, lng=project.longitude),
        beneficiaries_count=project.beneficiaries_count,
        risk_level=project.risk_level,
        risk_score=project.risk_score,
        status=project.status,
        inspection_status=project.inspection_status,
        compliance_status=project.compliance_status,
        sanctioned_grant_lakhs=float(project.sanctioned_grant_lakhs),
        released_grant_lakhs=float(project.released_grant_lakhs),
        utilized_grant_lakhs=float(project.utilized_grant_lakhs),
        start_date=project.start_date,
        cctv_online=project.cctv_online,
        biometric_active=project.biometric_active,
        created_at=project.created_at,
        updated_at=project.updated_at,
    )


@router.get("", response_model=List[ProjectResponse])
def list_projects(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    scheme_id: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List welfare facilities and projects with jurisdiction scoping."""
    stmt = select(Project)

    # State Authority jurisdiction scoping
    if current_user.role == UserRole.AUTHORITY.value and current_user.state:
        stmt = stmt.where(Project.state.ilike(current_user.state))
    elif state:
        stmt = stmt.where(Project.state.ilike(state))

    # NGO scoping: Can only view their own projects
    if current_user.role == UserRole.NGO.value and current_user.organization_id:
        stmt = stmt.where(Project.ngo_id == current_user.organization_id)

    if district:
        stmt = stmt.where(Project.district.ilike(district))
    if scheme_id:
        stmt = stmt.where(Project.scheme_id == scheme_id)
    if risk_level:
        stmt = stmt.where(Project.risk_level == risk_level)
    if status_filter:
        stmt = stmt.where(Project.status == status_filter)

    projects = db.scalars(stmt).all()
    return [_format_project_response(p) for p in projects]


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project_by_id(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve details for a single project facility."""
    stmt = select(Project).where(Project.id == project_id)
    project = db.scalar(stmt)
    if not project:
        raise NotFoundException("Project", project_id)

    # Jurisdiction check for State Authority
    if current_user.role == UserRole.AUTHORITY.value and current_user.state:
        if project.state.lower() != current_user.state.lower():
            raise PermissionDeniedException("Project lies outside your state jurisdiction.")

    return _format_project_response(project)


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.AUTHORITY)),
    db: Session = Depends(get_db),
):
    """Register a new project facility."""
    # Check scheme exists
    scheme = db.scalar(select(Scheme).where(Scheme.id == project_in.scheme_id))
    if not scheme:
        raise NotFoundException("Scheme", project_in.scheme_id)

    # Check organization exists
    ngo = db.scalar(select(Organization).where(Organization.id == project_in.ngo_id))
    if not ngo:
        raise NotFoundException("Organization", project_in.ngo_id)

    # Check project code duplicate
    if db.scalar(select(Project).where(Project.project_code == project_in.project_code)):
        raise ConflictException(f"Project code '{project_in.project_code}' already exists.")

    new_project = Project(
        project_code=project_in.project_code,
        name=project_in.name,
        scheme_id=project_in.scheme_id,
        ngo_id=project_in.ngo_id,
        state=project_in.state,
        district=project_in.district,
        address=project_in.address,
        latitude=project_in.latitude,
        longitude=project_in.longitude,
        beneficiaries_count=project_in.beneficiaries_count,
        risk_level=project_in.risk_level,
        risk_score=project_in.risk_score,
        status=project_in.status,
        inspection_status=project_in.inspection_status,
        compliance_status=project_in.compliance_status,
        sanctioned_grant_lakhs=project_in.sanctioned_grant_lakhs,
        released_grant_lakhs=project_in.released_grant_lakhs,
        utilized_grant_lakhs=project_in.utilized_grant_lakhs,
        start_date=project_in.start_date,
        expected_completion_date=project_in.expected_completion_date,
        cctv_online=project_in.cctv_online,
        biometric_active=project_in.biometric_active,
        created_by_id=current_user.id,
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return _format_project_response(new_project)


@router.patch("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: str,
    project_in: ProjectUpdate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.AUTHORITY, UserRole.NGO)),
    db: Session = Depends(get_db),
):
    """Update project status, metrics, or telemetry."""
    stmt = select(Project).where(Project.id == project_id)
    project = db.scalar(stmt)
    if not project:
        raise NotFoundException("Project", project_id)

    if current_user.role == UserRole.AUTHORITY.value and current_user.state and project.state.lower() != current_user.state.lower():
        raise PermissionDeniedException("Project lies outside your state jurisdiction.")

    if current_user.role == UserRole.NGO.value and current_user.organization_id != project.ngo_id:
        raise PermissionDeniedException("Not authorized to modify another organization's project.")

    update_data = project_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return _format_project_response(project)


@router.patch("/{project_id}/status", response_model=ProjectResponse)
def update_project_status(
    project_id: str,
    status_in: ProjectStatusUpdate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.AUTHORITY)),
    db: Session = Depends(get_db),
):
    """Transition project state (e.g., ACTIVE, SUSPENDED, COMPLETED)."""
    stmt = select(Project).where(Project.id == project_id)
    project = db.scalar(stmt)
    if not project:
        raise NotFoundException("Project", project_id)

    project.status = status_in.status
    db.commit()
    db.refresh(project)
    return _format_project_response(project)
