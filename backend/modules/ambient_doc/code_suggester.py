from __future__ import annotations

"""Claude LLM-powered ICD-10/CPT code suggestions."""

import logging
from modules.shared.claude_client import llm_client
from modules.shared.models import CodeSuggestionResponse, CodeSuggestion

logger = logging.getLogger(__name__)


def suggest_codes(note_text: str, encounter_type: str = "office_visit") -> CodeSuggestionResponse:
    """Analyze a clinical note and suggest ICD-10/CPT codes.

    Args:
        note_text: The clinical note text to analyze.
        encounter_type: Type of encounter (office_visit, telehealth, etc.).

    Returns:
        CodeSuggestionResponse with suggested codes.
    """
    logger.info("Suggesting codes for note (%d chars)", len(note_text))

    raw_response = llm_client.suggest_codes(note_text, encounter_type)
    data = llm_client.extract_json(raw_response)

    if not data:
        logger.warning("Could not parse code suggestions from Claude response")
        return CodeSuggestionResponse()

    icd10 = [
        CodeSuggestion(
            code=c.get("code", ""),
            description=c.get("description", ""),
            confidence=c.get("confidence", "low"),
            evidence=c.get("evidence", ""),
        )
        for c in data.get("icd10_codes", [])
    ]

    cpt = [
        CodeSuggestion(
            code=c.get("code", ""),
            description=c.get("description", ""),
            confidence=c.get("confidence", "low"),
            evidence=c.get("evidence", ""),
        )
        for c in data.get("cpt_codes", [])
    ]

    result = CodeSuggestionResponse(
        icd10_codes=icd10,
        cpt_codes=cpt,
        em_level=data.get("em_level", ""),
        documentation_gaps=data.get("documentation_gaps", []),
    )

    logger.info("Suggested %d ICD-10 and %d CPT codes", len(icd10), len(cpt))
    return result
