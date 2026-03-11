# progress.py – Protected progress routes
#
# GET   /api/progress              – list all career-plan snapshots for the current user
# PATCH /api/progress/{id}/task    – toggle a task's done state
#
# Every endpoint requires a valid JWT (via get_current_user dependency).

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.routes.auth import get_current_user
from app.models.progress_model import ProgressList, ProgressEntry
from app.services.progress_service import get_user_progress, toggle_task

router = APIRouter(prefix="/api", tags=["Progress"])


@router.get("/progress", response_model=ProgressList)
def list_progress(current_user: dict = Depends(get_current_user)):
    """Return every career-plan snapshot belonging to the authenticated user."""
    user_id = str(current_user["_id"])
    entries = get_user_progress(user_id)
    return ProgressList(
        count=len(entries),
        entries=[ProgressEntry(**e) for e in entries],
    )


class ToggleTaskBody(BaseModel):
    task_id: int
    done: bool


@router.patch("/progress/{plan_id}/task")
def toggle_task_endpoint(
    plan_id: str,
    body: ToggleTaskBody,
    current_user: dict = Depends(get_current_user),
):
    """Toggle a single roadmap task's completion state."""
    updated = toggle_task(plan_id, body.task_id, body.done)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan or task not found",
        )
    return {"ok": True}
