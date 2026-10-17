import uuid
from datetime import datetime, timezone
from decimal import Decimal
from sqlalchemy import String, Numeric, Integer, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_code: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    scheme_id: Mapped[str] = mapped_column(String(36), ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False, index=True)
    ngo_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    state: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    district: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    address: Mapped[str] = mapped_column(Text, nullable=False, default="")
    latitude: Mapped[float] = mapped_column(Float, default=20.5937, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, default=78.9629, nullable=False)
    beneficiaries_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    risk_level: Mapped[str] = mapped_column(String(20), default="LOW", nullable=False)  # HIGH, MEDIUM, LOW
    risk_score: Mapped[float] = mapped_column(Float, default=15.0, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE", nullable=False)  # ACTIVE, PENDING_APPROVAL, SUSPENDED, COMPLETED, UNDER_REVIEW
    inspection_status: Mapped[str] = mapped_column(String(50), default="SCHEDULED", nullable=False)  # SCHEDULED, COMPLETED, OVERDUE, FLAGGED
    compliance_status: Mapped[str] = mapped_column(String(50), default="COMPLIANT", nullable=False)  # COMPLIANT, NON_COMPLIANT, UNDER_AUDIT, PENDING_UC
    sanctioned_grant_lakhs: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"), nullable=False)
    released_grant_lakhs: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"), nullable=False)
    utilized_grant_lakhs: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"), nullable=False)
    start_date: Mapped[str] = mapped_column(String(50), nullable=True)
    expected_completion_date: Mapped[str] = mapped_column(String(50), nullable=True)
    cctv_online: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    biometric_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_by_id: Mapped[str] = mapped_column(String(36), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    scheme = relationship("Scheme", back_populates="projects")
    organization = relationship("Organization", back_populates="projects")
    beneficiaries = relationship("Beneficiary", back_populates="project", cascade="all, delete-orphan")
    audits = relationship("Audit", back_populates="project", cascade="all, delete-orphan")
    grievances = relationship("Grievance", back_populates="project", cascade="all, delete-orphan")
    monitoring_records = relationship("MonitoringRecord", back_populates="project", cascade="all, delete-orphan")
    expenditures = relationship("Expenditure", back_populates="project", cascade="all, delete-orphan")
