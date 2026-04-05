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
    channel_code: str | None = None
    xendit_payout_id: str | None = None
    created_at: datetime
    scan_log_id: str | None = None

    model_config = {"from_attributes": True}


class WithdrawRequest(BaseModel):
    amount: Decimal = Field(..., gt=0, examples=[5000])
    channel_code: str = Field(..., examples=["BCA"], description="Bank/e-wallet code")
    account_number: str = Field(..., min_length=4, examples=["1234567890"])
    account_holder_name: str = Field(..., min_length=2, examples=["Budi Santoso"])


class WithdrawResponse(BaseModel):
    transaction_id: str
    amount: Decimal
    new_balance: Decimal
    status: str
    channel_code: str
    xendit_payout_id: str | None = None
    message: str


class PayoutChannelResponse(BaseModel):
    code: str
    name: str


class TransactionHistoryResponse(BaseModel):
    transactions: list[TransactionResponse]
    total: int
