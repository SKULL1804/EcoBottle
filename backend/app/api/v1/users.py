"""
EcoBottle — User API Routes
GET /me, PUT /profile, GET /balance, GET /points
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse, UserProfileUpdate, UserBalanceResponse

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    """Mendapatkan profil user yang sedang login."""
    return current_user


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    update_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update profil user (nama, nomor telepon)."""
    if update_data.name is not None:
        current_user.name = update_data.name
    if update_data.phone is not None:
        current_user.phone = update_data.phone

    db.add(current_user)
    await db.flush()
    return current_user


@router.get("/balance", response_model=UserBalanceResponse)
async def get_balance(current_user: User = Depends(get_current_user)):
    """Mendapatkan saldo dan poin user."""
    return UserBalanceResponse(
        balance=current_user.balance,
        points=current_user.points,
    )


@router.get("/points")
async def get_points(current_user: User = Depends(get_current_user)):
    """Mendapatkan total poin user."""
    return {"points": current_user.points}
