# Location API — Backend Endpoints

## Base Path: `/location`

### GET `/location/reverse` — Reverse Geocode

Converts GPS coordinates to a structured address with district, city, village, and state.

**Query Parameters:**
| Param | Type | Required | Description |
|---|---|---|---|
| `lat` | float | Yes | Latitude |
| `lon` | float | Yes | Longitude |

**Response:**
```json
{
  "district": "Satara",
  "city": "Karad",
  "village": "Lalgun",
  "state": "Maharashtra",
  "fullAddress": "Lalgun, Karad, Satara, Maharashtra",
  "lat": 17.68,
  "lon": 73.99
}
```

**Data Source:** Nominatim (OpenStreetMap) — free, no API key.

**Caching:** Results are cached for 15 minutes (in-memory TTL cache).

---

### GET `/location/nearby` — Find Nearby Places

Searches for nearby markets, nurseries, or laboratories using OpenStreetMap's Overpass API.

**Query Parameters:**
| Param | Type | Required | Default | Description |
|---|---|---|---|---|
| `lat` | float | Yes | — | Latitude |
| `lon` | float | Yes | — | Longitude |
| `type` | string | Yes | — | Place type: `market`, `nursery`, or `laboratory` |
| `radius` | int | No | 50000 | Search radius in meters (frontend uses 50,000 = 50 km) |

**Response:**
```json
[
  {
    "name": "Satara APMC Market Yard",
    "lat": 17.6805,
    "lon": 73.9911,
    "address": "Powai Naka, Satara",
    "phone": "+91 2162 234567",
    "distance": 2.3,
    "rating": null,
    "source": "openstreetmap",
    "osmId": 12345678,
    "website": "",
    "opening_hours": "Mo-Sa 06:00-18:00"
  }
]
```

**Errors:**
| Code | Detail |
|---|---|
| 400 | Invalid type — must be `market`, `nursery`, or `laboratory` |
| 500 | Overpass API timeout or error |

**Data Source:** Overpass API (OpenStreetMap) — free, no API key.

**Caching:** Results are cached for 15 minutes per (type, lat, lon, radius) key.

---

## Rate Limiting & Caching

- Nominatim: Max 1 request/second (enforced by User-Agent policy)
- Overpass API: Fair use policy
- Backend cache: In-memory dict with 15-minute TTL, max 200 entries
- Pune results are hard-filtered from all responses

## OSM Tag Mapping

| Category | Tags (English + Marathi/Hindi) |
|---|---|
| Market | `amenity=marketplace`, `shop=farm`, `shop=agrarian`, names: `APMC`, `Mandi`, `Market Yard`, `मंडी`, `बाजार` |
| Nursery | `shop=garden_centre`, `landuse=plant_nursery`, `shop=garden`, names: `Nursery`, `Sapling`, `रोपवाटिका`, `नर्सरी` |
| Laboratory | `amenity=laboratory`, `office=research`, `healthcare=laboratory`, names: `Lab`, `Testing`, `Soil`, `प्रयोगशाळा` |
