# roadmap_service.py – Personalised improvement roadmap generator
#
# Analyses a student profile and prediction result, identifies weak areas,
# and builds a structured 4-week improvement plan.

WEAKNESS_RULES = [
    {
        "field": "gpa",
        "check": lambda v: v < 7,
        "skill": "Academics (GPA)",
        "topics": ["Core subject revision", "Practice previous year papers", "Study groups"],
        "plan": [
            "Identify weakest subjects and gather study resources",
            "Complete 2 mock tests per subject",
            "Revise key topics and solve problem sets",
            "Take a full-length practice exam and review mistakes",
        ],
    },
    {
        "field": "internships",
        "check": lambda v: v < 2,
        "skill": "Industry Experience (Internships)",
        "topics": ["Apply to internships on job portals", "Cold emailing", "LinkedIn outreach"],
        "plan": [
            "Update resume and LinkedIn profile",
            "Shortlist 15 companies and apply",
            "Follow up on applications and network with recruiters",
            "Prepare for and attend interviews",
        ],
    },
    {
        "field": "projects",
        "check": lambda v: v < 3,
        "skill": "Technical Projects & DSA",
        "topics": ["Data Structures & Algorithms", "Build portfolio projects", "Open-source contributions"],
        "plan": [
            "Pick a project idea and set up the repo",
            "Solve 20 DSA problems (arrays, strings, trees)",
            "Complete MVP of the project and push to GitHub",
            "Add documentation, tests, and deploy a demo",
        ],
    },
    {
        "field": "certifications",
        "check": lambda v: v < 2,
        "skill": "Certifications",
        "topics": ["Cloud certifications (AWS/Azure)", "Domain-specific courses", "Coursera / Udemy courses"],
        "plan": [
            "Research relevant certifications for your target role",
            "Enroll and complete 50% of course material",
            "Finish remaining material and take practice tests",
            "Attempt the certification exam",
        ],
    },
    {
        "field": "soft_skills_score",
        "check": lambda v: v < 6,
        "skill": "Soft Skills & Communication",
        "topics": ["Public speaking practice", "Technical writing", "Mock interviews"],
        "plan": [
            "Join a speaking club or practice elevator pitches",
            "Write 2 blog posts or technical articles",
            "Conduct 3 mock interviews with peers",
            "Record and review a presentation for self-feedback",
        ],
    },
    {
        "field": "networking_score",
        "check": lambda v: v < 5,
        "skill": "Professional Networking",
        "topics": ["LinkedIn networking", "Attend tech meetups", "Informational interviews"],
        "plan": [
            "Optimize LinkedIn headline, summary, and skills",
            "Connect with 20 professionals in your target field",
            "Attend 1-2 virtual or local tech events",
            "Schedule 2 informational interviews and follow up",
        ],
    },
]


def _readiness_level(prediction: str, confidence: float) -> str:
    """Map prediction + confidence to a human-readable readiness level."""
    if prediction == "Ready" and confidence >= 0.85:
        return "High"
    if prediction == "Ready":
        return "Moderate"
    return "Low"


def generate_roadmap(profile: dict, career_readiness: str, confidence: float) -> dict:
    """Build a personalised 4-week improvement roadmap.

    Returns
    -------
    dict
        {
            "readiness_level": str,
            "weak_skills": [str, ...],
            "recommended_topics": [str, ...],
            "improvement_plan": { "week_1": [...], ... "week_4": [...] },
        }
    """
    weak_skills: list[str] = []
    recommended_topics: list[str] = []
    plan: dict[str, list[str]] = {"week_1": [], "week_2": [], "week_3": [], "week_4": []}

    for rule in WEAKNESS_RULES:
        value = profile.get(rule["field"])
        if value is not None and rule["check"](value):
            weak_skills.append(rule["skill"])
            recommended_topics.extend(rule["topics"])
            for idx, task in enumerate(rule["plan"]):
                plan[f"week_{idx + 1}"].append(task)

    if weak_skills:
        plan["week_4"].append("Review all progress and do a final mock interview")

    return {
        "readiness_level": _readiness_level(career_readiness, confidence),
        "weak_skills": weak_skills,
        "recommended_topics": recommended_topics,
        "improvement_plan": plan,
    }
