import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# In serverless environments like Vercel, the local filesystem outside /tmp is read-only
if os.environ.get("VERCEL"):
    DB_PATH = Path("/tmp") / "bakery.db"
    # Copy template SQLite db if it exists
    orig_db = BASE_DIR / "bakery.db"
    if orig_db.exists() and not DB_PATH.exists():
        import shutil
        try:
            shutil.copy2(orig_db, DB_PATH)
        except Exception:
            pass
else:
    DB_PATH = BASE_DIR / "bakery.db"

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")
SECRET_KEY = os.getenv("SECRET_KEY", "fredy-bills-bakery-secret-key-2026-mse-super-secure")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
