"""
EcoBottle — Scanner Schemas (Pydantic)
"""

from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel


class DetectedBottle(BaseModel):
    """Single detected bottle from AI scan."""
    brand: str
    type: str  # PET_bottle, glass_bottle, aluminium_can, HDPE_bottle
    volume_estimate: str
    quantity: int
    confidence: float
    # Pricing info (added after matching)
    price_per_unit: Decimal | None = None
    subtotal: Decimal | None = None


class ScanResponse(BaseModel):
    """Response from POST /scan/analyze."""
    scan_id: str
    detected: list[DetectedBottle]
    total_items: int
    total_value: Decimal
    total_points: int
    image_quality: str
    barcode: str | None = None
    product_lookup: dict | None = None
    status: str = "pending"


class ScanConfirmResponse(BaseModel):
    """Response from POST /scan/{id}/confirm."""
    scan_id: str
    status: str
    amount_credited: Decimal
    points_earned: int
    new_balance: Decimal
    new_points: int
    message: str
    gamification: dict | None = None


class ScanHistoryItem(BaseModel):
    id: str
    detected_bottles: dict | None = None
    total_value: Decimal | None = None
    confidence: Decimal | None = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ScanHistoryResponse(BaseModel):
    scans: list[ScanHistoryItem]
    total: int
