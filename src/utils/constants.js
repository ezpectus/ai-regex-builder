/**
 * Application constants — examples, flags, cheat sheet, defaults.
 */

export const EXAMPLES = [
  { label: 'Email addresses', prompt: 'extract all email addresses' },
  { label: 'Phone numbers (US)', prompt: 'match US phone numbers with optional country code' },
  { label: 'Phone numbers (intl)', prompt: 'match international phone numbers with country code' },
  { label: 'IPv4 addresses', prompt: 'validate IPv4 addresses' },
  { label: 'IPv6 addresses', prompt: 'validate IPv6 addresses' },
  { label: 'URLs', prompt: 'extract all URLs including http and https' },
  { label: 'Dates (YYYY-MM-DD)', prompt: 'match dates in YYYY-MM-DD format' },
  { label: 'Dates (DD/MM/YYYY)', prompt: 'match dates in DD/MM/YYYY format' },
  { label: 'Credit cards', prompt: 'match credit card numbers with optional dashes' },
  { label: 'Hex colors', prompt: 'match hex color codes like #FF5733' },
  { label: 'Strong passwords', prompt: 'match strong passwords: 8+ chars, uppercase, lowercase, number, special' },
  { label: 'Hashtags', prompt: 'extract hashtags from social media text' },
  { label: 'Mentions @user', prompt: 'extract @mentions from text' },
  { label: 'Time (HH:MM)', prompt: 'match time in 24-hour HH:MM format' },
  { label: 'ZIP codes (US)', prompt: 'match US ZIP codes (5 or 9 digits)' },
  { label: 'UUID', prompt: 'match UUID v4 format' },
]

export const FLAGS = [
  { key: 'g', label: 'global', description: 'Find all matches' },
  { key: 'i', label: 'case-insensitive', description: 'Ignore case' },
  { key: 'm', label: 'multiline', description: '^ and $ match per line' },
  { key: 's', label: 'dotall', description: '. matches newline' },
  { key: 'u', label: 'unicode', description: 'Unicode support' },
  { key: 'y', label: 'sticky', description: 'Exact position match' },
]

export const CHEAT_SHEET = [
  { token: '.', desc: 'Any character except newline' },
  { token: '*', desc: '0 or more' },
  { token: '+', desc: '1 or more' },
  { token: '?', desc: '0 or 1 (optional)' },
  { token: '{n}', desc: 'Exactly n' },
  { token: '{n,}', desc: 'n or more' },
  { token: '{n,m}', desc: 'Between n and m' },
  { token: '^', desc: 'Start of string' },
  { token: '$', desc: 'End of string' },
  { token: '\\b', desc: 'Word boundary' },
  { token: '\\B', desc: 'Non-word boundary' },
  { token: '\\d', desc: 'Digit [0-9]' },
  { token: '\\D', desc: 'Non-digit' },
  { token: '\\w', desc: 'Word char [a-zA-Z0-9_]' },
  { token: '\\W', desc: 'Non-word char' },
  { token: '\\s', desc: 'Whitespace' },
  { token: '\\S', desc: 'Non-whitespace' },
  { token: '[...]', desc: 'Character set' },
  { token: '[^...]', desc: 'Negated character set' },
  { token: '(...)', desc: 'Capturing group' },
  { token: '(?:...)', desc: 'Non-capturing group' },
  { token: '(?=...)', desc: 'Positive lookahead' },
  { token: '(?!...)', desc: 'Negative lookahead' },
  { token: '|', desc: 'Alternation (OR)' },
  { token: '\\.', desc: 'Literal dot' },
  { token: '\\n', desc: 'Newline' },
  { token: '\\t', desc: 'Tab' },
]

export const DEFAULT_FLAGS = { g: true, i: false, m: false, s: false, u: false, y: false }

export const DEFAULT_TEST_TEXT = `Contact us at john@example.com or admin@site.org
Invalid: not.an.email@
Also: test.user+tag@gmail.com works`

export const MAX_HISTORY_ITEMS = 20
export const DEBOUNCE_MS = 300
export const MAX_INPUT_LENGTH = 500
export const TOAST_DURATION_MS = 2500
export const MAX_REGEX_MATCHES = 10000
export const MAX_TEST_TEXT_LENGTH = 100000
export const REQUEST_TIMEOUT_MS = 30000
export const AI_RETRY_COUNT = 2
