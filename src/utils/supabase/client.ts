import { createBrowserClient } from '@supabase/ssr'

// Create a singleton Supabase client for the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and/or anonymous key are not defined')
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
