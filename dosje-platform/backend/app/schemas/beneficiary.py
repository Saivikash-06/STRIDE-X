from typing import Optional
from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class BeneficiaryCreate(BaseModel):
    beneficiary_id: str
    full_name: str
    gender: str
    age: int
    category: str
    project_id: str
    state: str
    district: str
    disbursed_amount: Decimal = Decimal("0.00")
    aadhaar_verified: bool = True
    dbt_account_linked: bool = True
    attendance_rate: float = 85.0
    verification_status: str = "VERIFIED"


class BeneficiaryUpdate(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = None
    category: Optional[str] = None
    disbursed_amount: Optional[Decimal] = None
    attendance_rate: Optional[float] = None
    verification_status: Optional[str] = None
    dbt_account_linked: Optional[bool] = None


class BeneficiaryResponse(BaseModel):
    id: str
    beneficiary_id: str = Field(..., serialization_alias="beneficiaryId")
    full_name: str = Field(..., serialization_alias="fullName")
    gender: str
    age: int
    category: str
    aadhaar_verified: bool = Field(..., serialization_alias="aadhaarVerified")
    dbt_account_linked: bool = Field(..., serialization_alias="dbtAccountLinked")
    project_id: str = Field(..., serialization_alias="projectId")
    project_name: str = Field("", serialization_alias="projectName")
    scheme_name: str = Field("", serialization_alias="schemeName")
    state: str
    district: str
    disbursed_amount: float = Field(..., serialization_alias="disbursedAmount")
    last_attendance_date: Optional[str] = Field(None, serialization_alias="lastAttendanceDate")
    attendance_rate: float = Field(..., serialization_alias="attendanceRate")
    verification_status: str = Field("VERIFIED", serialization_alias="verificationStatus")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
