import { useEffect } from 'react'

// Format ISO date to a readable string, e.g. "Friday, Feb 28"
function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

export default function ViewPlanModal({ clientName, plan, onComplete, onClose }) {
  // Escape key closes the modal
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-amber-dusk-darker rounded-t-2xl sm:rounded-xl p-6 border border-white/10 w-full sm:max-w-sm sm:mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-1">
          <p className="text-flow-orange text-xs font-semibold uppercase tracking-wide">
            {formatDate(plan.date)}
          </p>
          <h2 className="text-white font-semibold text-lg font-display mt-0.5">{clientName}</h2>
        </div>

        {/* Scheme — large and readable for on-call reference */}
        <div className="mt-4 mb-6 bg-amber-dusk rounded-lg px-4 py-4 border border-white/10">
          <p className="text-white/40 text-xs uppercase tracking-wide mb-2">Workout scheme</p>
          <p className="text-white text-base leading-relaxed whitespace-pre-wrap">{plan.scheme}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onComplete}
            className="flex-1 bg-flow-orange hover:bg-ember-drift text-white font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
          >
            Complete Session
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white/70 font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
