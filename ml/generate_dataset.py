import numpy as np
import pandas as pd
import os

# ── Configuration ──────────────────────────────────────────────
NUM_SAMPLES = 10_000
RANDOM_SEED = 42
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "career_readiness_dataset.csv")


def generate_dataset(n: int, seed: int) -> pd.DataFrame:
    """Generate synthetic student profiles with realistic distributions."""
    rng = np.random.default_rng(seed)

    # GPA: roughly normal centred around 7.5, clipped to [5, 10]
    gpa = np.clip(rng.normal(loc=7.5, scale=1.0, size=n), 5, 10)

    # Internships: most students have 0-1, few have 3-4
    internships = rng.choice([0, 1, 2, 3, 4], size=n, p=[0.30, 0.30, 0.20, 0.12, 0.08])

    # Projects: slight right skew, 0-6
    projects = rng.choice(range(7), size=n, p=[0.08, 0.15, 0.22, 0.22, 0.16, 0.10, 0.07])

    # Certifications: 0-5, most have 0-2
    certifications = rng.choice(range(6), size=n, p=[0.20, 0.25, 0.25, 0.15, 0.10, 0.05])

    # Soft skills score: normal centred at 5.5, clipped to [1, 10]
    soft_skills_score = np.clip(rng.normal(loc=5.5, scale=2.0, size=n), 1, 10)

    # Networking score: normal centred at 5.0, clipped to [1, 10]
    networking_score = np.clip(rng.normal(loc=5.0, scale=2.0, size=n), 1, 10)

    df = pd.DataFrame({
        "gpa": np.round(gpa, 2),
        "internships": internships,
        "projects": projects,
        "certifications": certifications,
        "soft_skills_score": np.round(soft_skills_score, 2),
        "networking_score": np.round(networking_score, 2),
    })

    return df


def compute_target(df: pd.DataFrame) -> pd.Series:
    """Assign a 3-class career readiness label based on a weighted score.

    Scoring logic (0-100 scale):
      gpa            → contributes up to 20 pts  (normalised from 5-10)
      internships    → contributes up to 15 pts  (normalised from 0-4)
      projects       → contributes up to 20 pts  (normalised from 0-6)
      certifications → contributes up to 10 pts  (normalised from 0-5)
      soft_skills    → contributes up to 20 pts  (normalised from 1-10)
      networking     → contributes up to 15 pts  (normalised from 1-10)

    Thresholds:
      score <  35  → 0 (Not Ready)
      score <  55  → 1 (Moderately Ready)
      score >= 55  → 2 (Highly Ready)
    """
    score = (
        ((df["gpa"] - 5) / 5)               * 20
        + (df["internships"] / 4)            * 15
        + (df["projects"] / 6)               * 20
        + (df["certifications"] / 5)         * 10
        + ((df["soft_skills_score"] - 1) / 9) * 20
        + ((df["networking_score"] - 1) / 9)  * 15
    )

    labels = pd.Series(np.where(score >= 55, 2, np.where(score >= 35, 1, 0)), name="career_readiness")
    return labels


if __name__ == "__main__":
    print(f"Generating {NUM_SAMPLES:,} synthetic student profiles ...")
    df = generate_dataset(NUM_SAMPLES, RANDOM_SEED)

    df["career_readiness"] = compute_target(df)

    print(f"\nClass distribution:\n{df['career_readiness'].value_counts().sort_index()}")
    print(f"\n  0 = Not Ready")
    print(f"  1 = Moderately Ready")
    print(f"  2 = Highly Ready")

    df.to_csv(OUTPUT_PATH, index=False)
    print(f"\nDataset saved to {OUTPUT_PATH}  ({len(df)} rows)")
