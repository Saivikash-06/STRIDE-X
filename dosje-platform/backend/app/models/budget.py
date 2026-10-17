import uuid
from datetime import datetime, timezone
from decimal import Decimal
from sqlalchemy import String, Numeric, Text, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class BudgetAllocation(Base):
    __tablename__ = "budget_allocations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    fiscal_year: Mapped[str] = mapped_column(String(20), nullable=False)  # e.g. "2026-27"
    sanctioned_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    released_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"), nullable=False)
    allocation_date: Mapped[str] = mapped_column(String(50), nullable=False)
    approved_by_id: Mapped[str] = mapped_column(String(36), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="SANCTIONED", nullable=False)  # SANCTIONED, RELEASED, REVISED
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)


class Expenditure(Base):
    __tablename__ = "expenditures"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)  # INFRASTRUCTURE, EQUIPMENT, TRAINING, DIRECT_BENEFIT, OPERATIONAL, OTHER
    description: Mapped[str] = mapped_column(Text, nullable=False)
    invoice_reference: Mapped[str] = mapped_column(String(100), nullable=True)
    submitted_by_id: Mapped[str] = mapped_column(String(36), nullable=False)
    reviewed_by_id: Mapped[str] = mapped_column(String(36), nullable=True)
    approval_status: Mapped[str] = mapped_column(String(50), default="SUBMITTED", nullable=False)  # SUBMITTED, VERIFIED, APPROVED, REJECTED
    rejection_reason: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    project = relationship("Project", back_populates="expenditures")
