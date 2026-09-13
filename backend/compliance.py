from sqlalchemy.orm import Session
from datetime import datetime, timezone
from . import models, engine

def run_compliance_check(db: Session, requirement_id: int, department_id: int, actual_value: float):
    req = db.query(models.Requirement).filter(models.Requirement.id == requirement_id).first()
    if not req:
        raise ValueError("Requirement not found")
        
    status = engine.determine_compliance_status(req.operator, req.threshold, actual_value)
    gap = engine.calculate_gap(req.operator, req.threshold, actual_value)
    
    explanation = f"Required {req.operator} {req.threshold} {req.unit}. Actual value is {actual_value} {req.unit}."
    
    # Check if a result already exists to update it, or create a new one.
    result = db.query(models.ComplianceResult).filter(
        models.ComplianceResult.requirement_id == requirement_id,
        models.ComplianceResult.department_id == department_id
    ).first()
    
    if result:
        result.actual_value = actual_value
        result.gap = gap
        result.status = status
        result.explanation = explanation
        result.checked_at = datetime.now(timezone.utc)
    else:
        result = models.ComplianceResult(
            requirement_id=requirement_id,
            department_id=department_id,
            actual_value=actual_value,
            gap=gap,
            status=status,
            explanation=explanation,
            checked_at=datetime.now(timezone.utc)
        )
        db.add(result)
        
    db.commit()
    db.refresh(result)
    return result
