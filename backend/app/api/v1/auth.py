"""
EcoBottle — Auth API Routes
POST /register, /login, /refresh, GET /me
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    TokenResponse,
    TokenRefresh,
)
from app.services.auth_service import register_user, login_user, refresh_tokens

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Registrasi user baru. Mengembalikan access token & refresh token."""
    _, tokens = await register_user(db, user_data)
    return tokens


@router.post("/login", response_model=TokenResponse)
async def login(login_data: UserLogin, db: AsyncSession = Depends(get_db)):
    """Login dengan email & password. Mengembalikan access token & refresh token."""
    _, tokens = await login_user(db, login_data)
    return tokens


@router.post("/refresh", response_model=TokenResponse)
async def refresh(body: TokenRefresh, db: AsyncSession = Depends(get_db)):
    """Refresh token pair menggunakan refresh token yang masih valid."""
    tokens = await refresh_tokens(db, body.refresh_token)
    return tokens


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Mendapatkan info user yang sedang login."""
    return current_user
