import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import engine, Base, SessionLocal
from app.seed import seed_database
from app.routers import (
    auth_routes,
    user_routes,
    product_routes,
    order_routes,
    inventory_routes,
    production_routes,
    delivery_routes,
    supplier_routes,
    report_routes,
    store_routes,
    upload_routes
)

# Create database tables and seed
try:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
except Exception as e:
    print(f"[STARTUP ERROR] Database init failed: {e}")

app = FastAPI(
    title="Fredy Bills Baker Management System API",
    description="Enterprise Bakery Operations & E-Commerce API supporting Administrator, Counter Staff, Baker, Delivery Staff, and Customer workflows.",
    version="2.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include All API Routers
app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(product_routes.router)
app.include_router(order_routes.router)
app.include_router(inventory_routes.router)
app.include_router(production_routes.router)
app.include_router(delivery_routes.router)
app.include_router(supplier_routes.router)
app.include_router(report_routes.router)
app.include_router(store_routes.router)
app.include_router(upload_routes.router)

@app.get("/api/health")
def health_check():
    return {"status": "online", "system": "Fredy Bills Baker Management System", "version": "2.0.0"}

# Mount uploads directory for product images
try:
    if os.environ.get("VERCEL"):
        UPLOAD_DIR = Path("/tmp") / "uploads"
    else:
        UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
except Exception as e:
    print(f"[STARTUP ERROR] Upload dir mount failed: {e}")

# Mount frontend static directory (only in local / container environments)
try:
    if not os.environ.get("VERCEL"):
        FRONTEND_DIR = Path(__file__).resolve().parent.parent.parent
        app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")
except Exception as e:
    print(f"[STARTUP ERROR] Static dir mount failed: {e}")
