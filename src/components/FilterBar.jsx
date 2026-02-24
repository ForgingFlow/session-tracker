const FILTERS = ['All', 'Active', 'Complete']

export default function FilterBar({ current, onChange }) {
  return (
    <div className="flex gap-1 bg-amber-dusk-darker rounded-lg p-1 w-fit border border-white/10">
      {FILTERS.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
            current === f
              ? 'bg-flow-orange text-white'
              : 'text-white/50 hover:text-white'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
