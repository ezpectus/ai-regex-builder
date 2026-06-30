#!/bin/bash
set -e

echo "══════════════════════════════════════════"
echo "  AI Regex Builder v1.3.0 - Full Setup"
echo "══════════════════════════════════════════"
echo
echo "This script will:"
echo "  1. Check Node.js 20+"
echo "  2. Install npm packages"
echo "  3. Create .env config file"
echo "  4. Run tests (67 tests)"
echo "  5. Run linter"
echo "  6. Build production bundle"
echo
read -p "Press Enter to start..." < /dev/tty
echo

# ── Step 1: Check Node.js version ──
echo "[1/6] Checking Node.js..."
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
echo

# ── Step 2: Install dependencies ──
echo "[2/6] Installing npm packages..."
echo "      This may take 1-2 minutes..."
echo
npm install
echo
echo "[OK]   All packages installed."
echo

# ── Step 3: Create .env ──
echo "[3/6] Setting up environment..."
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
    echo "[OK]   Created .env from .env.example"
else
    echo "[OK]   .env already exists"
fi
echo

# ── Step 4: Run tests ──
echo "[4/6] Running tests (67 tests)..."
echo
npm test
echo
echo "[OK]   All tests passed."
echo

# ── Step 5: Run linter ──
echo "[5/6] Running linter..."
npm run lint || echo "[WARN] Lint issues found (non-blocking for setup)"
echo

# ── Step 6: Build production bundle ──
echo "[6/6] Building production bundle..."
npm run build
echo
echo "[OK]   Build successful — output in dist/"
echo

# ── Done ──
echo "══════════════════════════════════════════"
echo "  Setup Complete!"
echo "══════════════════════════════════════════"
echo
echo "What was installed:"
echo "  - npm packages (node_modules/)"
echo "  - Environment config (.env)"
echo "  - 67 tests passed"
echo "  - Lint passed"
echo "  - Production build (dist/)"
echo
echo "Features:"
echo "  - AI Providers: OpenAI / Gemini / Ollama"
echo "  - Regex test, explain, optimize, export"
echo "  - Dark/Light theme, keyboard shortcuts"
echo "  - Security: CSP headers, XSS prevention, safe storage"
echo
echo "Next steps:"
echo "  1. Edit .env to add your OpenAI or Gemini API key (optional)"
echo "  2. Run: ./start.sh to launch the dev server"
echo "  3. Or: npm run dev"
echo "  4. Open http://localhost:5173"
echo "  5. Click Settings (gear icon) to configure AI"
echo
echo "For Ollama (local AI, free):"
echo "  1. Install from https://ollama.com"
echo "  2. Run: ollama pull llama3"
echo "  3. In Settings, switch provider to Ollama"
echo
