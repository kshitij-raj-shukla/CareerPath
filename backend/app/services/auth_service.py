# auth_service.py – Password hashing and JWT token management
#
# Uses bcrypt for password hashing and python-jose for JWT creation /
# verification.  The JWT secret is read from the environment so it is
# never hard-coded in source.

from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone

from passlib.context import CryptContext
from jose import JWTError, jwt

# ── Configuration ──────────────────────────────────────────────
# In production set JWT_SECRET via environment variable.
SECRET_KEY: str = os.getenv("JWT_SECRET", "change-me-before-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 1 hour

# bcrypt password hashing context
_pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ── Password helpers ───────────────────────────────────────────

def hash_password(plain: str) -> str:
    """Return the bcrypt hash of *plain*."""
    return _pwd_ctx.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """Return True if *plain* matches *hashed*."""
    return _pwd_ctx.verify(plain, hashed)


# ── JWT helpers ────────────────────────────────────────────────

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Create a signed JWT containing *data* with an expiry claim."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    """Decode and verify a JWT.  Returns the payload dict or None on failure."""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None
