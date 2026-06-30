@echo off
chcp 65001 >nul 2>nul
setlocal enabledelayedexpansion
title AI Regex Builder - Start

echo ============================================
echo   AI Regex Builder v1.3.0 - One-Click Start
echo ============================================
echo.

REM -- Step 1: Check Node.js --
where node >nul 2>nul
if %errorlevel% neq 0 goto :no_node

for /f "tokens=*" %%i in ('node -p "process.versions.node.split(\".\")[0]"') do set NODE_MAJOR=%%i
if !NODE_MAJOR! LSS 20 goto :old_node

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK]   Node.js !NODE_VERSION!
goto :check_npm

:no_node
echo [FAIL] Node.js is NOT installed.
echo.
echo Download Node.js 20+ from:
echo   https://nodejs.org/en/download
echo.
pause
exit /b 1

:old_node
echo [FAIL] Node.js 20+ required. Current version:
node --version
echo.
echo Download from: https://nodejs.org/en/download
echo.
pause
exit /b 1

:check_npm
where npm >nul 2>nul
if %errorlevel% neq 0 goto :no_npm
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK]   npm !NPM_VERSION!
echo.
goto :check_deps

:no_npm
echo [FAIL] npm is NOT installed. It comes with Node.js.
echo Reinstall Node.js from https://nodejs.org
echo.
pause
exit /b 1

:check_deps
if not exist "node_modules" goto :install_deps
echo [OK]   Dependencies already installed.
goto :check_env

:install_deps
echo [INFO] First run - installing packages...
echo        This may take 1-2 minutes. Please wait.
echo.
call npm install
if !errorlevel! neq 0 goto :npm_fail
echo.
echo [OK]   Packages installed successfully.
goto :check_env

:npm_fail
echo.
echo [FAIL] npm install failed. Try:
echo   1. Delete node_modules folder
echo   2. Delete package-lock.json
echo   3. Run npm install manually
echo.
pause
exit /b 1

:check_env
if not exist ".env" goto :create_env
echo [OK]   .env already exists
goto :health_check

:create_env
if not exist ".env.example" goto :health_check
copy .env.example .env >nul
echo [OK]   Created .env from .env.example

:health_check
echo.
echo [INFO] Running quick checks...
call npm run lint >nul 2>nul
if !errorlevel! neq 0 goto :lint_warn
echo [OK]   Lint passed
goto :start_server

:lint_warn
echo [WARN] Lint warnings detected (non-blocking)

:start_server
echo.
echo ============================================
echo   All ready! Starting development server...
echo ============================================
echo.
echo   URL:  http://localhost:5173
echo   Stop: Press Ctrl+C
echo.
echo   AI Providers: OpenAI / Gemini / Ollama
echo   Click Settings (gear icon) to configure.
echo.

timeout /t 3 /nobreak >nul
start http://localhost:5173

call npm run dev

endlocal
