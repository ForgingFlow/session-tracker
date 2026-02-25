import { useState } from 'react'
import { supabase } from '../lib/supabase'

// Full-screen branded login / sign-up screen.
// Shown whenever there is no active Supabase session.
export default function LoginScreen() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)
    setLoading(true)

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      // On success, App.jsx auth listener will update state — no extra work needed here.
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        // Some Supabase projects require email confirmation; show a helpful message.
        setSuccessMsg('Account created! Check your email to confirm, then sign in.')
        setMode('signin')
      }
    }

    setLoading(false)
  }

  const isSignIn = mode === 'signin'

  return (
    <div className="min-h-screen bg-amber-dusk flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-8 text-center">
          <img
            src="/images/FF_InlineWithLogo.png"
            alt="ForgingFlow"
            className="h-9 mx-auto"
          />
        </div>

        {/* Card */}
        <div className="bg-amber-dusk-darker rounded-2xl p-8">
          <h1 className="font-display text-xl text-white mb-6">
            {isSignIn ? 'Sign in to your account' : 'Create your account'}
          </h1>

          {/* Success message (after sign-up) */}
          {successMsg && (
            <p className="text-sm text-green-400 bg-green-400/10 rounded-lg px-4 py-3 mb-5">
              {successMsg}
            </p>
          )}

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-4 py-3 mb-5">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-white/60 text-xs font-sans mb-1.5" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-amber-dusk border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-flow-orange transition-colors"
              />
            </div>

            <div>
              <label className="block text-white/60 text-xs font-sans mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-amber-dusk border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-flow-orange transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-flow-orange hover:bg-ember-drift disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors mt-1"
            >
              {loading ? 'Please wait…' : isSignIn ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {/* Toggle between sign-in and sign-up */}
          <p className="text-white/40 text-xs text-center mt-6">
            {isSignIn ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => { setMode(isSignIn ? 'signup' : 'signin'); setError(null); setSuccessMsg(null) }}
              className="text-flow-orange hover:underline"
            >
              {isSignIn ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>

      </div>
    </div>
  )
}
