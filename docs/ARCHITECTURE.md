# Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                          │
│                                                                  │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│  │ PromptInp │   │ RegexDisp │   │ TestArea │   │  Flags   │    │
│  │  Examples │   │  Explain  │   │  Matches │   │  History │    │
│  └─────┬─────┘   └─────┬─────┘   └─────┬────┘   └─────┬────┘    │
│        │               │               │              │          │
│  ──────┴───────────────┴───────────────┴──────────────┴──────    │
│                          App.jsx (Controller)                    │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│  │ useRegex  │   │useHistory │   │ useApiKey│   │ useTheme │    │
│  │ (Observer)│   │(EventSrc) │   │(Singleton)│   │          │    │
│  └─────┬─────┘   └─────┬─────┘   └─────┬────┘   └──────────┘    │
│        │               │               │                          │
│  ┌─────┴───────────────┴───────────────┴──────────────────┐     │
│  │                    Utils Layer                          │     │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐       │     │
│  │  │ regexTester │  │ regexParser│  │  exporters  │       │     │
│  │  │ (Cache+Dec) │  │ (Builder)  │  │ (Strategy)  │       │     │
│  │  └────────────┘  └────────────┘  └────────────┘       │     │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐       │     │
│  │  │     ai     │  │ aiFactory  │  │copyCommands │       │     │
│  │  │ (Service)  │  │ (Factory)  │  │ (Command)   │       │     │
│  │  └─────┬──────┘  └─────┬──────┘  └────────────┘       │     │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐       │     │
│  │  │safeStorage │  │safeClipboard│  │            │       │     │
│  │  │ (Guard)    │  │ (Guard)    │  │            │       │     │
│  │  └────────────┘  └────────────┘  └────────────┘       │     │
│  └────────┼───────────────┼──────────────────────────────┘     │
│           │               │                                      │
└───────────┼───────────────┼──────────────────────────────────────┘
            │               │
            ▼               ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │  OpenAI API  │  │  Gemini API  │  │   Ollama     │
    │ (gpt-4o-mini)│  │(gemini-1.5)  │  │ (llama3)     │
    └──────────────┘  └──────────────┘  └──────────────┘
```

## Design Patterns

| Pattern | Where | Description |
|---------|-------|-------------|
| **Factory** | `aiFactory.js` | `createAIProvider(config)` returns `OpenAIProvider`, `GeminiProvider`, or `OllamaProvider` based on config. All implement the same interface (`generate`, `optimize`). |
| **Strategy** | `exporters.js` | Each language has a strategy object (`JavaScriptStrategy`, `PythonStrategy`, etc.) with an `export(pattern, flags)` method. `exportRegex` selects the strategy from a `Map`. |
| **Builder** | `regexParser.js` | `ExplanationBuilder` class incrementally builds a token list via `addEscaped()`, `addCharClass()`, `addGroup()`, etc. The `build()` method orchestrates the construction. |
| **Command** | `copyCommands.js` | `CopyCommand`, `CopyMatchCommand`, `CopyExportCommand` encapsulate copy operations as objects with `execute()` and description methods. |
| **Decorator** | `regexTester.js` | `buildHighlightedSegments` wraps raw text with highlight metadata (`isMatch`, `matchIndex`) without modifying the original text. |
| **Cache** | `regexTester.js` | `getCachedRegex(pattern, flags)` caches compiled `RegExp` objects in a `Map` to avoid recompilation on every keystroke. |
| **Singleton** | `useApiKey.js` | Single source of truth for AI provider settings, backed by `localStorage`. All components share the same settings state. |
| **Observer** | `useRegex.js` | State changes (pattern, flags, testText) trigger a debounced re-match via `useEffect`, acting as an observer of state mutations. |
| **MVC** | App structure | **Model**: `useRegex`/`useHistory`/`useApiKey` hooks. **View**: React components. **Controller**: `App.jsx` orchestrates state and user actions. |

## Kleppmann DDIA Patterns

| Pattern | Where | Description |
|---------|-------|-------------|
| **Immutable Data** | `useHistory.js` | History entries are append-only and never modified after creation. Removal creates a new array without the entry. |
| **Event Sourcing** | `useHistory.js` | History is an append-only log of generation events. The current state (history array) is a materialized view of the log. |
| **CQRS** | App architecture | Write path: `generateRegex` → AI → `setPattern`. Read path: `testRegex` → `matches` → display. Separated concerns. |
| **Materialized View** | `useRegex.js` | Match results are a derived view of (pattern + flags + testText). Recomputed on input change, cached via regex cache. |
| **Cache** | `regexTester.js` | Compiled regex objects cached by `pattern___flags` key. Avoids redundant `new RegExp()` calls. |
| **Idempotency** | `aiFactory.js` | AI calls use `temperature=0` for deterministic output. Same prompt + same API = same result. |

## Data Flow

```
User types prompt
    │
    ▼
PromptInput → App.handleGenerate()
    │
    ▼
generateRegex(prompt, settings) → aiFactory.createAIProvider(config)
    │
    ├── OpenAI: POST /v1/chat/completions (temperature=0)
    ├── Gemini: POST /v1beta/models/{model}:generateContent (temperature=0)
    └── Ollama: POST /api/generate (temperature=0)
    │
    ▼
parseAIResponse(text) → { pattern, explanation, flags }
    │
    ▼
validateRegex(pattern, flags) → new RegExp(pattern, flags)
    │
    ▼
useRegex.setPattern() + setFlagsFromString()
    │
    ▼
Observer: useEffect detects pattern/flags/text change
    │
    ▼
testRegex(pattern, flags, text) → getCachedRegex() → exec loop
    │
    ▼
matches[] → buildHighlightedSegments() → MatchResults component
    │
    ▼
addEntry() → useHistory (append-only log) → localStorage
```

## Component Hierarchy

```
ErrorBoundary
└── App
    ├── Header (theme toggle, settings, cheat sheet, help, GitHub)
    ├── PromptInput
    │   └── Examples (dropdown)
    ├── RegexDisplay (copy, explain, optimize, export buttons)
    ├── Flags (checkboxes)
    ├── Explanation (token breakdown)
    ├── TestArea (textarea)
    ├── MatchResults (highlighted text + match list)
    ├── History (recent queries)
    ├── ExportModal (7 languages)
    ├── CheatSheet (click-to-insert)
    ├── SettingsModal (API key, provider)
    ├── HelpModal (keyboard shortcuts)
    ├── OptimizeResult (diff view)
    └── Toast (notifications)
```

## State Management

No Redux. State is managed via custom hooks:

- **`useRegex`** — prompt, pattern, flags, testText, matches, regexError, isGenerating, explanation
- **`useHistory`** — history array (append-only), addEntry, removeEntry, clearHistory
- **`useApiKey`** — settings (apiKey, geminiApiKey, provider, model, ollamaUrl), updateSettings
- **`useTheme`** — theme ('dark'|'light'), toggleTheme
- **`useKeyboardShortcuts`** — registers global keyboard event listeners

All hooks use `useState` + `useCallback` + `useEffect`. State persists to `localStorage` where appropriate.

## AI Provider Abstraction

```
createAIProvider(config)
    ├── config.provider === 'openai'  → OpenAIProvider
    ├── config.provider === 'gemini'  → GeminiProvider
    └── config.provider === 'ollama'  → OllamaProvider

Interface:
    generate(prompt) → { pattern, explanation, flags } | { error }
    optimize(regex, prompt) → { optimized, changes } | { error }
```

All providers implement the same interface. The factory selects the appropriate provider based on `config.provider`. Adding a new provider (e.g., Anthropic) requires only adding a new class and a case in the factory.

## Robustness & Error Handling

### AI Request Hardening
- **Timeout**: All AI requests use `fetchWithTimeout` — aborts after `REQUEST_TIMEOUT_MS` (30s) via `AbortController`
- **Retry**: Failed requests retry up to `AI_RETRY_COUNT` (2) times before returning error
- **Safe JSON**: All `res.json()` calls wrapped in try/catch — invalid JSON doesn't crash the app
- **Safe error body**: `res.text()` on error responses wrapped in try/catch, truncated to 200 chars
- **Network errors**: `formatNetworkError()` converts `AbortError` → timeout message, `Failed to fetch` → connection message
- **Validation**: AI-generated regex validated with `new RegExp()` before returning to UI

### Safe Storage (`safeStorage.js`)
All `localStorage` access goes through safe wrappers:
- `safeGetJSON(key, fallback)` — safe JSON parse with fallback
- `safeSetJSON(key, value)` — safe JSON serialize + write, returns boolean
- `safeGet(key, fallback)` — safe string read
- `safeSet(key, value)` — safe string write
- Guards against: SSR (no `window`), privacy mode, quota exceeded, JSON parse errors
- Availability checked once at module load

### Safe Clipboard (`safeClipboard.js`)
- `safeCopy(text)` — tries `navigator.clipboard.writeText` first (HTTPS only)
- Falls back to `document.execCommand('copy')` with hidden textarea for non-HTTPS
- Returns `boolean` — callers show error toast on failure

### Regex Execution Guards (`regexTester.js`)
- Test text capped at `MAX_TEST_TEXT_LENGTH` (100K chars) — prevents browser freeze on huge inputs
- Match count capped at `MAX_REGEX_MATCHES` (10K) — prevents infinite loops on catastrophic backtracking
- Zero-width match guard: `regex.lastIndex++` when `match.index === regex.lastIndex`

### Typed Toast Notifications (`Toast.jsx`)
Toasts support three types with color-coded icons:
- `success` (green check) — copy succeeded, settings saved, regex applied
- `error` (red alert) — API errors, network failures, clipboard failures
- `warning` (yellow triangle) — empty prompt, missing API key
- Backward compatible: plain string toasts default to `success` type

### App-Level Error Guards (`App.jsx`)
- `handleGenerate` — wrapped in try/catch, `isGenerating` always reset (even on error)
- `handleOptimize` — wrapped in try/catch, `isOptimizing` always reset
- `handleCopy` / `handleCopyMatch` — async, error toast on clipboard failure
- All error paths show typed toast with user-friendly message

### Light Mode UI Polish (`index.css`, `tailwind.config.js`)
- Border color: `#d0d7de` → `#afb8c1` — darker borders for better card separation
- Card shadow: `shadow-sm` → `shadow-md` — stronger depth on surfaces
- Hover shadow: `shadow-md` → `shadow-lg` + `border-accent/40` — more pronounced hover state
- Buttons: `shadow-sm` + `hover:border-light-muted` — depth and responsive feedback
- Dark mode unchanged — borders and shadows remain subtle

## Security Hardening

### XSS Prevention
- **No `dangerouslySetInnerHTML`** — zero instances anywhere in the codebase
- **No `eval()` or `new Function()`** — zero instances
- **No `innerHTML` or `document.write()`** — zero instances
- React auto-escapes all interpolated values — all user input (prompts, regex patterns, match text) is rendered safely

### API Key Protection
- API keys stored in `localStorage` only — never in cookies, never in URL params (except Gemini's required `?key=` query param)
- API keys sent only to the provider's official API endpoint — never to any third-party server
- `useApiKey` hook is the single source of truth — keys are not logged or exposed in error messages
- Input fields use `type="password"` — keys are masked in the UI

### HTTP Security Headers
- **`X-Frame-Options: DENY`** — prevents clickjacking (no iframe embedding)
- **`X-Content-Type-Options: nosniff`** — prevents MIME-type sniffing
- **`Referrer-Policy: strict-origin-when-cross-origin`** — limits referrer leakage
- **`Permissions-Policy`** — disables geolocation, microphone, camera APIs
- **`Content-Security-Policy`** — restricts script/style/font/connect sources to known origins
- Configured in both `netlify.toml` (Netlify) and `Dockerfile` (nginx)

### Content Security Policy (CSP)
- `script-src 'self'` — only same-origin scripts
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` — Tailwind generates inline styles
- `font-src 'self' https://fonts.gstatic.com` — Google Fonts
- `connect-src` — restricted to OpenAI, Gemini, and local Ollama endpoints
- `base-uri 'self'` — prevents base tag injection
- `form-action 'self'` — prevents form submission to external origins

### Input Limits
- Prompt input: `MAX_INPUT_LENGTH` (2K chars) — prevents oversized AI requests
- Test text: `MAX_TEST_TEXT_LENGTH` (100K chars) — prevents browser freeze
- Match count: `MAX_REGEX_MATCHES` (10K) — prevents infinite loops
- All inputs trimmed and sliced before processing

### Dependency Security
- `npm audit` — only dev-dependency vulnerabilities (esbuild/vite dev server), no production runtime vulnerabilities
- All external links use `rel="noopener noreferrer"` — prevents tab-nabbing
- No external scripts loaded — only Google Fonts CSS

## Production Performance

### Code Splitting (`vite.config.js`)
- `react-vendor` chunk — React + ReactDOM isolated for long-term browser caching
- `icons` chunk — lucide-react icons separated from app logic
- App code (`index`) — changes frequently, doesn't invalidate vendor cache
- Result: 4 chunks (134KB + 55KB + 20KB + 25KB CSS) instead of 1 monolithic bundle

### Static Asset Caching
- **Netlify**: `/assets/*` → `Cache-Control: public, max-age=31536000, immutable` (1 year)
- **Netlify**: `/favicon.svg` → `Cache-Control: public, max-age=86400` (1 day)
- **Docker/nginx**: `/assets/` → `expires 1y` + `Cache-Control: public, immutable`
- **Docker/nginx**: `/favicon.svg` → `expires 1d`
- Hashed filenames ensure cache busting on new deploys

### Gzip Compression (Docker/nginx)
- Enabled for `text/css`, `application/javascript`, `application/json`, `image/svg+xml`
- Minimum 256 bytes — skips tiny files
- Reduces transfer size by ~70% (e.g., 134KB → 43KB for react-vendor)

### Offline Resilience (`App.jsx`)
- `navigator.onLine` tracked via `online`/`offline` event listeners
- Yellow warning banner shown when offline — AI features require internet
- Regex testing, history, and clipboard still work offline (client-side only)
- No crash or hang when network drops mid-session — `fetchWithTimeout` aborts after 30s
