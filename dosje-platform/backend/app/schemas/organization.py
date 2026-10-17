from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class OrganizationBase(BaseModel):
    darpan_id: str = Field(..., serialization_alias="darpanId")
    name: str
    state: str
    district: str
    registration_number: str = Field(..., serialization_alias="registrationNumber")
    contact_person: str = Field(..., serialization_alias="contactPerson")
    email: str
    phone: str
    active_projects: int = Field(0, serialization_alias="activeProjects")
    compliance_score: float = Field(100.0, serialization_alias="complianceScore")
    last_audit_date: Optional[str] = Field(None, serialization_alias="lastAuditDate")
    blacklisted: bool = False


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    compliance_score: Optional[float] = None
    blacklisted: Optional[bool] = None


class OrganizationResponse(OrganizationBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
