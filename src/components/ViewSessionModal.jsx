import { useEffect } from 'react'

export default function ViewSessionModal({ clientName, session, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const formattedDate = new Date(session.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-[60]"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-amber-dusk-darker rounded-t-2xl sm:rounded-xl p-6 border border-white/10 w-full sm:max-w-sm sm:mx-4 max-h-[90vh] overflow-y-auto">
        <p className="text-flow-orange text-xs font-semibold uppercase tracking-wide">{formattedDate}</p>
        <h2 className="text-white font-semibold text-lg font-display mt-0.5 mb-4">{clientName}</h2>

        {session.scheme && (
          <div className="bg-amber-dusk rounded-lg px-4 py-4 border border-white/10 mb-3">
            <p className="text-white/40 text-xs uppercase tracking-wide mb-2">Workout scheme</p>
            <p className="text-white text-base leading-relaxed whitespace-pre-wrap">{session.scheme}</p>
          </div>
        )}

        <div className="bg-amber-dusk rounded-lg px-4 py-4 border border-white/10">
          <p className="text-white/40 text-xs uppercase tracking-wide mb-2">Key takeaways</p>
          {session.note ? (
            <p className="text-white text-base leading-relaxed whitespace-pre-wrap">{session.note}</p>
          ) : (
            <p className="text-white/30 text-sm italic">No notes recorded.</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white/70 font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
