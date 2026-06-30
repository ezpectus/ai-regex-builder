/**
 * Regex tester — Cache + Decorator patterns.
 *
 * Cache: Compiled regex objects are cached by pattern+flags key to avoid
 * recompiling the same regex on every keystroke (Kleppmann: materialized view cache).
 *
 * Decorator: buildHighlightedSegments wraps the raw text with match highlights
 * without modifying the original text (Decorator pattern).
 */

import { MAX_REGEX_MATCHES, MAX_TEST_TEXT_LENGTH } from './constants.js'

const regexCache = new Map()

/**
 * Get or create a RegExp from cache.
 * @param {string} pattern
 * @param {string} flags
 * @returns {RegExp}
 */
function getCachedRegex(pattern, flags) {
  const cacheKey = `${pattern}___${flags}`
  if (regexCache.has(cacheKey)) {
    return regexCache.get(cacheKey)
  }
  const regex = new RegExp(pattern, flags)
  regexCache.set(cacheKey, regex)
  return regex
}

/**
 * Clear the regex cache (useful for testing).
 */
export function clearRegexCache() {
  regexCache.clear()
}

/**
 * Build a match object from a regex exec result.
 * @param {Array} match - Result from RegExp.exec
 * @returns {{value: string, index: number, end: number, groups: Array}}
 */
function buildMatch(match) {
  const groups = []
  for (let i = 1; i < match.length; i++) {
    groups.push(match[i])
  }

  return {
    value: match[0],
    index: match.index,
    end: match.index + match[0].length,
    groups,
  }
}

/**
 * Test a regex pattern against text and return all matches.
 * Uses cached regex compilation for performance.
 * @param {string} pattern - The regex pattern string
 * @param {string} flags - The regex flags
 * @param {string} text - The text to test against
 * @returns {{matches: Array, error: string|null}}
 */
export function testRegex(pattern, flags, text) {
  if (!pattern) {
    return { matches: [], error: null }
  }

  if (!text) {
    return { matches: [], error: null }
  }

  const safeText = text.length > MAX_TEST_TEXT_LENGTH
    ? text.slice(0, MAX_TEST_TEXT_LENGTH)
    : text

  let regex
  try {
    regex = getCachedRegex(pattern, flags)
  } catch (e) {
    return { matches: [], error: e.message }
  }

  const matches = []

  if (flags.includes('g')) {
    let match
    let safety = 0
    while ((match = regex.exec(safeText)) !== null) {
      if (match.index === regex.lastIndex) {
        regex.lastIndex++
      }
      matches.push(buildMatch(match))
      safety++
      if (safety > MAX_REGEX_MATCHES) break
    }
  } else {
    const match = regex.exec(safeText)
    if (match) {
      matches.push(buildMatch(match))
    }
  }

  return { matches, error: null }
}

/**
 * Decorator — wraps text with highlight segments for rendering.
 * Returns array of { text, isMatch, matchIndex } segments.
 * The original text is not modified; instead it's decomposed into
 * decorated segments that carry highlight metadata.
 * @param {string} text
 * @param {Array} matches
 * @returns {Array}
 */
export function buildHighlightedSegments(text, matches) {
  if (!matches || matches.length === 0) {
    return [{ text, isMatch: false, matchIndex: -1 }]
  }

  if (!text) {
    return [{ text: '', isMatch: false, matchIndex: -1 }]
  }

  const segments = []
  let cursor = 0
  const safeText = text.length > MAX_TEST_TEXT_LENGTH
    ? text.slice(0, MAX_TEST_TEXT_LENGTH)
    : text

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i]

    if (m.index > cursor) {
      segments.push({ text: safeText.slice(cursor, m.index), isMatch: false, matchIndex: -1 })
    }

    segments.push({ text: m.value, isMatch: true, matchIndex: i })

    cursor = m.end
  }

  if (cursor < safeText.length) {
    segments.push({ text: safeText.slice(cursor), isMatch: false, matchIndex: -1 })
  }

  return segments
}
