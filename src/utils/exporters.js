/**
 * Export strategies — Strategy Pattern.
 * Each language has its own strategy object implementing the same interface.
 * Interface: { id, label, export(pattern, flags) -> string }
 */

function escapeDoubleQuotes(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function convertPythonFlags(flags) {
  if (!flags) return ''
  const parts = []
  if (flags.includes('i')) parts.push('re.IGNORECASE')
  if (flags.includes('m')) parts.push('re.MULTILINE')
  if (flags.includes('s')) parts.push('re.DOTALL')
  if (flags.includes('x')) parts.push('re.VERBOSE')
  return parts.join(' | ')
}

function convertJavaFlags(flags) {
  if (!flags) return ''
  const parts = []
  if (flags.includes('i')) parts.push('Pattern.CASE_INSENSITIVE')
  if (flags.includes('m')) parts.push('Pattern.MULTILINE')
  if (flags.includes('s')) parts.push('Pattern.DOTALL')
  if (flags.includes('u')) parts.push('Pattern.UNICODE_CASE')
  return parts.join(' | ')
}

const JavaScriptStrategy = {
  id: 'javascript',
  label: 'JavaScript',
  export: (pattern, flags) => `const regex = /${pattern}/${flags};`,
}

const PythonStrategy = {
  id: 'python',
  label: 'Python',
  export: (pattern, flags) => {
    const pyFlags = convertPythonFlags(flags)
    return `import re\npattern = re.compile(r"${pattern}"${pyFlags ? `, ${pyFlags}` : ''})`
  },
}

const JavaStrategy = {
  id: 'java',
  label: 'Java',
  export: (pattern, flags) => {
    const javaFlags = convertJavaFlags(flags)
    return `Pattern pattern = Pattern.compile("${escapeDoubleQuotes(pattern)}"${javaFlags ? `, ${javaFlags}` : ''});`
  },
}

const GoStrategy = {
  id: 'go',
  label: 'Go',
  export: (pattern, _flags) => `re := regexp.MustCompile(\`${pattern}\`)`,
}

const RustStrategy = {
  id: 'rust',
  label: 'Rust',
  export: (pattern, _flags) => `let re = regex::Regex::new(r"${escapeDoubleQuotes(pattern)}").unwrap();`,
}

const PhpStrategy = {
  id: 'php',
  label: 'PHP',
  export: (pattern, flags) => `$pattern = '/${pattern}/${flags}';`,
}

const GrepStrategy = {
  id: 'grep',
  label: 'grep',
  export: (pattern, flags) => {
    const hasI = flags.includes('i') ? ' -i' : ''
    return `grep${hasI} -E "${pattern}" file.txt`
  },
}

const DefaultStrategy = {
  id: 'default',
  label: 'Default',
  export: (pattern, flags) => `/${pattern}/${flags}`,
}

const STRATEGIES = new Map([
  ['javascript', JavaScriptStrategy],
  ['python', PythonStrategy],
  ['java', JavaStrategy],
  ['go', GoStrategy],
  ['rust', RustStrategy],
  ['php', PhpStrategy],
  ['grep', GrepStrategy],
])

/**
 * Export a regex pattern + flags to a specific language format.
 * Uses the Strategy pattern to select the appropriate export strategy.
 * @param {string} pattern
 * @param {string} flags
 * @param {string} language
 * @returns {string}
 */
export function exportRegex(pattern, flags, language) {
  const strategy = STRATEGIES.get(language) || DefaultStrategy
  return strategy.export(pattern, flags)
}

export const EXPORT_LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },
  { id: 'php', label: 'PHP' },
  { id: 'grep', label: 'grep' },
]
