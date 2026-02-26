"""Hospital CRUD API — super admin only."""

import re
import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import func

from database.db import get_db
from database.schemas import Hospital, AdminUser, Patient, gen_id
from modules.auth.utils import require_super_admin, hash_password

logger = logging.getLogger(__name__)
router = APIRouter(
    prefix="/api/hospitals",
    tags=["Hospitals"],
    dependencies=[Depends(require_super_admin)],
)


# --- Request / Response models ---

class HospitalCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    slug: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None


class HospitalUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None


class HospitalAdminCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


def _slugify(name: str) -> str:
    """Convert a hospital name to a URL-friendly slug."""
    slug = name.lower().strip()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-")


# --- Endpoints ---

@router.get("")
async def list_hospitals(db: Session = Depends(get_db)):
    """List all hospitals with admin and patient counts."""
    hospitals = db.query(Hospital).order_by(Hospital.created_at.desc()).all()

    result = []
    for h in hospitals:
        admin_count = db.query(func.count(AdminUser.id)).filter(AdminUser.hospital_id == h.id).scalar()
        patient_count = db.query(func.count(Patient.id)).filter(Patient.hospital_id == h.id).scalar()
        result.append({
            "id": h.id,
            "name": h.name,
            "slug": h.slug,
            "address": h.address,
            "phone": h.phone,
            "email": h.email,
            "is_active": h.is_active,
            "admin_count": admin_count,
            "patient_count": patient_count,
            "created_at": h.created_at.isoformat(),
        })
    return result


@router.post("", status_code=201)
async def create_hospital(request: HospitalCreate, db: Session = Depends(get_db)):
    """Create a new hospital."""
    slug = request.slug or _slugify(request.name)

    if db.query(Hospital).filter(Hospital.slug == slug).first():
        raise HTTPException(400, f"Hospital with slug '{slug}' already exists")

    hospital = Hospital(
        id=gen_id(),
        name=request.name,
        slug=slug,
        address=request.address,
        phone=request.phone,
        email=request.email,
    )
    db.add(hospital)
    db.commit()
    db.refresh(hospital)

    return {
        "id": hospital.id,
        "name": hospital.name,
        "slug": hospital.slug,
        "address": hospital.address,
        "phone": hospital.phone,
        "email": hospital.email,
        "is_active": hospital.is_active,
        "created_at": hospital.created_at.isoformat(),
    }


@router.get("/{hospital_id}")
async def get_hospital(hospital_id: str, db: Session = Depends(get_db)):
    """Get hospital detail."""
    hospital = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not hospital:
        raise HTTPException(404, "Hospital not found")

    admin_count = db.query(func.count(AdminUser.id)).filter(AdminUser.hospital_id == hospital_id).scalar()
    patient_count = db.query(func.count(Patient.id)).filter(Patient.hospital_id == hospital_id).scalar()

    return {
        "id": hospital.id,
        "name": hospital.name,
        "slug": hospital.slug,
        "address": hospital.address,
        "phone": hospital.phone,
        "email": hospital.email,
        "is_active": hospital.is_active,
        "admin_count": admin_count,
        "patient_count": patient_count,
        "created_at": hospital.created_at.isoformat(),
        "updated_at": hospital.updated_at.isoformat() if hospital.updated_at else None,
    }


@router.put("/{hospital_id}")
async def update_hospital(hospital_id: str, request: HospitalUpdate, db: Session = Depends(get_db)):
    """Update a hospital."""
    hospital = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not hospital:
        raise HTTPException(404, "Hospital not found")

    for field, value in request.model_dump(exclude_unset=True).items():
        setattr(hospital, field, value)

    db.commit()
    db.refresh(hospital)

    return {
        "id": hospital.id,
        "name": hospital.name,
        "slug": hospital.slug,
        "address": hospital.address,
        "phone": hospital.phone,
        "email": hospital.email,
        "is_active": hospital.is_active,
    }


@router.delete("/{hospital_id}")
async def delete_hospital(hospital_id: str, db: Session = Depends(get_db)):
    """Soft-delete a hospital (set is_active=False)."""
    hospital = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not hospital:
        raise HTTPException(404, "Hospital not found")

    hospital.is_active = False
    db.commit()
    return {"message": "Hospital deactivated", "id": hospital_id}


@router.post("/{hospital_id}/admins", status_code=201)
async def create_hospital_admin(
    hospital_id: str,
    request: HospitalAdminCreate,
    db: Session = Depends(get_db),
):
    """Create an admin user for a hospital."""
    hospital = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not hospital:
        raise HTTPException(404, "Hospital not found")

    if db.query(AdminUser).filter(AdminUser.username == request.username).first():
        raise HTTPException(400, f"Username '{request.username}' already exists")

    admin = AdminUser(
        id=gen_id(),
        username=request.username,
        hashed_password=hash_password(request.password),
        role="hospital_admin",
        hospital_id=hospital_id,
    )
    db.add(admin)
    db.commit()

    return {
        "id": admin.id,
        "username": admin.username,
        "role": admin.role,
        "hospital_id": hospital_id,
        "hospital_name": hospital.name,
    }


@router.get("/{hospital_id}/admins")
async def list_hospital_admins(hospital_id: str, db: Session = Depends(get_db)):
    """List admin users for a hospital."""
    hospital = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not hospital:
        raise HTTPException(404, "Hospital not found")

    admins = db.query(AdminUser).filter(AdminUser.hospital_id == hospital_id).all()
    return [
        {
            "id": a.id,
            "username": a.username,
            "role": a.role,
            "is_active": a.is_active,
            "created_at": a.created_at.isoformat(),
        }
        for a in admins
    ]
