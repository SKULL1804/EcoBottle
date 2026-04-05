"""
EcoBottle — ScanLog Model
Stores AI scan results from Gemini Vision.
"""

import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, Numeric, DateTime, Text, ForeignKey, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class ScanLog(Base):
    __tablename__ = "scan_logs"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=False, index=True
    )
    image_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    detected_bottles: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    total_value: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)
    confidence: Mapped[Decimal | None] = mapped_column(Numeric(4, 2), nullable=True)
    barcode: Mapped[str | None] = mapped_column(String(50), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending, confirmed, rejected
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )

    # Relationships
    user = relationship("User", back_populates="scan_logs")
    transaction = relationship("Transaction", back_populates="scan_log", uselist=False)

    def __repr__(self):
        return f"<ScanLog {self.id[:8]} — {self.status}>"
