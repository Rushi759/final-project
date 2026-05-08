@echo off
cd /d "%~dp0"
set "PYTHON_EXE=C:\Users\rushi\AppData\Local\Programs\Python\Python313\python.exe"

if exist "%PYTHON_EXE%" (
    "%PYTHON_EXE%" "%~dp0run_agroguru.py"
    goto :eof
)

python "%~dp0run_agroguru.py"
if %errorlevel% equ 0 goto :eof

echo 🌿 Starting AgroGuru Final Project...
echo -------------------------------------
echo.

:: Startup Python Backend (Bulletproof PowerShell Mode)
start powershell -NoExit -ExecutionPolicy Bypass -File FIX_STARTUP.ps1

:: Startup Frontend
start cmd /k "echo 🎨 Starting Frontend UI... && cd frontend && npm start"

echo.
echo ✅ Project Startup Initialized!
echo 🌿 Python API: http://localhost:8080
echo 🌿 React UI: http://localhost:3000
echo.
pause
