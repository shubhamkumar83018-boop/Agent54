from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
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
    total_regulations = db.query(models.Regulation).count()
    active_requirements = db.query(models.Requirement).count()
    departments = db.query(models.Department).count()
    
    total_checks = db.query(models.ComplianceResult).count()
    compliant = db.query(models.ComplianceResult).filter(models.ComplianceResult.status == "COMPLIANT").count()
    non_compliant = db.query(models.ComplianceResult).filter(models.ComplianceResult.status == "NON_COMPLIANT").count()
    at_risk = db.query(models.ComplianceResult).filter(models.ComplianceResult.status == "AT_RISK").count()
    
    # Calculate deterministic overall compliance
    overall_compliance = 0
    if total_checks > 0:
        overall_compliance = int(round((compliant / total_checks) * 100))
        
    # Get last scan time from the latest agent run or result
    last_scan = db.query(models.ComplianceResult).order_by(models.ComplianceResult.checked_at.desc()).first()
    last_scan_at = last_scan.checked_at.isoformat() if last_scan else None

    # Total open risks are any non-compliant or at-risk findings
    total_open_risks = non_compliant + at_risk

    # Calculate real original category compliance instead of defaults
    category_stats = {}
    all_results = db.query(models.ComplianceResult).all()
    for r in all_results:
        req = db.query(models.Requirement).filter(models.Requirement.id == r.requirement_id).first()
        if req:
            cat = req.category or "General"
            if cat not in category_stats:
                category_stats[cat] = {"total": 0, "compliant": 0}
            category_stats[cat]["total"] += 1
            if r.status == "COMPLIANT":
                category_stats[cat]["compliant"] += 1
                
    categories = []
    for cat, stats in category_stats.items():
        if stats["total"] > 0:
            val = int(round((stats["compliant"] / stats["total"]) * 100))
            categories.append({"name": cat.replace("_", " ").title(), "val": val})

    riskData = []
    if non_compliant > 0:
        riskData.append({"name": "Critical", "value": non_compliant, "color": "#ef4444"})
    if at_risk > 0:
        riskData.append({"name": "Medium", "value": at_risk, "color": "#f97316"})

    return {
        "total_regulations": total_regulations,
        "active_requirements": active_requirements,
        "departments": departments,
        "last_scan_at": last_scan_at,
        "overall_compliance": overall_compliance,
        "total_open_risks": total_open_risks,
        "compliant_count": compliant,
        "non_compliant_count": non_compliant,
        "at_risk_count": at_risk,
        "categories": categories,
        "riskData": riskData
    }

@router.get("/requirements")
def get_requirements(db: Session = Depends(get_db)):
    reqs = db.query(models.Requirement).all()
    return reqs

@router.get("/compliance/results")
def get_compliance_results(db: Session = Depends(get_db)):
    results = db.query(models.ComplianceResult).all()
    output = []
    for r in results:
        req = db.query(models.Requirement).filter(models.Requirement.id == r.requirement_id).first()
        dept = db.query(models.Department).filter(models.Department.id == r.department_id).first()
        output.append({
            "id": r.id,
            "requirement_id": r.requirement_id,
            "department_id": r.department_id,
            "requirement_title": req.title if req else f"Req #{r.requirement_id}",
            "department_name": dept.name if dept else f"Dept #{r.department_id}",
            "actual_value": r.actual_value,
            "gap": r.gap,
            "status": r.status,
            "explanation": r.explanation,
            "checked_at": r.checked_at
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
def get_audit_trail(db: Session = Depends(get_db)):
    events = db.query(models.AgentRun).order_by(models.AgentRun.timestamp.desc()).limit(50).all()
    return events
