"""Assessment routes for the richer frontend assessment workflow."""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.database.mongo_connection import get_db
from app.models.request_models import AssessmentInput, AssessmentResponse
from app.routes.auth import get_current_user
from app.services.assessment_service import run_assessment
from app.services.auth_service import decode_access_token

router = APIRouter(prefix="/api", tags=["Assessment"])


def _resolve_user_id(http_request: Request) -> str | None:
    auth_header = http_request.headers.get("authorization", "")
    if not auth_header.startswith("Bearer "):
        return None

    payload = decode_access_token(auth_header[7:])
    if not payload or not payload.get("sub"):
        return None

    try:
        db = get_db()
        user_doc = db.users.find_one({"email": payload["sub"]})
    except Exception:
        return None

    if not user_doc:
        return None
    return str(user_doc["_id"])


@router.post("/assessment", response_model=AssessmentResponse)
def create_assessment(body: AssessmentInput, http_request: Request):
    """Run the frontend assessment pipeline and optionally persist it."""
    result = run_assessment(body.model_dump())

    try:
        db = get_db()
        db.assessments.insert_one({
            "user_id": _resolve_user_id(http_request),
            "request": body.model_dump(),
            "result": result,
            "created_at": datetime.now(timezone.utc),
        })
    except Exception:
        pass

    return AssessmentResponse(**result)


@router.get("/assessment/latest", response_model=AssessmentResponse)
def get_latest_assessment(current_user: dict = Depends(get_current_user)):
    """Return the latest saved assessment for the authenticated user."""
    db = get_db()
    doc = db.assessments.find_one(
        {"user_id": str(current_user["_id"]), "result": {"$exists": True}},
        sort=[("created_at", -1)],
    )
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No assessment found for this user",
        )

    return AssessmentResponse(**doc["result"])