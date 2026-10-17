from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class GrievanceCreate(BaseModel):
    beneficiary_name: str
    beneficiary_contact: Optional[str] = None
    project_id: str
    scheme_id: Optional[str] = None
    category: str
    description: str
    priority: str = "MEDIUM"
    filing_date: str
    sla_deadline: str


class GrievanceUpdateStatus(BaseModel):
    status: str  # OPEN, IN_PROGRESS, RESOLVED, ESCALATED
    assigned_authority_id: Optional[str] = None
    assigned_authority_name: Optional[str] = None
    resolution_remarks: Optional[str] = None


class GrievanceResponse(BaseModel):
    id: str
    grievance_id: str = Field(..., serialization_alias="grievanceId")
    beneficiary_name: str = Field(..., serialization_alias="beneficiaryName")
    beneficiary_contact: Optional[str] = Field(None, serialization_alias="beneficiaryContact")
    scheme_name: str = Field("", serialization_alias="schemeName")
    project_name: str = Field("", serialization_alias="projectName")
    project_id: str = Field(..., serialization_alias="projectId")
    category: str
    description: str
    priority: str
    status: str
    filing_date: str = Field(..., serialization_alias="filingDate")
    sla_deadline: str = Field(..., serialization_alias="slaDeadline")
    assigned_authority: Optional[str] = Field(None, serialization_alias="assignedAuthority")
    resolution_remarks: Optional[str] = Field(None, serialization_alias="resolutionRemarks")
    resolved_at: Optional[datetime] = Field(None, serialization_alias="resolvedAt")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
