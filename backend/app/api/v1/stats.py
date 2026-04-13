"""
EcoBottle — Stats & Gamification API Routes
GET /stats/me, GET /stats/achievements, GET /stats/leaderboard
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from datetime import date, datetime, timedelta

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.achievement import Achievement
from app.models.scan_log import ScanLog
from app.schemas.user import (
    UserStatsResponse,
    AchievementResponse,
    LeaderboardResponse,
    LeaderboardEntry,
    WeeklyStatsResponse,
    WeeklyStatsPoint,
    MonthlyTrendResponse,
    MonthlyTrendPoint,
)
from app.services.gamification_service import get_next_level, get_leaderboard, LEVELS

router = APIRouter(prefix="/stats", tags=["Stats & Gamification"])


def _count_bottles(detected_bottles: dict | None) -> int:
    if not detected_bottles:
        return 0
    bottles = detected_bottles.get("bottles", []) if isinstance(detected_bottles, dict) else []
    if not isinstance(bottles, list):
        return 0
    return sum(int(item.get("quantity", 1)) for item in bottles if isinstance(item, dict))


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


@router.get("/weekly", response_model=WeeklyStatsResponse)
async def get_weekly_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Statistik botol 7 hari terakhir (harian)."""
    today = date.today()
    start_day = today - timedelta(days=6)
    start_dt = datetime.combine(start_day, datetime.min.time())

    result = await db.execute(
        select(ScanLog.created_at, ScanLog.detected_bottles)
        .where(
            ScanLog.user_id == current_user.id,
            ScanLog.status == "confirmed",
            ScanLog.created_at >= start_dt,
        )
    )
    rows = result.all()

    by_day: dict[date, int] = {}
    for created_at, detected_bottles in rows:
        scan_day = created_at.date()
        by_day[scan_day] = by_day.get(scan_day, 0) + _count_bottles(detected_bottles)

    day_labels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]
    points: list[WeeklyStatsPoint] = []
    total = 0
    for offset in range(7):
        current_day = start_day + timedelta(days=offset)
        bottles = by_day.get(current_day, 0)
        total += bottles
        points.append(
            WeeklyStatsPoint(
                day=day_labels[current_day.weekday()],
                date=current_day.isoformat(),
                bottles=bottles,
            )
        )

    return WeeklyStatsResponse(
        points=points,
        total_bottles=total,
        avg_per_day=round(total / 7, 1),
    )


@router.get("/monthly", response_model=MonthlyTrendResponse)
async def get_monthly_trend(
    months: int = 6,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Tren botol per bulan (default 6 bulan terakhir)."""
    months = max(1, min(months, 12))
    today = date.today()

    month_starts: list[date] = []
    year = today.year
    month = today.month
    for _ in range(months):
        month_starts.append(date(year, month, 1))
        month -= 1
        if month == 0:
            month = 12
            year -= 1
    month_starts.reverse()

    start_dt = datetime.combine(month_starts[0], datetime.min.time())
    result = await db.execute(
        select(ScanLog.created_at, ScanLog.detected_bottles)
        .where(
            ScanLog.user_id == current_user.id,
            ScanLog.status == "confirmed",
            ScanLog.created_at >= start_dt,
        )
    )
    rows = result.all()

    by_month: dict[tuple[int, int], int] = {(m.year, m.month): 0 for m in month_starts}
    for created_at, detected_bottles in rows:
        key = (created_at.year, created_at.month)
        if key in by_month:
            by_month[key] += _count_bottles(detected_bottles)

    month_names = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
    points: list[MonthlyTrendPoint] = []
    values: list[int] = []
    for month_start in month_starts:
        value = by_month[(month_start.year, month_start.month)]
        values.append(value)
        points.append(
            MonthlyTrendPoint(
                month=month_names[month_start.month - 1],
                year=month_start.year,
                bottles=value,
            )
        )

    first_value = values[0] if values else 0
    last_value = values[-1] if values else 0
    if first_value > 0:
        growth_percent = round(((last_value - first_value) / first_value) * 100)
    elif last_value > 0:
        growth_percent = 100
    else:
        growth_percent = 0

    return MonthlyTrendResponse(
        points=points,
        growth_percent=growth_percent,
    )
