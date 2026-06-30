import { useState, useRef, useEffect } from 'react'
import { ChevronDown, BookOpen } from 'lucide-react'
import { EXAMPLES } from '../utils/constants.js'

export default function Examples({ onSelect }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="btn">
        <BookOpen size={16} />
        Examples
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-64 surface shadow-xl z-20 max-h-80 overflow-y-auto animate-fade-in">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => {
                onSelect(ex.prompt)
                setOpen(false)
              }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-light-bg dark:hover:bg-dark-bg transition-colors border-b border-light-border dark:border-dark-border last:border-0"
            >
              {ex.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
