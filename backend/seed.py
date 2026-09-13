import json
import os
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from dateutil import parser
from .database import SessionLocal, engine, Base
from . import models

def seed_db():
    print("Recreating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    data_path = os.path.join(os.path.dirname(__file__), 'data', 'demo', 'seed_data.json')
    if not os.path.exists(data_path):
        print(f"Error: Could not find {data_path}")
        return

    with open(data_path, 'r') as f:
        data = json.load(f)

    # 1. INSTITUTION
    inst_data = data.get("institution", {})
    inst = models.Institution(name=inst_data.get("name", "Demo Institution"))
    db.add(inst)
    db.commit()
    db.refresh(inst)

    # 2. DEPARTMENTS
    depts = {}
    for d in data.get("departments", []):
        dept = models.Department(name=d["name"], institution_id=inst.id)
        db.add(dept)
        db.commit()
        db.refresh(dept)
        depts[d["department_id"]] = dept

    # 3. REGULATIONS & REQUIREMENTS
    regs = {}
    for r in data.get("sample_regulations", []):
        reg = models.Regulation(title=r["title"], authority="AICTE/UGC")
        db.add(reg)
        db.commit()
        db.refresh(reg)
        
        # Version
        dt = parser.parse(r.get("effective_date", "2026-01-01T00:00:00Z"))
        ver = models.RegulationVersion(regulation_id=reg.id, version=r["version"], effective_date=dt)
        db.add(ver)
        db.commit()
        db.refresh(ver)
        
        # Requirements
        for req_data in r.get("requirements", []):
            req = models.Requirement(
                version_id=ver.id,
                title=req_data["title"],
                description=req_data.get("source_reference", ""),
                category=req_data["category"],
                metric=req_data["metric"],
                operator=req_data["operator"],
                threshold=float(req_data["threshold"]) if str(req_data["threshold"]).replace('.','',1).isdigit() else 0.0,
                unit=req_data["unit"],
                severity=req_data["severity"].upper()
            )
            db.add(req)
            db.commit()
            db.refresh(req)
            regs[req_data["requirement_id"]] = req

    # 4. COMPLIANCE GAPS & RESULTS
    # The JSON gives us `demo_gap_examples` which acts as our non-compliant / compliant results.
    for gap in data.get("demo_gap_examples", []):
        req_id = gap.get("requirement_id")
        req_obj = regs.get(req_id)
        if not req_obj:
            # Maybe it's LAB-INFRA-CHECK which isn't in requirements array, let's create it on the fly
            # Find a regulation to attach it to, just use the first one
            first_ver = db.query(models.RegulationVersion).first()
            req_obj = models.Requirement(
                version_id=first_ver.id,
                title=gap.get("title", req_id),
                description="Dynamically added from gaps",
                category="infrastructure",
                metric="status",
                operator="==",
                threshold=1.0,
                unit="status",
                severity="MEDIUM"
            )
            db.add(req_obj)
            db.commit()
            db.refresh(req_obj)
            regs[req_id] = req_obj

        dept_id_str = gap.get("department_id")
        dept_obj = depts.get(dept_id_str)
        if not dept_obj:
            # Fallback to first dept if INST-001 or missing
            dept_obj = list(depts.values())[0] if depts else None

        if dept_obj:
            res = models.ComplianceResult(
                requirement_id=req_obj.id,
                department_id=dept_obj.id,
                actual_value=gap.get("actual_value", "0.0"),
                gap=gap.get("gap", "0.0" if gap.get("status") == "COMPLIANT" else "1.0"),
                status=gap.get("status", "NON_COMPLIANT"),
                explanation=gap.get("actual_value", "") + " | " + gap.get("gap", ""),
                checked_at=datetime.now(timezone.utc)
            )
            db.add(res)
            db.commit()

    # 5. AUDIT TRAIL
    for audit in data.get("audit_trail_sample", []):
        dt = parser.parse(audit.get("timestamp", "2026-01-01T00:00:00Z"))
        event = models.AuditEvent(
            agent=audit.get("agent", "Unknown Agent"),
            action=audit.get("action", ""),
            details=f"Status: {audit.get('status')}",
            timestamp=dt
        )
        db.add(event)
    db.commit()

    print(f"Seed complete using {data_path}. DB State:")
    print(f"Departments: {db.query(models.Department).count()}")
    print(f"Regulations: {db.query(models.Regulation).count()}")
    print(f"Requirements: {db.query(models.Requirement).count()}")
    print(f"Risks: {db.query(models.ComplianceResult).filter(models.ComplianceResult.status != 'COMPLIANT').count()}")

if __name__ == "__main__":
    seed_db()
