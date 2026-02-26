"""CareFlow AI — FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database.db import init_db, SessionLocal
from modules.ambient_doc.router import router as ambient_router
from modules.virtual_nurse.router import router as nurse_router
from modules.auth.router import router as auth_router
from modules.hospitals.router import router as hospitals_router
from modules.auth.utils import get_current_user, get_hospital_id, hash_password

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

DEFAULT_ADMIN_USERNAME = "admin"
DEFAULT_ADMIN_PASSWORD = "admin123"


def _ensure_default_admin():
    """Create or upgrade the default admin user to super_admin."""
    from database.schemas import AdminUser

    db = SessionLocal()
    try:
        existing = db.query(AdminUser).filter(AdminUser.username == DEFAULT_ADMIN_USERNAME).first()
        if not existing:
            admin = AdminUser(
                username=DEFAULT_ADMIN_USERNAME,
                hashed_password=hash_password(DEFAULT_ADMIN_PASSWORD),
                role="super_admin",
            )
            db.add(admin)
            db.commit()
            logger.info("Default super_admin user created (username: %s)", DEFAULT_ADMIN_USERNAME)
        elif existing.role != "super_admin":
            existing.role = "super_admin"
            existing.hospital_id = None
            db.commit()
            logger.info("Upgraded admin user '%s' to super_admin", DEFAULT_ADMIN_USERNAME)
        else:
            logger.info("Super admin user already exists")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown."""
    logger.info("Starting CareFlow AI v%s", settings.VERSION)
    db_display = settings.DATABASE_URL.split("@")[-1] if "@" in settings.DATABASE_URL else settings.DATABASE_URL
    logger.info("Connecting to database: %s", db_display)
    init_db()
    logger.info("Database initialized successfully")
    _ensure_default_admin()

    if not settings.ANTHROPIC_API_KEY:
        logger.warning("ANTHROPIC_API_KEY not set — Claude features will fail")

    yield
    logger.info("Shutting down CareFlow AI")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-powered clinical documentation and virtual nursing assistant",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers — auth is public, others are protected via their own dependencies
app.include_router(auth_router)
app.include_router(hospitals_router)
app.include_router(ambient_router)
app.include_router(nurse_router)


@app.get("/")
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "running",
    }


@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "claude_configured": bool(settings.ANTHROPIC_API_KEY),
        "whisper_model": settings.WHISPER_MODEL_SIZE,
    }


@app.get("/api/patients")
async def list_patients(current_user: dict = Depends(get_current_user)):
    """List patients filtered by hospital_id for hospital admins."""
    from database.schemas import Patient

    hospital_id = get_hospital_id(current_user)

    db = SessionLocal()
    try:
        query = db.query(Patient).order_by(Patient.last_name)
        if hospital_id:
            query = query.filter(Patient.hospital_id == hospital_id)
        patients = query.all()
        return [
            {
                "id": p.id,
                "first_name": p.first_name,
                "last_name": p.last_name,
                "date_of_birth": p.date_of_birth,
                "sex": p.sex,
                "medical_history": p.medical_history,
                "allergies": p.allergies,
                "medications": p.medications,
            }
            for p in patients
        ]
    finally:
        db.close()


@app.post("/api/seed")
async def seed_data(_user: dict = Depends(get_current_user)):
    """Seed the database with sample data. Requires auth."""
    from database.seed_data import seed_database
    seed_database()
    return {"message": "Database seeded successfully"}
