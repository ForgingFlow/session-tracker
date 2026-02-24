const FILTERS = ['All', 'Active', 'Complete']

export default function FilterBar({ current, onChange }) {
  return (
    <div className="flex gap-1 bg-gray-900 rounded-lg p-1 w-fit">
      {FILTERS.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            current === f
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
