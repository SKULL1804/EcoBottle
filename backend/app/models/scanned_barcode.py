"""
EcoBottle — ScannedBarcode Model
Anti-fraud: tracks which barcodes each user has scanned per day.
Unique constraint on (user_id, barcode, scanned_date) prevents
the same user from scanning the same barcode more than once per day.
"""

import uuid
from datetime import date, datetime
from sqlalchemy import String, Date, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class ScannedBarcode(Base):
    __tablename__ = "scanned_barcodes"
    __table_args__ = (
        UniqueConstraint("user_id", "barcode", "scanned_date", name="uq_user_barcode_date"),
    )

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=False, index=True
    )
    barcode: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    scanned_date: Mapped[date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )

    def __repr__(self):
        return f"<ScannedBarcode {self.barcode} by {self.user_id[:8]} on {self.scanned_date}>"
