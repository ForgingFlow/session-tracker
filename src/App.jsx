import { useState, useEffect } from 'react'
import './index.css'
import ClientCard from './components/ClientCard'
import AddClientForm from './components/AddClientForm'
import FilterBar from './components/FilterBar'
import StatsBar from './components/StatsBar'
import LogSessionModal from './components/LogSessionModal'
import SessionHistoryModal from './components/SessionHistoryModal'

function startOfWeek() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay()) // Sunday
  return d
}

const SAMPLE_CLIENTS = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    program: '12-Week Foundation',
    sessionsCompleted: 8,
    totalSessions: 12,
    lastSession: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sessions: [
      { id: 1, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), note: '' },
      { id: 2, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), note: '' },
    ],
  },
  {
    id: 2,
    name: 'James Okafor',
    program: 'Movement Fundamentals',
    sessionsCompleted: 3,
    totalSessions: 8,
    lastSession: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    sessions: [
      { id: 3, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), note: '' },
    ],
  },
  {
    id: 3,
    name: 'Priya Sharma',
    program: '12-Week Foundation',
    sessionsCompleted: 12,
    totalSessions: 12,
    lastSession: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    sessions: [],
  },
]

function App() {
  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem('session-tracker-clients')
      if (!saved) return SAMPLE_CLIENTS
      const parsed = JSON.parse(saved)
      return parsed.map(c => {
        if (c.sessions) return c
        return {
          ...c,
          sessions: (c.sessionDates ?? []).map(d => ({ id: new Date(d).getTime(), date: d, note: '' })),
          sessionDates: undefined,
        }
      })
    } catch {
      return SAMPLE_CLIENTS
    }
  })
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('All')
  const [logSessionModal, setLogSessionModal] = useState(null)
  const [historyModal, setHistoryModal] = useState(null)

  useEffect(() => {
    localStorage.setItem('session-tracker-clients', JSON.stringify(clients))
  }, [clients])

  const weekStart = startOfWeek()

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.sessionsCompleted < c.totalSessions).length,
    sessionsThisWeek: clients.reduce((sum, c) =>
      sum + c.sessions.filter(s => new Date(s.date) >= weekStart).length, 0
    ),
  }

  const visibleClients = clients.filter(c => {
    if (filter === 'Active') return c.sessionsCompleted < c.totalSessions
    if (filter === 'Complete') return c.sessionsCompleted >= c.totalSessions
    return true
  })

  function handleAddClient(newClient) {
    setClients(prev => [...prev, { ...newClient, sessions: [] }])
    setShowForm(false)
  }

  function handleDeleteClient(id) {
    setClients(prev => prev.filter(c => c.id !== id))
  }

  function handleLogSession(id, note) {
    const now = new Date().toISOString()
    setClients(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              sessionsCompleted: c.sessionsCompleted + 1,
              lastSession: now,
              sessions: [...c.sessions, { id: Date.now(), date: now, note: note ?? '' }],
            }
          : c
      )
    )
    setLogSessionModal(null)
  }

  const logSessionClient = clients.find(c => c.id === logSessionModal)
  const historyClient = clients.find(c => c.id === historyModal)

  return (
    <div className="min-h-screen bg-amber-dusk text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <img
              src="/images/FF_InlineWithLogo.png"
              alt="ForgingFlow"
              className="h-8"
            />
            <p className="text-white/50 text-sm mt-1.5 font-sans">
              Movement coaching client progress
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-flow-orange hover:bg-ember-drift text-white font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
            >
              + New Client
            </button>
          )}
        </header>

        <StatsBar {...stats} />

        <FilterBar current={filter} onChange={setFilter} />

        <div className="flex flex-col gap-4 mt-4">
          {showForm && (
            <AddClientForm
              onAdd={handleAddClient}
              onCancel={() => setShowForm(false)}
            />
          )}
          {visibleClients.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              onLogSession={() => setLogSessionModal(client.id)}
              onViewHistory={() => setHistoryModal(client.id)}
              onDelete={() => handleDeleteClient(client.id)}
            />
          ))}
        </div>
      </div>

      {logSessionModal !== null && logSessionClient && (
        <LogSessionModal
          clientName={logSessionClient.name}
          onConfirm={note => handleLogSession(logSessionModal, note)}
          onCancel={() => setLogSessionModal(null)}
        />
      )}

      {historyModal !== null && historyClient && (
        <SessionHistoryModal
          clientName={historyClient.name}
          sessions={historyClient.sessions}
          onClose={() => setHistoryModal(null)}
        />
      )}
    </div>
  )
}

export default App
