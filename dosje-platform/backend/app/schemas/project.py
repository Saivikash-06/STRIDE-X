from typing import Optional
from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class Coordinates(BaseModel):
    lat: float
    lng: float


class ProjectCreate(BaseModel):
    project_code: str
    name: str
    scheme_id: str
    ngo_id: str
    state: str
    district: str
    address: str = ""
    latitude: float = 20.5937
    longitude: float = 78.9629
    beneficiaries_count: int = 0
    risk_level: str = "LOW"
    risk_score: float = 15.0
    status: str = "ACTIVE"
    inspection_status: str = "SCHEDULED"
    compliance_status: str = "COMPLIANT"
    sanctioned_grant_lakhs: Decimal = Decimal("0.00")
    released_grant_lakhs: Decimal = Decimal("0.00")
    utilized_grant_lakhs: Decimal = Decimal("0.00")
    start_date: Optional[str] = None
    expected_completion_date: Optional[str] = None
    cctv_online: bool = True
    biometric_active: bool = True


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    beneficiaries_count: Optional[int] = None
    risk_level: Optional[str] = None
    risk_score: Optional[float] = None
    status: Optional[str] = None
    inspection_status: Optional[str] = None
    compliance_status: Optional[str] = None
    sanctioned_grant_lakhs: Optional[Decimal] = None
    released_grant_lakhs: Optional[Decimal] = None
    utilized_grant_lakhs: Optional[Decimal] = None
    cctv_online: Optional[bool] = None
    biometric_active: Optional[bool] = None


class ProjectStatusUpdate(BaseModel):
    status: str


class ProjectResponse(BaseModel):
    id: str
    project_code: str = Field(..., serialization_alias="projectCode")
    name: str
    scheme_id: str = Field(..., serialization_alias="schemeId")
    scheme_name: str = Field("", serialization_alias="schemeName")
    ngo_id: str = Field(..., serialization_alias="ngoId")
    ngo_name: str = Field("", serialization_alias="ngoName")
    state: str
    district: str
    address: str
    coordinates: Coordinates
    beneficiaries_count: int = Field(..., serialization_alias="beneficiariesCount")
    risk_level: str = Field(..., serialization_alias="riskLevel")
    risk_score: float = Field(..., serialization_alias="riskScore")
    status: str
    inspection_status: str = Field(..., serialization_alias="inspectionStatus")
    compliance_status: str = Field(..., serialization_alias="complianceStatus")
    sanctioned_grant_lakhs: float = Field(..., serialization_alias="sanctionedGrantLakhs")
    released_grant_lakhs: float = Field(..., serialization_alias="releasedGrantLakhs")
    utilized_grant_lakhs: float = Field(..., serialization_alias="utilizedGrantLakhs")
    start_date: Optional[str] = Field(None, serialization_alias="startDate")
    cctv_online: bool = Field(True, serialization_alias="cctvOnline")
    biometric_active: bool = Field(True, serialization_alias="biometricActive")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
