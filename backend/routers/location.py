"""
AgroGuru — Location Intelligence API

Endpoints:
  GET /location/reverse   — Reverse geocode (lat, lon) → district, city, state
  GET /location/nearby    — Find nearby places via Overpass API (OpenStreetMap)

Uses:
  - Nominatim (free, no API key) for reverse geocoding
  - Overpass API (free, no API key) for nearby place discovery
  - In-memory TTL caching to respect rate limits
"""

from fastapi import APIRouter, Query, HTTPException
from typing import Optional
import httpx
import math
import hashlib
import time

router = APIRouter(prefix="/location", tags=["Location Intelligence"])

# ─── CONFIGURATION ───
NOMINATIM_BASE = "https://nominatim.openstreetmap.org"
OVERPASS_BASE = "https://overpass-api.de/api/interpreter"
USER_AGENT = "AgroGuru-Agricultural-Platform/2.3.0 (academic-project)"
DEFAULT_RADIUS = 60000  # 60 km

# ─── IN-MEMORY CACHE (TTL = 15 minutes) ───
_cache = {}
CACHE_TTL = 900  # seconds


def _cache_get(key: str):
    """Get a cached value if it hasn't expired."""
    if key in _cache:
        value, timestamp = _cache[key]
        if time.time() - timestamp < CACHE_TTL:
            return value
        else:
            del _cache[key]
    return None


def _cache_set(key: str, value):
    """Store a value in the cache with current timestamp."""
    _cache[key] = (value, time.time())
    # Evict old entries if cache grows too large
    if len(_cache) > 200:
        oldest_key = min(_cache, key=lambda k: _cache[k][1])
        del _cache[oldest_key]


# ─── OSM TAG MAPPING ───
OSM_TAGS = {
    "market": [
        '["amenity"="marketplace"]',
        '["shop"="farm"]',
        '["shop"="agrarian"]',
        '["name"~"APMC|Mandi|Market Yard|Krishi|Bazar|Bazaar|मंडी|बाजार",i]'
    ],
    "nursery": [
        '["shop"="garden_centre"]',
        '["landuse"="plant_nursery"]',
        '["shop"="garden"]',
        '["name"~"Nursery|Sapling|Roopvatika|रोपवाटिका|नर्सरी",i]'
    ],
    "laboratory": [
        '["amenity"="laboratory"]',
        '["office"="research"]',
        '["healthcare"="laboratory"]',
        '["name"~"Lab|Laboratory|Testing|Soil|Research|प्रयोगशाळा",i]'
    ]
}


def _haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in km between two GPS coordinates."""
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.asin(math.sqrt(a))
    return R * c


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ENDPOINT: Reverse Geocoding
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/reverse")
async def reverse_geocode(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude")
):
    """
    Reverse geocode coordinates to get district, city, village, and state.
    Uses Nominatim (OpenStreetMap) — free, no API key.
    """
    cache_key = f"reverse_{round(lat, 4)}_{round(lon, 4)}"
    cached = _cache_get(cache_key)
    if cached:
        return cached

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(
                f"{NOMINATIM_BASE}/reverse",
                params={"lat": lat, "lon": lon, "format": "json", "addressdetails": "1"},
                headers={"User-Agent": USER_AGENT, "Accept-Language": "en"}
            )
            res.raise_for_status()
            data = res.json()

        addr = data.get("address", {})

        # In India: county = District level
        district = (
            addr.get("county") or
            addr.get("state_district") or
            addr.get("city") or
            addr.get("town") or
            "Unknown"
        ).replace(" District", "")

        city = addr.get("city") or addr.get("town") or addr.get("village") or district
        village = addr.get("village") or addr.get("town") or addr.get("suburb") or ""
        state = addr.get("state") or "Maharashtra"

        # Build readable full address
        parts = [village, city if city != village else "", district if district != city else "", state]
        parts = list(dict.fromkeys(filter(None, parts)))  # Deduplicate
        full_address = ", ".join(parts)

        result = {
            "district": district,
            "city": city,
            "village": village,
            "state": state,
            "fullAddress": full_address,
            "lat": lat,
            "lon": lon
        }

        _cache_set(cache_key, result)
        return result

    except httpx.HTTPError as e:
        print(f"🛑 Nominatim Error: {e}")
        return {
            "district": "Unknown",
            "city": "Unknown",
            "village": "",
            "state": "Maharashtra",
            "fullAddress": "Location detected",
            "lat": lat,
            "lon": lon
        }


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ENDPOINT: Nearby Places
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@router.get("/nearby")
async def get_nearby_places(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    type: str = Query(..., description="Place type: market, nursery, or laboratory"),
    radius: int = Query(DEFAULT_RADIUS, description="Search radius in meters")
):
    """
    Find nearby places using OpenStreetMap's Overpass API.
    Searches for markets, nurseries, or laboratories within a radius.
    Free — no API key required.
    """
    if type not in OSM_TAGS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid type '{type}'. Must be: market, nursery, or laboratory"
        )

    # Check cache
    cache_key = f"nearby_{type}_{round(lat, 3)}_{round(lon, 3)}_{radius}"
    cached = _cache_get(cache_key)
    if cached:
        print(f"📦 Cache hit: {cache_key}")
        return cached

    tags = OSM_TAGS[type]

    # Build Overpass QL query
    union_parts = "\n".join(
        f"node{tag}(around:{radius},{lat},{lon});\nway{tag}(around:{radius},{lat},{lon});"
        for tag in tags
    )

    query = f"""
    [out:json][timeout:30];
    (
      {union_parts}
    );
    out center tags;
    """

    try:
        async with httpx.AsyncClient(timeout=40.0) as client:
            res = await client.post(
                OVERPASS_BASE,
                data={"data": query},
                headers={"User-Agent": USER_AGENT}
            )
            res.raise_for_status()
            data = res.json()

        elements = data.get("elements", [])

        places = []
        seen_names = set()

        for el in elements:
            tags_data = el.get("tags", {})
            name = tags_data.get("name")
            if not name:
                continue

            # Deduplicate by name
            name_upper = name.upper()
            if name_upper in seen_names:
                continue
            seen_names.add(name_upper)

            # HARD FILTER: Remove Pune results
            addr_str = " ".join([
                tags_data.get("addr:city", ""),
                tags_data.get("addr:district", ""),
                name
            ]).upper()
            if "PUNE" in addr_str or "BANER" in addr_str or "WAKAD" in addr_str:
                continue

            place_lat = el.get("lat") or (el.get("center", {}).get("lat"))
            place_lon = el.get("lon") or (el.get("center", {}).get("lon"))

            if not place_lat or not place_lon:
                continue

            distance = _haversine(lat, lon, place_lat, place_lon)

            # Build address
            addr_parts = [
                tags_data.get("addr:street"),
                tags_data.get("addr:city") or tags_data.get("addr:town") or tags_data.get("addr:village"),
                tags_data.get("addr:district"),
                tags_data.get("addr:state")
            ]
            address = ", ".join(filter(None, addr_parts)) or tags_data.get("description", "Maharashtra")

            places.append({
                "name": name,
                "lat": place_lat,
                "lon": place_lon,
                "address": address,
                "phone": tags_data.get("phone") or tags_data.get("contact:phone") or "",
                "distance": round(distance, 1),
                "rating": float(tags_data["stars"]) if tags_data.get("stars") else None,
                "source": "openstreetmap",
                "osmId": el.get("id"),
                "website": tags_data.get("website") or tags_data.get("contact:website") or "",
                "opening_hours": tags_data.get("opening_hours") or ""
            })

        # Sort by distance (nearest first)
        places.sort(key=lambda p: p["distance"])

        print(f"🗺️ Overpass: Found {len(places)} {type}(s) within {radius/1000}km of ({lat}, {lon})")

        _cache_set(cache_key, places)
        return places

    except httpx.HTTPError as e:
        print(f"🛑 Overpass API Error: {e}")
        return []
    except Exception as e:
        print(f"🛑 Unexpected error in nearby search: {e}")
        return []
