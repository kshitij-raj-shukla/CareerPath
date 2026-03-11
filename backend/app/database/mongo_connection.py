# mongo_connection.py – MongoDB connection management
#
# Provides an async-compatible MongoDB client using pymongo.
# Connection is established at startup and closed at shutdown.

import os
from pymongo import MongoClient
from pymongo.database import Database

# Read connection string from environment, default to local MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB_NAME", "career_readiness")

_client: MongoClient | None = None
_db: Database | None = None


def connect() -> Database:
    """Open a MongoDB connection and return the database handle."""
    global _client, _db
    _client = MongoClient(MONGO_URI)
    _db = _client[DB_NAME]
    print(f"[mongo] Connected to {MONGO_URI} / {DB_NAME}")
    return _db


def get_db() -> Database:
    """Return the current database handle (call connect() first)."""
    if _db is None:
        raise RuntimeError("Database not connected – call connect() first")
    return _db


def close() -> None:
    """Close the MongoDB connection."""
    global _client, _db
    if _client:
        _client.close()
        _client = None
        _db = None
        print("[mongo] Connection closed")
