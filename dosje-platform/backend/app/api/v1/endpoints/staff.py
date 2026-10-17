from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.models.monitoring import Staff
from app.schemas.monitoring import StaffResponse
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("", response_model=List[StaffResponse])
def list_facility_staff(
    district: Optional[str] = Query(None),
    project_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List field facility staff and care personnel."""
    stmt = select(Staff)
    if district:
        stmt = stmt.where(Staff.district.ilike(district))
    if project_id:
        stmt = stmt.where(Staff.project_id == project_id)

    staff_list = db.scalars(stmt).all()
    return staff_list
