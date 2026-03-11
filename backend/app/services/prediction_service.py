# prediction_service.py – Core ML prediction logic
#
# Accepts a profile dict, runs it through the trained pipeline,
# and returns the predicted label + confidence score.

import pandas as pd
from app.ml.model_loader import get_model, FEATURE_ORDER


def predict(profile: dict) -> dict:
    """Run the ML pipeline on a user profile.

    Parameters
    ----------
    profile : dict
        Keys must include all items in FEATURE_ORDER.

    Returns
    -------
    dict
        {
            "career_readiness": "Ready" | "Not Ready",
            "confidence": float,       # 0-1
            "prediction_raw": int,     # 0 or 1
        }

    Raises
    ------
    RuntimeError
        If the model has not been loaded yet.
    """
    pipeline = get_model()
    if pipeline is None:
        raise RuntimeError("ML model is not loaded")

    # Build a single-row DataFrame with correct column names
    row = pd.DataFrame(
        [[profile[f] for f in FEATURE_ORDER]],
        columns=FEATURE_ORDER,
    )

    prediction = int(pipeline.predict(row)[0])
    probabilities = pipeline.predict_proba(row)[0]
    confidence = round(float(probabilities[prediction]), 4)

    return {
        "career_readiness": "Ready" if prediction == 1 else "Not Ready",
        "confidence": confidence,
        "prediction_raw": prediction,
    }
