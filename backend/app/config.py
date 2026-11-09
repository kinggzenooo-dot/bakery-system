import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env file from backend or root directory
load_dotenv()
backend_env = BASE_DIR / ".env"
root_env = BASE_DIR.parent / ".env"
if backend_env.exists():
    load_dotenv(dotenv_path=backend_env)
elif root_env.exists():
    load_dotenv(dotenv_path=root_env)

# In serverless environments like Vercel, the local filesystem outside /tmp is read-only
if os.environ.get("VERCEL"):
    DB_PATH = Path("/tmp") / "bakery.db"
    orig_db = BASE_DIR / "bakery.db"
    if orig_db.exists() and not DB_PATH.exists():
        import shutil
        try:
            shutil.copy2(orig_db, DB_PATH)
        except Exception:
            pass
else:
    DB_PATH = BASE_DIR / "bakery.db"

raw_db_url = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")
# Normalize postgres:// to postgresql:// for SQLAlchemy compatibility
if raw_db_url.startswith("postgres://"):
    raw_db_url = raw_db_url.replace("postgres://", "postgresql://", 1)

DATABASE_URL = raw_db_url
SECRET_KEY = os.getenv("SECRET_KEY", "fredy-bills-bakery-secret-key-2026-mse-super-secure")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
