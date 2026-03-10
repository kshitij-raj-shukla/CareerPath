import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import os

# ── Configuration ──────────────────────────────────────────────
NUM_SAMPLES = 5000
RANDOM_SEED = 42
FEATURE_COLUMNS = [
    "gpa", "internships", "projects",
    "certifications", "soft_skills_score", "networking_score",
]
TARGET_COLUMN = "career_readiness"
TARGET_NAMES = ["Not Ready", "Ready"]
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_OUTPUT_PATH = os.path.join(MODEL_DIR, "model.pkl")


def generate_dataset(n: int, seed: int) -> pd.DataFrame:
    """Generate a synthetic career-readiness dataset."""
    rng = np.random.default_rng(seed)

    data = pd.DataFrame({
        "gpa": rng.uniform(5, 10, n),
        "internships": rng.integers(0, 5, n),        # 0-4
        "projects": rng.integers(0, 7, n),            # 0-6
        "certifications": rng.integers(0, 6, n),      # 0-5
        "soft_skills_score": rng.uniform(1, 10, n),
        "networking_score": rng.uniform(1, 10, n),
    })

    # Target: ready when gpa > 7, projects >= 3, and soft_skills_score > 6
    data[TARGET_COLUMN] = (
        (data["gpa"] > 7)
        & (data["projects"] >= 3)
        & (data["soft_skills_score"] > 6)
    ).astype(int)

    return data


def build_pipeline() -> Pipeline:
    """Build a scikit-learn pipeline with scaling + RandomForest."""
    return Pipeline([
        ("scaler", StandardScaler()),
        ("clf", RandomForestClassifier(n_estimators=100, random_state=RANDOM_SEED)),
    ])


def train_model(df: pd.DataFrame):
    """Train the pipeline and return it along with test-set metrics."""
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_SEED, stratify=y,
    )

    pipeline = build_pipeline()
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)

    metrics = {
        "accuracy": accuracy_score(y_test, y_pred),
        "report": classification_report(y_test, y_pred, target_names=TARGET_NAMES),
        "confusion_matrix": confusion_matrix(y_test, y_pred),
    }

    return pipeline, metrics


def save_model(model, path: str):
    """Persist the trained pipeline to disk."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    joblib.dump(model, path)
    print(f"Model saved to {path}")


def load_model(path: str = MODEL_OUTPUT_PATH):
    """Load a previously saved pipeline from disk."""
    return joblib.load(path)


if __name__ == "__main__":
    # 1. Generate data
    print(f"Generating {NUM_SAMPLES} synthetic samples ...")
    df = generate_dataset(NUM_SAMPLES, RANDOM_SEED)
    print(f"Class distribution:\n{df[TARGET_COLUMN].value_counts()}\n")

    # 2. Train
    pipeline, metrics = train_model(df)
    print(f"Accuracy : {metrics['accuracy']:.4f}\n")
    print(f"Classification report:\n{metrics['report']}")
    print(f"Confusion matrix:\n{metrics['confusion_matrix']}\n")

    # 3. Save
    save_model(pipeline, MODEL_OUTPUT_PATH)
