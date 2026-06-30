import { useState } from 'react'
import { X, Copy, Check } from 'lucide-react'
import { exportRegex, EXPORT_LANGUAGES } from '../utils/exporters.js'
import { TOAST_DURATION_MS } from '../utils/constants.js'
import { safeCopy } from '../utils/safeClipboard.js'

export default function ExportModal({ pattern, flagsString, onClose, onToast }) {
  const [selected, setSelected] = useState('javascript')
  const [copied, setCopied] = useState(false)

  const code = exportRegex(pattern, flagsString, selected)

  const handleCopy = async () => {
    const ok = await safeCopy(code)
    if (ok) {
      setCopied(true)
      onToast({ message: 'Export code copied!', type: 'success' })
    } else {
      onToast({ message: 'Copy failed — please copy manually.', type: 'error' })
    }
    setTimeout(() => setCopied(false), TOAST_DURATION_MS)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="surface w-full max-w-2xl mx-4 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Export Regex</h2>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {EXPORT_LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelected(lang.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                selected === lang.id
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-light-border dark:border-dark-border hover:bg-light-bg dark:hover:bg-dark-bg'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <pre className="surface p-4 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all">
            {code}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 btn-icon"
            title="Copy"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>

        <div className="mt-4 text-xs text-light-muted dark:text-dark-muted">
          <kbd className="font-mono px-1.5 py-0.5 rounded surface">Esc</kbd> to close
        </div>
      </div>
    </div>
  )
}
