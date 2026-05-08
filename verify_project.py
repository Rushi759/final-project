import sys
import os
import asyncio
import socket

# Add backend to path relative to script location
base_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(base_dir, 'backend')
sys.path.append(backend_dir)

def check_port(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

async def verify():
    print("AGROGURU PROJECT HEALTH CHECK")
    print("================================")
    
    # 1. Check Python Version
    print(f"Python Version: {sys.version.split()[0]}... [OK]")
    
    # 2. Check Port 8080
    if check_port(8080):
        print("Port 8080: OCCUPIED (Something is running)... [OK/CHECK]")
    else:
        print("Port 8080: FREE (Server not running)... [INFO]")
        
    # 3. Check Database Connection
    try:
        from database import connect_to_mongo, get_database
        from motor.motor_asyncio import AsyncIOMotorClient
        from dotenv import load_dotenv
        
        load_dotenv(os.path.join(backend_dir, '.env'))
        uri = os.getenv("MONGODB_URI")
        
        if not uri:
            print("Database Config: MISSING (.env not found or empty)... [FAIL]")
        else:
            print("Database Config: FOUND... [OK]")
            client = AsyncIOMotorClient(uri)
            await client.admin.command('ping')
            print("Database Connection: REACHABLE (MongoDB Atlas)... [OK]")
            
            # 4. Check User Account
            db = client.agroguru
            user_email = "rushikeshjagtap1405@gmail.com"
            user = await db.users.find_one({"email": user_email})
            if user:
                print(f"User Account ({user_email}): FOUND... [OK]")
                
                # 5. Check Password Mechanism
                import bcrypt
                test_pass = "AgroGuru@2025"
                is_valid = bcrypt.checkpw(test_pass.encode('utf-8'), user['password'].encode('utf-8'))
                if is_valid:
                    print("Password Status: CORRECT & COMPATIBLE... [OK]")
                else:
                    print("Password Status: MISMATCH (Reset required)... [FAIL]")
            else:
                print(f"User Account ({user_email}): NOT FOUND... [FAIL]")
            
            client.close()
    except Exception as e:
        print(f"Backend Test: CRASHED ({e})... [FAIL]")

    print("\n================================")
    print("If you see any [FAIL], please tell Antigravity the error message.")
    print("To start the app, run: run_agroguru.bat")

if __name__ == "__main__":
    asyncio.run(verify())
