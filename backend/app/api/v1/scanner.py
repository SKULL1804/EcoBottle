"""
EcoBottle — Scanner API Routes
POST /analyze, POST /{id}/confirm, GET /history
"""

from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.scan_log import ScanLog
from app.schemas.scanner import (
    ScanResponse,
    ScanConfirmResponse,
    ScanHistoryItem,
    ScanHistoryResponse,
)
from app.services.scanner_service import process_scan, confirm_scan

router = APIRouter(prefix="/scan", tags=["Scanner ⭐"])


@router.post("/analyze", response_model=ScanResponse)
async def analyze_scan(
    file: UploadFile = File(..., description="Foto botol (JPG, PNG, atau WebP, maks 10MB)"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Upload foto botol dan dapatkan hasil deteksi AI.
    
    Flow:
    1. Upload gambar → AI analisis → identifikasi botol & harga
    2. Hasil scan berstatus 'pending' — user harus konfirmasi
    3. Setelah dikonfirmasi, saldo & poin ditambahkan
    """
    return await process_scan(db, current_user, file)


@router.post("/{scan_id}/confirm", response_model=ScanConfirmResponse)
async def confirm_scan_endpoint(
    scan_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Konfirmasi hasil scan. Setelah dikonfirmasi:
    - Saldo user bertambah sesuai total nilai botol
    - Poin user bertambah (1 poin per Rp100)
    - Transaksi 'deposit' tercatat
    """
    return await confirm_scan(db, current_user, scan_id)


@router.get("/history", response_model=ScanHistoryResponse)
async def get_scan_history(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Mendapatkan riwayat scan user."""
    # Get scans
    result = await db.execute(
        select(ScanLog)
        .where(ScanLog.user_id == current_user.id)
        .order_by(desc(ScanLog.created_at))
        .offset(skip)
        .limit(limit)
    )
    scans = result.scalars().all()

    # Get total count
    count_result = await db.execute(
        select(ScanLog).where(ScanLog.user_id == current_user.id)
    )
    total = len(count_result.scalars().all())

    return ScanHistoryResponse(
        scans=[ScanHistoryItem.model_validate(s) for s in scans],
        total=total,
    )
