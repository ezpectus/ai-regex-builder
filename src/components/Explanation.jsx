import { parseRegex } from '../utils/regexParser.js'
import { Lightbulb } from 'lucide-react'

const TOKEN_COLORS = {
  literal: 'text-gray-500 dark:text-gray-400',
  charclass: 'text-purple-500 dark:text-purple-400',
  quantifier: 'text-orange-500 dark:text-orange-400',
  group: 'text-blue-500 dark:text-blue-400',
  anchor: 'text-red-500 dark:text-red-400',
  escaped: 'text-green-500 dark:text-green-400',
  alternation: 'text-pink-500 dark:text-pink-400',
  wildcard: 'text-yellow-500 dark:text-yellow-400',
  error: 'text-red-600 dark:text-red-500',
}

export default function Explanation({ pattern }) {
  if (!pattern) return null

  const tokens = parseRegex(pattern)

  if (tokens.length === 0) return null

  return (
    <div className="animate-fade-in">
      <label className="section-title flex items-center gap-2">
        <Lightbulb size={14} />
        Explanation
      </label>
      <div className="surface p-4 space-y-2">
        {tokens.map((token, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <code className={`font-mono px-2 py-0.5 rounded bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border whitespace-nowrap shrink-0 ${TOKEN_COLORS[token.type] || 'text-accent dark:text-accent'}`}>
              {token.token}
            </code>
            <span className="text-light-text dark:text-dark-text">{token.description}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
