import { X, Keyboard } from 'lucide-react'

const SHORTCUTS = [
  { keys: ['Ctrl', 'Enter'], action: 'Generate regex from prompt' },
  { keys: ['Ctrl', 'K'], action: 'Focus prompt input' },
  { keys: ['Ctrl', 'Shift', 'C'], action: 'Copy regex pattern' },
  { keys: ['Ctrl', 'Shift', 'E'], action: 'Open export modal' },
  { keys: ['Esc'], action: 'Close any open modal' },
  { keys: ['?'], action: 'Open this help dialog' },
]

export default function HelpModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="surface w-full max-w-md mx-4 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Keyboard size={20} />
            Keyboard Shortcuts
          </h2>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {SHORTCUTS.map((sc, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm">{sc.action}</span>
              <div className="flex items-center gap-1">
                {sc.keys.map((key, ki) => (
                  <span key={ki}>
                    {ki > 0 && <span className="text-light-muted dark:text-dark-muted text-xs mx-0.5">+</span>}
                    <kbd className="font-mono px-2 py-1 rounded surface text-xs border border-light-border dark:border-dark-border">
                      {key}
                    </kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-xs text-light-muted dark:text-dark-muted">
          <kbd className="font-mono px-1.5 py-0.5 rounded surface">Esc</kbd> to close
        </div>
      </div>
    </div>
  )
}
