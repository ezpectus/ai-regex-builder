import { useState, useCallback, useEffect, useRef } from 'react'
import { testRegex } from '../utils/regexTester.js'
import { DEFAULT_FLAGS, DEBOUNCE_MS } from '../utils/constants.js'

export function useRegex() {
  const [prompt, setPrompt] = useState('')
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState({ ...DEFAULT_FLAGS })
  const [testText, setTestText] = useState('')
  const [matches, setMatches] = useState([])
  const [regexError, setRegexError] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [explanation, setExplanation] = useState('')
  const debounceRef = useRef(null)

  const flagsString = Object.entries(flags)
    .filter(([_k, v]) => v)
    .map(([k]) => k)
    .join('')

  // Observer pattern — state changes trigger debounced re-match
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const { matches: result, error } = testRegex(pattern, flagsString, testText)
      setMatches(result)
      setRegexError(error)
    }, DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [pattern, flagsString, testText])

  const toggleFlag = useCallback((key) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const setFlagsFromString = useCallback((flagStr) => {
    const newFlags = { g: false, i: false, m: false, s: false, u: false, y: false }
    for (const ch of flagStr) {
      if (ch in newFlags) newFlags[ch] = true
    }
    setFlags(newFlags)
  }, [])

  const clearAll = useCallback(() => {
    setPrompt('')
    setPattern('')
    setMatches([])
    setRegexError(null)
    setExplanation('')
  }, [])

  return {
    prompt,
    setPrompt,
    pattern,
    setPattern,
    flags,
    flagsString,
    toggleFlag,
    setFlagsFromString,
    testText,
    setTestText,
    matches,
    regexError,
    isGenerating,
    setIsGenerating,
    explanation,
    setExplanation,
    clearAll,
  }
}
