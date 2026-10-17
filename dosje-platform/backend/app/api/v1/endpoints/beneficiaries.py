from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.models.beneficiary import Beneficiary
from app.models.project import Project
from app.schemas.beneficiary import BeneficiaryCreate, BeneficiaryUpdate, BeneficiaryResponse
from app.core.exceptions import NotFoundException, ConflictException, PermissionDeniedException
from app.core.permissions import UserRole
from app.api.deps import get_current_user, require_roles
from app.models.user import User

router = APIRouter()


def _format_beneficiary_response(b: Beneficiary) -> BeneficiaryResponse:
    return BeneficiaryResponse(
        id=b.id,
        beneficiary_id=b.beneficiary_id,
        full_name=b.full_name,
        gender=b.gender,
        age=b.age,
        category=b.category,
        aadhaar_verified=b.aadhaar_verified,
        dbt_account_linked=b.dbt_account_linked,
        project_id=b.project_id,
        project_name=b.project.name if b.project else "",
        scheme_name=b.project.scheme.name if b.project and b.project.scheme else "",
        state=b.state,
        district=b.district,
        disbursed_amount=float(b.disbursed_amount),
        last_attendance_date=b.last_attendance_date,
        attendance_rate=b.attendance_rate,
        verification_status=b.verification_status,
        created_at=b.created_at,
        updated_at=b.updated_at,
    )


@router.get("", response_model=List[BeneficiaryResponse])
def list_beneficiaries(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    project_id: Optional[str] = Query(None),
    verification_status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List direct welfare entitlement recipients with state jurisdiction filters."""
    stmt = select(Beneficiary)

    # State Authority jurisdiction scoping
    if current_user.role == UserRole.AUTHORITY.value and current_user.state:
        stmt = stmt.where(Beneficiary.state.ilike(current_user.state))
    elif state:
        stmt = stmt.where(Beneficiary.state.ilike(state))

    # Beneficiary user can only inspect their own record
    if current_user.role == UserRole.BENEFICIARY.value:
        stmt = stmt.where(Beneficiary.full_name.ilike(f"%{current_user.name}%"))

    if district:
        stmt = stmt.where(Beneficiary.district.ilike(district))
    if project_id:
        stmt = stmt.where(Beneficiary.project_id == project_id)
    if verification_status:
        stmt = stmt.where(Beneficiary.verification_status == verification_status)

    beneficiaries = db.scalars(stmt).all()
    return [_format_beneficiary_response(b) for b in beneficiaries]


@router.get("/{beneficiary_id}", response_model=BeneficiaryResponse)
def get_beneficiary_by_id(
    beneficiary_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve details for a single beneficiary."""
    stmt = select(Beneficiary).where(Beneficiary.id == beneficiary_id)
    beneficiary = db.scalar(stmt)
    if not beneficiary:
        raise NotFoundException("Beneficiary", beneficiary_id)

    if current_user.role == UserRole.AUTHORITY.value and current_user.state and beneficiary.state.lower() != current_user.state.lower():
        raise PermissionDeniedException("Beneficiary is outside your state jurisdiction.")

    return _format_beneficiary_response(beneficiary)


@router.post("", response_model=BeneficiaryResponse, status_code=status.HTTP_201_CREATED)
def create_beneficiary(
    b_in: BeneficiaryCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.AUTHORITY, UserRole.NGO)),
    db: Session = Depends(get_db),
):
    """Enroll a new welfare beneficiary."""
    project = db.scalar(select(Project).where(Project.id == b_in.project_id))
    if not project:
        raise NotFoundException("Project", b_in.project_id)

    if db.scalar(select(Beneficiary).where(Beneficiary.beneficiary_id == b_in.beneficiary_id)):
        raise ConflictException(f"Beneficiary reference '{b_in.beneficiary_id}' already registered.")

    new_b = Beneficiary(
        beneficiary_id=b_in.beneficiary_id,
        full_name=b_in.full_name,
        gender=b_in.gender,
        age=b_in.age,
        category=b_in.category,
        project_id=b_in.project_id,
        state=b_in.state,
        district=b_in.district,
        disbursed_amount=b_in.disbursed_amount,
        aadhaar_verified=b_in.aadhaar_verified,
        dbt_account_linked=b_in.dbt_account_linked,
        attendance_rate=b_in.attendance_rate,
        verification_status=b_in.verification_status,
    )
    db.add(new_b)
    db.commit()
    db.refresh(new_b)
    return _format_beneficiary_response(new_b)


@router.patch("/{beneficiary_id}", response_model=BeneficiaryResponse)
def update_beneficiary(
    beneficiary_id: str,
    b_in: BeneficiaryUpdate,
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.AUTHORITY, UserRole.NGO)),
    db: Session = Depends(get_db),
):
    """Update beneficiary enrollment or verification status."""
    stmt = select(Beneficiary).where(Beneficiary.id == beneficiary_id)
    b = db.scalar(stmt)
    if not b:
        raise NotFoundException("Beneficiary", beneficiary_id)

    update_data = b_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(b, field, value)

    db.commit()
    db.refresh(b)
    return _format_beneficiary_response(b)
