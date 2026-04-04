"""
EcoBottle — Transaction Schemas (Pydantic)
"""

from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field


class TransactionResponse(BaseModel):
    id: str
    type: str
    amount: Decimal
    points_earned: int | None = None
    status: str
    created_at: datetime
    scan_log_id: str | None = None

    model_config = {"from_attributes": True}


class WithdrawRequest(BaseModel):
    amount: Decimal = Field(..., gt=0, examples=[5000])


class WithdrawResponse(BaseModel):
    transaction_id: str
    amount: Decimal
    new_balance: Decimal
    status: str
    message: str


class TransactionHistoryResponse(BaseModel):
    transactions: list[TransactionResponse]
    total: int
