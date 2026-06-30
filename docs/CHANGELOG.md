# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] — 2026-06-30

### Added
- `src/utils/safeStorage.js` — Safe localStorage wrappers (safeGetJSON, safeSetJSON, safeGet, safeSet) guarding against SSR, privacy mode, quota errors, JSON parse errors
- `src/utils/safeClipboard.js` — Safe clipboard utility with Clipboard API + execCommand fallback for non-HTTPS contexts
- `fetchWithTimeout()` in `aiFactory.js` — All AI requests abort after 30s via AbortController
- `formatNetworkError()` in `aiFactory.js` — Converts AbortError and network errors to user-friendly messages
- Typed toast notifications: `success` (green), `error` (red), `warning` (yellow) with appropriate icons
- `MAX_TEST_TEXT_LENGTH` (100K) and `REQUEST_TIMEOUT_MS` (30s) and `AI_RETRY_COUNT` (2) constants
- ARCHITECTURE.md: New "Robustness & Error Handling" section documenting all hardening measures
- ARCHITECTURE.md: New "Security Hardening" section documenting XSS prevention, API key protection, CSP, and HTTP security headers
- `netlify.toml`: Security headers — X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, Content-Security-Policy
- `Dockerfile`: nginx security headers — X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- `netlify.toml`: Long-term caching for `/assets/*` (1 year, immutable) and `/favicon.svg` (1 day)
- `Dockerfile`: nginx gzip compression for CSS/JS/JSON/SVG + caching for static assets
- `vite.config.js`: Code splitting — `react-vendor` and `icons` chunks separated from app code
- `App.jsx`: Offline detection — banner warning when `navigator.onLine` is false, AI features disabled gracefully

### Changed
- All AI providers (OpenAI, Gemini, Ollama) now use `fetchWithTimeout` instead of raw `fetch`
- All `res.json()` calls wrapped in try/catch — invalid JSON no longer crashes the app
- All error response bodies truncated to 200 chars and wrapped in try/catch
- `copyCommands.js`: `execute()` methods now async, use `safeCopy` instead of raw `navigator.clipboard`
- `ExportModal.jsx` and `OptimizeResult.jsx`: Use `safeCopy` for clipboard operations
- `useApiKey.js`, `useHistory.js`, `useTheme.js`: All localStorage access via `safeStorage.js` wrappers
- `App.jsx`: `handleGenerate` and `handleOptimize` wrapped in try/catch, loading state always reset
- `App.jsx`: All toasts now use typed format `{ message, type }` instead of plain strings
- `Toast.jsx`: Supports typed messages with color-coded icons (Check, AlertCircle, AlertTriangle)
- `regexTester.js`: Test text capped at `MAX_TEST_TEXT_LENGTH` to prevent browser freeze
- `regexTester.js`: `buildHighlightedSegments` null-text guard added

### Fixed
- Ollama provider: `lastError` variable was missing in generate method
- Factory JSDoc: Updated to mention all three providers (OpenAI, Gemini, Ollama)
- `ai.js` JSDoc: Updated to mention all three providers (OpenAI, Gemini, Ollama)
- `install.bat` / `install.sh`: Test count updated from 62 to 67
- `install.bat` / `install.sh`: Next steps now mention Gemini alongside OpenAI
- `netlify.toml`: Added `[build.environment]` with `NODE_VERSION = "20"` for consistent builds
- Light mode: Border color darkened from `#d0d7de` to `#afb8c1` for better visibility
- Light mode: Card shadow increased from `shadow-sm` to `shadow-md`
- Light mode: Hover shadow increased from `shadow-md` to `shadow-lg`
- Light mode: Buttons now have `shadow-sm` and `hover:border-light-muted` for better depth

## [1.2.0] — 2026-06-30

### Fixed
- README: Test count corrected from 113 to 62 in Tech Stack table and Testing section
- README: File structure corrected from `src/styles/index.css` to `src/index.css`
- README: Solution table and Tech Stack now mention Gemini alongside OpenAI and Ollama
- History: Empty state now shows "No history yet. Generate a regex to get started." instead of empty card
- PromptInput: "Generating..." text now has `animate-pulse` for visual feedback during AI generation
- CONTRIBUTING: Factory pattern description now mentions all three providers (OpenAI, Gemini, Ollama)
- ARCHITECTURE: System diagram, factory table, data flow, state management, and provider abstraction all updated to include Gemini
- BUSINESS_MODEL: Free tier now mentions Gemini alongside OpenAI
- CHANGELOG: `install.bat` test count updated from 62 to 67
- Removed temporary `check_eol.js` debug file

### Added
- `public/favicon.svg`: Regex symbol (`./*`) in accent color #58a6ff on transparent background
- SEO meta tags in `index.html`: `keywords`, `twitter:card` (summary_large_image)
- Updated `og:title` and `og:description` to match spec
- 5 new tests (62 → 67 total):
  - `regexTester.test.js`: sticky flag (y) matches at exact position only
  - `regexTester.test.js`: sticky flag (y) does not match when position is wrong
  - `regexTester.test.js`: empty pattern returns no matches without error
  - `exporters.test.js`: Rust export with flags string
  - `exporters.test.js`: grep export with special characters in pattern

## [1.1.2] — 2026-06-30

### Fixed
- README: Fixed doc links to point to `docs/ARCHITECTURE.md` and `docs/CHANGELOG.md` (files remain in `docs/`)
- README: Fixed project structure tree to show docs in `docs/` directory
- `.gitignore` expanded with `coverage/`, `*.log`, `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`, `.vscode/`, `.idea/`, `*.swp`, `*.swo`, `*~`, `Thumbs.db`, `desktop.ini`, `build/`
- Explanation: Token types now color-coded (literal=gray, charclass=purple, quantifier=orange, group=blue, anchor=red, escaped=green, alternation=pink, wildcard=yellow)
- RegexDisplay: Copy dropdown now closes on outside click (added click-outside handler)
- ExportModal: Replaced hardcoded `2000ms` with `TOAST_DURATION_MS` constant
- PromptInput: Refactored to `forwardRef` for reliable Ctrl+K focus (was using fragile `document.querySelector`)
- App: Ctrl+K now focuses prompt textarea via ref instead of DOM query
- `start.bat`: Full one-click flow — checks Node 20+, npm, installs deps, creates .env, runs lint, starts server, opens browser
- `start.sh`: Full one-click flow matching start.bat for Linux/macOS
- `install.bat`: Full setup — checks Node 20+, installs deps, creates .env, runs 67 tests, lints, builds production bundle, shows summary
- `install.sh`: Full setup matching install.bat for Linux/macOS

### Added
- Google Gemini as third AI provider (models: gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash)
- `GeminiProvider` class in `aiFactory.js` using Google Generative Language REST API
- Gemini API key field in Settings modal with link to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- `VITE_GEMINI_API_KEY` environment variable support in `.env.example`
- README: Gemini configuration section with setup instructions

### Changed
- UI redesign: two-column layout on desktop (left: regex/flags/explanation/history, right: test/results)
- Header: gradient text logo, icon badge, subtitle, wider max-width (6xl)
- Cards: rounded-xl, shadow-sm, surface-hover effect on match cards
- MatchResults: empty state with SearchX icon, match badge with CheckCircle2, numbered match cards (#1, #2...)
- RegexDisplay: larger regex text (text-lg), darker background for code block
- PromptInput: larger textarea (3 rows), cleaner layout without wrapper div
- TestArea: taller textarea (6 rows), better spacing
- Primary button: glow effect in dark mode
- Footer: more padding, better spacing
- README: Added "Why?" section with problem statement and solution description
- README: Added "The Problem" section listing 4 pain points with regex
- README: Added "The Solution" table showing 6-step workflow
- README: Added "Who Is This For?" section listing 5 target user groups
- README: Added "Usage" section with basic workflow and example prompts/results table
- README: Fixed test count from 113 to 62
- README: Fixed CSS path from `src/styles/index.css` to `src/index.css`
- README: Removed duplicate Keyboard Shortcuts section (consolidated into Usage)

## [1.1.1] — 2026-06-30

### Added
- Screenshot placeholder in README.md with reference to `docs/screenshots/ui-main-dark.png`
- `docs/screenshots/README.md` with list of required screenshots and capture instructions
- README: "Why?" section explaining the problem the project solves
- README: "The Problem" section listing pain points with regex
- README: "The Solution" table showing the 6-step workflow
- README: "Who Is This For?" section listing target users
- README: "Usage" section with basic workflow and example prompts/results table

### Fixed
- F5: Example selection now auto-generates regex (previously only filled the prompt)
- `handleGenerate` refactored to accept optional `promptOverride` parameter for auto-generation from examples
- `handleExampleSelect` now calls `handleGenerate(prompt)` after setting the prompt text
- `Toast.jsx` now uses `TOAST_DURATION_MS` from constants instead of hardcoded `2500`
- `PromptInput.jsx` now uses `MAX_INPUT_LENGTH` from constants instead of hardcoded `500`
- `aiFactory.js` now imports `MAX_INPUT_LENGTH` from `constants.js` instead of duplicating the constant locally
- Moved `src/styles/index.css` to `src/index.css` to match project spec file structure
- README: Fixed test count from 113 to 62
- README: Fixed CSS path from `src/styles/index.css` to `src/index.css`
- README: Fixed doc links to point to `docs/ARCHITECTURE.md` and `docs/CHANGELOG.md`
- README: Fixed project structure to show docs in `docs/` directory
- README: Removed duplicate Keyboard Shortcuts section (now in Usage section)
- `.gitignore` expanded with `coverage/`, `*.log`, `.vscode/`, `.idea/`, `Thumbs.db`, `build/`

## [1.1.0] — 2026-06-30

### Added
- Factory Pattern: `aiFactory.js` with `OpenAIProvider` and `OllamaProvider` classes
- Strategy Pattern: Export strategies per language in `exporters.js`
- Builder Pattern: `ExplanationBuilder` class in `regexParser.js`
- Command Pattern: `CopyCommand`, `CopyMatchCommand`, `CopyExportCommand` in `copyCommands.js`
- Cache Pattern: Regex compilation cache in `regexTester.js`
- Decorator Pattern: `buildHighlightedSegments` as highlight decorator
- Singleton Pattern: `useApiKey` hook for API key/settings management
- Observer Pattern: `useRegex` hook with debounced re-match on state changes
- Event Sourcing: `useHistory` hook with immutable append-only log
- CQRS: Separated read (match display) and write (regex generation) paths
- `useTheme` hook extracted from `useSettings`
- `useApiKey` hook (Singleton) replacing `useSettings`
- `useKeyboardShortcuts` hook for global shortcut handling
- `ErrorBoundary` component for crash recovery
- `HelpModal` component showing keyboard shortcuts
- Cheat sheet click-to-insert functionality
- `?` keyboard shortcut to open help modal
- ESLint configuration (`.eslintrc.json`)
- `lint` and `lint:fix` npm scripts
- `aiFactory.js` utility module
- `copyCommands.js` utility module
- `useHistory.test.js` — 8 tests for history hook
- `ExplanationBuilder` tests in `regexParser.test.js`
- Cache test in `regexTester.test.js`
- `netlify.toml` for Netlify deployment
- `CONTRIBUTING.md`
- `ARCHITECTURE.md`
- `BUSINESS_MODEL.md`
- `LICENSE`
- `start.bat`, `start.sh` — dev server launch scripts
- `install.bat`, `install.sh` — installation scripts
- `Dockerfile` — multi-stage build with nginx
- `docker-compose.yml` — single service on port 3000
- `.github/workflows/ci.yml` — CI pipeline
- `MAX_HISTORY_ITEMS`, `DEBOUNCE_MS`, `MAX_INPUT_LENGTH`, `TOAST_DURATION_MS`, `MAX_REGEX_MATCHES` constants
- Idempotency: AI calls use `temperature=0` for deterministic output
- Materialized View: Match results derived from regex + text state

### Changed
- Refactored `ai.js` to delegate to factory-created providers
- Refactored `exporters.js` to use Strategy pattern with per-language strategy objects
- Refactored `regexTester.js` to use cached regex compilation
- Refactored `regexParser.js` to use Builder pattern with `ExplanationBuilder` class
- Refactored `useRegex.js` to import `DEBOUNCE_MS` from constants
- Refactored `useHistory.js` to use Event Sourcing pattern with immutable entries
- Refactored `App.jsx` to use new hooks, ErrorBoundary, HelpModal, command pattern
- Moved `constants.js` from `src/` to `src/utils/constants.js`
- Moved test files from `tests/` to `src/test/`
- Updated `main.jsx` to wrap App with `ErrorBoundary`
- Updated `CheatSheet.jsx` to support click-to-insert via `onInsert` prop
- Updated `vite.config.js` test setup path
- Updated `package.json` with eslint dependencies and lint scripts

### Fixed
- Removed unused `ChevronDown` import from `PromptInput.jsx`
- Removed unused `Check` import from `RegexDisplay.jsx`
- Fixed `History` icon name collision in `History.jsx` (renamed to `HistoryIcon`)

## [1.0.0] — 2026-06-30

### Added
- Initial release of AI Regex Builder
- AI regex generation via OpenAI API (gpt-4o-mini) and Ollama (llama3)
- Real-time regex testing with match highlighting
- Regex explanation with token-by-token parsing
- Flags toggling (g, i, m, s, u, y)
- 16 preset examples dropdown
- History stored in localStorage (last 20 entries)
- Copy buttons (pattern, with flags, as string, as RegExp, matches)
- Export to 7 languages (JavaScript, Python, Java, Go, Rust, PHP, grep)
- AI-powered regex optimization with diff view
- Cheat sheet modal with 26 regex tokens
- Settings modal for API key and AI provider configuration
- Dark/light theme toggle with localStorage persistence
- Keyboard shortcuts (Ctrl+Enter, Ctrl+K, Ctrl+Shift+C, Ctrl+Shift+E, Escape)
- Toast notifications
- Vitest tests for regexTester, regexParser, exporters (51 tests)
- Full README documentation
- TailwindCSS styling with custom theme
- Responsive design
