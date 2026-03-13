# user_model.py – Pydantic schemas for authentication
#
# Defines request / response models for signup, login, and profile.

from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, EmailStr, Field


# ── Signup ─────────────────────────────────────────────────────

class UserSignup(BaseModel):
    """Payload for POST /signup."""
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    current_stage: Optional[str] = Field(
        None,
        description="e.g. 'Class 10', 'Undergraduate', 'Working Professional'",
    )
    target_career: Optional[str] = Field(
        None,
        description="e.g. 'Software Engineer', 'Doctor'",
    )


# ── Login ──────────────────────────────────────────────────────

class UserLogin(BaseModel):
    """Payload for POST /login."""
    email: EmailStr
    password: str


# ── Response ───────────────────────────────────────────────────

class TokenResponse(BaseModel):
    """Returned after successful login."""
    access_token: str
    token_type: str = "bearer"


class UserProfileResponse(BaseModel):
    """Returned by GET /profile (no password)."""
    id: str
    name: str
    email: str
    current_stage: Optional[str] = None
    target_career: Optional[str] = None


class UserProfileUpdate(BaseModel):
    """Payload for PATCH /profile."""
    current_stage: Optional[str] = Field(None, min_length=1, max_length=100)
    target_career: Optional[str] = Field(None, min_length=1, max_length=100)
