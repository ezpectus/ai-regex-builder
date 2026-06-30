import { useEffect } from 'react'

/**
 * Keyboard shortcuts hook — registers global keyboard shortcuts.
 * @param {Object} handlers - Map of shortcut keys to handler functions
 * @param {Object} deps - Dependencies object passed to handlers
 *
 * Supported shortcuts:
 * - Ctrl/Cmd+Enter: onGenerate
 * - Ctrl/Cmd+K: onFocusPrompt
 * - Ctrl/Cmd+Shift+C: onCopyRegex
 * - Ctrl/Cmd+Shift+E: onExport
 * - Escape: onCloseModal
 * - ? (Shift+/): onHelp
 */
export function useKeyboardShortcuts(handlers) {
  useEffect(() => {
    const handler = (e) => {
      const ctrl = e.ctrlKey || e.metaKey

      if (ctrl && e.key === 'Enter') {
        e.preventDefault()
        handlers.onGenerate?.()
        return
      }

      if (ctrl && e.key === 'k') {
        e.preventDefault()
        handlers.onFocusPrompt?.()
        return
      }

      if (ctrl && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        handlers.onCopyRegex?.()
        return
      }

      if (ctrl && e.shiftKey && e.key === 'E') {
        e.preventDefault()
        handlers.onExport?.()
        return
      }

      if (e.key === 'Escape') {
        handlers.onCloseModal?.()
        return
      }

      if (e.key === '?' && !ctrl && !e.altKey) {
        const target = e.target
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault()
          handlers.onHelp?.()
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handlers])
}
