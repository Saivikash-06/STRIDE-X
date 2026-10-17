from enum import Enum
from typing import List, Optional
from fastapi import Depends
from app.core.exceptions import PermissionDeniedException


class UserRole(str, Enum):
    ADMIN = "admin"
    AUTHORITY = "authority"
    NGO = "ngo"
    PMU = "pmu"
    STAFF = "staff"
    BENEFICIARY = "beneficiary"


def check_role_permission(user_role: str, allowed_roles: List[UserRole]) -> None:
    """Validate that the user's role is within the list of allowed roles."""
    allowed_values = [r.value for r in allowed_roles]
    if user_role not in allowed_values:
        raise PermissionDeniedException(
            f"Role '{user_role}' is not authorized. Allowed roles: {', '.join(allowed_values)}"
        )


def check_jurisdiction(user_role: str, user_state: Optional[str], target_state: Optional[str]) -> None:
    """Enforce state-level jurisdiction for State/District Authority users."""
    if user_role == UserRole.ADMIN.value:
        return  # Central Admin has national clearance across all states

    if user_role == UserRole.AUTHORITY.value:
        if user_state and target_state and user_state.lower() != target_state.lower():
            raise PermissionDeniedException(
                f"Cross-jurisdiction access forbidden. Your assigned state is '{user_state}', but target is '{target_state}'."
            )
