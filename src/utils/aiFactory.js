/**
 * AI Provider Factory — Factory Pattern
 * Creates AI provider instances with a unified interface.
 * Supports OpenAI, Gemini, and Ollama providers.
 */

import { MAX_INPUT_LENGTH, REQUEST_TIMEOUT_MS, AI_RETRY_COUNT } from './constants.js'

const SYSTEM_PROMPT = `You are a regex expert assistant. Your task is to generate a regular expression based on a natural language description.

Rules:
1. Return ONLY the regex pattern (no / delimiters, no flags)
2. Use JavaScript-compatible regex syntax
3. Be as precise as possible — avoid overly broad patterns
4. If the description is ambiguous, make reasonable assumptions
5. Do not include explanations in the pattern output

Output format (exactly these three lines):
PATTERN: <regex_here>
EXPLANATION: <one-line explanation>
FLAGS: <g|i|m|s|u|y or empty>`

const OPTIMIZE_PROMPT = `You are a regex optimization expert. Optimize the given regex for performance and readability. Return the result in this format:

OPTIMIZED: <regex_here>
CHANGES: <explain what changed and why, one line>`

const MAX_RETRIES = AI_RETRY_COUNT

/**
 * Fetch with timeout — aborts request after REQUEST_TIMEOUT_MS.
 * @param {string} url
 * @param {Object} options
 * @returns {Promise<Response>}
 */
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Format network error into user-friendly message.
 * @param {Error} err
 * @param {string} provider
 * @returns {string}
 */
function formatNetworkError(err, provider) {
  if (err.name === 'AbortError') {
    return `${provider} request timed out after ${REQUEST_TIMEOUT_MS / 1000}s. Please try again.`
  }
  if (err.message === 'Failed to fetch' || err.message.includes('NetworkError')) {
    return `Cannot connect to ${provider}. Check your network connection and try again.`
  }
  return err.message || `Unknown ${provider} error.`
}

/**
 * Parse AI response text into structured result.
 * @param {string} text - Raw AI response
 * @returns {{pattern: string, explanation: string, flags: string}}
 */
function parseAIResponse(text) {
  const lines = text.trim().split('\n')
  let pattern = ''
  let explanation = ''
  let flags = ''

  for (const line of lines) {
    const lower = line.toLowerCase()
    if (lower.startsWith('pattern:')) {
      pattern = line.slice('pattern:'.length).trim()
    } else if (lower.startsWith('explanation:')) {
      explanation = line.slice('explanation:'.length).trim()
    } else if (lower.startsWith('flags:')) {
      flags = line.slice('flags:'.length).trim()
    }
  }

  if (!pattern && text.includes('/')) {
    const match = text.match(/^\/?(.*)\/([gimsuy]*)$/m)
    if (match) {
      pattern = match[1]
      flags = match[2] || flags
    }
  }

  if (pattern.startsWith('/') && pattern.endsWith('/')) {
    pattern = pattern.slice(1, -1)
  } else if (pattern.startsWith('/') && /\/([gimsuy]*)$/.test(pattern)) {
    const m = pattern.match(/^(.+)\/([gimsuy]*)$/)
    if (m) {
      pattern = m[1]
      flags = m[2] || flags
    }
  }

  flags = flags.replace(/[^gimsuy]/g, '')
  return { pattern, explanation, flags }
}

function parseOptimizeResponse(text) {
  const lines = text.trim().split('\n')
  let optimized = ''
  let changes = ''

  for (const line of lines) {
    const lower = line.toLowerCase()
    if (lower.startsWith('optimized:')) {
      optimized = line.slice('optimized:'.length).trim()
    } else if (lower.startsWith('changes:')) {
      changes = line.slice('changes:'.length).trim()
    }
  }

  if (optimized.startsWith('/') && optimized.endsWith('/')) {
    optimized = optimized.slice(1, -1)
  }

  if (!optimized) return { error: 'AI did not return an optimized pattern.' }
  return { optimized, changes }
}

function validateRegex(pattern, flags) {
  try {
    new RegExp(pattern, flags)
    return { valid: true, error: null }
  } catch (e) {
    return { valid: false, error: e.message }
  }
}

/**
 * OpenAI Provider — implements the AIProvider interface.
 */
class OpenAIProvider {
  constructor(config) {
    this.apiKey = config.apiKey
    this.model = config.model || 'gpt-4o-mini'
  }

  async generate(prompt) {
    if (!this.apiKey) {
      return { error: 'No API key set. Open Settings to add your OpenAI API key, or switch to local AI (Ollama).' }
    }

    const trimmed = prompt.trim().slice(0, MAX_INPUT_LENGTH)
    let lastError = null

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const res = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: trimmed },
            ],
            temperature: 0,
            max_tokens: 300,
          }),
        })

        if (!res.ok) {
          let errBody = ''
          try { errBody = await res.text() } catch { errBody = 'Unknown error' }
          return { error: `OpenAI API error (${res.status}): ${errBody.slice(0, 200)}` }
        }

        let data
        try { data = await res.json() }
        catch { lastError = 'OpenAI returned invalid JSON.'; continue }

        const content = data.choices?.[0]?.message?.content || ''
        const parsed = parseAIResponse(content)

        if (!parsed.pattern) {
          lastError = 'AI did not return a valid pattern.'
          continue
        }

        const validation = validateRegex(parsed.pattern, parsed.flags)
        if (!validation.valid) {
          lastError = `Invalid regex from AI: ${validation.error}`
          continue
        }

        return parsed
      } catch (err) {
        lastError = formatNetworkError(err, 'OpenAI')
      }
    }

    return { error: lastError || 'Failed to generate regex after retry.' }
  }

  async optimize(regex, prompt) {
    if (!this.apiKey) {
      return { error: 'No API key set for optimization.' }
    }

    const userMsg = `Regex: ${regex}\nDescription: ${prompt}\n\nOptimize this regex.`

    try {
      const res = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: OPTIMIZE_PROMPT },
            { role: 'user', content: userMsg },
          ],
          temperature: 0,
          max_tokens: 300,
        }),
      })
      if (!res.ok) {
        let errBody = ''
        try { errBody = await res.text() } catch { errBody = 'Unknown error' }
        return { error: `OpenAI API error (${res.status}): ${errBody.slice(0, 200)}` }
      }
      let data
      try { data = await res.json() }
      catch { return { error: 'OpenAI returned invalid JSON.' } }
      const content = data.choices?.[0]?.message?.content || ''
      return parseOptimizeResponse(content)
    } catch (err) {
      return { error: formatNetworkError(err, 'OpenAI') }
    }
  }
}

/**
 * Gemini Provider — implements the same AIProvider interface.
 * Uses Google's Generative Language API (REST, no SDK needed).
 */
class GeminiProvider {
  constructor(config) {
    this.apiKey = config.geminiApiKey || config.apiKey
    this.model = config.model || 'gemini-1.5-flash'
  }

  async generate(prompt) {
    if (!this.apiKey) {
      return { error: 'No Gemini API key set. Open Settings to add your Google AI API key, or switch to another provider.' }
    }

    const trimmed = prompt.trim().slice(0, MAX_INPUT_LENGTH)
    let lastError = null

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`
        const res = await fetchWithTimeout(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${trimmed}` }] },
            ],
            generationConfig: { temperature: 0, maxOutputTokens: 300 },
          }),
        })

        if (!res.ok) {
          let errBody = ''
          try { errBody = await res.text() } catch { errBody = 'Unknown error' }
          return { error: `Gemini API error (${res.status}): ${errBody.slice(0, 200)}` }
        }

        let data
        try { data = await res.json() }
        catch { lastError = 'Gemini returned invalid JSON.'; continue }

        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
        const parsed = parseAIResponse(content)

        if (!parsed.pattern) {
          lastError = 'AI did not return a valid pattern.'
          continue
        }

        const validation = validateRegex(parsed.pattern, parsed.flags)
        if (!validation.valid) {
          lastError = `Invalid regex from AI: ${validation.error}`
          continue
        }

        return parsed
      } catch (err) {
        lastError = formatNetworkError(err, 'Gemini')
      }
    }

    return { error: lastError || 'Failed to generate regex with Gemini.' }
  }

  async optimize(regex, prompt) {
    if (!this.apiKey) {
      return { error: 'No Gemini API key set for optimization.' }
    }

    const userMsg = `Regex: ${regex}\nDescription: ${prompt}\n\nOptimize this regex.`

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`
      const res = await fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `${OPTIMIZE_PROMPT}\n\n${userMsg}` }] },
          ],
          generationConfig: { temperature: 0, maxOutputTokens: 300 },
        }),
      })
      if (!res.ok) {
        let errBody = ''
        try { errBody = await res.text() } catch { errBody = 'Unknown error' }
        return { error: `Gemini API error (${res.status}): ${errBody.slice(0, 200)}` }
      }
      let data
      try { data = await res.json() }
      catch { return { error: 'Gemini returned invalid JSON.' } }
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      return parseOptimizeResponse(content)
    } catch (err) {
      return { error: formatNetworkError(err, 'Gemini') }
    }
  }
}

/**
 * Ollama Provider — implements the same AIProvider interface.
 */
class OllamaProvider {
  constructor(config) {
    this.url = config.ollamaUrl || 'http://localhost:11434'
    this.model = config.model || 'llama3'
  }

  async generate(prompt) {
    const trimmed = prompt.trim().slice(0, MAX_INPUT_LENGTH)
    let lastError = null

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const res = await fetchWithTimeout(`${this.url}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: this.model,
            prompt: `${SYSTEM_PROMPT}\n\nUser: ${trimmed}`,
            stream: false,
            options: { temperature: 0 },
          }),
        })

        if (!res.ok) {
          return { error: `Ollama error (${res.status}). Is Ollama running at ${this.url}?` }
        }

        let data
        try { data = await res.json() }
        catch { lastError = 'Ollama returned invalid JSON.'; continue }

        const content = data.response || ''
        const parsed = parseAIResponse(content)

        if (!parsed.pattern) continue

        const validation = validateRegex(parsed.pattern, parsed.flags)
        if (!validation.valid) continue

        return parsed
      } catch (err) {
        lastError = formatNetworkError(err, 'Ollama')
        if (err.name === 'AbortError') break
      }
    }

    return { error: lastError || 'Failed to generate regex with Ollama.' }
  }

  async optimize(regex, prompt) {
    const userMsg = `Regex: ${regex}\nDescription: ${prompt}\n\nOptimize this regex.`

    try {
      const res = await fetchWithTimeout(`${this.url}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt: `${OPTIMIZE_PROMPT}\n\n${userMsg}`,
          stream: false,
        }),
      })
      if (!res.ok) {
        return { error: `Ollama error (${res.status}). Is Ollama running at ${this.url}?` }
      }
      let data
      try { data = await res.json() }
      catch { return { error: 'Ollama returned invalid JSON.' } }
      return parseOptimizeResponse(data.response || '')
    } catch (err) {
      return { error: formatNetworkError(err, 'Ollama') }
    }
  }
}

/**
 * Factory — creates the appropriate AI provider based on config.
 * @param {Object} config - Provider configuration
 * @param {string} config.provider - 'openai', 'gemini', or 'ollama'
 * @returns {OpenAIProvider|GeminiProvider|OllamaProvider}
 */
export function createAIProvider(config) {
  switch (config.provider) {
    case 'ollama':
      return new OllamaProvider(config)
    case 'gemini':
      return new GeminiProvider(config)
    case 'openai':
    default:
      return new OpenAIProvider(config)
  }
}

export { parseAIResponse, parseOptimizeResponse, validateRegex }
