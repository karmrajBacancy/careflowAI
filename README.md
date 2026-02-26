# CareFlow AI

AI-powered clinical documentation and virtual nursing assistant.

## Features

- **Ambient AI Clinical Documentation** — Record doctor-patient conversations, auto-transcribe with Whisper, and generate SOAP notes using Claude
- **Virtual Nursing Assistant** — AI chatbot for patient intake, symptom triage (ESI-based), and post-discharge follow-up
- **ICD-10/CPT Code Suggestions** — AI-powered medical billing code recommendations
- **Safety Guardrails** — Emergency detection, escalation logic, and clinical safety rules

## Tech Stack

- **Backend:** Python + FastAPI
- **Frontend:** React + Vite + TailwindCSS
- **AI Engine:** Claude API (Anthropic)
- **Transcription:** Whisper (faster-whisper, runs locally)
- **Database:** SQLite (local)

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure API Key

Edit `.env` in the project root:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 3. Run Backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 5. Open Browser

Navigate to http://localhost:5173

### 6. Load Sample Data

Click "Load Sample Data" on the dashboard, or:

```bash
curl -X POST http://localhost:8000/api/seed
```

## API Endpoints

### Ambient Documentation
- `POST /api/ambient/transcribe` — Upload audio for transcription
- `POST /api/ambient/generate-note` — Generate SOAP note from transcript
- `POST /api/ambient/suggest-codes` — Suggest ICD-10/CPT codes
- `GET /api/ambient/encounters` — List encounters
- `GET /api/ambient/encounters/{id}` — Get encounter details

### Virtual Nurse
- `POST /api/nurse/chat` — Send chat message
- `POST /api/nurse/intake/start` — Start patient intake
- `POST /api/nurse/intake/{id}/message` — Send intake message
- `POST /api/nurse/triage` — Assess triage level
- `POST /api/nurse/followup/start` — Start follow-up session
- `GET /api/nurse/dashboard/escalations` — Get escalation alerts
- `GET /api/nurse/dashboard/active-sessions` — Get active sessions

### General
- `GET /api/health` — Health check
- `GET /api/patients` — List patients
- `POST /api/seed` — Seed sample data
