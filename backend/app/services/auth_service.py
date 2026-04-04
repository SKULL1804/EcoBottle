"""
EcoBottle — Auth Service
Business logic for registration, login, and token management.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, TokenResponse
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)


async def register_user(db: AsyncSession, user_data: UserCreate) -> tuple[User, TokenResponse]:
    """Register a new user. Returns user and tokens."""
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email sudah terdaftar",
        )

    # Create user
    user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        password=hash_password(user_data.password),
    )
    db.add(user)
    await db.flush()  # Get the ID without committing

    # Generate tokens
    tokens = _create_tokens(user.id)

    return user, tokens


async def login_user(db: AsyncSession, login_data: UserLogin) -> tuple[User, TokenResponse]:
    """Authenticate user and return tokens."""
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(login_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah",
        )

    tokens = _create_tokens(user.id)
    return user, tokens


async def refresh_tokens(db: AsyncSession, refresh_token: str) -> TokenResponse:
    """Generate new token pair from a valid refresh token."""
    payload = decode_token(refresh_token)

    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token tidak valid",
        )

    user_id = payload.get("sub")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User tidak ditemukan",
        )

    return _create_tokens(user.id)


def _create_tokens(user_id: str) -> TokenResponse:
    """Helper to create access + refresh token pair."""
    token_data = {"sub": user_id}
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
    )
