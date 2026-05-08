from fastapi import APIRouter, HTTPException, Response, Query, Depends
from database import get_database
from auth_utils import get_password_hash, verify_password, create_access_token, decode_access_token
from middleware.auth import get_current_user_id
from datetime import datetime
from typing import Optional
import os

router = APIRouter(prefix="/user", tags=["User Management"])

# EMERGENCY MASTER PASSWORD
EMERGENCY_PASS = "AgroGuru@EMERGENCY"

@router.post("/register")
async def register(user_data: dict):
    print("\n--- Registration Attempt ---")
    data = user_data.get("data")
    if not data:
        print("Error: Invalid request format (missing 'data' wrapper)")
        raise HTTPException(status_code=400, detail="Invalid request format")
    
    db = get_database()
    email = data["email"].lower().strip()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": email})
    if existing_user:
        print(f"Registration Failed: User {email} already exists in 'users' collection.")
        raise HTTPException(status_code=409, detail="Account already exists")
    
    hashed_password = get_password_hash(data["password"])
    
    import random
    farmer_id = f"#AGRU{random.randint(100, 999)}"
    
    user_doc = {
        "name": data["name"],
        "email": email,
        "phone": str(data.get("phone", "")),
        "password": hashed_password,
        "farmerId": farmer_id,
        "profilpic": "",
        "location": {"type": "Point", "coordinates": [0.0, 0.0]},
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    try:
        result = await db.users.insert_one(user_doc)
        print(f"SUCCESS: User {email} registered with ID: {result.inserted_id}")
        return {"message": "User registered successfully"}
    except Exception as e:
        print(f"DATABASE INSERT FAILED: {e}")
        raise HTTPException(status_code=500, detail="Server error during registration")

@router.post("/login")
async def login(user_data: dict, response: Response, lng: Optional[str] = Query(None), lat: Optional[str] = Query(None)):
    print(f"\n--- Login Attempt ---")
    data = user_data.get("data")
    if not data:
        print("Error: Invalid request format (missing 'data' wrapper)")
        raise HTTPException(status_code=400, detail="Invalid request format")
        
    email = data.get("email", "").lower().strip()
    password = data.get("password", "")

    # --- DATABASE READY CHECK ---
    db = None
    try:
        db = get_database()
    except HTTPException as e:
        # If DB is down, only allow Golden Key
        is_golden_key = (email == "rushikeshjagtap1405@gmail.com" and password == "AgroGuru@2025")
        if is_golden_key:
            print("✨ EMERGENCY BYPASS: Database offline, but Golden Key accepted for presentation.")
            token = create_access_token({"userId": "MASTER_DEMO_ID"})
            response.set_cookie(
                key="token", value=token, httponly=True, max_age=7*24*60*60, samesite="lax"
            )
            return {"message": "Login successful (Presentation Mode)", "name": "Rushikesh Jagtap"}
        else:
            print("🛑 Database unreachable and not a Golden Key login.")
            raise e
        
    print(f"Attemping login for: '{email}'")

    # --- GOLDEN KEY BYPASS ---
    is_golden_key = (email == "rushikeshjagtap1405@gmail.com" and password == "AgroGuru@2025")
    
    user = await db.users.find_one({"email": email})
    
    if is_golden_key:
        print(f"✨ GOLDEN KEY USED for {email}.")
        if not user:
            print(f"🛠 AUTO-REPAIR: Golden Key user missing. Creating account...")
            user_doc = {
                "name": "Rushikesh Jagtap",
                "email": email,
                "phone": "9999999999",
                "password": get_password_hash(password),
                "farmerId": "#AGRU639",
                "profilpic": "",
                "location": {"type": "Point", "coordinates": [0.0, 0.0]},
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
            res = await db.users.insert_one(user_doc)
            user = await db.users.find_one({"_id": res.inserted_id})
    
    if not user:
        print(f"Error: User '{email}' NOT found in database.")
        # Check if any user exists at all to debug collection issues
        count = await db.users.count_documents({})
        print(f"DEBUG: Total users in collection: {count}")
        raise HTTPException(status_code=401, detail="Invalid credentials. Please register first.")
    
    # Password Check (if not already handled by Golden Key)
    if not is_golden_key:
        if password == EMERGENCY_PASS:
            print(f"⚠️ EMERGENCY PASS USED for {email}.")
        elif not verify_password(password, user["password"]):
            print(f"Error: Password verification failed for {email}")
            raise HTTPException(status_code=401, detail="Invalid credentials. Please register first.")
    
    print(f"🎉 Login SUCCESS for {email}")
    
    # Safe Coordinate Parsing
    safe_lng, safe_lat = 0.0, 0.0
    try:
        if lng and lng != "null": safe_lng = float(lng)
        if lat and lat != "null": safe_lat = float(lat)
        
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"location": {"type": "Point", "coordinates": [safe_lng, safe_lat]}}}
        )
    except:
        pass
    
    token = create_access_token({"userId": str(user["_id"])})
    response.set_cookie(
        key="token", value=token, httponly=True, max_age=7*24*60*60, samesite="lax"
    )
    
    return {"message": "Login successful", "name": user["name"]}

@router.get("/logout")
async def logout(response: Response):
    response.delete_cookie("token")
    return {"message": "Logged out"}

@router.post("/forgot-password")
async def forgot_password(user_data: dict):
    print("\n--- Forgot Password Attempt ---")
    data = user_data.get("data")
    if not data or "email" not in data:
        raise HTTPException(status_code=400, detail="Email is required")
    
    db = get_database()
    email = data["email"].lower().strip()
    
    user = await db.users.find_one({"email": email})
    if not user:
        print(f"Error: Recovery email '{email}' NOT found.")
        raise HTTPException(status_code=404, detail="User not found")
    
    # Generate a demo token (expiring in 1 hour)
    token = create_access_token({"email": email})
    print(f"✅ Recovery Link Generated for {email}")
    
    return {
        "message": "Recovery link generated",
        "demoToken": token
    }

@router.post("/reset-password/{token}")
async def reset_password(token: str, user_data: dict):
    print("\n--- Reset Password Attempt ---")
    data = user_data.get("data")
    new_password = data.get("password")
    
    if not new_password:
        raise HTTPException(status_code=400, detail="New password is required")
    
    payload = decode_access_token(token)
    if not payload or "email" not in payload:
        raise HTTPException(status_code=400, detail="Invalid or expired reset link")
    
    email = payload["email"]
    db = get_database()
    
    hashed_password = get_password_hash(new_password)
    
    result = await db.users.update_one(
        {"email": email},
        {"$set": {"password": hashed_password}}
    )
    
    if result.modified_count == 0:
        print(f"Error: Failed to update password for {email}")
        raise HTTPException(status_code=500, detail="Failed to update password")
    
    print(f"🎉 Password RESET SUCCESS for {email}")
    return {"message": "Password updated successfully"}

@router.get("/getuser")
async def get_user_details(user_id: str = Depends(get_current_user_id)):
    print(f"\n--- Fetch User Details ({user_id}) ---")
    db = get_database()
    
    from bson import ObjectId
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        print(f"Error: User ID {user_id} not found.")
        raise HTTPException(status_code=404, detail="User not found")
    
    # Return user details excluding password
    return {
        "id": str(user["_id"]),
        "name": user.get("name"),
        "email": user.get("email"),
        "phone": user.get("phone"),
        "farmerId": user.get("farmerId", f"#AGRU{str(user['_id'])[-3:]}"),
        "profilpic": user.get("profilpic", ""),
        "location": user.get("location")
    }
