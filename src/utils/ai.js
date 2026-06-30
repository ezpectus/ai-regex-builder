/**
 * AI service — thin wrapper around the AI provider factory.
 * Delegates to the factory-created provider (OpenAI, Gemini, or Ollama).
 */
import { createAIProvider } from './aiFactory.js'

/**
 * Generate a regex from a natural language prompt.
 * @param {string} prompt - User's description
 * @param {Object} config - AI provider config
 * @returns {Promise<{pattern?: string, explanation?: string, flags?: string, error?: string}>}
 */
export async function generateRegex(prompt, config) {
  if (!prompt || !prompt.trim()) {
    return { error: 'Please describe what you want to match.' }
  }

  const provider = createAIProvider(config)
  return provider.generate(prompt)
}

/**
 * Optimize an existing regex using AI.
 * @param {string} regex - Current regex pattern
 * @param {string} prompt - Original user description
 * @param {Object} config - AI provider config
 * @returns {Promise<{optimized?: string, changes?: string, error?: string}>}
 */
export async function optimizeRegex(regex, prompt, config) {
  if (!regex) {
    return { error: 'No regex to optimize.' }
  }

  const provider = createAIProvider(config)
  return provider.optimize(regex, prompt)
}

// Re-export factory utilities for testing
export { createAIProvider, parseAIResponse, parseOptimizeResponse, validateRegex } from './aiFactory.js'
