"""Auth API endpoints — login and current-user info."""

import logging
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.db import get_db
from database.schemas import AdminUser
from modules.auth.utils import verify_password, create_token, get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate and return a JWT."""
    user = db.query(AdminUser).filter(AdminUser.username == request.username).first()

    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")

    token_data = {"sub": user.username, "role": user.role}
    if user.hospital_id:
        token_data["hospital_id"] = user.hospital_id

    token = create_token(token_data)

    response = {
        "access_token": token,
        "token_type": "bearer",
        "username": user.username,
        "role": user.role,
    }

    if user.hospital_id:
        response["hospital_id"] = user.hospital_id
        if user.hospital:
            response["hospital_name"] = user.hospital.name

    return response


@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    """Return the currently authenticated user."""
    result = {"username": current_user["sub"], "role": current_user["role"]}
    if "hospital_id" in current_user:
        result["hospital_id"] = current_user["hospital_id"]
    return result
