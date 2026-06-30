export default function TestArea({ testText, setTestText }) {
  return (
    <div>
      <label className="section-title">Test Data</label>
      <textarea
        value={testText}
        onChange={(e) => setTestText(e.target.value)}
        placeholder="Paste your text here to test the regex..."
        rows={6}
        className="input-field font-mono text-sm resize-y"
      />
      <p className="text-xs text-light-muted dark:text-dark-muted mt-2">
        Matches update automatically as you type.
      </p>
    </div>
  )
}
