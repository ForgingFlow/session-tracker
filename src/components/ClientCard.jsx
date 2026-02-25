function daysSince(dateString) {
  if (!dateString) return null
  const diff = Date.now() - new Date(dateString).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

// Format ISO date to a short readable string, e.g. "Feb 28"
function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function ClientCard({
  client,
  onLogSession,
  onViewHistory,
  onDelete,
  // Plan props
  plans = [],
  onAddPlan,
  onViewPlan,
  onCompletePlan,
  onDeletePlan,
}) {
  const { name, program, sessionsCompleted, totalSessions, lastSession } = client
  const progress = totalSessions > 0 ? (sessionsCompleted / totalSessions) * 100 : 0
  const isComplete = sessionsCompleted >= totalSessions
  const days = daysSince(lastSession)

  // Sort plans ascending so the soonest upcoming session appears first
  const sortedPlans = [...plans].sort((a, b) => a.date.localeCompare(b.date))

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

      {/* Upcoming plans — only shown when at least one plan exists */}
      {sortedPlans.length > 0 && (
        <div className="mt-3 flex flex-col gap-1.5">
          {sortedPlans.map(plan => (
            <div
              key={plan.id}
              className="flex items-center justify-between bg-amber-dusk rounded-lg px-3 py-2 gap-2"
            >
              {/* Clickable area — opens the full plan view for on-call reference */}
              <button
                onClick={() => onViewPlan(plan.id)}
                className="flex items-center gap-2 min-w-0 flex-1 text-left"
              >
                <span className="text-flow-orange text-xs shrink-0">{formatDate(plan.date)}</span>
                <span className="truncate text-white/50 text-xs">{plan.scheme}</span>
              </button>

              {/* Delete */}
              <button
                onClick={() => onDeletePlan(plan.id)}
                aria-label="Delete plan"
                className="text-white/25 hover:text-red-400 transition-colors text-base leading-none shrink-0"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer: timestamp above, then full-width action buttons for easy tapping */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <p className="text-xs text-white/40 mb-2.5">
          {days === null
            ? 'No sessions logged yet'
            : days === 0
            ? 'Last session: today'
            : days === 1
            ? 'Last session: yesterday'
            : `Last session: ${days} days ago`}
        </p>
        <div className="flex gap-2">
          <button
            onClick={onAddPlan}
            className="flex-1 py-2 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            + Plan
          </button>
          <button
            onClick={onViewHistory}
            className="flex-1 py-2 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            History
          </button>
          {!isComplete && (
            <button
              onClick={onLogSession}
              className="flex-1 py-2 text-xs font-semibold bg-flow-orange/15 hover:bg-flow-orange/25 text-flow-orange border border-flow-orange/30 rounded-lg transition-colors"
            >
              + Session
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
