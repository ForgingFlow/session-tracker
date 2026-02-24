import { useState, useEffect } from 'react'
import './index.css'
import ClientCard from './components/ClientCard'
import AddClientForm from './components/AddClientForm'
import FilterBar from './components/FilterBar'
import StatsBar from './components/StatsBar'

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
    sessionDates: [
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    ],
  },
  {
    id: 2,
    name: 'James Okafor',
    program: 'Movement Fundamentals',
    sessionsCompleted: 3,
    totalSessions: 8,
    lastSession: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    sessionDates: [
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    ],
  },
  {
    id: 3,
    name: 'Priya Sharma',
    program: '12-Week Foundation',
    sessionsCompleted: 12,
    totalSessions: 12,
    lastSession: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    sessionDates: [],
  },
]

function App() {
  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem('session-tracker-clients')
      return saved ? JSON.parse(saved) : SAMPLE_CLIENTS
    } catch {
      return SAMPLE_CLIENTS
    }
  })
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    localStorage.setItem('session-tracker-clients', JSON.stringify(clients))
  }, [clients])

  const weekStart = startOfWeek()

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.sessionsCompleted < c.totalSessions).length,
    sessionsThisWeek: clients.reduce((sum, c) =>
      sum + c.sessionDates.filter(d => new Date(d) >= weekStart).length, 0
    ),
  }

  const visibleClients = clients.filter(c => {
    if (filter === 'Active') return c.sessionsCompleted < c.totalSessions
    if (filter === 'Complete') return c.sessionsCompleted >= c.totalSessions
    return true
  })

  function handleAddClient(newClient) {
    setClients(prev => [...prev, { ...newClient, sessionDates: [] }])
    setShowForm(false)
  }

  function handleDeleteClient(id) {
    setClients(prev => prev.filter(c => c.id !== id))
  }

  function handleLogSession(id) {
    const now = new Date().toISOString()
    setClients(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              sessionsCompleted: c.sessionsCompleted + 1,
              lastSession: now,
              sessionDates: [...c.sessionDates, now],
            }
          : c
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Session Tracker</h1>
            <p className="text-gray-400 text-sm mt-1">Movement coaching client progress</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg px-4 py-2 text-sm transition-colors"
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
              onLogSession={() => handleLogSession(client.id)}
              onDelete={() => handleDeleteClient(client.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
