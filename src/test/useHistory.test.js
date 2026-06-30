import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

const STORAGE_KEY = 'ai-regex-builder-history'
const MAX_ITEMS = 20

function setupLocalStorage(initial = []) {
  const store = { [STORAGE_KEY]: JSON.stringify(initial) }
  vi.stubGlobal('localStorage', {
    getItem: (key) => store[key] ?? null,
    setItem: (key, val) => { store[key] = val },
    removeItem: (key) => { delete store[key] },
    clear: () => { for (const k of Object.keys(store)) delete store[k] },
  })
  return store
}

describe('useHistory', () => {
  let useHistory

  beforeEach(async () => {
    vi.resetModules()
    setupLocalStorage([])
    const mod = await import('../hooks/useHistory.js')
    useHistory = mod.useHistory
  })

  it('starts with empty history', () => {
    const { result } = renderHook(() => useHistory())
    expect(result.current.history).toHaveLength(0)
  })

  it('adds an entry', () => {
    const { result } = renderHook(() => useHistory())
    act(() => {
      result.current.addEntry({ prompt: 'test prompt', pattern: '\\d+', flags: 'g' })
    })
    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0].prompt).toBe('test prompt')
    expect(result.current.history[0].pattern).toBe('\\d+')
  })

  it('deduplicates by prompt', () => {
    const { result } = renderHook(() => useHistory())
    act(() => {
      result.current.addEntry({ prompt: 'same prompt', pattern: 'a', flags: 'g' })
    })
    act(() => {
      result.current.addEntry({ prompt: 'same prompt', pattern: 'b', flags: 'g' })
    })
    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0].pattern).toBe('b')
  })

  it('limits to MAX_HISTORY_ITEMS', () => {
    const { result } = renderHook(() => useHistory())
    act(() => {
      for (let i = 0; i < MAX_ITEMS + 5; i++) {
        result.current.addEntry({ prompt: `prompt-${i}`, pattern: 'x', flags: 'g' })
      }
    })
    expect(result.current.history).toHaveLength(MAX_ITEMS)
  })

  it('removes an entry by id', () => {
    const { result } = renderHook(() => useHistory())
    act(() => {
      result.current.addEntry({ prompt: 'to remove', pattern: 'a', flags: 'g' })
    })
    const id = result.current.history[0].id
    act(() => {
      result.current.removeEntry(id)
    })
    expect(result.current.history).toHaveLength(0)
  })

  it('clears all history', () => {
    const { result } = renderHook(() => useHistory())
    act(() => {
      result.current.addEntry({ prompt: 'a', pattern: 'x', flags: 'g' })
      result.current.addEntry({ prompt: 'b', pattern: 'y', flags: 'g' })
    })
    expect(result.current.history).toHaveLength(2)
    act(() => {
      result.current.clearHistory()
    })
    expect(result.current.history).toHaveLength(0)
  })

  it('persists to localStorage', () => {
    const store = setupLocalStorage([])
    const { result } = renderHook(() => useHistory())
    act(() => {
      result.current.addEntry({ prompt: 'persisted', pattern: '\\w+', flags: 'g' })
    })
    const stored = JSON.parse(store[STORAGE_KEY])
    expect(stored).toHaveLength(1)
    expect(stored[0].prompt).toBe('persisted')
  })

  it('entries are immutable (have id and timestamp)', () => {
    const { result } = renderHook(() => useHistory())
    act(() => {
      result.current.addEntry({ prompt: 'test', pattern: 'a', flags: 'g' })
    })
    const entry = result.current.history[0]
    expect(entry.id).toBeDefined()
    expect(entry.timestamp).toBeDefined()
  })
})
