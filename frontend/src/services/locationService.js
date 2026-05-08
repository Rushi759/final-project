/**
 * AgroGuru — Centralized Location Service
 * 
 * Provides:
 *   1. getCurrentLocation()  — Browser GPS coordinates
 *   2. reverseGeocode()      — District/address via Nominatim
 *   3. searchNearbyPlaces()  — Nearby places via Overpass API (OpenStreetMap)
 *   4. calculateDistance()   — Haversine distance between two points
 * 
 * All APIs used are FREE with no API key required.
 */

// ─── DEFAULT FALLBACK (Kolhapur District) ───
const DEFAULT_LOCATION = {
  lat: 16.7644,
  lon: 74.3414,
  city: 'Kolhapur',
  district: 'Kolhapur',
  village: '',
  state: 'Maharashtra',
  fullAddress: 'Kolhapur, Maharashtra',
  status: 'fallback'
};

// ─── NOMINATIM CONFIG ───
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const NOMINATIM_HEADERS = {
  'User-Agent': 'AgroGuru-Agricultural-Platform/2.3.0 (academic-project)',
  'Accept-Language': 'en'
};

// ─── OVERPASS API CONFIG ───
const OVERPASS_BASE = 'https://overpass-api.de/api/interpreter';
const DEFAULT_RADIUS = 25000; // 25 km — suitable for rural agricultural areas

/**
 * OSM tag mapping for AgroGuru categories.
 * Each category searches multiple relevant tags for comprehensive coverage.
 */
const OSM_TAG_MAP = {
  market: [
    '["amenity"="marketplace"]',
    '["shop"="farm"]',
    '["shop"="agrarian"]',
    '["name"~"APMC|Mandi|Market Yard|Krishi|Bazar|Bazaar|मंडी|बाजार",i]'
  ],
  nursery: [
    '["shop"="garden_centre"]',
    '["landuse"="plant_nursery"]',
    '["shop"="garden"]',
    '["name"~"Nursery|Sapling|Roopvatika|रोपवाटिका|नर्सरी",i]'
  ],
  laboratory: [
    '["amenity"="laboratory"]',
    '["office"="research"]',
    '["name"~"Lab|Laboratory|Testing|Soil|Research|प्रयोगशाळा",i]',
    '["healthcare"="laboratory"]'
  ]
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. GPS — Get Current Position
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Get the user's current GPS coordinates.
 * @returns {Promise<{lat: number, lon: number}>}
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        console.error("GPS Error:", error.message);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0 // Always get a fresh position
      }
    );
  });
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. REVERSE GEOCODING — Nominatim
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Reverse geocode coordinates to get district, city, village, and full address.
 * Uses OpenStreetMap Nominatim (free, no API key).
 * 
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<{district, city, village, state, fullAddress}>}
 */
export async function reverseGeocode(lat, lon) {
  try {
    const url = `${NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
    const res = await fetch(url, { headers: NOMINATIM_HEADERS });
    
    if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`);
    
    const data = await res.json();
    const addr = data.address || {};

    // In India/Maharashtra: state_district = District (e.g. Satara/Kolhapur), county = Taluka (e.g. Panhala/Hatkanangle).
    // User requested to ONLY show the District name and hide village/city/taluka.
    const district = (addr.state_district || addr.county || addr.city || addr.town || 'Unknown')
      .replace(' District', '');
    
    // Force city to be district so all UI components just show "Satara" or "Kolhapur"
    const city = district;
    const village = '';
    const state = addr.state || 'Maharashtra';

    // Build a readable full address (District, State only)
    const fullAddress = `${district}, ${state}`;

    return { district, city, village, state, fullAddress };
  } catch (err) {
    console.error("Reverse geocoding failed:", err);
    return {
      district: 'Unknown',
      city: 'Unknown',
      village: '',
      state: 'Maharashtra',
      fullAddress: 'Location detected'
    };
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. NEARBY PLACES — Overpass API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Search for nearby places using OpenStreetMap's Overpass API.
 * 
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {'market'|'nursery'|'laboratory'} type - Category to search
 * @param {number} radius - Search radius in meters (default: 25000)
 * @returns {Promise<Array<{name, lat, lon, address, phone, distance, source}>>}
 */
export async function searchNearbyPlaces(lat, lon, type, radius = DEFAULT_RADIUS) {
  const tags = OSM_TAG_MAP[type];
  if (!tags) {
    console.error(`Unknown place type: ${type}`);
    return [];
  }

  try {
    // Build Overpass QL query — search for nodes AND ways matching our tags
    const unionParts = tags.map(tag => 
      `node${tag}(around:${radius},${lat},${lon});\nway${tag}(around:${radius},${lat},${lon});`
    ).join('\n');

    const query = `
      [out:json][timeout:15];
      (
        ${unionParts}
      );
      out center tags;
    `;

    const res = await fetch(OVERPASS_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`
    });

    if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`);

    const data = await res.json();
    const elements = data.elements || [];

    // Transform OSM elements into our standard place format
    const places = elements
      .filter(el => el.tags && el.tags.name) // Must have a name
      .map(el => {
        const placeLat = el.lat || el.center?.lat;
        const placeLon = el.lon || el.center?.lon;
        const distance = calculateDistance(lat, lon, placeLat, placeLon);
        
        return {
          name: el.tags.name,
          lat: placeLat,
          lon: placeLon,
          address: buildOSMAddress(el.tags),
          phone: el.tags.phone || el.tags['contact:phone'] || '',
          distance: Math.round(distance * 10) / 10, // 1 decimal
          rating: el.tags.stars ? parseFloat(el.tags.stars) : null,
          source: 'openstreetmap',
          osmId: el.id,
          tags: el.tags
        };
      })
      .sort((a, b) => a.distance - b.distance); // Nearest first

    console.log(`🗺️ Overpass: Found ${places.length} ${type}(s) within ${radius/1000}km`);
    return places;

  } catch (err) {
    console.error(`Overpass API error (${type}):`, err);
    return [];
  }
}

/**
 * Build a readable address string from OSM tags.
 */
function buildOSMAddress(tags) {
  const parts = [
    tags['addr:street'],
    tags['addr:city'] || tags['addr:town'] || tags['addr:village'],
    tags['addr:district'],
    tags['addr:state']
  ].filter(Boolean);

  if (parts.length > 0) return parts.join(', ');
  
  // Fallback: use the "description" or "note" tag
  return tags.description || tags.note || 'Maharashtra';
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. HAVERSINE DISTANCE CALCULATOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Calculate the distance between two GPS coordinates in kilometers.
 * Uses the Haversine formula.
 * 
 * @param {number} lat1 - Point A latitude
 * @param {number} lon1 - Point A longitude  
 * @param {number} lat2 - Point B latitude
 * @param {number} lon2 - Point B longitude
 * @returns {number} Distance in km
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 9999;
  
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export { DEFAULT_LOCATION, DEFAULT_RADIUS };
