from __future__ import annotations

"""API endpoints for ambient clinical documentation."""

import uuid
import logging
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session

from config import settings
from database.db import get_db
from database.schemas import Encounter, ClinicalNote, Patient
from modules.shared.models import (
    NoteGenerationRequest,
    NoteGenerationResponse,
    TranscriptionResponse,
    CodeSuggestionRequest,
    CodeSuggestionResponse,
    NoteUpdateRequest,
)
from modules.ambient_doc.transcriber import transcribe_audio
from modules.ambient_doc.note_generator import generate_note
from modules.ambient_doc.code_suggester import suggest_codes
from modules.auth.utils import get_current_user, get_hospital_id

logger = logging.getLogger(__name__)
router = APIRouter(
    prefix="/api/ambient",
    tags=["Ambient Documentation"],
    dependencies=[Depends(get_current_user)],
)


@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio_endpoint(
    file: UploadFile = File(...),
    language: str = "en",
):
    """Upload an audio file and get a transcript."""
    # Validate file size
    contents = await file.read()
    if len(contents) > settings.MAX_AUDIO_SIZE_MB * 1024 * 1024:
        raise HTTPException(413, f"File too large. Max size: {settings.MAX_AUDIO_SIZE_MB}MB")

    # Save temporarily
    file_ext = Path(file.filename or "audio.wav").suffix or ".wav"
    temp_path = settings.UPLOAD_DIR / f"{uuid.uuid4()}{file_ext}"
    temp_path.write_bytes(contents)

    try:
        result = transcribe_audio(temp_path, language=language)
        return TranscriptionResponse(**result)
    except Exception as e:
        logger.error("Transcription failed: %s", e)
        raise HTTPException(500, f"Transcription failed: {str(e)}")
    finally:
        temp_path.unlink(missing_ok=True)


@router.post("/generate-note", response_model=NoteGenerationResponse)
async def generate_note_endpoint(
    request: NoteGenerationRequest,
    db: Session = Depends(get_db),
):
    """Generate a SOAP note from a transcript."""
    if not request.transcript.strip():
        raise HTTPException(400, "Transcript cannot be empty")

    try:
        note = generate_note(request.transcript)

        # Save encounter and note to database
        encounter_id = str(uuid.uuid4())
        encounter = Encounter(
            id=encounter_id,
            patient_id=request.patient_id or "unknown",
            encounter_type=request.encounter_type,
            transcript=request.transcript,
            status="documented",
        )
        db.add(encounter)

        note_record = ClinicalNote(
            id=str(uuid.uuid4()),
            encounter_id=encounter_id,
            subjective=note.subjective,
            objective=note.objective,
            assessment=note.assessment,
            plan=note.plan,
            raw_text=note.raw_text,
            icd10_codes=note.icd10_codes,
        )
        db.add(note_record)
        db.commit()

        return NoteGenerationResponse(note=note, encounter_id=encounter_id)
    except Exception as e:
        logger.error("Note generation failed: %s", e)
        raise HTTPException(500, f"Note generation failed: {str(e)}")


@router.post("/suggest-codes", response_model=CodeSuggestionResponse)
async def suggest_codes_endpoint(request: CodeSuggestionRequest):
    """Suggest ICD-10 and CPT codes from a clinical note."""
    if not request.note_text.strip():
        raise HTTPException(400, "Note text cannot be empty")

    try:
        return suggest_codes(request.note_text, request.encounter_type)
    except Exception as e:
        logger.error("Code suggestion failed: %s", e)
        raise HTTPException(500, f"Code suggestion failed: {str(e)}")


@router.get("/encounters")
async def list_encounters(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List encounters, filtered by hospital_id for hospital admins."""
    hospital_id = get_hospital_id(current_user)

    query = db.query(Encounter)
    if hospital_id:
        query = query.join(Patient, Encounter.patient_id == Patient.id).filter(
            Patient.hospital_id == hospital_id
        )
    encounters = query.order_by(Encounter.date.desc()).limit(50).all()

    return [
        {
            "id": e.id,
            "patient_id": e.patient_id,
            "encounter_type": e.encounter_type,
            "date": e.date.isoformat(),
            "status": e.status,
        }
        for e in encounters
    ]


@router.get("/encounters/{encounter_id}")
async def get_encounter(
    encounter_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get encounter details with notes. Verifies hospital access."""
    encounter = db.query(Encounter).filter(Encounter.id == encounter_id).first()
    if not encounter:
        raise HTTPException(404, "Encounter not found")

    # Verify hospital access
    hospital_id = get_hospital_id(current_user)
    if hospital_id:
        patient = db.query(Patient).filter(Patient.id == encounter.patient_id).first()
        if not patient or patient.hospital_id != hospital_id:
            raise HTTPException(403, "Access denied to this encounter")

    notes = db.query(ClinicalNote).filter(
        ClinicalNote.encounter_id == encounter_id
    ).order_by(ClinicalNote.version.desc()).all()

    return {
        "id": encounter.id,
        "patient_id": encounter.patient_id,
        "encounter_type": encounter.encounter_type,
        "date": encounter.date.isoformat(),
        "transcript": encounter.transcript,
        "status": encounter.status,
        "notes": [
            {
                "id": n.id,
                "version": n.version,
                "subjective": n.subjective,
                "objective": n.objective,
                "assessment": n.assessment,
                "plan": n.plan,
                "icd10_codes": n.icd10_codes,
                "cpt_codes": n.cpt_codes,
                "status": n.status,
                "ai_generated": n.ai_generated,
                "provider_edited": n.provider_edited,
                "created_at": n.created_at.isoformat(),
            }
            for n in notes
        ],
    }


@router.put("/notes/{note_id}")
async def update_note(
    note_id: str,
    request: NoteUpdateRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a clinical note (provider review/edit)."""
    note = db.query(ClinicalNote).filter(ClinicalNote.id == note_id).first()
    if not note:
        raise HTTPException(404, "Note not found")

    # Verify hospital access
    hospital_id = get_hospital_id(current_user)
    if hospital_id:
        encounter = db.query(Encounter).filter(Encounter.id == note.encounter_id).first()
        if encounter:
            patient = db.query(Patient).filter(Patient.id == encounter.patient_id).first()
            if not patient or patient.hospital_id != hospital_id:
                raise HTTPException(403, "Access denied to this note")

    note.raw_text = request.note_text
    note.status = request.status.value
    note.provider_edited = True
    db.commit()

    return {"message": "Note updated", "note_id": note_id, "status": note.status}
