from datetime import timedelta
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.user import User
from app.core.security import verify_password, create_access_token, create_refresh_token, decode_token
from app.core.exceptions import CredentialsException, NotFoundException
from app.schemas.auth import LoginRequest, TokenResponse, UserProfile


def authenticate_user(db: Session, login_data: LoginRequest) -> Tuple[TokenResponse, User]:
    """Authenticate user credentials and return signed access and refresh tokens."""
    stmt = select(User).where(User.email == login_data.email.strip().lower())
    user = db.scalar(stmt)

    # Constant time check simulation and general message to prevent user enumeration
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise CredentialsException("Invalid email or password")

    if not user.is_active:
        raise CredentialsException("Account is inactive. Please contact your system administrator.")

    access_token_expires = timedelta(days=30) if login_data.remember_me else None
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email, "role": user.role, "state": user.state},
        expires_delta=access_token_expires,
    )
    refresh_token = create_refresh_token(
        data={"sub": user.id, "email": user.email, "role": user.role}
    )

    token_response = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=60 * 60 * 24 if login_data.remember_me else 60 * 60,
    )
    return token_response, user


def refresh_access_token(db: Session, refresh_token: str) -> TokenResponse:
    """Validate a refresh token and issue a fresh access token."""
    try:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise CredentialsException("Invalid token type")
        user_id = payload.get("sub")
    except Exception:
        raise CredentialsException("Invalid or expired refresh token")

    stmt = select(User).where(User.id == user_id)
    user = db.scalar(stmt)
    if not user or not user.is_active:
        raise CredentialsException("User not found or inactive")

    new_access_token = create_access_token(
        data={"sub": user.id, "email": user.email, "role": user.role, "state": user.state}
    )
    new_refresh_token = create_refresh_token(
        data={"sub": user.id, "email": user.email, "role": user.role}
    )

    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer",
        expires_in=60 * 60,
    )
