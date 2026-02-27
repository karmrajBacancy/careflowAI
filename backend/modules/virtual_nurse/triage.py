from __future__ import annotations

"""ESI-based symptom triage engine powered by Claude."""

import logging
from modules.shared.claude_client import llm_client
from modules.shared.models import TriageResult, ESILevel
from modules.shared.safety import check_emergency, EMERGENCY_RESPONSE

logger = logging.getLogger(__name__)


def assess_triage(
    symptoms: str,
    patient_age: int | None = None,
    patient_sex: str | None = None,
    medical_history: list[str] | None = None,
    current_medications: list[str] | None = None,
) -> TriageResult:
    """Assess patient symptoms and assign ESI triage level.

    Args:
        symptoms: Description of patient symptoms.
        patient_age: Patient's age.
        patient_sex: Patient's sex (M/F).
        medical_history: List of past medical conditions.
        current_medications: List of current medications.

    Returns:
        TriageResult with ESI level and reasoning.
    """
    # Check for immediate emergencies first
    is_emergency, keyword = check_emergency(symptoms)
    if is_emergency:
        return TriageResult(
            esi_level=ESILevel.IMMEDIATE,
            reasoning=f"Emergency keyword detected: {keyword}. Immediate attention required.",
            key_symptoms=[keyword],
            recommended_action=EMERGENCY_RESPONSE,
            escalate_to_nurse=True,
            red_flags=[keyword],
        )

    # Build patient info string
    info_parts = []
    if patient_age:
        info_parts.append(f"Age: {patient_age}")
    if patient_sex:
        info_parts.append(f"Sex: {patient_sex}")
    if medical_history:
        info_parts.append(f"Medical history: {', '.join(medical_history)}")
    if current_medications:
        info_parts.append(f"Current medications: {', '.join(current_medications)}")
    patient_info = "; ".join(info_parts)

    logger.info("Running triage assessment for symptoms: %s...", symptoms[:100])

    try:
        raw_response = llm_client.triage(symptoms, patient_info)
        data = llm_client.extract_json(raw_response)

        if not data:
            logger.warning("Could not parse triage response, defaulting to ESI-3")
            return TriageResult(
                esi_level=ESILevel.URGENT,
                reasoning="Unable to fully assess — defaulting to urgent for safety.",
                key_symptoms=[symptoms[:100]],
                recommended_action="Please see a healthcare provider for evaluation.",
                escalate_to_nurse=True,
                red_flags=[],
            )

        esi = data.get("esi_level", 3)
        esi = max(1, min(5, int(esi)))

        result = TriageResult(
            esi_level=ESILevel(esi),
            reasoning=data.get("reasoning", ""),
            key_symptoms=data.get("key_symptoms", []),
            recommended_action=data.get("recommended_action", ""),
            escalate_to_nurse=data.get("escalate_to_nurse", esi <= 2),
            red_flags=data.get("red_flags", []),
        )

        logger.info("Triage result: ESI-%d, escalate=%s", result.esi_level, result.escalate_to_nurse)
        return result

    except Exception as e:
        logger.error("Triage assessment failed: %s", e)
        return TriageResult(
            esi_level=ESILevel.URGENT,
            reasoning=f"Assessment error — defaulting to urgent for safety: {str(e)}",
            key_symptoms=[],
            recommended_action="Please see a healthcare provider for evaluation.",
            escalate_to_nurse=True,
            red_flags=[],
        )
