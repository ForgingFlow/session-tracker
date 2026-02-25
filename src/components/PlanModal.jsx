import { useState, useEffect, useRef } from 'react'

// Returns tomorrow's date as YYYY-MM-DD — plans are for upcoming sessions
function tomorrowString() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export default function PlanModal({ clientName, onConfirm, onCancel }) {
  const [date, setDate] = useState(tomorrowString)
  const [scheme, setScheme] = useState('')
  const textareaRef = useRef(null)

  // Focus the textarea on open so the coach can start typing immediately
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Escape key closes the modal
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50"
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="bg-amber-dusk-darker rounded-t-2xl sm:rounded-xl p-6 border border-white/10 w-full sm:max-w-sm sm:mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-white font-semibold text-lg font-display">Plan Session</h2>
        <p className="text-white/50 text-sm mt-0.5 mb-4">{clientName}</p>

        <div className="mb-3">
          <label className="block text-white/50 text-xs mb-1.5">Planned date</label>
          {/* No max — future dates are the whole point of planning */}
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full bg-amber-dusk border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-flow-orange [color-scheme:dark]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white/50 text-xs mb-1.5">Workout scheme</label>
          <textarea
            ref={textareaRef}
            value={scheme}
            onChange={e => setScheme(e.target.value)}
            rows={4}
            placeholder="e.g. Back squat 3×5 @ 80%, RDL 3×8"
            className="w-full bg-amber-dusk border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-flow-orange resize-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              if (date && scheme.trim()) onConfirm(date, scheme.trim())
            }}
            disabled={!date || !scheme.trim()}
            className="flex-1 bg-flow-orange hover:bg-ember-drift disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
          >
            Save Plan
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white/70 font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
