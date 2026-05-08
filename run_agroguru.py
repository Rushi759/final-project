import shutil
import subprocess
import sys
import time
import webbrowser
from pathlib import Path


ROOT = Path(__file__).resolve().parent
FRONTEND_DIR = ROOT / "frontend"
DEFAULT_PYTHON = Path(r"C:\Users\rushi\AppData\Local\Programs\Python\Python313\python.exe")


def resolve_python() -> str:
    if DEFAULT_PYTHON.exists():
        return str(DEFAULT_PYTHON)
    return sys.executable or shutil.which("python") or "python"


def open_window(title: str, command: str) -> None:
    subprocess.Popen(
        f'start "{title}" cmd /k "{command}"',
        cwd=str(ROOT),
        shell=True,
    )


def main() -> int:
    python_exe = resolve_python()

    # Optimized API command: uses the new turbo script
    api_command = (
        f'cd /d "{ROOT}" && '
        f'powershell -NoExit -ExecutionPolicy Bypass -File "{ROOT / "TURBO_START.ps1"}"'
    )
    
    # Frontend command
    ui_command = f'cd /d "{FRONTEND_DIR}" && npm start'

    print("="*60)
    print("🌿 AGROGURU PRESENTATION LAUNCHER (Turbo Mode)")
    print("="*60)
    print(f"[*] Python: {python_exe}")
    print("[*] Launching API Engine...")
    open_window("AgroGuru API Engine", api_command)
    
    print("[*] Launching Web Portal (React)...")
    open_window("AgroGuru Web Portal", ui_command)

    print("\n[!] STANDBY: Monitoring for system readiness...")
    
    # Smart Health Check and Browser Opener
    browser_opened = False
    start_time = time.time()
    
    try:
        while time.time() - start_time < 120:  # 2 minute timeout
            # Periodic check for API only (Frontend takes longer)
            check_cmd = [
                "powershell", "-Command",
                "try { $r = Invoke-WebRequest -Uri http://127.0.0.1:8080/ -UseBasicParsing -TimeoutSec 1; if($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"
            ]
            result = subprocess.run(check_cmd, capture_output=True)
            
            if result.returncode == 0:
                print("\n" + "🟢"*5 + " SYSTEM READY " + "🟢"*5)
                if not browser_opened:
                    print("[*] Opening AgroGuru Dashboard in Browser...")
                    webbrowser.open("http://localhost:3000")
                    browser_opened = True
                break
            else:
                elapsed = int(time.time() - start_time)
                print(f"\r[ ] Waiting for services... ({elapsed}s)", end="", flush=True)
                time.sleep(2)
    except KeyboardInterrupt:
        print("\n[!] Startup sequence cancelled by user.")
        return 0

    print("\n----------------------------------------------")
    print("Python API: http://127.0.0.1:8080")
    print("React UI:   http://localhost:3000")
    print("Status:     Live & Ready for Presentation.")
    print("----------------------------------------------")
    print("Press Ctrl+C in the other windows to stop services.")
    
    # Keep this script alive for a bit or just exit
    time.sleep(5)
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:
        print(f"\n[CRITICAL ERROR]: {e}")
        input("Press Enter to exit...")

