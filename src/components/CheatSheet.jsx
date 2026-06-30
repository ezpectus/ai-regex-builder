import { X } from 'lucide-react'
import { CHEAT_SHEET } from '../utils/constants.js'

export default function CheatSheet({ onClose, onInsert }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="surface w-full max-w-lg mx-4 p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Regex Cheat Sheet</h2>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-light-muted dark:text-dark-muted mb-3">
          Click any token to insert it into the regex field.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CHEAT_SHEET.map((item, i) => (
            <button
              key={i}
              onClick={() => onInsert?.(item.token)}
              className="flex items-center gap-3 p-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border hover:border-accent/50 transition-colors text-left"
            >
              <code className="font-mono text-sm font-bold text-accent dark:text-accent w-20 shrink-0">
                {item.token}
              </code>
              <span className="text-sm text-light-text dark:text-dark-text">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
