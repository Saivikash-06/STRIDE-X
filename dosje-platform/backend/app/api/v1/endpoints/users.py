from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserStatusUpdate, UserResponse
from app.core.security import hash_password
from app.core.exceptions import NotFoundException, ConflictException, PermissionDeniedException
from app.core.permissions import UserRole
from app.api.deps import get_current_user, require_roles

router = APIRouter()


@router.get("", response_model=List[UserResponse])
def list_users(
    role: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.AUTHORITY)),
    db: Session = Depends(get_db),
):
    """List users, restricted by role and jurisdiction."""
    stmt = select(User)

    # State Authority can only view users in their assigned jurisdiction
    if current_user.role == UserRole.AUTHORITY.value and current_user.state:
        stmt = stmt.where(User.state == current_user.state)
    elif state:
        stmt = stmt.where(User.state == state)

    if role:
        stmt = stmt.where(User.role == role)
    if is_active is not None:
        stmt = stmt.where(User.is_active == is_active)

    users = db.scalars(stmt).all()
    return users


@router.get("/{user_id}", response_model=UserResponse)
def get_user_by_id(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve details for a specific user."""
    stmt = select(User).where(User.id == user_id)
    user = db.scalar(stmt)
    if not user:
        raise NotFoundException("User", user_id)

    # Role jurisdiction check
    if current_user.role == UserRole.AUTHORITY.value and current_user.state and user.state != current_user.state:
        raise PermissionDeniedException("Cannot inspect user profile outside your designated state.")

    return user


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: UserCreate,
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    """Provision a new user account. Restricted to Central Administrators."""
    existing_stmt = select(User).where(User.email == user_in.email.strip().lower())
    if db.scalar(existing_stmt):
        raise ConflictException(f"User with email '{user_in.email}' already exists.")

    new_user = User(
        email=user_in.email.strip().lower(),
        hashed_password=hash_password(user_in.password),
        name=user_in.name,
        role=user_in.role.value,
        designation=user_in.designation,
        department=user_in.department,
        state=user_in.state,
        district=user_in.district,
        organization_id=user_in.organization_id,
        badge_number=user_in.badge_number,
        phone=user_in.phone,
        jurisdiction=user_in.jurisdiction,
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.patch("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: str,
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update profile details for a user."""
    # Only Admin or user themselves can update their profile
    if current_user.role != UserRole.ADMIN.value and current_user.id != user_id:
        raise PermissionDeniedException("Not authorized to modify another user's profile.")

    stmt = select(User).where(User.id == user_id)
    user = db.scalar(stmt)
    if not user:
        raise NotFoundException("User", user_id)

    update_data = user_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    return user


@router.patch("/{user_id}/status", response_model=UserResponse)
def update_user_status(
    user_id: str,
    status_in: UserStatusUpdate,
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
    db: Session = Depends(get_db),
):
    """Activate or deactivate a user account. Restricted to Central Administrators."""
    if current_user.id == user_id:
        raise PermissionDeniedException("Administrators cannot deactivate their own account.")

    stmt = select(User).where(User.id == user_id)
    user = db.scalar(stmt)
    if not user:
        raise NotFoundException("User", user_id)

    user.is_active = status_in.is_active
    db.commit()
    db.refresh(user)
    return user
