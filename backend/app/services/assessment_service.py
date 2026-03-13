"""Assessment scoring and response shaping."""

from __future__ import annotations

from typing import Any

import pandas as pd

from app.ml.assessment_model_loader import (
    ASSESSMENT_FEATURE_ORDER,
    get_assessment_model,
)


_EDUCATION_MAP = {
    "high school": 1,
    "bachelor's": 2,
    "bachelors": 2,
    "bachelor's degree": 2,
    "master's": 3,
    "masters": 3,
    "master's degree": 3,
    "phd": 4,
}

_SKILL_DISPLAY_NAMES = {
    "programming_skill": "Programming",
    "math_skill": "Mathematics",
    "problem_solving": "Problem Solving",
    "system_design": "System Design",
    "communication": "Communication",
    "ai_knowledge": "AI Knowledge",
    "projects": "Projects",
    "experience": "Experience",
    "education_level": "Education",
}

_REQUIRED_THRESHOLDS = {
    "programming_skill": 72,
    "math_skill": 65,
    "problem_solving": 68,
    "system_design": 62,
    "communication": 65,
    "ai_knowledge": 72,
    "projects": 60,
    "experience": 55,
    "education_level": 50,
}

_RECOMMENDATIONS = {
    "programming_skill": "Build one production-style project and practice language fundamentals daily.",
    "math_skill": "Strengthen probability, statistics, and linear algebra with applied exercises.",
    "problem_solving": "Work through algorithmic problem sets and break problems into repeatable patterns.",
    "system_design": "Study scalable system patterns and document design tradeoffs for your projects.",
    "communication": "Practice explaining technical work clearly through demos, mock interviews, and writing.",
    "ai_knowledge": "Deepen ML fundamentals, model evaluation, and practical AI system implementation.",
    "projects": "Increase portfolio depth with end-to-end projects that show measurable impact.",
    "experience": "Seek internships, freelance work, or collaborative builds to gain delivery experience.",
    "education_level": "Use structured coursework and certifications to strengthen your theoretical base.",
}


def _normalise_education(value: str) -> str:
    return value.strip()


def _education_rank(value: str) -> int:
    return _EDUCATION_MAP.get(value.strip().lower(), 2)


def _clamp(value: float, lower: float, upper: float) -> float:
    return max(lower, min(upper, value))


def _heuristic_score(profile: dict[str, Any]) -> float:
    education_rank = _education_rank(profile["education_level"])
    score = (
        (education_rank / 4) * 10
        + (profile["programming_skill"] / 5) * 18
        + (profile["math_skill"] / 5) * 12
        + (profile["problem_solving"] / 5) * 16
        + (profile["system_design"] / 5) * 12
        + (profile["communication"] / 5) * 10
        + (profile["ai_knowledge"] / 5) * 12
        + (min(profile["projects"], 8) / 8) * 5
        + (min(profile["experience"], 6) / 6) * 5
    )
    return round(_clamp(score, 0, 100), 2)


def _predict_score(profile: dict[str, Any]) -> float:
    heuristic = _heuristic_score(profile)
    pipeline = get_assessment_model()
    if pipeline is None:
        return heuristic

    row = pd.DataFrame(
        [[profile[field] for field in ASSESSMENT_FEATURE_ORDER]],
        columns=ASSESSMENT_FEATURE_ORDER,
    )
    predicted = float(pipeline.predict(row)[0])
    blended = (predicted * 0.7) + (heuristic * 0.3)
    return round(_clamp(blended, 0, 100), 2)


def _career_level(score: float) -> str:
    if score >= 80:
        return "advanced"
    if score >= 65:
        return "job-ready"
    if score >= 45:
        return "developing"
    return "beginner"


def _score_to_label(value: float) -> str:
    if value >= 80:
        return "Advanced"
    if value >= 65:
        return "Strong"
    if value >= 45:
        return "Developing"
    return "Beginner"


def _build_skill_scores(profile: dict[str, Any]) -> dict[str, float]:
    education_rank = _education_rank(profile["education_level"])
    scores = {
        "programming_skill": round((profile["programming_skill"] / 5) * 100, 1),
        "math_skill": round((profile["math_skill"] / 5) * 100, 1),
        "problem_solving": round((profile["problem_solving"] / 5) * 100, 1),
        "system_design": round((profile["system_design"] / 5) * 100, 1),
        "communication": round((profile["communication"] / 5) * 100, 1),
        "ai_knowledge": round((profile["ai_knowledge"] / 5) * 100, 1),
        "projects": round((min(profile["projects"], 8) / 8) * 100, 1),
        "experience": round((min(profile["experience"], 6) / 6) * 100, 1),
        "education_level": round((education_rank / 4) * 100, 1),
    }
    return scores


def _build_strengths(skill_scores: dict[str, float]) -> list[str]:
    sorted_scores = sorted(skill_scores.items(), key=lambda item: item[1], reverse=True)
    strong = [field for field, value in sorted_scores if value >= 70]
    selected = strong[:3] if strong else [field for field, _ in sorted_scores[:3]]
    return selected


def _build_skill_gaps(skill_scores: dict[str, float]) -> list[dict[str, str]]:
    gaps: list[dict[str, str]] = []
    for field, value in sorted(skill_scores.items(), key=lambda item: item[1]):
        required = _REQUIRED_THRESHOLDS[field]
        if value >= required:
            continue
        gaps.append({
            "skill": field,
            "current_level": _score_to_label(value),
            "required_level": _score_to_label(required),
            "recommendation": _RECOMMENDATIONS[field],
        })
    return gaps[:5]


def _build_focus_areas(gaps: list[dict[str, str]]) -> list[str]:
    if not gaps:
        return ["Maintain momentum with larger projects, stronger networking, and interview preparation."]
    return [gap["recommendation"] for gap in gaps[:3]]


def _build_summary(score: float, level: str, target_role: str, strengths: list[str], gaps: list[dict[str, str]]) -> str:
    strength_text = ", ".join(_SKILL_DISPLAY_NAMES[item] for item in strengths[:2])
    if gaps:
        gap_text = ", ".join(_SKILL_DISPLAY_NAMES[item["skill"]] for item in gaps[:2])
        return (
            f"You are currently {level.replace('-', ' ')} for {target_role} with a readiness score of {score:.0f}/100. "
            f"Your strongest areas are {strength_text}. Focus next on {gap_text} to improve your profile fastest."
        )
    return (
        f"You are currently {level.replace('-', ' ')} for {target_role} with a readiness score of {score:.0f}/100. "
        f"Your profile is balanced, with standout strength in {strength_text}."
    )


def _build_career_plan_inputs(profile: dict[str, Any]) -> dict[str, float | int]:
    education_rank = _education_rank(profile["education_level"])
    gpa = 5 + (education_rank * 0.75) + (profile["math_skill"] * 0.35) + (profile["programming_skill"] * 0.2)
    internships = int(round(min(profile["experience"], 6) / 1.5))
    certifications = int(round((profile["ai_knowledge"] + profile["system_design"]) / 2.5))
    networking = ((profile["communication"] * 0.6) + (profile["problem_solving"] * 0.4)) * 2

    return {
        "gpa": round(_clamp(gpa, 5, 10), 2),
        "internships": max(0, min(internships, 4)),
        "projects": max(0, min(int(profile["projects"]), 6)),
        "certifications": max(0, min(certifications, 5)),
        "soft_skills_score": round(_clamp(profile["communication"] * 2, 1, 10), 1),
        "networking_score": round(_clamp(networking, 1, 10), 1),
    }


def run_assessment(profile: dict[str, Any]) -> dict[str, Any]:
    """Generate the assessment response consumed by the frontend."""
    cleaned_profile = {
        **profile,
        "education_level": _normalise_education(profile["education_level"]),
    }
    readiness_score = _predict_score(cleaned_profile)
    skill_scores = _build_skill_scores(cleaned_profile)
    strengths = _build_strengths(skill_scores)
    gaps = _build_skill_gaps(skill_scores)
    level = _career_level(readiness_score)

    return {
        "target_role": cleaned_profile["target_role"],
        "education_level": cleaned_profile["education_level"],
        "readiness_score": readiness_score,
        "career_level": level,
        "strengths": strengths,
        "skill_gaps": gaps,
        "radar_chart": skill_scores,
        "skill_graph": skill_scores,
        "recommended_focus_areas": _build_focus_areas(gaps),
        "summary": _build_summary(readiness_score, level, cleaned_profile["target_role"], strengths, gaps),
        "career_plan_inputs": _build_career_plan_inputs(cleaned_profile),
    }