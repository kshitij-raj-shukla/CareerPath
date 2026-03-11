# progress_service.py – CRUD helpers for the career_plans collection
#
# Provides functions to save and retrieve career-plan progress entries
# scoped to an authenticated user, with roadmap tasks as a to-do list.

from __future__ import annotations

from datetime import datetime, timezone

from bson import ObjectId

from app.database.mongo_connection import get_db


# ── Time estimates by keyword heuristics ──────────────────────

_TIME_KEYWORDS = {
    "high priority": 30,
    "medium": 21,
    "certification": 60,
    "course": 45,
    "portfolio": 30,
    "project": 21,
    "mentor": 14,
    "network": 14,
    "research": 7,
    "community": 7,
    "internship": 90,
    "master": 365,
    "specialisation": 180,
    "specialization": 180,
}


def _estimate_days(action: str, phase: str) -> int:
    """Estimate days for a task based on keywords."""
    lower = action.lower()
    for keyword, days in _TIME_KEYWORDS.items():
        if keyword in lower:
            return days
    # Default by phase
    if "phase 1" in phase.lower() or "skill gap" in phase.lower():
        return 30
    if "phase 2" in phase.lower() or "current" in phase.lower():
        return 21
    if "phase 3" in phase.lower() or "next" in phase.lower():
        return 45
    if "phase 4" in phase.lower() or "long" in phase.lower():
        return 60
    return 14


def _build_tasks(plan: dict) -> list[dict]:
    """Extract roadmap phases/actions into a flat task list with time estimates."""
    roadmap = plan.get("roadmap") or {}
    phases = roadmap.get("phases", [])
    tasks = []
    task_id = 0
    for phase_obj in phases:
        phase_name = phase_obj.get("phase", "")
        for action in phase_obj.get("actions", []):
            tasks.append({
                "id": task_id,
                "phase": phase_name,
                "action": action,
                "done": False,
                "estimated_days": _estimate_days(action, phase_name),
            })
            task_id += 1
    return tasks


def save_progress(user_id: str, plan: dict) -> str:
    """Persist a career plan snapshot linked to *user_id*.

    Returns the inserted document's ``_id`` as a string.
    """
    db = get_db()
    tasks = _build_tasks(plan)
    doc = {
        "user_id": user_id,
        "target_career": plan.get("target_career"),
        "current_stage": plan.get("current_stage"),
        "current_role": plan.get("current_role"),
        "is_custom_career": plan.get("is_custom_career", False),
        "roadmap_summary": (plan.get("roadmap") or {}).get("summary"),
        "tasks": tasks,
        "full_plan": plan,
        "created_at": datetime.now(timezone.utc),
    }
    result = db.career_plans.insert_one(doc)
    return str(result.inserted_id)


def _build_tasks_from_doc(doc: dict) -> list[dict]:
    """Extract tasks from a document, handling both old and new schema.

    New schema: roadmap lives inside ``full_plan``.
    Old schema: ``roadmap`` sits at the document root.
    """
    # Try new schema first
    if doc.get("full_plan"):
        return _build_tasks(doc["full_plan"])
    # Old schema – roadmap at root level
    roadmap = doc.get("roadmap")
    if roadmap and isinstance(roadmap, dict):
        return _build_tasks({"roadmap": roadmap})
    return []


def _normalise_doc(doc: dict) -> dict:
    """Pull career metadata from the old ``profile`` sub-object when needed."""
    target = doc.get("target_career") or ""
    stage = doc.get("current_stage") or ""
    role = doc.get("current_role")
    profile = doc.get("profile")
    if not target and profile:
        target = profile.get("target_career", "")
    if not stage and profile:
        stage = profile.get("current_stage", "")
    summary = doc.get("roadmap_summary")
    if not summary:
        rm = doc.get("roadmap") or doc.get("full_plan", {}).get("roadmap") or {}
        summary = rm.get("summary")
    return {
        "target_career": target,
        "current_stage": stage,
        "current_role": role,
        "roadmap_summary": summary,
    }


def get_user_progress(user_id: str) -> list[dict]:
    """Return all career-plan entries for *user_id*, newest first.

    - Old documents saved before auth (no ``user_id``) are claimed for
      the current user so they appear in their progress.
    - Old documents that pre-date the tasks feature are backfilled
      on-the-fly from their stored roadmap and persisted once.
    """
    db = get_db()

    # Claim orphan (anonymous) plans for this user
    db.career_plans.update_many(
        {"user_id": {"$exists": False}},
        {"$set": {"user_id": user_id}},
    )

    cursor = (
        db.career_plans
        .find({"user_id": user_id})
        .sort("created_at", -1)
    )
    entries = []
    for doc in cursor:
        tasks = doc.get("tasks")

        # Backfill tasks for documents that don't have them yet
        if not tasks:
            tasks = _build_tasks_from_doc(doc)
            if tasks:
                db.career_plans.update_one(
                    {"_id": doc["_id"]},
                    {"$set": {"tasks": tasks}},
                )

        meta = _normalise_doc(doc)
        entries.append({
            "id": str(doc["_id"]),
            "target_career": meta["target_career"],
            "current_stage": meta["current_stage"],
            "current_role": meta["current_role"],
            "is_custom_career": doc.get("is_custom_career", False),
            "roadmap_summary": meta["roadmap_summary"],
            "tasks": tasks or [],
            "created_at": doc.get("created_at", datetime.now(timezone.utc)),
        })
    return entries


def toggle_task(plan_id: str, task_id: int, done: bool) -> bool:
    """Toggle a single task's done state. Returns True if updated."""
    db = get_db()
    result = db.career_plans.update_one(
        {"_id": ObjectId(plan_id), "tasks.id": task_id},
        {"$set": {"tasks.$.done": done}},
    )
    return result.modified_count > 0
