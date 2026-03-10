import os
from contextlib import asynccontextmanager
from typing import Optional

import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

from services.roadmap import generate_roadmap

# ── Configuration ──────────────────────────────────────────────
MODEL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "ml", "model.pkl")
)

FEATURE_ORDER = [
    "gpa", "internships", "projects",
    "certifications", "soft_skills_score", "networking_score",
]

# ── Application lifespan (model loading) ──────────────────────
ml_model = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    if os.path.exists(MODEL_PATH):
        ml_model["pipeline"] = joblib.load(MODEL_PATH)
        print(f"Model loaded from {MODEL_PATH}")
    else:
        print(f"WARNING: model not found at {MODEL_PATH} – /predict will return 503")
    yield
    ml_model.clear()


app = FastAPI(title="Career Readiness Prediction API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Schemas ────────────────────────────────────────────────────
class PredictionRequest(BaseModel):
    gpa: float
    internships: int
    projects: int
    certifications: int
    soft_skills_score: float
    networking_score: float


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


class PredictionResponse(BaseModel):
    career_readiness: str
    confidence: float
    roadmap: RoadmapResult


class RoadmapResponse(BaseModel):
    readiness_level: str
    career_readiness: str
    confidence: float
    weak_skills: list[str]
    recommended_topics: list[str]
    improvement_plan: WeeklyPlan


# ── Endpoints ──────────────────────────────────────────────────
@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    pipeline = ml_model.get("pipeline")
    if pipeline is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        row = pd.DataFrame(
            [[getattr(request, f) for f in FEATURE_ORDER]],
            columns=FEATURE_ORDER,
        )
        prediction = pipeline.predict(row)[0]
        probabilities = pipeline.predict_proba(row)[0]
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}")

    career_readiness = "Ready" if prediction == 1 else "Not Ready"
    confidence = round(float(probabilities[prediction]), 4)

    # Generate personalised roadmap from profile weak areas
    profile = request.model_dump()
    roadmap_data = generate_roadmap(profile, career_readiness, confidence)

    return PredictionResponse(
        career_readiness=career_readiness,
        confidence=confidence,
        roadmap=RoadmapResult(
            readiness_level=roadmap_data["readiness_level"],
            weak_skills=roadmap_data["weak_skills"],
            recommended_topics=roadmap_data["recommended_topics"],
            improvement_plan=roadmap_data["improvement_plan"],
        ),
    )


@app.post("/roadmap", response_model=RoadmapResponse)
def roadmap(request: PredictionRequest):
    pipeline = ml_model.get("pipeline")
    if pipeline is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        row = pd.DataFrame(
            [[getattr(request, f) for f in FEATURE_ORDER]],
            columns=FEATURE_ORDER,
        )
        prediction = pipeline.predict(row)[0]
        probabilities = pipeline.predict_proba(row)[0]
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}")

    career_readiness = "Ready" if prediction == 1 else "Not Ready"
    confidence = round(float(probabilities[prediction]), 4)

    profile = request.model_dump()
    return generate_roadmap(profile, career_readiness, confidence)
