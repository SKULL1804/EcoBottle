# 🌿 EcoBottle — Backend Development Plan

> **Stack**: FastAPI (Python) · PostgreSQL · Redis · Azure (VPS) · GitHub Student Pack  
> **Versi Dokumen**: 1.0  
> **Tanggal**: April 2026

---

## 📦 Pemanfaatan GitHub Student Developer Pack

Sebelum mulai coding, aktifkan semua tools berikut dari GitHub Student Pack. Ini adalah "modal gratis" yang harus dimaksimalkan.

### ✅ Tools yang Langsung Relevan untuk EcoBottle

| Tool | Benefit | Digunakan Untuk |
|---|---|---|
| **Microsoft Azure** | $100 credit + 25+ free services | VPS (VM), Azure Container Registry, App Insights |
| **GitHub Pro** | Gratis selama mahasiswa | Private repo, unlimited collaborators |
| **GitHub Copilot** | Gratis (Copilot Student) | Bantu nulis boilerplate FastAPI, query SQL |
| **GitHub Actions** | Gratis (2.000 menit/bulan) | CI/CD pipeline otomatis ke Azure |
| **MongoDB Atlas** | $50 credit + free tier | Opsional: simpan log scan AI jika pakai NoSQL |
| **Namecheap** | 1 tahun domain `.me` gratis + SSL | Domain untuk API dan landing page |
| **Twilio** | $50 credit API | Notifikasi SMS/WhatsApp saat setoran dikonfirmasi |
| **Mailgun** | 20.000 email/bulan gratis (12 bulan) | Email verifikasi akun, notifikasi transaksi |
| **JetBrains (PyCharm)** | Gratis selama mahasiswa | IDE untuk development FastAPI |
| **GitHub Codespaces** | Free Pro (gratis) | Cloud dev environment, tidak perlu setup lokal |

### 🔧 Azure Services yang Digunakan (dari $100 credit)

```
Azure Virtual Machine (B1s)     → Server utama FastAPI backend
Azure Database for PostgreSQL   → Database relational utama
Azure Blob Storage              → Simpan foto botol dari scan
Azure Cache for Redis           → Session, cache, job queue
Azure Container Registry        → Simpan Docker image
Azure Application Insights      → Monitoring & logging (gratis tier)
Azure DevOps (free)             → Alternatif CI/CD jika butuh lebih dari Actions
```

> **💡 Tips Hemat Credit**: Gunakan `B1s` VM (1 vCPU, 1GB RAM) untuk development.
> Estimasi biaya: ~$7–10/bulan. Dengan $100 credit, cukup untuk 10–13 bulan development.

---

## 🏗️ Arsitektur Backend

```
Client (Next.js Frontend)
         │
         ▼
    [Namecheap Domain + SSL]
         │
         ▼
    [Azure VM — FastAPI]
    ┌────────────────────────────────┐
    │  API Gateway (FastAPI Router)  │
    │  ├── /auth         Auth Service│
    │  ├── /users        User Service│
    │  ├── /scan    AI Scanner Service│ ← Fitur utama
    │  ├── /transactions  Tx Service  │
    │  └── /notifications Notif Svc  │
    └────────────────────────────────┘
         │            │           │
         ▼            ▼           ▼
   [PostgreSQL]   [Redis]   [Azure Blob]
   (Azure DB)     (Cache)   (Foto scan)
         │
         ▼
   [Gemini Vision API / OpenAI Vision]
   (Klasifikasi & deteksi botol)
```

---

## 📁 Struktur Folder Project Backend

```
ecobottle-backend/
├── app/
│   ├── main.py                    # Entry point FastAPI
│   ├── config.py                  # Environment variables & settings
│   ├── database.py                # PostgreSQL connection (SQLAlchemy)
│   ├── redis_client.py            # Redis connection
│   │
│   ├── api/
│   │   ├── v1/
│   │   │   ├── auth.py            # Register, login, refresh token
│   │   │   ├── users.py           # Profile, poin, wallet
│   │   │   ├── scanner.py         # ← Endpoint AI Scanner
│   │   │   ├── transactions.py    # Setoran, pencairan, riwayat
│   │   │   └── notifications.py   # Push, email, SMS
│   │   └── deps.py                # Dependency injection (auth, db)
│   │
│   ├── models/                    # SQLAlchemy ORM models
│   │   ├── user.py
│   │   ├── bottle.py              # Master data botol & harga
│   │   ├── transaction.py
│   │   └── scan_log.py
│   │
│   ├── schemas/                   # Pydantic request/response schemas
│   │   ├── user.py
│   │   ├── bottle.py
│   │   ├── scanner.py
│   │   └── transaction.py
│   │
│   ├── services/                  # Business logic
│   │   ├── auth_service.py
│   │   ├── scanner_service.py     # ← Core AI logic
│   │   ├── pricing_service.py     # Lookup harga botol
│   │   └── notification_service.py
│   │
│   └── utils/
│       ├── image_processor.py     # Compress & upload ke Azure Blob
│       ├── vision_client.py       # Wrapper Gemini Vision API
│       └── security.py            # JWT, password hashing
│
├── alembic/                       # Database migrations
│   └── versions/
│
├── tests/
│   ├── test_auth.py
│   ├── test_scanner.py
│   └── test_transactions.py
│
├── scripts/
│   └── seed_bottle_prices.py      # Seed data harga botol Indonesia
│
├── Dockerfile
├── docker-compose.yml             # Untuk local dev
├── requirements.txt
├── .env.example
├── .github/
│   └── workflows/
│       └── deploy.yml             # CI/CD ke Azure via GitHub Actions
└── README.md
```

---

## 🗄️ Skema Database (PostgreSQL)

### Tabel Utama

```sql
-- Users
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    phone       VARCHAR(20),
    password    VARCHAR(255) NOT NULL,
    points      INTEGER DEFAULT 0,
    balance     DECIMAL(12,2) DEFAULT 0,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Master data botol (seed dari harga pengepul Indonesia)
CREATE TABLE bottle_types (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,        -- "Aqua 600ml PET"
    brand       VARCHAR(100),                 -- "Aqua", "Le Minerale", "Coca-Cola"
    material    VARCHAR(50),                  -- "PET", "HDPE", "Glass", "Aluminium"
    volume_ml   INTEGER,
    price_idr   DECIMAL(10,2) NOT NULL,       -- Harga per botol dalam Rupiah
    image_ref   VARCHAR(255),                 -- Referensi gambar untuk training
    is_active   BOOLEAN DEFAULT TRUE,
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- Log hasil scan AI
CREATE TABLE scan_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    image_url       TEXT,                      -- URL di Azure Blob
    detected_bottles JSONB,                    -- Array hasil deteksi
    total_value     DECIMAL(10,2),
    confidence      DECIMAL(4,2),              -- Confidence score model
    status          VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, rejected
    created_at      TIMESTAMP DEFAULT NOW()
);

-- Transaksi setoran
CREATE TABLE transactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    scan_log_id     UUID REFERENCES scan_logs(id),
    type            VARCHAR(20),               -- 'deposit', 'withdrawal'
    amount          DECIMAL(12,2),
    points_earned   INTEGER,
    status          VARCHAR(20) DEFAULT 'pending',
    created_at      TIMESTAMP DEFAULT NOW()
);
```

---

## 🤖 AI Scanner — Detail Implementasi

### Flow Lengkap

```
1. User foto botol (kamera HP)
           │
2. Frontend kirim ke POST /api/v1/scan/analyze
   (multipart/form-data dengan gambar)
           │
3. Backend:
   a. Validasi file (max 10MB, format jpg/png/webp)
   b. Compress gambar → upload ke Azure Blob
   c. Kirim URL gambar ke Gemini Vision API
           │
4. Gemini Vision API return:
   - Jenis botol yang terdeteksi
   - Material (PET, glass, aluminium)
   - Estimasi jumlah
   - Confidence score
           │
5. Backend lookup harga di tabel bottle_types
           │
6. Return ke frontend:
   {
     "detected": [
       { "name": "Aqua 600ml", "qty": 3, "price": 200, "subtotal": 600 },
       { "name": "Kaleng Coca-Cola", "qty": 1, "price": 400, "subtotal": 400 }
     ],
     "total_value": 1000,
     "total_points": 10,
     "scan_id": "uuid-xxx"
   }
           │
7. User konfirmasi → status jadi 'confirmed'
   → Tambah balance & poin user
   → Kirim notifikasi (Mailgun/Twilio)
```

### Prompt Template untuk Gemini Vision

```python
SCAN_PROMPT = """
Kamu adalah sistem identifikasi botol untuk daur ulang di Indonesia.
Analisis gambar ini dan identifikasi semua botol/kemasan yang terlihat.

Untuk setiap botol yang terdeteksi, berikan informasi dalam format JSON:
{
  "bottles": [
    {
      "brand": "nama merek (contoh: Aqua, Le Minerale, Coca-Cola)",
      "type": "jenis kemasan (PET_bottle, glass_bottle, aluminium_can, HDPE_bottle)",
      "volume_estimate": "estimasi volume dalam ml",
      "quantity": "jumlah botol jenis ini yang terlihat",
      "confidence": "tingkat keyakinan 0.0-1.0"
    }
  ],
  "total_items": "total semua botol",
  "image_quality": "good/poor/unclear"
}

Fokus pada botol yang umum di Indonesia:
- Botol air minum (Aqua, Le Minerale, Club, Ades, VIT)
- Botol minuman (Coca-Cola, Sprite, Fanta, Teh Botol)
- Kaleng minuman (berbagai merek)
- Botol plastik HDPE (deterjen, sampo, dll)
- Botol kaca

Jika gambar tidak jelas atau tidak ada botol, berikan image_quality: "poor"
Jawab HANYA dengan JSON, tanpa teks lain.
"""
```

### Master Data Harga Botol Indonesia (Seed Data)

```python
# scripts/seed_bottle_prices.py
# Referensi harga: pengepul plastik, ADUPI (Asosiasi Daur Ulang Plastik Indonesia)

BOTTLE_PRICES = [
    # PET Bottles (botol plastik transparan)
    {"name": "Botol PET < 600ml", "material": "PET", "price_idr": 150},
    {"name": "Botol PET 600ml - 1.5L", "material": "PET", "price_idr": 200},
    {"name": "Botol PET > 1.5L (Galon kecil)", "material": "PET", "price_idr": 400},
    
    # Aluminium Cans
    {"name": "Kaleng Aluminium 250ml", "material": "Aluminium", "price_idr": 300},
    {"name": "Kaleng Aluminium 330ml", "material": "Aluminium", "price_idr": 400},

    # Glass Bottles
    {"name": "Botol Kaca kecil < 200ml", "material": "Glass", "price_idr": 200},
    {"name": "Botol Kaca 200-500ml", "material": "Glass", "price_idr": 350},
    {"name": "Botol Kaca > 500ml", "material": "Glass", "price_idr": 500},

    # HDPE (plastik putih/buram)
    {"name": "Botol HDPE < 500ml", "material": "HDPE", "price_idr": 100},
    {"name": "Botol HDPE 500ml - 1L", "material": "HDPE", "price_idr": 150},
]
```

---

## 🔐 Sistem Autentikasi

```python
# Teknologi: JWT (JSON Web Token) + bcrypt
# Library: python-jose, passlib, python-multipart

# Flow:
# POST /auth/register → hash password → simpan user → return JWT
# POST /auth/login    → verify password → return access_token + refresh_token
# GET  /auth/me       → decode JWT → return user info

# Token config:
ACCESS_TOKEN_EXPIRE  = 30 menit
REFRESH_TOKEN_EXPIRE = 7 hari
```

---

## 🚀 Roadmap Development (8 Minggu)

### Fase 1 — Setup & Fondasi (Minggu 1–2)

- [ ] Setup Azure VM (Ubuntu 22.04, B1s)
- [ ] Install Docker, Nginx, Certbot (SSL dari Namecheap domain)
- [ ] Inisialisasi project FastAPI + folder structure
- [ ] Setup PostgreSQL di Azure Database
- [ ] Setup Redis di Azure Cache
- [ ] Konfigurasi environment variables (.env)
- [ ] Setup GitHub Actions CI/CD pipeline ke Azure
- [ ] Buat tabel database + Alembic migrations

### Fase 2 — Auth & User Service (Minggu 3)

- [ ] `POST /api/v1/auth/register`
- [ ] `POST /api/v1/auth/login`
- [ ] `GET  /api/v1/auth/me`
- [ ] `PUT  /api/v1/users/profile`
- [ ] `GET  /api/v1/users/balance`
- [ ] Unit tests untuk auth

### Fase 3 — AI Scanner (Minggu 4–5) ⭐ Prioritas Utama

- [ ] Setup Azure Blob Storage untuk foto
- [ ] Integrasi Gemini Vision API (atau OpenAI Vision)
- [ ] `POST /api/v1/scan/analyze` — upload & analisis foto
- [ ] `POST /api/v1/scan/{scan_id}/confirm` — konfirmasi setoran
- [ ] Seed data harga botol Indonesia
- [ ] Pricing service (match hasil scan → harga)
- [ ] Integration test scanner end-to-end

### Fase 4 — Transaksi & Poin (Minggu 6)

- [ ] `GET  /api/v1/transactions/history`
- [ ] `POST /api/v1/transactions/withdraw`
- [ ] Sistem poin (earn dari setoran)
- [ ] Validasi saldo sebelum pencairan

### Fase 5 — Notifikasi (Minggu 7)

- [ ] Setup Mailgun (dari Student Pack) untuk email
- [ ] Setup Twilio (dari Student Pack) untuk SMS/WhatsApp
- [ ] Email: verifikasi akun, konfirmasi setoran, notifikasi transfer
- [ ] SMS: OTP login, konfirmasi pencairan

### Fase 6 — Hardening & Launch (Minggu 8)

- [ ] Rate limiting (slowapi)
- [ ] Request validation & error handling lengkap
- [ ] API documentation (Swagger otomatis dari FastAPI)
- [ ] Load testing sederhana (locust)
- [ ] Setup Application Insights (monitoring gratis dari Azure)
- [ ] Security audit (CORS, header security, SQL injection check)

---

## ⚙️ Tech Stack Lengkap

```
Backend Framework   : FastAPI 0.111+
Language            : Python 3.11+
Database            : PostgreSQL 15 (Azure Database for PostgreSQL)
ORM                 : SQLAlchemy 2.0 + Alembic (migrations)
Cache / Queue       : Redis 7 (Azure Cache for Redis)
Auth                : python-jose (JWT) + passlib (bcrypt)
AI Vision           : Google Gemini 1.5 Flash Vision API
File Storage        : Azure Blob Storage
Email               : Mailgun API (20k email/bulan gratis - Student Pack)
SMS / WhatsApp      : Twilio API ($50 credit - Student Pack)
Server              : Nginx (reverse proxy) + Uvicorn (ASGI)
Containerization    : Docker + Docker Compose
CI/CD               : GitHub Actions → Azure VM
IDE                 : PyCharm (gratis - Student Pack)
Monitoring          : Azure Application Insights (gratis tier)
Domain & SSL        : Namecheap .me domain (gratis 1 tahun - Student Pack)
```

---

## 📋 Endpoints API — Ringkasan

```
AUTH
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout

USERS
GET    /api/v1/users/me
PUT    /api/v1/users/profile
GET    /api/v1/users/balance
GET    /api/v1/users/points

SCANNER ⭐
POST   /api/v1/scan/analyze          ← Upload foto, dapat hasil deteksi
POST   /api/v1/scan/{id}/confirm     ← Konfirmasi setoran
GET    /api/v1/scan/history          ← Riwayat scan user

TRANSACTIONS
GET    /api/v1/transactions
POST   /api/v1/transactions/withdraw
GET    /api/v1/transactions/{id}

BOTTLES (Admin)
GET    /api/v1/bottles               ← List master data botol & harga
POST   /api/v1/bottles               ← Tambah jenis botol baru
PUT    /api/v1/bottles/{id}          ← Update harga
```

---

## 🌿 Catatan Pengembangan

### AI Vision — Pilihan Model

Untuk MVP gunakan **Gemini 1.5 Flash** (paling hemat biaya):
- Harga: ~$0.075 per 1M token input (sangat murah)
- Kemampuan: bagus untuk identifikasi objek umum
- Alternatif jika akurasi kurang: fine-tune YOLOv8 dengan dataset botol Indonesia

### Tips Hemat Azure Credit

1. Matikan VM saat tidak digunakan (bisa pakai auto-shutdown schedule)
2. Gunakan `B1s` VM untuk dev, scale ke `B2s` hanya saat production
3. Azure Database for PostgreSQL — gunakan tier `Burstable B1ms` (~$12/bulan)
4. Aktifkan Azure Cost Alerts di $50 dan $80 agar tidak kaget

### Keamanan Minimal yang Wajib Ada

- HTTPS wajib (SSL dari Namecheap + Certbot)
- Rate limiting pada endpoint `/scan/analyze` (maks 10 request/menit/user)
- Validasi ukuran & tipe file gambar sebelum diproses
- Jangan simpan gambar asli terlalu lama — hapus setelah 30 hari
- Enkripsi field sensitif di database (nomor rekening untuk pencairan)

---

*Dokumen ini akan diperbarui seiring progress development. Selamat membangun EcoBottle! 🌱♻️*
