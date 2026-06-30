import { describe, it, expect } from 'vitest'
import { exportRegex } from '../utils/exporters.js'

describe('exportRegex', () => {
  it('exports JavaScript format', () => {
    const result = exportRegex('\\d+', 'g', 'javascript')
    expect(result).toBe('const regex = /\\d+/g;')
  })

  it('exports JavaScript without flags', () => {
    const result = exportRegex('\\d+', '', 'javascript')
    expect(result).toBe('const regex = /\\d+/;')
  })

  it('exports Python format', () => {
    const result = exportRegex('\\d+', 'g', 'python')
    expect(result).toContain('import re')
    expect(result).toContain('re.compile')
    expect(result).toContain('r"\\d+"')
  })

  it('exports Python with flags', () => {
    const result = exportRegex('test', 'gi', 'python')
    expect(result).toContain('re.IGNORECASE')
  })

  it('exports Java format', () => {
    const result = exportRegex('\\d+', 'g', 'java')
    expect(result).toContain('Pattern.compile')
    expect(result).toContain('Pattern')
  })

  it('exports Java with flags', () => {
    const result = exportRegex('test', 'i', 'java')
    expect(result).toContain('Pattern.CASE_INSENSITIVE')
  })

  it('exports Go format', () => {
    const result = exportRegex('\\d+', 'g', 'go')
    expect(result).toContain('regexp.MustCompile')
    expect(result).toContain('`\\d+`')
  })

  it('exports Rust format', () => {
    const result = exportRegex('\\d+', 'g', 'rust')
    expect(result).toContain('regex::Regex::new')
    expect(result).toContain('unwrap()')
  })

  it('exports Rust format with flags string', () => {
    const result = exportRegex('\\d+', 'gi', 'rust')
    expect(result).toContain('regex::Regex::new')
    expect(result).toContain('r"\\\\d+"')
    expect(result).toContain('unwrap()')
  })

  it('exports PHP format', () => {
    const result = exportRegex('\\d+', 'gi', 'php')
    expect(result).toBe('$pattern = \'/\\d+/gi\';')
  })

  it('exports grep format', () => {
    const result = exportRegex('\\d+', 'g', 'grep')
    expect(result).toContain('grep')
    expect(result).toContain('-E')
    expect(result).toContain('"\\d+"')
  })

  it('exports grep with case-insensitive flag', () => {
    const result = exportRegex('test', 'gi', 'grep')
    expect(result).toContain('-i')
  })

  it('exports grep with special characters in pattern', () => {
    const result = exportRegex('\\$\\d+\\.\\d{2}', 'g', 'grep')
    expect(result).toContain('grep')
    expect(result).toContain('-E')
    expect(result).toContain('"\\$\\d+\\.\\d{2}"')
  })

  it('returns default format for unknown language', () => {
    const result = exportRegex('test', 'g', 'unknown')
    expect(result).toBe('/test/g')
  })
})
