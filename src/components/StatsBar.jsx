export default function StatsBar({ total, active, sessionsThisWeek }) {
  const stats = [
    { label: 'Total Clients', value: total },
    { label: 'Active', value: active },
    { label: 'This Week', value: sessionsThisWeek },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map(({ label, value }) => (
        <div
          key={label}
          className="bg-amber-dusk-darker rounded-xl px-4 py-3 border border-white/10 text-center"
        >
          {/* Stat number in Flow Orange for brand impact */}
          <p className="text-2xl font-semibold text-flow-orange">{value}</p>
          <p className="text-xs text-white/50 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  )
}
