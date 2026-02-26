from __future__ import annotations

"""Claude API wrapper with medical system prompts."""

import json
import anthropic
from config import settings
from modules.shared.medical_prompts import (
    AMBIENT_DOCUMENTATION_SYSTEM,
    VIRTUAL_NURSE_SYSTEM,
    TRIAGE_SYSTEM,
    CODE_SUGGESTION_SYSTEM,
    INTAKE_SYSTEM,
    FOLLOWUP_SYSTEM,
    SOAP_NOTE_EXAMPLE,
)


class ClaudeClient:
    """Wrapper around the Anthropic Claude API for medical use cases."""

    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.model = settings.CLAUDE_MODEL
        self.max_tokens = settings.CLAUDE_MAX_TOKENS

    def _call(
        self,
        system: str,
        messages: list[dict],
        max_tokens: int | None = None,
        temperature: float = 0.3,
    ) -> str:
        """Make a Claude API call."""
        response = self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens or self.max_tokens,
            temperature=temperature,
            system=system,
            messages=messages,
        )
        return response.content[0].text

    def generate_soap_note(self, transcript: str) -> str:
        """Generate a SOAP note from a clinical encounter transcript."""
        system = AMBIENT_DOCUMENTATION_SYSTEM + "\n\n" + SOAP_NOTE_EXAMPLE
        messages = [
            {
                "role": "user",
                "content": f"Generate a SOAP note from this encounter transcript:\n\n{transcript}",
            }
        ]
        return self._call(system, messages)

    def suggest_codes(self, note_text: str, encounter_type: str = "office_visit") -> str:
        """Suggest ICD-10/CPT codes from a clinical note."""
        messages = [
            {
                "role": "user",
                "content": (
                    f"Analyze this clinical note and suggest ICD-10 and CPT codes.\n"
                    f"Encounter type: {encounter_type}\n\n"
                    f"Clinical Note:\n{note_text}"
                ),
            }
        ]
        return self._call(CODE_SUGGESTION_SYSTEM, messages)

    def chat(
        self,
        message: str,
        history: list[dict],
        system_prompt: str | None = None,
    ) -> str:
        """Send a chat message with conversation history."""
        system = system_prompt or VIRTUAL_NURSE_SYSTEM
        messages = history + [{"role": "user", "content": message}]
        return self._call(system, messages, temperature=0.5)

    def intake_chat(self, message: str, history: list[dict]) -> str:
        """Chat for patient intake flow."""
        return self.chat(message, history, system_prompt=INTAKE_SYSTEM)

    def followup_chat(
        self,
        message: str,
        history: list[dict],
        context: str = "",
    ) -> str:
        """Chat for post-discharge follow-up."""
        system = FOLLOWUP_SYSTEM
        if context:
            system += f"\n\nPatient context:\n{context}"
        return self.chat(message, history, system_prompt=system)

    def triage(self, symptoms: str, patient_info: str = "") -> str:
        """Perform symptom triage."""
        prompt = f"Assess the following patient:\n\n"
        if patient_info:
            prompt += f"Patient info: {patient_info}\n\n"
        prompt += f"Symptoms: {symptoms}\n\nProvide triage assessment as JSON."
        messages = [{"role": "user", "content": prompt}]
        return self._call(TRIAGE_SYSTEM, messages, temperature=0.2)

    def extract_json(self, text: str) -> dict:
        """Extract JSON from Claude's response, handling markdown code blocks."""
        # Try direct parse first
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass
        # Try extracting from code block
        if "```" in text:
            start = text.find("```")
            end = text.rfind("```")
            block = text[start:end]
            # Remove the opening ``` and optional language tag
            first_newline = block.find("\n")
            if first_newline != -1:
                block = block[first_newline + 1:]
            try:
                return json.loads(block)
            except json.JSONDecodeError:
                pass
        # Try finding JSON object in text
        brace_start = text.find("{")
        brace_end = text.rfind("}") + 1
        if brace_start != -1 and brace_end > brace_start:
            try:
                return json.loads(text[brace_start:brace_end])
            except json.JSONDecodeError:
                pass
        return {}


# Singleton instance
claude_client = ClaudeClient()
