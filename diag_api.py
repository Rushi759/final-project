import os
import sys
import socket
from pathlib import Path

ROOT = Path(r"c:\Users\rushi\OneDrive\Documents\AgroGuru_Final_Project")
LOG_FILE = ROOT / "startup_diag.log"

def log(msg):
    print(msg)
    with open(LOG_FILE, "a") as f:
        f.write(msg + "\n")

if os.path.exists(LOG_FILE):
    os.remove(LOG_FILE)

log("--- AgroGuru Diagnostic Start ---")
log(f"CWD: {os.getcwd()}")
log(f"Python: {sys.executable}")

# Check 8080
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
result = sock.connect_ex(('127.0.0.1', 8080))
if result == 0:
    log("Port 8080 is ALREADY in use.")
else:
    log("Port 8080 is FREE.")
sock.close()

# Check .env
env_path = ROOT / "backend" / ".env"
if env_path.exists():
    log(".env exists.")
else:
    log(".env MISSING!")

# Check requirements
req_path = ROOT / "backend" / "requirements.txt"
if req_path.exists():
    log("requirements.txt exists.")

log("--- End Diag ---")
