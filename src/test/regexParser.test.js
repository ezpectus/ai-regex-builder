import { describe, it, expect } from 'vitest'
import { parseRegex, ExplanationBuilder } from '../utils/regexParser.js'

describe('parseRegex', () => {
  it('parses literal characters', () => {
    const tokens = parseRegex('abc')
    expect(tokens).toHaveLength(3)
    expect(tokens[0].type).toBe('literal')
    expect(tokens[0].token).toBe('a')
    expect(tokens[1].token).toBe('b')
    expect(tokens[2].token).toBe('c')
  })

  it('parses character class [a-z]', () => {
    const tokens = parseRegex('[a-z]')
    expect(tokens).toHaveLength(1)
    expect(tokens[0].type).toBe('charclass')
    expect(tokens[0].token).toBe('[a-z]')
  })

  it('parses negated character class [^0-9]', () => {
    const tokens = parseRegex('[^0-9]')
    expect(tokens).toHaveLength(1)
    expect(tokens[0].token).toBe('[^0-9]')
    expect(tokens[0].description).toContain('NOT')
  })

  it('parses quantifier +', () => {
    const tokens = parseRegex('a+')
    expect(tokens).toHaveLength(2)
    expect(tokens[1].type).toBe('quantifier')
    expect(tokens[1].token).toBe('+')
  })

  it('parses quantifier *', () => {
    const tokens = parseRegex('a*')
    expect(tokens[1].type).toBe('quantifier')
    expect(tokens[1].token).toBe('*')
  })

  it('parses quantifier ?', () => {
    const tokens = parseRegex('a?')
    expect(tokens[1].type).toBe('quantifier')
    expect(tokens[1].token).toBe('?')
  })

  it('parses quantifier {n}', () => {
    const tokens = parseRegex('a{3}')
    expect(tokens[1].type).toBe('quantifier')
    expect(tokens[1].token).toBe('{3}')
    expect(tokens[1].description).toContain('exactly 3')
  })

  it('parses quantifier {n,m}', () => {
    const tokens = parseRegex('a{2,5}')
    expect(tokens[1].token).toBe('{2,5}')
    expect(tokens[1].description).toContain('between 2 and 5')
  })

  it('parses quantifier {n,}', () => {
    const tokens = parseRegex('a{2,}')
    expect(tokens[1].token).toBe('{2,}')
    expect(tokens[1].description).toContain('at least 2')
  })

  it('parses group (...)', () => {
    const tokens = parseRegex('(abc)')
    expect(tokens).toHaveLength(1)
    expect(tokens[0].type).toBe('group')
    expect(tokens[0].token).toBe('(abc)')
  })

  it('parses non-capturing group (?:...)', () => {
    const tokens = parseRegex('(?:abc)')
    expect(tokens).toHaveLength(1)
    expect(tokens[0].type).toBe('group')
    expect(tokens[0].description).toContain('Non-capturing')
  })

  it('parses positive lookahead (?=...)', () => {
    const tokens = parseRegex('(?=abc)')
    expect(tokens[0].description).toContain('Positive lookahead')
  })

  it('parses negative lookahead (?!...)', () => {
    const tokens = parseRegex('(?!abc)')
    expect(tokens[0].description).toContain('Negative lookahead')
  })

  it('parses anchor ^', () => {
    const tokens = parseRegex('^abc')
    expect(tokens[0].type).toBe('anchor')
    expect(tokens[0].token).toBe('^')
  })

  it('parses anchor $', () => {
    const tokens = parseRegex('abc$')
    expect(tokens[3].type).toBe('anchor')
    expect(tokens[3].token).toBe('$')
  })

  it('parses escaped characters', () => {
    const tokens = parseRegex('\\.')
    expect(tokens).toHaveLength(1)
    expect(tokens[0].type).toBe('escaped')
    expect(tokens[0].token).toBe('\\.')
    expect(tokens[0].description).toContain('Literal dot')
  })

  it('parses \\d as digit', () => {
    const tokens = parseRegex('\\d')
    expect(tokens[0].token).toBe('\\d')
    expect(tokens[0].description).toContain('digit')
  })

  it('parses \\w as word character', () => {
    const tokens = parseRegex('\\w')
    expect(tokens[0].description).toContain('word character')
  })

  it('parses \\s as whitespace', () => {
    const tokens = parseRegex('\\s')
    expect(tokens[0].description).toContain('whitespace')
  })

  it('parses \\b as word boundary', () => {
    const tokens = parseRegex('\\b')
    expect(tokens[0].description).toContain('Word boundary')
  })

  it('parses alternation |', () => {
    const tokens = parseRegex('a|b')
    expect(tokens).toHaveLength(3)
    expect(tokens[1].type).toBe('alternation')
    expect(tokens[1].token).toBe('|')
  })

  it('parses dot wildcard', () => {
    const tokens = parseRegex('a.c')
    expect(tokens[1].type).toBe('wildcard')
    expect(tokens[1].token).toBe('.')
  })

  it('parses complex regex', () => {
    const tokens = parseRegex('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')
    expect(tokens.length).toBeGreaterThan(5)
    const types = tokens.map((t) => t.type)
    expect(types).toContain('charclass')
    expect(types).toContain('quantifier')
    expect(types).toContain('literal')
    expect(types).toContain('escaped')
  })

  it('handles empty pattern', () => {
    const tokens = parseRegex('')
    expect(tokens).toHaveLength(0)
  })
})

describe('ExplanationBuilder', () => {
  it('builds tokens incrementally', () => {
    const builder = new ExplanationBuilder('a+b')
    const tokens = builder.build()
    expect(tokens).toHaveLength(3)
    expect(tokens[0].type).toBe('literal')
    expect(tokens[1].type).toBe('quantifier')
    expect(tokens[2].type).toBe('literal')
  })

  it('exposes tokens array', () => {
    const builder = new ExplanationBuilder('abc')
    builder.build()
    expect(builder.tokens).toHaveLength(3)
  })
})
