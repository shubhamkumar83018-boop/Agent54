from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

def utcnow():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String)

class Institution(Base):
    __tablename__ = "institutions"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"))
    name = Column(String)
    
class Regulation(Base):
    __tablename__ = "regulations"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    authority = Column(String)
    versions = relationship("RegulationVersion", back_populates="regulation")

class RegulationVersion(Base):
    __tablename__ = "regulation_versions"
    id = Column(Integer, primary_key=True, index=True)
    regulation_id = Column(Integer, ForeignKey("regulations.id"))
    version = Column(String)
    effective_date = Column(DateTime)
    regulation = relationship("Regulation", back_populates="versions")
    requirements = relationship("Requirement", back_populates="version")

class Requirement(Base):
    __tablename__ = "requirements"
    id = Column(Integer, primary_key=True, index=True)
    version_id = Column(Integer, ForeignKey("regulation_versions.id"))
    title = Column(String)
    description = Column(Text)
    category = Column(String)
    metric = Column(String)
    operator = Column(String)
    threshold = Column(Float)
    unit = Column(String)
    severity = Column(String)
    version = relationship("RegulationVersion", back_populates="requirements")

class Evidence(Base):
    __tablename__ = "evidence"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    source_type = Column(String)
    content = Column(Text)
    uploaded_at = Column(DateTime, default=utcnow)
    confidence = Column(Float)

class ComplianceResult(Base):
    __tablename__ = "compliance_results"
    id = Column(Integer, primary_key=True, index=True)
    requirement_id = Column(Integer, ForeignKey("requirements.id"))
    department_id = Column(Integer, ForeignKey("departments.id"))
    actual_value = Column(String)
    gap = Column(String)
    status = Column(String)
    explanation = Column(Text)
    checked_at = Column(DateTime, default=utcnow)

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    id = Column(Integer, primary_key=True, index=True)
    result_id = Column(Integer, ForeignKey("compliance_results.id"))
    risk_score = Column(Float)
    severity = Column(String)
    factors = Column(JSON)

class RemediationPlan(Base):
    __tablename__ = "remediation_plans"
    id = Column(Integer, primary_key=True, index=True)
    result_id = Column(Integer, ForeignKey("compliance_results.id"))
    action = Column(String)
    owner = Column(String)
    lead_time_days = Column(Integer)
    status = Column(String)

class AuditEvent(Base):
    __tablename__ = "audit_events"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=utcnow)
    agent = Column(String)
    action = Column(String)
    details = Column(Text)

class AgentRun(Base):
    __tablename__ = "agent_runs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=utcnow)
    agent_name = Column(String)
    activity = Column(Text)
