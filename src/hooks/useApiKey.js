import { useState, useCallback } from 'react'
import { safeGetJSON, safeSetJSON } from '../utils/safeStorage.js'

const SETTINGS_KEY = 'ai-regex-builder-settings'

/**
 * Singleton API key/settings manager.
 * Ensures a single source of truth for AI provider configuration.
 * All instances share the same localStorage-backed state.
 */
export function useApiKey() {
  const [settings, setSettings] = useState(() => {
    const stored = safeGetJSON(SETTINGS_KEY, null)
    if (stored && typeof stored === 'object') return stored
    return {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
      geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
      provider: 'openai',
      model: 'gpt-4o-mini',
      ollamaUrl: import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434',
    }
  })

  const updateSettings = useCallback((partial) => {
    setSettings((prev) => {
      const updated = { ...prev, ...partial }
      safeSetJSON(SETTINGS_KEY, updated)
      return updated
    })
  }, [])

  return { settings, updateSettings }
}
