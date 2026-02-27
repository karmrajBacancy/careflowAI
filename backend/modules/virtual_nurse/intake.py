from __future__ import annotations

"""Pre-visit intake questionnaire logic."""

import uuid
import logging
from modules.shared.claude_client import llm_client
from modules.shared.safety import check_emergency, EMERGENCY_RESPONSE

logger = logging.getLogger(__name__)

# In-memory intake sessions
_intake_sessions: dict[str, dict] = {}

INTAKE_GREETING = (
    "Hello! I'm your virtual nursing assistant. I'll be helping collect some "
    "information before your visit today. This should take about 5-10 minutes. "
    "Please remember that I'm an AI assistant — your healthcare team will review "
    "everything we discuss.\n\n"
    "Let's start: What is the main reason for your visit today?"
)

INTAKE_FIELDS = [
    "chief_complaint",
    "history_of_present_illness",
    "current_medications",
    "allergies",
    "past_medical_history",
    "family_history",
    "social_history",
    "review_of_systems",
]


def start_intake(
    patient_id: str | None = None,
    appointment_reason: str | None = None,
) -> dict:
    """Start a new intake session."""
    session_id = str(uuid.uuid4())
    _intake_sessions[session_id] = {
        "patient_id": patient_id,
        "appointment_reason": appointment_reason,
        "collected_data": {},
        "history": [],
        "current_field_index": 0,
        "complete": False,
    }

    greeting = INTAKE_GREETING
    if appointment_reason:
        greeting = (
            f"Hello! I see you're here for: {appointment_reason}. "
            "I'll help collect some additional information before your visit. "
            "I'm an AI assistant — your healthcare team will review everything.\n\n"
            "Can you tell me more about what's been going on?"
        )

    _intake_sessions[session_id]["history"].append(
        {"role": "assistant", "content": greeting}
    )

    return {
        "session_id": session_id,
        "message": greeting,
        "complete": False,
    }


def process_intake_message(session_id: str, message: str) -> dict:
    """Process a patient message during intake."""
    session = _intake_sessions.get(session_id)
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
            "escalation_reason": f"Emergency keyword: {keyword}",
            "complete": False,
        }

    # Build context for Claude
    context = "Information collected so far:\n"
    for field, value in session["collected_data"].items():
        context += f"- {field}: {value}\n"

    history = session["history"]

    try:
        response = llm_client.intake_chat(message, history)

        session["history"].append({"role": "user", "content": message})
        session["history"].append({"role": "assistant", "content": response})

        # Check if intake appears complete (Claude mentions summary or all fields collected)
        if _check_intake_complete(response, session):
            session["complete"] = True
            summary = _generate_intake_summary(session)
            session["collected_data"] = summary
            return {
                "session_id": session_id,
                "message": response,
                "complete": True,
                "intake_summary": summary,
            }

        return {
            "session_id": session_id,
            "message": response,
            "complete": False,
        }
    except Exception as e:
        logger.error("Intake processing error: %s", e)
        return {
            "session_id": session_id,
            "message": "I'm sorry, I had trouble processing that. Could you please repeat?",
            "complete": False,
        }


def _check_intake_complete(response: str, session: dict) -> bool:
    """Heuristic to check if the intake conversation is complete."""
    completion_phrases = [
        "that covers everything",
        "all the information i need",
        "summary of what",
        "here's a summary",
        "let me summarize",
        "we've covered everything",
        "that's all i need",
    ]
    return any(phrase in response.lower() for phrase in completion_phrases)


def _generate_intake_summary(session: dict) -> dict:
    """Extract structured intake data from the conversation."""
    conversation = "\n".join(
        f"{m['role'].upper()}: {m['content']}" for m in session["history"]
    )

    prompt = (
        "Extract structured intake data from this conversation as JSON:\n"
        f"{conversation}\n\n"
        "Return JSON with keys: chief_complaint, history_of_present_illness, "
        "current_medications (list), allergies (list), past_medical_history (list), "
        "family_history, social_history, review_of_systems"
    )

    try:
        response = llm_client.chat(prompt, [], system_prompt="Extract structured data from the conversation. Return valid JSON only.")
        return llm_client.extract_json(response)
    except Exception:
        return {"raw_conversation": conversation}


def get_intake_session(session_id: str) -> dict | None:
    """Get intake session data."""
    return _intake_sessions.get(session_id)
