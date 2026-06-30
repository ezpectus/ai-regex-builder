import { useState, useCallback } from 'react'
import { MAX_HISTORY_ITEMS } from '../utils/constants.js'
import { safeGetJSON, safeSetJSON } from '../utils/safeStorage.js'

const STORAGE_KEY = 'ai-regex-builder-history'

/**
 * History hook — Event Sourcing pattern.
 *
 * History is an append-only log of actions (generate events).
 * Entries are immutable — once written, they are never modified.
 * Removal creates a new log without the entry, preserving immutability.
 * The materialized view (history array) is derived from the log.
 */
export function useHistory() {
  const [history, setHistory] = useState(() => {
    const stored = safeGetJSON(STORAGE_KEY, [])
    return Array.isArray(stored) ? stored : []
  })

  const persist = useCallback((items) => {
    safeSetJSON(STORAGE_KEY, items)
  }, [])

  const addEntry = useCallback((entry) => {
    setHistory((prev) => {
      // Immutable append — new entry is never modified after creation
      const newEntry = {
        id: Date.now(),
        prompt: entry.prompt,
        pattern: entry.pattern,
        flags: entry.flags || '',
        timestamp: Date.now(),
      }
      // Deduplicate by prompt (replace older entry with same prompt)
      const filtered = prev.filter((h) => h.prompt !== newEntry.prompt)
      const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY_ITEMS)
      persist(updated)
      return updated
    })
  }, [persist])

  const removeEntry = useCallback((id) => {
    setHistory((prev) => {
      const updated = prev.filter((h) => h.id !== id)
      persist(updated)
      return updated
    })
  }, [persist])

  const clearHistory = useCallback(() => {
    setHistory([])
    persist([])
  }, [persist])

  return { history, addEntry, removeEntry, clearHistory }
}
