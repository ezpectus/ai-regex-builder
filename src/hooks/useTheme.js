import { useState, useCallback, useEffect } from 'react'
import { safeGet, safeSet } from '../utils/safeStorage.js'

const THEME_KEY = 'ai-regex-builder-theme'

/**
 * Theme hook — manages dark/light theme with localStorage persistence.
 */
export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    return safeGet(THEME_KEY, 'dark')
  })

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      safeSet(THEME_KEY, next)
      return next
    })
  }, [])

  return { theme, toggleTheme }
}
