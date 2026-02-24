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
    <form onSubmit={handleSubmit} className="bg-amber-dusk-darker rounded-xl p-5 border border-white/10">
      <h2 className="text-white font-semibold text-lg mb-4 font-display">New Client</h2>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-white/60 mb-1.5">Name</label>
          <input
            ref={nameRef}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Client name"
            required
            className="w-full bg-amber-dusk text-white placeholder-white/25 rounded-lg px-3 py-2 text-sm border border-white/15 focus:outline-none focus:border-flow-orange"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1.5">Program</label>
          <select
            value={program}
            onChange={e => setProgram(e.target.value)}
            className="w-full bg-amber-dusk text-white rounded-lg px-3 py-2 text-sm border border-white/15 focus:outline-none focus:border-flow-orange"
          >
            {PROGRAMS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-1.5">Total Sessions</label>
          <input
            type="number"
            value={totalSessions}
            onChange={e => setTotalSessions(e.target.value)}
            min={1}
            max={52}
            required
            className="w-full bg-amber-dusk text-white rounded-lg px-3 py-2 text-sm border border-white/15 focus:outline-none focus:border-flow-orange"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          type="submit"
          className="flex-1 bg-flow-orange hover:bg-ember-drift text-white font-semibold rounded-lg py-2 text-sm transition-colors"
        >
          Add Client
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white/5 hover:bg-white/10 text-white/70 font-semibold rounded-lg py-2 text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
