import { describe, it, expect, beforeEach } from 'vitest'
import { testRegex, buildHighlightedSegments, clearRegexCache } from '../utils/regexTester.js'

describe('testRegex', () => {
  beforeEach(() => {
    clearRegexCache()
  })

  it('returns 0 matches for empty input', () => {
    const { matches, error } = testRegex('abc', 'g', '')
    expect(matches).toHaveLength(0)
    expect(error).toBeNull()
  })

  it('returns 0 matches for empty pattern', () => {
    const { matches, error } = testRegex('', 'g', 'some text')
    expect(matches).toHaveLength(0)
    expect(error).toBeNull()
  })

  it('finds a simple match', () => {
    const { matches } = testRegex('hello', '', 'hello world')
    expect(matches).toHaveLength(1)
    expect(matches[0].value).toBe('hello')
    expect(matches[0].index).toBe(0)
    expect(matches[0].end).toBe(5)
  })

  it('finds all matches with global flag', () => {
    const { matches } = testRegex('a', 'g', 'banana')
    expect(matches).toHaveLength(3)
    expect(matches.map((m) => m.index)).toEqual([1, 3, 5])
  })

  it('finds only first match without global flag', () => {
    const { matches } = testRegex('a', '', 'banana')
    expect(matches).toHaveLength(1)
    expect(matches[0].index).toBe(1)
  })

  it('respects case-insensitive flag', () => {
    const { matches } = testRegex('hello', 'gi', 'HELLO world hello')
    expect(matches).toHaveLength(2)
  })

  it('respects multiline flag for ^', () => {
    const text = 'line1\nline2\nline3'
    const { matches } = testRegex('^line', 'gm', text)
    expect(matches).toHaveLength(3)
  })

  it('extracts groups', () => {
    const { matches } = testRegex('(\\d+)-(\\d+)', 'g', '12-34 56-78')
    expect(matches).toHaveLength(2)
    expect(matches[0].groups).toEqual(['12', '34'])
    expect(matches[1].groups).toEqual(['56', '78'])
  })

  it('returns error for invalid regex', () => {
    const { matches, error } = testRegex('[', 'g', 'test')
    expect(matches).toHaveLength(0)
    expect(error).toBeTruthy()
  })

  it('returns no matches when pattern does not match', () => {
    const { matches } = testRegex('xyz', 'g', 'hello world')
    expect(matches).toHaveLength(0)
  })

  it('handles special characters in input', () => {
    const { matches } = testRegex('\\$\\d+', 'g', 'Price: $100 and $200')
    expect(matches).toHaveLength(2)
    expect(matches[0].value).toBe('$100')
    expect(matches[1].value).toBe('$200')
  })

  it('handles zero-width matches without infinite loop', () => {
    const { matches } = testRegex('(?=a)', 'g', 'abc')
    expect(matches.length).toBeGreaterThan(0)
  })

  it('uses cached regex for same pattern+flags', () => {
    testRegex('test', 'g', 'test')
    const { matches } = testRegex('test', 'g', 'test')
    expect(matches).toHaveLength(1)
  })

  it('respects sticky flag (y) — matches only at exact position', () => {
    const { matches } = testRegex('abc', 'y', 'abc')
    expect(matches).toHaveLength(1)
    expect(matches[0].value).toBe('abc')
    expect(matches[0].index).toBe(0)
  })

  it('sticky flag (y) does not match when position is wrong', () => {
    const { matches } = testRegex('abc', 'y', 'xyzabc')
    expect(matches).toHaveLength(0)
  })

  it('empty pattern returns no matches without error', () => {
    const { matches, error } = testRegex('', 'g', 'some text')
    expect(matches).toHaveLength(0)
    expect(error).toBeNull()
  })
})

describe('buildHighlightedSegments', () => {
  it('returns single segment when no matches', () => {
    const segments = buildHighlightedSegments('hello', [])
    expect(segments).toHaveLength(1)
    expect(segments[0].isMatch).toBe(false)
    expect(segments[0].text).toBe('hello')
  })

  it('splits text around matches', () => {
    const matches = [
      { value: 'lo', index: 3, end: 5 },
    ]
    const segments = buildHighlightedSegments('hello', matches)
    expect(segments).toHaveLength(2)
    expect(segments[0]).toEqual({ text: 'hel', isMatch: false, matchIndex: -1 })
    expect(segments[1]).toEqual({ text: 'lo', isMatch: true, matchIndex: 0 })
  })

  it('handles multiple matches', () => {
    const matches = [
      { value: 'a', index: 1, end: 2 },
      { value: 'a', index: 3, end: 4 },
    ]
    const segments = buildHighlightedSegments('banana', matches)
    expect(segments).toHaveLength(5)
    expect(segments[1].isMatch).toBe(true)
    expect(segments[3].isMatch).toBe(true)
  })
})
