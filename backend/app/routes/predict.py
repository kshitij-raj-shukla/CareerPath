# predict.py – API routes for career readiness prediction
#
# All /api/* endpoints live here.  The router is mounted by app/main.py.

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from app.models.request_models import (
    ProfileInput,
    PredictionResponse,
    SkillAnalysisResult,
    SkillGap,
    RoadmapResult,
    CareerRecommendation,
)
from app.services.prediction_service import predict
from app.services.skill_analysis_service import analyze_skill_gaps
from app.services.roadmap_service import generate_roadmap
from app.services.career_recommendation_service import recommend_career_path
from app.database.mongo_connection import get_db

router = APIRouter(prefix="/api", tags=["Prediction"])


@router.post("/predict", response_model=PredictionResponse)
def predict_career(request: ProfileInput):
    """Full career readiness prediction pipeline.

    1. Run ML prediction
    2. Analyse skill gaps
    3. Generate improvement roadmap
    4. Recommend career roles
    5. Persist to MongoDB
    """
    profile = request.model_dump()

    # ── 1. ML prediction ───────────────────────────────────────
    try:
        pred = predict(profile)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}")

    career_readiness = pred["career_readiness"]
    confidence = pred["confidence"]

    # ── 2. Skill gap analysis ──────────────────────────────────
    gaps = analyze_skill_gaps(profile)

    # ── 3. Roadmap generation ──────────────────────────────────
    roadmap = generate_roadmap(profile, career_readiness, confidence)

    # ── 4. Career recommendations ──────────────────────────────
    careers = recommend_career_path(profile)

    # ── 5. Store in MongoDB ────────────────────────────────────
    try:
        db = get_db()
        db.predictions.insert_one({
            "profile": profile,
            "career_readiness": career_readiness,
            "confidence": confidence,
            "skill_gaps": gaps,
            "roadmap": roadmap,
            "career_recommendations": careers,
            "created_at": datetime.now(timezone.utc),
        })
    except Exception:
        # Log but don't fail the request if DB is unavailable
        pass

    # ── Build response ─────────────────────────────────────────
    return PredictionResponse(
        career_readiness=career_readiness,
        confidence=confidence,
        skill_analysis=SkillAnalysisResult(
            weak_skills=[SkillGap(**s) for s in gaps["weak_skills"]],
            improvement_priority=gaps["improvement_priority"],
        ),
        roadmap=RoadmapResult(
            readiness_level=roadmap["readiness_level"],
            weak_skills=roadmap["weak_skills"],
            recommended_topics=roadmap["recommended_topics"],
            improvement_plan=roadmap["improvement_plan"],
        ),
        career_recommendations=CareerRecommendation(**careers),
    )
