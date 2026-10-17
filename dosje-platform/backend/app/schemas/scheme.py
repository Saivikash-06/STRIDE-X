from typing import Optional
from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class SchemeBase(BaseModel):
    code: str
    name: str
    category: str
    target_group: str
    description: Optional[str] = None
    responsible_dept: str = "Department of Social Justice & Empowerment"
    budget_allocated_cr: Decimal = Decimal("0.00")
    budget_released_cr: Decimal = Decimal("0.00")
    budget_utilized_cr: Decimal = Decimal("0.00")
    active_projects_count: int = 0
    beneficiaries_count: int = 0
    nodal_officer: Optional[str] = None
    status: str = "ACTIVE"
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class SchemeCreate(SchemeBase):
    pass


class SchemeUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    target_group: Optional[str] = None
    description: Optional[str] = None
    budget_allocated_cr: Optional[Decimal] = None
    budget_released_cr: Optional[Decimal] = None
    budget_utilized_cr: Optional[Decimal] = None
    nodal_officer: Optional[str] = None
    status: Optional[str] = None


class SchemeResponse(BaseModel):
    id: str
    code: str
    name: str
    category: str
    target_group: str = Field(..., serialization_alias="targetGroup")
    description: Optional[str] = None
    responsible_dept: str = Field(..., serialization_alias="responsibleDept")
    budget_allocated_cr: float = Field(..., serialization_alias="budgetAllocatedCr")
    budget_released_cr: float = Field(..., serialization_alias="budgetReleasedCr")
    budget_utilized_cr: float = Field(..., serialization_alias="budgetUtilizedCr")
    active_projects_count: int = Field(..., serialization_alias="activeProjectsCount")
    beneficiaries_count: int = Field(..., serialization_alias="beneficiariesCount")
    nodal_officer: Optional[str] = Field(None, serialization_alias="nodalOfficer")
    status: str
    start_date: Optional[str] = Field(None, serialization_alias="startDate")
    end_date: Optional[str] = Field(None, serialization_alias="endDate")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
