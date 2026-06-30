import { FLAGS } from '../utils/constants.js'

export default function Flags({ flags, onToggle }) {
  return (
    <div>
      <label className="section-title">Flags</label>
      <div className="flex flex-wrap gap-2">
        {FLAGS.map((flag) => {
          const checked = flags[flag.key]
          return (
            <label
              key={flag.key}
              className={`checkbox-label ${checked ? 'checkbox-label-checked' : ''}`}
              title={flag.description}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(flag.key)}
                className="sr-only"
              />
              <span className="font-mono font-bold text-xs w-4 text-center">{flag.key}</span>
              <span>{flag.label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
