/**
 * Safe localStorage utilities — guards against:
 * - SSR environments (no window/localStorage)
 * - JSON parse errors
 * - Quota exceeded errors
 * - Privacy mode (localStorage disabled)
 */

/**
 * Check if localStorage is available.
 * @returns {boolean}
 */
function isAvailable() {
  try {
    const test = '__test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

const available = typeof window !== 'undefined' && isAvailable()

/**
 * Safely read and parse a JSON value from localStorage.
 * @param {string} key
 * @param {*} fallback - Value to return if key missing or parse fails
 * @returns {*}
 */
export function safeGetJSON(key, fallback = null) {
  if (!available) return fallback
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

/**
 * Safely serialize and write a JSON value to localStorage.
 * @param {string} key
 * @param {*} value
 * @returns {boolean} true if write succeeded
 */
export function safeSetJSON(key, value) {
  if (!available) return false
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

/**
 * Safely remove a key from localStorage.
 * @param {string} key
 */
export function safeRemove(key) {
  if (!available) return
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

/**
 * Safely read a string value from localStorage.
 * @param {string} key
 * @param {string} fallback
 * @returns {string}
 */
export function safeGet(key, fallback = '') {
  if (!available) return fallback
  try {
    return localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

/**
 * Safely write a string value to localStorage.
 * @param {string} key
 * @param {string} value
 * @returns {boolean}
 */
export function safeSet(key, value) {
  if (!available) return false
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}
