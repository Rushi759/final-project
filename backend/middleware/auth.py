from fastapi import Request, HTTPException, Depends
import jwt
import os
import sys
from dotenv import load_dotenv

# Ensure we can import from the parent directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from auth_utils import SECRET_KEY, ALGORITHM
except ImportError:
    # Fallback if import fails
    load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))
    SECRET_KEY = os.getenv("JWT_SECRET", "agroguru_super_secret_key_2025")
    ALGORITHM = "HS256"

async def get_current_user_id(request: Request):
    token = request.cookies.get("token")
    
    if not token:
        raise HTTPException(status_code=401, detail="No token, authorization denied")
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("userId")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token is not valid")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token is not valid")
