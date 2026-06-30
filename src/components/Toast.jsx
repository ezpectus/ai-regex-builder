import { useEffect } from 'react'
import { Check, X, AlertCircle, AlertTriangle } from 'lucide-react'
import { TOAST_DURATION_MS } from '../utils/constants.js'

const TOAST_STYLES = {
  success: { icon: Check, color: 'text-green-500' },
  error: { icon: AlertCircle, color: 'text-red-500' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500' },
}

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(onClose, TOAST_DURATION_MS)
      return () => clearTimeout(timer)
    }
  }, [toast, onClose])

  if (!toast) return null

  const message = typeof toast === 'string' ? toast : toast.message
  const type = typeof toast === 'string' ? 'success' : (toast.type || 'success')
  const { icon: Icon, color } = TOAST_STYLES[type] || TOAST_STYLES.success

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in max-w-sm">
      <div className="surface flex items-center gap-3 px-4 py-3 shadow-lg">
        <Icon size={18} className={color} />
        <span className="text-sm flex-1 break-words">{message}</span>
        <button onClick={onClose} className="btn-icon ml-2 shrink-0">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
