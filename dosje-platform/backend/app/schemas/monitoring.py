from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class MonitoringRecordCreate(BaseModel):
    monitoring_date: str
    status: str = "NORMAL"
    observations: str
    next_monitoring_date: Optional[str] = None


class MonitoringRecordResponse(BaseModel):
    id: str
    project_id: str = Field(..., serialization_alias="projectId")
    officer_id: str = Field(..., serialization_alias="officerId")
    officer_name: str = Field(..., serialization_alias="officerName")
    monitoring_date: str = Field(..., serialization_alias="monitoringDate")
    status: str
    observations: str
    next_monitoring_date: Optional[str] = Field(None, serialization_alias="nextMonitoringDate")
    created_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class AiAnomalyResponse(BaseModel):
    id: str
    anomaly_code: str = Field(..., serialization_alias="anomalyCode")
    project_id: str = Field(..., serialization_alias="projectId")
    project_name: str = Field("", serialization_alias="projectName")
    state: str = ""
    title: str
    description: str
    category: str
    priority: str
    risk_score: float = Field(..., serialization_alias="riskScore")
    status: str
    suggested_action: str = Field(..., serialization_alias="suggestedAction")
    detected_at: datetime = Field(..., serialization_alias="timestamp")
    resolved_by_id: Optional[str] = Field(None, serialization_alias="resolvedById")
    resolution_notes: Optional[str] = Field(None, serialization_alias="resolutionNotes")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class AiAnomalyUpdate(BaseModel):
    status: str  # UNRESOLVED, INVESTIGATING, RESOLVED
    resolution_notes: Optional[str] = None


class AuditLogResponse(BaseModel):
    id: str
    user: str
    role: str
    action: str
    module: str
    timestamp: str
    ip_address: str = Field(..., serialization_alias="ipAddress")
    status: str
    details: str

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class CctvTelemetryResponse(BaseModel):
    id: str
    camera_name: str = Field(..., serialization_alias="cameraName")
    project_id: str = Field(..., serialization_alias="projectId")
    project_name: str = Field("", serialization_alias="projectName")
    location: str
    ip_address: str = Field(..., serialization_alias="ipAddress")
    is_online: bool = Field(..., serialization_alias="isOnline")
    health_indicator: str = Field(..., serialization_alias="healthIndicator")
    last_heartbeat: str = Field(..., serialization_alias="lastHeartbeat")
    stream_url: str = Field(..., serialization_alias="streamUrl")
    fps: float
    resolution: str

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class StaffResponse(BaseModel):
    id: str
    staff_id: str = Field(..., serialization_alias="staffId")
    full_name: str = Field(..., serialization_alias="fullName")
    role: str
    project_id: str = Field(..., serialization_alias="projectId")
    district: str
    phone: str
    aadhaar_verified: bool = Field(..., serialization_alias="aadhaarVerified")
    joined_date: str = Field(..., serialization_alias="joinedDate")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
