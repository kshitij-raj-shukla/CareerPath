# model_loader.py – ML model lifecycle management
#
# Handles loading, caching, and accessing the trained scikit-learn pipeline.
# Used by the FastAPI lifespan and prediction service.

import os
import joblib

# Path to the trained model (relative to this file → ../../ml/model.pkl)
_DEFAULT_MODEL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "ml", "model.pkl")
)

FEATURE_ORDER = [
    "gpa", "internships", "projects",
    "certifications", "soft_skills_score", "networking_score",
]

# In-process model cache
_model_cache: dict = {}


def load_model(path: str = _DEFAULT_MODEL_PATH) -> None:
    """Load a joblib-serialised sklearn pipeline into the cache."""
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model file not found: {path}")
    _model_cache["pipeline"] = joblib.load(path)
    print(f"[model_loader] Model loaded from {path}")


def get_model():
    """Return the cached pipeline, or None if not loaded."""
    return _model_cache.get("pipeline")


def unload_model() -> None:
    """Clear the cached model (called on shutdown)."""
    _model_cache.clear()
