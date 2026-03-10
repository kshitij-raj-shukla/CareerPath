# career_predictor.py – Career role recommendation based on profile strengths
#
# Evaluates a student profile against role-specific criteria and returns
# a ranked list of recommended career paths with reasoning.


# ── Role rules ─────────────────────────────────────────────────
# Each rule defines:
#   role      – career title
#   match     – function(profile) → bool
#   reasoning – explanation shown when the role is recommended

ROLE_RULES = [
    {
        "role": "Software Engineer",
        "match": lambda p: p.get("projects", 0) >= 3 and p.get("certifications", 0) >= 1,
        "reasoning": "Strong project portfolio and technical certifications indicate hands-on coding ability",
    },
    {
        "role": "Data Scientist",
        "match": lambda p: p.get("gpa", 0) >= 7 and p.get("projects", 0) >= 2 and p.get("certifications", 0) >= 1,
        "reasoning": "High academic performance combined with project experience suits analytical and research roles",
    },
    {
        "role": "DevOps Engineer",
        "match": lambda p: p.get("networking_score", 0) >= 6 and p.get("projects", 0) >= 2 and p.get("certifications", 0) >= 2,
        "reasoning": "Good networking awareness and multiple certifications align with infrastructure and operations roles",
    },
    {
        "role": "Product Manager",
        "match": lambda p: p.get("soft_skills_score", 0) >= 7 and p.get("networking_score", 0) >= 6,
        "reasoning": "Strong communication and networking skills are essential for leading cross-functional product teams",
    },
    {
        "role": "Frontend Developer",
        "match": lambda p: p.get("projects", 0) >= 3 and p.get("soft_skills_score", 0) >= 5,
        "reasoning": "Solid project experience paired with decent communication skills suits user-facing development work",
    },
    {
        "role": "Cloud / Platform Engineer",
        "match": lambda p: p.get("certifications", 0) >= 2 and p.get("networking_score", 0) >= 5,
        "reasoning": "Multiple certifications and networking knowledge point toward cloud infrastructure roles",
    },
    {
        "role": "Technical Consultant",
        "match": lambda p: p.get("soft_skills_score", 0) >= 6 and p.get("internships", 0) >= 2,
        "reasoning": "Industry exposure through internships combined with strong communication fits consulting roles",
    },
    {
        "role": "QA / Test Engineer",
        "match": lambda p: p.get("gpa", 0) >= 6 and p.get("projects", 0) >= 1 and p.get("certifications", 0) >= 1,
        "reasoning": "Solid fundamentals with some project and certification experience suit quality assurance roles",
    },
]


def recommend_career_path(profile: dict) -> dict:
    """Recommend career roles based on a student's profile strengths.

    Parameters
    ----------
    profile : dict
        Must contain keys: gpa, internships, projects, certifications,
        soft_skills_score, networking_score.

    Returns
    -------
    dict
        {
            "recommended_roles": [str, ...],
            "reasoning": [str, ...],
        }
    """

    recommended_roles: list[str] = []
    reasoning: list[str] = []

    for rule in ROLE_RULES:
        if rule["match"](profile):
            recommended_roles.append(rule["role"])
            reasoning.append(rule["reasoning"])

    # Fallback when no roles match
    if not recommended_roles:
        recommended_roles.append("Explore Internships & Skill Building")
        reasoning.append(
            "Your profile does not yet strongly match a specific role — "
            "focus on building projects, earning certifications, and gaining experience"
        )

    return {
        "recommended_roles": recommended_roles,
        "reasoning": reasoning,
    }
