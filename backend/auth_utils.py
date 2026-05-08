import bcrypt
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Robust env loading
current_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(current_dir, ".env"))

SECRET_KEY = os.getenv("JWT_SECRET", "agroguru_super_secret_key_2025")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

def verify_password(plain_password: str, hashed_password: str):
    """
    Verifies a plain-text password against a hashed one.
    Handles encoding to bytes automatically.
    """
    try:
        if not plain_password or not hashed_password:
            return False
            
        # Ensure inputs are correctly encoded
        pw_bytes = plain_password.encode('utf-8')
        hash_bytes = hashed_password.encode('utf-8')
        
        # bcrypt.checkpw is the most compatible verification method
        return bcrypt.checkpw(pw_bytes, hash_bytes)
    except Exception as e:
        print(f"🛑 SECURITY ERROR (Verify): {e}")
        return False

def get_password_hash(password: str):
    """
    Hashes a plain-text password using the bcrypt algorithm.
    """
    try:
        pw_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(pw_bytes, salt)
        return hashed.decode('utf-8')
    except Exception as e:
        print(f"🛑 SECURITY ERROR (Hash): {e}")
        return ""

def create_access_token(data: dict):
    """
    Generates a JWT token for user sessions.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    """
    Decodes a JWT token and returns the payload.
    """
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded
    except Exception as e:
        print(f"🛑 SECURITY ERROR (Decode): {e}")
        return None
