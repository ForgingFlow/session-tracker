import { useState, useEffect } from 'react'
import ViewSessionModal from './ViewSessionModal'

export default function SessionHistoryModal({ clientName, sessions, onClose, onDeleteSession }) {
  const [viewSession, setViewSession] = useState(null)

  useEffect(() => {
    function handleKeyDown(e) {
      // Only close the history modal if the detail modal isn't open
      if (e.key === 'Escape' && !viewSession) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, viewSession])

  const sorted = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50"
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <div className="bg-amber-dusk-darker rounded-t-2xl sm:rounded-xl p-6 border border-white/10 w-full sm:max-w-md sm:mx-4 max-h-[90vh] overflow-y-auto">
          <h2 className="text-white font-semibold text-lg font-display">Session History</h2>
          <p className="text-white/50 text-sm mt-0.5 mb-4">{clientName}</p>

          <div>
            {sorted.length === 0 ? (
              <p className="text-white/40 text-sm text-center py-4">No sessions logged yet.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {sorted.map(session => (
                  <li key={session.id} className="flex items-start justify-between gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    {/* Clickable row opens the detail modal */}
                    <button
                      onClick={() => setViewSession(session)}
                      className="flex-1 text-left group"
                    >
                      <p className="text-sm text-white font-semibold group-hover:text-flow-orange transition-colors">
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
                    </button>
                    {onDeleteSession && (
                      <button
                        onClick={() => onDeleteSession(session.id)}
                        title="Delete session"
                        className="text-white/20 hover:text-red-400 text-lg leading-none transition-colors shrink-0 mt-0.5"
                      >
                        ×
                      </button>
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

      {viewSession && (
        <ViewSessionModal
          clientName={clientName}
          session={viewSession}
          onClose={() => setViewSession(null)}
        />
      )}
    </>
  )
}
