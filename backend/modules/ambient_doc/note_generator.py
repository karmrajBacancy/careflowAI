from __future__ import annotations

"""Claude LLM-powered SOAP/H&P clinical note generation."""

import logging
import re
from modules.shared.claude_client import llm_client
from modules.shared.models import SOAPNote

logger = logging.getLogger(__name__)


def generate_note(transcript: str) -> SOAPNote:
    """Generate a structured SOAP note from an encounter transcript.

    Args:
        transcript: The transcribed doctor-patient conversation.

    Returns:
        A structured SOAPNote object.
    """
    logger.info("Generating SOAP note from transcript (%d chars)", len(transcript))

    raw_text = llm_client.generate_soap_note(transcript)

    note = parse_soap_note(raw_text)
    logger.info("SOAP note generated successfully")
    return note


def parse_soap_note(text: str) -> SOAPNote:
    """Parse Claude's response into structured SOAP sections."""
    sections = {
        "subjective": "",
        "objective": "",
        "assessment": "",
        "plan": "",
    }

    # Match sections by headers (## Subjective, **Subjective**, Subjective:, S:, etc.)
    patterns = [
        (r"(?:#{1,3}\s*)?(?:\*{0,2})(?:S(?:ubjective)?)\s*[:：\*]*\s*\n?(.*?)(?=(?:#{1,3}\s*)?(?:\*{0,2})(?:O(?:bjective)?)\s*[:：\*]|\Z)",
         "subjective"),
        (r"(?:#{1,3}\s*)?(?:\*{0,2})(?:O(?:bjective)?)\s*[:：\*]*\s*\n?(.*?)(?=(?:#{1,3}\s*)?(?:\*{0,2})(?:A(?:ssessment)?)\s*[:：\*]|\Z)",
         "objective"),
        (r"(?:#{1,3}\s*)?(?:\*{0,2})(?:A(?:ssessment)?)\s*[:：\*]*\s*\n?(.*?)(?=(?:#{1,3}\s*)?(?:\*{0,2})(?:P(?:lan)?)\s*[:：\*]|\Z)",
         "assessment"),
        (r"(?:#{1,3}\s*)?(?:\*{0,2})(?:P(?:lan)?)\s*[:：\*]*\s*\n?(.*?)(?=\Z)",
         "plan"),
    ]

    for pattern, section in patterns:
        match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        if match:
            sections[section] = match.group(1).strip()

    # Extract ICD-10 codes from the text
    icd10_codes = extract_icd10_codes(text)

    return SOAPNote(
        subjective=sections["subjective"],
        objective=sections["objective"],
        assessment=sections["assessment"],
        plan=sections["plan"],
        icd10_codes=icd10_codes,
        raw_text=text,
    )


def extract_icd10_codes(text: str) -> list[dict]:
    """Extract ICD-10 codes mentioned in the note text."""
    # Match patterns like G43.909, J06.9, M54.5
    code_pattern = r"([A-Z]\d{2}(?:\.\d{1,4})?)"
    matches = re.findall(code_pattern, text)

    codes = []
    seen = set()
    for code in matches:
        if code not in seen:
            seen.add(code)
            codes.append({"code": code, "source": "auto-extracted"})
    return codes
