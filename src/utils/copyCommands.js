/**
 * Copy commands — Command Pattern.
 * Each copy operation is encapsulated as a command object with execute() and getDescription().
 * This makes copy operations testable, undoable, and extensible.
 */

import { safeCopy } from './safeClipboard.js'

export class CopyCommand {
  constructor(type, pattern, flagsString, matches) {
    this.type = type
    this.pattern = pattern
    this.flagsString = flagsString
    this.matches = matches
  }

  async execute() {
    const text = this._buildText()
    const ok = await safeCopy(text)
    if (!ok) return 'Copy failed — please copy manually.'
    return this._getDescription()
  }

  _buildText() {
    switch (this.type) {
      case 'pattern':
        return this.pattern
      case 'withflags':
        return `/${this.pattern}/${this.flagsString}`
      case 'string':
        return `"${this.pattern}"`
      case 'regexp':
        return `new RegExp("${this.pattern}", "${this.flagsString}")`
      case 'matches':
        return this.matches.map((m) => m.value).join('\n')
      default:
        return ''
    }
  }

  _getDescription() {
    const descriptions = {
      pattern: 'Regex copied!',
      withflags: 'Regex with flags copied!',
      string: 'Regex as string copied!',
      regexp: 'RegExp object copied!',
      matches: 'Matches copied!',
    }
    return descriptions[this.type] || 'Copied!'
  }
}

export class CopyMatchCommand {
  constructor(value) {
    this.value = value
  }

  async execute() {
    const ok = await safeCopy(this.value)
    if (!ok) return 'Copy failed — please copy manually.'
    return 'Match copied!'
  }
}

export class CopyExportCommand {
  constructor(code, language) {
    this.code = code
    this.language = language
  }

  async execute() {
    const ok = await safeCopy(this.code)
    if (!ok) return 'Copy failed — please copy manually.'
    return `${this.language} code copied!`
  }
}
