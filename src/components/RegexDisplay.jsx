import { useState, useRef, useEffect } from 'react'
import { Copy, FileDown, Wand2, Lightbulb, ChevronDown } from 'lucide-react'

export default function RegexDisplay({
  pattern,
  flagsString,
  regexError,
  onCopy,
  onExplain,
  onOptimize,
  onExport,
  isOptimizing,
}) {
  const [copyMenuOpen, setCopyMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!copyMenuOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setCopyMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [copyMenuOpen])

  if (!pattern && !regexError) return null

  const copyOptions = [
    { label: 'Copy regex (pattern only)', value: 'pattern' },
    { label: 'Copy with flags (/pattern/flags)', value: 'withflags' },
    { label: 'Copy as string ("pattern")', value: 'string' },
    { label: 'Copy as RegExp object', value: 'regexp' },
    { label: 'Copy all matches', value: 'matches' },
  ]

  const handleCopy = (type) => {
    onCopy(type)
    setCopyMenuOpen(false)
  }

  return (
    <div className="animate-fade-in">
      <label className="section-title">Generated Regex</label>

      {regexError ? (
        <div className="surface p-4 border-red-500/50 text-red-500 text-sm font-mono">
          {regexError}
        </div>
      ) : (
        <>
          <div className="surface p-4 flex items-center gap-3 bg-light-bg dark:bg-dark-bg">
            <code className="font-mono text-lg flex-1 break-all text-accent dark:text-accent">
              /{pattern}/<span className="text-light-muted dark:text-dark-muted">{flagsString}</span>
            </code>
          </div>

          <div className="flex items-center gap-2 mt-3 flex-wrap relative">
            {/* Copy dropdown */}
            <div className="relative" ref={menuRef}>
              <button onClick={() => setCopyMenuOpen(!copyMenuOpen)} className="btn">
                <Copy size={16} />
                Copy
                <ChevronDown size={14} className={`transition-transform ${copyMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {copyMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 surface shadow-xl z-20 animate-fade-in">
                  {copyOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleCopy(opt.value)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-light-bg dark:hover:bg-dark-bg transition-colors border-b border-light-border dark:border-dark-border last:border-0"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={onExplain} className="btn">
              <Lightbulb size={16} />
              Explain
            </button>

            <button onClick={onOptimize} disabled={isOptimizing} className="btn">
              <Wand2 size={16} className={isOptimizing ? 'animate-pulse-loading' : ''} />
              {isOptimizing ? 'Optimizing...' : 'Optimize'}
            </button>

            <button onClick={onExport} className="btn">
              <FileDown size={16} />
              Export
            </button>
          </div>
        </>
      )}
    </div>
  )
}
