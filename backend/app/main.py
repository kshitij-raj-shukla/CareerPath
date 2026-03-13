# main.py – FastAPI application entry point
#
# Wires together lifespan (model + DB), middleware, and routers.
# Run with:  uvicorn app.main:app --reload

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.ml.model_loader import load_model, unload_model
from app.ml.assessment_model_loader import (
    load_assessment_model,
    unload_assessment_model,
)
from app.database.mongo_connection import connect as db_connect, close as db_close
from app.routes.predict import router as predict_router
from app.routes.career import router as career_router
from app.routes.assessment import router as assessment_router
from app.routes.auth import router as auth_router
from app.routes.progress import router as progress_router


# ── Application lifespan ───────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: load ML model + connect to MongoDB
    try:
        load_model()
    except FileNotFoundError as exc:
        print(f"WARNING: {exc} – /api/predict will return 503")

    try:
        load_assessment_model()
    except FileNotFoundError as exc:
        print(f"WARNING: {exc} – /api/assessment will use heuristic scoring")

    try:
        db_connect()
    except Exception as exc:
        print(f"WARNING: MongoDB unavailable – {exc}")

    yield

    # Shutdown: release resources
    unload_assessment_model()
    unload_model()
    db_close()


app = FastAPI(
    title="Career Readiness & Personalized Roadmap API",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ───────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────────
app.include_router(predict_router)
app.include_router(career_router)
app.include_router(assessment_router)
app.include_router(auth_router)
app.include_router(progress_router)


# ── Health check ───────────────────────────────────────────────
@app.get("/health")
def health_check():
    return {"status": "healthy"}
