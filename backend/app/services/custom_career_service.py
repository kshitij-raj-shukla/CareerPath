# custom_career_service.py – Generate career paths for user-typed careers
#
# When the user enters a career that isn't in career_paths.json, this
# service builds a reasonable generic career path and tailored roadmap
# based on the career name, current stage, and optional current role.

from __future__ import annotations

from typing import Optional


# ── Generic stage templates ────────────────────────────────────
# These provide a sensible baseline for any career.

def _build_generic_stages(career: str) -> list[dict]:
    """Build a 5-stage generic career path for an arbitrary career."""
    return [
        {
            "stage": "Class 10",
            "label": "Foundation – Secondary School",
            "tasks": [
                "Build strong academics across all core subjects",
                f"Research what a career as a {career} involves",
                "Identify the required stream / subjects for Class 11-12",
                "Start developing relevant foundational skills early",
            ],
        },
        {
            "stage": "Class 11-12",
            "label": f"Stream Selection for {career}",
            "tasks": [
                f"Choose the stream most relevant to becoming a {career}",
                "Excel in board exams – strong marks widen options",
                f"Explore introductory courses or books related to {career}",
                "Prepare for relevant entrance examinations",
            ],
        },
        {
            "stage": "Undergraduate",
            "label": f"Degree & Skill Building for {career}",
            "tasks": [
                f"Pursue a degree aligned with {career} requirements",
                "Complete internships or practical training in the field",
                f"Build a portfolio of projects / experiences related to {career}",
                "Earn relevant certifications or attend workshops",
                "Network with professionals already working in this field",
                "Join communities, clubs, or forums related to the field",
            ],
        },
        {
            "stage": "Graduate",
            "label": f"Advanced Preparation / Entry into {career}",
            "tasks": [
                f"Pursue higher education or professional exams if required for {career}",
                "Apply for entry-level positions or apprenticeships",
                "Build a strong professional profile (LinkedIn, portfolio)",
                f"Gain hands-on experience through real-world {career} work",
            ],
        },
        {
            "stage": "Working Professional",
            "label": f"Career Growth as {career}",
            "tasks": [
                f"Excel in your current role and seek promotions toward senior {career} positions",
                "Pursue advanced certifications or specialisations",
                "Mentor others and build leadership skills",
                "Expand your professional network and industry visibility",
                "Stay current with industry trends and continuous learning",
            ],
        },
    ]


def build_custom_career_path(career: str) -> dict:
    """Return a career-path dict in the same shape as career_paths.json entries."""
    return {
        "title": career,
        "description": f"A personalised career path toward becoming a {career}.",
        "stages": _build_generic_stages(career),
        "key_skills": [
            "Domain knowledge",
            "Communication",
            "Problem solving",
            "Networking",
            "Continuous learning",
        ],
    }


# ── Professional transition roadmap ───────────────────────────

def build_professional_roadmap(
    career: str,
    current_role: Optional[str],
    skill_gaps: list[dict],
) -> dict:
    """Build an enhanced roadmap for a working professional.

    If ``current_role`` is provided, the roadmap includes a concrete
    transition plan from that role to the target career.
    """
    high_gaps = [g for g in skill_gaps if g["priority"] == "high"]
    medium_gaps = [g for g in skill_gaps if g["priority"] == "medium"]

    # Phase 1 – Assess current position
    phase1 = []
    if current_role:
        phase1.append(f"You are currently working as: {current_role}")
        phase1.append(f"Identify which skills from your role as {current_role} transfer to {career}")
        phase1.append("List the gaps between your current responsibilities and the target role")
    else:
        phase1.append(f"Audit your current skills and experience relevant to {career}")
    phase1.append("Research job descriptions and required qualifications for the target role")

    # Phase 2 – Bridge the gaps
    phase2 = []
    for gap in high_gaps:
        phase2.append(f"[HIGH PRIORITY] {gap['recommendation']}")
    for gap in medium_gaps:
        phase2.append(f"[MEDIUM PRIORITY] {gap['recommendation']}")
    if not phase2:
        phase2.append("Your current skill set is strong – focus on domain-specific knowledge")
    phase2.append(f"Take targeted courses or certifications specifically for {career}")

    # Phase 3 – Build credibility
    phase3 = []
    if current_role:
        phase3.append(f"Take on projects at work that align with {career} responsibilities")
        phase3.append(f"Seek internal transfers or cross-functional roles closer to {career}")
    phase3.append(f"Build a portfolio demonstrating {career}-relevant work")
    phase3.append(f"Connect with people already working as {career} for mentorship")
    phase3.append("Attend industry events, webinars, and conferences")

    # Phase 4 – Make the transition
    phase4 = []
    if current_role:
        phase4.append(f"Update your resume to highlight transferable skills from {current_role}")
    phase4.append(f"Apply for {career} positions – start with roles that value your background")
    phase4.append("Prepare for domain-specific interviews and assessments")
    phase4.append(f"Target companies or organisations known for hiring into {career} roles")
    phase4.append("Negotiate your transition – consider lateral moves if needed")

    role_text = f" from {current_role}" if current_role else ""
    summary = (
        f"Transitioning{role_text} to {career}. "
    )
    if high_gaps:
        summary += f"You have {len(high_gaps)} high-priority skill gap(s) to address. "
    summary += "Follow this phased plan to make the move successfully."

    return {
        "summary": summary,
        "phases": [
            {"phase": "Phase 1 – Assess Your Current Position", "actions": phase1},
            {"phase": "Phase 2 – Bridge the Skill Gaps", "actions": phase2},
            {"phase": "Phase 3 – Build Credibility & Network", "actions": phase3},
            {"phase": "Phase 4 – Make the Career Transition", "actions": phase4},
        ],
    }
