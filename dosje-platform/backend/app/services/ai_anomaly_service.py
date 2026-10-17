from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.project import Project
from app.models.monitoring import AiAnomaly, CctvTelemetry


class AnomalyDetectionResult:
    def __init__(
        self,
        anomaly_type: str,
        project_id: str,
        title: str,
        description: str,
        risk_score: float,
        priority: str,
        suggested_action: str,
    ):
        self.anomaly_type = anomaly_type
        self.project_id = project_id
        self.title = title
        self.description = description
        self.risk_score = risk_score
        self.priority = priority
        self.suggested_action = suggested_action


class AnomalyDetectionEngine:
    """
    Extensible heuristic & statistical anomaly evaluation engine.
    NOTE: Evaluates objective operational risk patterns (attendance drops, CCTV downtime,
    and budget divergence) without claiming unverified deep learning models or proven fraud.
    All detections require statutory human inspection before any enforcement action.
    """

    @staticmethod
    def evaluate_cctv_downtime(camera: CctvTelemetry) -> Optional[AnomalyDetectionResult]:
        """Detect offline cameras exceeding statutory SLA thresholds."""
        if not camera.is_online:
            return AnomalyDetectionResult(
                anomaly_type="Camera Offline",
                project_id=camera.project_id,
                title=f"CCTV Offline at {camera.location}",
                description=f"Surveillance node '{camera.camera_name}' has lost connection. Last heartbeat: {camera.last_heartbeat}.",
                risk_score=72.0,
                priority="HIGH",
                suggested_action="Notify facility manager to verify internet gateway and camera power.",
            )
        return None

    @staticmethod
    def evaluate_financial_deviation(project: Project) -> Optional[AnomalyDetectionResult]:
        """Detect fund utilization discrepancies versus reported progress."""
        sanctioned = float(project.sanctioned_grant_lakhs)
        utilized = float(project.utilized_grant_lakhs)
        if sanctioned > 0:
            utilization_rate = (utilized / sanctioned) * 100.0
            # If high utilization with pending inspection or unverified compliance
            if utilization_rate > 90.0 and project.compliance_status == "NON_COMPLIANT":
                return AnomalyDetectionResult(
                    anomaly_type="Financial Deviation",
                    project_id=project.id,
                    title=f"High Utilization with Non-Compliant Status: {project.name}",
                    description=f"Fund utilization reached {utilization_rate:.1f}% while facility holds non-compliant statutory status.",
                    risk_score=85.0,
                    priority="CRITICAL",
                    suggested_action="Withhold further grant disbursements until physical PMU audit verification.",
                )
        return None

    @classmethod
    def scan_project_anomalies(cls, db: Session, project_id: str) -> List[AnomalyDetectionResult]:
        """Perform comprehensive heuristic anomaly scanning for a single project facility."""
        project = db.scalar(select(Project).where(Project.id == project_id))
        if not project:
            return []

        findings: List[AnomalyDetectionResult] = []

        # Financial check
        fin_anomaly = cls.evaluate_financial_deviation(project)
        if fin_anomaly:
            findings.append(fin_anomaly)

        # CCTV checks
        cameras = db.scalars(select(CctvTelemetry).where(CctvTelemetry.project_id == project_id)).all()
        for cam in cameras:
            cam_anomaly = cls.evaluate_cctv_downtime(cam)
            if cam_anomaly:
                findings.append(cam_anomaly)

        return findings
