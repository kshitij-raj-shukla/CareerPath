# main.py – Re-export the FastAPI app from the app package.
# This ensures `uvicorn main:app` and `uvicorn app.main:app` both work.

from app.main import app  # noqa: F401
