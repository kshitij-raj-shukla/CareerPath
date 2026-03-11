# career_roadmap_service.py – Generate a personalised roadmap to reach a career goal
#
# Takes the annotated career path, skill gaps, and optional readiness
# prediction to build a phased action plan the user can follow.

from __future__ import annotations

from typing import Optional


def generate_career_roadmap(
    career_title: str,
    annotated_path: list[dict],
    skill_gaps: list[dict],
    next_steps: list[str],
    readiness: Optional[dict],
    current_role: Optional[str] = None,
) -> dict:
    """Build a structured, actionable roadmap for the user.

    Returns
    -------
    dict
        { "summary": str, "phases": [ { "phase": str, "actions": [str] }, ... ] }
    """

    high_gaps = [g for g in skill_gaps if g["priority"] == "high"]
    medium_gaps = [g for g in skill_gaps if g["priority"] == "medium"]

    # ── Phase 1: address immediate skill gaps ──────────────────
    phase1_actions: list[str] = []
    for gap in high_gaps:
        phase1_actions.append(f"[HIGH PRIORITY] {gap['recommendation']}")
    for gap in medium_gaps:
        phase1_actions.append(f"[MEDIUM] {gap['recommendation']}")
    if not phase1_actions:
        phase1_actions.append("No critical skill gaps detected – maintain current progress and keep building your portfolio")

    # ── Phase 2: execute current-stage tasks ───────────────────
    current_tasks = [s for s in next_steps if not s.startswith("[Next Stage]")]
    phase2_actions = current_tasks if current_tasks else ["Continue excelling at your current stage"]
    if current_role:
        phase2_actions.insert(0, f"Leverage your experience as {current_role} to strengthen relevant skills")

    # ── Phase 3: prepare for the next stage ────────────────────
    future_tasks = [s.replace("[Next Stage] ", "") for s in next_steps if s.startswith("[Next Stage]")]
    phase3_actions = future_tasks if future_tasks else ["You are at or beyond the final stage – focus on mastery and specialisation"]
    phase3_actions.append(f"Research what top professionals in {career_title} did at this stage")
    phase3_actions.append(f"Identify mentors or communities in the {career_title} field")

    # ── Phase 4: long-term growth & milestones ─────────────────
    remaining = [entry for entry in annotated_path if entry["status"] == "upcoming"]
    phase4_actions: list[str] = []
    for entry in remaining[1:]:
        phase4_actions.extend(entry.get("tasks", []))
    if not phase4_actions:
        phase4_actions.append(f"Continue deepening your expertise toward becoming a {career_title}")
    phase4_actions.append(f"Build a strong professional network in the {career_title} domain")
    phase4_actions.append("Set annual milestones to track your growth and revisit this plan regularly")

    # ── Summary text ───────────────────────────────────────────
    stages_remaining = len([e for e in annotated_path if e["status"] in ("current", "upcoming")])
    summary = f"You are {stages_remaining} stage(s) away from your goal of becoming a {career_title}. "
    if current_role:
        summary += f"Your current role as {current_role} gives you a practical foundation to build on. "
    if readiness:
        summary += (
            f"ML readiness assessment: {readiness['career_readiness']} "
            f"(confidence {readiness['confidence']:.0%}). "
        )
    if high_gaps:
        summary += f"You have {len(high_gaps)} high-priority gap(s) to address first."
    else:
        summary += "No critical gaps – keep up the momentum!"

    return {
        "summary": summary,
        "phases": [
            {"phase": "Phase 1 – Address Skill Gaps", "actions": phase1_actions},
            {"phase": "Phase 2 – Current Stage Actions", "actions": phase2_actions},
            {"phase": "Phase 3 – Prepare for Next Stage", "actions": phase3_actions},
            {"phase": "Phase 4 – Long-Term Growth & Milestones", "actions": phase4_actions},
        ],
    }
