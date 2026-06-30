import { useState, useEffect, useCallback, useRef } from 'react'
import { Github, Sun, Moon, Settings, BookOpen, Sparkles, HelpCircle, WifiOff } from 'lucide-react'

import PromptInput from './components/PromptInput.jsx'
import RegexDisplay from './components/RegexDisplay.jsx'
import Explanation from './components/Explanation.jsx'
import TestArea from './components/TestArea.jsx'
import MatchResults from './components/MatchResults.jsx'
import Flags from './components/Flags.jsx'
import History from './components/History.jsx'
import ExportModal from './components/ExportModal.jsx'
import CheatSheet from './components/CheatSheet.jsx'
import SettingsModal from './components/SettingsModal.jsx'
import OptimizeResult from './components/OptimizeResult.jsx'
import HelpModal from './components/HelpModal.jsx'
import Toast from './components/Toast.jsx'

import { useRegex } from './hooks/useRegex.js'
import { useHistory } from './hooks/useHistory.js'
import { useApiKey } from './hooks/useApiKey.js'
import { useTheme } from './hooks/useTheme.js'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.js'

import { generateRegex, optimizeRegex } from './utils/ai.js'
import { DEFAULT_TEST_TEXT } from './utils/constants.js'
import { CopyCommand, CopyMatchCommand } from './utils/copyCommands.js'

export default function App() {
  const regex = useRegex()
  const { history, addEntry, removeEntry, clearHistory } = useHistory()
  const { settings, updateSettings } = useApiKey()
  const { theme, toggleTheme } = useTheme()

  const [showExport, setShowExport] = useState(false)
  const [showCheatSheet, setShowCheatSheet] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [optimizeResult, setOptimizeResult] = useState(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [toast, setToast] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const promptRef = useRef(null)

  // Initialize test text on mount
  useEffect(() => {
    regex.setTestText(DEFAULT_TEST_TEXT)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleGenerate = useCallback(async (promptOverride) => {
    const promptText = promptOverride ?? regex.prompt
    if (!promptText.trim()) {
      setToast({ message: 'Please describe what you want to match.', type: 'warning' })
      return
    }

    regex.setIsGenerating(true)
    regex.setExplanation('')

    try {
      const result = await generateRegex(promptText, settings)

      regex.setIsGenerating(false)

      if (result.error) {
        regex.setPattern('')
        setToast({ message: result.error, type: 'error' })
        return
      }

      regex.setPattern(result.pattern)
      if (result.flags) {
        regex.setFlagsFromString(result.flags)
      }
      if (result.explanation) {
        regex.setExplanation(result.explanation)
      }

      addEntry({
        prompt: promptText,
        pattern: result.pattern,
        flags: result.flags || regex.flagsString,
      })

      setShowExplanation(true)
    } catch (err) {
      regex.setIsGenerating(false)
      setToast({ message: `Unexpected error: ${err.message}`, type: 'error' })
    }
  }, [regex, settings, addEntry])

  const handleCopy = useCallback(async (type) => {
    const cmd = new CopyCommand(type, regex.pattern, regex.flagsString, regex.matches)
    const msg = await cmd.execute()
    setToast(msg)
  }, [regex.pattern, regex.flagsString, regex.matches])

  const handleCopyMatch = useCallback(async (value) => {
    const cmd = new CopyMatchCommand(value)
    const msg = await cmd.execute()
    setToast(msg)
  }, [])

  const handleExampleSelect = useCallback((prompt) => {
    regex.setPrompt(prompt)
    handleGenerate(prompt)
  }, [regex, handleGenerate])

  const handleHistorySelect = useCallback((entry) => {
    regex.setPrompt(entry.prompt)
    regex.setPattern(entry.pattern)
    if (entry.flags) {
      regex.setFlagsFromString(entry.flags)
    }
  }, [regex])

  const handleExplain = useCallback(() => {
    setShowExplanation((prev) => !prev)
  }, [])

  const handleOptimize = useCallback(async () => {
    if (!regex.pattern) return
    setIsOptimizing(true)
    try {
      const result = await optimizeRegex(regex.pattern, regex.prompt, settings)
      setIsOptimizing(false)
      if (result.error) {
        setToast({ message: result.error, type: 'error' })
        return
      }
      setOptimizeResult({ ...result, original: regex.pattern })
    } catch (err) {
      setIsOptimizing(false)
      setToast({ message: `Optimization failed: ${err.message}`, type: 'error' })
    }
  }, [regex.pattern, regex.prompt, settings])

  const handleApplyOptimize = useCallback(() => {
    if (optimizeResult?.optimized) {
      regex.setPattern(optimizeResult.optimized)
      setToast({ message: 'Optimized regex applied!', type: 'success' })
    }
    setOptimizeResult(null)
  }, [optimizeResult, regex])

  const handleCheatSheetInsert = useCallback((token) => {
    regex.setPattern((prev) => prev + token)
  }, [regex])

  const closeAllModals = useCallback(() => {
    setShowExport(false)
    setShowCheatSheet(false)
    setShowSettings(false)
    setShowHelp(false)
    setOptimizeResult(null)
  }, [])

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onGenerate: handleGenerate,
    onFocusPrompt: () => {
      if (promptRef.current) promptRef.current.focus()
    },
    onCopyRegex: () => regex.pattern && handleCopy('pattern'),
    onExport: () => regex.pattern && setShowExport(true),
    onCloseModal: closeAllModals,
    onHelp: () => setShowHelp(true),
  })

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
      {/* Offline banner */}
      {!isOnline && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/30 text-yellow-600 dark:text-yellow-500 text-sm px-4 py-2 flex items-center gap-2 justify-center">
          <WifiOff size={14} />
          You are offline. AI features require internet — regex testing still works.
        </div>
      )}
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-light-bg/80 dark:bg-dark-bg/80 border-b border-light-border dark:border-dark-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
              <Sparkles size={20} className="text-accent dark:text-accent" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">AI Regex Builder</h1>
              <p className="text-[10px] text-light-muted dark:text-dark-muted -mt-0.5">Generate regex from natural language</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowHelp(true)}
              className="btn-icon"
              title="Keyboard Shortcuts (?)"
            >
              <HelpCircle size={18} />
            </button>
            <button
              onClick={() => setShowCheatSheet(true)}
              className="btn-icon"
              title="Cheat Sheet"
            >
              <BookOpen size={18} />
            </button>
            <button
              onClick={toggleTheme}
              className="btn-icon"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="btn-icon"
              title="Settings"
            >
              <Settings size={18} />
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-icon"
              title="GitHub"
            >
              <Github size={18} />
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Top row: Prompt input full width */}
        <section className="surface p-5 mb-6">
          <PromptInput
            ref={promptRef}
            prompt={regex.prompt}
            setPrompt={regex.setPrompt}
            onGenerate={handleGenerate}
            onClear={regex.clearAll}
            isGenerating={regex.isGenerating}
            onExampleSelect={handleExampleSelect}
          />
        </section>

        {/* Two-column layout: left = regex/flags/explanation, right = test/results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Regex display + flags */}
            {(regex.pattern || regex.regexError) && (
              <section className="surface p-5 space-y-4">
                <RegexDisplay
                  pattern={regex.pattern}
                  flagsString={regex.flagsString}
                  regexError={regex.regexError}
                  onCopy={handleCopy}
                  onExplain={handleExplain}
                  onOptimize={handleOptimize}
                  onExport={() => setShowExport(true)}
                  isOptimizing={isOptimizing}
                />
                <Flags flags={regex.flags} onToggle={regex.toggleFlag} />
              </section>
            )}

            {/* Explanation */}
            {showExplanation && regex.pattern && (
              <section className="surface p-5">
                <Explanation pattern={regex.pattern} />
                {regex.explanation && (
                  <p className="text-sm text-light-muted dark:text-dark-muted mt-3 italic">
                    {regex.explanation}
                  </p>
                )}
              </section>
            )}

            {/* History */}
            <section className="surface p-5">
              <History
                history={history}
                onSelect={handleHistorySelect}
                onClear={clearHistory}
                onRemove={removeEntry}
              />
            </section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Test area + results */}
            <section className="surface p-5 space-y-4">
              <TestArea testText={regex.testText} setTestText={regex.setTestText} />
              <MatchResults
                matches={regex.matches}
                testText={regex.testText}
                onCopyMatch={handleCopyMatch}
              />
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-light-muted dark:text-dark-muted py-8 mt-4">
          <p>
            AI Regex Builder — Generate regex from natural language.
            Your API key is stored locally and never sent to any server except your chosen AI provider.
          </p>
        </footer>
      </main>

      {/* Modals */}
      {showExport && (
        <ExportModal
          pattern={regex.pattern}
          flagsString={regex.flagsString}
          onClose={() => setShowExport(false)}
          onToast={setToast}
        />
      )}

      {showCheatSheet && (
        <CheatSheet
          onClose={() => setShowCheatSheet(false)}
          onInsert={handleCheatSheetInsert}
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdate={updateSettings}
          onClose={() => setShowSettings(false)}
          onToast={setToast}
        />
      )}

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {optimizeResult && (
        <OptimizeResult
          result={optimizeResult}
          onApply={handleApplyOptimize}
          onClose={() => setOptimizeResult(null)}
          onToast={setToast}
        />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
