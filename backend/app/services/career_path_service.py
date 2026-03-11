# career_path_service.py – Load and query predefined career paths
#
# Reads career_paths.json once on first access and caches the result.
# Provides helpers to list available careers and retrieve a single path.

from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

# Resolve the JSON file relative to this module's directory
_DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "career_paths.json"

# Module-level cache – loaded once on first call
_cache: Optional[dict] = None


def _load() -> dict:
    """Load career paths from disk and populate the cache."""
    global _cache
    if _cache is None:
        with open(_DATA_FILE, encoding="utf-8") as fh:
            _cache = json.load(fh)
        print(f"[career_path_service] Loaded {len(_cache)} career paths")
    return _cache


def list_careers() -> list[str]:
    """Return all available career keys (e.g. ['IAS', 'Software Engineer', ...])."""
    return list(_load().keys())


def get_career_path(career: str) -> Optional[dict]:
    """Return the full career path dict for *career*, or None if not found.

    The lookup is case-insensitive and strips extra whitespace so that
    user input like "software engineer" or " Data Scientist " still matches.
    """
    data = _load()

    # Exact match first
    if career in data:
        return data[career]

    # Case-insensitive fallback
    normalised = career.strip().lower()
    for key, value in data.items():
        if key.lower() == normalised:
            return value

    return None


def get_stages_for_career(career: str) -> list[dict]:
    """Return the ordered list of stages for a career, or empty list."""
    path = get_career_path(career)
    if path is None:
        return []
    return path.get("stages", [])
