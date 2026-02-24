function daysSince(dateString) {
  if (!dateString) return null
  const diff = Date.now() - new Date(dateString).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export default function ClientCard({ client, onLogSession, onViewHistory, onDelete }) {
  const { name, program, sessionsCompleted, totalSessions, lastSession } = client
  const progress = totalSessions > 0 ? (sessionsCompleted / totalSessions) * 100 : 0
  const isComplete = sessionsCompleted >= totalSessions
  const days = daysSince(lastSession)

  return (
    <div className="bg-amber-dusk-darker rounded-xl p-5 border border-white/10">

      {/* Client name, program, and action icons */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-white font-semibold text-lg leading-tight font-display">{name}</h2>
          <p className="text-white/50 text-sm mt-0.5">{program}</p>
        </div>
        <div className="flex items-center gap-2">
          {isComplete && (
            // Flow Blue badge for complete clients — distinct from the orange accent
            <span className="text-xs font-semibold bg-flow-blue-darker text-flow-blue border border-flow-blue/30 rounded-full px-2.5 py-0.5">
              Complete
            </span>
          )}
          <button
            onClick={onDelete}
            aria-label="Delete client"
            className="text-white/30 hover:text-red-400 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-white/50 mb-1.5">
          <span>{sessionsCompleted} / {totalSessions} sessions</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-amber-dusk rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              // Brand gradient on the progress bar
              background: isComplete
                ? '#FF6919'
                : 'linear-gradient(135deg, #FF6919, #993F0F)',
            }}
          />
        </div>
      </div>

      {/* Footer: last session timestamp + History / + Session buttons */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/40">
          {days === null
            ? 'No sessions logged yet'
            : days === 0
            ? 'Last session: today'
            : days === 1
            ? 'Last session: yesterday'
            : `Last session: ${days} days ago`}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={onViewHistory}
            className="text-xs text-white/40 hover:text-white/80 transition-colors"
          >
            History
          </button>
          {!isComplete && (
            <button
              onClick={onLogSession}
              className="text-xs font-semibold bg-flow-orange/15 hover:bg-flow-orange/25 text-flow-orange border border-flow-orange/30 rounded-lg px-3 py-1 transition-colors"
            >
              + Session
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
