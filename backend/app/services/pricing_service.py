"""
EcoBottle — Pricing Service
Matches YOLO-detected waste classes to master data prices.

YOLO classes → EcoBottle mapping:
  plastic     → PET / HDPE (default: PET 600ml tier)
  metal       → Aluminium (default: 330ml tier)
  *-glass     → Glass (mapped by volume)
"""

from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.bottle import BottleType


# Map YOLO bottle types to database material
MATERIAL_MAP = {
    "PET_bottle": "PET",
    "glass_bottle": "Glass",
    "aluminium_can": "Aluminium",
    "HDPE_bottle": "HDPE",
}

# Volume-based price tier mapping
VOLUME_TIERS = {
    "PET": [
        (600, "Botol PET < 600ml"),
        (1500, "Botol PET 600ml - 1.5L"),
        (99999, "Botol PET > 1.5L (Galon kecil)"),
    ],
    "Glass": [
        (200, "Botol Kaca kecil < 200ml"),
        (500, "Botol Kaca 200-500ml"),
        (99999, "Botol Kaca > 500ml"),
    ],
    "Aluminium": [
        (250, "Kaleng Aluminium 250ml"),
        (99999, "Kaleng Aluminium 330ml"),
    ],
    "HDPE": [
        (500, "Botol HDPE < 500ml"),
        (99999, "Botol HDPE 500ml - 1L"),
    ],
}


async def get_price_for_bottle(
    db: AsyncSession,
    bottle_type: str,
    volume_estimate: str,
) -> tuple[str, Decimal]:
    """
    Match a detected bottle to the best pricing tier.

    Args:
        db: Database session
        bottle_type: Mapped type from YOLO (e.g., "PET_bottle", "glass_bottle")
        volume_estimate: Estimated volume string (e.g., "600")

    Returns:
        Tuple of (matched_name, price_idr)
    """
    material = MATERIAL_MAP.get(bottle_type, "PET")

    # Parse volume
    try:
        volume = int("".join(filter(str.isdigit, str(volume_estimate))) or "500")
    except ValueError:
        volume = 500

    # Find matching tier name
    tiers = VOLUME_TIERS.get(material, VOLUME_TIERS["PET"])
    matched_name = tiers[-1][1]  # Default to last tier
    for max_vol, name in tiers:
        if volume <= max_vol:
            matched_name = name
            break

    # Look up price in database
    result = await db.execute(
        select(BottleType).where(
            BottleType.name == matched_name,
            BottleType.is_active == True,
        )
    )
    bottle = result.scalar_one_or_none()

    if bottle:
        return bottle.name, bottle.price_idr

    # Fallback: search by material
    result = await db.execute(
        select(BottleType).where(
            BottleType.material == material,
            BottleType.is_active == True,
        ).order_by(BottleType.price_idr)
    )
    bottle = result.scalars().first()

    if bottle:
        return bottle.name, bottle.price_idr

    # Ultimate fallback
    return matched_name, Decimal("150")


def calculate_points(total_value: Decimal) -> int:
    """Calculate points earned from a scan. 1 poin per Rp100."""
    return int(total_value / 100)
