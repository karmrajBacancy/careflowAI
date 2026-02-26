"""Tests for the chat engine."""

from modules.virtual_nurse.chat_engine import get_or_create_session, clear_session


def test_create_new_session():
    """Test creating a new chat session."""
    sid, history = get_or_create_session()
    assert sid is not None
    assert isinstance(history, list)
    assert len(history) == 0
    # Cleanup
    clear_session(sid)


def test_get_existing_session():
    """Test retrieving an existing session."""
    sid1, history1 = get_or_create_session()
    history1.append({"role": "user", "content": "hello"})

    sid2, history2 = get_or_create_session(sid1)
    assert sid1 == sid2
    assert len(history2) == 1
    assert history2[0]["content"] == "hello"
    # Cleanup
    clear_session(sid1)


def test_clear_session():
    """Test clearing a session."""
    sid, _ = get_or_create_session()
    assert clear_session(sid) is True
    assert clear_session(sid) is False  # Already cleared


def test_clear_nonexistent_session():
    """Test clearing a session that doesn't exist."""
    assert clear_session("nonexistent-id") is False
