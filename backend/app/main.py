import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse

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

# Locate frontend directory
FRONTEND_DIR = Path(__file__).resolve().parent.parent.parent / "frontend"
if not FRONTEND_DIR.exists():
    FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"

# Mount frontend static folders (CSS, JS, menu images)
if (FRONTEND_DIR / "css").exists():
    app.mount("/css", StaticFiles(directory=str(FRONTEND_DIR / "css")), name="css")
if (FRONTEND_DIR / "js").exists():
    app.mount("/js", StaticFiles(directory=str(FRONTEND_DIR / "js")), name="js")
if (FRONTEND_DIR / "menu").exists():
    app.mount("/menu", StaticFiles(directory=str(FRONTEND_DIR / "menu")), name="menu")

# Mount uploads directory for product images
try:
    if os.environ.get("VERCEL"):
        UPLOAD_DIR = Path("/tmp") / "uploads"
    else:
        UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
except Exception as e:
    print(f"[STARTUP ERROR] Upload dir mount failed: {e}")

# Root route: serve login.html directly
@app.get("/", include_in_schema=False)
def root():
    login_file = FRONTEND_DIR / "login.html"
    if login_file.exists():
        return FileResponse(str(login_file))
    return {"status": "online", "system": "Fredy Bills Baker Management System", "docs": "/docs"}

# Serve HTML portal pages directly (/login.html, /admin.html, /pos.html, /baker.html, /delivery.html, /index.html)
@app.get("/{page}.html", include_in_schema=False)
def serve_html_page(page: str):
    html_file = FRONTEND_DIR / f"{page}.html"
    if html_file.exists():
        return FileResponse(str(html_file))
    login_file = FRONTEND_DIR / "login.html"
    if login_file.exists():
        return FileResponse(str(login_file))
    return RedirectResponse(url="/")
