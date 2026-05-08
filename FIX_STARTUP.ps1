# AgroGuru Total Environment Repair Script
# Location-Independent Version (uses $PSScriptRoot)

$python_exe = "C:\Users\rushi\AppData\Local\Programs\Python\Python313\python.exe"
$root = $PSScriptRoot
if (-Not $root) { $root = Get-Location }
cd $root

$Host.UI.RawUI.WindowTitle = "Starting AgroGuru Python API... [WAITING]"
Write-Host "🌿 AgroGuru API Bootloader (Turbo Mode)" -ForegroundColor Cyan
Write-Host "------------------------------------------------"

if (-Not (Test-Path $python_exe)) {
    $python_exe = (where.exe python | Select-Object -First 1)
}

# 1. Kill any zombies on 8080
Write-Host "🔍 Port Reset..." -ForegroundColor Gray
$proc = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($proc) {
    foreach ($p in $proc) {
        Stop-Process -Id $p.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

# 2. Simplified Dependency check
$do_check = $false
foreach ($arg in $args) { if ($arg -eq "--check") { $do_check = $true } }

if ($do_check) {
    Write-Host "📦 Checking core dependencies..." -ForegroundColor Gray
    & $python_exe -c "import fastapi, uvicorn, motor, dotenv" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "🚀 Installing missing requirements..." -ForegroundColor Yellow
        & $python_exe -m pip install -r "$root\backend\requirements.txt" --no-warn-script-location
    }
}

# 3. Launch
Write-Host "`n🚀 Launching API Services..." -ForegroundColor Green
Write-Host "STATUS: System ready for teacher presentation." -ForegroundColor Gray

try {
    $Host.UI.RawUI.WindowTitle = "AgroGuru API [LIVE]"
    & $python_exe "$root\backend\main.py"
}
catch {
    Write-Host "🛑 SERVER CRASHED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 TIP: Try running this once with --check flag if dependencies are missing." -ForegroundColor Gray
    pause
}
