import { X, ArrowRight, Check, Copy } from 'lucide-react'
import { safeCopy } from '../utils/safeClipboard.js'

export default function OptimizeResult({ result, onApply, onClose, onToast }) {
  if (!result) return null

  const handleCopy = async () => {
    const ok = await safeCopy(result.optimized)
    if (ok) {
      onToast({ message: 'Optimized regex copied!', type: 'success' })
    } else {
      onToast({ message: 'Copy failed — please copy manually.', type: 'error' })
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="surface w-full max-w-lg mx-4 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Optimization Result</h2>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {result.error ? (
          <p className="text-sm text-red-500">{result.error}</p>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4 p-3 surface">
              <code className="font-mono text-sm text-light-muted dark:text-dark-muted line-through flex-1 break-all">
                {result.original}
              </code>
              <ArrowRight size={18} className="text-accent shrink-0" />
              <code className="font-mono text-sm text-accent dark:text-accent flex-1 break-all">
                {result.optimized}
              </code>
            </div>

            {result.changes && (
              <div className="surface p-3 mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-1">
                  Changes
                </p>
                <p className="text-sm">{result.changes}</p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button onClick={handleCopy} className="btn">
                <Copy size={16} />
                Copy
              </button>
              <button onClick={onApply} className="btn btn-primary">
                <Check size={16} />
                Apply
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
