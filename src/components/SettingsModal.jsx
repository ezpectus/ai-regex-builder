import { useState } from 'react'
import { X, Key, Cpu, ExternalLink, Sparkles } from 'lucide-react'

export default function SettingsModal({ settings, onUpdate, onClose, onToast }) {
  const [local, setLocal] = useState(settings)

  const handleSave = () => {
    onUpdate(local)
    onToast({ message: 'Settings saved!', type: 'success' })
    onClose()
  }

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
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Provider selection */}
        <div className="mb-4">
          <label className="section-title">AI Provider</label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setLocal({ ...local, provider: 'openai', model: 'gpt-4o-mini' })}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-2 ${
                local.provider === 'openai'
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-light-border dark:border-dark-border'
              }`}
            >
              <Key size={16} />
              OpenAI
            </button>
            <button
              onClick={() => setLocal({ ...local, provider: 'gemini', model: 'gemini-1.5-flash' })}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-2 ${
                local.provider === 'gemini'
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-light-border dark:border-dark-border'
              }`}
            >
              <Sparkles size={16} />
              Gemini
            </button>
            <button
              onClick={() => setLocal({ ...local, provider: 'ollama', model: 'llama3' })}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-2 ${
                local.provider === 'ollama'
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-light-border dark:border-dark-border'
              }`}
            >
              <Cpu size={16} />
              Ollama
            </button>
          </div>
        </div>

        {local.provider === 'openai' ? (
          <>
            <div className="mb-4">
              <label className="section-title">OpenAI API Key</label>
              <input
                type="password"
                value={local.apiKey}
                onChange={(e) => setLocal({ ...local, apiKey: e.target.value })}
                placeholder="sk-..."
                className="input-field font-mono text-sm"
              />
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent dark:text-accent mt-1 inline-flex items-center gap-1 hover:underline"
              >
                Get your API key <ExternalLink size={12} />
              </a>
              <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                Stored locally in your browser. Never sent anywhere except OpenAI.
              </p>
            </div>
            <div className="mb-4">
              <label className="section-title">Model</label>
              <select
                value={local.model}
                onChange={(e) => setLocal({ ...local, model: e.target.value })}
                className="input-field text-sm"
              >
                <option value="gpt-4o-mini">gpt-4o-mini (fast, cheap)</option>
                <option value="gpt-4o">gpt-4o (best quality)</option>
                <option value="gpt-3.5-turbo">gpt-3.5-turbo (legacy)</option>
              </select>
            </div>
          </>
        ) : local.provider === 'gemini' ? (
          <>
            <div className="mb-4">
              <label className="section-title">Google AI API Key</label>
              <input
                type="password"
                value={local.geminiApiKey}
                onChange={(e) => setLocal({ ...local, geminiApiKey: e.target.value })}
                placeholder="AIza..."
                className="input-field font-mono text-sm"
              />
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-accent dark:text-accent mt-1 inline-flex items-center gap-1 hover:underline"
              >
                Get your API key <ExternalLink size={12} />
              </a>
              <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                Stored locally in your browser. Never sent anywhere except Google.
              </p>
            </div>
            <div className="mb-4">
              <label className="section-title">Model</label>
              <select
                value={local.model}
                onChange={(e) => setLocal({ ...local, model: e.target.value })}
                className="input-field text-sm"
              >
                <option value="gemini-1.5-flash">gemini-1.5-flash (fast, free tier)</option>
                <option value="gemini-1.5-pro">gemini-1.5-pro (best quality)</option>
                <option value="gemini-2.0-flash">gemini-2.0-flash (latest fast)</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label className="section-title">Ollama URL</label>
              <input
                type="text"
                value={local.ollamaUrl}
                onChange={(e) => setLocal({ ...local, ollamaUrl: e.target.value })}
                placeholder="http://localhost:11434"
                className="input-field font-mono text-sm"
              />
              <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                Make sure Ollama is running. Install at{' '}
                <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-accent dark:text-accent hover:underline">
                  ollama.ai
                </a>
              </p>
            </div>
            <div className="mb-4">
              <label className="section-title">Model</label>
              <input
                type="text"
                value={local.model}
                onChange={(e) => setLocal({ ...local, model: e.target.value })}
                placeholder="llama3"
                className="input-field font-mono text-sm"
              />
              <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                Run <code className="font-mono">ollama pull llama3</code> to download the model.
              </p>
            </div>
          </>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="btn">Cancel</button>
          <button onClick={handleSave} className="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  )
}
