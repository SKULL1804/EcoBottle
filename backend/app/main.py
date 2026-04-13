"""
EcoBottle — Backend API
FastAPI entry point with CORS, router registration, and database init.
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.config import get_settings
from app.database import init_db

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup & shutdown events."""
    # Startup: create database tables
    await init_db()
    
    # Create upload directory
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    print("EcoBottle API is ready")
    print("Swagger UI: http://localhost:8000/docs")
    yield
    # Shutdown
    print("EcoBottle API shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
    **EcoBottle API** — Platform daur ulang botol dengan AI Scanner.
    
    ## Fitur Utama
    * **AI Scanner** — Foto botol, deteksi otomatis jenis & harga
    * **Sistem Saldo & Poin** — Kumpulkan poin dari setoran botol
    * **Autentikasi JWT** — Register, login, refresh token
    * **Riwayat Transaksi** — Lacak setoran & pencairan
    
    ## Cara Menggunakan
    1. Register/Login untuk mendapatkan access token
    2. Klik tombol **Authorize** di atas dan masukkan token
    3. Upload foto botol ke endpoint **/scan/analyze**
    4. Konfirmasi setoran untuk mendapatkan saldo & poin
    """,
    lifespan=lifespan,
)

# CORS — allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory for serving scan images
uploads_path = Path(settings.UPLOAD_DIR)
uploads_path.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_path)), name="uploads")

# ─── Register API Routers ─────────────────────────────────

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.scanner import router as scanner_router
from app.api.v1.transactions import router as transactions_router
from app.api.v1.bottles import router as bottles_router
from app.api.v1.stats import router as stats_router

# Ensure all models are imported for table creation
from app.models.achievement import Achievement  # noqa: F401
from app.models.scanned_barcode import ScannedBarcode  # noqa: F401

API_V1_PREFIX = "/api/v1"

app.include_router(auth_router, prefix=API_V1_PREFIX)
app.include_router(users_router, prefix=API_V1_PREFIX)
app.include_router(scanner_router, prefix=API_V1_PREFIX)
app.include_router(transactions_router, prefix=API_V1_PREFIX)
app.include_router(bottles_router, prefix=API_V1_PREFIX)
app.include_router(stats_router, prefix=API_V1_PREFIX)


# ─── Health Check ──────────────────────────────────────────

@app.get("/", tags=["Health"])
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "healthy",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}
