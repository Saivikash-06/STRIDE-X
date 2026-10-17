import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Grievance(Base):
    __tablename__ = "grievances"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    grievance_id: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    beneficiary_name: Mapped[str] = mapped_column(String(255), nullable=False)
    beneficiary_contact: Mapped[str] = mapped_column(String(50), nullable=True)
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    scheme_id: Mapped[str] = mapped_column(String(36), ForeignKey("schemes.id", ondelete="SET NULL"), nullable=True, index=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False)  # Grant Not Received, Poor Facility Infrastructure, Food/Ration Quality, Harassment/Discrimination, False Attendance, Other
    description: Mapped[str] = mapped_column(Text, nullable=False)
    priority: Mapped[str] = mapped_column(String(20), default="MEDIUM", nullable=False)  # CRITICAL, HIGH, MEDIUM, LOW
    status: Mapped[str] = mapped_column(String(50), default="OPEN", nullable=False)  # OPEN, IN_PROGRESS, RESOLVED, ESCALATED
    filing_date: Mapped[str] = mapped_column(String(50), nullable=False)
    sla_deadline: Mapped[str] = mapped_column(String(50), nullable=False)
    assigned_authority_id: Mapped[str] = mapped_column(String(36), nullable=True)
    assigned_authority_name: Mapped[str] = mapped_column(String(255), nullable=True)
    resolution_remarks: Mapped[str] = mapped_column(Text, nullable=True)
    resolved_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    project = relationship("Project", back_populates="grievances")
