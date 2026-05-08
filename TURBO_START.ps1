# AgroGuru Absolute Minimalist Startup
$python_exe = "C:\Users\rushi\AppData\Local\Programs\Python\Python313\python.exe"
$root = $PSScriptRoot
if (-Not $root) { $root = Get-Location }
cd $root

$Host.UI.RawUI.WindowTitle = "AgroGuru API Engine [BOOTING]"
Write-Host "🚀 AgroGuru Turbo Engine Initialized" -ForegroundColor Cyan

# Rapid Port Clear
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | ForEach-Object { 
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue 
}

# Direct Launch
Write-Host "🌿 Starting Services..." -ForegroundColor Green
try {
    & $python_exe "$root\backend\main.py"
}
catch {
    Write-Host "🛑 FATAL ERROR: $($_.Exception.Message)" -ForegroundColor Red
    pause
}
