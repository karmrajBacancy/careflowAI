"""SQLAlchemy database models."""

import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Text,
    DateTime,
    Boolean,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship
from database.db import Base


def gen_id() -> str:
    return str(uuid.uuid4())


class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(String, primary_key=True, default=gen_id)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    address = Column(Text)
    phone = Column(String)
    email = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    admins = relationship("AdminUser", back_populates="hospital")
    patients = relationship("Patient", back_populates="hospital")


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(String, primary_key=True, default=gen_id)
    username = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="hospital_admin")  # super_admin or hospital_admin
    hospital_id = Column(String, ForeignKey("hospitals.id"), nullable=True)  # null for super_admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    hospital = relationship("Hospital", back_populates="admins")


class Patient(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, default=gen_id)
    hospital_id = Column(String, ForeignKey("hospitals.id"), nullable=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(String, nullable=False)
    sex = Column(String, nullable=False)
    phone = Column(String)
    email = Column(String)
    address = Column(Text)
    insurance_id = Column(String)
    medical_history = Column(JSON, default=list)
    allergies = Column(JSON, default=list)
    medications = Column(JSON, default=list)
    emergency_contact = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    hospital = relationship("Hospital", back_populates="patients")
    encounters = relationship("Encounter", back_populates="patient")
    chat_sessions = relationship("ChatSession", back_populates="patient")


class Encounter(Base):
    __tablename__ = "encounters"

    id = Column(String, primary_key=True, default=gen_id)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    encounter_type = Column(String, default="office_visit")
    date = Column(DateTime, default=datetime.utcnow)
    provider_name = Column(String)
    transcript = Column(Text)
    audio_file_path = Column(String)
    duration_seconds = Column(Float)
    status = Column(String, default="in_progress")
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="encounters")
    notes = relationship("ClinicalNote", back_populates="encounter")


class ClinicalNote(Base):
    __tablename__ = "clinical_notes"

    id = Column(String, primary_key=True, default=gen_id)
    encounter_id = Column(String, ForeignKey("encounters.id"), nullable=False)
    version = Column(Integer, default=1)
    note_type = Column(String, default="soap")
    subjective = Column(Text)
    objective = Column(Text)
    assessment = Column(Text)
    plan = Column(Text)
    raw_text = Column(Text)
    icd10_codes = Column(JSON, default=list)
    cpt_codes = Column(JSON, default=list)
    status = Column(String, default="draft")
    ai_generated = Column(Boolean, default=True)
    provider_edited = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    encounter = relationship("Encounter", back_populates="notes")


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String, primary_key=True, default=gen_id)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=True)
    hospital_id = Column(String, ForeignKey("hospitals.id"), nullable=True, index=True)
    session_type = Column(String, default="general")
    status = Column(String, default="active")
    triage_level = Column(Integer, nullable=True)
    intake_data = Column(JSON, default=dict)
    followup_type = Column(String, nullable=True)
    escalated = Column(Boolean, default=False)
    escalation_reason = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    patient = relationship("Patient", back_populates="chat_sessions")
    messages = relationship("ChatMessageRecord", back_populates="session")


class ChatMessageRecord(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, default=gen_id)
    session_id = Column(String, ForeignKey("chat_sessions.id"), nullable=False)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")


class TriageRecord(Base):
    __tablename__ = "triage_records"

    id = Column(String, primary_key=True, default=gen_id)
    session_id = Column(String, ForeignKey("chat_sessions.id"), nullable=True)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=True)
    hospital_id = Column(String, ForeignKey("hospitals.id"), nullable=True, index=True)
    esi_level = Column(Integer, nullable=False)
    reasoning = Column(Text)
    key_symptoms = Column(JSON, default=list)
    recommended_action = Column(Text)
    escalate_to_nurse = Column(Boolean, default=False)
    red_flags = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
