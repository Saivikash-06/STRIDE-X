from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.models.scheme import Scheme
from app.schemas.scheme import SchemeCreate, SchemeUpdate, SchemeResponse
from app.core.exceptions import NotFoundException, ConflictException
from app.core.permissions import UserRole
from app.api.deps import get_current_user, require_roles
from app.models.user import User

router = APIRouter()


@router.get("", response_model=List[SchemeResponse])
def list_schemes(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve welfare schemes portfolio."""
    stmt = select(Scheme)
    if status_filter:
        stmt = stmt.where(Scheme.status == status_filter)
    schemes = db.scalars(stmt).all()
    return schemes


@router.get("/{scheme_id}", response_model=SchemeResponse)
def get_scheme_by_id(
    scheme_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve details for a single welfare scheme."""
    stmt = select(Scheme).where(Scheme.id == scheme_id)
    scheme = db.scalar(stmt)
    if not scheme:
        raise NotFoundException("Scheme", scheme_id)
    return scheme


@router.post("", response_model=SchemeResponse, status_code=status.HTTP_201_CREATED)
def create_scheme(
    scheme_in: SchemeCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    """Register a new welfare scheme. Restricted to Central Administrator."""
    existing_stmt = select(Scheme).where(Scheme.code == scheme_in.code.strip().upper())
    if db.scalar(existing_stmt):
        raise ConflictException(f"Scheme code '{scheme_in.code}' already exists.")

    new_scheme = Scheme(
        code=scheme_in.code.strip().upper(),
        name=scheme_in.name,
        category=scheme_in.category,
        target_group=scheme_in.target_group,
        description=scheme_in.description,
        responsible_dept=scheme_in.responsible_dept,
        budget_allocated_cr=scheme_in.budget_allocated_cr,
        budget_released_cr=scheme_in.budget_released_cr,
        budget_utilized_cr=scheme_in.budget_utilized_cr,
        active_projects_count=scheme_in.active_projects_count,
        beneficiaries_count=scheme_in.beneficiaries_count,
        nodal_officer=scheme_in.nodal_officer,
        status=scheme_in.status,
        start_date=scheme_in.start_date,
        end_date=scheme_in.end_date,
    )
    db.add(new_scheme)
    db.commit()
    db.refresh(new_scheme)
    return new_scheme


@router.patch("/{scheme_id}", response_model=SchemeResponse)
def update_scheme(
    scheme_id: str,
    scheme_in: SchemeUpdate,
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    """Update scheme metadata, status, or financial allocation."""
    stmt = select(Scheme).where(Scheme.id == scheme_id)
    scheme = db.scalar(stmt)
    if not scheme:
        raise NotFoundException("Scheme", scheme_id)

    update_data = scheme_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(scheme, field, value)

    db.commit()
    db.refresh(scheme)
    return scheme
