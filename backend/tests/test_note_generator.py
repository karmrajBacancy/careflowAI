"""Tests for the SOAP note generator."""

from modules.ambient_doc.note_generator import parse_soap_note, extract_icd10_codes


def test_parse_soap_note_standard_format():
    """Test parsing a standard SOAP note format."""
    text = """## Subjective
Patient reports headache for 3 days.

## Objective
BP: 120/80, HR: 72

## Assessment
Tension headache (ICD-10: G44.1)

## Plan
1. Acetaminophen PRN
2. Follow-up in 2 weeks"""

    note = parse_soap_note(text)
    assert "headache" in note.subjective.lower()
    assert "120/80" in note.objective
    assert "G44.1" in note.assessment
    assert "Acetaminophen" in note.plan


def test_extract_icd10_codes():
    """Test ICD-10 code extraction."""
    text = "Migraine (G43.909), Hypertension (I10), Type 2 Diabetes (E11.9)"
    codes = extract_icd10_codes(text)
    code_values = [c["code"] for c in codes]
    assert "G43.909" in code_values
    assert "I10" in code_values
    assert "E11.9" in code_values


def test_extract_no_duplicate_codes():
    """Test that duplicate codes are removed."""
    text = "Diagnosis: I10 (Hypertension). Patient has I10 documented previously."
    codes = extract_icd10_codes(text)
    code_values = [c["code"] for c in codes]
    assert code_values.count("I10") == 1


def test_parse_empty_note():
    """Test parsing an empty string."""
    note = parse_soap_note("")
    assert note.subjective == ""
    assert note.objective == ""
    assert note.assessment == ""
    assert note.plan == ""
