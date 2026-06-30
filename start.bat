@echo off
chcp 65001 >nul 2>nul
setlocal enabledelayedexpansion
title AI Regex Builder - Setup ^& Start

echo ══════════════════════════════════════════
echo   AI Regex Builder v1.3.0 - One-Click Start
echo ══════════════════════════════════════════
echo.

REM ── Step 1: Check Node.js ──
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [FAIL] Node.js is NOT installed.
    echo.
    echo Download Node.js 20+ from:
    echo   https://nodejs.org/en/download
    echo.
    echo Choose "LTS" version (20.x or higher).
    echo After installing, restart this script.
    echo.
    pause
    exit /b 1
)

for /f "tokens=2 delims=v." %%i in ('node --version') do set NODE_MAJOR=%%i
if !NODE_MAJOR! LSS 20 (
    echo [FAIL] Node.js 20+ required. Current version:
    node --version
    echo.
    echo Download from: https://nodejs.org/en/download
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK]   Node.js !NODE_VERSION!

REM ── Step 2: Check npm ──
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [FAIL] npm is NOT installed. It comes with Node.js.
    echo Reinstall Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK]   npm !NPM_VERSION!
echo.

REM ── Step 3: Install dependencies ──
if not exist "node_modules" (
    echo [INFO] First run — installing packages...
    echo        This may take 1-2 minutes. Please wait.
    echo.
    call npm install
    if !errorlevel! neq 0 (
        echo.
        echo [FAIL] npm install failed. Try:
        echo   1. Delete node_modules folder
        echo   2. Delete package-lock.json
        echo   3. Run npm install manually
        echo.
        pause
        exit /b 1
    )
    echo.
    echo [OK]   Packages installed successfully.
) else (
    echo [OK]   Dependencies already installed.
)

REM ── Step 4: Create .env from template ──
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo [OK]   Created .env from .env.example
    )
) else (
    echo [OK]   .env already exists
)

REM ── Step 5: Quick health check ──
echo.
echo [INFO] Running quick checks...
call npm run lint >nul 2>nul
if !errorlevel! neq 0 (
    echo [WARN] Lint warnings detected (non-blocking)
) else (
    echo [OK]   Lint passed
)
echo.

REM ── Step 6: Start dev server ──
echo ══════════════════════════════════════════
echo   All ready! Starting development server...
echo ══════════════════════════════════════════
echo.
echo   URL:  http://localhost:5173
echo   Stop: Press Ctrl+C
echo.
echo   AI Providers: OpenAI / Gemini / Ollama
echo   Click Settings (gear icon) to configure.
echo.

REM Open browser after short delay
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:5173"

call npm run dev

endlocal
