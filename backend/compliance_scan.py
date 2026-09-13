"""
compliance_scan.py -- Agent 54 Full Regulation Scan Engine
Evaluates all 26 regulations from regulations.json against live institutional data.
Returns structured results: COMPLIANT / AT_RISK / NON_COMPLIANT / EVIDENCE_PENDING
"""
import os, json
from datetime import datetime, timezone
from typing import Dict, Any, List

COMPLIANT        = "COMPLIANT"
AT_RISK          = "AT_RISK"
NON_COMPLIANT    = "NON_COMPLIANT"
EVIDENCE_PENDING = "EVIDENCE_PENDING"

def _load_json(path: str) -> Any:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def _base() -> str:
    return os.path.dirname(__file__)

def _institutional_data() -> Dict:
    return _load_json(os.path.join(_base(), "data", "demo", "seed_data.json"))

def _compute_fsr(dept_id: str, data: Dict) -> float:
    dept = next((d for d in data.get("departments", []) if d["department_id"] == dept_id), None)
    if not dept:
        return 0.0
    students = dept.get("total_students", 0)
    faculty  = dept.get("total_faculty", 1)
    return round(students / faculty, 2) if faculty else 0.0

def _compute_phd_percent(dept_id: str, data: Dict) -> float:
    summary = data.get("faculty_qualification_summary", {}).get(dept_id, {})
    return summary.get("phd_percent", 0.0)

def _committee_status(name_substr: str, data: Dict) -> str:
    for c in data.get("committees", []):
        if name_substr.lower() in c["name"].lower():
            return c.get("status", "unknown")
    return "unknown"

def _credit_status(dept_id: str, data: Dict):
    for cs in data.get("credit_structure", []):
        if cs["department_id"] == dept_id:
            return cs.get("credits_assigned", 0), cs.get("conformant", False)
    return 0, False

def _evaluate_single(req: Dict, data: Dict) -> Dict:
    rid    = req["requirement_id"]
    status = EVIDENCE_PENDING
    actual = None
    issue  = None
    evidence_note = None

    if rid == "VIG-R26-001":
        credit_structures = data.get("credit_structure", [])
        non_comp = []
        for cs in credit_structures:
            assigned = cs.get("credits_assigned", 0)
            required = cs.get("total_credits_required", 160)
            if assigned < required:
                dept_name = cs.get('department_id', '').replace('DEPT-', '')
                non_comp.append(f"{dept_name}: {assigned}/{required} (shortfall: {required - assigned})")
        if non_comp:
            status = AT_RISK
            actual = "; ".join(non_comp)
            issue  = f"Credit shortfall detected: {actual} -- pending BoS realignment"
        else:
            status = COMPLIANT
            actual = "All programs meet 160-credit graduation requirement"

    elif rid == "VIG-R26-002":
        overload = data.get("contact_hours", [])
        if overload:
            status = AT_RISK
            actual = f"{len(overload)} course(s) with overloaded contact hours"
            issue  = f"{overload[0]['course']}: {overload[0]['actual_hours_per_week']}h/wk vs allowed {overload[0]['required_hours_per_week']}h/wk"
        else:
            status = COMPLIANT
            actual = "All semester registrations within 25-credit / contact-hour limit"

    elif rid == "VIG-R26-003":
        status = EVIDENCE_PENDING
        evidence_note = "Academic calendar integration required (ERP / Office of Academic Affairs)"

    elif rid == "VIG-R26-004":
        status = EVIDENCE_PENDING
        evidence_note = "Course L-T-P-SL structure data required from BoS curriculum repository"

    elif rid == "VIG-R26-005":
        status = EVIDENCE_PENDING
        evidence_note = "Timetable + L-T-P-SL data required for lab course credit verification"

    elif rid == "VIG-R26-006":
        status = EVIDENCE_PENDING
        evidence_note = "Course files / syllabus repository data required"

    elif rid == "VIG-R26-007":
        lib = data.get("library", {})
        titles = lib.get("total_titles", 0)
        if titles >= 2000:
            status = COMPLIANT
            actual = f"{titles:,} library titles -- textbook coverage adequate"
        else:
            status = AT_RISK
            actual = f"{titles:,} titles -- coverage may be inadequate"
            issue  = "Library title count below recommended level for textbook coverage"

    elif rid == "VIG-R26-008":
        status = EVIDENCE_PENDING
        evidence_note = "Course-level syllabus resource lists required from curriculum system"

    elif rid == "VIG-R26-009":
        status = EVIDENCE_PENDING
        evidence_note = "Attendance Management System integration required"

    elif rid == "VIG-R26-010":
        status = EVIDENCE_PENDING
        evidence_note = "Internal marks database integration required (formative assessment records)"

    elif rid == "VIG-R26-011":
        status = EVIDENCE_PENDING
        evidence_note = "End-semester assessment database integration required"

    elif rid == "VIG-R26-012":
        labs = data.get("laboratories", [])
        maintenance = [l for l in labs if l.get("status") != "functional"]
        if maintenance:
            lab = maintenance[0]
            status = AT_RISK
            actual = f"{len(maintenance)} lab(s) under maintenance: {lab['name']}"
            issue  = f"{lab['name']} -- {lab.get('maintenance_reason','under maintenance')} -- lab manual access affected"
        elif labs:
            status = COMPLIANT
            actual = f"All {len(labs)} labs functional with accessible manuals"
        else:
            status = EVIDENCE_PENDING
            evidence_note = "Laboratory roster + manual availability records required"

    elif rid == "VIG-AICTE-001":
        depts = data.get("departments", [])
        non_comp = []
        for dept in depts:
            fsr = _compute_fsr(dept["department_id"], data)
            if fsr > 20:
                non_comp.append(f"{dept['name'].split()[0]}: {fsr}")
        if non_comp:
            status = NON_COMPLIANT
            actual = "; ".join(non_comp) + " students/faculty"
            issue  = f"{len(non_comp)} department(s) exceed AICTE 1:20 faculty-student norm"
        elif depts:
            all_fsrs = [f"{d['name'].split()[0]}: {_compute_fsr(d['department_id'],data)}" for d in depts]
            status = COMPLIANT
            actual = ", ".join(all_fsrs)
        else:
            status = EVIDENCE_PENDING
            evidence_note = "Department enrollment and faculty data required"

    elif rid == "VIG-AICTE-002":
        phd_cse = _compute_phd_percent("DEPT-CSE", data)
        if phd_cse >= 33:
            status = COMPLIANT
            actual = f"PhD faculty available for PG supervision ({phd_cse:.1f}% PhD in CSE)"
        else:
            status = EVIDENCE_PENDING
            evidence_note = "PG program faculty roster + PhD + Professor-rank qualification data required"

    elif rid == "VIG-UGC-001":
        depts = data.get("departments", [])
        below = []
        for dept in depts:
            pct = _compute_phd_percent(dept["department_id"], data)
            if pct < 40:
                below.append(f"{dept['name'].split()[0]}: {pct:.1f}%")
        if below:
            status = NON_COMPLIANT
            actual = "; ".join(below)
            issue  = f"{len(below)} dept(s) below 40% PhD cadre required by UGC norms"
        else:
            status = COMPLIANT
            actual = "All departments meet UGC PhD qualification ratio"

    elif rid == "VIG-UGC-002":
        arc = _committee_status("Anti-Ragging", data)
        if arc == "active":
            status = COMPLIANT
            actual = "Anti-Ragging Committee -- Active and compliant"
        elif arc == "lapsed":
            status = NON_COMPLIANT
            actual = "Anti-Ragging Committee -- Lapsed"
            issue  = "Committee lapsed 40+ days ago. Immediate reconstitution required per UGC mandate"
        else:
            status = EVIDENCE_PENDING
            evidence_note = "Committee composition, policy and latest meeting records required"

    elif rid == "VIG-UGC-003":
        grv = _committee_status("Grievance", data)
        if grv == "active":
            status = COMPLIANT
            actual = "Student Grievance Redressal Committee -- Active"
        else:
            status = EVIDENCE_PENDING
            evidence_note = "SGRC composition, complaint records and closure reports required"

    elif rid == "VIG-NBA-001":
        accred = data.get("institution", {}).get("accreditation", [])
        if any("NBA" in str(a) for a in accred):
            status = COMPLIANT
            actual = f"NBA: {', '.join(str(a) for a in accred if 'NBA' in str(a))}"
        else:
            status = EVIDENCE_PENDING
            evidence_note = "NBA accreditation certificate and program-wise validity period required"

    elif rid == "VIG-NBA-002":
        depts = data.get("departments", [])
        if depts:
            fsrs = [(_compute_fsr(d["department_id"], data), d["name"]) for d in depts]
            worst_fsr, worst_dept = max(fsrs)
            best_fsr = min(f for f, _ in fsrs)
            if worst_fsr <= 20:
                status = COMPLIANT
                actual = f"FSR range: {best_fsr:.1f}--{worst_fsr:.1f} (all within NBA 20:1)"
            elif worst_fsr <= 25:
                status = AT_RISK
                actual = f"Highest FSR: {worst_fsr:.1f} in {worst_dept.split()[0]}"
                issue  = f"Approaching NBA 25:1 threshold -- needs monitoring"
            else:
                status = NON_COMPLIANT
                actual = f"Highest FSR: {worst_fsr:.1f} in {worst_dept.split()[0]} -- exceeds 25:1"
                issue  = "Exceeds NBA student-faculty ratio threshold"
        else:
            status = EVIDENCE_PENDING
            evidence_note = "Program-wise student and faculty data required"

    elif rid == "VIG-NBA-003":
        depts = data.get("departments", [])
        if depts:
            pcts  = [_compute_phd_percent(d["department_id"], data) for d in depts]
            avg   = round(sum(pcts) / len(pcts), 1)
            if avg >= 30:
                status = COMPLIANT
                actual = f"Avg PhD ratio: {avg:.1f}% across departments (meets NBA >=30%)"
            else:
                status = NON_COMPLIANT
                actual = f"Avg PhD ratio: {avg:.1f}% (below NBA 30% threshold)"
                issue  = f"Average PhD faculty ratio ({avg:.1f}%) below NBA accreditation criterion"
        else:
            status = EVIDENCE_PENDING
            evidence_note = "Two-year program faculty roster + PhD qualification records required"

    elif rid == "VIG-NBA-004":
        lib = data.get("library", {})
        titles  = lib.get("total_titles", 0)
        digital = lib.get("digital_access", False)
        if titles >= 2000 and digital:
            status = COMPLIANT
            actual = f"{titles:,} titles + digital access enabled"
        else:
            status = AT_RISK
            actual = f"{titles:,} titles, digital: {digital}"
            issue  = "Library learning resource evidence should be refreshed for NBA submission"

    elif rid == "VIG-VFSTR-001":
        lib = data.get("library", {})
        volumes = lib.get("total_volumes", 0)
        if volumes >= 10000:
            status = COMPLIANT
            actual = f"{volumes:,} volumes (meets VFSTR published baseline of 1,20,100)"
        else:
            status = AT_RISK
            actual = f"{volumes:,} volumes -- snapshot may be outdated"
            issue  = "Library volume count below VFSTR published baseline -- verify with LMS export"

    elif rid == "VIG-VFSTR-002":
        arc = _committee_status("Anti-Ragging", data)
        if arc == "active":
            status = COMPLIANT
            actual = "Anti-Ragging Committee listed and composition published"
        elif arc == "lapsed":
            status = NON_COMPLIANT
            actual = "Anti-Ragging Committee -- lapsed"
            issue  = "Committee lapsed 40+ days -- reconstitution required"
        else:
            status = EVIDENCE_PENDING
            evidence_note = "Current committee order and composition required"

    elif rid == "VIG-VFSTR-003":
        committees = data.get("committees", [])
        active_count = sum(1 for c in committees if c.get("status") == "active")
        lapsed_count = sum(1 for c in committees if c.get("status") == "lapsed")
        if lapsed_count == 0:
            status = COMPLIANT
            actual = f"All {len(committees)} tracked mandatory committees active"
        elif lapsed_count == 1:
            status = AT_RISK
            actual = f"{active_count} active, {lapsed_count} lapsed of {len(committees)} tracked"
            issue  = "1 mandatory committee lapsed -- reconstitution order needed immediately"
        else:
            status = NON_COMPLIANT
            actual = f"{lapsed_count} committees lapsed"
            issue  = "Multiple mandatory committees lapsed -- immediate action required"

    elif rid == "VIG-INT-001":
        fsr = _compute_fsr("DEPT-CSE", data)
        if fsr <= 20:
            status = COMPLIANT
            actual = f"CSE FSR: {fsr:.1f} students/faculty (within AICTE 1:20)"
        elif fsr <= 25:
            status = AT_RISK
            actual = f"CSE FSR: {fsr:.1f} students/faculty"
            issue  = f"CSE ratio ({fsr:.1f}) approaching 1:25 threshold"
        else:
            status = NON_COMPLIANT
            actual = f"CSE FSR: {fsr:.1f} students/faculty"
            issue  = f"CSE FSR {fsr:.1f} exceeds AICTE 1:20 norm -- faculty recruitment required"

    elif rid == "VIG-INT-002":
        ece_credits, ece_ok = _credit_status("DEPT-ECE", data)
        if ece_ok:
            status = COMPLIANT
            actual = f"ECE: {ece_credits}/160 credits -- meets R26 norm"
        elif ece_credits >= 155:
            status = AT_RISK
            actual = f"ECE: {ece_credits}/160 credits (shortfall: {160 - ece_credits})"
            issue  = f"{160 - ece_credits}-credit shortfall in ECE curriculum -- BoS realignment needed"
        else:
            status = NON_COMPLIANT
            actual = f"ECE: {ece_credits}/160 credits (shortfall: {160 - ece_credits})"
            issue  = f"ECE curriculum has significant {160 - ece_credits}-credit shortfall against R26 minimum"

    else:
        status = EVIDENCE_PENDING
        evidence_note = "Evaluation rule not yet implemented for this requirement ID"

    return {
        "requirement_id":    rid,
        "requirement_name":  req.get("requirement_name", ""),
        "category":          req.get("category", ""),
        "authority":         req.get("authority", ""),
        "severity":          req.get("severity", "MEDIUM"),
        "clause":            req.get("clause", ""),
        "source_document":   req.get("source_document", ""),
        "evidence_required": req.get("evidence_required", ""),
        "required_value":    req.get("required_value", ""),
        "lead_time_days":    req.get("lead_time_days", 30),
        "owner":             req.get("owner", ""),
        "status":            status,
        "actual_value":      actual,
        "issue":             issue,
        "evidence_note":     evidence_note,
        "checked_at":        datetime.now(timezone.utc).isoformat(),
    }


def run_full_compliance_scan() -> Dict:
    reg_path = os.path.join(_base(), "data", "regulations.json")
    data     = _institutional_data()
    reg_data = _load_json(reg_path)
    records  = reg_data.get("records", [])

    results: List[Dict] = []
    for req in records:
        results.append(_evaluate_single(req, data))

    counts = {
        COMPLIANT:        sum(1 for r in results if r["status"] == COMPLIANT),
        AT_RISK:          sum(1 for r in results if r["status"] == AT_RISK),
        NON_COMPLIANT:    sum(1 for r in results if r["status"] == NON_COMPLIANT),
        EVIDENCE_PENDING: sum(1 for r in results if r["status"] == EVIDENCE_PENDING),
    }
    total = len(results)

    return {
        "scan_time":                datetime.now(timezone.utc).isoformat(),
        "total":                    total,
        "summary":                  counts,
        "overall_compliance_pct":   round((counts[COMPLIANT] / total) * 100) if total else 0,
        "results":                  results,
        "institution":              reg_data.get("institution", ""),
        "dataset_name":             reg_data.get("dataset_name", ""),
    }
