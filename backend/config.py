import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv

# Load .env from project root
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)


class Settings:
    PROJECT_NAME: str = "CareFlow AI"
    VERSION: str = "0.1.0"

    # LLM Provider ("groq" or "claude")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "groq")

    # Claude API
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    CLAUDE_MODEL: str = os.getenv("CLAUDE_MODEL", "claude-sonnet-4-20250514")
    CLAUDE_MAX_TOKENS: int = int(os.getenv("CLAUDE_MAX_TOKENS", "4096"))

    # Groq API
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    # Whisper
    WHISPER_MODEL_SIZE: str = os.getenv("WHISPER_MODEL_SIZE", "base")
    WHISPER_DEVICE: str = os.getenv("WHISPER_DEVICE", "cpu")
    WHISPER_COMPUTE_TYPE: str = os.getenv("WHISPER_COMPUTE_TYPE", "int8")

    # Database
    _raw_db_url: str = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{Path(__file__).resolve().parent / 'database' / 'careflow.db'}",
    )
    # Render/Heroku use postgres:// but SQLAlchemy requires postgresql://
    DATABASE_URL: str = _raw_db_url.replace("postgres://", "postgresql://", 1) if _raw_db_url.startswith("postgres://") else _raw_db_url

    # Audio
    UPLOAD_DIR: Path = Path(__file__).resolve().parent / "uploads"
    MAX_AUDIO_SIZE_MB: int = 50

    # JWT Auth
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "change-me-in-production")
    JWT_EXPIRY_HOURS: int = int(os.getenv("JWT_EXPIRY_HOURS", "24"))

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "https://careflow-ai-alpha.vercel.app",
    ] + [o for o in os.getenv("EXTRA_CORS_ORIGINS", "").split(",") if o]


settings = Settings()
settings.UPLOAD_DIR.mkdir(exist_ok=True)
