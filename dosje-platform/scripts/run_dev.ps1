# ==============================================================================
# STRIDE-X Local Development Launcher
# Starts FastAPI backend (port 8000) and Next.js frontend (port 3000)
# ==============================================================================

Write-Host "Starting STRIDE-X Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\.venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --port 8000"

Start-Sleep -Seconds 2

Write-Host "Starting STRIDE-X Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "STRIDE-X platform running!" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend API: http://localhost:8000/docs"
