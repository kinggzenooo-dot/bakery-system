from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import DATABASE_URL

if "sqlite" in DATABASE_URL:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    # Production PostgreSQL (Supabase / Neon / Cloud PG)
    # Try default driver; fallback between psycopg (v3) and psycopg2 if necessary
    db_url = DATABASE_URL
    try:
        engine = create_engine(
            db_url,
            pool_pre_ping=True,
            pool_recycle=300
        )
    except Exception as exc:
        if "postgresql://" in db_url and not any(p in db_url for p in ["+psycopg2", "+psycopg"]):
            try:
                # Try explicit psycopg2 driver
                alt_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)
                engine = create_engine(alt_url, pool_pre_ping=True, pool_recycle=300)
            except Exception:
                raise exc
        else:
            raise exc

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
