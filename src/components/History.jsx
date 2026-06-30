import { History as HistoryIcon, Trash2, RotateCcw } from 'lucide-react'

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function History({ history, onSelect, onClear, onRemove }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="section-title flex items-center gap-2 mb-0">
          <HistoryIcon size={14} />
          History
        </label>
        {history.length > 0 && (
          <button onClick={onClear} className="btn-icon text-light-muted dark:text-dark-muted" title="Clear history">
            <Trash2 size={14} />
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="text-sm text-light-muted dark:text-dark-muted py-2">
          No history yet. Generate a regex to get started.
        </p>
      ) : (
        <div className="space-y-1.5">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="surface p-2.5 flex items-center gap-2 hover:border-accent/50 transition-colors group cursor-pointer"
              onClick={() => onSelect(entry)}
            >
              <RotateCcw size={14} className="text-light-muted dark:text-dark-muted shrink-0" />
              <span className="text-sm flex-1 truncate">{entry.prompt}</span>
              <span className="text-xs text-light-muted dark:text-dark-muted shrink-0">{timeAgo(entry.timestamp)}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(entry.id)
                }}
                className="opacity-0 group-hover:opacity-100 text-light-muted hover:text-red-500 transition-all shrink-0"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
