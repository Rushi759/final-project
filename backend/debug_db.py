import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Run this from python_backend folder
load_dotenv()

async def debug_db():
    uri = os.getenv("MONGODB_URI")
    client = AsyncIOMotorClient(uri)
    db = client.agroguru
    
    email = "rushikeshjagtap1405@gmail.com"
    user = await db.users.find_one({"email": email})
    
    if user:
        print(f"\n--- User found: {email} ---")
        print(f"Name: {user.get('name')}")
        hash_val = user.get('password')
        print(f"Password Hash: {hash_val}")
        
        # Test verification in Python
        from passlib.context import CryptContext
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        # I don't know the password, but I can check the hash format
        if hash_val.startswith('$2b$'):
            print("Hash format is $2b$ (Standard Bcrypt)")
        elif hash_val.startswith('$2a$'):
            print("Hash format is $2a$ (Older Bcrypt)")
        else:
            print(f"Unknown hash format: {hash_val[:4]}")
            
    else:
        print(f"User not found: {email}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(debug_db())
