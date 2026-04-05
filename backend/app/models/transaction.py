"""
EcoBottle — Transaction Model
Tracks deposits (from scan confirmations) and withdrawals.
"""

import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, Integer, Numeric, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=False, index=True
    )
    scan_log_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("scan_logs.id"), nullable=True
    )
    type: Mapped[str] = mapped_column(String(20), nullable=False)  # 'deposit', 'withdrawal'
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    points_earned: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending, completed, failed
    channel_code: Mapped[str | None] = mapped_column(String(30), nullable=True)  # e.g. BCA, ID_OVO
    xendit_payout_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )

    # Relationships
    user = relationship("User", back_populates="transactions")
    scan_log = relationship("ScanLog", back_populates="transaction")

    def __repr__(self):
        return f"<Transaction {self.type} Rp{self.amount} — {self.status}>"
