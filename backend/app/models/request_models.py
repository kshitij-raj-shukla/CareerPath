# request_models.py – Pydantic schemas for API request / response validation
#
# All models used by the predict route and other endpoints are defined here
# to keep a single source of truth for the API contract.

from pydantic import BaseModel, Field


# ── Request ────────────────────────────────────────────────────

class ProfileInput(BaseModel):
    """User profile submitted for career readiness prediction."""
    gpa: float = Field(..., ge=5, le=10, description="Grade Point Average (5-10)")
    internships: int = Field(..., ge=0, le=4, description="Number of internships (0-4)")
    projects: int = Field(..., ge=0, le=6, description="Number of projects (0-6)")
    certifications: int = Field(..., ge=0, le=5, description="Number of certifications (0-5)")
    soft_skills_score: float = Field(..., ge=1, le=10, description="Soft skills score (1-10)")
    networking_score: float = Field(..., ge=1, le=10, description="Networking score (1-10)")


# ── Sub-models for response ────────────────────────────────────

class SkillGap(BaseModel):
    skill: str
    current_value: float
    threshold: float
    priority: str
    suggestion: str


class SkillAnalysisResult(BaseModel):
    weak_skills: list[SkillGap]
    improvement_priority: str


class WeeklyPlan(BaseModel):
    week_1: list[str]
    week_2: list[str]
    week_3: list[str]
    week_4: list[str]


class RoadmapResult(BaseModel):
    readiness_level: str
    weak_skills: list[str]
    recommended_topics: list[str]
    improvement_plan: WeeklyPlan


class CareerRecommendation(BaseModel):
    recommended_roles: list[str]
    reasoning: list[str]


# ── Top-level response ─────────────────────────────────────────

class PredictionResponse(BaseModel):
    """Full prediction response returned by POST /api/predict."""
    career_readiness: str
    confidence: float
    skill_analysis: SkillAnalysisResult
    roadmap: RoadmapResult
    career_recommendations: CareerRecommendation
