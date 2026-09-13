"""
MongoDB Atlas Connection & Verification Tool
Run via: python -m backend.test_mongo
"""
import sys
import os
import time
from dotenv import load_dotenv

load_dotenv()

from .mongo_db import (
    get_mongo_uri,
    get_mongo_db_name,
    is_mongo_configured,
    test_mongo_connection,
    get_collection_stats,
    seed_mongo_from_files,
    init_mongo_indexes
)

def print_header(title):
    print("\n" + "=" * 65)
    print(f"  {title}")
    print("=" * 65)

def main():
    print_header("ASTITWAA AGENT 54 — MONGODB ATLAS VERIFICATION")
    
    uri = get_mongo_uri()
    db_name = get_mongo_db_name()
    db_type = os.getenv("DATABASE_TYPE", "mongodb")
    
    print(f"DATABASE_TYPE in .env:  {db_type}")
    print(f"Database Name:          {db_name}")
    
    if not uri:
        print("\n[!] MONGODB_URI is not set in backend/.env.")
        print("    Please add your MongoDB Atlas connection string:")
        print("    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority")
        return

    # Mask password for display
    masked_uri = uri
    if "@" in uri and "://" in uri:
        prefix, rest = uri.split("://", 1)
        creds, host = rest.split("@", 1)
        if ":" in creds:
            user = creds.split(":", 1)[0]
            masked_uri = f"{prefix}://{user}:******@{host}"
    print(f"Target MongoDB URI:     {masked_uri}")

    if not is_mongo_configured():
        print("\n[!] Notice: Your MONGODB_URI contains placeholder values (<username> / <password>).")
        print("    Please open backend/.env and replace them with your actual Atlas credentials.")
        print("    The application is currently running safely using the local SQLite fallback.")
        return

    print("\nTesting connection to MongoDB Atlas...")
    result = test_mongo_connection()

    if result.get("connected"):
        print("\n[✓] SUCCESS: Connected to MongoDB Atlas!")
        print(f"    Database:   {result.get('database')}")
        print(f"    Round-trip: {result.get('latency_ms')} ms")
        
        # Check collections
        stats = get_collection_stats()
        print("\nCollection Statistics:")
        for col_name, count in stats.items():
            print(f"  • {col_name:22}: {count:5} documents")
            
        total_docs = sum(stats.values())
        if total_docs == 0:
            print("\n[i] Collections are currently empty. Seeding initial dataset into MongoDB Atlas...")
            seed_stats = seed_mongo_from_files(drop_existing=False)
            print("[✓] Seed complete:")
            for col_name, count in seed_stats.items():
                print(f"  • {col_name:22}: {count:5} documents")
        else:
            print("\n[✓] Database has existing data. Ready for production.")
            
    else:
        print("\n[✗] FAILED: Could not connect to MongoDB Atlas.")
        print(f"    Error: {result.get('error') or result.get('message')}")
        print("\nChecklist for MongoDB Atlas:")
        print("  1. Verify the username and password in MONGODB_URI are correct.")
        print("  2. In MongoDB Atlas, go to 'Network Access' and ensure your IP is allowed (or 0.0.0.0/0 for dev).")
        print("  3. Verify that the database user has Read & Write privileges.")

if __name__ == "__main__":
    main()
