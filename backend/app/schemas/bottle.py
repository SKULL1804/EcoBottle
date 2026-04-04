"""
EcoBottle — Bottle Schemas (Pydantic)
"""

from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field


class BottleTypeResponse(BaseModel):
    id: str
    name: str
    brand: str | None = None
    material: str | None = None
    volume_ml: int | None = None
    price_idr: Decimal
    is_active: bool = True
    updated_at: datetime

    model_config = {"from_attributes": True}


class BottleTypeCreate(BaseModel):
    name: str = Field(..., max_length=100, examples=["Botol PET 600ml"])
    brand: str | None = Field(None, max_length=100, examples=["Aqua"])
    material: str | None = Field(None, max_length=50, examples=["PET"])
    volume_ml: int | None = Field(None, examples=[600])
    price_idr: Decimal = Field(..., examples=[200])


class BottleTypeUpdate(BaseModel):
    name: str | None = Field(None, max_length=100)
    brand: str | None = Field(None, max_length=100)
    material: str | None = Field(None, max_length=50)
    volume_ml: int | None = None
    price_idr: Decimal | None = None
    is_active: bool | None = None
