"""
EcoBottle — Stats & Gamification API Routes
GET /stats/me, GET /stats/achievements, GET /stats/leaderboard
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.achievement import Achievement
from app.schemas.user import (
    UserStatsResponse,
    AchievementResponse,
    LeaderboardResponse,
    LeaderboardEntry,
)
from app.services.gamification_service import get_next_level, get_leaderboard, LEVELS

router = APIRouter(prefix="/stats", tags=["Stats & Gamification 🎮"])


@router.get("/me", response_model=UserStatsResponse)
async def get_my_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Statistik dan progress gamifikasi user."""
    # Count achievements
    result = await db.execute(
        select(func.count(Achievement.id)).where(Achievement.user_id == current_user.id)
    )
    ach_count = result.scalar() or 0

    next_level = get_next_level(current_user.total_scans)

    return UserStatsResponse(
        total_scans=current_user.total_scans,
        level=current_user.level,
        level_title=current_user.level_title,
        points=current_user.points,
        balance=current_user.balance,
        achievements_count=ach_count,
        next_level=next_level,
    )


@router.get("/achievements", response_model=list[AchievementResponse])
async def get_my_achievements(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Daftar achievement yang sudah diraih user."""
    result = await db.execute(
        select(Achievement)
        .where(Achievement.user_id == current_user.id)
        .order_by(desc(Achievement.earned_at))
    )
    achievements = result.scalars().all()
    return [AchievementResponse.model_validate(a) for a in achievements]


@router.get("/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard_endpoint(
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Leaderboard — top users berdasarkan total scan."""
    board = await get_leaderboard(db, limit)

    # Find user's rank
    result = await db.execute(
        select(func.count(User.id))
        .where(User.is_verified == True, User.total_scans > current_user.total_scans)
    )
    users_above = result.scalar() or 0
    user_rank = users_above + 1

    return LeaderboardResponse(
        leaderboard=[LeaderboardEntry(**entry) for entry in board],
        user_rank=user_rank,
    )


@router.get("/levels")
async def get_levels_info():
    """Daftar semua level dan syaratnya."""
    return {"levels": LEVELS}
