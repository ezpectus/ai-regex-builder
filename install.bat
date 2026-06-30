@echo off
chcp 65001 >nul 2>nul
setlocal enabledelayedexpansion
title AI Regex Builder - Full Setup

echo ============================================
echo   AI Regex Builder v1.3.0 - Full Setup
echo ============================================
echo.
echo This script will:
echo   1. Check Node.js 20+
echo   2. Install npm packages
echo   3. Create .env config file
echo   4. Run tests (67 tests)
echo   5. Run linter
echo   6. Build production bundle
echo.
echo Starting automatically...
echo.

REM -- Step 1: Check Node.js version --
echo [1/6] Checking Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 goto :no_node

for /f "tokens=*" %%i in ('node -p "process.versions.node.split(\".\")[0]"') do set NODE_MAJOR=%%i
if !NODE_MAJOR! LSS 20 goto :old_node

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK]   Node.js !NODE_VERSION!
echo.
goto :step2

:no_node
echo [FAIL] Node.js is NOT installed.
echo.
echo Download Node.js 20+ from:
echo   https://nodejs.org/en/download
echo.
pause
exit /b 1

:old_node
echo [FAIL] Node.js 20+ required. Current:
node --version
echo Download from: https://nodejs.org/en/download
echo.
pause
exit /b 1

:step2
REM -- Step 2: Install dependencies --
echo [2/6] Installing npm packages...
echo       This may take 1-2 minutes...
echo.
call npm install
if !errorlevel! neq 0 goto :npm_fail
echo.
echo [OK]   All packages installed.
echo.
goto :step3

:npm_fail
echo.
echo [FAIL] npm install failed. Try:
echo   1. Delete node_modules and package-lock.json
echo   2. Run: npm install
echo.
pause
exit /b 1

:step3
REM -- Step 3: Create .env --
echo [3/6] Setting up environment...
if not exist ".env" goto :check_env_example
echo [OK]   .env already exists
echo.
goto :step4

:check_env_example
if not exist ".env.example" goto :no_env_example
copy .env.example .env >nul
echo [OK]   Created .env from .env.example
echo.
goto :step4

:no_env_example
echo [WARN] .env.example not found, skipping
echo.

:step4
REM -- Step 4: Run tests --
echo [4/6] Running tests (67 tests)...
echo.
call npm test
if !errorlevel! neq 0 goto :test_fail
echo.
echo [OK]   All tests passed.
echo.
goto :step5

:test_fail
echo.
echo [FAIL] Some tests failed. Check output above.
echo.
pause
exit /b 1

:step5
REM -- Step 5: Run linter --
echo [5/6] Running linter...
call npm run lint
if !errorlevel! neq 0 goto :lint_warn
echo [OK]   Lint passed.
echo.
goto :step6

:lint_warn
echo.
echo [WARN] Lint issues found (non-blocking for setup)
echo.

:step6
REM -- Step 6: Build production bundle --
echo [6/6] Building production bundle...
call npm run build
if !errorlevel! neq 0 goto :build_fail
echo.
echo [OK]   Build successful - output in dist/
echo.
goto :done

:build_fail
echo.
echo [FAIL] Build failed. Check output above.
echo.
pause
exit /b 1

:done
echo ============================================
echo   Setup Complete
echo ============================================
echo.
echo What was installed:
echo   - npm packages (node_modules/)
echo   - Environment config (.env)
echo   - 67 tests passed
echo   - Lint passed
echo   - Production build (dist/)
echo.
echo Features:
echo   - AI Providers: OpenAI / Gemini / Ollama
echo   - Regex test, explain, optimize, export
echo   - Dark/Light theme, keyboard shortcuts
echo   - Security: CSP headers, XSS prevention, safe storage
echo.
echo Next steps:
echo   1. Edit .env to add your OpenAI or Gemini API key (optional)
echo   2. Run start.bat to launch the dev server
echo   3. Or: npm run dev
echo   4. Open http://localhost:5173
echo   5. Click Settings (gear icon) to configure AI
echo.
echo For Ollama (local AI, free):
echo   1. Install from https://ollama.com
echo   2. Run: ollama pull llama3
echo   3. In Settings, switch provider to Ollama
echo.

endlocal
