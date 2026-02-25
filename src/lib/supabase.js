import { createClient } from '@supabase/supabase-js'

// Single shared Supabase client for the whole app.
// Vite only exposes env vars prefixed with VITE_ to the browser bundle.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
