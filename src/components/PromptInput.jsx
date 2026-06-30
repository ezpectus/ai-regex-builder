import { forwardRef } from 'react'
import { Sparkles, Trash2 } from 'lucide-react'
import Examples from './Examples.jsx'
import { MAX_INPUT_LENGTH } from '../utils/constants.js'

const PromptInput = forwardRef(function PromptInput({
  prompt,
  setPrompt,
  onGenerate,
  onClear,
  isGenerating,
  onExampleSelect,
}, ref) {
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      onGenerate()
    }
  }

  return (
    <div>
      <label className="section-title">Describe what you want to match (in English)</label>
      <textarea
        ref={ref}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="extract all email addresses from text"
        rows={3}
        className="input-field font-mono text-sm resize-none"
        maxLength={MAX_INPUT_LENGTH}
      />
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="btn btn-primary"
        >
          <Sparkles size={16} className={isGenerating ? 'animate-pulse-loading' : ''} />
          {isGenerating ? <span className="animate-pulse">Generating...</span> : 'Generate Regex'}
        </button>

        <Examples onSelect={onExampleSelect} />

        <button onClick={onClear} className="btn">
          <Trash2 size={16} />
          Clear
        </button>

        <span className="text-xs text-light-muted dark:text-dark-muted ml-auto">
          <kbd className="font-mono px-1.5 py-0.5 rounded surface text-[10px]">Ctrl+Enter</kbd> to generate
        </span>
      </div>
    </div>
  )
})

export default PromptInput
