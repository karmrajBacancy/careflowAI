from __future__ import annotations

"""Claude-powered medical chat engine with guardrails."""

import uuid
import logging
from modules.shared.claude_client import claude_client
from modules.shared.safety import check_emergency, sanitize_response, should_escalate, EMERGENCY_RESPONSE, AI_DISCLOSURE

logger = logging.getLogger(__name__)

# In-memory session store (maps session_id -> message history)
_sessions: dict[str, list[dict]] = {}


def get_or_create_session(session_id: str | None = None) -> tuple[str, list[dict]]:
    """Get existing session or create a new one."""
    if session_id and session_id in _sessions:
        return session_id, _sessions[session_id]
    new_id = session_id or str(uuid.uuid4())
    _sessions[new_id] = []
    return new_id, _sessions[new_id]


def chat(
    message: str,
    session_id: str | None = None,
    system_prompt: str | None = None,
) -> dict:
    """Process a patient chat message with safety guardrails.

    Returns dict with response, session_id, escalation info.
    """
    sid, history = get_or_create_session(session_id)

    # Check for emergency before processing
    is_emergency, keyword = check_emergency(message)
    if is_emergency:
        history.append({"role": "user", "content": message})
        history.append({"role": "assistant", "content": EMERGENCY_RESPONSE})
        return {
            "message": EMERGENCY_RESPONSE,
            "session_id": sid,
            "escalation": True,
            "escalation_reason": f"Emergency keyword: {keyword}",
        }

    # Check if escalation is warranted based on context
    context_msgs = [m["content"] for m in history if m["role"] == "user"]
    escalation = should_escalate(message, context_msgs)
    if escalation["escalate"]:
        history.append({"role": "user", "content": message})
        history.append({"role": "assistant", "content": escalation["response"]})
        return {
            "message": escalation["response"],
            "session_id": sid,
            "escalation": True,
            "escalation_reason": escalation["reason"],
        }

    # Call Claude with conversation history
    try:
        response = claude_client.chat(message, history, system_prompt=system_prompt)
        response = sanitize_response(response)

        # Prepend AI disclosure on first message
        if not history:
            response = f"{AI_DISCLOSURE}\n\n{response}"

        history.append({"role": "user", "content": message})
        history.append({"role": "assistant", "content": response})

        return {
            "message": response,
            "session_id": sid,
            "escalation": False,
            "escalation_reason": None,
        }
    except Exception as e:
        logger.error("Chat engine error: %s", e)
        fallback = (
            "I'm sorry, I'm having trouble processing your message right now. "
            "If this is an emergency, please call 911. Otherwise, please try again."
        )
        return {
            "message": fallback,
            "session_id": sid,
            "escalation": False,
            "escalation_reason": None,
        }


def get_session_history(session_id: str) -> list[dict]:
    """Get the message history for a session."""
    return _sessions.get(session_id, [])


def clear_session(session_id: str) -> bool:
    """Clear a session's history."""
    if session_id in _sessions:
        del _sessions[session_id]
        return True
    return False
