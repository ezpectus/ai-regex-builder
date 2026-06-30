import { buildHighlightedSegments } from '../utils/regexTester.js'
import { Copy, SearchX, CheckCircle2 } from 'lucide-react'

export default function MatchResults({ matches, testText, onCopyMatch }) {
  if (!testText) return null

  const segments = buildHighlightedSegments(testText, matches)
  const count = matches.length

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <label className="section-title mb-0">
          Results
        </label>
        {count > 0 && (
          <span className="match-badge bg-accent/10 text-accent dark:text-accent">
            <CheckCircle2 size={12} />
            {count} {count === 1 ? 'match' : 'matches'}
          </span>
        )}
      </div>

      {count === 0 ? (
        <div className="empty-state surface p-6">
          <SearchX size={32} className="text-light-muted dark:text-dark-muted mb-2" />
          <p className="text-sm text-light-muted dark:text-dark-muted">
            No matches found
          </p>
          <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
            Try adjusting your regex or flags
          </p>
        </div>
      ) : (
        <>
          {/* Highlighted text */}
          <div className="surface p-4 mb-3">
            <pre className="font-mono text-sm whitespace-pre-wrap break-words leading-relaxed">
              {segments.map((seg, i) =>
                seg.isMatch ? (
                  <span
                    key={i}
                    className="match-highlight cursor-pointer"
                    title={`Match ${seg.matchIndex + 1} — click to copy`}
                    onClick={() => onCopyMatch(seg.text)}
                  >
                    {seg.text}
                  </span>
                ) : (
                  <span key={i}>{seg.text}</span>
                ),
              )}
            </pre>
          </div>

          {/* Match list */}
          <div className="space-y-2">
            {matches.map((m, i) => (
              <div
                key={i}
                className="surface surface-hover p-3 flex items-center gap-3 cursor-pointer group"
                onClick={() => onCopyMatch(m.value)}
              >
                <span className="match-badge bg-light-bg dark:bg-dark-bg text-light-muted dark:text-dark-muted shrink-0">
                  #{i + 1}
                </span>
                <code className="font-mono text-sm flex-1 break-all text-accent dark:text-accent">
                  {m.value || '(empty match)'}
                </code>
                <span className="text-xs text-light-muted dark:text-dark-muted font-mono shrink-0">
                  {m.index}-{m.end}
                </span>
                {m.groups.length > 0 && (
                  <span className="text-xs text-light-muted dark:text-dark-muted shrink-0">
                    {m.groups.length} group{m.groups.length > 1 ? 's' : ''}
                  </span>
                )}
                <Copy size={14} className="text-light-muted dark:text-dark-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            ))}
          </div>

          {/* Group details */}
          {matches.some((m) => m.groups.length > 0) && (
            <div className="mt-3 surface p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-2">
                Capture Groups
              </p>
              <div className="space-y-2">
                {matches.map((m, i) =>
                  m.groups.length > 0 ? (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-light-muted dark:text-dark-muted shrink-0">Match {i + 1}:</span>
                      {m.groups.map((g, gi) => (
                        <code key={gi} className="font-mono text-xs px-2 py-0.5 rounded bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border">
                          ${gi + 1}: {g || '(undefined)'}
                        </code>
                      ))}
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
