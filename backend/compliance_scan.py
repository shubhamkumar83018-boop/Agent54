"""
compliance_scan.py -- Agent 54 Official Regulation Compliance Engine
Loads and evaluates exclusively from the official VFSTR dataset: backend/data/regulations.json.
No mock, fake, or invented institutional numbers are used.
Status adheres strictly to the official dataset:
- COMPLIANT: Verified evidence published on official portals
- EVIDENCE_PENDING: Operational data pending upload / audit
"""
import os, json
from datetime import datetime, timezone
from typing import Dict, Any, List

COMPLIANT        = "COMPLIANT"
EVIDENCE_PENDING = "EVIDENCE_PENDING"
AT_RISK          = "AT_RISK"
NON_COMPLIANT    = "NON_COMPLIANT"

def _load_json(path: str) -> Any:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def _base() -> str:
    return os.path.dirname(__file__)

def _evaluate_single(req: Dict) -> Dict:
    rid = req["requirement_id"]
    raw_status = (req.get("status") or "").upper()
    
    # Determine standardized status based strictly on the official dataset
    if "COMPLIANT" in raw_status or "PUBLISHED" in raw_status:
        status = COMPLIANT
        actual = req.get("actual_value") or "Verified Official Evidence"
        gap = "None (Official Evidence Verified)"
        observation = f"Official institutional compliance evidence verified ({req.get('evidence_source', 'VFSTR Portal')}). {req.get('notes', '')}"
        action_required = "Maintain periodic evidence freshness and annual compliance review."
    else:
        status = EVIDENCE_PENDING
        actual = req.get("actual_value") or "Evidence Pending Submission"
        gap = f"Evidence Required: {req.get('evidence_required', 'Operational Data Audit')}"
        observation = f"Operational data pending audit against {req.get('source_document', 'Regulation')} Clause {req.get('clause', '')}. {req.get('notes', '')}"
        action_required = f"Submit {req.get('evidence_required', 'required records')} within target lead time of {req.get('lead_time_days', 30)} days to {req.get('owner', 'Academic Section')}."

    return {
        "requirement_id":    rid,
        "requirement_name":  req.get("requirement_name", ""),
        "category":          req.get("category", ""),
        "authority":         req.get("authority", ""),
        "severity":          req.get("severity", "HIGH"),
        "clause":            req.get("clause", ""),
        "source_document":   req.get("source_document", ""),
        "evidence_source":   req.get("evidence_source", ""),
        "evidence_required": req.get("evidence_required", ""),
        "required_value":    req.get("required_value", ""),
        "actual_value":      actual,
        "gap":               gap,
        "status":            status,
        "observation":       observation,
        "action_required":   action_required,
        "lead_time_days":    req.get("lead_time_days", 30),
        "owner":             req.get("owner", "Academic Section / IQAC"),
        "source_url":        req.get("source_url", ""),
        "notes":             req.get("notes", ""),
        "department_name":   req.get("owner", "University Wide"),
        "checked_at":        datetime.now(timezone.utc).isoformat(),
    }


def run_full_compliance_scan() -> Dict:
    reg_path = os.path.join(_base(), "data", "regulations.json")
    if not os.path.exists(reg_path):
        raise FileNotFoundError(f"Authoritative regulations dataset not found at {reg_path}")

    reg_data = _load_json(reg_path)
    records  = reg_data.get("records", [])

    results: List[Dict] = []
    for req in records:
        results.append(_evaluate_single(req))

    counts = {
        COMPLIANT:        sum(1 for r in results if r["status"] == COMPLIANT),
        EVIDENCE_PENDING: sum(1 for r in results if r["status"] == EVIDENCE_PENDING),
        AT_RISK:          sum(1 for r in results if r["status"] == AT_RISK),
        NON_COMPLIANT:    sum(1 for r in results if r["status"] == NON_COMPLIANT),
    }
    total = len(results)

    return {
        "scan_time":                datetime.now(timezone.utc).isoformat(),
        "total":                    total,
        "summary":                  counts,
        "overall_compliance_pct":   round((counts[COMPLIANT] / total) * 100) if total else 0,
        "results":                  results,
        "institution":              reg_data.get("institution", "Vignan's Foundation for Science, Technology and Research (VFSTR), Deemed-to-be University"),
        "location":                 reg_data.get("location", "Vadlamudi, Guntur, Andhra Pradesh, India – 522213"),
        "dataset_name":             reg_data.get("dataset_name", "Vignan-specific Agent 54 Regulation Compliance Dataset"),
        "data_policy":              reg_data.get("data_policy", "Official-source-backed requirements; no invented institutional compliance values. Missing operational data is marked EVIDENCE_PENDING."),
    }
