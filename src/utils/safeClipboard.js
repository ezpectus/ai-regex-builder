/**
 * Safe clipboard utilities — guards against:
 * - Non-HTTPS contexts (navigator.clipboard undefined)
 * - Permission denied
 * - Browser quirks
 */

/**
 * Safely write text to clipboard.
 * Falls back to execCommand if Clipboard API is unavailable.
 * @param {string} text
 * @returns {boolean} true if copy succeeded
 */
export async function safeCopy(text) {
  if (!text) return false

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // fall through to fallback
    }
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}
