"""Pydantic data models for CareFlow AI."""

from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


# --- Enums ---

class ESILevel(int, Enum):
    IMMEDIATE = 1
    EMERGENT = 2
    URGENT = 3
    LESS_URGENT = 4
    NON_URGENT = 5


class NoteStatus(str, Enum):
    DRAFT = "draft"
    REVIEWED = "reviewed"
    SIGNED = "signed"
    AMENDED = "amended"


class ChatRole(str, Enum):
    PATIENT = "patient"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class SessionType(str, Enum):
    INTAKE = "intake"
    TRIAGE = "triage"
    FOLLOWUP = "followup"
    GENERAL = "general"


class FollowUpType(str, Enum):
    HOUR_24 = "24hr"
    DAY_7 = "7day"
    DAY_30 = "30day"


# --- Request Models ---

class TranscriptionRequest(BaseModel):
    """Request for audio transcription."""
    language: str = "en"


class NoteGenerationRequest(BaseModel):
    """Request to generate a clinical note from transcript."""
    transcript: str
    patient_id: Optional[str] = None
    encounter_type: str = "office_visit"


class CodeSuggestionRequest(BaseModel):
    """Request for ICD-10/CPT code suggestions."""
    note_text: str
    encounter_type: str = "office_visit"


class ChatMessage(BaseModel):
    """A single chat message."""
    role: ChatRole
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ChatRequest(BaseModel):
    """Request to send a chat message."""
    message: str
    session_id: Optional[str] = None
    session_type: SessionType = SessionType.GENERAL
    patient_id: Optional[str] = None


class IntakeStartRequest(BaseModel):
    """Request to start an intake session."""
    patient_id: Optional[str] = None
    appointment_reason: Optional[str] = None


class TriageRequest(BaseModel):
    """Request for symptom triage."""
    symptoms: str
    patient_age: Optional[int] = None
    patient_sex: Optional[str] = None
    medical_history: List[str] = []
    current_medications: List[str] = []


class FollowUpStartRequest(BaseModel):
    """Request to start a follow-up session."""
    patient_id: str
    discharge_date: str
    followup_type: FollowUpType = FollowUpType.HOUR_24
    discharge_instructions: Optional[str] = None
    medications: List[str] = []


class NoteUpdateRequest(BaseModel):
    """Request to update a clinical note."""
    note_text: str
    status: NoteStatus = NoteStatus.REVIEWED


# --- Response Models ---

class TranscriptionResponse(BaseModel):
    """Response from audio transcription."""
    transcript: str
    language: str
    duration_seconds: float
    segments: List[Dict] = []


class SOAPNote(BaseModel):
    """Structured SOAP note."""
    subjective: str
    objective: str
    assessment: str
    plan: str
    icd10_codes: List[Dict] = []
    raw_text: str = ""


class NoteGenerationResponse(BaseModel):
    """Response from note generation."""
    note: SOAPNote
    encounter_id: Optional[str] = None
    generated_at: datetime = Field(default_factory=datetime.utcnow)


class CodeSuggestion(BaseModel):
    """A single code suggestion."""
    code: str
    description: str
    confidence: str
    evidence: str


class CodeSuggestionResponse(BaseModel):
    """Response from code suggestion."""
    icd10_codes: List[CodeSuggestion] = []
    cpt_codes: List[CodeSuggestion] = []
    em_level: str = ""
    documentation_gaps: List[str] = []


class TriageResult(BaseModel):
    """Triage assessment result."""
    esi_level: ESILevel
    reasoning: str
    key_symptoms: List[str] = []
    recommended_action: str
    escalate_to_nurse: bool = False
    red_flags: List[str] = []


class ChatResponse(BaseModel):
    """Response from chat engine."""
    message: str
    session_id: str
    escalation: bool = False
    escalation_reason: Optional[str] = None
    triage_result: Optional[TriageResult] = None
    intake_complete: bool = False
    intake_summary: Optional[Dict] = None


class PatientSummary(BaseModel):
    """Patient summary for display."""
    id: str
    name: str
    age: int
    sex: str
    chief_complaint: Optional[str] = None
    triage_level: Optional[ESILevel] = None
    status: str = "waiting"


class EncounterSummary(BaseModel):
    """Encounter summary for dashboard."""
    id: str
    patient_name: str
    date: datetime
    encounter_type: str
    note_status: NoteStatus
    has_coding: bool = False
