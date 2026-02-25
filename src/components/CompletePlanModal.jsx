import { useState, useEffect } from 'react'

export default function CompletePlanModal({ clientName, plan, onConfirm, onCancel }) {
  // Pre-fill date from the plan but let the coach adjust if the session ran on a different day
  const [date, setDate] = useState(plan.date.slice(0, 10))
  const [note, setNote] = useState('')

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
      className="fixed inset-0 bg-black/70 flex flex-col sm:flex-row sm:items-center sm:justify-center z-50"
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="bg-amber-dusk-darker rounded-t-2xl sm:rounded-xl p-6 border border-white/10 w-full sm:max-w-sm sm:mx-4 max-h-[90vh] overflow-y-auto mt-auto sm:mt-0">
        <h2 className="text-white font-semibold text-lg font-display">Complete Session</h2>
        <p className="text-white/50 text-sm mt-0.5 mb-4">{clientName}</p>

        {/* Read-only planned scheme shown as a dim reference block */}
        <div className="mb-4 bg-amber-dusk rounded-lg px-3 py-2.5 border border-white/10">
          <p className="text-white/35 text-xs mb-1 uppercase tracking-wide">Planned scheme</p>
          <p className="text-white/55 text-sm whitespace-pre-wrap">{plan.scheme}</p>
        </div>

        <div className="mb-3">
          <label className="block text-white/50 text-xs mb-1.5">Session date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
            className="w-full bg-amber-dusk border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-flow-orange [color-scheme:dark]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white/50 text-xs mb-1.5">Key takeaways (becomes session note)</label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={4}
            placeholder="How did it go? Any PRs, adjustments, notes…"
            className="w-full bg-amber-dusk border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-flow-orange resize-none"
            autoFocus
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onConfirm(date, note.trim())}
            disabled={!date}
            className="flex-1 bg-flow-orange hover:bg-ember-drift disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
          >
            Complete Session
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
