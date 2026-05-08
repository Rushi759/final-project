from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Query, Request
from database import get_database
from middleware.auth import get_current_user_id
import os
import uuid
import json
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/market", tags=["Market Management"])

UPLOAD_DIR = "uploads"

@router.post("/register")
async def register_market(
    request: Request,
    marketImage: Optional[UploadFile] = File(None),
    user_id: str = Depends(get_current_user_id)
):
    form_data = await request.form()
    db = get_database()
    
    filename = ""
    if marketImage:
        filename = f"market-{uuid.uuid4()}{os.path.splitext(marketImage.filename)[1]}"
        with open(os.path.join(UPLOAD_DIR, filename), "wb") as f:
            f.write(await marketImage.read())
            
    # Extract query params
    params = request.query_params
    lng = float(params.get("lng", 0))
    ltd = float(params.get("ltd", 0))

    items_str = form_data.get("items")
    items = json.loads(items_str) if items_str else []

    market_doc = {
        "name": form_data.get("name"),
        "phone": form_data.get("phone"),
        "address": form_data.get("address"),
        "items": items,
        "marketImage": filename,
        "geometry": {
            "type": "Point",
            "coordinates": [lng, ltd]
        },
        "userId": user_id,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    await db.markets.insert_one(market_doc)
    return {"message": "Market registered successfully"}

@router.get("/getmarket")
async def get_markets(lng: float = Query(0), lat: float = Query(0)):
    db = get_database()
    
    # 1. Fetch EVERYTHING
    cursor = db.markets.find().sort("createdAt", -1)
    all_markets = await cursor.to_list(length=100)
    
    # 2. Tiered Sort Logic
    tier1_sgu = []
    tier2_regional = [] # Satara, Sangli, Kolhapur
    tier3_pune = []

    for m in all_markets:
        try:
            name = str(m.get("name", "Unnamed Market")).upper()
            addr = str(m.get("address", "No Address")).upper()
            
            # Ultra-safe coordinate access
            geometry = m.get("geometry") or {}
            coords = geometry.get("coordinates") or [0, 0]
            m_lat = coords[1] if len(coords) > 1 else 0

            # PRIORITY: Recent registrations (last 24h)
            created_at = m.get("createdAt")
            is_recent = False
            if created_at:
                now = datetime.utcnow()
                if isinstance(created_at, datetime):
                    if (now - created_at).total_seconds() < 86400:
                        is_recent = True

            # Ranking logic
            if is_recent:
               tier1_sgu.insert(0, m)
            elif any(k in name or k in addr for k in ["SGU", "ATIGRE", "HATKANANGALE", "KOLHAPUR", "KARAD", "ICHALKARANJI"]):
                tier1_sgu.append(m)
            elif "PUNE" in name or "PUNE" in addr or (18.4 <= m_lat <= 18.6):
                tier3_pune.append(m)
            else:
                tier2_regional.append(m)
        except Exception as e:
            print(f"Skipping malformed market entry: {e}")
            continue
            
    final_markets = tier1_sgu + tier2_regional + tier3_pune
    
    # 3. Final JSON Safety Conversion
    for m in final_markets:
        if "_id" in m: m["_id"] = str(m["_id"])
        if "userId" in m: m["userId"] = str(m["userId"])
        
    return final_markets

@router.get("/usermarket")
async def get_user_market(user_id: str = Depends(get_current_user_id)):
    db = get_database()
    market = await db.markets.find_one({"userId": user_id})
    if not market:
        raise HTTPException(status_code=404, detail="No market found")
        
    market["_id"] = str(market["_id"])
    market["userId"] = str(market["userId"])
    return market
