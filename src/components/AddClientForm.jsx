import { useState, useRef, useEffect } from 'react'

const PROGRAMS = [
  '12-Week Foundation',
  'Movement Fundamentals',
  'Custom Program',
  'Single Session',
]

export default function AddClientForm({ onAdd, onCancel }) {
  const [name, setName] = useState('')
  const [program, setProgram] = useState(PROGRAMS[0])
  const [totalSessions, setTotalSessions] = useState(12)
  const nameRef = useRef(null)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({
      id: Date.now(),
      name: name.trim(),
      program,
      totalSessions: Number(totalSessions),
      sessionsCompleted: 0,
      lastSession: null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-5 border border-gray-700">
      <h2 className="text-white font-semibold text-lg mb-4">New Client</h2>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Name</label>
          <input
            ref={nameRef}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Client name"
            required
            className="w-full bg-gray-800 text-white placeholder-gray-600 rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Program</label>
          <select
            value={program}
            onChange={e => setProgram(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-emerald-500"
          >
            {PROGRAMS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Total Sessions</label>
          <input
            type="number"
            value={totalSessions}
            onChange={e => setTotalSessions(e.target.value)}
            min={1}
            max={52}
            required
            className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          type="submit"
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg py-2 text-sm transition-colors"
        >
          Add Client
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg py-2 text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
