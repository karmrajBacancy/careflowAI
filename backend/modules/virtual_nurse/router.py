"""API endpoints for virtual nursing assistant."""

import uuid
import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from database.db import get_db
from database.schemas import ChatSession, ChatMessageRecord, TriageRecord
from modules.shared.models import (
    ChatRequest,
    ChatResponse,
    IntakeStartRequest,
    TriageRequest,
    TriageResult,
    FollowUpStartRequest,
)
from modules.virtual_nurse.chat_engine import chat, get_session_history, clear_session
from modules.virtual_nurse.intake import start_intake, process_intake_message, get_intake_session
from modules.virtual_nurse.triage import assess_triage
from modules.virtual_nurse.followup import start_followup, process_followup_message
from modules.auth.utils import get_current_user, get_hospital_id

logger = logging.getLogger(__name__)
router = APIRouter(
    prefix="/api/nurse",
    tags=["Virtual Nurse"],
    dependencies=[Depends(get_current_user)],
)


# --- General Chat ---

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Send a chat message to the virtual nurse."""
    if not request.message.strip():
        raise HTTPException(400, "Message cannot be empty")

    result = chat(request.message, session_id=request.session_id)

    # Persist to database
    hospital_id = get_hospital_id(current_user)
    _save_chat_message(db, result["session_id"], "user", request.message, hospital_id=hospital_id)
    _save_chat_message(db, result["session_id"], "assistant", result["message"], hospital_id=hospital_id)

    if result.get("escalation"):
        _mark_session_escalated(db, result["session_id"], result.get("escalation_reason"))

    return ChatResponse(
        message=result["message"],
        session_id=result["session_id"],
        escalation=result.get("escalation", False),
        escalation_reason=result.get("escalation_reason"),
    )


@router.get("/chat/{session_id}/history")
async def get_chat_history(session_id: str):
    """Get chat history for a session."""
    history = get_session_history(session_id)
    return {"session_id": session_id, "messages": history}


@router.delete("/chat/{session_id}")
async def end_chat_session(session_id: str):
    """End a chat session."""
    cleared = clear_session(session_id)
    if not cleared:
        raise HTTPException(404, "Session not found")
    return {"message": "Session ended", "session_id": session_id}


# --- Patient Intake ---

@router.post("/intake/start")
async def start_intake_endpoint(request: IntakeStartRequest):
    """Start a new patient intake session."""
    result = start_intake(
        patient_id=request.patient_id,
        appointment_reason=request.appointment_reason,
    )
    return result


@router.post("/intake/{session_id}/message")
async def intake_message_endpoint(session_id: str, request: ChatRequest):
    """Send a message in an intake session."""
    if not request.message.strip():
        raise HTTPException(400, "Message cannot be empty")

    result = process_intake_message(session_id, request.message)
    if "error" in result:
        raise HTTPException(404, result["error"])
    return result


@router.get("/intake/{session_id}")
async def get_intake_status(session_id: str):
    """Get intake session status and collected data."""
    session = get_intake_session(session_id)
    if not session:
        raise HTTPException(404, "Intake session not found")
    return {
        "session_id": session_id,
        "patient_id": session.get("patient_id"),
        "complete": session.get("complete", False),
        "collected_data": session.get("collected_data", {}),
        "message_count": len(session.get("history", [])),
    }


# --- Triage ---

@router.post("/triage", response_model=TriageResult)
async def triage_endpoint(
    request: TriageRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Assess symptoms and assign triage level."""
    if not request.symptoms.strip():
        raise HTTPException(400, "Symptoms cannot be empty")

    result = assess_triage(
        symptoms=request.symptoms,
        patient_age=request.patient_age,
        patient_sex=request.patient_sex,
        medical_history=request.medical_history,
        current_medications=request.current_medications,
    )

    hospital_id = get_hospital_id(current_user)

    # Persist triage record
    record = TriageRecord(
        id=str(uuid.uuid4()),
        patient_id=request.symptoms[:50],  # temp identifier
        hospital_id=hospital_id,
        esi_level=result.esi_level.value,
        reasoning=result.reasoning,
        key_symptoms=result.key_symptoms,
        recommended_action=result.recommended_action,
        escalate_to_nurse=result.escalate_to_nurse,
        red_flags=result.red_flags,
    )
    db.add(record)
    db.commit()

    return result


# --- Follow-up ---

@router.post("/followup/start")
async def start_followup_endpoint(request: FollowUpStartRequest):
    """Start a post-discharge follow-up session."""
    result = start_followup(
        patient_id=request.patient_id,
        discharge_date=request.discharge_date,
        followup_type=request.followup_type.value,
        discharge_instructions=request.discharge_instructions,
        medications=request.medications,
    )
    return result


@router.post("/followup/{session_id}/message")
async def followup_message_endpoint(session_id: str, request: ChatRequest):
    """Send a message in a follow-up session."""
    if not request.message.strip():
        raise HTTPException(400, "Message cannot be empty")

    result = process_followup_message(session_id, request.message)
    if "error" in result:
        raise HTTPException(404, result["error"])
    return result


# --- Nurse Dashboard ---

@router.get("/dashboard/escalations")
async def get_escalations(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get escalated chat sessions, filtered by hospital_id."""
    hospital_id = get_hospital_id(current_user)

    query = db.query(ChatSession).filter(ChatSession.escalated == True)
    if hospital_id:
        query = query.filter(ChatSession.hospital_id == hospital_id)

    sessions = query.order_by(ChatSession.updated_at.desc()).limit(50).all()
    return [
        {
            "session_id": s.id,
            "patient_id": s.patient_id,
            "session_type": s.session_type,
            "escalation_reason": s.escalation_reason,
            "triage_level": s.triage_level,
            "created_at": s.created_at.isoformat(),
        }
        for s in sessions
    ]


@router.get("/dashboard/active-sessions")
async def get_active_sessions(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get active chat sessions, filtered by hospital_id."""
    hospital_id = get_hospital_id(current_user)

    query = db.query(ChatSession).filter(ChatSession.status == "active")
    if hospital_id:
        query = query.filter(ChatSession.hospital_id == hospital_id)

    sessions = query.order_by(ChatSession.created_at.desc()).limit(50).all()
    return [
        {
            "session_id": s.id,
            "patient_id": s.patient_id,
            "session_type": s.session_type,
            "triage_level": s.triage_level,
            "escalated": s.escalated,
            "created_at": s.created_at.isoformat(),
        }
        for s in sessions
    ]


# --- Helpers ---

def _save_chat_message(
    db: Session, session_id: str, role: str, content: str, hospital_id: Optional[str] = None
):
    """Save a chat message to the database."""
    # Ensure session exists
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        session = ChatSession(
            id=session_id,
            session_type="general",
            status="active",
            hospital_id=hospital_id,
        )
        db.add(session)

    msg = ChatMessageRecord(
        id=str(uuid.uuid4()),
        session_id=session_id,
        role=role,
        content=content,
    )
    db.add(msg)
    db.commit()


def _mark_session_escalated(db: Session, session_id: str, reason: Optional[str]):
    """Mark a session as escalated."""
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if session:
        session.escalated = True
        session.escalation_reason = reason
        db.commit()
