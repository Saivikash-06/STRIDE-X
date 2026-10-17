from typing import List, Callable
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.models.user import User
from app.core.security import decode_token
from app.core.exceptions import CredentialsException, PermissionDeniedException
from app.core.permissions import UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """Retrieve and validate the authenticated user from the Bearer JWT token."""
    if not token:
        raise CredentialsException("Authorization token is required")

    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise CredentialsException("Invalid token payload")
    except Exception:
        raise CredentialsException("Invalid or expired access token")

    stmt = select(User).where(User.id == user_id)
    user = db.scalar(stmt)
    if not user:
        raise CredentialsException("User account no longer exists")

    if not user.is_active:
        raise PermissionDeniedException("User account has been deactivated")

    return user


def require_roles(*allowed_roles: UserRole) -> Callable:
    """Dependency factory that restricts endpoint access to specified user roles."""
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        allowed_values = [r.value for r in allowed_roles]
        if current_user.role not in allowed_values:
            raise PermissionDeniedException(
                f"Access denied for role '{current_user.role}'. Required one of: {', '.join(allowed_values)}"
            )
        return current_user
    return role_checker
