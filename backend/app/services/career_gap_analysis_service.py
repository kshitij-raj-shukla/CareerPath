# career_gap_analysis_service.py – Stage-aware gap analysis
#
# Compares the user's current stage against the predefined career path
# to determine which stages are completed, which is current, and what
# skill gaps exist at their current level.

from __future__ import annotations

from typing import Optional

# ── Stage ordering (canonical) ─────────────────────────────────
# Maps user-supplied stage names to a numeric rank so we can compare
# where the user is relative to the career path stages.

STAGE_RANK: dict[str, int] = {
    "class 10": 0,
    "class 11-12": 1,
    "undergraduate": 2,
    "graduate": 3,
    "working professional": 4,
}

# Aliases: common alternate spellings users might type
_ALIASES: dict[str, str] = {
    "10th": "class 10",
    "class 10th": "class 10",
    "12th": "class 11-12",
    "class 12": "class 11-12",
    "class 12th": "class 11-12",
    "11th-12th": "class 11-12",
    "ug": "undergraduate",
    "bachelors": "undergraduate",
    "bachelor": "undergraduate",
    "b.tech": "undergraduate",
    "btech": "undergraduate",
    "pg": "graduate",
    "postgraduate": "graduate",
    "masters": "graduate",
    "master": "graduate",
    "m.tech": "graduate",
    "mtech": "graduate",
    "mba": "graduate",
    "professional": "working professional",
    "employed": "working professional",
    "working": "working professional",
}


def _normalise_stage(stage: str) -> str:
    """Map a user-supplied stage string to a canonical stage key."""
    key = stage.strip().lower()
    if key in STAGE_RANK:
        return key
    return _ALIASES.get(key, key)


def _rank_of(stage: str) -> int:
    """Return the numeric rank of a canonical stage, defaulting to -1."""
    return STAGE_RANK.get(_normalise_stage(stage), -1)


# ── Skill gap rules per stage ──────────────────────────────────
# Defines what skills to check depending on the user's current stage.
# School students get foundational gaps; college+ users get technical gaps.

_SCHOOL_GAPS = [
    {
        "skill": "Academic Foundation",
        "check": lambda s: s.get("gpa") is not None and s["gpa"] < 7,
        "priority": "high",
        "recommendation": "Strengthen core subjects – aim for 70%+ marks",
    },
    {
        "skill": "Basic Programming",
        "check": lambda s: s.get("projects") is not None and s["projects"] < 1,
        "priority": "medium",
        "recommendation": "Start learning a beginner-friendly language (Python / Scratch)",
    },
]

_COLLEGE_GAPS = [
    {
        "skill": "Academics (GPA)",
        "check": lambda s: s.get("gpa") is not None and s["gpa"] < 7,
        "priority": "high",
        "recommendation": "Focus on core subject revision and practice tests",
    },
    {
        "skill": "Industry Experience",
        "check": lambda s: s.get("internships") is not None and s["internships"] < 1,
        "priority": "high",
        "recommendation": "Apply for internships to gain practical exposure",
    },
    {
        "skill": "Technical Projects",
        "check": lambda s: s.get("projects") is not None and s["projects"] < 3,
        "priority": "high",
        "recommendation": "Build portfolio projects and contribute to open-source",
    },
    {
        "skill": "Certifications",
        "check": lambda s: s.get("certifications") is not None and s["certifications"] < 2,
        "priority": "medium",
        "recommendation": "Earn at least one relevant industry certification",
    },
    {
        "skill": "Soft Skills",
        "check": lambda s: s.get("soft_skills_score") is not None and s["soft_skills_score"] < 6,
        "priority": "medium",
        "recommendation": "Practice communication through mock interviews and presentations",
    },
    {
        "skill": "Professional Networking",
        "check": lambda s: s.get("networking_score") is not None and s["networking_score"] < 5,
        "priority": "medium",
        "recommendation": "Expand your network via LinkedIn, meetups, and events",
    },
]

_PROFESSIONAL_GAPS = [
    {
        "skill": "Leadership & Mentoring",
        "check": lambda _: True,  # always suggest for professionals
        "priority": "medium",
        "recommendation": "Lead projects and mentor junior team members",
    },
    {
        "skill": "Specialisation Depth",
        "check": lambda s: s.get("certifications") is not None and s["certifications"] < 3,
        "priority": "high",
        "recommendation": "Pursue advanced certifications or a research-oriented degree",
    },
    {
        "skill": "Industry Visibility",
        "check": lambda s: s.get("networking_score") is not None and s["networking_score"] < 7,
        "priority": "medium",
        "recommendation": "Publish articles, speak at conferences, grow professional brand",
    },
]


def _select_gap_rules(stage: str) -> list[dict]:
    """Pick the right set of gap rules based on the user's stage."""
    rank = _rank_of(stage)
    if rank <= 1:
        return _SCHOOL_GAPS
    if rank <= 2:
        return _COLLEGE_GAPS
    return _PROFESSIONAL_GAPS


# ── Public API ─────────────────────────────────────────────────

def annotate_career_path(stages: list[dict], current_stage: str) -> list[dict]:
    """Add a 'status' field to each career-path stage.

    Returns a new list (does not mutate the input) where each stage dict
    has an additional ``status`` key set to one of:
    ``'completed'``, ``'current'``, or ``'upcoming'``.
    """
    user_rank = _rank_of(current_stage)
    annotated: list[dict] = []

    for entry in stages:
        stage_rank = _rank_of(entry["stage"])
        if stage_rank < user_rank:
            status = "completed"
        elif stage_rank == user_rank:
            status = "current"
        else:
            status = "upcoming"
        annotated.append({**entry, "status": status})

    return annotated


def compute_next_steps(stages: list[dict], current_stage: str) -> list[str]:
    """Return the tasks for the current and the next upcoming stage.

    This gives the user a concrete list of what to do right now and
    what to prepare for next.
    """
    user_rank = _rank_of(current_stage)
    steps: list[str] = []

    for entry in stages:
        stage_rank = _rank_of(entry["stage"])
        if stage_rank == user_rank:
            steps.extend(entry.get("tasks", []))
        elif stage_rank == user_rank + 1:
            steps.extend(f"[Next Stage] {t}" for t in entry.get("tasks", []))

    return steps


def analyze_skill_gaps(
    current_stage: str,
    skills: Optional[dict],
) -> list[dict]:
    """Run stage-appropriate gap analysis on the user's skills.

    Parameters
    ----------
    current_stage : str
        The user's current education / career stage.
    skills : dict | None
        Skill metrics dict (gpa, internships, projects, etc.).
        When ``None``, returns generic gaps for the stage.

    Returns
    -------
    list[dict]
        Each item: ``{ skill, status, priority, recommendation }``
    """
    if skills is None:
        skills = {}

    rules = _select_gap_rules(current_stage)
    gaps: list[dict] = []

    for rule in rules:
        if rule["check"](skills):
            gaps.append({
                "skill": rule["skill"],
                "status": "gap",
                "priority": rule["priority"],
                "recommendation": rule["recommendation"],
            })

    return gaps
