import os
import time
import json
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

_mongo_client = None

def get_mongo_uri() -> str:
    """Resolve the MongoDB Atlas connection URI."""
    uri = os.getenv("MONGODB_URI") or os.getenv("MONGODB_URL")
    if not uri:
        db_url = os.getenv("DATABASE_URL", "")
        if db_url.startswith(("mongodb://", "mongodb+srv://")):
            uri = db_url
    return (uri or "").strip()

def get_mongo_db_name() -> str:
    """Resolve the MongoDB database name."""
    return os.getenv("MONGODB_DB_NAME", "astitwaa").strip()

def is_mongo_configured() -> bool:
    """Return True if a valid MongoDB Atlas connection string is provided without placeholder text."""
    uri = get_mongo_uri()
    if not uri:
        return False
    if not (uri.startswith("mongodb://") or uri.startswith("mongodb+srv://")):
        return False
    # Check if placeholder credentials remain
    if "<username>" in uri or "<password>" in uri or "your_username" in uri:
        return False
    return True

def get_mongo_client():
    """Return a singleton MongoClient configured with resilient timeouts for MongoDB Atlas."""
    global _mongo_client
    if _mongo_client is not None:
        return _mongo_client

    uri = get_mongo_uri()
    if not uri:
        raise ValueError("MongoDB URI is not configured in backend/.env")

    import pymongo
    _mongo_client = pymongo.MongoClient(
        uri,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
        socketTimeoutMS=10000,
        retryWrites=True
    )
    return _mongo_client

def get_mongo_db():
    """Return the PyMongo database instance."""
    client = get_mongo_client()
    db_name = get_mongo_db_name()
    return client[db_name]

def test_mongo_connection() -> Dict[str, Any]:
    """Test ping connection to MongoDB Atlas and measure round-trip latency."""
    if not is_mongo_configured():
        return {
            "connected": False,
            "status": "unconfigured",
            "message": "MongoDB URI contains default placeholders. Please provide your MongoDB Atlas connection string in backend/.env."
        }
    try:
        client = get_mongo_client()
        start = time.time()
        client.admin.command('ping')
        latency_ms = round((time.time() - start) * 1000, 2)
        db = get_mongo_db()
        return {
            "connected": True,
            "status": "ready",
            "database": db.name,
            "latency_ms": latency_ms,
            "message": f"Successfully connected to MongoDB Atlas database '{db.name}' ({latency_ms}ms)"
        }
    except Exception as e:
        return {
            "connected": False,
            "status": "error",
            "error": str(e),
            "message": f"Failed to connect to MongoDB Atlas: {str(e)}"
        }

def init_mongo_indexes(db=None):
    """Ensure recommended indexes exist across all collections in MongoDB Atlas."""
    if db is None:
        db = get_mongo_db()

    import pymongo

    # Departments: unique id and indexed name
    db.departments.create_index([("id", pymongo.ASCENDING)], unique=True, sparse=True)
    db.departments.create_index([("name", pymongo.ASCENDING)])

    # Regulations: unique id and indexed authority/title
    db.regulations.create_index([("id", pymongo.ASCENDING)], unique=True, sparse=True)
    db.regulations.create_index([("authority", pymongo.ASCENDING)])

    # Requirements: indexed on version, category, and severity
    db.requirements.create_index([("id", pymongo.ASCENDING)], unique=True, sparse=True)
    db.requirements.create_index([("category", pymongo.ASCENDING)])
    db.requirements.create_index([("severity", pymongo.ASCENDING)])

    # Compliance Results: compound index on requirement and department
    db.compliance_results.create_index([("id", pymongo.ASCENDING)], unique=True, sparse=True)
    db.compliance_results.create_index([("requirement_id", pymongo.ASCENDING), ("department_id", pymongo.ASCENDING)])
    db.compliance_results.create_index([("status", pymongo.ASCENDING)])

    # Risk Assessments and Remediation Plans
    db.risk_assessments.create_index([("result_id", pymongo.ASCENDING)])
    db.remediation_plans.create_index([("result_id", pymongo.ASCENDING)])

    # Audit & Agent Runs: reverse timestamp index for fast timeline lookups
    db.audit_events.create_index([("timestamp", pymongo.DESCENDING)])
    db.agent_runs.create_index([("timestamp", pymongo.DESCENDING)])

    print("MongoDB Atlas indexes initialized successfully.")

def seed_mongo_from_files(drop_existing: bool = False) -> Dict[str, Any]:
    """Seed MongoDB Atlas database with institutional demo records and regulations dataset."""
    db = get_mongo_db()

    if drop_existing:
        collections = [
            "institutions", "departments", "regulations", "regulation_versions",
            "requirements", "compliance_results", "risk_assessments",
            "remediation_plans", "audit_events", "agent_runs"
        ]
        for col in collections:
            db[col].drop()
        init_mongo_indexes(db)

    # 1. Load seed_data.json
    base_dir = os.path.dirname(__file__)
    seed_path = os.path.join(base_dir, "data", "demo", "seed_data.json")
    reg_path = os.path.join(base_dir, "data", "regulations.json")

    inst_id = 1
    depts_map = {}
    regs_map = {}
    reqs_map = {}

    if os.path.exists(seed_path):
        with open(seed_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Institution
        inst_data = data.get("institution", {})
        inst_doc = {"id": inst_id, "name": inst_data.get("name", "Demo Institution")}
        db.institutions.update_one({"id": inst_id}, {"$set": inst_doc}, upsert=True)

        # Departments
        for idx, d in enumerate(data.get("departments", []), start=1):
            doc = {"id": idx, "name": d["name"], "institution_id": inst_id}
            db.departments.update_one({"id": idx}, {"$set": doc}, upsert=True)
            depts_map[d["department_id"]] = idx

        # Regulations & Requirements
        reg_counter = 1
        req_counter = 1
        for r in data.get("sample_regulations", []):
            r_doc = {"id": reg_counter, "title": r["title"], "authority": "AICTE/UGC"}
            db.regulations.update_one({"id": reg_counter}, {"$set": r_doc}, upsert=True)

            v_doc = {
                "id": reg_counter,
                "regulation_id": reg_counter,
                "version": r.get("version", "2024-25"),
                "effective_date": r.get("effective_date", "2026-01-01T00:00:00Z")
            }
            db.regulation_versions.update_one({"id": reg_counter}, {"$set": v_doc}, upsert=True)

            for req_data in r.get("requirements", []):
                req_thresh = req_data.get("threshold", 0)
                try:
                    thresh_val = float(req_thresh)
                except Exception:
                    thresh_val = 0.0

                req_item = {
                    "id": req_counter,
                    "version_id": reg_counter,
                    "title": req_data.get("title", ""),
                    "description": req_data.get("source_reference", ""),
                    "category": req_data.get("category", ""),
                    "metric": req_data.get("metric", ""),
                    "operator": req_data.get("operator", ">="),
                    "threshold": thresh_val,
                    "unit": req_data.get("unit", ""),
                    "severity": req_data.get("severity", "MEDIUM").upper()
                }
                db.requirements.update_one({"id": req_counter}, {"$set": req_item}, upsert=True)
                reqs_map[req_data.get("requirement_id")] = req_counter
                req_counter += 1

            reg_counter += 1

        # Compliance Results
        res_counter = 1
        for gap in data.get("demo_gap_examples", []):
            req_ref = gap.get("requirement_id")
            req_id_val = reqs_map.get(req_ref, 1)
            dept_ref = gap.get("department_id")
            dept_id_val = depts_map.get(dept_ref, 1)

            res_doc = {
                "id": res_counter,
                "requirement_id": req_id_val,
                "department_id": dept_id_val,
                "actual_value": str(gap.get("actual_value", "0.0")),
                "gap": str(gap.get("gap", "0.0")),
                "status": gap.get("status", "NON_COMPLIANT"),
                "explanation": f"{gap.get('actual_value', '')} | {gap.get('gap', '')}",
                "checked_at": datetime.now(timezone.utc)
            }
            db.compliance_results.update_one({"id": res_counter}, {"$set": res_doc}, upsert=True)
            res_counter += 1

        # Audit Trail
        for idx, audit in enumerate(data.get("audit_trail_sample", []), start=1):
            a_doc = {
                "id": idx,
                "agent": audit.get("agent", "Unknown Agent"),
                "action": audit.get("action", ""),
                "details": f"Status: {audit.get('status')}",
                "timestamp": datetime.now(timezone.utc)
            }
            db.audit_events.update_one({"id": idx}, {"$set": a_doc}, upsert=True)

    # 2. Also populate regulations dataset if regulations.json exists
    if os.path.exists(reg_path):
        with open(reg_path, "r", encoding="utf-8") as f:
            reg_dataset = json.load(f)
            records = reg_dataset.get("records", [])
            # Store full regulations dataset in its own dedicated collection for instant querying
            for r in records:
                db.vignan_regulations.update_one(
                    {"requirement_id": r.get("requirement_id")},
                    {"$set": r},
                    upsert=True
                )

    return get_collection_stats(db)

def get_collection_stats(db=None) -> Dict[str, int]:
    """Return document count for each collection."""
    if db is None:
        db = get_mongo_db()
    return {
        "institutions": db.institutions.count_documents({}),
        "departments": db.departments.count_documents({}),
        "regulations": db.regulations.count_documents({}),
        "requirements": db.requirements.count_documents({}),
        "compliance_results": db.compliance_results.count_documents({}),
        "risk_assessments": db.risk_assessments.count_documents({}),
        "remediation_plans": db.remediation_plans.count_documents({}),
        "audit_events": db.audit_events.count_documents({}),
        "agent_runs": db.agent_runs.count_documents({}),
        "vignan_regulations": db.vignan_regulations.count_documents({})
    }
