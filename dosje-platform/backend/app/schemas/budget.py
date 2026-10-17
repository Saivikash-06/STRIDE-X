from typing import Optional
from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class BudgetAllocationCreate(BaseModel):
    project_id: str
    fiscal_year: str
    sanctioned_amount: Decimal
    released_amount: Decimal = Decimal("0.00")
    allocation_date: str
    notes: Optional[str] = None


class BudgetAllocationResponse(BaseModel):
    id: str
    project_id: str = Field(..., serialization_alias="projectId")
    fiscal_year: str = Field(..., serialization_alias="fiscalYear")
    sanctioned_amount: float = Field(..., serialization_alias="sanctionedAmount")
    released_amount: float = Field(..., serialization_alias="releasedAmount")
    allocation_date: str = Field(..., serialization_alias="allocationDate")
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class ExpenditureCreate(BaseModel):
    amount: Decimal
    category: str
    description: str
    invoice_reference: Optional[str] = None


class ExpenditureUpdateStatus(BaseModel):
    approval_status: str  # APPROVED, REJECTED, VERIFIED
    rejection_reason: Optional[str] = None


class ExpenditureResponse(BaseModel):
    id: str
    project_id: str = Field(..., serialization_alias="projectId")
    amount: float
    category: str
    description: str
    invoice_reference: Optional[str] = Field(None, serialization_alias="invoiceReference")
    submitted_by_id: str = Field(..., serialization_alias="submittedById")
    reviewed_by_id: Optional[str] = Field(None, serialization_alias="reviewedById")
    approval_status: str = Field(..., serialization_alias="approvalStatus")
    rejection_reason: Optional[str] = Field(None, serialization_alias="rejectionReason")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
