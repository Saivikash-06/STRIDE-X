from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.models.organization import Organization
from app.schemas.organization import OrganizationCreate, OrganizationUpdate, OrganizationResponse
from app.core.exceptions import NotFoundException, ConflictException
from app.core.permissions import UserRole
from app.api.deps import get_current_user, require_roles
from app.models.user import User

router = APIRouter()


@router.get("", response_model=List[OrganizationResponse])
def list_ngos(
    state: Optional[str] = Query(None),
    blacklisted: Optional[bool] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List empaneled Non-Governmental Organizations and Implementing Agencies."""
    stmt = select(Organization)
    if state:
        stmt = stmt.where(Organization.state.ilike(state))
    if blacklisted is not None:
        stmt = stmt.where(Organization.blacklisted == blacklisted)

    ngos = db.scalars(stmt).all()
    return ngos


@router.get("/{ngo_id}", response_model=OrganizationResponse)
def get_ngo_by_id(
    ngo_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve details for a specific empaneled NGO."""
    stmt = select(Organization).where(Organization.id == ngo_id)
    ngo = db.scalar(stmt)
    if not ngo:
        raise NotFoundException("Organization", ngo_id)
    return ngo


@router.post("", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
def register_ngo(
    ngo_in: OrganizationCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.AUTHORITY)),
    db: Session = Depends(get_db),
):
    """Empanel a new NGO agency with NGO Darpan validation."""
    if db.scalar(select(Organization).where(Organization.darpan_id == ngo_in.darpan_id)):
        raise ConflictException(f"NGO Darpan ID '{ngo_in.darpan_id}' is already registered.")

    new_ngo = Organization(
        darpan_id=ngo_in.darpan_id,
        name=ngo_in.name,
        state=ngo_in.state,
        district=ngo_in.district,
        registration_number=ngo_in.registration_number,
        contact_person=ngo_in.contact_person,
        email=ngo_in.email,
        phone=ngo_in.phone,
        active_projects=ngo_in.active_projects,
        compliance_score=ngo_in.compliance_score,
        last_audit_date=ngo_in.last_audit_date,
        blacklisted=ngo_in.blacklisted,
    )
    db.add(new_ngo)
    db.commit()
    db.refresh(new_ngo)
    return new_ngo


@router.patch("/{ngo_id}", response_model=OrganizationResponse)
def update_ngo(
    ngo_id: str,
    ngo_in: OrganizationUpdate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.AUTHORITY)),
    db: Session = Depends(get_db),
):
    """Update NGO compliance record or blacklist status."""
    stmt = select(Organization).where(Organization.id == ngo_id)
    ngo = db.scalar(stmt)
    if not ngo:
        raise NotFoundException("Organization", ngo_id)

    update_data = ngo_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(ngo, field, value)

    db.commit()
    db.refresh(ngo)
    return ngo
