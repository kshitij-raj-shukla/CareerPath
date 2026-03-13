import os

import numpy as np
import pandas as pd


NUM_SAMPLES = 12_000
RANDOM_SEED = 42
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "assessment_readiness_dataset.csv")

EDUCATION_LEVELS = ["High School", "Bachelor's", "Master's", "PhD"]


def compute_readiness_score(df: pd.DataFrame) -> pd.Series:
    education_weight = df["education_level"].map({
        "High School": 25,
        "Bachelor's": 55,
        "Master's": 75,
        "PhD": 90,
    })

    score = (
        education_weight * 0.10
        + (df["programming_skill"] / 5) * 18
        + (df["math_skill"] / 5) * 12
        + (df["problem_solving"] / 5) * 16
        + (df["system_design"] / 5) * 12
        + (df["communication"] / 5) * 10
        + (df["ai_knowledge"] / 5) * 12
        + (np.minimum(df["projects"], 8) / 8) * 5
        + (np.minimum(df["experience"], 6) / 6) * 5
    )
    noise = np.random.default_rng(RANDOM_SEED).normal(0, 3, len(df))
    return pd.Series(np.clip(score + noise, 0, 100).round(2), name="readiness_score")


def generate_dataset(n: int, seed: int) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    df = pd.DataFrame({
        "education_level": rng.choice(EDUCATION_LEVELS, size=n, p=[0.20, 0.45, 0.25, 0.10]),
        "programming_skill": rng.integers(1, 6, size=n),
        "math_skill": rng.integers(1, 6, size=n),
        "problem_solving": rng.integers(1, 6, size=n),
        "projects": rng.integers(0, 10, size=n),
        "experience": np.round(rng.uniform(0, 8, size=n), 2),
        "system_design": rng.integers(1, 6, size=n),
        "communication": rng.integers(1, 6, size=n),
        "ai_knowledge": rng.integers(1, 6, size=n),
    })
    df["readiness_score"] = compute_readiness_score(df)
    return df


if __name__ == "__main__":
    dataset = generate_dataset(NUM_SAMPLES, RANDOM_SEED)
    dataset.to_csv(OUTPUT_PATH, index=False)
    print(f"Saved {len(dataset)} assessment samples to {OUTPUT_PATH}")