"""
EcoBottle — Bottle Master Data API Routes (Admin)
GET /, POST /, PUT /{id}
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.bottle import BottleType
from app.schemas.bottle import BottleTypeResponse, BottleTypeCreate, BottleTypeUpdate

router = APIRouter(prefix="/bottles", tags=["Bottles (Master Data)"])


@router.get("", response_model=list[BottleTypeResponse])
async def list_bottles(
    db: AsyncSession = Depends(get_db),
):
    """List semua jenis botol dan harga daur ulang (publik)."""
    result = await db.execute(
        select(BottleType).where(BottleType.is_active == True).order_by(BottleType.material)
    )
    return result.scalars().all()


@router.post("", response_model=BottleTypeResponse, status_code=201)
async def create_bottle(
    data: BottleTypeCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Tambah jenis botol baru (memerlukan autentikasi)."""
    bottle = BottleType(
        name=data.name,
        brand=data.brand,
        material=data.material,
        volume_ml=data.volume_ml,
        price_idr=data.price_idr,
    )
    db.add(bottle)
    await db.flush()
    return bottle


@router.put("/{bottle_id}", response_model=BottleTypeResponse)
async def update_bottle(
    bottle_id: str,
    data: BottleTypeUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update info atau harga botol (memerlukan autentikasi)."""
    result = await db.execute(select(BottleType).where(BottleType.id == bottle_id))
    bottle = result.scalar_one_or_none()

    if not bottle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Jenis botol tidak ditemukan",
        )

    if data.name is not None:
        bottle.name = data.name
    if data.brand is not None:
        bottle.brand = data.brand
    if data.material is not None:
        bottle.material = data.material
    if data.volume_ml is not None:
        bottle.volume_ml = data.volume_ml
    if data.price_idr is not None:
        bottle.price_idr = data.price_idr
    if data.is_active is not None:
        bottle.is_active = data.is_active

    await db.flush()
    return bottle
