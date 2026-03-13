import os

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

from generate_assessment_dataset import generate_dataset


RANDOM_SEED = 42
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(MODEL_DIR, "assessment_readiness_dataset.csv")
MODEL_OUTPUT_PATH = os.path.join(MODEL_DIR, "assessment_model.pkl")
FEATURE_COLUMNS = [
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
TARGET_COLUMN = "readiness_score"


def load_or_generate_dataset() -> pd.DataFrame:
    if os.path.exists(DATASET_PATH):
        return pd.read_csv(DATASET_PATH)
    dataset = generate_dataset(12_000, RANDOM_SEED)
    dataset.to_csv(DATASET_PATH, index=False)
    return dataset


def build_pipeline() -> Pipeline:
    preprocessor = ColumnTransformer(
        transformers=[
            (
                "education",
                OneHotEncoder(handle_unknown="ignore"),
                ["education_level"],
            ),
        ],
        remainder="passthrough",
    )
    return Pipeline([
        ("preprocessor", preprocessor),
        (
            "regressor",
            RandomForestRegressor(
                n_estimators=250,
                random_state=RANDOM_SEED,
                min_samples_leaf=2,
            ),
        ),
    ])


if __name__ == "__main__":
    df = load_or_generate_dataset()
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=RANDOM_SEED,
    )

    pipeline = build_pipeline()
    pipeline.fit(X_train, y_train)

    predictions = pipeline.predict(X_test)
    print(f"MAE: {mean_absolute_error(y_test, predictions):.3f}")
    print(f"R2: {r2_score(y_test, predictions):.3f}")

    joblib.dump(pipeline, MODEL_OUTPUT_PATH)
    print(f"Assessment model saved to {MODEL_OUTPUT_PATH}")