from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict
from app.core.permissions import UserRole


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: UserRole
    designation: str = ""
    department: str = ""
    state: Optional[str] = None
    district: Optional[str] = None
    organization_id: Optional[str] = None
    badge_number: Optional[str] = None
    phone: Optional[str] = None
    jurisdiction: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    phone: Optional[str] = None
    jurisdiction: Optional[str] = None


class UserStatusUpdate(BaseModel):
    is_active: bool


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: str
    role: str
    designation: str
    department: str
    state: Optional[str] = None
    district: Optional[str] = None
    organization_id: Optional[str] = None
    badge_number: Optional[str] = None
    phone: Optional[str] = None
    jurisdiction: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
