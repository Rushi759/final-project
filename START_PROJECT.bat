@echo off
title AgroGuru Presentation Launcher
cd /d "%~dp0"
echo 🌿 Preparing One-Click Startup...
echo.

:: Kill any existing processes on ports 3000 and 8080 to ensure a clean start
powershell -Command "Get-NetTCPConnection -LocalPort 3000, 8080 -ErrorAction SilentlyContinue | Foreach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

:: Run the optimized launcher
C:\Users\rushi\AppData\Local\Programs\Python\Python313\python.exe run_agroguru.py

if %errorlevel% neq 0 (
    echo.
    echo ⚠️ Something went wrong! Trying fallback mode...
    python run_agroguru.py
)

pause
