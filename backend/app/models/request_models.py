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


class AssessmentInput(BaseModel):
    """Input submitted from the frontend assessment workflow."""

    education_level: str = Field(..., min_length=2, max_length=50)
    programming_skill: int = Field(..., ge=1, le=5)
    math_skill: int = Field(..., ge=1, le=5)
    problem_solving: int = Field(..., ge=1, le=5)
    projects: int = Field(..., ge=0, le=20)
    experience: float = Field(..., ge=0, le=20)
    system_design: int = Field(..., ge=1, le=5)
    communication: int = Field(..., ge=1, le=5)
    ai_knowledge: int = Field(..., ge=1, le=5)
    target_role: str = Field(..., min_length=2, max_length=100)


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


class AssessmentSkillGap(BaseModel):
    skill: str
    current_level: str
    required_level: str
    recommendation: str


class CareerPlanSkillInput(BaseModel):
    gpa: float
    internships: int
    projects: int
    certifications: int
    soft_skills_score: float
    networking_score: float


class AssessmentResponse(BaseModel):
    target_role: str
    education_level: str
    readiness_score: float = Field(..., ge=0, le=100)
    career_level: str
    strengths: list[str]
    skill_gaps: list[AssessmentSkillGap]
    radar_chart: dict[str, float]
    skill_graph: dict[str, float]
    recommended_focus_areas: list[str]
    summary: str
    career_plan_inputs: CareerPlanSkillInput


# ── Top-level response ─────────────────────────────────────────

class PredictionResponse(BaseModel):
    """Full prediction response returned by POST /api/predict."""
    career_readiness: str
    confidence: float
    skill_analysis: SkillAnalysisResult
    roadmap: RoadmapResult
    career_recommendations: CareerRecommendation
