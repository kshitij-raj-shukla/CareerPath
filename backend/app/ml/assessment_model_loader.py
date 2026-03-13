"""Assessment model lifecycle management."""

from __future__ import annotations

import os

import joblib


_DEFAULT_MODEL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "ml", "assessment_model.pkl")
)

ASSESSMENT_FEATURE_ORDER = [
    "education_level",
    "programming_skill",
    "math_skill",
    "problem_solving",
    "projects",
    "experience",
    "system_design",
    "communication",
    "ai_knowledge",
]

_model_cache: dict[str, object] = {}


def load_assessment_model(path: str = _DEFAULT_MODEL_PATH) -> None:
    """Load the assessment regression pipeline if it exists."""
    if not os.path.exists(path):
        raise FileNotFoundError(f"Assessment model file not found: {path}")
    _model_cache["pipeline"] = joblib.load(path)
    print(f"[assessment_model_loader] Model loaded from {path}")


def get_assessment_model():
    """Return the cached assessment pipeline, or None if unavailable."""
    return _model_cache.get("pipeline")


def unload_assessment_model() -> None:
    """Clear the cached assessment pipeline."""
    _model_cache.clear()