# skill_analyzer.py – Skill gap analysis for career readiness profiles
#
# Evaluates each profile field against threshold rules and returns
# a list of weak skills with priority levels and suggestions,
# ready to be consumed by the roadmap generator or any API endpoint.


# ── Gap rules ──────────────────────────────────────────────────
# Each rule defines:
#   field      – profile key to inspect
#   threshold  – value at or above which the skill is considered acceptable
#   skill      – human-readable label
#   priority   – improvement urgency when the gap is detected
#   suggestion – actionable recommendation

GAP_RULES = [
    {
        "field": "gpa",
        "threshold": 7,
        "skill": "Academics (GPA)",
        "priority": "high",
        "suggestion": "Focus on core subject revision and targeted practice tests",
    },
    {
        "field": "internships",
        "threshold": 1,            # 0 internships → gap
        "skill": "Industry Experience (Internships)",
        "priority": "high",
        "suggestion": "Start applying for internships and build industry exposure",
    },
    {
        "field": "projects",
        "threshold": 3,
        "skill": "Technical Projects & DSA",
        "priority": "high",
        "suggestion": "Practice DSA regularly and build portfolio projects on GitHub",
    },
    {
        "field": "certifications",
        "threshold": 2,
        "skill": "Certifications",
        "priority": "medium",
        "suggestion": "Earn at least one relevant certification in your domain",
    },
    {
        "field": "soft_skills_score",
        "threshold": 6,
        "skill": "Soft Skills & Communication",
        "priority": "medium",
        "suggestion": "Improve communication through mock interviews and public speaking",
    },
    {
        "field": "networking_score",
        "threshold": 5,
        "skill": "Professional Networking",
        "priority": "medium",
        "suggestion": "Expand your network via LinkedIn, meetups, and informational interviews",
    },
]


def analyze_skill_gaps(profile: dict) -> dict:
    """Analyse a student profile and identify skill gaps with priorities.

    Parameters
    ----------
    profile : dict
        Must contain keys: gpa, internships, projects, certifications,
        soft_skills_score, networking_score.

    Returns
    -------
    dict
        {
            "weak_skills": [
                {
                    "skill": str,
                    "current_value": float | int,
                    "threshold": float | int,
                    "priority": "high" | "medium" | "low",
                    "suggestion": str,
                },
                ...
            ],
            "improvement_priority": "high" | "medium" | "low",
        }
    """

    weak_skills: list[dict] = []

    for rule in GAP_RULES:
        value = profile.get(rule["field"])
        if value is None:
            continue
        if value < rule["threshold"]:
            weak_skills.append({
                "skill": rule["skill"],
                "current_value": value,
                "threshold": rule["threshold"],
                "priority": rule["priority"],
                "suggestion": rule["suggestion"],
            })

    # Overall priority is the highest priority among all detected gaps
    if any(s["priority"] == "high" for s in weak_skills):
        improvement_priority = "high"
    elif any(s["priority"] == "medium" for s in weak_skills):
        improvement_priority = "medium"
    elif weak_skills:
        improvement_priority = "low"
    else:
        improvement_priority = "low"   # no gaps found

    return {
        "weak_skills": weak_skills,
        "improvement_priority": improvement_priority,
    }