# career.py – API route for the career plan pipeline
#
# POST /career-plan accepts a UserProfile and orchestrates:
#   1. Load career path (predefined or dynamic for custom careers)
#   2. Annotate stages (completed / current / upcoming)
#   3. Gap analysis
#   4. ML readiness prediction (if applicable)
#   5. Roadmap generation
#   6. Persist to MongoDB

from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Request

from app.models.user_profile import (
    UserProfile,
    CareerPlanResponse,
    StageStep,
    SkillGapItem,
    ReadinessPrediction,
)
from app.services.career_path_service import get_career_path, get_stages_for_career, list_careers
from app.services.career_gap_analysis_service import (
    annotate_career_path,
    compute_next_steps,
    analyze_skill_gaps,
    _rank_of,
)
from app.services.career_roadmap_service import generate_career_roadmap
from app.services.custom_career_service import (
    build_custom_career_path,
    build_professional_roadmap,
)
from app.services.prediction_service import predict as ml_predict
from app.services.progress_service import save_progress
from app.services.auth_service import decode_access_token
from app.database.mongo_connection import get_db

router = APIRouter(prefix="/api", tags=["Career Plan"])


# ── Helper: determine if the ML model should run ──────────────
_ML_ELIGIBLE_MIN_RANK = 2  # "undergraduate" and above

_ML_REQUIRED_FIELDS = [
    "gpa", "internships", "projects",
    "certifications", "soft_skills_score", "networking_score",
]


def _can_run_ml(stage: str, skills: Optional[dict]) -> bool:
    """Return True if the user's stage and provided skills allow ML prediction."""
    if _rank_of(stage) < _ML_ELIGIBLE_MIN_RANK:
        return False
    if skills is None:
        return False
    return all(skills.get(f) is not None for f in _ML_REQUIRED_FIELDS)


# ── Endpoint ───────────────────────────────────────────────────

@router.post("/career-plan", response_model=CareerPlanResponse)
def create_career_plan(request: UserProfile, http_request: Request):
    """Generate a full career plan for the user."""

    # ── Optionally identify authenticated user ─────────────────
    user_id: str | None = None
    auth_header = http_request.headers.get("authorization", "")
    if auth_header.startswith("Bearer "):
        payload = decode_access_token(auth_header[7:])
        if payload and payload.get("sub"):
            db = get_db()
            user_doc = db.users.find_one({"email": payload["sub"]})
            if user_doc:
                user_id = str(user_doc["_id"])

    # ── 1. Load career path (predefined or custom) ─────────────
    career_data = get_career_path(request.target_career)
    is_custom = career_data is None

    if is_custom:
        career_data = build_custom_career_path(request.target_career)

    stages = career_data.get("stages", [])

    # ── 2. Annotate path stages ────────────────────────────────
    annotated = annotate_career_path(stages, request.current_stage)

    # ── 3. Gap analysis ────────────────────────────────────────
    skills_dict = request.skills.model_dump() if request.skills else None
    skill_gaps = analyze_skill_gaps(request.current_stage, skills_dict)

    # ── 4. ML readiness prediction (conditional) ───────────────
    readiness: Optional[dict] = None
    if _can_run_ml(request.current_stage, skills_dict):
        try:
            readiness = ml_predict(skills_dict)
        except RuntimeError:
            pass

    # ── 5. Roadmap generation ──────────────────────────────────
    next_steps = compute_next_steps(stages, request.current_stage)

    # For working professionals, use the enhanced professional roadmap
    is_professional = _rank_of(request.current_stage) >= 4
    if is_professional:
        roadmap = build_professional_roadmap(
            career=career_data["title"],
            current_role=request.current_role,
            skill_gaps=skill_gaps,
        )
    else:
        roadmap = generate_career_roadmap(
            career_title=career_data["title"],
            annotated_path=annotated,
            skill_gaps=skill_gaps,
            next_steps=next_steps,
            readiness=readiness,
            current_role=request.current_role,
        )

    # ── 6. Persist to MongoDB ──────────────────────────────────
    response = CareerPlanResponse(
        target_career=request.target_career,
        current_stage=request.current_stage,
        current_role=request.current_role,
        is_custom_career=is_custom,
        career_path=[StageStep(**s) for s in annotated],
        next_steps=next_steps,
        skill_gaps=[SkillGapItem(**g) for g in skill_gaps],
        readiness=ReadinessPrediction(**readiness) if readiness else None,
        roadmap=roadmap,
    )

    try:
        plan_dict = response.model_dump()
        if user_id:
            # Authenticated – save linked to user for progress tracking
            save_progress(user_id, plan_dict)
        else:
            # Anonymous – save without user link
            db = get_db()
            db.career_plans.insert_one({
                "profile": request.model_dump(),
                **plan_dict,
                "created_at": datetime.now(timezone.utc),
            })
    except Exception:
        pass  # DB unavailable – don't fail the request

    return response


@router.get("/careers", tags=["Career Plan"])
def get_available_careers():
    """Return the list of supported career paths."""
    return {"careers": list_careers()}
