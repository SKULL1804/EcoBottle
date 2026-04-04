"""
EcoBottle — Seed Bottle Prices
Populates the bottle_types table with Indonesian recycling prices.

Usage:
    cd backend
    python -m scripts.seed_bottle_prices
"""

import asyncio
from decimal import Decimal
from sqlalchemy import select
from app.database import async_session, init_db
from app.models.bottle import BottleType

# Referensi harga: pengepul plastik, ADUPI (Asosiasi Daur Ulang Plastik Indonesia)
BOTTLE_PRICES = [
    # PET Bottles (botol plastik transparan)
    {"name": "Botol PET < 600ml", "material": "PET", "volume_ml": 350, "price_idr": Decimal("150")},
    {"name": "Botol PET 600ml - 1.5L", "material": "PET", "volume_ml": 600, "price_idr": Decimal("200")},
    {"name": "Botol PET > 1.5L (Galon kecil)", "material": "PET", "volume_ml": 1500, "price_idr": Decimal("400")},

    # Aluminium Cans
    {"name": "Kaleng Aluminium 250ml", "material": "Aluminium", "volume_ml": 250, "price_idr": Decimal("300")},
    {"name": "Kaleng Aluminium 330ml", "material": "Aluminium", "volume_ml": 330, "price_idr": Decimal("400")},

    # Glass Bottles
    {"name": "Botol Kaca kecil < 200ml", "material": "Glass", "volume_ml": 150, "price_idr": Decimal("200")},
    {"name": "Botol Kaca 200-500ml", "material": "Glass", "volume_ml": 350, "price_idr": Decimal("350")},
    {"name": "Botol Kaca > 500ml", "material": "Glass", "volume_ml": 750, "price_idr": Decimal("500")},

    # HDPE (plastik putih/buram)
    {"name": "Botol HDPE < 500ml", "material": "HDPE", "volume_ml": 300, "price_idr": Decimal("100")},
    {"name": "Botol HDPE 500ml - 1L", "material": "HDPE", "volume_ml": 750, "price_idr": Decimal("150")},
]


async def seed():
    await init_db()
    
    async with async_session() as session:
        # Check if data already exists
        result = await session.execute(select(BottleType))
        existing = result.scalars().all()
        
        if existing:
            print(f"⚠️  Database sudah memiliki {len(existing)} jenis botol.")
            print("   Menghapus data lama dan memasukkan data baru...")
            for b in existing:
                await session.delete(b)
            await session.flush()

        # Insert seed data
        for data in BOTTLE_PRICES:
            bottle = BottleType(**data)
            session.add(bottle)

        await session.commit()
        print(f"✅ Berhasil memasukkan {len(BOTTLE_PRICES)} jenis botol ke database!")
        
        # Print summary
        print("\n📋 Daftar Harga Botol Daur Ulang:")
        print("-" * 55)
        for d in BOTTLE_PRICES:
            print(f"   {d['name']:<35} Rp{d['price_idr']:>6}")
        print("-" * 55)


if __name__ == "__main__":
    asyncio.run(seed())
