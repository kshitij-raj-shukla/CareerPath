# skill_analysis_service.py – Skill gap detection
#
# Evaluates each profile field against threshold rules and returns
# a list of weak skills with priority levels and actionable suggestions.

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
        "threshold": 1,
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
    """Identify skill gaps and return them with priorities.

    Returns
    -------
    dict
        {
            "weak_skills": [ { skill, current_value, threshold, priority, suggestion }, ... ],
            "improvement_priority": "high" | "medium" | "low",
        }
    """
    weak_skills: list[dict] = []

    for rule in GAP_RULES:
        value = profile.get(rule["field"])
        if value is not None and value < rule["threshold"]:
            weak_skills.append({
                "skill": rule["skill"],
                "current_value": value,
                "threshold": rule["threshold"],
                "priority": rule["priority"],
                "suggestion": rule["suggestion"],
            })

    if any(s["priority"] == "high" for s in weak_skills):
        priority = "high"
    elif any(s["priority"] == "medium" for s in weak_skills):
        priority = "medium"
    else:
        priority = "low"

    return {"weak_skills": weak_skills, "improvement_priority": priority}
