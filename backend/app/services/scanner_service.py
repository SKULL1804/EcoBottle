"""
EcoBottle — Scanner Service
Core AI scanning business logic.
"""

import os
import uuid
from decimal import Decimal
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import UploadFile, HTTPException, status

from app.config import get_settings
from app.models.scan_log import ScanLog
from app.models.user import User
from app.models.transaction import Transaction
from app.schemas.scanner import DetectedBottle, ScanResponse, ScanConfirmResponse
from app.utils.vision_client import analyze_bottle_image
from app.services.pricing_service import get_price_for_bottle, calculate_points
from app.services.gamification_service import process_gamification

settings = get_settings()

# Allowed image types and max size (10MB)
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


async def process_scan(
    db: AsyncSession,
    user: User,
    file: UploadFile,
) -> ScanResponse:
    """
    Process a bottle scan:
    1. Validate and save image
    2. Analyze with Gemini Vision
    3. Match prices from database
    4. Create scan_log record
    5. Return structured response
    """
    # 1. Validate file
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Format file tidak didukung. Gunakan: JPG, PNG, atau WebP",
        )

    image_data = await file.read()
    if len(image_data) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ukuran file terlalu besar. Maksimal 10MB.",
        )

    # 2. Save image locally
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    file_ext = file.filename.split(".")[-1] if file.filename else "jpg"
    file_name = f"{uuid.uuid4()}.{file_ext}"
    file_path = upload_dir / file_name

    with open(file_path, "wb") as f:
        f.write(image_data)

    image_url = f"/uploads/{file_name}"

    # 3. Analyze with YOLOv8 (local model)
    ai_result = await analyze_bottle_image(image_data, file.content_type)

    # 4. Match prices and build response
    detected_bottles = []
    total_value = Decimal("0")

    for bottle in ai_result.get("bottles", []):
        name, price = await get_price_for_bottle(
            db,
            bottle.get("type", "PET_bottle"),
            bottle.get("volume_estimate", "500"),
        )
        qty = int(bottle.get("quantity", 1))
        subtotal = price * qty
        total_value += subtotal

        detected_bottles.append(DetectedBottle(
            brand=bottle.get("brand", "Unknown"),
            type=bottle.get("type", "PET_bottle"),
            volume_estimate=str(bottle.get("volume_estimate", "500")),
            quantity=qty,
            confidence=float(bottle.get("confidence", 0.8)),
            price_per_unit=price,
            subtotal=subtotal,
        ))

    total_points = calculate_points(total_value)

    # 5. Create scan_log
    avg_confidence = (
        sum(b.confidence for b in detected_bottles) / len(detected_bottles)
        if detected_bottles
        else 0
    )

    scan_log = ScanLog(
        user_id=user.id,
        image_url=image_url,
        detected_bottles={
            "bottles": [b.model_dump(mode="json") for b in detected_bottles],
            "ai_raw": ai_result,
        },
        total_value=total_value,
        confidence=Decimal(str(round(avg_confidence, 2))),
        status="pending",
    )
    db.add(scan_log)
    await db.flush()

    return ScanResponse(
        scan_id=scan_log.id,
        detected=detected_bottles,
        total_items=sum(b.quantity for b in detected_bottles),
        total_value=total_value,
        total_points=total_points,
        image_quality=ai_result.get("image_quality", "good"),
        status="pending",
    )


async def confirm_scan(
    db: AsyncSession,
    user: User,
    scan_id: str,
) -> ScanConfirmResponse:
    """
    Confirm a pending scan — credits balance and points to user.
    Creates a 'deposit' transaction and processes gamification.
    """
    # Find scan log
    result = await db.execute(
        select(ScanLog).where(ScanLog.id == scan_id, ScanLog.user_id == user.id)
    )
    scan_log = result.scalar_one_or_none()

    if not scan_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan tidak ditemukan",
        )

    if scan_log.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Scan sudah {scan_log.status}. Tidak bisa dikonfirmasi lagi.",
        )

    # Calculate points
    amount = scan_log.total_value or Decimal("0")
    points = calculate_points(amount)

    # Count bottles in this scan
    detected = scan_log.detected_bottles or {}
    bottles_list = detected.get("bottles", [])
    total_bottles = sum(b.get("quantity", 1) for b in bottles_list)

    # Update scan status
    scan_log.status = "confirmed"

    # Credit user
    user.balance += amount
    user.points += points

    # Create transaction
    transaction = Transaction(
        user_id=user.id,
        scan_log_id=scan_log.id,
        type="deposit",
        amount=amount,
        points_earned=points,
        status="completed",
    )
    db.add(transaction)

    # Process gamification (level up, achievements)
    gamification = await process_gamification(db, user, total_bottles)

    await db.flush()

    return ScanConfirmResponse(
        scan_id=scan_log.id,
        status="confirmed",
        amount_credited=amount,
        points_earned=points,
        new_balance=user.balance,
        new_points=user.points,
        message=f"Setoran dikonfirmasi! Rp{amount:,.0f} dan {points} poin ditambahkan.",
        gamification=gamification,
    )
