export default function StatsBar({ total, active, sessionsThisWeek }) {
  const stats = [
    { label: 'Total Clients', value: total },
    { label: 'Active', value: active },
    { label: 'This Week', value: sessionsThisWeek },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map(({ label, value }) => (
        <div key={label} className="bg-gray-900 rounded-xl px-4 py-3 border border-gray-800 text-center">
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-gray-400 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  )
}
