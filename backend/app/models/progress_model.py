# progress_model.py – Pydantic schemas for user progress tracking
#
# Each progress entry stores a snapshot of a career-plan generation
# linked to the authenticated user, with roadmap tasks as a to-do list.

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class TaskItem(BaseModel):
    """A single to-do task from the roadmap."""
    id: int
    phase: str
    action: str
    done: bool = False
    estimated_days: int = 7


class ProgressEntry(BaseModel):
    """Single progress record returned by GET /progress."""
    id: str
    target_career: str
    current_stage: str
    current_role: Optional[str] = None
    is_custom_career: bool = False
    roadmap_summary: Optional[str] = None
    tasks: list[TaskItem] = []
    created_at: datetime


class ProgressList(BaseModel):
    """Wrapper returned by GET /progress."""
    count: int
    entries: list[ProgressEntry]
