from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Query, Request
from database import get_database
from middleware.auth import get_current_user_id
from models.nursery import NurseryCreate
from datetime import datetime
import os
import uuid
from typing import List, Optional

router = APIRouter(prefix="/nursery", tags=["Nursery Management"])

UPLOAD_DIR = "uploads"

@router.post("/register")
async def register_nursery(
    request_data: Request,
    nurseryImage: Optional[UploadFile] = File(None),
    user_id: str = Depends(get_current_user_id)
):
    # Node.js: router.post('/register', auth, upload.single('nurseryImage'), async (req, res) => {
    # Note: Node.js was using req.body and req.query combined.
    # We will use Form fields for body data since we have a file upload.
    
    # Re-reading parameters from the request if sent as form-data
    form_data = await request_data.form()
    
    db = get_database()
    
    filename = ""
    if nurseryImage:
        filename = f"nursery-{uuid.uuid4()}{os.path.splitext(nurseryImage.filename)[1]}"
        with open(os.path.join(UPLOAD_DIR, filename), "wb") as f:
            f.write(await nurseryImage.read())
            
    # Extract query params from URL (Node.js: const { lng, ltd } = req.query;)
    params = request_data.query_params
    lng = float(params.get("lng", 0))
    ltd = float(params.get("ltd", 0))

    nursery_doc = {
        "name": form_data.get("name"),
        "phone": form_data.get("phone"),
        "address": form_data.get("address"),
        "timing": {
            "opening": form_data.get("openTime", "8:00 AM"),
            "closing": form_data.get("closeTime", "6:00 PM")
        },
        "offDay": form_data.get("offDay", "Sunday"),
        "nurseryImage": filename,
        "geometry": {
            "type": "Point",
            "coordinates": [lng, ltd]
        },
        "userId": user_id,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
        "Items": []
    }
    
    await db.nurseries.insert_one(nursery_doc)
    return {"message": "Nursery registered successfully"}

import httpx

@router.delete("/clear-fake")
async def clear_fake_nurseries(user_id: str = Depends(get_current_user_id)):
    # This matches the user's request to "delete fake data"
    db = get_database()
    result = await db.nurseries.delete_many({})
    return {"message": f"Successfully deleted {result.deleted_count} nurseries."}

import math

def calculate_distance(lat1, lon1, lat2, lon2):
    # Haversine formula to calculate distance in km
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))
    return R * c

@router.get("/getnursery")
async def get_nurseries(lng: float = Query(0), lat: float = Query(0)):
    db = get_database()
    
    # 1. Fetch EVERYTHING
    cursor = db.nurseries.find().sort("createdAt", -1)
    all_nursery_data = await cursor.to_list(length=100)
    
    # 2. Advanced Multi-Tier Sorting Engine
    tier0_near_me = [] # Within 5km
    tier1_sgu = []    # SGU/Atigre area
    tier2_regional = [] # Local District
    tier3_pune = []     # Far away
    
    for n in all_nursery_data:
        try:
            name = n.get("name", "").upper()
            addr = n.get("address", "").upper()
            
            # Safe coordinates
            n_lat = 0
            n_lng = 0
            if "geometry" in n and "coordinates" in n["geometry"]:
                 n_lng = n["geometry"]["coordinates"][0]
                 n_lat = n["geometry"]["coordinates"][1]

            # Calculate Proximity
            dist = 9999
            if lat != 0 and lng != 0 and n_lat != 0:
                dist = calculate_distance(lat, lng, n_lat, n_lng)
            
            n["distance"] = round(dist, 1)

            # HARD FILTER: Block Pune completely
            if any(k in name or k in addr for k in ["PUNE", "BANER", "WAKAD", "HADAPSAR"]) or (18.4 <= n_lat <= 18.6):
                continue

            # Ranking Logic
            if dist <= 5: # Within 5km = NEAR ME
                tier0_near_me.append(n)
            elif any(k in name or k in addr for k in ["SGU", "ATIGRE", "HATKANANGALE", "KOLHAPUR", "ICHALKARANJI", "KARAD"]):
                tier1_sgu.append(n)
            else:
                tier2_regional.append(n)
        except Exception as e:
            print(f"Skipping nursery: {e}")
            continue
            
    # Combine (Near Me -> SGU -> Regional) - Pune REMOVED
    final_nurseries = tier0_near_me + tier1_sgu + tier2_regional

    # 3. Convert ObjectIds for JSON
    for n in final_nurseries:
        if "_id" in n: n["_id"] = str(n["_id"])
        if "userId" in n: n["userId"] = str(n["userId"])
        
    print(f"DEBUG: Returning {len(final_nurseries)} nurseries (SGU: {len(tier1_sgu)}, Regional: {len(tier2_regional)}, Pune: {len(tier3_pune)})")
    return final_nurseries

@router.get("/usernursery")
async def get_user_nursery(user_id: str = Depends(get_current_user_id)):
    db = get_database()
    nursery = await db.nurseries.find_one({"userId": user_id})
    if not nursery:
        raise HTTPException(status_code=404, detail="No nursery found")
        
    nursery["_id"] = str(nursery["_id"])
    nursery["userId"] = str(nursery["userId"])
    return nursery

@router.post("/itemadd")
async def add_item(
    itemname: str = Form(...),
    photo: Optional[UploadFile] = File(None),
    user_id: str = Depends(get_current_user_id)
):
    db = get_database()
    nursery = await db.nurseries.find_one({"userId": user_id})
    if not nursery:
        raise HTTPException(status_code=404, detail="Nursery not found")
        
    filename = ""
    if photo:
        filename = f"item-{uuid.uuid4()}{os.path.splitext(photo.filename)[1]}"
        with open(os.path.join(UPLOAD_DIR, filename), "wb") as f:
            f.write(await photo.read())
            
    await db.nurseries.update_one(
        {"_id": nursery["_id"]},
        {"$push": {"Items": {"itemname": itemname, "photo": filename}}}
    )
    
    return {"message": "Item added successfully"}
