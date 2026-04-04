"""
EcoBottle — Transaction API Routes
GET / (history), POST /withdraw, GET /{id}
"""

from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.transaction import Transaction
from app.schemas.transaction import (
    TransactionResponse,
    WithdrawRequest,
    WithdrawResponse,
    TransactionHistoryResponse,
)

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("", response_model=TransactionHistoryResponse)
async def get_transactions(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Mendapatkan riwayat transaksi user (deposit & withdrawal)."""
    result = await db.execute(
        select(Transaction)
        .where(Transaction.user_id == current_user.id)
        .order_by(desc(Transaction.created_at))
        .offset(skip)
        .limit(limit)
    )
    transactions = result.scalars().all()

    count_result = await db.execute(
        select(Transaction).where(Transaction.user_id == current_user.id)
    )
    total = len(count_result.scalars().all())

    return TransactionHistoryResponse(
        transactions=[TransactionResponse.model_validate(t) for t in transactions],
        total=total,
    )


@router.post("/withdraw", response_model=WithdrawResponse)
async def withdraw(
    request: WithdrawRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Pencairan saldo user.
    Validasi: saldo harus cukup, minimal penarikan Rp1.000.
    """
    amount = request.amount

    # Validate minimum withdrawal
    if amount < Decimal("1000"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Minimal pencairan Rp1.000",
        )

    # Check sufficient balance
    if current_user.balance < amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Saldo tidak cukup. Saldo saat ini: Rp{current_user.balance:,.0f}",
        )

    # Deduct balance
    current_user.balance -= amount

    # Create withdrawal transaction
    transaction = Transaction(
        user_id=current_user.id,
        type="withdrawal",
        amount=amount,
        points_earned=0,
        status="completed",
    )
    db.add(transaction)
    await db.flush()

    return WithdrawResponse(
        transaction_id=transaction.id,
        amount=amount,
        new_balance=current_user.balance,
        status="completed",
        message=f"Pencairan Rp{amount:,.0f} berhasil!",
    )


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Mendapatkan detail transaksi berdasarkan ID."""
    result = await db.execute(
        select(Transaction).where(
            Transaction.id == transaction_id,
            Transaction.user_id == current_user.id,
        )
    )
    transaction = result.scalar_one_or_none()

    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaksi tidak ditemukan",
        )

    return transaction
