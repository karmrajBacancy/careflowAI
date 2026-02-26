"""Tests for the Whisper transcription module."""

import pytest
from pathlib import Path


def test_transcribe_missing_file():
    """Test that missing audio file raises FileNotFoundError."""
    from modules.ambient_doc.transcriber import transcribe_audio
    with pytest.raises(FileNotFoundError):
        transcribe_audio("/nonexistent/audio.wav")


def test_transcription_result_structure():
    """Test that transcription returns expected structure (requires actual audio)."""
    # This test requires a real audio file — skip in CI
    sample = Path(__file__).parent.parent.parent / "data" / "sample_audio" / "test.wav"
    if not sample.exists():
        pytest.skip("No sample audio file available")

    from modules.ambient_doc.transcriber import transcribe_audio
    result = transcribe_audio(sample)
    assert "transcript" in result
    assert "language" in result
    assert "duration_seconds" in result
    assert "segments" in result
