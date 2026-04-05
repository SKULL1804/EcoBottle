"""
EcoBottle — Auth Service
Business logic for registration (with OTP), login, token management, and password reset.
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
from app.services.otp_service import create_and_send_otp, verify_otp


async def register_user(db: AsyncSession, user_data: UserCreate) -> dict:
    """
    Step 1: Register a new user (unverified) and send OTP email.
    User cannot login until OTP is verified.
    """
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    existing = result.scalar_one_or_none()

    if existing and existing.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email sudah terdaftar",
        )

    if existing and not existing.is_verified:
        # Re-send OTP for unverified user, update their data
        existing.name = user_data.name
        existing.password = hash_password(user_data.password)
        existing.phone = user_data.phone
        await db.flush()
        await create_and_send_otp(db, user_data.email, purpose="register")
        return {"message": "Kode OTP telah dikirim ulang ke email Anda", "email": user_data.email}

    # Create new unverified user
    user = User(
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        password=hash_password(user_data.password),
        is_verified=False,
    )
    db.add(user)
    await db.flush()

    # Send OTP
    await create_and_send_otp(db, user_data.email, purpose="register")

    return {"message": "Kode OTP telah dikirim ke email Anda. Silakan verifikasi.", "email": user_data.email}


async def verify_registration(db: AsyncSession, email: str, code: str) -> tuple[User, TokenResponse]:
    """
    Step 2: Verify OTP and activate user account.
    Returns user and tokens upon successful verification.
    """
    # Verify OTP
    await verify_otp(db, email, code, purpose="register")

    # Activate user
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User tidak ditemukan",
        )

    user.is_verified = True
    await db.flush()

    # Generate tokens
    tokens = _create_tokens(user.id)
    return user, tokens


async def login_user(db: AsyncSession, login_data: UserLogin) -> tuple[User, TokenResponse]:
    """Authenticate user and return tokens. User must be verified."""
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()

    if not user or (user.password is None) or not verify_password(login_data.password, user.password):
        if user and user.auth_provider == "google" and user.password is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Akun ini terdaftar via Google. Gunakan login Google.",
            )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah",
        )

    if not user.is_verified:
        # Re-send OTP automatically
        await create_and_send_otp(db, login_data.email, purpose="register")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun belum diverifikasi. Kode OTP baru telah dikirim ke email Anda.",
        )

    tokens = _create_tokens(user.id)
    return user, tokens


async def forgot_password(db: AsyncSession, email: str) -> dict:
    """Send OTP for password reset."""
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user:
        # Don't reveal that user doesn't exist (security)
        return {"message": "Jika email terdaftar, kode OTP telah dikirim", "email": email}

    await create_and_send_otp(db, email, purpose="reset_password")
    return {"message": "Kode OTP telah dikirim ke email Anda", "email": email}


async def reset_password(db: AsyncSession, email: str, code: str, new_password: str) -> dict:
    """Verify OTP and reset password."""
    # Verify OTP
    await verify_otp(db, email, code, purpose="reset_password")

    # Update password
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User tidak ditemukan",
        )

    user.password = hash_password(new_password)
    await db.flush()

    return {"message": "Password berhasil direset. Silakan login dengan password baru."}


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
