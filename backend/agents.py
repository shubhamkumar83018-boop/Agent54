import os
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from . import models, compliance

class OrchestratorAgent:
    def __init__(self, db: Session):
        self.db = db
        
    def log_activity(self, agent_name: str, activity: str):
        run = models.AgentRun(agent_name=agent_name, activity=activity)
        self.db.add(run)
        self.db.commit()

    def trigger_compliance_check(self, requirement_id: int, department_id: int, actual_value: str):
        self.log_activity("Orchestrator Agent", f"Initiating compliance pipeline for requirement {requirement_id}")
        comp_agent = ComplianceVerificationAgent(self.db, self)
        result = comp_agent.verify(requirement_id, department_id, actual_value)
        
        # Interlink: Automatically trigger risk assessment
        risk = self.trigger_risk_assessment(result.id)
        
        # Interlink: Automatically trigger remediation if needed
        plan = None
        if result.status != "COMPLIANT":
            plan = self.trigger_remediation(result.id)
            
        return {"result": result, "risk": risk, "remediation": plan}
        
    def trigger_risk_assessment(self, result_id: int):
        self.log_activity("Orchestrator Agent", f"Delegating risk assessment for result {result_id}")
        risk_agent = RiskAssessmentAgent(self.db, self)
        return risk_agent.assess_risk(result_id)
        
    def trigger_remediation(self, result_id: int):
        self.log_activity("Orchestrator Agent", f"Delegating remediation planning for result {result_id}")
        remed_agent = RemediationPlanningAgent(self.db, self)
        return remed_agent.create_plan(result_id)

    def trigger_evidence_processing(self, title: str, content: str, source_type: str):
        self.log_activity("Orchestrator Agent", "Delegating evidence processing")
        ev_agent = EvidenceAgent(self.db, self)
        return ev_agent.process_evidence(title, content, source_type)
        
    def trigger_regulation_parsing(self, text: str, title: str, authority: str, version: str):
        self.log_activity("Orchestrator Agent", "Delegating regulation parsing")
        reg_agent = RegulationIntelligenceAgent(self.db, self)
        return reg_agent.parse_regulation(text, title, authority, version)

    def trigger_simulation(self, requirement_id: int, simulated_value: float):
        self.log_activity("Orchestrator Agent", "Delegating simulation")
        sim_agent = SimulationAgent(self.db, self)
        return sim_agent.simulate(requirement_id, simulated_value)

    def trigger_institutional_prediction(self, params):
        self.log_activity("Orchestrator Agent", "Delegating institutional prediction")
        sim_agent = SimulationAgent(self.db, self)
        return sim_agent.predict_institutional_impact(params)

class RegulationIntelligenceAgent:
    def __init__(self, db: Session, orchestrator: OrchestratorAgent):
        self.db = db
        self.orchestrator = orchestrator

    def parse_regulation(self, text: str, title: str, authority: str, version: str):
        self.orchestrator.log_activity("Regulation Agent", f"Parsing new regulation document: {title}")
        
        # In a real scenario, an LLM would extract this. 
        # Here we simulate the structured output of an LLM extraction.
        
        reg = models.Regulation(title=title, authority=authority)
        self.db.add(reg)
        self.db.commit()
        self.db.refresh(reg)
        
        reg_ver = models.RegulationVersion(
            regulation_id=reg.id,
            version=version,
            effective_date=datetime.now(timezone.utc)
        )
        self.db.add(reg_ver)
        self.db.commit()
        self.db.refresh(reg_ver)
        
        self.orchestrator.log_activity("Regulation Agent", f"Extracted requirements for {title}")
        return reg_ver

class EvidenceAgent:
    def __init__(self, db: Session, orchestrator: OrchestratorAgent):
        self.db = db
        self.orchestrator = orchestrator
        
    def process_evidence(self, title: str, content: str, source_type: str):
        self.orchestrator.log_activity("Evidence Agent", f"Processing uploaded evidence: {title}")
        
        ev = models.Evidence(
            title=title,
            source_type=source_type,
            content=content,
            confidence=0.95
        )
        self.db.add(ev)
        self.db.commit()
        self.db.refresh(ev)
        return ev

class ComplianceVerificationAgent:
    def __init__(self, db: Session, orchestrator: OrchestratorAgent):
        self.db = db
        self.orchestrator = orchestrator
        
    def verify(self, requirement_id: int, department_id: int, actual_value: str):
        self.orchestrator.log_activity("Compliance Agent", f"Running deterministic check for requirement {requirement_id}")
        return compliance.run_compliance_check(self.db, requirement_id, department_id, actual_value)

class RiskAssessmentAgent:
    def __init__(self, db: Session, orchestrator: OrchestratorAgent):
        self.db = db
        self.orchestrator = orchestrator
        
    def assess_risk(self, result_id: int):
        self.orchestrator.log_activity("Risk Agent", f"Calculating risk for compliance result {result_id}")
        
        result = self.db.query(models.ComplianceResult).filter(models.ComplianceResult.id == result_id).first()
        if not result:
            return None
            
        # Deterministic risk calculation
        base_score = 0
        severity_multiplier = {"LOW": 1, "MEDIUM": 2, "HIGH": 3, "CRITICAL": 5}
        
        req = self.db.query(models.Requirement).filter(models.Requirement.id == result.requirement_id).first()
        
        if result.status == "COMPLIANT":
            risk_score = 0.0
            severity = "LOW"
        else:
            mult = severity_multiplier.get(req.severity, 1)
            # Risk increases with the size of the gap
            risk_score = min(100.0, (result.gap * mult) + 20)
            
            if risk_score > 80: severity = "CRITICAL"
            elif risk_score > 50: severity = "HIGH"
            elif risk_score > 20: severity = "MEDIUM"
            else: severity = "LOW"
            
        assessment = self.db.query(models.RiskAssessment).filter(models.RiskAssessment.result_id == result_id).first()
        if assessment:
            assessment.risk_score = risk_score
            assessment.severity = severity
        else:
            assessment = models.RiskAssessment(
                result_id=result_id,
                risk_score=risk_score,
                severity=severity,
                factors={"gap": result.gap, "base_severity": req.severity}
            )
            self.db.add(assessment)
            
        self.db.commit()
        return assessment

class RemediationPlanningAgent:
    def __init__(self, db: Session, orchestrator: OrchestratorAgent):
        self.db = db
        self.orchestrator = orchestrator
        
    def create_plan(self, result_id: int):
        result = self.db.query(models.ComplianceResult).filter(models.ComplianceResult.id == result_id).first()
        if result and result.status != "COMPLIANT":
            self.orchestrator.log_activity("Remediation Agent", f"Creating action plan for result {result_id}")
            
            req = self.db.query(models.Requirement).filter(models.Requirement.id == result.requirement_id).first()
            
            # Start of LLM Integration
            action = None
            try:
                import os
                api_key = os.getenv("GEMINI_API_KEY")
                if api_key:
                    from google import genai
                    client = genai.Client(api_key=api_key)
                    
                    prompt = (
                        f"You are Agent 54, an AI compliance expert. We have a compliance violation for '{req.title}'. "
                        f"The requirement is {req.metric} {req.operator} {req.threshold} {req.unit}. "
                        f"Currently there is a gap of {result.gap}. "
                        "Suggest a clear, professional, one-sentence remediation action plan."
                    )
                    
                    response = client.models.generate_content(
                        model='gemini-2.5-flash',
                        contents=prompt
                    )
                    
                    if response and response.text:
                        action = response.text.strip()
                        self.orchestrator.log_activity("Remediation Agent", "Generated action plan using Google Gemini 2.5 Flash LLM")
            except Exception as e:
                self.orchestrator.log_activity("Remediation Agent", f"LLM generation failed, falling back to rules: {str(e)}")
            
            # Deterministic action fallback if LLM not configured or failed
            if not action:
                action = f"Adjust {req.metric} to meet threshold of {req.threshold} {req.unit}. Current gap is {result.gap}."
            
            owner = "Department Head" if req.category == "Faculty" else "Facilities"
            lead_time = 30 if req.severity == "CRITICAL" else 90
            
            plan = self.db.query(models.RemediationPlan).filter(models.RemediationPlan.result_id == result_id).first()
            if plan:
                plan.action = action
                plan.owner = owner
                plan.lead_time_days = lead_time
            else:
                plan = models.RemediationPlan(
                    result_id=result_id,
                    action=action,
                    owner=owner,
                    lead_time_days=lead_time,
                    status="PENDING_APPROVAL"
                )
                self.db.add(plan)
            self.db.commit()
            return plan
        return None

class SimulationAgent:
    def __init__(self, db: Session, orchestrator: OrchestratorAgent):
        self.db = db
        self.orchestrator = orchestrator
        
    def simulate(self, requirement_id: int, simulated_value: float):
        self.orchestrator.log_activity("Simulation Agent", "Running What-If simulation without altering production data")
        
        req = self.db.query(models.Requirement).filter(models.Requirement.id == requirement_id).first()
        from .engine import determine_compliance_status, calculate_gap
        
        status = determine_compliance_status(req.operator, req.threshold, simulated_value)
        gap = calculate_gap(req.operator, req.threshold, simulated_value)
        
        return {
            "simulated_value": simulated_value,
            "simulated_gap": gap,
            "simulated_status": status,
            "simulated_explanation": f"If value is {simulated_value}, status becomes {status}."
        }

    def predict_institutional_impact(self, params):
        self.orchestrator.log_activity("Simulation Agent", "Running LLM prediction based on changing dataset")
        
        # Get current dataset to make the prediction "real" based on data
        results = self.db.query(models.ComplianceResult).all()
        dataset_summary = []
        for r in results:
            req = self.db.query(models.Requirement).filter(models.Requirement.id == r.requirement_id).first()
            if req:
                dataset_summary.append(f"Requirement: {req.title} (Threshold: {req.operator} {req.threshold}). Current Status: {r.status}. Actual: {r.actual_value}")
        
        dataset_text = "\n".join(dataset_summary)
        
        import os
        import json
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            from google import genai
            client = genai.Client(api_key=api_key)
            
            prompt = f"""
            You are an AI compliance predictor. 
            Base Score: {params.baseScore}
            
            Changes:
            - New Faculty Hires: +{params.facultyCount}
            - Student Enrollment Increase: +{params.studentEnrollment}%
            - Budget Cuts: -{params.budgetCut}%
            - Infrastructure Expansion: +{params.infraExpansion}%
            
            Current Dataset:
            {dataset_text}
            
            Analyze how these changes affect the current dataset compliance. Predict the new overall score (0-100), overall status ('Excellent', 'Stable', 'At Risk'), and 3 key impact areas.
            Return ONLY valid JSON in this exact format:
            {{
              "oldScore": {params.baseScore},
              "newScore": 85,
              "status": "Stable",
              "impacts": [
                {{"area": "Faculty-Student Ratio", "change": "+ Improved"}},
                {{"area": "Infrastructure Readiness", "change": "No Change"}},
                {{"area": "Financial Health", "change": "- Strained"}}
              ]
            }}
            """
            
            try:
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt
                )
                if response and response.text:
                    text = response.text.strip()
                    if text.startswith("```json"):
                        text = text[7:-3]
                    elif text.startswith("```"):
                        text = text[3:-3]
                    return json.loads(text.strip())
            except Exception as e:
                self.orchestrator.log_activity("Simulation Agent", f"LLM generation failed: {str(e)}")
        
        # Deterministic fallback logic if no LLM
        scoreChange = (params.facultyCount * 0.5) - (params.studentEnrollment * 0.2) - (params.budgetCut * 0.4) + (params.infraExpansion * 0.3)
        newScore = min(100, max(0, params.baseScore + scoreChange))
        return {
            "oldScore": params.baseScore,
            "newScore": round(newScore),
            "status": "Excellent" if newScore > 85 else "Stable" if newScore > 75 else "At Risk",
            "impacts": [
                {"area": "Faculty-Student Ratio", "change": "+ Improved" if params.facultyCount > 0 else "- Declined"},
                {"area": "Infrastructure Readiness", "change": "+ Expanded" if params.infraExpansion > 0 else "No Change"},
                {"area": "Financial Health", "change": "- Strained" if params.budgetCut > 0 else "Stable"}
            ]
        }
