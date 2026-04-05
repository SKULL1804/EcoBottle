"""
EcoBottle — Transaction API Routes
GET / (history), POST /withdraw, GET /channels, GET /{id}
Integrates with Xendit Payout API for real disbursement.
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
    PayoutChannelResponse,
)
from app.services.xendit_service import create_payout, get_supported_channels

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("/channels", response_model=list[PayoutChannelResponse])
async def list_payout_channels():
    """Daftar bank & e-wallet yang didukung untuk pencairan."""
    return get_supported_channels()


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
    Pencairan saldo user via Xendit.
    1. Validasi saldo cukup
    2. Potong saldo user
    3. Kirim disbursement ke Xendit
    4. Simpan transaksi dengan payout ID
    """
    amount = request.amount

    # Validate minimum withdrawal
    if amount < Decimal("150"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Minimal pencairan Rp150",
        )

    # Validate channel
    valid_channels = [c["code"] for c in get_supported_channels()]
    if request.channel_code not in valid_channels:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Channel tidak didukung. Pilih: {', '.join(valid_channels)}",
        )

    # Check sufficient balance
    if current_user.balance < amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Saldo tidak cukup. Saldo saat ini: Rp{current_user.balance:,.0f}",
        )

    # Deduct balance
    current_user.balance -= amount

    # Create withdrawal transaction (pending)
    transaction = Transaction(
        user_id=current_user.id,
        type="withdrawal",
        amount=amount,
        points_earned=0,
        status="pending",
        channel_code=request.channel_code,
    )
    db.add(transaction)
    await db.flush()

    # Send payout via Xendit
    payout_result = await create_payout(
        reference_id=transaction.id,
        channel_code=request.channel_code,
        account_number=request.account_number,
        account_holder_name=request.account_holder_name,
        amount=int(amount),
        description=f"EcoBottle Payout — {current_user.name}",
    )

    if payout_result["success"]:
        transaction.xendit_payout_id = payout_result["xendit_id"]
        transaction.status = "processing"
        message = f"Pencairan Rp{amount:,.0f} ke {request.channel_code} ({request.account_number}) sedang diproses!"
    else:
        # Refund balance jika Xendit gagal
        current_user.balance += amount
        transaction.status = "failed"
        message = f"Pencairan gagal: {payout_result.get('error', 'Unknown error')}"
        await db.flush()
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=message,
        )

    await db.flush()

    return WithdrawResponse(
        transaction_id=transaction.id,
        amount=amount,
        new_balance=current_user.balance,
        status=transaction.status,
        channel_code=request.channel_code,
        xendit_payout_id=transaction.xendit_payout_id,
        message=message,
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
