from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Query, Request
from database import get_database
from middleware.auth import get_current_user_id
import os
import uuid
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/lab", tags=["Laboratory Management"])

UPLOAD_DIR = "uploads"

@router.post("/register")
async def register_lab(
    request: Request,
    laboratoryImage: Optional[UploadFile] = File(None),
    user_id: str = Depends(get_current_user_id)
):
    form_data = await request.form()
    db = get_database()
    
    filename = ""
    if laboratoryImage:
        filename = f"lab-{uuid.uuid4()}{os.path.splitext(laboratoryImage.filename)[1]}"
        with open(os.path.join(UPLOAD_DIR, filename), "wb") as f:
            f.write(await laboratoryImage.read())
            
    params = request.query_params
    lng = float(params.get("lng", 0))
    ltd = float(params.get("ltd", 0))

    lab_doc = {
        "name": form_data.get("name"),
        "phone": form_data.get("phone"),
        "address": form_data.get("address"),
        "laboratoryImage": filename,
        "geometry": {
            "type": "Point",
            "coordinates": [lng, ltd]
        },
        "userId": user_id,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
        "Services": []
    }
    
    await db.laboratories.insert_one(lab_doc)
    return {"message": "Laboratory registered successfully"}

@router.get("/getlaboratory")
async def get_laboratories(lng: float = Query(0), lat: float = Query(0)):
    db = get_database()
    
    # 1. Fetch EVERYTHING
    cursor = db.laboratories.find().sort("createdAt", -1)
    all_labs = await cursor.to_list(length=100)
    
    # 2. Tiered Sort Logic
    tier1_sgu = []
    tier2_regional = [] # Satara, Sangli, Kolhapur
    tier3_pune = []

    for l in all_labs:
        try:
            name = str(l.get("name", "Unnamed Laboratory")).upper()
            addr = str(l.get("address", "No Address")).upper()
            
            # Ultra-safe coordinate access
            geometry = l.get("geometry") or {}
            coords = geometry.get("coordinates") or [0, 0]
            l_lat = coords[1] if len(coords) > 1 else 0

            # PRIORITY: Recent registrations (last 24h)
            created_at = l.get("createdAt")
            is_recent = False
            if created_at:
                now = datetime.utcnow()
                if isinstance(created_at, datetime):
                    if (now - created_at).total_seconds() < 86400:
                        is_recent = True

            # Ranking logic
            if is_recent:
                tier1_sgu.insert(0, l)
            elif any(k in name or k in addr for k in ["SGU", "ATIGRE", "HATKANANGALE", "KOLHAPUR"]):
                tier1_sgu.append(l)
            elif "PUNE" in name or "PUNE" in addr or (18.4 <= l_lat <= 18.6):
                tier3_pune.append(l)
            else:
                tier2_regional.append(l)
        except Exception as e:
            print(f"Skipping malformed lab entry: {e}")
            continue
            
    final_labs = tier1_sgu + tier2_regional + tier3_pune
    
    # 3. Final JSON Safety Conversion
    for l in final_labs:
        if "_id" in l: l["_id"] = str(l["_id"])
        if "userId" in l: l["userId"] = str(l["userId"])
        
    return final_labs

@router.get("/userlab")
async def get_user_lab(user_id: str = Depends(get_current_user_id)):
    db = get_database()
    lab = await db.laboratories.find_one({"userId": user_id})
    if not lab:
        raise HTTPException(status_code=404, detail="No lab found")
        
    lab["_id"] = str(lab["_id"])
    lab["userId"] = str(lab["userId"])
    return lab

@router.post("/serviceadd")
async def add_service(
    sname: str = Form(...),
    photo: Optional[UploadFile] = File(None),
    user_id: str = Depends(get_current_user_id)
):
    db = get_database()
    lab = await db.laboratories.find_one({"userId": user_id})
    if not lab:
        raise HTTPException(status_code=404, detail="Lab not found")
        
    filename = ""
    if photo:
        filename = f"service-{uuid.uuid4()}{os.path.splitext(photo.filename)[1]}"
        with open(os.path.join(UPLOAD_DIR, filename), "wb") as f:
            f.write(await photo.read())
            
    await db.laboratories.update_one(
        {"_id": lab["_id"]},
        {"$push": {"Services": {"sname": sname, "photo": filename}}}
    )
    
    return {"message": "Service added successfully"}
