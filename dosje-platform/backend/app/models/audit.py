import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Audit(Base):
    __tablename__ = "audits"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    inspection_id: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    project_id: Mapped[str] = mapped_column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    inspector_id: Mapped[str] = mapped_column(String(36), nullable=False)
    inspector_name: Mapped[str] = mapped_column(String(255), nullable=False)
    inspector_badge: Mapped[str] = mapped_column(String(100), nullable=True)
    scheduled_date: Mapped[str] = mapped_column(String(50), nullable=False)
    completed_date: Mapped[str] = mapped_column(String(50), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="SCHEDULED", nullable=False)  # SCHEDULED, COMPLETED, OVERDUE, FLAGGED
    priority: Mapped[str] = mapped_column(String(20), default="ROUTINE", nullable=False)  # HIGH, MEDIUM, ROUTINE
    inspection_type: Mapped[str] = mapped_column(String(50), default="ROUTINE", nullable=False)  # ROUTINE, SURPRISE, STATUTORY, FOLLOW_UP
    geo_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=True)
    longitude: Mapped[float] = mapped_column(Float, nullable=True)
    geo_distance_meters: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    observation_summary: Mapped[str] = mapped_column(Text, default="", nullable=False)
    photo_evidence_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    score_percent: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    critical_defects_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    corrective_actions: Mapped[str] = mapped_column(Text, nullable=True)
    follow_up_date: Mapped[str] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    project = relationship("Project", back_populates="audits")
