const FILTERS = ['All', 'Active', 'Complete']

export default function FilterBar({ current, onChange }) {
  return (
    <div className="flex gap-1 bg-amber-dusk-darker rounded-lg p-1 w-full sm:w-fit border border-white/10">
      {FILTERS.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
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
