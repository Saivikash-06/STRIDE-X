from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.auth import LoginRequest, TokenResponse, RefreshRequest, UserProfile
from app.schemas.common import MessageResponse
from app.services.auth_service import authenticate_user, refresh_access_token
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("/login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
def login_endpoint(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate with official email and password to receive JWT credentials."""
    token_response, _ = authenticate_user(db, login_data)
    return token_response


@router.post("/logout", response_model=MessageResponse, status_code=status.HTTP_200_OK)
def logout_endpoint(current_user: User = Depends(get_current_user)):
    """Revoke authenticated session."""
    return MessageResponse(message=f"Session successfully terminated for {current_user.email}")


@router.get("/me", response_model=UserProfile, status_code=status.HTTP_200_OK)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Retrieve the currently authenticated user's profile and credentials."""
    return current_user


@router.post("/refresh", response_model=TokenResponse, status_code=status.HTTP_200_OK)
def refresh_token_endpoint(refresh_data: RefreshRequest, db: Session = Depends(get_db)):
    """Exchange a valid refresh token for a newly signed access token."""
    return refresh_access_token(db, refresh_data.refresh_token)
