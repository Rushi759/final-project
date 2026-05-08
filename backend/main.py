from fastapi import FastAPI, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import uvicorn
import os
import sys
import traceback
from dotenv import load_dotenv
from contextlib import asynccontextmanager

# FORCE DIRECTORY CREATION
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# Add local directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import connect_to_mongo, close_mongo_connection
from routers import user, nursery, market, lab, location

# Robust env loading
current_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(current_dir, ".env"))

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("\n" + "="*50)
    print("🌿 AGROGURU ENGINE: STARTUP INITIALIZED")
    print("="*50)
    
    # Run DB connection in background to avoid blocking the API server if MongoDB is slow
    import asyncio
    asyncio.create_task(connect_to_mongo())
    
    print("🚀 API Status: LISTENING")
    print("🔗 Note: Database connection is being established in the background.")
    yield
    print("\n--- AGROGURU SHUTDOWN SEQUENCE ---")
    await close_mongo_connection()
    print("👋 Shutdown Complete. SERVER STOPPED.\n")

app = FastAPI(
    title="AgroGuru Python API",
    description="Diagnostics-Enabled backend for AgroGuru",
    version="2.3.0",
    lifespan=lifespan
)

# CORS configuration - Fixed Origin for Windows 127.0.0.1
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GLOBAL CRASH REPORTER
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print("\n🛑 !!! CRITICAL SERVER ERROR !!! 🛑")
    print(f"URL: {request.url}")
    print(f"Error Detail: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {str(exc)}"}
    )

# Robust pathing for uploads
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR)

# Serve uploaded files statically
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Register Routers
app.include_router(user.router)
app.include_router(nursery.router)
app.include_router(market.router)
app.include_router(lab.router)
app.include_router(location.router)

@app.get("/")
async def root():
    from database import db
    db_status = "connected" if db is not None else "connecting"
    return {
        "status": "online", 
        "database": db_status,
        "message": "AgroGuru Diagnostics Engine is running!"
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    
    # --- AGROGURU AUTO-SYNC BRIDGE ---
    # This prevents the "Antigravity" AI loop by ensuring JS knows the correct backend URL
    try:
        frontend_env = os.path.join(BASE_DIR, "frontend", ".env.local")
        with open(frontend_env, "w") as f:
            f.write(f"REACT_APP_API_URL=http://localhost:{port}\n")
        print(f"🔗 SYNC: Frontend linked to backend on port {port}")
    except:
        print("💡 TIP: Start backend first to sync frontend config automatically.")

    print(f"🚀 API Listening on: http://127.0.0.1:{port}")
    # Using the app object directly is more robust on Windows than the string "main:app"
    uvicorn.run(app, host="0.0.0.0", port=port)
