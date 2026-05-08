from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
from dotenv import load_dotenv

# Use absolute path for robustness
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, ".env")
load_dotenv(env_path)

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = "agroguru"

client = None
db = None

async def connect_to_mongo():
    global client, db
    if not MONGODB_URI:
        print("❌ ERROR: MONGODB_URI is not set in .env!")
        return
        
    retry_count = 0
    max_retries = 5
    
    while retry_count < max_retries:
        try:
            print(f"🔗 [Attempt {retry_count + 1}] Connecting to MongoDB Atlas...")
            # Increased timeout for spotty connections during presentations
            client = AsyncIOMotorClient(
                MONGODB_URI, 
                serverSelectionTimeoutMS=15000,
                connectTimeoutMS=15000,
                retryWrites=True
            )
            db = client[DATABASE_NAME]
            
            # Verify connection
            await client.admin.command('ping')
            print("🟢 DATABASE CONNECTED: AgroGuru Engine is fully operational.")
            return
        except Exception as e:
            retry_count += 1
            print(f"⚠️ CONNECTION DELAY ({retry_count}/{max_retries}): {e}")
            if retry_count < max_retries:
                wait_time = 3 * retry_count
                print(f"🕒 Retrying in {wait_time}s...")
                await asyncio.sleep(wait_time)
            else:
                print("❌ FATAL: Could not connect to database after multiple attempts.")
                print("💡 TIP: Check your internet connection or IP whitelisting on MongoDB Atlas.")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("MongoDB connection closed.")

def get_database():
    global db
    if db is None:
        from fastapi import HTTPException
        # If DB is still None, it means the background task is still working or failed
        raise HTTPException(
            status_code=503, 
            detail="AgroGuru Engine is taking longer than expected to connect to the database. " +
                   "Please check your internet connection and refresh in 10 seconds."
        )
    return db
