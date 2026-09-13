from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load backend/.env file
load_dotenv()

from .database import engine, Base
from . import models
from contextlib import asynccontextmanager
from .seed import seed_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    Base.metadata.create_all(bind=engine)
    
    # Check if we need to seed the db (if no departments exist)
    from .database import SessionLocal
    db = SessionLocal()
    if db.query(models.Department).first() is None:
        print("Empty database detected. Seeding data...")
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
    return {"status": "ok", "service": "astitwaa-agent"}

from .api import router as api_router
app.include_router(api_router)

