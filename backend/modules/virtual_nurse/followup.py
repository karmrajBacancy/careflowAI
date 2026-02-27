from __future__ import annotations

"""Post-discharge follow-up conversation flows."""

import uuid
import logging
from modules.shared.claude_client import llm_client
from modules.shared.safety import check_emergency, EMERGENCY_RESPONSE

logger = logging.getLogger(__name__)

# In-memory follow-up sessions
_followup_sessions: dict[str, dict] = {}

FOLLOWUP_TEMPLATES = {
    "24hr": (
        "Hello! This is your virtual nursing assistant checking in on you. "
        "You were discharged about 24 hours ago. I want to make sure you're "
        "doing okay and have everything you need for your recovery.\n\n"
        "How are you feeling today compared to when you left?"
    ),
    "7day": (
        "Hi there! It's been about a week since you were discharged. "
        "I'm checking in to see how your recovery is going.\n\n"
        "How have you been feeling this past week?"
    ),
    "30day": (
        "Hello! It's been about a month since your discharge. "
        "I'm reaching out for a follow-up check on your recovery.\n\n"
        "How are you doing overall? Any concerns since we last spoke?"
    ),
}


def start_followup(
    patient_id: str,
    discharge_date: str,
    followup_type: str = "24hr",
    discharge_instructions: str | None = None,
    medications: list[str] | None = None,
) -> dict:
    """Start a follow-up conversation session."""
    session_id = str(uuid.uuid4())

    context = f"Patient ID: {patient_id}\nDischarge date: {discharge_date}\n"
    if discharge_instructions:
        context += f"Discharge instructions: {discharge_instructions}\n"
    if medications:
        context += f"Medications: {', '.join(medications)}\n"

    greeting = FOLLOWUP_TEMPLATES.get(followup_type, FOLLOWUP_TEMPLATES["24hr"])

    _followup_sessions[session_id] = {
        "patient_id": patient_id,
        "followup_type": followup_type,
        "context": context,
        "history": [{"role": "assistant", "content": greeting}],
        "concerns": [],
        "complete": False,
    }

    return {
        "session_id": session_id,
        "message": greeting,
        "complete": False,
    }


def process_followup_message(session_id: str, message: str) -> dict:
    """Process a patient message during follow-up."""
    session = _followup_sessions.get(session_id)
    if not session:
        return {"error": "Session not found", "session_id": session_id}

    # Emergency check
    is_emergency, keyword = check_emergency(message)
    if is_emergency:
        session["history"].append({"role": "user", "content": message})
        session["history"].append({"role": "assistant", "content": EMERGENCY_RESPONSE})
        return {
            "session_id": session_id,
            "message": EMERGENCY_RESPONSE,
            "escalation": True,
            "complete": False,
        }

    try:
        response = llm_client.followup_chat(
            message,
            session["history"],
            context=session["context"],
        )

        session["history"].append({"role": "user", "content": message})
        session["history"].append({"role": "assistant", "content": response})

        # Check if follow-up is complete
        complete = _check_followup_complete(response)
        if complete:
            session["complete"] = True

        return {
            "session_id": session_id,
            "message": response,
            "complete": complete,
        }
    except Exception as e:
        logger.error("Follow-up processing error: %s", e)
        return {
            "session_id": session_id,
            "message": "I'm having trouble right now. If you have urgent concerns, please call your provider's office.",
            "complete": False,
        }


def _check_followup_complete(response: str) -> bool:
    """Check if the follow-up conversation is complete."""
    completion_phrases = [
        "take care",
        "don't hesitate to call",
        "wishing you a speedy recovery",
        "glad to hear you're doing well",
        "everything sounds good",
        "that covers our check-in",
    ]
    return any(phrase in response.lower() for phrase in completion_phrases)


def get_followup_session(session_id: str) -> dict | None:
    """Get follow-up session data."""
    return _followup_sessions.get(session_id)
