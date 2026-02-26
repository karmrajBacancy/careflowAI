"""Tests for the triage engine."""

from modules.shared.safety import check_emergency, should_escalate


def test_emergency_detection_chest_pain():
    """Test that chest pain triggers emergency."""
    is_emergency, keyword = check_emergency("I'm having severe chest pain")
    assert is_emergency is True
    assert keyword == "chest pain"


def test_emergency_detection_suicidal():
    """Test that suicidal ideation triggers emergency."""
    is_emergency, keyword = check_emergency("I want to kill myself")
    assert is_emergency is True
    assert keyword == "kill myself"


def test_emergency_detection_breathing():
    """Test that breathing difficulty triggers emergency."""
    is_emergency, keyword = check_emergency("I can't breathe properly")
    assert is_emergency is True


def test_no_emergency_for_normal_symptoms():
    """Test that normal symptoms don't trigger emergency."""
    is_emergency, _ = check_emergency("I have a mild headache and runny nose")
    assert is_emergency is False


def test_escalation_for_emergency():
    """Test that emergency triggers escalation."""
    result = should_escalate("I'm having chest pain")
    assert result["escalate"] is True
    assert result["urgency"] == "immediate"


def test_no_escalation_for_normal_message():
    """Test that normal message doesn't trigger escalation."""
    result = should_escalate("I'd like to schedule a checkup")
    assert result["escalate"] is False


def test_escalation_for_repeated_distress():
    """Test that repeated distress triggers escalation."""
    context = [
        "I'm confused about my medication",
        "I'm scared about these symptoms",
        "I don't understand what's happening",
    ]
    result = should_escalate("Help me please", context)
    assert result["escalate"] is True
    assert result["urgency"] == "high"
