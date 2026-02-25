import { useEffect } from 'react'

export default function SessionHistoryModal({ clientName, sessions, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const sorted = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-amber-dusk-darker rounded-xl p-6 border border-white/10 w-full max-w-md mx-4">
        <h2 className="text-white font-semibold text-lg font-display">Session History</h2>
        <p className="text-white/50 text-sm mt-0.5 mb-4">{clientName}</p>

        <div className="max-h-80 overflow-y-auto">
          {sorted.length === 0 ? (
            <p className="text-white/40 text-sm text-center py-4">No sessions logged yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {sorted.map(session => (
                <li key={session.id} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                  <p className="text-sm text-white font-semibold">
                    {new Date(session.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  {session.note && (
                    <p className="text-sm text-white/50 mt-0.5">{session.note}</p>
                  )}
                </li>
              ))}
            </ul>
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
