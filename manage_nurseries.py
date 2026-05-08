import asyncio
import os
import httpx
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load env from backend directory
base_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(base_dir, 'backend', '.env'))

MONGODB_URI = os.getenv("MONGODB_URI")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

async def clear_nurseries():
    if not MONGODB_URI:
        print("Error: MONGODB_URI not found.")
        return
        
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client.agroguru
    
    confirm = input("Are you sure you want to DELETE all existing nursery data? (y/n): ")
    if confirm.lower() == 'y':
        result = await db.nurseries.delete_many({})
        print(f"✅ Deleted {result.deleted_count} nurseries.")
    else:
        print("Operation cancelled.")
    client.close()

async def fetch_from_google(lat, lng):
    if not GOOGLE_MAPS_API_KEY:
        print("Error: GOOGLE_MAPS_API_KEY not found in .env. Please add it to get real data.")
        return
        
    print(f"Fetching nurseries near {lat}, {lng} from Google Maps...")
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius=5000&type=nursery|florist|garden_center&key={GOOGLE_MAPS_API_KEY}"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()
        
        if data.get("status") == "OK":
            results = data.get("results", [])
            print(f"Found {len(results)} nurseries.")
            
            client_mongo = AsyncIOMotorClient(MONGODB_URI)
            db = client_mongo.agroguru
            
            for item in results:
                nursery_doc = {
                    "name": item.get("name"),
                    "address": item.get("vicinity"),
                    "phone": "Google Maps Verified",
                    "rating": item.get("rating"),
                    "geometry": {
                        "type": "Point",
                        "coordinates": [item["geometry"]["location"]["lng"], item["geometry"]["location"]["lat"]]
                    },
                    "google_place_id": item.get("place_id"),
                    "source": "google_maps"
                }
                await db.nurseries.update_one(
                    {"google_place_id": item.get("place_id")},
                    {"$set": nursery_doc},
                    upsert=True
                )
            print("✅ Successfully synced Google Maps nurseries to your database.")
            client_mongo.close()
        else:
            print(f"❌ Google Maps API Error: {data.get('status')} - {data.get('error_message', 'No details')}")

if __name__ == "__main__":
    print("🌿 AgroGuru Nursery Data Manager")
    print("1. Clear all nurseries (Delete Fake Data)")
    print("2. Fetch real nurseries from Google Maps (Requires API Key in .env)")
    print("3. Exit")
    
    choice = input("Enter choice: ")
    if choice == "1":
        asyncio.run(clear_nurseries())
    elif choice == "2":
        lat = input("Enter latitude (default 18.5204 for Pune): ") or "18.5204"
        lng = input("Enter longitude (default 73.8567 for Pune): ") or "73.8567"
        asyncio.run(fetch_from_google(lat, lng))
    else:
        print("Goodbye!")
