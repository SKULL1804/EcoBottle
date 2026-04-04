"""
EcoBottle — BottleType Model
Master data for bottle types and recycling prices in Indonesia.
"""

import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, Integer, Numeric, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class BottleType(Base):
    __tablename__ = "bottle_types"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    brand: Mapped[str | None] = mapped_column(String(100), nullable=True)
    material: Mapped[str | None] = mapped_column(String(50), nullable=True, index=True)
    volume_ml: Mapped[int | None] = mapped_column(Integer, nullable=True)
    price_idr: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    image_ref: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    def __repr__(self):
        return f"<BottleType {self.name} — Rp{self.price_idr}>"
