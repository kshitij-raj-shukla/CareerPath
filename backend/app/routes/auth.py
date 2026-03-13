# auth.py – Authentication routes (signup, login, profile)
#
# POST /api/signup   – create a new user account
# POST /api/login    – authenticate and receive a JWT
# GET  /api/profile  – return the current user's profile (protected)

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.models.user_model import (
    UserSignup,
    UserLogin,
    TokenResponse,
    UserProfileResponse,
    UserProfileUpdate,
)
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)
from app.database.mongo_connection import get_db

router = APIRouter(prefix="/api", tags=["Auth"])

# OAuth2 scheme – reads the "Authorization: Bearer <token>" header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")


# ── Dependency: extract current user from JWT ──────────────────

def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """Decode the JWT, look up the user in MongoDB, and return the doc.

    Raises 401 if the token is invalid or the user no longer exists.
    """
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_email: str | None = payload.get("sub")
    if user_email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload missing subject",
            headers={"WWW-Authenticate": "Bearer"},
        )

    db = get_db()
    user = db.users.find_one({"email": user_email})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


# ── POST /signup ───────────────────────────────────────────────

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(body: UserSignup):
    """Register a new user account.

    - Hashes the password with bcrypt before storing.
    - Rejects duplicate emails with 409 Conflict.
    """
    db = get_db()

    # Check for existing user
    if db.users.find_one({"email": body.email}):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    user_doc = {
        "name": body.name,
        "email": body.email,
        "password": hash_password(body.password),
        "current_stage": body.current_stage,
        "target_career": body.target_career,
    }
    db.users.insert_one(user_doc)

    return {"message": "Account created successfully"}


# ── POST /login ────────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
def login(body: UserLogin):
    """Authenticate a user and return a JWT access token.

    - Verifies email exists.
    - Verifies bcrypt password hash.
    - Returns a signed JWT with the email as the subject claim.
    """
    db = get_db()
    user = db.users.find_one({"email": body.email})

    if user is None or not verify_password(body.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(data={"sub": user["email"]})
    return TokenResponse(access_token=token)


# ── GET /profile ───────────────────────────────────────────────

@router.get("/profile", response_model=UserProfileResponse)
def get_profile(current_user: dict = Depends(get_current_user)):
    """Return the authenticated user's profile (password excluded)."""
    return UserProfileResponse(
        id=str(current_user["_id"]),
        name=current_user["name"],
        email=current_user["email"],
        current_stage=current_user.get("current_stage"),
        target_career=current_user.get("target_career"),
    )


# ── PATCH /profile ─────────────────────────────────────────────

@router.patch("/profile", response_model=UserProfileResponse)
def update_profile(body: UserProfileUpdate, current_user: dict = Depends(get_current_user)):
    """Update editable profile fields for the authenticated user."""
    db = get_db()

    updates: dict[str, str] = {}
    if body.current_stage is not None:
        cleaned_stage = body.current_stage.strip()
        if not cleaned_stage:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current stage cannot be empty",
            )
        updates["current_stage"] = cleaned_stage

    if body.target_career is not None:
        cleaned_target = body.target_career.strip()
        if not cleaned_target:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Target career cannot be empty",
            )
        updates["target_career"] = cleaned_target

    if not updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No profile fields provided for update",
        )

    db.users.update_one({"_id": current_user["_id"]}, {"$set": updates})

    updated = db.users.find_one({"_id": current_user["_id"]})
    if updated is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return UserProfileResponse(
        id=str(updated["_id"]),
        name=updated["name"],
        email=updated["email"],
        current_stage=updated.get("current_stage"),
        target_career=updated.get("target_career"),
    )
