"""
EcoBottle — OTP Service
Generate, store, and verify OTP codes.
"""

import random
import string
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from fastapi import HTTPException, status

from app.models.otp import OTPCode
from app.services.email_service import send_otp_email


def generate_otp() -> str:
    """Generate a random 6-digit OTP code."""
    return "".join(random.choices(string.digits, k=6))


async def create_and_send_otp(
    db: AsyncSession,
    email: str,
    purpose: str = "register",
) -> bool:
    """
    Generate OTP, save to database, and send via email.

    Args:
        db: Database session
        email: Recipient email
        purpose: 'register' or 'reset_password'

    Returns:
        True if email sent successfully
    """
    # Invalidate any existing unused OTPs for this email + purpose
    result = await db.execute(
        select(OTPCode).where(
            OTPCode.email == email,
            OTPCode.purpose == purpose,
            OTPCode.is_used == False,
        )
    )
    old_otps = result.scalars().all()
    for otp in old_otps:
        otp.is_used = True

    # Create new OTP
    code = generate_otp()
    otp = OTPCode(
        email=email,
        code=code,
        purpose=purpose,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=10),
    )
    db.add(otp)
    await db.flush()

    # Send email
    success = send_otp_email(email, code, purpose)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gagal mengirim email OTP. Periksa konfigurasi SMTP.",
        )

    return True


async def verify_otp(
    db: AsyncSession,
    email: str,
    code: str,
    purpose: str = "register",
) -> bool:
    """
    Verify an OTP code.

    Returns:
        True if valid

    Raises:
        HTTPException if invalid or expired
    """
    result = await db.execute(
        select(OTPCode).where(
            OTPCode.email == email,
            OTPCode.code == code,
            OTPCode.purpose == purpose,
            OTPCode.is_used == False,
        )
    )
    otp = result.scalar_one_or_none()

    if not otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kode OTP tidak valid",
        )

    # Check expiry
    now = datetime.now(timezone.utc)
    expires = otp.expires_at.replace(tzinfo=timezone.utc) if otp.expires_at.tzinfo is None else otp.expires_at
    if now > expires:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kode OTP sudah expired. Silakan minta kode baru.",
        )

    # Mark as used
    otp.is_used = True
    await db.flush()

    return True
