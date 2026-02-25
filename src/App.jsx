import { useState, useEffect } from 'react'
import './index.css'
import { supabase } from './lib/supabase'
import LoginScreen from './components/LoginScreen'
import ClientCard from './components/ClientCard'
import AddClientForm from './components/AddClientForm'
import FilterBar from './components/FilterBar'
import StatsBar from './components/StatsBar'
import LogSessionModal from './components/LogSessionModal'
import SessionHistoryModal from './components/SessionHistoryModal'
import PlanModal from './components/PlanModal'
import ViewPlanModal from './components/ViewPlanModal'
import CompletePlanModal from './components/CompletePlanModal'

// Returns the most recent Sunday at midnight (used to count sessions this week).
function startOfWeek() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay())
  return d
}

// Maps a raw Supabase row (snake_case) to the camelCase shape all child
// components expect. Keeping this conversion in one place means the rest of
// the app is completely unchanged.
function rowToClient(row) {
  return {
    id: row.id,
    name: row.name,
    program: row.program,
    sessionsCompleted: row.sessions_completed,
    totalSessions: row.total_sessions,
    lastSession: row.last_session,
    sessions: row.sessions ?? [],
    plans: row.plans ?? [],
  }
}

function App() {
  // --- Auth state ---
  const [user, setUser] = useState(null)
  // authLoading prevents a flash of LoginScreen before the session is checked.
  const [authLoading, setAuthLoading] = useState(true)

  // --- Data state ---
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // --- UI state ---
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('All')
  const [logSessionModal, setLogSessionModal] = useState(null)
  const [historyModal, setHistoryModal] = useState(null)
  // planModal holds the client id whose plan creation form is open
  const [planModal, setPlanModal] = useState(null)
  // viewPlanModal holds { clientId, plan } when viewing a plan for reference
  const [viewPlanModal, setViewPlanModal] = useState(null)
  // completePlanModal holds { clientId, plan } when completing a plan
  const [completePlanModal, setCompletePlanModal] = useState(null)

  // ── Auth listener ────────────────────────────────────────────────────────
  // On mount: check for an existing session, then subscribe to any changes
  // (sign-in / sign-out). Cleans up the subscription on unmount.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── Data fetch ───────────────────────────────────────────────────────────
  // Re-runs whenever the logged-in user changes.
  // Fetches all clients that belong to this user (RLS enforces ownership).
  useEffect(() => {
    if (!user) {
      setClients([])
      return
    }

    async function fetchClients() {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at')

      if (error) {
        setError('Failed to load clients: ' + error.message)
      } else {
        setClients(data.map(rowToClient))
      }
      setLoading(false)
    }

    fetchClients()
  }, [user])

  // ── Derived stats ────────────────────────────────────────────────────────
  const weekStart = startOfWeek()

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.sessionsCompleted < c.totalSessions).length,
    sessionsThisWeek: clients.reduce(
      (sum, c) => sum + c.sessions.filter(s => new Date(s.date) >= weekStart).length,
      0
    ),
  }

  const visibleClients = clients.filter(c => {
    if (filter === 'Active') return c.sessionsCompleted < c.totalSessions
    if (filter === 'Complete') return c.sessionsCompleted >= c.totalSessions
    return true
  })

  // ── Data operations ──────────────────────────────────────────────────────

  async function handleAddClient(newClient) {
    setError(null)
    const { data, error } = await supabase
      .from('clients')
      .insert({
        user_id: user.id,
        name: newClient.name,
        program: newClient.program,
        sessions_completed: 0,
        total_sessions: newClient.totalSessions,
        sessions: [],
      })
      .select()
      .single()

    if (error) {
      setError('Failed to add client: ' + error.message)
    } else {
      setClients(prev => [...prev, rowToClient(data)])
      setShowForm(false)
    }
  }

  async function handleDeleteClient(id) {
    setError(null)
    const { error } = await supabase.from('clients').delete().eq('id', id)

    if (error) {
      setError('Failed to delete client: ' + error.message)
    } else {
      setClients(prev => prev.filter(c => c.id !== id))
    }
  }

  async function handleLogSession(id, note, date) {
    const client = clients.find(c => c.id === id)
    if (!client) return

    // Use the date chosen in the modal (YYYY-MM-DD). Convert to a full ISO
    // timestamp at noon local time so sorting stays intuitive.
    const sessionDate = date
      ? new Date(date + 'T12:00:00').toISOString()
      : new Date().toISOString()
    const now = new Date().toISOString()

    const updatedSessions = [...client.sessions, { id: Date.now(), date: sessionDate, note: note ?? '' }]
    const updatedCompleted = client.sessionsCompleted + 1

    // last_session should always reflect the most recent session date
    const lastSession = updatedSessions.reduce((latest, s) =>
      s.date > latest ? s.date : latest, ''
    )

    setError(null)
    const { data, error } = await supabase
      .from('clients')
      .update({
        sessions_completed: updatedCompleted,
        last_session: lastSession,
        sessions: updatedSessions,
        updated_at: now,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      setError('Failed to log session: ' + error.message)
    } else {
      setClients(prev => prev.map(c => (c.id === id ? rowToClient(data) : c)))
      setLogSessionModal(null)
    }
  }

  async function handleDeleteSession(clientId, sessionId) {
    const client = clients.find(c => c.id === clientId)
    if (!client) return

    const updatedSessions = client.sessions.filter(s => s.id !== sessionId)
    const updatedCompleted = Math.max(0, client.sessionsCompleted - 1)
    const lastSession = updatedSessions.length > 0
      ? updatedSessions.reduce((latest, s) => s.date > latest ? s.date : latest, '')
      : null
    const now = new Date().toISOString()

    setError(null)
    const { data, error } = await supabase
      .from('clients')
      .update({
        sessions_completed: updatedCompleted,
        last_session: lastSession,
        sessions: updatedSessions,
        updated_at: now,
      })
      .eq('id', clientId)
      .select()
      .single()

    if (error) {
      setError('Failed to delete session: ' + error.message)
    } else {
      setClients(prev => prev.map(c => (c.id === clientId ? rowToClient(data) : c)))
    }
  }

  // ── Plan operations ───────────────────────────────────────────────────────

  async function handleAddPlan(clientId, date, scheme) {
    const client = clients.find(c => c.id === clientId)
    if (!client) return

    // Store at noon local time so the date doesn't shift when displayed
    const newPlan = {
      id: Date.now(),
      date: new Date(date + 'T12:00:00').toISOString(),
      scheme,
    }
    const updatedPlans = [...client.plans, newPlan]
    const now = new Date().toISOString()

    setError(null)
    const { data, error } = await supabase
      .from('clients')
      .update({ plans: updatedPlans, updated_at: now })
      .eq('id', clientId)
      .select()
      .single()

    if (error) {
      setError('Failed to save plan: ' + error.message)
    } else {
      setClients(prev => prev.map(c => (c.id === clientId ? rowToClient(data) : c)))
      setPlanModal(null)
    }
  }

  async function handleCompletePlan(clientId, planId, date, note) {
    const client = clients.find(c => c.id === clientId)
    if (!client) return

    const sessionDate = new Date(date + 'T12:00:00').toISOString()
    const now = new Date().toISOString()

    // Remove the completed plan and add the new session entry.
    // Save the scheme onto the session so it can be referenced in history.
    const plan = client.plans.find(p => p.id === planId)
    const updatedPlans = client.plans.filter(p => p.id !== planId)
    const updatedSessions = [...client.sessions, { id: Date.now(), date: sessionDate, note: note ?? '', scheme: plan?.scheme ?? '' }]
    const updatedCompleted = client.sessionsCompleted + 1

    // last_session should always reflect the most recent session date
    const lastSession = updatedSessions.reduce((latest, s) =>
      s.date > latest ? s.date : latest, ''
    )

    setError(null)
    const { data, error } = await supabase
      .from('clients')
      .update({
        plans: updatedPlans,
        sessions: updatedSessions,
        sessions_completed: updatedCompleted,
        last_session: lastSession,
        updated_at: now,
      })
      .eq('id', clientId)
      .select()
      .single()

    if (error) {
      setError('Failed to complete session: ' + error.message)
    } else {
      setClients(prev => prev.map(c => (c.id === clientId ? rowToClient(data) : c)))
      setCompletePlanModal(null)
    }
  }

  async function handleDeletePlan(clientId, planId) {
    const client = clients.find(c => c.id === clientId)
    if (!client) return

    const updatedPlans = client.plans.filter(p => p.id !== planId)
    const now = new Date().toISOString()

    setError(null)
    const { data, error } = await supabase
      .from('clients')
      .update({ plans: updatedPlans, updated_at: now })
      .eq('id', clientId)
      .select()
      .single()

    if (error) {
      setError('Failed to delete plan: ' + error.message)
    } else {
      setClients(prev => prev.map(c => (c.id === clientId ? rowToClient(data) : c)))
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    // onAuthStateChange will fire and set user → null, which clears clients too.
  }

  // ── Render guards ────────────────────────────────────────────────────────

  // Show a minimal loader while we confirm whether a session exists.
  // This prevents a flash of the login screen on every refresh.
  if (authLoading) {
    return (
      <div className="min-h-screen bg-amber-dusk flex items-center justify-center">
        <p className="text-white/40 text-sm font-sans">Loading…</p>
      </div>
    )
  }

  // No session → show branded login screen.
  if (!user) {
    return <LoginScreen />
  }

  // ── Main app ─────────────────────────────────────────────────────────────
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
          <div className="flex items-center gap-3">
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-flow-orange hover:bg-ember-drift text-white font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
              >
                + New Client
              </button>
            )}
            {/* Sign out — small and unobtrusive since this is a personal tool */}
            <button
              onClick={handleSignOut}
              className="text-white/30 hover:text-white/60 text-xs font-sans transition-colors"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Global error banner */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <StatsBar {...stats} />

        <FilterBar current={filter} onChange={setFilter} />

        <div className="flex flex-col gap-4 mt-4">
          {showForm && (
            <AddClientForm
              onAdd={handleAddClient}
              onCancel={() => setShowForm(false)}
            />
          )}

          {/* Loading state while fetching clients */}
          {loading && (
            <p className="text-white/30 text-sm text-center py-8 font-sans">Loading clients…</p>
          )}

          {!loading && visibleClients.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              onLogSession={() => setLogSessionModal(client.id)}
              onViewHistory={() => setHistoryModal(client.id)}
              onDelete={() => handleDeleteClient(client.id)}
              plans={client.plans}
              onAddPlan={() => setPlanModal(client.id)}
              onViewPlan={planId => setViewPlanModal({ clientId: client.id, plan: client.plans.find(p => p.id === planId) })}
              onCompletePlan={planId => setCompletePlanModal({ clientId: client.id, plan: client.plans.find(p => p.id === planId) })}
              onDeletePlan={planId => handleDeletePlan(client.id, planId)}
            />
          ))}
        </div>
      </div>

      {logSessionModal !== null && logSessionClient && (
        <LogSessionModal
          clientName={logSessionClient.name}
          onConfirm={(note, date) => handleLogSession(logSessionModal, note, date)}
          onCancel={() => setLogSessionModal(null)}
        />
      )}

      {historyModal !== null && historyClient && (
        <SessionHistoryModal
          clientName={historyClient.name}
          sessions={historyClient.sessions}
          onClose={() => setHistoryModal(null)}
          onDeleteSession={sessionId => handleDeleteSession(historyModal, sessionId)}
        />
      )}

      {planModal !== null && (
        <PlanModal
          clientName={clients.find(c => c.id === planModal)?.name ?? ''}
          onConfirm={(date, scheme) => handleAddPlan(planModal, date, scheme)}
          onCancel={() => setPlanModal(null)}
        />
      )}

      {viewPlanModal !== null && (
        <ViewPlanModal
          clientName={clients.find(c => c.id === viewPlanModal.clientId)?.name ?? ''}
          plan={viewPlanModal.plan}
          onComplete={() => {
            // Transition from view → complete without losing the plan context
            setCompletePlanModal(viewPlanModal)
            setViewPlanModal(null)
          }}
          onClose={() => setViewPlanModal(null)}
        />
      )}

      {completePlanModal !== null && (
        <CompletePlanModal
          clientName={clients.find(c => c.id === completePlanModal.clientId)?.name ?? ''}
          plan={completePlanModal.plan}
          onConfirm={(date, note) => handleCompletePlan(completePlanModal.clientId, completePlanModal.plan.id, date, note)}
          onCancel={() => setCompletePlanModal(null)}
        />
      )}
    </div>
  )
}

export default App
