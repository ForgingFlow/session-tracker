import { useState, useEffect, useRef } from 'react'

export default function LogSessionModal({ clientName, onConfirm, onCancel }) {
  const [note, setNote] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="bg-amber-dusk-darker rounded-xl p-6 border border-white/10 w-full max-w-sm mx-4">
        <h2 className="text-white font-semibold text-lg font-display">Log Session</h2>
        <p className="text-white/50 text-sm mt-0.5 mb-4">{clientName}</p>

        <textarea
          ref={textareaRef}
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={4}
          placeholder="Session notes (optional)"
          className="w-full bg-amber-dusk border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-flow-orange resize-none"
        />

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onConfirm(note.trim())}
            className="flex-1 bg-flow-orange hover:bg-ember-drift text-white font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
          >
            Log Session
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white/70 font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
