# user_profile.py – Pydantic models for the career plan pipeline
#
# Defines the input (UserProfile) and output (CareerPlanResponse) schemas
# for the POST /career-plan endpoint.

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


# ── Request ────────────────────────────────────────────────────

class SkillMetrics(BaseModel):
    """Optional technical / soft-skill scores.

    Only relevant for college students and professionals where the ML
    readiness model can run.  All fields are optional — the system
    gracefully skips prediction when they are absent.
    """
    gpa: Optional[float] = Field(None, ge=0, le=10, description="Grade Point Average (0-10)")
    internships: Optional[int] = Field(None, ge=0, le=10, description="Number of internships")
    projects: Optional[int] = Field(None, ge=0, le=10, description="Number of projects")
    certifications: Optional[int] = Field(None, ge=0, le=10, description="Number of certifications")
    soft_skills_score: Optional[float] = Field(None, ge=1, le=10, description="Soft skills score (1-10)")
    networking_score: Optional[float] = Field(None, ge=1, le=10, description="Networking score (1-10)")


class UserProfile(BaseModel):
    """Top-level input for the career plan endpoint."""
    current_stage: str = Field(
        ...,
        description="User's current stage, e.g. 'Class 10', 'Undergraduate', 'Working Professional'",
    )
    target_career: str = Field(
        ...,
        description="Target career goal, e.g. 'IAS', 'Software Engineer', 'Chef', 'Lawyer'",
    )
    current_role: Optional[str] = Field(
        None,
        description="Current job title / role for working professionals, e.g. 'System Engineer at Infosys'",
    )
    skills: Optional[SkillMetrics] = Field(
        None,
        description="Optional skill metrics for ML-based readiness prediction",
    )


# ── Response sub-models ────────────────────────────────────────

class StageStep(BaseModel):
    """A single stage on the career path."""
    stage: str
    label: str
    tasks: list[str]
    status: str = Field(
        ...,
        description="'completed' | 'current' | 'upcoming'",
    )


class SkillGapItem(BaseModel):
    """One identified skill gap."""
    skill: str
    status: str
    priority: str
    recommendation: str


class ReadinessPrediction(BaseModel):
    """ML-based readiness prediction (only for eligible users)."""
    career_readiness: str
    confidence: float


class CareerPlanResponse(BaseModel):
    """Full response from the career plan pipeline."""
    target_career: str
    current_stage: str
    current_role: Optional[str] = None
    is_custom_career: bool = False
    career_path: list[StageStep]
    next_steps: list[str]
    skill_gaps: list[SkillGapItem]
    readiness: Optional[ReadinessPrediction] = None
    roadmap: dict
