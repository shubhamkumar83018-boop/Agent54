import os
import time
import json
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)
else:
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

    # Load solely from official regulations.json
    base_dir = os.path.dirname(__file__)
    reg_path = os.path.join(base_dir, "data", "regulations.json")

    if not os.path.exists(reg_path):
        print(f"Error: Could not find {reg_path}")
        return get_collection_stats(db)

    with open(reg_path, "r", encoding="utf-8") as f:
        reg_data = json.load(f)

    # 1. Institution
    inst_id = 1
    inst_name = reg_data.get("institution", "Vignan's Foundation for Science, Technology and Research (VFSTR)")
    inst_doc = {"id": inst_id, "name": inst_name}
    db.institutions.update_one({"id": inst_id}, {"$set": inst_doc}, upsert=True)

    # 2. Departments
    dept_names = [
        "Office of Academic Affairs (AAA)",
        "Internal Quality Assurance Cell (IQAC)",
        "Computer Science & Engineering (CSE)",
        "Electronics & Communication Engineering (ECE)",
        "NTR Central Library",
        "Examination Section / CoE",
        "Student Grievance & Welfare Cell",
        "Anti-Ragging Committee",
    ]
    depts_map = {}
    for idx, name in enumerate(dept_names, start=1):
        doc = {"id": idx, "name": name, "institution_id": inst_id}
        db.departments.update_one({"id": idx}, {"$set": doc}, upsert=True)
        depts_map[name] = idx

    # 3. Regulations & Requirements
    records = reg_data.get("records", [])
    doc_groups = {}
    for r in records:
        doc_title = r.get("source_document", "VFSTR Regulations")
        if doc_title not in doc_groups:
            doc_groups[doc_title] = []
        doc_groups[doc_title].append(r)

    reg_counter = 1
    req_counter = 1
    res_counter = 1

    for doc_title, req_list in doc_groups.items():
        authority = req_list[0].get("authority", "VFSTR")
        r_doc = {"id": reg_counter, "title": doc_title, "authority": authority}
        db.regulations.update_one({"id": reg_counter}, {"$set": r_doc}, upsert=True)

        v_doc = {
            "id": reg_counter,
            "regulation_id": reg_counter,
            "version": "2026",
            "effective_date": datetime.now(timezone.utc)
        }
        db.regulation_versions.update_one({"id": reg_counter}, {"$set": v_doc}, upsert=True)

        for r in req_list:
            raw_status = (r.get("status") or "").upper()
            is_compliant = "COMPLIANT" in raw_status or "PUBLISHED" in raw_status
            status = "COMPLIANT" if is_compliant else "EVIDENCE_PENDING"

            req_item = {
                "id": req_counter,
                "version_id": reg_counter,
                "title": r.get("requirement_name", ""),
                "description": f"{r.get('source_document', '')} Clause {r.get('clause', '')}",
                "category": r.get("category", "General"),
                "metric": r.get("condition_operator", "=="),
                "operator": r.get("condition_operator", "=="),
                "threshold": 0.0,
                "unit": r.get("required_value", ""),
                "severity": r.get("severity", "HIGH").upper()
            }
            db.requirements.update_one({"id": req_counter}, {"$set": req_item}, upsert=True)

            # Map department
            owner = r.get("owner", "")
            target_dept_id = 1
            for d_name, d_id in depts_map.items():
                if any(w.lower() in owner.lower() for w in d_name.split()):
                    target_dept_id = d_id
                    break

            res_doc = {
                "id": res_counter,
                "requirement_id": req_counter,
                "department_id": target_dept_id,
                "actual_value": r.get("actual_value") or ("Verified on Website" if is_compliant else "Evidence Pending"),
                "gap": "None" if is_compliant else f"Required: {r.get('evidence_required', 'Records')}",
                "status": status,
                "explanation": f"{r.get('required_value', '')} | {r.get('evidence_required', '')}",
                "checked_at": datetime.now(timezone.utc)
            }
            db.compliance_results.update_one({"id": res_counter}, {"$set": res_doc}, upsert=True)

            req_counter += 1
            res_counter += 1

        reg_counter += 1

    # 4. Audit Events
    audit_events = [
        ("Regulation Agent", "Ingested official VFSTR R26, AICTE, UGC, NBA & NAAC regulation records", "Success"),
        ("Evidence Agent", "Verified published institutional committee orders and library holdings on official portal", "Success"),
        ("Compliance Agent", "Evaluated all 26 statutory requirements against official regulatory clauses", "Success"),
        ("Risk Agent", "Generated statutory lead-time risk index and prioritized evidence collection items", "Success"),
        ("Orchestrator Agent", "Initialized live continuous compliance monitoring pipeline for Agent 54", "Success"),
    ]
    for idx, (agent, action, stat) in enumerate(audit_events, start=1):
        a_doc = {
            "id": idx,
            "agent": agent,
            "action": action,
            "details": f"Status: {stat} (Verified from official VFSTR dataset)",
            "timestamp": datetime.now(timezone.utc)
        }
        db.audit_events.update_one({"id": idx}, {"$set": a_doc}, upsert=True)

    # 5. Dedicated vignan_regulations collection
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
