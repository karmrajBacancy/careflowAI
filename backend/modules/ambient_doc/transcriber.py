from __future__ import annotations

"""Whisper-based local speech-to-text transcription."""

import logging
from pathlib import Path
from config import settings

logger = logging.getLogger(__name__)

_model = None


def get_whisper_model():
    """Lazy-load the Whisper model."""
    from faster_whisper import WhisperModel
    global _model
    if _model is None:
        logger.info(
            "Loading Whisper model: %s (device=%s, compute=%s)",
            settings.WHISPER_MODEL_SIZE,
            settings.WHISPER_DEVICE,
            settings.WHISPER_COMPUTE_TYPE,
        )
        _model = WhisperModel(
            settings.WHISPER_MODEL_SIZE,
            device=settings.WHISPER_DEVICE,
            compute_type=settings.WHISPER_COMPUTE_TYPE,
        )
        logger.info("Whisper model loaded successfully")
    return _model


def transcribe_audio(
    audio_path: str | Path,
    language: str = "en",
) -> dict:
    """Transcribe an audio file to text.

    Args:
        audio_path: Path to the audio file.
        language: Language code for transcription.

    Returns:
        Dict with transcript, language, duration, and segments.
    """
    model = get_whisper_model()
    audio_path = Path(audio_path)

    if not audio_path.exists():
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    logger.info("Transcribing: %s", audio_path.name)

    segments, info = model.transcribe(
        str(audio_path),
        language=language,
        beam_size=5,
        vad_filter=True,  # Filter out non-speech
        vad_parameters=dict(min_silence_duration_ms=500),
    )

    # Collect all segments
    transcript_parts = []
    segment_list = []
    for segment in segments:
        transcript_parts.append(segment.text.strip())
        segment_list.append({
            "start": round(segment.start, 2),
            "end": round(segment.end, 2),
            "text": segment.text.strip(),
        })

    full_transcript = " ".join(transcript_parts)

    logger.info(
        "Transcription complete: %.1fs audio, %d segments",
        info.duration,
        len(segment_list),
    )

    return {
        "transcript": full_transcript,
        "language": info.language,
        "duration_seconds": round(info.duration, 2),
        "segments": segment_list,
    }
