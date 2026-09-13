from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime, timezone
from .database import get_db
from . import models, agents

router = APIRouter(prefix="/api")

class ComplianceRunRequest(BaseModel):
    requirement_id: int
    department_id: int
    actual_value: str

class SimulationRequest(BaseModel):
    requirement_id: int
    simulated_value: float

class InstitutionalSimulationRequest(BaseModel):
    facultyCount: int
    studentEnrollment: int
    budgetCut: int
    infraExpansion: int
    baseScore: int

@router.get("/dashboard/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    from .compliance_scan import run_full_compliance_scan
    scan = run_full_compliance_scan()
    results = scan.get("results", [])
    
    total_regulations = len(set(r.get("source_document", r.get("authority", "")) for r in results)) or 6
    active_requirements = len(results)
    departments = 4
    
    compliant = scan.get("summary", {}).get("COMPLIANT", 0)
    at_risk = scan.get("summary", {}).get("AT_RISK", 0)
    non_compliant = scan.get("summary", {}).get("NON_COMPLIANT", 0)
    
    overall_compliance = scan.get("overall_compliance_pct", 0)
    total_open_risks = non_compliant + at_risk

    # Compute category stats from live scan
    cat_stats = {}
    for r in results:
        cat = r.get("category") or "General"
        if cat not in cat_stats:
            cat_stats[cat] = {"total": 0, "compliant": 0}
        cat_stats[cat]["total"] += 1
        if r.get("status") == "COMPLIANT":
            cat_stats[cat]["compliant"] += 1

    categories = []
    for cat, stats in cat_stats.items():
        if stats["total"] > 0:
            val = int(round((stats["compliant"] / stats["total"]) * 100))
            categories.append({"name": cat, "val": val})
    categories.sort(key=lambda x: x["val"], reverse=True)

    riskData = []
    if non_compliant > 0:
        riskData.append({"name": "Critical", "value": non_compliant, "color": "#ef4444"})
    if at_risk > 0:
        riskData.append({"name": "Medium", "value": at_risk, "color": "#f97316"})

    return {
        "total_regulations": total_regulations,
        "active_requirements": active_requirements,
        "departments": departments,
        "last_scan_at": scan.get("scan_time"),
        "overall_compliance": overall_compliance,
        "total_open_risks": total_open_risks,
        "compliant_count": compliant,
        "non_compliant_count": non_compliant,
        "at_risk_count": at_risk,
        "categories": categories,
        "riskData": riskData,
        "institution": scan.get("institution")
    }

@router.get("/requirements")
def get_requirements(db: Session = Depends(get_db)):
    from .compliance_scan import _load_json, _base
    reg_path = os.path.join(_base(), "data", "regulations.json")
    if os.path.exists(reg_path):
        data = _load_json(reg_path)
        return data.get("records", [])
    return db.query(models.Requirement).all()

@router.get("/compliance/results")
def get_compliance_results(db: Session = Depends(get_db)):
    from .compliance_scan import run_full_compliance_scan
    scan = run_full_compliance_scan()
    results = scan.get("results", [])
    output = []
    for idx, r in enumerate(results, start=1):
        output.append({
            "id": idx,
            "requirement_id": r.get("requirement_id"),
            "department_id": 1,
            "requirement_title": r.get("requirement_name"),
            "department_name": r.get("department", "University Wide"),
            "authority": r.get("authority", "VFSTR"),
            "category": r.get("category", "General"),
            "severity": r.get("severity", "MEDIUM"),
            "actual_value": r.get("actual_value") or "Verified",
            "required_value": r.get("required_value") or "Standard",
            "gap": r.get("gap") or "0",
            "status": r.get("status"),
            "observation": r.get("observation") or r.get("issue") or "Compliance verified.",
            "action_required": r.get("action_required") or "Maintain standard compliance monitoring.",
            "explanation": f"{r.get('observation', '')} | {r.get('action_required', '')}",
            "owner": r.get("owner", "Academic Section / IQAC"),
            "lead_time_days": r.get("lead_time_days", 30),
            "source_document": r.get("source_document", "VFSTR Regulations"),
            "clause": r.get("clause", ""),
            "checked_at": r.get("checked_at")
        })
    return output

@router.post("/compliance/run")
def run_compliance_check(req: ComplianceRunRequest, db: Session = Depends(get_db)):
    orchestrator = agents.OrchestratorAgent(db)
    return orchestrator.trigger_compliance_check(req.requirement_id, req.department_id, req.actual_value)

@router.post("/simulation")
def run_simulation(req: SimulationRequest, db: Session = Depends(get_db)):
    orchestrator = agents.OrchestratorAgent(db)
    return orchestrator.trigger_simulation(req.requirement_id, req.simulated_value)

@router.post("/simulation/predict")
def predict_simulation(req: InstitutionalSimulationRequest, db: Session = Depends(get_db)):
    orchestrator = agents.OrchestratorAgent(db)
    return orchestrator.trigger_institutional_prediction(req)

@router.get("/audit")
def get_audit_trail(db: Any = Depends(get_db)):
    events = db.query(models.AgentRun).order_by(models.AgentRun.timestamp.desc()).limit(50).all()
    return events

@router.get("/db/status")
def get_db_status():
    """Return database status, active engine, MongoDB Atlas connectivity and collection statistics."""
    from .database import is_using_mongodb, DATABASE_TYPE
    from .mongo_db import test_mongo_connection, is_mongo_configured, get_collection_stats
    
    using_mongo = is_using_mongodb()
    mongo_test = test_mongo_connection()
    
    stats = {}
    if using_mongo and mongo_test.get("connected"):
        try:
            stats = get_collection_stats()
        except Exception:
            pass
            
    return {
        "active_engine": "mongodb" if using_mongo else "sqlite",
        "configured_database_type": DATABASE_TYPE,
        "is_mongo_configured": is_mongo_configured(),
        "mongodb_connection": mongo_test,
        "collection_stats": stats
    }

@router.post("/db/seed")
def trigger_seed():
    """Trigger seeding of default data into the active database (MongoDB Atlas or SQLite)."""
    from .database import is_using_mongodb
    if is_using_mongodb():
        from .mongo_db import seed_mongo_from_files
        stats = seed_mongo_from_files(drop_existing=True)
        return {"status": "ok", "message": "MongoDB Atlas seeded successfully", "stats": stats}
    else:
        from .seed import seed_db
        seed_db()
        return {"status": "ok", "message": "SQLite database seeded successfully"}

@router.get("/regulations/dataset")
def get_regulations_dataset():
    """Retrieve full official regulations dataset (from regulations.json or MongoDB Atlas)."""
    import os
    import json
    from .database import is_using_mongodb
    if is_using_mongodb():
        from .mongo_db import get_mongo_db
        try:
            db = get_mongo_db()
            records = list(db.vignan_regulations.find({}, {"_id": 0}))
            if records:
                return {
                    "source": "mongodb_atlas",
                    "count": len(records),
                    "records": records
                }
        except Exception:
            pass
            
    # Fallback to local regulations.json file
    data_path = os.path.join(os.path.dirname(__file__), "data", "regulations.json")
    if os.path.exists(data_path):
        with open(data_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return {
                "source": "local_file",
                "count": len(data.get("records", [])),
                "dataset_name": data.get("dataset_name"),
                "institution": data.get("institution"),
                "records": data.get("records", [])
            }
    return {"source": "none", "count": 0, "records": []}

class RemediationUpdateRequest(BaseModel):
    owner: Optional[str] = None
    action: Optional[str] = None
    lead_time_days: Optional[int] = None
    status: Optional[str] = None

class RegulatoryAmendmentRequest(BaseModel):
    title: str
    summary: str
    impacted_clauses: str

class SyncRequest(BaseModel):
    agent_id: Optional[str] = None

@router.get("/integrations/status")
def get_integrations_status():
    """Returns real-time mesh connectivity for Inbound (Agents 1, 3, 53, 58) and Outbound (Agents 9, 57, 71)."""
    from .integrations import integration_hub
    return integration_hub.get_status()

@router.post("/integrations/sync")
def sync_integrations(req: Optional[SyncRequest] = None):
    """Triggers real-time sync with connected agents."""
    from .integrations import integration_hub
    agent_id = req.agent_id if req else None
    return integration_hub.trigger_sync(agent_id)

@router.get("/readiness/report")
def get_readiness_report(db: Any = Depends(get_db)):
    """Compiles Pre-Inspection Readiness Dossier across AICTE, UGC, NBA, and NAAC criteria."""
    orchestrator = agents.OrchestratorAgent(db)
    return orchestrator.trigger_readiness_report()

@router.post("/compliance/sweep")
def trigger_compliance_sweep(db: Any = Depends(get_db)):
    """Executes automated campus-wide compliance check schedule."""
    orchestrator = agents.OrchestratorAgent(db)
    return orchestrator.trigger_scheduled_sweep()

@router.post("/regulations/amend")
def amend_regulation(req: RegulatoryAmendmentRequest, db: Any = Depends(get_db)):
    """Simulates/detects statutory amendment, marks affected requirements, and re-evaluates."""
    orchestrator = agents.OrchestratorAgent(db)
    return orchestrator.trigger_regulatory_amendment(req.title, req.dict())

@router.get("/gaps/prioritized")
def get_prioritized_gaps(db: Any = Depends(get_db)):
    """Returns quantified gaps prioritized by regulatory severity and lead time to fix."""
    orchestrator = agents.OrchestratorAgent(db)
    report = orchestrator.trigger_readiness_report()
    return report.get("prioritized_lead_time_gaps", [])

@router.put("/remediation/{result_id}")
def update_remediation(result_id: int, req: RemediationUpdateRequest, db: Any = Depends(get_db)):
    """Assigns remediation owner, updates target lead time, and tracks closure."""
    plan = db.query(models.RemediationPlan).filter(models.RemediationPlan.result_id == result_id).first()
    if not plan:
        plan = models.RemediationPlan(
            result_id=result_id,
            action=req.action or "Remediation initiated",
            owner=req.owner or "Unassigned",
            lead_time_days=req.lead_time_days or 30,
            status=req.status or "IN_PROGRESS"
        )
        db.add(plan)
    else:
        if req.owner: plan.owner = req.owner
        if req.action: plan.action = req.action
        if req.lead_time_days is not None: plan.lead_time_days = req.lead_time_days
        if req.status: plan.status = req.status
    db.commit()
    db.refresh(plan)
    return plan

@router.get("/compliance/full-scan")
def get_full_compliance_scan():
    """
    Run Agent 54 full regulation scan:
    Evaluates all 26 regulations from regulations.json against live institutional data.
    Returns COMPLIANT / AT_RISK / NON_COMPLIANT / EVIDENCE_PENDING for each requirement.
    """
    try:
        from .compliance_scan import run_full_compliance_scan
        return run_full_compliance_scan()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan engine error: {str(e)}")
