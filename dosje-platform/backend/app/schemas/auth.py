from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from app.core.permissions import UserRole


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshRequest(BaseModel):
    refresh_token: str


class UserProfile(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: UserRole
    designation: str
    department: str
    state: Optional[str] = None
    district: Optional[str] = None
    organization_id: Optional[str] = None
    badge_number: Optional[str] = None
    phone: Optional[str] = None
    jurisdiction: Optional[str] = None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
