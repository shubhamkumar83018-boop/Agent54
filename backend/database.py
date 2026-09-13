import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("database")

# Check database type configuration
DATABASE_TYPE = os.getenv("DATABASE_TYPE", "mongodb").strip().lower()

# Local / Relational Fallback URL
SQLITE_URL = os.getenv("DATABASE_URL", "sqlite:///./astitwaa.db")
if SQLITE_URL.startswith(("mongodb://", "mongodb+srv://")):
    # If the user put MongoDB URL into DATABASE_URL, keep a safe SQLite fallback
    SQLITE_URL = "sqlite:///./astitwaa.db"

engine = create_engine(
    SQLITE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in SQLITE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def is_using_mongodb() -> bool:
    """Return True if MongoDB Atlas is configured and active."""
    from .mongo_db import is_mongo_configured
    if DATABASE_TYPE == "mongodb" and is_mongo_configured():
        return True
    return False

def get_db():
    """
    Database dependency for FastAPI routes.
    Yields MongoSession when MongoDB Atlas is configured, or SQLAlchemy Session for SQLite.
    """
    if is_using_mongodb():
        try:
            from .mongo_db import get_mongo_db
            from .mongo_session import MongoSession
            mongo_db_instance = get_mongo_db()
            session = MongoSession(mongo_db_instance)
            try:
                yield session
            finally:
                session.close()
            return
        except Exception as e:
            logger.warning(f"MongoDB connection failed: {e}. Falling back to SQLite session.")

    # SQLite fallback
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
