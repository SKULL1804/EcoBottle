"""
EcoBottle — Xendit Payout Service
Handles disbursement/payout to user bank accounts & e-wallets via Xendit.
"""

import httpx
import base64
from app.config import get_settings

settings = get_settings()

XENDIT_BASE_URL = "https://api.xendit.co"


def _get_auth_header() -> dict:
    """Build Basic Auth header from Xendit secret key."""
    key = settings.XENDIT_SECRET_KEY + ":"
    encoded = base64.b64encode(key.encode()).decode()
    return {
        "Authorization": f"Basic {encoded}",
        "Content-Type": "application/json",
    }


# Supported bank & e-wallet channels for Indonesian disbursement
SUPPORTED_CHANNELS = {
    # Banks
    "BCA": "Bank BCA",
    "BNI": "Bank BNI",
    "BRI": "Bank BRI",
    "MANDIRI": "Bank Mandiri",
    "BSI": "Bank Syariah Indonesia",
    "PERMATA": "Bank Permata",
    "CIMB": "Bank CIMB Niaga",
    "DANAMON": "Bank Danamon",
    # E-Wallets
    "ID_OVO": "OVO",
    "ID_DANA": "DANA",
    "ID_GOPAY": "GoPay",
    "ID_SHOPEEPAY": "ShopeePay",
    "ID_LINKAJA": "LinkAja",
}


async def create_payout(
    reference_id: str,
    channel_code: str,
    account_number: str,
    account_holder_name: str,
    amount: int,
    description: str = "EcoBottle Payout",
) -> dict:
    """
    Create a payout/disbursement via Xendit API v2.

    Args:
        reference_id: Unique ID from our system (transaction ID)
        channel_code: Bank/e-wallet code (e.g., 'BCA', 'ID_OVO')
        account_number: Recipient account/phone number
        account_holder_name: Recipient name
        amount: Amount in IDR (integer, no decimals)
        description: Payout description

    Returns:
        Xendit API response dict
    """
    payload = {
        "reference_id": reference_id,
        "channel_code": channel_code,
        "channel_properties": {
            "account_holder_name": account_holder_name,
            "account_number": account_number,
        },
        "amount": amount,
        "currency": "IDR",
        "description": description,
    }

    headers = _get_auth_header()
    headers["Idempotency-key"] = reference_id

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{XENDIT_BASE_URL}/v2/payouts",
            json=payload,
            headers=headers,
            timeout=30.0,
        )

    result = response.json()

    if response.status_code not in (200, 201):
        print(f"Xendit payout failed: {result}")
        return {
            "success": False,
            "error": result.get("message", "Payout failed"),
            "error_code": result.get("error_code", "UNKNOWN"),
        }

    print(f"Xendit payout created: {result.get('id')} — {result.get('status')}")
    return {
        "success": True,
        "xendit_id": result.get("id"),
        "status": result.get("status"),  # ACCEPTED, PENDING, SUCCEEDED, FAILED
        "reference_id": result.get("reference_id"),
        "amount": result.get("amount"),
        "channel_code": result.get("channel_code"),
    }


async def get_payout_status(payout_id: str) -> dict:
    """Check the status of an existing payout."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{XENDIT_BASE_URL}/v2/payouts/{payout_id}",
            headers=_get_auth_header(),
            timeout=15.0,
        )
    return response.json()


def get_supported_channels() -> list[dict]:
    """Return list of supported payout channels."""
    return [
        {"code": code, "name": name}
        for code, name in SUPPORTED_CHANNELS.items()
    ]
