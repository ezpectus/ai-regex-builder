#!/bin/bash
set -e

echo "══════════════════════════════════════════"
echo "  AI Regex Builder v1.3.0 - One-Click Start"
echo "══════════════════════════════════════════"
echo

# ── Step 1: Check Node.js ──
if ! command -v node &> /dev/null; then
    echo "[FAIL] Node.js is NOT installed."
    echo "Download Node.js 20+ from: https://nodejs.org/en/download"
    exit 1
fi

NODE_MAJOR=$(node --version | sed 's/v\([0-9]*\).*/\1/')
if [ "$NODE_MAJOR" -lt 20 ]; then
    echo "[FAIL] Node.js 20+ required. Current: $(node --version)"
    echo "Download from: https://nodejs.org/en/download"
    exit 1
fi

echo "[OK]   Node.js $(node --version)"

# ── Step 2: Check npm ──
if ! command -v npm &> /dev/null; then
    echo "[FAIL] npm is NOT installed. It comes with Node.js."
    exit 1
fi
echo "[OK]   npm $(npm --version)"
echo

# ── Step 3: Install dependencies ──
if [ ! -d "node_modules" ]; then
    echo "[INFO] First run — installing packages..."
    echo "       This may take 1-2 minutes. Please wait."
    echo
    npm install
    echo
    echo "[OK]   Packages installed successfully."
else
    echo "[OK]   Dependencies already installed."
fi

# ── Step 4: Create .env from template ──
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
    echo "[OK]   Created .env from .env.example"
else
    echo "[OK]   .env already exists"
fi

# ── Step 5: Quick health check ──
echo
echo "[INFO] Running quick checks..."
if npm run lint > /dev/null 2>&1; then
    echo "[OK]   Lint passed"
else
    echo "[WARN] Lint warnings detected (non-blocking)"
fi
echo

# ── Step 6: Start dev server ──
echo "══════════════════════════════════════════"
echo "  All ready! Starting development server..."
echo "══════════════════════════════════════════"
echo
echo "  URL:  http://localhost:5173"
echo "  Stop: Press Ctrl+C"
echo
echo "  AI Providers: OpenAI / Gemini / Ollama"
echo "  Click Settings (gear icon) to configure."
echo

# Open browser after short delay (platform-specific)
if command -v xdg-open &> /dev/null; then
    (sleep 3 && xdg-open http://localhost:5173) &
elif command -v open &> /dev/null; then
    (sleep 3 && open http://localhost:5173) &
fi

npm run dev
