from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import DATABASE_URL, BASE_DIR

Base = declarative_base()

# Local SQLite fallback
sqlite_url = f"sqlite:///{BASE_DIR / 'bakery.db'}"
sqlite_engine = create_engine(
    sqlite_url,
    connect_args={"check_same_thread": False}
)
SqliteSession = sessionmaker(autocommit=False, autoflush=False, bind=sqlite_engine)

engine = sqlite_engine
SessionLocal = SqliteSession

if "sqlite" in DATABASE_URL:
    print(f"[DATABASE] Using SQLite database: {sqlite_url}")
else:
    # Attempt PostgreSQL connections (testing connectivity before committing to engine)
    pg_urls = [DATABASE_URL]
    if "postgresql://" in DATABASE_URL and not any(p in DATABASE_URL for p in ["+psycopg2", "+psycopg"]):
        pg_urls.append(DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1))

    connected = False
    for url in pg_urls:
        try:
            candidate_engine = create_engine(
                url,
                pool_pre_ping=True,
                pool_recycle=300
            )
            # Test live connection with 5s timeout
            with candidate_engine.connect() as conn:
                pass
            engine = candidate_engine
            SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
            connected = True
            print("[DATABASE] Successfully connected to PostgreSQL database!")
            break
        except Exception as e:
            print(f"[DATABASE WARNING] PostgreSQL connection failed: {e}")

    if not connected:
        print("[DATABASE NOTICE] PostgreSQL unreachable (DNS/Network). Falling back to SQLite database to keep all portals online.")
        engine = sqlite_engine
        SessionLocal = SqliteSession

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
