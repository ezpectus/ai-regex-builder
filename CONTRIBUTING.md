# Contributing to AI Regex Builder

Thank you for your interest in contributing! This document covers the development workflow.

## Prerequisites

- **Node.js 20+** — check with `node --version`
- **npm** — comes with Node.js, check with `npm --version`

## Setup

```bash
# Clone the repository
git clone <repo-url>
cd ai-regex-builder

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start dev server
npm run dev
```

The app runs at `http://localhost:5173` (Vite default port).

## Code Style

### ESLint

We use ESLint with the React and React Hooks plugins. Run:

```bash
npm run lint       # check
npm run lint:fix   # auto-fix
```

### Rules

- Use `const` by default, `let` only when reassignment is needed
- No unused variables (warnings will fail CI in future)
- Functions should be under 30 lines
- Meaningful variable names — no single letters except in tight loops
- No magic numbers — extract to named constants
- No `console.error` in production code
- All async operations must have loading and error states
- All user actions must have feedback (toast, highlight, animation)

### Patterns

This project uses several design patterns. Follow them when adding features:

- **Factory**: AI providers (`aiFactory.js`) — OpenAI, Gemini, Ollama
- **Strategy**: Export formats (`exporters.js`)
- **Builder**: Regex explanation (`regexParser.js`)
- **Command**: Copy operations (`copyCommands.js`)
- **Cache**: Regex compilation (`regexTester.js`)
- **Decorator**: Highlight segments (`regexTester.js`)
- **Singleton**: API key manager (`useApiKey.js`)
- **Observer**: State-driven re-match (`useRegex.js`)
- **Event Sourcing**: History log (`useHistory.js`)
- **Safe Storage**: All localStorage access via `safeStorage.js` (guards against parse errors, quota, privacy mode)
- **Safe Clipboard**: All clipboard access via `safeClipboard.js` (Clipboard API + execCommand fallback)
- **Timeout Guard**: All AI requests use `fetchWithTimeout` (30s abort) with retry logic
- **Security Headers**: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy configured in `netlify.toml` and `Dockerfile`
- **XSS Prevention**: No `dangerouslySetInnerHTML`, no `eval()`, no `innerHTML` — React auto-escapes all user input
- **API Key Safety**: Keys in `localStorage` only, sent only to provider API, never logged, masked in UI with `type="password"`
- **Input Limits**: Prompt (2K), test text (100K), matches (10K) — all inputs trimmed and sliced

## Testing

```bash
npm test           # run all tests
npm run test:watch # watch mode
```

All tests must pass before a PR can be merged. Tests are in `src/test/`.

### Test Files

- `regexTester.test.js` — regex matching and highlighting
- `regexParser.test.js` — token parsing and explanation builder
- `exporters.test.js` — language export strategies
- `useHistory.test.js` — history hook with localStorage

## PR Process

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes, keeping commits focused
3. Ensure all quality gates pass:
   ```bash
   npm run lint
   npm test
   npm run build
   ```
4. Update `CHANGELOG.md` with your changes
5. Open a pull request with a clear description

## Project Structure

```
src/
├── components/     # React UI components
├── hooks/          # Custom React hooks (state management)
├── utils/          # Pure utility functions (no React)
│   ├── ai.js           # AI service (delegates to factory)
│   ├── aiFactory.js    # Factory: OpenAI/Gemini/Ollama providers
│   ├── constants.js    # App constants and defaults
│   ├── copyCommands.js # Command pattern: copy operations
│   ├── safeStorage.js  # Safe localStorage wrappers
│   ├── safeClipboard.js # Safe clipboard with fallback
│   ├── exporters.js    # Strategy pattern: language exports
│   ├── regexParser.js  # Builder pattern: token parser
│   └── regexTester.js  # Cache + Decorator: matching
├── test/           # Vitest test files
├── App.jsx         # Main app component
└── main.jsx        # Entry point with ErrorBoundary
```

## License

Proprietary. All rights reserved. See [LICENSE](./LICENSE).
