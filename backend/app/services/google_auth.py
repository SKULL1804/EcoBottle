"""
EcoBottle — Google OAuth Service
Verifies Google ID tokens and creates/finds users.
"""

import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from app.config import get_settings
from app.models.user import User
from app.schemas.user import TokenResponse
from app.utils.security import create_access_token, create_refresh_token

settings = get_settings()

GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo"


async def verify_google_token(id_token: str) -> dict:
    """
    Verify a Google ID token using Google's tokeninfo endpoint.
    Returns user info (email, name, picture, sub) if valid.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            GOOGLE_TOKEN_INFO_URL,
            params={"id_token": id_token},
            timeout=10.0,
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google token tidak valid",
        )

    token_data = response.json()

    # Verify client ID matches
    if token_data.get("aud") != settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token bukan untuk aplikasi ini",
        )

    return {
        "google_id": token_data.get("sub"),
        "email": token_data.get("email"),
        "name": token_data.get("name", ""),
        "picture": token_data.get("picture"),
        "email_verified": token_data.get("email_verified") == "true",
    }


async def google_login_or_register(
    db: AsyncSession, id_token: str
) -> tuple[User, TokenResponse, bool]:
    """
    Verify Google token and either login existing user or create new one.
    Returns (user, tokens, is_new_user).
    """
    # 1. Verify token with Google
    google_data = await verify_google_token(id_token)

    # 2. Check if user exists by google_id
    result = await db.execute(
        select(User).where(User.google_id == google_data["google_id"])
    )
    user = result.scalar_one_or_none()

    is_new = False

    if not user:
        # Check if email exists (local account) → link it
        result = await db.execute(
            select(User).where(User.email == google_data["email"])
        )
        user = result.scalar_one_or_none()

        if user:
            # Link existing local account to Google
            user.google_id = google_data["google_id"]
            user.avatar_url = google_data.get("picture")
            if not user.is_verified:
                user.is_verified = True
        else:
            # Create new user
            user = User(
                name=google_data["name"],
                email=google_data["email"],
                google_id=google_data["google_id"],
                avatar_url=google_data.get("picture"),
                auth_provider="google",
                is_verified=True,  # Google accounts are pre-verified
                password=None,
            )
            db.add(user)
            is_new = True

        await db.flush()

    # 3. Generate tokens
    token_data = {"sub": user.id}
    tokens = TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
    )

    return user, tokens, is_new
