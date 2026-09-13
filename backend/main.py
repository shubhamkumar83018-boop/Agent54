from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import logging
from contextlib import asynccontextmanager

# Load backend/.env file
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")

from .database import engine, Base, is_using_mongodb, SessionLocal
from . import models
from .seed import seed_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Determine database mode
    if is_using_mongodb():
        from .mongo_db import test_mongo_connection, init_mongo_indexes, seed_mongo_from_files, get_mongo_db
        test_res = test_mongo_connection()
        if test_res.get("connected"):
            print(f"[Database] Connected to MongoDB Atlas: {test_res.get('database')} ({test_res.get('latency_ms')}ms)")
            try:
                db = get_mongo_db()
                init_mongo_indexes(db)
                if db.departments.count_documents({}) == 0:
                    print("[Database] Empty MongoDB Atlas collections detected. Auto-seeding initial data...")
                    stats = seed_mongo_from_files()
                    print(f"[Database] MongoDB Atlas seeding complete: {stats}")
            except Exception as e:
                logger.error(f"Error initializing MongoDB Atlas data: {e}")
        else:
            print(f"[Database] MongoDB Atlas warning: {test_res.get('message')}")
            print("[Database] Initializing local SQLite fallback database...")
            Base.metadata.create_all(bind=engine)
            db = SessionLocal()
            if db.query(models.Department).first() is None:
                seed_db()
            db.close()
    else:
        # Standard SQLite initialization
        print("[Database] Using SQLite database.")
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        if db.query(models.Department).first() is None:
            print("Empty SQLite database detected. Seeding data...")
            seed_db()
        db.close()

    yield
    # Cleanup on shutdown (if any)


app = FastAPI(title="ASTITWAA - Agent 54 API", lifespan=lifespan)

# Parse CORS origins from .env or default to local development ports
origins_str = os.getenv("CORS_ORIGINS", "*")
origins = [origin.strip() for origin in origins_str.split(",")] if origins_str != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "astitwaa-agent",
        "database_mode": "mongodb" if is_using_mongodb() else "sqlite"
    }

from .api import router as api_router
app.include_router(api_router)
