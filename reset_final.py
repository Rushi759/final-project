import asyncio
import bcrypt
import os
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Set paths
base_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(base_dir, 'backend')
load_dotenv(os.path.join(backend_dir, '.env'))

async def reset():
    uri = os.getenv("MONGODB_URI")
    client = AsyncIOMotorClient(uri)
    db = client.agroguru
    
    email = "rushikeshjagtap1405@gmail.com"
    pwd = "AgroGuru@2025"
    
    hashed = bcrypt.hashpw(pwd.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    print(f"Updating {email}...")
    await db.users.update_one({"email": email}, {"$set": {"password": hashed}})
    print("SUCCESS: Reset complete.")
    client.close()

if __name__ == "__main__":
    asyncio.run(reset())
