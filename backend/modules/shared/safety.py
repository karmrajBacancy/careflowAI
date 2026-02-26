from __future__ import annotations

"""Clinical safety guardrails and escalation logic."""

import re

# Emergency keywords that trigger immediate escalation
EMERGENCY_KEYWORDS = [
    "chest pain",
    "can't breathe",
    "cannot breathe",
    "difficulty breathing",
    "shortness of breath",
    "heart attack",
    "stroke",
    "seizure",
    "unconscious",
    "unresponsive",
    "severe bleeding",
    "bleeding heavily",
    "suicidal",
    "kill myself",
    "want to die",
    "end my life",
    "self harm",
    "self-harm",
    "overdose",
    "anaphylaxis",
    "allergic reaction severe",
    "choking",
    "head injury",
    "loss of consciousness",
]

# Phrases that indicate the AI is overstepping
DIAGNOSIS_PATTERNS = [
    r"you have \w+",
    r"you are diagnosed with",
    r"your diagnosis is",
    r"you are suffering from",
    r"this is definitely",
    r"this is clearly",
    r"you should take \w+ mg",
    r"take \d+ pills",
    r"increase your dose",
    r"decrease your dose",
    r"stop taking your medication",
]

EMERGENCY_RESPONSE = (
    "⚠️ This sounds like it could be an emergency. "
    "Please call 911 or go to the nearest emergency room immediately. "
    "Do not wait — your safety is the top priority."
)

AI_DISCLOSURE = (
    "I'm an AI nursing assistant, not a human nurse or doctor. "
    "I can help collect information and answer general questions, "
    "but your healthcare provider will make all medical decisions."
)


def check_emergency(text: str) -> tuple[bool, str | None]:
    """Check if text contains emergency indicators.

    Returns (is_emergency, matched_keyword).
    """
    text_lower = text.lower()
    for keyword in EMERGENCY_KEYWORDS:
        if keyword in text_lower:
            return True, keyword
    return False, None


def check_response_safety(response: str) -> tuple[bool, list[str]]:
    """Check if an AI response contains unsafe content like diagnoses or prescriptions.

    Returns (is_safe, list of violations).
    """
    violations = []
    response_lower = response.lower()

    for pattern in DIAGNOSIS_PATTERNS:
        if re.search(pattern, response_lower):
            violations.append(f"Potential diagnosis/prescription detected: matched pattern '{pattern}'")

    return len(violations) == 0, violations


def sanitize_response(response: str) -> str:
    """Add safety disclaimers to response if needed."""
    is_safe, violations = check_response_safety(response)
    if not is_safe:
        response += (
            "\n\n*Please note: I am an AI assistant and cannot diagnose conditions "
            "or prescribe treatments. Please discuss this with your healthcare provider.*"
        )
    return response


def should_escalate(message: str, context: list[str] | None = None) -> dict:
    """Determine if a patient interaction should be escalated to a human nurse.

    Returns escalation decision with reason.
    """
    is_emergency, keyword = check_emergency(message)
    if is_emergency:
        return {
            "escalate": True,
            "urgency": "immediate",
            "reason": f"Emergency keyword detected: {keyword}",
            "response": EMERGENCY_RESPONSE,
        }

    # Check for repeated distress or confusion
    if context:
        distress_count = sum(
            1 for msg in context[-5:]
            if any(w in msg.lower() for w in ["confused", "scared", "worried", "don't understand", "help me"])
        )
        if distress_count >= 3:
            return {
                "escalate": True,
                "urgency": "high",
                "reason": "Patient showing signs of significant distress or confusion",
                "response": (
                    "I can see you're feeling worried. Let me connect you with a nurse "
                    "who can help you directly. Please hold on."
                ),
            }

    return {"escalate": False, "urgency": "none", "reason": None, "response": None}
