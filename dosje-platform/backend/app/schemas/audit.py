from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class AuditCreate(BaseModel):
    project_id: str
    inspector_id: str
    inspector_name: str
    inspector_badge: Optional[str] = None
    scheduled_date: str
    priority: str = "ROUTINE"
    inspection_type: str = "ROUTINE"
    observation_summary: str = ""


class AuditUpdate(BaseModel):
    completed_date: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    geo_verified: Optional[bool] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    geo_distance_meters: Optional[float] = None
    observation_summary: Optional[str] = None
    photo_evidence_count: Optional[int] = None
    score_percent: Optional[float] = None
    critical_defects_count: Optional[int] = None
    corrective_actions: Optional[str] = None
    follow_up_date: Optional[str] = None


class AuditResponse(BaseModel):
    id: str
    inspection_id: str = Field(..., serialization_alias="inspectionId")
    project_id: str = Field(..., serialization_alias="projectId")
    project_name: str = Field("", serialization_alias="projectName")
    ngo_name: str = Field("", serialization_alias="ngoName")
    state: str = ""
    district: str = ""
    inspector_name: str = Field(..., serialization_alias="inspectorName")
    inspector_badge: Optional[str] = Field(None, serialization_alias="inspectorBadge")
    scheduled_date: str = Field(..., serialization_alias="scheduledDate")
    completed_date: Optional[str] = Field(None, serialization_alias="completedDate")
    status: str
    priority: str
    inspection_type: str = Field("ROUTINE", serialization_alias="inspectionType")
    geo_verified: bool = Field(False, serialization_alias="geoVerified")
    geo_distance_meters: float = Field(0.0, serialization_alias="geoDistanceMeters")
    observation_summary: str = Field("", serialization_alias="observationSummary")
    photo_evidence_count: int = Field(0, serialization_alias="photoEvidenceCount")
    score_percent: float = Field(0.0, serialization_alias="scorePercent")
    critical_defects_count: int = Field(0, serialization_alias="criticalDefectsCount")
    corrective_actions: Optional[str] = Field(None, serialization_alias="correctiveActions")
    follow_up_date: Optional[str] = Field(None, serialization_alias="followUpDate")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
