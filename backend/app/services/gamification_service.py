"""
EcoBottle — Gamification Service
Level system, achievement tracking, and leaderboard logic.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from app.models.user import User
from app.models.achievement import Achievement


# ─── Level System ─────────────────────────────────────────
LEVELS = [
    {"level": 1, "title": "🌱 Pemula",          "min_scans": 0},
    {"level": 2, "title": "🌿 Penghijauan",     "min_scans": 10},
    {"level": 3, "title": "🌳 Eco Warrior",      "min_scans": 50},
    {"level": 4, "title": "🏆 Green Champion",   "min_scans": 150},
    {"level": 5, "title": "🌍 Earth Guardian",   "min_scans": 500},
]


def calculate_level(total_scans: int) -> dict:
    """Calculate user level based on total confirmed scans."""
    current = LEVELS[0]
    for lvl in LEVELS:
        if total_scans >= lvl["min_scans"]:
            current = lvl
    return current


def get_next_level(total_scans: int) -> dict | None:
    """Get next level info and progress."""
    current = calculate_level(total_scans)
    if current["level"] >= 5:
        return None  # Max level
    next_lvl = LEVELS[current["level"]]  # index = current level (0-based +1 -1)
    return {
        "level": next_lvl["level"],
        "title": next_lvl["title"],
        "scans_needed": next_lvl["min_scans"],
        "scans_remaining": next_lvl["min_scans"] - total_scans,
    }


# ─── Achievement Definitions ─────────────────────────────
ACHIEVEMENT_DEFS = [
    {"type": "first_scan",     "title": "Langkah Pertama",      "icon": "🎯", "desc": "Scan botol pertama kali!",            "trigger_scans": 1},
    {"type": "scan_5",         "title": "Kolektor Pemula",      "icon": "📦", "desc": "Berhasil scan 5 botol",               "trigger_scans": 5},
    {"type": "scan_10",        "title": "Eco Enthusiast",       "icon": "♻️", "desc": "Berhasil scan 10 botol",              "trigger_scans": 10},
    {"type": "scan_25",        "title": "Pengumpul Handal",     "icon": "💪", "desc": "Berhasil scan 25 botol",              "trigger_scans": 25},
    {"type": "scan_50",        "title": "Eco Warrior",          "icon": "⚔️", "desc": "Berhasil scan 50 botol!",             "trigger_scans": 50},
    {"type": "scan_100",       "title": "Pahlawan Lingkungan",  "icon": "🦸", "desc": "100 botol terkumpul!",                "trigger_scans": 100},
    {"type": "scan_250",       "title": "Green Legend",         "icon": "🌟", "desc": "250 botol — Kamu legenda!",           "trigger_scans": 250},
    {"type": "scan_500",       "title": "Earth Guardian",       "icon": "🌍", "desc": "500 botol — Penjaga Bumi sejati!",    "trigger_scans": 500},
]


async def check_and_award_achievements(
    db: AsyncSession, user: User
) -> list[dict]:
    """
    Check if user earned new achievements after a scan confirmation.
    Returns list of newly awarded achievements.
    """
    # Get existing achievement types for this user
    result = await db.execute(
        select(Achievement.type).where(Achievement.user_id == user.id)
    )
    existing_types = set(result.scalars().all())

    new_achievements = []
    for ach_def in ACHIEVEMENT_DEFS:
        # Skip if already earned
        if ach_def["type"] in existing_types:
            continue
        # Check if user meets the trigger
        if user.total_scans >= ach_def["trigger_scans"]:
            achievement = Achievement(
                user_id=user.id,
                type=ach_def["type"],
                title=ach_def["title"],
                description=ach_def["desc"],
                icon=ach_def["icon"],
            )
            db.add(achievement)
            new_achievements.append({
                "type": ach_def["type"],
                "title": ach_def["title"],
                "icon": ach_def["icon"],
                "description": ach_def["desc"],
            })

    return new_achievements


async def update_user_level(user: User) -> dict:
    """Update user level based on total_scans. Returns level info."""
    level_info = calculate_level(user.total_scans)
    user.level = level_info["level"]
    user.level_title = level_info["title"]
    return level_info


async def process_gamification(
    db: AsyncSession, user: User, bottles_in_scan: int
) -> dict:
    """
    Main entry point: called after confirm_scan.
    Updates total_scans, level, and checks achievements.
    Returns gamification result.
    """
    # Increment total scans by number of bottles confirmed
    user.total_scans += bottles_in_scan

    # Update level
    level_info = await update_user_level(user)

    # Check achievements
    new_achievements = await check_and_award_achievements(db, user)

    # Next level info
    next_level = get_next_level(user.total_scans)

    return {
        "total_scans": user.total_scans,
        "level": level_info["level"],
        "level_title": level_info["title"],
        "new_achievements": new_achievements,
        "next_level": next_level,
    }


async def get_leaderboard(db: AsyncSession, limit: int = 10) -> list[dict]:
    """Get top users by total_scans."""
    result = await db.execute(
        select(User)
        .where(User.is_verified == True)
        .order_by(desc(User.total_scans))
        .limit(limit)
    )
    users = result.scalars().all()
    return [
        {
            "rank": idx + 1,
            "name": u.name,
            "level": u.level,
            "level_title": u.level_title,
            "total_scans": u.total_scans,
            "points": u.points,
        }
        for idx, u in enumerate(users)
    ]
