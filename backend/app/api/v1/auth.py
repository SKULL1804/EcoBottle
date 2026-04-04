"""
EcoBottle — Auth API Routes
Registration with OTP, Login, Refresh, Forgot/Reset Password.
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
    OTPVerify,
    OTPResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from app.services.auth_service import (
    register_user,
    verify_registration,
    login_user,
    refresh_tokens,
    forgot_password,
    reset_password,
)

router = APIRouter(prefix="/auth", tags=["Auth"])


# ─── Registration (2-step with OTP) ──────────────────────

@router.post("/register", response_model=OTPResponse, status_code=201)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Step 1: Registrasi user baru.
    - Membuat akun dengan status unverified
    - Mengirim kode OTP 6 digit ke email
    - User harus verifikasi OTP untuk mengaktifkan akun
    """
    result = await register_user(db, user_data)
    return result


@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp_endpoint(body: OTPVerify, db: AsyncSession = Depends(get_db)):
    """
    Step 2: Verifikasi kode OTP dari email.
    - Jika valid, akun diaktifkan
    - Mengembalikan access token & refresh token
    """
    _, tokens = await verify_registration(db, body.email, body.code)
    return tokens


# ─── Login ────────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
async def login(login_data: UserLogin, db: AsyncSession = Depends(get_db)):
    """
    Login dengan email & password.
    - Akun harus sudah diverifikasi
    - Jika belum verified, OTP dikirim ulang otomatis
    """
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


# ─── Forgot / Reset Password ─────────────────────────────

@router.post("/forgot-password", response_model=OTPResponse)
async def forgot_password_endpoint(
    body: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)
):
    """
    Kirim kode OTP ke email untuk reset password.
    - Kode berlaku 10 menit
    """
    result = await forgot_password(db, body.email)
    return result


@router.post("/reset-password")
async def reset_password_endpoint(
    body: ResetPasswordRequest, db: AsyncSession = Depends(get_db)
):
    """
    Reset password menggunakan kode OTP.
    - Verifikasi OTP + set password baru
    """
    result = await reset_password(db, body.email, body.code, body.new_password)
    return result
