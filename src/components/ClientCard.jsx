function daysSince(dateString) {
  if (!dateString) return null
  const diff = Date.now() - new Date(dateString).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export default function ClientCard({ client, onLogSession, onDelete }) {
  const { name, program, sessionsCompleted, totalSessions, lastSession } = client
  const progress = totalSessions > 0 ? (sessionsCompleted / totalSessions) * 100 : 0
  const isComplete = sessionsCompleted >= totalSessions
  const days = daysSince(lastSession)

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-white font-semibold text-lg leading-tight">{name}</h2>
          <p className="text-gray-400 text-sm mt-0.5">{program}</p>
        </div>
        <div className="flex items-center gap-2">
          {isComplete && (
            <span className="text-xs font-medium bg-emerald-900/50 text-emerald-400 border border-emerald-800 rounded-full px-2.5 py-0.5">
              Complete
            </span>
          )}
          <button
            onClick={onDelete}
            aria-label="Delete client"
            className="text-gray-600 hover:text-red-400 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>{sessionsCompleted} / {totalSessions} sessions</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              backgroundColor: isComplete ? '#10b981' : '#34d399',
            }}
          />
        </div>
      </div>

      {/* Footer: last session + action button */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {days === null
            ? 'No sessions logged yet'
            : days === 0
            ? 'Last session: today'
            : days === 1
            ? 'Last session: yesterday'
            : `Last session: ${days} days ago`}
        </p>
        {!isComplete && (
          <button
            onClick={onLogSession}
            className="text-xs font-medium bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-400 border border-emerald-800 rounded-lg px-3 py-1 transition-colors"
          >
            + Session
          </button>
        )}
      </div>
    </div>
  )
}
