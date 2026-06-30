/**
 * Regex parser — Builder Pattern.
 *
 * The ExplanationBuilder incrementally builds a list of tokens from a regex
 * pattern string. Each token carries: { token, description, type }.
 * The builder methods (addEscaped, addCharClass, addGroup, etc.) each handle
 * one token type, keeping the parsing logic modular and extensible.
 */

const ESCAPED_MAP = {
  d: 'Match a digit [0-9]',
  D: 'Match a non-digit [^0-9]',
  w: 'Match a word character [a-zA-Z0-9_]',
  W: 'Match a non-word character',
  s: 'Match a whitespace character',
  S: 'Match a non-whitespace character',
  b: 'Word boundary',
  B: 'Non-word boundary',
  n: 'Newline character',
  r: 'Carriage return',
  t: 'Tab character',
  v: 'Vertical tab',
  f: 'Form feed',
  '0': 'Null character',
  '.': 'Literal dot "."',
  '*': 'Literal asterisk "*"',
  '+': 'Literal plus "+"',
  '?': 'Literal question mark "?"',
  '^': 'Literal caret "^"',
  '$': 'Literal dollar "$"',
  '(': 'Literal open parenthesis "("',
  ')': 'Literal close parenthesis ")"',
  '[': 'Literal open bracket "["',
  ']': 'Literal close bracket "]"',
  '{': 'Literal open brace "{"',
  '}': 'Literal close brace "}"',
  '|': 'Literal pipe "|"',
  '\\': 'Literal backslash "\\"',
  '/': 'Literal forward slash "/"',
}

const GROUP_MAP = {
  'capturing': 'Capturing group — groups and captures the match',
  'non-capturing': 'Non-capturing group — groups without capturing',
  'positive-lookahead': 'Positive lookahead — asserts match ahead without consuming',
  'negative-lookahead': 'Negative lookahead — asserts no match ahead',
  'positive-lookbehind': 'Positive lookbehind — asserts match behind',
  'negative-lookbehind': 'Negative lookbehind — asserts no match behind',
}

/**
 * Builder — incrementally constructs the token list from a regex pattern.
 */
class ExplanationBuilder {
  constructor(pattern) {
    this.pattern = pattern
    this.tokens = []
    this.pos = 0
  }

  addEscaped() {
    const next = this.pattern[this.pos + 1]
    if (next === undefined) {
      this.tokens.push({ token: '\\', description: 'Trailing backslash (incomplete escape)', type: 'error' })
      this.pos++
      return
    }
    const escaped = '\\' + next
    this.tokens.push({ token: escaped, description: ESCAPED_MAP[next] || `Escaped character "${next}"`, type: 'escaped' })
    this.pos += 2
  }

  addCharClass() {
    let end = this.pos + 1
    if (this.pattern[end] === '^') end++
    if (this.pattern[end] === ']') end++
    while (end < this.pattern.length && this.pattern[end] !== ']') {
      if (this.pattern[end] === '\\' && end + 1 < this.pattern.length) end++
      end++
    }
    if (end < this.pattern.length) end++
    const classStr = this.pattern.slice(this.pos, end)
    const desc = classStr.startsWith('[^')
      ? `Negated character class — match any character NOT in ${classStr}`
      : `Character class — match any character in ${classStr}`
    this.tokens.push({ token: classStr, description: desc, type: 'charclass' })
    this.pos = end
  }

  addGroup() {
    let end = this.pos + 1
    let depth = 1
    let groupType = 'capturing'
    if (this.pattern[end] === '?') {
      if (this.pattern[end + 1] === ':') groupType = 'non-capturing'
      else if (this.pattern[end + 1] === '=') groupType = 'positive-lookahead'
      else if (this.pattern[end + 1] === '!') groupType = 'negative-lookahead'
      else if (this.pattern[end + 1] === '<' && this.pattern[end + 2] === '=') groupType = 'positive-lookbehind'
      else if (this.pattern[end + 1] === '<' && this.pattern[end + 2] === '!') groupType = 'negative-lookbehind'
    }
    while (end < this.pattern.length && depth > 0) {
      if (this.pattern[end] === '\\') {
        end++
      } else if (this.pattern[end] === '(') {
        depth++
      } else if (this.pattern[end] === ')') {
        depth--
        if (depth === 0) break
      }
      end++
    }
    if (end < this.pattern.length) end++
    const groupStr = this.pattern.slice(this.pos, end)
    this.tokens.push({ token: groupStr, description: GROUP_MAP[groupType] || 'Group', type: 'group' })
    this.pos = end
  }

  addQuantifier(char) {
    if (char === '{') {
      let end = this.pos + 1
      while (end < this.pattern.length && this.pattern[end] !== '}') end++
      if (end < this.pattern.length) end++
      const quantStr = this.pattern.slice(this.pos, end)
      this.tokens.push({ token: quantStr, description: describeQuantifier(quantStr), type: 'quantifier' })
      this.pos = end
    } else if (char === '?') {
      const prev = this.tokens[this.tokens.length - 1]
      if (prev && prev.type === 'quantifier') {
        this.tokens.push({ token: '?', description: 'Lazy (non-greedy) modifier', type: 'quantifier' })
      } else {
        this.tokens.push({ token: '?', description: 'Match 0 or 1 time (optional)', type: 'quantifier' })
      }
      this.pos++
    } else if (char === '*') {
      this.tokens.push({ token: '*', description: 'Match 0 or more times (greedy)', type: 'quantifier' })
      this.pos++
    } else if (char === '+') {
      this.tokens.push({ token: '+', description: 'Match 1 or more times (greedy)', type: 'quantifier' })
      this.pos++
    }
  }

  addAnchor(char) {
    const desc = char === '^'
      ? 'Start of string (or line with "m" flag)'
      : 'End of string (or line with "m" flag)'
    this.tokens.push({ token: char, description: desc, type: 'anchor' })
    this.pos++
  }

  addAlternation() {
    this.tokens.push({ token: '|', description: 'Alternation (OR) — matches either side', type: 'alternation' })
    this.pos++
  }

  addWildcard() {
    this.tokens.push({ token: '.', description: 'Any character except newline (with "s" flag, includes newline)', type: 'wildcard' })
    this.pos++
  }

  addLiteral(char) {
    this.tokens.push({ token: char, description: `Literal character "${char}"`, type: 'literal' })
    this.pos++
  }

  build() {
    while (this.pos < this.pattern.length) {
      const char = this.pattern[this.pos]

      if (char === '\\') { this.addEscaped(); continue }
      if (char === '[') { this.addCharClass(); continue }
      if (char === '(') { this.addGroup(); continue }
      if (char === '*' || char === '+' || char === '?' || char === '{') { this.addQuantifier(char); continue }
      if (char === '^' || char === '$') { this.addAnchor(char); continue }
      if (char === '|') { this.addAlternation(); continue }
      if (char === '.') { this.addWildcard(); continue }

      this.addLiteral(char)
    }

    return this.tokens
  }
}

function describeQuantifier(str) {
  const inner = str.slice(1, -1)
  if (inner.includes(',')) {
    const [min, max] = inner.split(',')
    if (max === '') return `Match at least ${min} times`
    return `Match between ${min} and ${max} times`
  }
  return `Match exactly ${inner} times`
}

/**
 * Parse a regex pattern string into tokens with descriptions.
 * Uses the Builder pattern via ExplanationBuilder.
 * @param {string} pattern
 * @returns {Array<{token: string, description: string, type: string}>}
 */
export function parseRegex(pattern) {
  if (!pattern) return []
  return new ExplanationBuilder(pattern).build()
}

export { ExplanationBuilder }
