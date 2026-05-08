# Live Location & Nearby Places Discovery

## Overview

AgroGuru uses **live GPS location** to dynamically discover nearby agro markets, scientific labs, and plant nurseries. The system detects the user's district and full address using reverse geocoding and searches for nearby points of interest using OpenStreetMap data.

## Architecture

```
Browser GPS API  →  agroguru_context.js  →  Nominatim (Reverse Geocode)
                                         →  District, City, Village
                                         
Market.js / Nursery.js / Laboratory.js
      ↓
Backend /location/nearby  →  Overpass API  →  OpenStreetMap DB
      ↓
Merge: OSM Places + Backend DB + Dummy Fallback
      ↓
📱 User Interface (sorted by distance, with district badge)
```

## APIs Used (All Free — No API Keys)

| Service | Purpose | Rate Limit |
|---|---|---|
| `navigator.geolocation` | Browser GPS coordinates | Unlimited |
| **Nominatim** (nominatim.openstreetmap.org) | Reverse geocoding → District/Address | 1 request/sec |
| **Overpass API** (overpass-api.de) | Nearby places search (OSM data) | Fair use |

## How District Detection Works

1. Browser requests GPS permission from the user
2. On success, coordinates (lat, lon) are sent to **Nominatim** reverse geocoding
3. The response `address` object is parsed:
   - `address.county` → **District** (primary, used in India)
   - `address.state_district` → District (fallback)
   - `address.village` / `address.town` → Local area
   - `address.state` → State name
4. A structured address is built: `"Lalgun, Karad, Satara, Maharashtra"`

## How Nearby Places Work

The Overpass API is queried with OSM tags for each category:

| AgroGuru Category | OSM Tags Searched |
|---|---|
| **Agro Market** | `amenity=marketplace`, `shop=farm`, `shop=agrarian`, names matching `"APMC/Mandi/Market Yard/मंडी/बाजार"` |
| **Scientific Lab** | `amenity=laboratory`, `office=research`, `healthcare=laboratory`, names matching `"Lab/Testing/Soil/प्रयोगशाळा"` |
| **Plant Nursery** | `shop=garden_centre`, `landuse=plant_nursery`, names matching `"Nursery/Sapling/रोपवाटिका/नर्सरी"` |

Search radius: **60 km** (standardized across Market, Nursery, and Laboratory pages).

## Data Merge Strategy

Results are merged in priority order:
1. **Overpass API results** (real nearby places from OSM) — displayed first
2. **Backend database results** (user-registered markets/nurseries/labs)
3. **Dummy fallback data** (hardcoded regional hubs — always available)

Deduplication is by name (case-insensitive). Final list is sorted by distance (nearest first).

## Fallback Behavior

| Scenario | Behavior |
|---|---|
| GPS allowed, lock acquired fast | Uses live Wi-Fi/IP coordinates (instant) → full Overpass search |
| GPS allowed, slow satellite lock | Waits up to 20 seconds before resolving with best available location |
| GPS denied | Falls back to Kolhapur defaults (16.7050, 74.2433) — UI shows `(Enable GPS)` hint |
| Overpass API down | Shows Backend DB + Dummy data |
| Backend API down | Shows Dummy data only |
| All APIs down | Displays hardcoded regional hubs |

## Frontend Location State

The global context exposes:
```javascript
location: {
  lat: 17.68,
  lon: 73.99,
  city: "Satara",
  district: "Satara",
  village: "Lalgun",
  state: "Maharashtra",
  fullAddress: "Lalgun, Karad, Satara, Maharashtra",
  status: "live" | "fallback" | "detecting"
}
```

## Key Files

| File | Purpose |
|---|---|
| `frontend/src/services/locationService.js` | Centralized GPS, geocoding, and Overpass functions |
| `frontend/src/context/agroguru_context.js` | Global location state management |
| `frontend/src/Component/Weather.js` | Weather widget — uses live GPS context |
| `backend/routers/location.py` | Backend proxy for Nominatim + Overpass with caching |
| `frontend/src/Pages/Main_Pages/Market.js` | Market page with live location |
| `frontend/src/Pages/Main_Pages/Nursery.js` | Nursery page with live location |
| `frontend/src/Pages/Main_Pages/Laboratory.js` | Lab page with live location |

---

## GPS Accuracy Strategy

The browser Geolocation API offers two modes:

| Mode | Method | Speed | Accuracy |
|---|---|---|---|
| `enableHighAccuracy: true` | Satellite GPS lock | Slow (10–60 seconds) | Very high |
| `enableHighAccuracy: false` | Wi-Fi/IP geolocation | **Instant** | City-level |

AgroGuru uses `enableHighAccuracy: false` with a `20-second` timeout so that location resolves in **under 1 second** using the device's Wi-Fi or IP address, instead of waiting for a slow satellite lock. This is the correct strategy for indoor academic demos.

> [!TIP]
> If the location still resolves incorrectly (e.g., shows "Karvir" when in Satara), click the **Refresh Location** button (🔄) on any Market/Nursery/Lab page to force a fresh GPS detection cycle.
