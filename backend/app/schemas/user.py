"""
EcoBottle — User Schemas (Pydantic)
"""

from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, EmailStr, Field


# ─── Auth Schemas ─────────────────────────────────────────

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, examples=["Budi Santoso"])
    email: EmailStr = Field(..., examples=["budi@gmail.com"])
    password: str = Field(..., min_length=6, max_length=128, examples=["password123"])
    phone: str | None = Field(None, max_length=20, examples=["+6281234567890"])


class UserLogin(BaseModel):
    email: EmailStr = Field(..., examples=["budi@gmail.com"])
    password: str = Field(..., examples=["password123"])


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    refresh_token: str


# ─── User Schemas ─────────────────────────────────────────

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str | None = None
    points: int = 0
    balance: Decimal = Decimal("0.00")
    created_at: datetime

    model_config = {"from_attributes": True}


class UserProfileUpdate(BaseModel):
    name: str | None = Field(None, min_length=2, max_length=100)
    phone: str | None = Field(None, max_length=20)


class UserBalanceResponse(BaseModel):
    balance: Decimal
    points: int

    model_config = {"from_attributes": True}
