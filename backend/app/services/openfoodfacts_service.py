"""
EcoBottle — OpenFoodFacts Service
Free open-source product lookup by EAN/UPC using OpenFoodFacts public API.
Project: https://github.com/openfoodfacts/openfoodfacts-server
"""

from __future__ import annotations

from typing import Any

import httpx


def _extract_digits(value: str | None) -> str:
    if not value:
        return ""
    return "".join(char for char in value if char.isdigit())


def _extract_text(product: dict[str, Any], *keys: str) -> str:
    for key in keys:
        raw = product.get(key)
        if isinstance(raw, str) and raw.strip():
            return raw.strip()
    return ""


def _parse_volume_ml(product: dict[str, Any]) -> int:
    quantity = _extract_text(product, "quantity")
    text = quantity.lower()

    if "1.5l" in text or "1,5l" in text:
        return 1500

    if "ml" in text:
        digits = _extract_digits(text)
        if digits:
            value = int(digits)
            if 30 <= value <= 10000:
                return value

    if " l" in text or text.endswith("l") or "liter" in text or "litre" in text:
        digits = _extract_digits(text)
        if digits:
            liters = int(digits)
            if 1 <= liters <= 10:
                return liters * 1000

    return 600


def _guess_bottle_type(product: dict[str, Any]) -> str:
    text = " ".join([
        _extract_text(product, "product_name", "generic_name"),
        _extract_text(product, "categories", "categories_tags"),
        _extract_text(product, "packaging", "packaging_tags"),
    ]).lower()

    if any(token in text for token in ("can", "aluminium", "aluminum", "kaleng")):
        return "aluminium_can"
    if any(token in text for token in ("glass", "kaca", "bottle:glass", "wine")):
        return "glass_bottle"
    if any(token in text for token in ("hdpe", "detergent", "shampoo", "sabun")):
        return "HDPE_bottle"
    return "PET_bottle"


async def lookup_product_by_openfoodfacts(barcode: str) -> dict[str, Any] | None:
    clean_barcode = _extract_digits(barcode)
    if len(clean_barcode) not in {8, 12, 13}:
        return None

    url = f"https://world.openfoodfacts.org/api/v2/product/{clean_barcode}.json"
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            payload = response.json()
    except Exception:
        return None

    if not isinstance(payload, dict):
        return None

    status = payload.get("status")
    product = payload.get("product")
    if status != 1 or not isinstance(product, dict):
        return None

    brand = _extract_text(product, "brands", "brand_owner")
    product_name = _extract_text(product, "product_name", "generic_name")
    if not brand:
        brand = product_name or "Produk Barcode"

    volume_ml = _parse_volume_ml(product)
    bottle_type = _guess_bottle_type(product)

    return {
        "barcode": clean_barcode,
        "brand": brand[:80],
        "type": bottle_type,
        "volume_estimate": str(volume_ml),
        "quantity": 1,
        "confidence": 0.95,
        "image_quality": "good",
        "source": "openfoodfacts",
        "lookup": {
            "product_name": product_name,
            "brands": product.get("brands"),
            "quantity": product.get("quantity"),
            "packaging": product.get("packaging"),
            "categories": product.get("categories"),
        },
    }
